import { NextResponse } from 'next/server';
import { syncFromCatalogue, inventoryEnabled } from '@/lib/inventory';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Seed or top up the inventory table from lib/listings.ts.
 *
 * Run once after creating the Supabase tables, and again whenever a listing is
 * added or its tonnage changes. Never resets tonnes_sold, so re-running cannot
 * wipe a sale.
 *
 * Guarded by CRON_SECRET:  /api/inventory/sync?secret=...
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const given = new URL(req.url).searchParams.get('secret');

  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET is not set, so this endpoint is disabled.' },
      { status: 503 }
    );
  }
  if (given !== secret) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  if (!inventoryEnabled) {
    return NextResponse.json(
      { error: 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' },
      { status: 503 }
    );
  }

  const result = await syncFromCatalogue();
  return NextResponse.json(result, { status: result.errors.length ? 207 : 200 });
}
