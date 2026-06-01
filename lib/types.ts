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
  | 'Self-Verified';

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
  pricePerTonne: number; // USD
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
};
