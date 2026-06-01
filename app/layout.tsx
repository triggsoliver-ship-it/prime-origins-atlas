import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Prime Origins Atlas — Verified Carbon Credit Marketplace',
  description:
    'A transparent marketplace for high-integrity carbon credits — nature-based, engineered removals, and renewable energy projects, vetted by Prime Origins.',
  openGraph: {
    title: 'Prime Origins Atlas',
    description: 'Verified carbon credits with full registry traceability.',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
