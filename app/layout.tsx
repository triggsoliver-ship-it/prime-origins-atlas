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
    default: 'Prime Origins Atlas — Carbon Credits & UK Woodland Units | Carbon Marketplace',
    template: '%s | Prime Origins Atlas'
  },
  description:
    'Registry-issued carbon credits from Verra, Gold Standard, ACR, Puro.earth and Climate Action Reserve, UK Woodland Carbon Code Pending Issuance Units, and developer self-verified projects. Every listing states its registry, unit type and verification status.',
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
    'Woodland Carbon Code',
    'Pending Issuance Units',
    'UK woodland carbon',
    'Peatland Code',
    'carbon credit retirement',
    'Prime Origins',
    'Atlas marketplace'
  ],
  authors: [{ name: 'Prime Origins', url: 'https://www.primeorigins.org' }],
  creator: 'Prime Origins',
  publisher: 'Prime Origins',
  alternates: { canonical: '/' },
  manifest: '/manifest.webmanifest',
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
    title: 'Prime Origins Atlas — Carbon Credit & UK Woodland Marketplace',
    description:
      'Registry-issued carbon credits, UK Woodland Carbon Code Pending Issuance Units and developer self-verified projects — each listed with its registry, unit type and verification status.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Prime Origins Atlas — Carbon Credit Marketplace' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prime Origins Atlas — Carbon Credit Marketplace',
    description: 'Registry-issued credits, UK Pending Issuance Units and self-verified projects. Every listing says which it is.',
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
        'A marketplace for registry-issued carbon credits from Verra, Gold Standard, ACR, Puro.earth and Climate Action Reserve, UK Woodland Carbon Code Pending Issuance Units, and developer self-verified projects.'
      // No parentOrganization: the Prime Origins ecosystem is a brand
      // relationship shown in the navigation, and asserting a legal parent in
      // structured data would state a corporate fact this site cannot evidence.
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
    <html lang="en-GB">
      <body className="min-h-screen flex flex-col">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
