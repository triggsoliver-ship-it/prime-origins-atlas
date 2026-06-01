import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Verified Carbon Credits — Verra, Gold Standard, Self-Verified',
  description:
    'Browse vetted carbon credits across Verra, Gold Standard, ACR, Puro.earth and self-verified projects. Filter by category, registry, vintage and price. Buy and retire from $4.80/tCO₂e.',
  alternates: { canonical: '/browse' },
  openGraph: {
    title: 'Browse Carbon Credits | Prime Origins Atlas',
    description: 'Filter and buy high-integrity carbon credits from major registries and self-verified developers.',
    url: '/browse'
  }
};

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
