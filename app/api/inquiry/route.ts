import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Inquiry endpoint — captures "Talk to us" leads from homepage and listing pages.
 *
 * For the MVP: logs to console + optional webhook forward (SELLER_WEBHOOK_URL).
 * For production swap for: database insert + Resend/Postmark email to sales.
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const required = ['name', 'email', 'message'];
    for (const k of required) {
      if (!data[k]) return NextResponse.json({ error: `Missing field: ${k}` }, { status: 400 });
    }

    const payload = {
      type: 'inquiry',
      received_at: new Date().toISOString(),
      ...data
    };

    console.log('[Atlas inquiry]', JSON.stringify(payload, null, 2));

    const webhook = process.env.INQUIRY_WEBHOOK_URL || process.env.SELLER_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        console.error('Inquiry webhook forward failed', e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Submission error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
