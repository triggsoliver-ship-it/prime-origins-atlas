import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sell Carbon Credits — List Your Project on Atlas',
  description:
    'Sell carbon credits to global buyers. Atlas accepts registry-verified credits (Verra, Gold Standard, ACR, Puro.earth) and self-verified projects with developer documentation. 4% platform fee, no upfront cost.',
  alternates: { canonical: '/sell' },
  openGraph: {
    title: 'Sell Carbon Credits | Prime Origins Atlas',
    description: 'List your carbon project — registry-verified or self-verified — to a global buyer base.',
    url: '/sell'
  }
};

export default function SellLayout({ children }: { children: React.ReactNode }) {
  return children;
}
