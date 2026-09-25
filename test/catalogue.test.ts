import assert from 'node:assert/strict';
import { test } from 'node:test';
import { listings } from '../lib/listings';
import {
  PLATFORM_FEE_RATE,
  feeInPence,
  feeWorkedExample,
  quoteFor
} from '../lib/pricing';
import {
  availabilityLabel,
  catalogueStats,
  isRegistryBacked,
  isUkCode,
  permittedActionOf,
  statusChip,
  statusLabel,
  supplyBasisOf,
  unitKindOf,
  unitNoun,
  volumeField
} from '../lib/status';

/* ------------------------------------------------------------------ *
 * Fee arithmetic
 *
 * The bug this guards against: the quote panel shows one number and Stripe
 * charges another. app/api/checkout/route.ts builds the credit line as
 * round(price * 100) pence × tonnes, and the fee line as feeInPence(). The
 * panel shows quoteFor(). Those are two different code paths to the same
 * figure, so they get compared here rather than in production.
 * ------------------------------------------------------------------ */

const PRICES = [4.8, 14.44, 20.73, 25, 28.32, 33.5, 99.99, 250.05];
const QUANTITIES = [1, 3, 6, 7, 10, 33, 100, 1000, 12345];

test('displayed total equals the Stripe line items, to the penny', () => {
  for (const price of PRICES) {
    for (const qty of QUANTITIES) {
      const { subtotal, fee, total } = quoteFor(price, qty);

      const creditPence = Math.round(price * 100) * qty;
      const stripeTotalPence = creditPence + feeInPence(price, qty);

      assert.equal(
        Math.round(subtotal * 100),
        creditPence,
        `subtotal mismatch at £${price} × ${qty}`
      );
      assert.equal(
        Math.round(total * 100),
        stripeTotalPence,
        `total mismatch at £${price} × ${qty}`
      );
      assert.equal(Math.round(fee * 100), feeInPence(price, qty), `fee mismatch at £${price} × ${qty}`);
    }
  }
});

test('the fee is added on top; the seller receives the listed price in full', () => {
  const ex = feeWorkedExample(25, 100);
  assert.equal(ex.subtotal, 2500);
  assert.equal(ex.sellerReceives, ex.subtotal);
  assert.equal(ex.fee, Math.round(ex.subtotal * PLATFORM_FEE_RATE * 100) / 100);
  assert.equal(ex.total, ex.subtotal + ex.fee);
  assert.ok(ex.total > ex.subtotal, 'buyer must pay more than the credit price');
});

test('quote totals never carry sub-penny amounts', () => {
  for (const price of PRICES) {
    for (const qty of QUANTITIES) {
      const { subtotal, fee, total } = quoteFor(price, qty);
      for (const n of [subtotal, fee, total]) {
        assert.equal(Math.round(n * 100) / 100, n, `£${n} is not a whole number of pence`);
      }
    }
  }
});

/* ------------------------------------------------------------------ *
 * Unit classification
 *
 * The defect the 25 September review opened with: a card carrying both a
 * "Registry-issued" badge and a "Pending units" badge.
 * ------------------------------------------------------------------ */

test('every listing resolves to exactly one unit kind', () => {
  for (const l of listings) {
    const kind = unitKindOf(l);
    assert.ok(
      kind === 'issued-credit' || kind === 'pending-unit' || kind === 'self-reported-unit',
      `${l.id} has no unit kind`
    );
  }
});

test('no pending-unit listing is ever labelled registry-issued', () => {
  for (const l of listings) {
    if (unitKindOf(l) !== 'pending-unit') continue;
    assert.notEqual(statusChip(l).label, 'Registry-issued', `${l.id} shows the wrong chip`);
    assert.equal(statusChip(l).label, 'Pending Issuance Units');
    assert.equal(statusLabel(l), 'Registry-listed project · Pending Issuance Units');
    assert.equal(unitNoun(l), 'Pending units', `${l.id} would say "Credits" in a quote summary`);
  }
});

test('pending units are assigned, never retired', () => {
  for (const l of listings) {
    if (unitKindOf(l) === 'pending-unit') {
      assert.equal(permittedActionOf(l), 'assign', `${l.id} offers retirement on a pending unit`);
    }
  }
});

test('self-verified listings are not registry-backed and offer no registry retirement', () => {
  for (const l of listings) {
    if (unitKindOf(l) !== 'self-reported-unit') continue;
    assert.equal(isRegistryBacked(l), false);
    assert.equal(permittedActionOf(l), 'quote-only');
    assert.notEqual(statusChip(l).tone, 'solid', `${l.id} is styled as though it were registry-issued`);
  }
});

test('pending units only ever come from a UK code', () => {
  for (const l of listings) {
    if (unitKindOf(l) === 'pending-unit') {
      assert.ok(isUkCode(l), `${l.id} claims pending issuance outside the UK codes`);
    }
  }
});

/* ------------------------------------------------------------------ *
 * Catalogue statistics — the homepage figures
 * ------------------------------------------------------------------ */

test('the three unit kinds account for the whole catalogue exactly once', () => {
  const s = catalogueStats(listings);
  assert.equal(
    s.projectsWithIssuedCredits + s.pendingUnitProjects + s.selfVerifiedProjects,
    s.totalProjects
  );
  assert.equal(s.totalProjects, listings.length);
});

test('pending units are not counted as issued credits', () => {
  const s = catalogueStats(listings);
  assert.ok(s.pendingUnitProjects > 0, 'fixture should contain pending-unit projects');
  assert.equal(s.projectsWithIssuedCredits + s.pendingUnitProjects <= s.totalProjects, true);
  assert.ok(
    s.projectsWithIssuedCredits < s.totalProjects,
    'the issued-credit count must not be the whole catalogue'
  );
  assert.equal(s.registeredProjects, s.totalProjects - s.selfVerifiedProjects);
  assert.equal(s.ukCodeProjects, s.pendingUnitProjects + listings.filter((l) => isUkCode(l) && unitKindOf(l) !== 'pending-unit').length);
});

test('issued and predicted tonnages are drawn from disjoint sets of projects', () => {
  const s = catalogueStats(listings);
  const issuedFromPending = listings
    .filter((l) => unitKindOf(l) === 'pending-unit')
    .reduce((n, l) => n + (l.totalIssued || 0), 0);
  assert.equal(issuedFromPending, 0, 'a pending-unit project reports issued tonnes');
  assert.ok(s.predictedTonnesLifetime > 0);
  assert.ok(s.issuedTonnesLifetime > 0);
});

test('tonnes held for sale matches the saleable kill switch', () => {
  const s = catalogueStats(listings);
  const held = listings.filter((l) => supplyBasisOf(l) === 'held');
  assert.equal(
    s.tonnesHeldForSale,
    held.reduce((n, l) => n + l.tonnesAvailable, 0)
  );
  // While nothing is card-payable, the homepage must not imply stock exists.
  if (held.length === 0) assert.equal(s.tonnesHeldForSale, 0);
});

test('a project Atlas does not hold never advertises a tonnage', () => {
  for (const l of listings) {
    if (supplyBasisOf(l) === 'held') continue;
    assert.equal(
      availabilityLabel(l),
      'Availability confirmed on request',
      `${l.id} advertises stock Atlas does not hold`
    );
  }
});

/* ------------------------------------------------------------------ *
 * Volume labelling — three different tonnages, three different meanings
 * ------------------------------------------------------------------ */

test('a tonnage is never described as registry-issued unless a registry issued it', () => {
  for (const l of listings) {
    const v = volumeField(l);
    if (!v) continue;
    if (unitKindOf(l) === 'issued-credit') {
      assert.match(v.label, /Issued to date/);
    } else {
      assert.doesNotMatch(v.label, /^Issued/, `${l.id} labels its tonnage as issued`);
      assert.doesNotMatch(
        v.note,
        /Total the registry has issued/,
        `${l.id} claims registry issuance in its note`
      );
    }
  }
});

test('every listing states a scope alongside its tonnage', () => {
  for (const l of listings) {
    const v = volumeField(l);
    if (!v) continue;
    assert.ok(v.note.length > 20, `${l.id} has no scope note on its tonnage`);
    assert.match(v.label, /project lifetime/, `${l.id} does not scope its tonnage to the project lifetime`);
  }
});
