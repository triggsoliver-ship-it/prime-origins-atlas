import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { put, head } from '@vercel/blob';
import { sendAdminEmail, fieldsToHtml } from '@/lib/email';
import { getListingById } from '@/lib/listings';

export const runtime = 'nodejs';

/**
 * Stripe webhook — the durable record of a completed order.
 *
 * Without this, a paid order exists only in the Stripe dashboard and nothing
 * tells us to retire credits on the registry. On `checkout.session.completed`
 * we write an order record to Vercel Blob and email ADMIN_EMAIL.
 *
 * Requires STRIPE_WEBHOOK_SECRET (Stripe Dashboard -> Developers -> Webhooks ->
 * add endpoint https://www.primeoriginsatlas.org/api/webhooks/stripe, subscribe
 * to checkout.session.completed, then copy the signing secret).
 */
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!key || !webhookSecret) {
    console.error('[stripe webhook] STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET missing');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });

  // Signature verification needs the raw, unparsed body.
  const rawBody = await req.text();
  const stripe = new Stripe(key, { apiVersion: '2024-06-20' });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'verification failed';
    console.error('[stripe webhook] signature verification failed:', msg);
    return NextResponse.json({ error: `Signature verification failed: ${msg}` }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (session.payment_status !== 'paid') {
    console.warn('[stripe webhook] session completed but not paid:', session.id, session.payment_status);
    return NextResponse.json({ received: true, ignored: 'not paid' });
  }

  const listingId = session.metadata?.listingId ?? '';
  const listing = listingId ? getListingById(listingId) : undefined;
  const tonnes = Number(session.metadata?.tonnes ?? 0);
  const retire = session.metadata?.retire === 'yes';

  const order = {
    orderId: session.id,
    paidAt: new Date(((session.created ?? Math.floor(Date.now() / 1000)) as number) * 1000).toISOString(),
    recordedAt: new Date().toISOString(),
    listingId,
    projectName: listing?.projectName ?? '(unknown listing)',
    developer: listing?.developer ?? '',
    registry: listing?.registry ?? '',
    projectRegistryId: listing?.projectId ?? '',
    vintage: listing?.vintage ?? null,
    tonnes,
    pricePerTonne: listing?.pricePerTonne ?? null,
    currency: (session.currency ?? 'usd').toUpperCase(),
    amountTotal: session.amount_total != null ? session.amount_total / 100 : null,
    retirementRequested: retire,
    customerEmail: session.customer_details?.email ?? session.customer_email ?? '',
    customerName: session.customer_details?.name ?? '',
    paymentIntent: typeof session.payment_intent === 'string' ? session.payment_intent : null
  };

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  const blobPath = `orders/${session.id}.json`;

  // Stripe retries webhooks. A deterministic path plus this existence check
  // keeps retries from duplicating the order record or the email.
  if (blobToken) {
    try {
      await head(blobPath, { token: blobToken });
      console.log('[stripe webhook] order already recorded, skipping:', session.id);
      return NextResponse.json({ received: true, duplicate: true });
    } catch {
      // Not found — first time we have seen this session, carry on.
    }

    try {
      await put(blobPath, JSON.stringify(order, null, 2), {
        access: 'public',
        token: blobToken,
        addRandomSuffix: false,
        contentType: 'application/json'
      });
    } catch (e) {
      console.error('[stripe webhook] failed to write order to Blob:', e);
    }
  } else {
    console.warn('[stripe webhook] BLOB_READ_WRITE_TOKEN not set — order not persisted:', JSON.stringify(order));
  }

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:680px;margin:0 auto">
      <h2 style="color:#173a27">Credits sold${retire ? ' — retirement requested' : ''}</h2>
      <p style="color:#3a8b58">${retire
        ? 'The buyer asked for the credits to be retired in their name. The listing page promises a certificate within 48 hours.'
        : 'No retirement requested — the buyer is taking delivery of the credits.'}</p>
      ${fieldsToHtml({
        'Project': order.projectName,
        'Developer': order.developer,
        'Registry': order.registry,
        'Registry project ID': order.projectRegistryId,
        'Vintage': order.vintage ?? '',
        'Tonnes': order.tonnes,
        'Price / tCO₂e': order.pricePerTonne ?? '',
        'Total paid': order.amountTotal != null ? `${order.currency} ${order.amountTotal.toFixed(2)}` : '',
        'Retire on registry': retire ? 'YES — within 48h' : 'No',
        '— Buyer —': '',
        'Name': order.customerName,
        'Email': order.customerEmail,
        '— Reference —': '',
        'Order / session ID': order.orderId,
        'Payment intent': order.paymentIntent ?? '',
        'Paid at': order.paidAt
      })}
      <p style="margin-top:16px;font-size:12px;color:#6b7280">
        Recorded automatically by the Atlas Stripe webhook.
        ${blobToken ? 'A JSON copy is stored in Vercel Blob under orders/.' : 'WARNING: Blob storage is not configured, so this email is the only record.'}
      </p>
    </div>
  `;

  const emailResult = await sendAdminEmail({
    subject: `Atlas order — ${order.tonnes} tCO₂e, ${order.projectName}${retire ? ' (retire)' : ''}`,
    html,
    replyTo: order.customerEmail || undefined
  });
  if (!emailResult.sent) console.warn('[stripe webhook] admin email not sent:', emailResult.error);

  return NextResponse.json({ received: true });
}
