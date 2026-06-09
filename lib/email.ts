import { Resend } from 'resend';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'oliver@primeorigins.org';

/**
 * Send a notification email. Uses Resend when RESEND_API_KEY is set.
 *
 * For development without a verified domain, we use Resend's `onboarding@resend.dev`
 * sender. Once you've verified `primeorigins.org` in Resend, change FROM_ADDRESS to
 * something like 'Atlas <noreply@primeorigins.org>'.
 */
const FROM_ADDRESS = process.env.EMAIL_FROM || 'Prime Origins Atlas <onboarding@resend.dev>';

export async function sendAdminEmail({
  subject,
  html,
  text,
  replyTo
}: {
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<{ sent: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn('[email] RESEND_API_KEY not set — skipping email send. Subject:', subject);
    return { sent: false, error: 'RESEND_API_KEY not configured' };
  }
  try {
    const resend = new Resend(key);
    const res = await resend.emails.send({
      from: FROM_ADDRESS,
      to: ADMIN_EMAIL,
      subject,
      html,
      text,
      reply_to: replyTo
    });
    if (res.error) {
      console.error('[email] Resend error', res.error);
      return { sent: false, error: res.error.message };
    }
    return { sent: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'send failed';
    console.error('[email] exception', msg);
    return { sent: false, error: msg };
  }
}

export function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function fieldsToHtml(obj: Record<string, unknown>): string {
  const rows = Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => {
      const value = typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v);
      return `<tr><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#173a27;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;color:#1f2937;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`;
    })
    .join('');
  return `<table style="border-collapse:collapse;width:100%;font-family:system-ui,-apple-system,sans-serif;font-size:14px">${rows}</table>`;
}
