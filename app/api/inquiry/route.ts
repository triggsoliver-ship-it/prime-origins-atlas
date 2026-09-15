import { NextResponse } from 'next/server';
import { sendAdminEmail, fieldsToHtml, escapeHtml } from '@/lib/email';
import { storeLead } from '@/lib/leads';

export const runtime = 'nodejs';

/**
 * Enquiry endpoint — captures "Talk to us" leads and, since the catalogue moved
 * to sourcing-to-order, the quote requests that are now Atlas's main way of
 * taking business. Writes every lead to Blob storage, then notifies
 * ADMIN_EMAIL via Resend and any configured webhook.
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const required = ['name', 'email', 'message'];
    for (const k of required) {
      if (!data[k]) return NextResponse.json({ error: `Missing field: ${k}` }, { status: 400 });
    }

    const isQuote = data.type === 'quote';
    const payload = {
      ...data,
      type: isQuote ? 'quote' : 'inquiry',
      received_at: new Date().toISOString()
    };

    console.log(isQuote ? '[Atlas quote]' : '[Atlas inquiry]', JSON.stringify(payload, null, 2));

    // Record first, notify second. Email is best-effort; this is the receipt.
    const stored = await storeLead(payload);

    // Send email
    const subjectBits = [
      isQuote ? 'QUOTE REQUEST' : 'New Atlas enquiry',
      isQuote && data.tonnes ? `${Number(data.tonnes).toLocaleString()} t` : '',
      data.listingName ? `— ${data.listingName}` : '',
      `— ${data.name}`,
      data.company ? `(${data.company})` : ''
    ].filter(Boolean).join(' ');

    const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#173a27">${isQuote ? 'Quote request' : 'New Atlas enquiry'}</h2>
        <p style="color:#3a8b58">${isQuote
          ? 'A buyer has asked for a firm price. Source it, check the margin, then reply with price, vintage and serial numbers.'
          : 'A new "Talk to us" submission has come in.'}</p>
        ${fieldsToHtml({
          Name: data.name,
          Email: data.email,
          Company: data.company || '',
          Volume: data.tonnes ? `${Number(data.tonnes).toLocaleString()} tCO2e` : '',
          Project: data.listingName || 'General enquiry',
          Registry: data.registry || '',
          'Unit type': data.unitType || '',
          Retirement: data.retirement || '',
          'Needed by': data.deadline || '',
          'Listing ID': data.listingId || '',
          Message: data.message,
          Received: payload.received_at
        })}
        <p style="margin-top:16px;font-size:12px;color:#6b7280">
          Reply directly to this email to respond to ${escapeHtml(data.name)} at ${escapeHtml(data.email)}.
        </p>
      </div>
    `;
    const text = [
      isQuote ? 'QUOTE REQUEST' : 'New Atlas enquiry',
      '',
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Company: ${data.company || '-'}`,
      `Volume: ${data.tonnes ? `${data.tonnes} tCO2e` : '-'}`,
      `Project: ${data.listingName || '-'}`,
      `Registry: ${data.registry || '-'}`,
      `Unit type: ${data.unitType || '-'}`,
      `Retirement: ${data.retirement || '-'}`,
      `Needed by: ${data.deadline || '-'}`,
      '',
      'Message:',
      String(data.message),
      '',
      `Received: ${payload.received_at}`
    ].join('\n');

    const emailResult = await sendAdminEmail({ subject: subjectBits, html, text, replyTo: data.email });
    if (!emailResult.sent) {
      console.warn('[Atlas inquiry] email not sent:', emailResult.error);
    }

    // If the lead reached neither the inbox nor storage, say so. Confirming a
    // quote request that landed nowhere is how a real buyer gets lost.
    if (!emailResult.sent && !stored.stored) {
      console.error('[Atlas inquiry] LEAD LOST — email and blob both failed', {
        email: emailResult.error,
        blob: stored.error
      });
      return NextResponse.json(
        {
          error: 'We could not record your message. Please email oliver@primeorigins.org directly and we will pick it up straight away.',
          contactEmail: 'oliver@primeorigins.org'
        },
        { status: 502 }
      );
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

    return NextResponse.json({ ok: true, emailSent: emailResult.sent, stored: stored.stored });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Submission error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
