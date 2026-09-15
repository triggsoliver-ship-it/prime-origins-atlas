/**
 * What Atlas charges on top of the seller's price, and why that number.
 *
 * Stripe UK standard pricing, checked September 2026:
 *
 *   UK cards              1.5%  + 20p
 *   EEA cards             2.5%  + 20p
 *   International cards   3.25% + 20p
 *   Currency conversion  +2%
 *
 * The worst realistic case is an international card paying in GBP, which costs
 * 5.25% + 20p. The original 4% fee lost money on every one of those before a
 * penny of margin, and left nothing at all on domestic cards once sourcing
 * time was counted.
 *
 * 8% clears the worst case with roughly 2.75 points left, and sits at the
 * bottom of the 5-15% range carbon brokers normally take. On a £5,000 order
 * that is £400 gross, about £137 of which Stripe takes in the worst case.
 *
 * Change PLATFORM_FEE_RATE here and it changes everywhere: listing pages,
 * quote panels, Stripe checkout and the order emails all read from this file.
 */
export const PLATFORM_FEE_RATE = 0.08;

/** e.g. "Platform fee (8%)" — used in the UI and on the Stripe line item. */
export const PLATFORM_FEE_LABEL = `Platform fee (${formatPct(PLATFORM_FEE_RATE)})`;

export type Quote = {
  subtotal: number;
  fee: number;
  total: number;
};

/** Money maths in one place, so what is shown always matches what is charged. */
export function quoteFor(pricePerTonne: number, tonnes: number): Quote {
  const subtotal = round2(pricePerTonne * tonnes);
  const fee = round2(subtotal * PLATFORM_FEE_RATE);
  return { subtotal, fee, total: round2(subtotal + fee) };
}

/** The fee in pence, for the Stripe line item. */
export function feeInPence(pricePerTonne: number, tonnes: number): number {
  return Math.round(round2(pricePerTonne * tonnes) * PLATFORM_FEE_RATE * 100);
}

/**
 * Roughly what lands in the bank after Stripe, assuming the worst case card.
 * Used to sanity-check that a deal is actually profitable before quoting it.
 */
export function netAfterWorstCaseStripe(total: number): number {
  return round2(total - (total * 0.0525 + 0.2));
}

export function gbp(n: number): string {
  return `£${n.toFixed(2)}`;
}

function formatPct(rate: number): string {
  const pct = rate * 100;
  return `${Number.isInteger(pct) ? pct : pct.toFixed(1)}%`;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
