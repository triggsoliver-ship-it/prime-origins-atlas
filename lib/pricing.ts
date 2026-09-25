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
  return `£${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/* ------------------------------------------------------------------ *
 * The fee policy, in words, from the same constant the maths uses.
 *
 * /how-it-works used to say two different things: the seller section said
 * Atlas "charges 8% on credits sold", and the pricing section said the buyer
 * pays 8% on top. Those describe different commercial deals, and only one of
 * them is implemented.
 *
 * What app/api/checkout/route.ts actually does is build two Stripe line items
 * — the credits at the listed price × tonnes, and one platform fee line at 8%
 * of that subtotal. Nothing is deducted from the seller anywhere in the
 * codebase. So the implemented and intended policy is a single buyer-paid fee
 * added on top, and the seller wording was the bug.
 *
 * Every public statement about the fee reads from here.
 * ------------------------------------------------------------------ */

export const PLATFORM_FEE_PCT = formatPct(PLATFORM_FEE_RATE);

/** Who pays it. */
export const PLATFORM_FEE_PAYER = 'buyer' as const;

/** What it is calculated on. */
export const PLATFORM_FEE_BASIS = 'the credit price multiplied by the number of tonnes';

/** One sentence, used verbatim in buyer copy, seller copy and the FAQ. */
export const FEE_POLICY_SUMMARY =
  `Atlas charges one platform fee of ${PLATFORM_FEE_PCT}. It is added on top of the price the seller sets and is ` +
  `paid by the buyer. The seller receives the listed price in full — there is no listing fee and no separate ` +
  `seller commission.`;

/** What the fee does NOT include. The quote adds no tax and no other charge. */
export const FEE_EXCLUSIONS = [
  'VAT or any other tax, which is not added to the quote and is confirmed separately where it applies',
  'registry transfer or account fees charged by the registry itself',
  'any currency conversion your own bank or card issuer applies'
];

/** A worked example, computed from the live rate so it can never drift. */
export function feeWorkedExample(pricePerTonne = 25, tonnes = 100) {
  const q = quoteFor(pricePerTonne, tonnes);
  return {
    pricePerTonne,
    tonnes,
    ...q,
    sellerReceives: q.subtotal,
    atlasReceives: q.fee
  };
}

function formatPct(rate: number): string {
  const pct = rate * 100;
  return `${Number.isInteger(pct) ? pct : pct.toFixed(1)}%`;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
