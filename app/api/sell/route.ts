import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

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
