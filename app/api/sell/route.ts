import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Seller submission endpoint.
 *
 * For the MVP we log to the server console and (optionally) post to a webhook
 * URL you configure. In production you should:
 *  - Save submissions to a database (Vercel Postgres / Supabase / Airtable)
 *  - Send the admin an email (Resend / Postmark)
 *  - Trigger a Slack notification
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const required = ['orgName', 'contactName', 'email', 'projectName', 'projectId', 'registry', 'category', 'country', 'vintage', 'tonnesAvailable', 'pricePerTonne'];
    for (const k of required) {
      if (!data[k]) return NextResponse.json({ error: `Missing field: ${k}` }, { status: 400 });
    }

    // Log to server console (visible in Vercel logs)
    console.log('[Atlas seller submission]', JSON.stringify(data, null, 2));

    // Optional: forward to a webhook (e.g. Zapier, Make, Slack)
    const webhook = process.env.SELLER_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ type: 'seller_submission', received_at: new Date().toISOString(), data })
        });
      } catch (e) {
        console.error('Webhook forward failed', e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Submission error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
