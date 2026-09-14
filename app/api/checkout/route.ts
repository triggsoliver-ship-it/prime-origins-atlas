import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { randomUUID } from 'crypto';
import { getListingById } from '@/lib/listings';
import { reserve, release, attachSession } from '@/lib/inventory';

export const runtime = 'nodejs';

// How long a buyer has to finish paying before their hold is released. The
// Stripe session is given the same lifetime, so a session can never be paid
// after the tonnes behind it have gone back on sale.
const HOLD_MINUTES = 60;

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

    // Take the stock BEFORE creating anything payable. If two buyers arrive at
    // once, exactly one of them gets past this.
    const reservationId = randomUUID();
    const held = await reserve(reservationId, listing.id, qty, HOLD_MINUTES);
    if (!held.ok) {
      return NextResponse.json(
        {
          error:
            held.available > 0
              ? `Only ${held.available.toLocaleString()} tCO₂e are still available on this project.`
              : 'These credits have just sold out.',
          available: held.available
        },
        { status: 409 }
      );
    }

    const subtotalPence = Math.round(listing.pricePerTonne * qty * 100);
    const feePence = Math.round(subtotalPence * 0.04);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${new URL(req.url).origin}`;

    // Atlas resells credits originated by third-party developers and takes a
    // platform fee, so it is a marketplace. Stripe's Managed Payments supports
    // direct-to-customer digital goods only (software, media, online courses)
    // and requires a product tax code from that list — none of which describes
    // a carbon credit. Opt out per session rather than mislabelling the goods.
    const sessionParams = {
      mode: 'payment',
      managed_payments: { enabled: false },
      expires_at: Math.floor(Date.now() / 1000) + HOLD_MINUTES * 60,
      line_items: [
        {
          quantity: qty,
          price_data: {
            currency: 'gbp',
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
            currency: 'gbp',
            unit_amount: feePence,
            product_data: { name: 'Prime Origins platform fee (4%)' }
          }
        }
      ],
      metadata: {
        listingId: listing.id,
        tonnes: String(qty),
        retire: retire ? 'yes' : 'no',
        reservationId
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/listings/${listing.slug}?cancelled=1`
    };

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create(
        sessionParams as unknown as Stripe.Checkout.SessionCreateParams
      );
    } catch (e) {
      // Never strand a hold on stock nobody can buy.
      await release(reservationId);
      throw e;
    }

    await attachSession(reservationId, session.id);

    return NextResponse.json({ url: session.url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Checkout error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
