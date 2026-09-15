/**
 * Listings Atlas can actually deliver today.
 *
 * The catalogue in lib/listings.ts was seeded with well-known real-world
 * projects as illustration. Those are NOT credits Prime Origins holds, and on
 * 2026-09-15 one of them (Rimba Raya, po-006) was bought for real: 6 tCO2e,
 * paid for, against a project whose Verra account is suspended and which has
 * no remaining supply. That order had to be refunded.
 *
 * Nothing is card-payable until its id appears in this set. Add an id only
 * once the credits behind it genuinely exist and can be retired on the
 * registry: issuance confirmed, serial numbers held, documents on file.
 *
 * Everything NOT in this set still appears on the site and can still be sold,
 * but through the quote route: the buyer states volume, vintage and whether
 * they need retirement in their own name, Prime Origins sources it, and a firm
 * price with serial numbers is agreed in writing before any money moves. No
 * inventory risk, and nothing promised that cannot be delivered.
 *
 * This module has no dependencies on purpose, so it can be imported from
 * server components, route handlers and the browser bundle alike.
 */
export const SALEABLE_LISTING_IDS: ReadonlySet<string> = new Set<string>([
  // e.g. 'po-025' once PNZ Carbon have confirmed issuance and sent documents
]);

export function isSaleable(listingId: string): boolean {
  return SALEABLE_LISTING_IDS.has(listingId);
}

/** True when nothing at all is card-payable and the whole site is quote-only. */
export function isQuoteOnlyMode(): boolean {
  return SALEABLE_LISTING_IDS.size === 0;
}
