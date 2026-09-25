import type { Listing } from './types';
import { isSaleable } from './saleable';

/**
 * One place that decides what a listing actually IS.
 *
 * Why this file exists: on 25 September 2026 a review found the homepage and
 * the woodland listings showing a "Registry-issued" badge and a "Pending
 * units" badge on the same card. Both came from separate `listing.tier ===`
 * and `listing.unitType ===` checks scattered across five components, so the
 * cards, the filters, the totals, the metadata and the quote summary each
 * reached their own conclusion. A buyer reading "Registry-issued" on a
 * Pending Issuance Unit has been told the opposite of the truth.
 *
 * Five separate questions decide what may be said about a listing. They are
 * not the same question and they must not collapse into one badge:
 *
 *   1. Project registration  — which registry or code the project sits on
 *   2. Assurance             — what has actually been verified, and by whom
 *   3. Unit type             — issued credit, pending unit, or self-reported
 *   4. Supply basis          — held as stock, sourced to order, illustrative
 *   5. Permitted action      — retire, assign, or quote only
 *
 * Everything user-facing derives from the functions below. If a label is
 * wrong, it is wrong in one place.
 *
 * Woodland Carbon Code wording verified against woodlandcarboncode.org.uk
 * (/what-you-can-buy and /how-buy-and-use-units), September 2026:
 *
 *   "A Pending Issuance Unit is a promise to deliver a Woodland Carbon Unit
 *    in the future, based on predicted carbon dioxide equivalent removal."
 *   "It is not guaranteed, so can't be used to report against UK-based
 *    emissions."
 *   "Companies can use Woodland Carbon Units to report against UK-based
 *    emissions or to make claims about their net zero journey. They can't be
 *    used to compensate for overseas emissions or emissions from
 *    international aviation or shipping."
 *   "Woodland Carbon Units can't currently be used in compliance programmes
 *    like the UK Emissions Trading Scheme."
 *
 * No dependencies beyond types and the saleable kill switch, so this imports
 * cleanly into server components, route handlers and the browser bundle.
 */

/* ------------------------------------------------------------------ *
 * 3. Unit type
 * ------------------------------------------------------------------ */

export type UnitKind =
  /** Verified and issued on a public registry. A carbon credit. */
  | 'issued-credit'
  /** A Woodland Carbon Code promise against predicted future removal. */
  | 'pending-unit'
  /** Developer's own measurement. Not issued by any registry. */
  | 'self-reported-unit';

export function unitKindOf(l: Listing): UnitKind {
  if (l.registry === 'Self-Verified') return 'self-reported-unit';
  if (l.unitType === 'piu') return 'pending-unit';
  return 'issued-credit';
}

/** Plural noun for this listing's units. Never "Credits" for a pending unit. */
export function unitNoun(l: Listing): string {
  switch (unitKindOf(l)) {
    case 'pending-unit': return 'Pending units';
    case 'self-reported-unit': return 'Units';
    default: return 'Credits';
  }
}

/** Singular, lower case, for use mid-sentence. */
export function unitNounSingular(l: Listing): string {
  switch (unitKindOf(l)) {
    case 'pending-unit': return 'pending unit';
    case 'self-reported-unit': return 'unit';
    default: return 'credit';
  }
}

/* ------------------------------------------------------------------ *
 * 1 + 2. Registration and assurance
 * ------------------------------------------------------------------ */

export function isUkCode(l: Listing): boolean {
  return l.registry === 'Woodland Carbon Code' || l.registry === 'Peatland Code';
}

/** True when a public registry stands behind the project record. */
export function isRegistryBacked(l: Listing): boolean {
  return l.registry !== 'Self-Verified';
}

/**
 * What has been verified. Deliberately says nothing about Prime Origins:
 * Atlas does not issue or certify anything, and a marketplace badge must not
 * read as an assurance level.
 */
export function assuranceLabel(l: Listing): string {
  switch (unitKindOf(l)) {
    case 'pending-unit':
      return `Project validated and registered under the ${l.registry}. Units not yet verified.`;
    case 'self-reported-unit':
      return 'Documented by the developer. Not verified by a third party or issued on a registry.';
    default:
      return `Units verified and issued on the ${l.registry} registry.`;
  }
}

/**
 * The precise status line. Registration and unit type in one string, in that
 * order, so neither can be read without the other.
 */
export function statusLabel(l: Listing): string {
  switch (unitKindOf(l)) {
    case 'pending-unit':
      return 'Registry-listed project · Pending Issuance Units';
    case 'self-reported-unit':
      return 'Developer self-verified · not registry-issued';
    default:
      return isUkCode(l)
        ? `${l.registry} · Woodland Carbon Units (verified)`
        : `${l.registry}-issued credits`;
  }
}

export type ChipTone = 'solid' | 'warn';

/**
 * The single status chip a card shows. One chip, not two contradictory ones.
 * Short enough for a card corner; statusLabel() carries the full wording on
 * the detail page.
 */
export function statusChip(l: Listing): { label: string; tone: ChipTone } {
  switch (unitKindOf(l)) {
    case 'pending-unit':
      return { label: 'Pending Issuance Units', tone: 'warn' };
    case 'self-reported-unit':
      return { label: 'Self-verified', tone: 'warn' };
    default:
      return { label: 'Registry-issued', tone: 'solid' };
  }
}

/* ------------------------------------------------------------------ *
 * 4. Supply basis
 * ------------------------------------------------------------------ */

export type SupplyBasis =
  /** Atlas holds these units and can transfer them on payment. */
  | 'held'
  /** Real project, real registry record; Atlas sources on a confirmed order. */
  | 'sourced-to-order';

export function supplyBasisOf(l: Listing): SupplyBasis {
  return isSaleable(l.id) ? 'held' : 'sourced-to-order';
}

/** True while Atlas holds no stock of this listing — so the price is indicative. */
export function isIndicativePrice(l: Listing): boolean {
  return supplyBasisOf(l) !== 'held';
}

export function priceLabel(l: Listing): string {
  return isIndicativePrice(l) ? 'Indicative price' : 'Price';
}

/**
 * What to print where a tonnage would go. Atlas publishes a number only when
 * it holds the stock. A project's predicted lifetime removal is not inventory
 * and the UK register publishes availability per developer, not per project —
 * so for everything else the honest answer is that we ask.
 */
export function availabilityLabel(l: Listing): string {
  if (supplyBasisOf(l) === 'held') return `${l.tonnesAvailable.toLocaleString()} tCO₂e available`;
  return 'Availability confirmed on request';
}

export function availabilityShort(l: Listing): string {
  if (supplyBasisOf(l) === 'held') return `${l.tonnesAvailable.toLocaleString()} t available`;
  return 'Availability on request';
}

/**
 * The heading for a listing's headline tonnage, and the scope note under it.
 * Three different things were all being printed as "Total issued": a registry's
 * lifetime issuance, a developer's forecast, and a self-verified developer's
 * own estimate — which no registry has issued at all.
 */
export function volumeField(l: Listing): { label: string; value: number; note: string } | null {
  switch (unitKindOf(l)) {
    case 'pending-unit':
      return l.predictedTonnes === undefined
        ? null
        : {
            label: 'Predicted removal, project lifetime',
            value: l.predictedTonnes,
            note: "Developer forecast over the project's whole life. Not verified, and not the amount for sale."
          };
    case 'self-reported-unit':
      return {
        label: "Developer's own estimate, project lifetime",
        value: l.totalIssued,
        note: 'Measured and reported by the developer. No registry has issued or verified these units.'
      };
    default:
      return {
        label: 'Issued to date, project lifetime',
        value: l.totalIssued,
        note: 'Total the registry has issued to this project since it started. Not the amount for sale.'
      };
  }
}

/* ------------------------------------------------------------------ *
 * 5. Permitted action
 * ------------------------------------------------------------------ */

export type PermittedAction =
  /** Cancelled on the registry in the buyer's name. */
  | 'retire'
  /** Transferred to the buyer's registry account, not cancelled. */
  | 'assign'
  /** Neither is available yet; terms are agreed in writing first. */
  | 'quote-only';

export function permittedActionOf(l: Listing): PermittedAction {
  switch (unitKindOf(l)) {
    case 'pending-unit': return 'assign';
    case 'self-reported-unit': return 'quote-only';
    default: return l.retirementSupported ? 'retire' : 'quote-only';
  }
}

/**
 * The "Retirement" row on a project detail page. Communicates future
 * eligibility for a pending unit; it must never read as though a pending unit
 * can be retired today.
 */
export function retirementLabel(l: Listing): string {
  switch (permittedActionOf(l)) {
    case 'assign':
      return 'Not yet — on verification';
    case 'retire':
      return `Supported on the ${l.registry} registry`;
    default:
      return 'Not available — no registry record';
  }
}

/** One sentence explaining the retirement position in full. */
export function retirementExplainer(l: Listing): string {
  switch (permittedActionOf(l)) {
    case 'assign':
      return 'Pending units are assigned to you on the UK Land Carbon Registry, not retired. They become eligible for retirement once the project passes verification and they convert to Woodland Carbon Units.';
    case 'retire':
      return `Units are cancelled in your name on the ${l.registry} registry, and you receive the retirement record with its serial numbers.`;
    default:
      return 'These units are not held on a public registry, so no registry retirement is available. We confirm with the developer what cancellation evidence they can provide before you commit to anything.';
  }
}

/* ------------------------------------------------------------------ *
 * Auditable catalogue statistics
 * ------------------------------------------------------------------ */

export type CatalogueStats = {
  /** Projects on the site, whatever their unit type. */
  totalProjects: number;
  /** Projects registered with a named registry or code. Excludes self-verified. */
  registeredProjects: number;
  /** Projects whose units are verified and issued. NOT pending units. */
  projectsWithIssuedCredits: number;
  /** Projects offering Pending Issuance Units. */
  pendingUnitProjects: number;
  /** Projects listed on the developer's own documentation only. */
  selfVerifiedProjects: number;
  /** Projects under the Woodland Carbon Code or Peatland Code. */
  ukCodeProjects: number;
  countries: number;
  /**
   * Total historical issuance across issued-credit projects, as published by
   * each registry. This is the projects' lifetime issuance, not Atlas stock.
   */
  issuedTonnesLifetime: number;
  /**
   * Predicted lifetime removal across pending-unit projects, as published by
   * the developers. A forecast, not inventory, and not yet verified.
   */
  predictedTonnesLifetime: number;
  /** Tonnes Atlas holds and can transfer on payment today. */
  tonnesHeldForSale: number;
};

export function catalogueStats(all: Listing[]): CatalogueStats {
  const kinds = all.map((l) => unitKindOf(l));
  const issued = all.filter((_, i) => kinds[i] === 'issued-credit');
  const pending = all.filter((_, i) => kinds[i] === 'pending-unit');
  const selfV = all.filter((_, i) => kinds[i] === 'self-reported-unit');

  return {
    totalProjects: all.length,
    registeredProjects: all.filter(isRegistryBacked).length,
    projectsWithIssuedCredits: issued.length,
    pendingUnitProjects: pending.length,
    selfVerifiedProjects: selfV.length,
    ukCodeProjects: all.filter(isUkCode).length,
    countries: new Set(all.map((l) => l.country)).size,
    issuedTonnesLifetime: issued.reduce((s, l) => s + (l.totalIssued || 0), 0),
    predictedTonnesLifetime: pending.reduce((s, l) => s + (l.predictedTonnes || 0), 0),
    tonnesHeldForSale: all
      .filter((l) => supplyBasisOf(l) === 'held')
      .reduce((s, l) => s + (l.tonnesAvailable || 0), 0)
  };
}

/** e.g. 1_234_567 -> "1.2m", 88_000 -> "88k". For stat rows with a scope label. */
export function compactTonnes(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(n);
}
