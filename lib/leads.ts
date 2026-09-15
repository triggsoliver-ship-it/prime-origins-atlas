import { put } from '@vercel/blob';

/**
 * Durable storage for every lead, independent of email.
 *
 * Quote requests are now Atlas's main way of taking business, so losing one is
 * losing a sale. `sendAdminEmail` returns `sent: false` and carries on if
 * RESEND_API_KEY is missing or Resend rejects the send, which meant an enquiry
 * could be confirmed to the buyer and then exist nowhere at all.
 *
 * Every lead is written to Blob storage first. Email is the notification;
 * this is the record. If both fail, the caller tells the buyer to email
 * directly rather than pretending the message got through.
 *
 * Files land at leads/YYYY-MM-DD/<time>-<type>-<random>.json so they sort
 * chronologically in the Vercel Blob browser.
 */
export async function storeLead(payload: Record<string, unknown>): Promise<{ stored: boolean; url?: string; error?: string }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { stored: false, error: 'BLOB_READ_WRITE_TOKEN not configured' };
  }

  try {
    const now = new Date();
    const day = now.toISOString().slice(0, 10);
    const time = now.toISOString().slice(11, 19).replace(/:/g, '-');
    const kind = typeof payload.type === 'string' ? payload.type : 'lead';
    const suffix = Math.random().toString(36).slice(2, 8);

    const { url } = await put(
      `leads/${day}/${time}-${kind}-${suffix}.json`,
      JSON.stringify(payload, null, 2),
      { access: 'public', contentType: 'application/json', addRandomSuffix: false }
    );
    return { stored: true, url };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'blob write failed';
    console.error('[leads] store failed:', error);
    return { stored: false, error };
  }
}
