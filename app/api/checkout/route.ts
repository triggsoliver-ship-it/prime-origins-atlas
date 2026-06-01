import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getListingById } from '@/lib/listings';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { listingId, tonnes, retire } = await req.json();
    const listing = getListingById(listingId);
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

    const qty = Math.max(1, Math.min(listing.tonnesAvailable, Number(tonnes) || 1));

    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Set STRIPE_SECRET_KEY in your environment variables.' },
        { status: 500 }
      );
    }
    const stripe = new Stripe(key, { apiVersion: '2024-06-20' });

    const subtotalCents = Math.round(listing.pricePerTonne * qty * 100);
    const feeCents = Math.round(subtotalCents * 0.04);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${new URL(req.url).origin}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: qty,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(listing.pricePerTonne * 100),
            product_data: {
              name: `${listing.projectName} — ${listing.registry} ${listing.vintage}`,
              description: `${listing.developer}, ${listing.country}. Methodology: ${listing.methodology}.`,
              metadata: { listingId: listing.id, registry: listing.registry, projectId: listing.projectId }
            }
          }
        },
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: feeCents,
            product_data: { name: 'Prime Origins platform fee (4%)' }
          }
        }
      ],
      metadata: {
        listingId: listing.id,
        tonnes: String(qty),
        retire: retire ? 'yes' : 'no'
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/listings/${listing.slug}?cancelled=1`
    });

    return NextResponse.json({ url: session.url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Checkout error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
