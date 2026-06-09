import { NextResponse } from 'next/server';
import { sendAdminEmail, fieldsToHtml, escapeHtml } from '@/lib/email';

export const runtime = 'nodejs';

/**
 * Inquiry endpoint — captures "Talk to us" leads from homepage and listing pages.
 * Sends an email to ADMIN_EMAIL via Resend (when RESEND_API_KEY is set) and also
 * forwards to any configured webhook for redundancy.
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

    // Send email
    const subjectBits = [
      `New Atlas enquiry from ${data.name}`,
      data.company ? `(${data.company})` : '',
      data.listingName ? `— ${data.listingName}` : ''
    ].filter(Boolean).join(' ');

    const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#173a27">New Atlas enquiry</h2>
        <p style="color:#3a8b58">A new "Talk to us" submission has come in.</p>
        ${fieldsToHtml({
          Name: data.name,
          Email: data.email,
          Company: data.company || '',
          'Tonnes of interest': data.tonnes || '',
          'About listing': data.listingName || 'General enquiry',
          'Listing ID': data.listingId || '',
          Message: data.message,
          Received: payload.received_at
        })}
        <p style="margin-top:16px;font-size:12px;color:#6b7280">
          Reply directly to this email to respond to ${escapeHtml(data.name)} at ${escapeHtml(data.email)}.
        </p>
      </div>
    `;
    const text = `New Atlas enquiry\n\nName: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || '-'}\nTonnes: ${data.tonnes || '-'}\nListing: ${data.listingName || '-'}\nMessage:\n${data.message}\n\nReceived: ${payload.received_at}`;

    const emailResult = await sendAdminEmail({ subject: subjectBits, html, text, replyTo: data.email });
    if (!emailResult.sent) {
      console.warn('[Atlas inquiry] email not sent:', emailResult.error);
    }

    // Optional webhook (Slack/Zapier/Make)
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

    return NextResponse.json({ ok: true, emailSent: emailResult.sent });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Submission error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
