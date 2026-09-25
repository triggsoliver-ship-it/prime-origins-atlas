import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Carbon Projects — Registries, UK Woodland, Self-Verified',
  description:
    'Browse registry-issued carbon credits, UK Woodland Carbon Code Pending Issuance Units and developer self-verified projects. Filter by unit type, category, registry, year and indicative price. Atlas holds no stock — availability is confirmed on request.',
  alternates: { canonical: '/browse' },
  openGraph: {
    title: 'Browse Carbon Projects | Prime Origins Atlas',
    description: 'Filter by unit type, registry and category. Every listing states what instrument it offers and what has been verified.',
    url: '/browse'
  }
};

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
