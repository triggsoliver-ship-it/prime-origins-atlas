import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://primeoriginsatlas.org';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Prime Origins Atlas — Buy Verified Carbon Credits | Carbon Credit Marketplace',
    template: '%s | Prime Origins Atlas'
  },
  description:
    'Buy high-integrity carbon credits from Verra, Gold Standard, ACR, Puro.earth & self-verified projects. Transparent prices, registry-traceable, retirement included. SBTi, VCMI & CSRD ready.',
  keywords: [
    'carbon credit marketplace',
    'buy carbon credits',
    'verified carbon credits',
    'sell carbon credits',
    'carbon offset marketplace',
    'voluntary carbon market',
    'Verra credits',
    'Gold Standard credits',
    'carbon removal credits',
    'nature-based carbon credits',
    'self-verified carbon credits',
    'high-integrity carbon credits',
    'SBTi carbon credits',
    'CSRD carbon credits',
    'carbon credit retirement',
    'Prime Origins',
    'Atlas marketplace'
  ],
  authors: [{ name: 'Prime Origins', url: 'https://www.primeorigins.org' }],
  creator: 'Prime Origins',
  publisher: 'Prime Origins',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: 'Prime Origins Atlas',
    title: 'Prime Origins Atlas — Verified Carbon Credit Marketplace',
    description:
      'High-integrity carbon credits from major registries and self-verified developers. Traceable, retirable, compliance-ready.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Prime Origins Atlas — Verified Carbon Credit Marketplace' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prime Origins Atlas — Carbon Credit Marketplace',
    description: 'High-integrity, traceable, retirable carbon credits — registry-verified and self-verified.',
    images: ['/opengraph-image']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 }
  },
  category: 'Sustainability'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
