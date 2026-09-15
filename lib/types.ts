export type ProjectCategory =
  | 'nature-based'
  | 'engineered-removal'
  | 'renewable-energy'
  | 'community';

export type Registry =
  | 'Verra'
  | 'Gold Standard'
  | 'ACR'
  | 'Puro.earth'
  | 'Climate Action Reserve'
  | 'Woodland Carbon Code'
  | 'Peatland Code'
  | 'Self-Verified';

/**
 * UK unit types. This distinction decides what a buyer may legally claim, so
 * it is not cosmetic.
 *
 *  piu — Pending Issuance Unit. The Woodland Carbon Code's own words: "a
 *        promise to deliver a Woodland Carbon Unit in the future, based on
 *        predicted carbon dioxide equivalent removal ... It is not
 *        guaranteed, so can't be used to report against UK-based emissions."
 *        Over 99% of UK units that trade are these.
 *
 *  wcu — Woodland Carbon Unit. Verified, and the only kind that "can be used
 *        to report against UK-based emissions". Roughly 1,400 were available
 *        across the entire UK market at the last published count.
 *
 * Selling a PIU to a buyer who believes they have bought an offset is the
 * single most likely way to end up refunding an order. Anything with a
 * unitType must say which it is, every time it is shown.
 */
export type UnitType = 'piu' | 'wcu';

export type VerificationTier = 'prime-origins-verified' | 'self-verified';

export type VerificationDoc = {
  label: string;       // e.g. "Certificate of Analysis", "Validation report"
  url: string;         // hosted PDF/image
  filename?: string;
};

export type Listing = {
  id: string;
  slug: string;
  projectName: string;
  developer: string;
  category: ProjectCategory;
  registry: Registry;
  methodology: string;
  projectId: string; // public registry ID
  vintage: number; // year credits were generated
  country: string;
  region?: string;
  pricePerTonne: number; // GBP
  tonnesAvailable: number;
  totalIssued: number;
  bufferPoolPct?: number;
  cobenefits: string[]; // e.g. biodiversity, livelihoods, water
  sdgs: number[]; // UN SDG numbers 1-17
  summary: string;
  description: string;
  imageUrl: string;
  verified: boolean; // Prime Origins vetting flag
  retirementSupported: boolean;
  featured?: boolean;

  // New: verification tier + supporting evidence
  tier: VerificationTier;
  latitude?: number;
  longitude?: number;
  documents?: VerificationDoc[];

  // --- UK codes (Woodland Carbon Code / Peatland Code) ---
  /** Pending issuance vs verified. Absent for non-UK registries. */
  unitType?: UnitType;
  /** Predicted sequestration over the project's life, as published. NOT the
   *  amount for sale — see availabilityPublished. */
  predictedTonnes?: number;
  /** Planted area in hectares, as published by the developer. */
  areaHectares?: number;
  /** The year planting took place. The UK codes do not publish a per-project
   *  vintage, so this is a planting year and must be labelled as one. */
  plantingYear?: number;
  /**
   * False when the seller does not publish how many units this specific
   * project has left. The UK register publishes totals per developer, not per
   * project, so for these listings we genuinely do not know — and must say so
   * rather than print a number we made up.
   */
  availabilityPublished?: boolean;
};
