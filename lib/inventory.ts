import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { listings, getListingById } from '@/lib/listings';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Live credit inventory, backed by Supabase.
 *
 * `lib/listings.ts` carries a static `tonnesAvailable` per listing, which is
 * fine as a catalogue but cannot stop the same tonnes being sold twice. This
 * module holds the authoritative numbers and takes short-lived reservations so
 * two buyers checking out at once cannot both succeed.
 *
 * Until SUPABASE_* is set in Vercel, every function here falls back to the
 * static data and the site behaves exactly as it did before — no 500s, no
 * blocked checkouts. Same approach as Car Events Near Me's `dbEnabled`.
 */
export const inventoryEnabled = Boolean(URL && SERVICE);

/**
 * Listings Atlas can actually deliver.
 *
 * The catalogue in lib/listings.ts was seeded with well-known real-world
 * projects as illustration. Those are NOT credits Prime Origins holds, and on
 * 2026-09-15 one of them (Rimba Raya, po-006) was bought for real: 6 tCO2e,
 * paid, with a 48-hour retirement promise against a project whose Verra
 * account is suspended and which has no remaining supply.
 *
 * Nothing is saleable until it is listed here. Add an id only once the credits
 * behind it genuinely exist and can be retired on the registry.
 */
const SALEABLE_LISTING_IDS = new Set<string>([
  // e.g. 'po-025' once PNZ Carbon have confirmed issuance and documents
]);

export function isSaleable(listingId: string): boolean {
  return SALEABLE_LISTING_IDS.has(listingId);
}

// Next.js patches global fetch and will cache these reads in its persistent
// Data Cache, which survives redeploys. Stock that is cached is stock that is
// wrong, so force every read to hit the network.
const noStoreFetch: typeof fetch = (input, init) => fetch(input, { ...init, cache: 'no-store' });

function client(): SupabaseClient | null {
  if (!URL || !SERVICE) return null;
  return createClient(URL, SERVICE, {
    auth: { persistSession: false },
    global: { fetch: noStoreFetch }
  });
}

function staticAvailable(listingId: string): number {
  return getListingById(listingId)?.tonnesAvailable ?? 0;
}

/** Remaining tonnes a buyer could actually purchase right now. */
export async function getAvailable(listingId: string): Promise<{ available: number; live: boolean }> {
  // Not deliverable -> show nothing as available, whatever the catalogue says.
  if (!isSaleable(listingId)) return { available: 0, live: true };

  const db = client();
  if (!db) return { available: staticAvailable(listingId), live: false };

  const { data, error } = await db.rpc('available_tonnes', { p_listing_id: listingId });
  if (error || data === null || data === undefined) {
    if (error) console.error('[inventory] available_tonnes failed:', error.message);
    // Fall back rather than block a sale on a database hiccup.
    return { available: staticAvailable(listingId), live: false };
  }
  return { available: Number(data), live: true };
}

/**
 * Hold `tonnes` for this listing. Returns ok:false with the real remaining
 * figure when there isn't enough left, so the caller can tell the buyer.
 */
export async function reserve(
  reservationId: string,
  listingId: string,
  tonnes: number,
  ttlMinutes = 60
): Promise<{ ok: boolean; available: number; reason?: string; live: boolean }> {
  // Belt and braces: refuse at the point of sale too, not just in the UI.
  if (!isSaleable(listingId)) {
    return { ok: false, available: 0, reason: 'not_saleable', live: true };
  }

  const db = client();
  if (!db) {
    const available = staticAvailable(listingId);
    return { ok: tonnes <= available, available, reason: tonnes > available ? 'insufficient' : undefined, live: false };
  }

  const { data, error } = await db.rpc('reserve_tonnes', {
    p_id: reservationId,
    p_listing_id: listingId,
    p_tonnes: tonnes,
    p_ttl_minutes: ttlMinutes
  });

  if (error) {
    console.error('[inventory] reserve_tonnes failed:', error.message);
    // Do not block the sale on an infrastructure failure — log loudly instead.
    return { ok: true, available: staticAvailable(listingId), live: false };
  }

  const res = data as { ok: boolean; available: number; reason?: string };
  return { ok: Boolean(res?.ok), available: Number(res?.available ?? 0), reason: res?.reason, live: true };
}

/** Turn a hold into a sale. Idempotent — Stripe retries webhooks. */
export async function confirm(reservationId: string): Promise<{
  ok: boolean;
  alreadyConfirmed?: boolean;
  oversold?: boolean;
  expiredHold?: boolean;
  reason?: string;
}> {
  const db = client();
  if (!db) return { ok: false, reason: 'inventory_disabled' };

  const { data, error } = await db.rpc('confirm_reservation', { p_id: reservationId });
  if (error) {
    console.error('[inventory] confirm_reservation failed:', error.message);
    return { ok: false, reason: error.message };
  }
  const res = data as Record<string, unknown>;
  return {
    ok: Boolean(res?.ok),
    alreadyConfirmed: Boolean(res?.already_confirmed),
    oversold: Boolean(res?.oversold),
    expiredHold: Boolean(res?.expired_hold),
    reason: res?.reason as string | undefined
  };
}

/** Give tonnes back if we took a hold and then failed to create the session. */
export async function release(reservationId: string): Promise<void> {
  const db = client();
  if (!db) return;
  const { error } = await db.rpc('release_reservation', { p_id: reservationId });
  if (error) console.error('[inventory] release_reservation failed:', error.message);
}

/** Record the Stripe session against a hold, for tracing. Best effort. */
export async function attachSession(reservationId: string, sessionId: string): Promise<void> {
  const db = client();
  if (!db) return;
  const { error } = await db.from('reservations').update({ stripe_session_id: sessionId }).eq('id', reservationId);
  if (error) console.error('[inventory] attachSession failed:', error.message);
}

/**
 * Upsert every catalogue listing's total into `inventory`.
 * Deliberately does NOT touch tonnes_sold — re-running must never wipe sales.
 */
export async function syncFromCatalogue(): Promise<{ synced: number; errors: string[] }> {
  const db = client();
  if (!db) return { synced: 0, errors: ['inventory_disabled'] };

  const errors: string[] = [];
  let synced = 0;

  for (const l of listings) {
    const { error } = await db
      .from('inventory')
      .upsert({ listing_id: l.id, tonnes_total: l.tonnesAvailable, updated_at: new Date().toISOString() }, { onConflict: 'listing_id', ignoreDuplicates: false });
    if (error) errors.push(`${l.id}: ${error.message}`);
    else synced += 1;
  }

  return { synced, errors };
}
