import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { sendAdminEmail, fieldsToHtml, escapeHtml } from '@/lib/email';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Seller submission endpoint — accepts multipart form data.
 *
 * Files: uploads to Vercel Blob if BLOB_READ_WRITE_TOKEN is set, otherwise
 *        falls back to storing filename + size only (and the listing won't
 *        have a real URL — useful for local dev without Blob).
 * URLs:  stored as-is.
 *
 * Submission is logged to the server console and (optionally) forwarded to
 * SELLER_WEBHOOK_URL. For production you should swap this for a DB write +
 * email notification.
 */
export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // Extract base fields
    const base = Object.fromEntries(
      Array.from(form.entries())
        .filter(([k]) => !k.startsWith('docFile_') && !k.startsWith('docUrl_') && !k.startsWith('docLabel_'))
        .map(([k, v]) => [k, typeof v === 'string' ? v : ''])
    );

    const required = ['orgName', 'contactName', 'email', 'projectName', 'projectId', 'registry', 'category', 'country', 'vintage', 'tonnesAvailable', 'pricePerTonne', 'tier', 'latitude', 'longitude'];
    for (const k of required) {
      if (!base[k]) return NextResponse.json({ error: `Missing field: ${k}` }, { status: 400 });
    }

    // Collect documents
    const docs: Array<{ label: string; url: string; filename?: string; size?: number }> = [];
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    for (let i = 0; i < 20; i++) {
      const label = form.get(`docLabel_${i}`);
      if (!label || typeof label !== 'string') continue;

      const file = form.get(`docFile_${i}`);
      const url = form.get(`docUrl_${i}`);

      if (file && file instanceof File && file.size > 0) {
        if (blobToken) {
          // Upload to Vercel Blob
          const path = `seller-submissions/${Date.now()}-${i}-${file.name}`;
          const blob = await put(path, file, {
            access: 'public',
            token: blobToken,
            addRandomSuffix: true
          });
          docs.push({ label, url: blob.url, filename: file.name, size: file.size });
        } else {
          // No Blob configured — record metadata only
          docs.push({ label, url: '(pending — Blob not configured)', filename: file.name, size: file.size });
        }
      } else if (url && typeof url === 'string' && url.trim()) {
        docs.push({ label, url: url.trim() });
      }
    }

    const submission = {
      received_at: new Date().toISOString(),
      ...base,
      documents: docs
    };

    console.log('[Atlas seller submission]', JSON.stringify(submission, null, 2));

    // Send admin email
    const docsHtml = docs.length
      ? `<table style="border-collapse:collapse;width:100%;margin-top:8px;font-family:system-ui">${docs.map((d) => `<tr><td style="padding:4px 8px;border-bottom:1px solid #e5e7eb">${escapeHtml(d.label)}</td><td style="padding:4px 8px;border-bottom:1px solid #e5e7eb"><a href="${escapeHtml(d.url)}">${escapeHtml(d.filename || d.url)}</a></td></tr>`).join('')}</table>`
      : '<p style="color:#6b7280">No documents attached.</p>';

    const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:680px;margin:0 auto">
        <h2 style="color:#173a27">New seller application</h2>
        <p style="color:#3a8b58">A project developer has applied to list on Atlas. Review the registry and supporting documents before approving.</p>
        ${fieldsToHtml({
          'Tier': base.tier,
          'Project name': base.projectName,
          'Registry': base.registry,
          'Project ID': base.projectId,
          'Methodology': base.methodology,
          'Category': base.category,
          'Country': base.country,
          'Region': base.region || '',
          'Vintage': base.vintage,
          'Tonnes available': base.tonnesAvailable,
          'Asking price (USD/tCO₂e)': base.pricePerTonne,
          'Latitude': base.latitude,
          'Longitude': base.longitude,
          'Summary': base.summary || '',
          '— Organisation —': '',
          'Org name': base.orgName,
          'Contact name': base.contactName,
          'Email': base.email,
          'Phone': base.phone || '',
          'Received': submission.received_at
        })}
        <h3 style="color:#173a27;margin-top:16px">Verification documents</h3>
        ${docsHtml}
        <p style="margin-top:16px;font-size:12px;color:#6b7280">Reply directly to contact ${escapeHtml(String(base.contactName))} at ${escapeHtml(String(base.email))}.</p>
      </div>
    `;
    const emailResult = await sendAdminEmail({
      subject: `New Atlas seller application — ${base.projectName} (${base.registry})`,
      html,
      replyTo: typeof base.email === 'string' ? base.email : undefined
    });
    if (!emailResult.sent) console.warn('[Atlas seller submission] email not sent:', emailResult.error);

    // Optional webhook forward
    const webhook = process.env.SELLER_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ type: 'seller_submission', ...submission })
        });
      } catch (e) {
        console.error('Webhook forward failed', e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Submission error';
    console.error('[Atlas seller submission error]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
