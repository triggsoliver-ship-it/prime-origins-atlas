import type { Metadata } from 'next';
import { PLATFORM_FEE_RATE } from '@/lib/pricing';

const FEE_PCT = `${Number.isInteger(PLATFORM_FEE_RATE * 100) ? PLATFORM_FEE_RATE * 100 : (PLATFORM_FEE_RATE * 100).toFixed(1)}%`;

export const metadata: Metadata = {
  title: 'Sell Carbon Credits — List Your Project on Atlas',
  description:
    `Sell carbon credits to global buyers. Atlas accepts registry-verified credits (Verra, Gold Standard, ACR, Puro.earth) and self-verified projects with developer documentation. ${FEE_PCT} platform fee, no upfront cost.`,
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
