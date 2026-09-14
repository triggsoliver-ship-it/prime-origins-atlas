import { NextResponse } from 'next/server';
import { getListingById } from '@/lib/listings';
import { getAvailable } from '@/lib/inventory';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Live remaining tonnes for a listing.
 *
 * The listing pages stay statically generated for SEO; BuyPanel calls this on
 * mount so the number a buyer sees reflects real stock rather than the figure
 * baked in at build time.
 */
export async function GET(req: Request) {
  const listingId = new URL(req.url).searchParams.get('listingId');
  if (!listingId) return NextResponse.json({ error: 'listingId required' }, { status: 400 });

  const listing = getListingById(listingId);
  if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

  const { available, live } = await getAvailable(listingId);
  return NextResponse.json(
    { listingId, available, live },
    { headers: { 'cache-control': 'no-store' } }
  );
}
