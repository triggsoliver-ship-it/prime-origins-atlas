import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://primeoriginsatlas.org';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#235838'
};

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
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/logo.png', type: 'image/png' }
    ],
    apple: [{ url: '/logo.png', type: 'image/png' }]
  },
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

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Prime Origins Atlas',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description:
        'A marketplace for high-integrity carbon credits from Verra, Gold Standard, ACR, Puro.earth, Climate Action Reserve and self-verified project developers.',
      parentOrganization: {
        '@type': 'Organization',
        name: 'Prime Origins',
        url: 'https://www.primeorigins.org'
      }
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Prime Origins Atlas',
      url: SITE_URL,
      inLanguage: 'en-GB',
      publisher: { '@id': `${SITE_URL}/#organization` }
    }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
