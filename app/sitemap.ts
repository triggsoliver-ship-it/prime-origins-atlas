import type { MetadataRoute } from 'next';
import { listings } from '@/lib/listings';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://primeoriginsatlas.org';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ['', '/browse', '/sell', '/about', '/how-it-works', '/faq'];
  const staticEntries = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8
  }));
  const listingEntries = listings.map((l) => ({
    url: `${SITE_URL}/listings/${l.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }));
  return [...staticEntries, ...listingEntries];
}
