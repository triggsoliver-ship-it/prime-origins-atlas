'use client';

import { useState, useEffect } from 'react';

export type InquiryContext = {
  listingId?: string;
  listingName?: string;
  tonnes?: number;
  retire?: boolean;
  registry?: string;
  unitType?: 'piu' | 'wcu';
};

/**
 * One dialog, two jobs.
 *
 * mode="general" is the old "talk to us" form.
 * mode="quote" is the buying route for any project Atlas does not hold stock
 * of: it carries the tonnage and retirement choice the buyer already made on
 * the listing page, so the enquiry that lands is a real brief and not a
 * "please contact me".
 */
export default function InquiryDialog({
  open,
  onClose,
  context,
  mode = 'general'
}: {
  open: boolean;
  onClose: () => void;
  context?: InquiryContext;
  mode?: 'general' | 'quote';
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fallbackEmail, setFallbackEmail] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // A fresh dialog should not open on last time's confirmation screen.
  useEffect(() => {
    if (open) { setDone(false); setError(null); setFallbackEmail(null); setLoading(false); }
  }, [open]);

  if (!open) return null;

  const isQuote = mode === 'quote';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, string> = {};
    fd.forEach((v, k) => { payload[k] = String(v); });

    if (context?.listingId) payload.listingId = context.listingId;
    if (context?.listingName) payload.listingName = context.listingName;
    if (context?.registry) payload.registry = context.registry;
    if (isQuote) {
      payload.type = 'quote';
      if (context?.unitType) {
        payload.unitType = context.unitType === 'piu' ? 'Pending Issuance Units' : 'Verified Woodland Carbon Units';
      }
      payload.retirement = context?.unitType === 'piu'
        ? 'N/A — pending units are assigned, not retired'
        : context?.retire ? 'Yes — retire in buyer name' : 'No — transfer only';
    }

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body?.contactEmail) setFallbackEmail(String(body.contactEmail));
        throw new Error(body?.error || 'Submission failed');
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="inquiry-dialog-title">
      <div className="absolute inset-0 bg-forest-900/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-forest-600 hover:text-forest-900 text-xl leading-none" aria-label="Close dialog">×</button>

        {done ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-12 w-12 grid place-items-center rounded-full bg-forest-700 text-white text-xl" aria-hidden>✓</div>
            <h3 id="inquiry-dialog-title" className="mt-4 text-xl font-semibold text-forest-900">
              {isQuote ? 'Quote request received.' : 'Thanks — we’ll be in touch.'}
            </h3>
            <p className="mt-2 text-sm text-forest-700">
              {isQuote
                ? 'We’ll come back with a firm price, vintage and registry serial numbers within one business day. Nothing is charged until you accept.'
                : 'Expect a reply from our team within one business day.'}
            </p>
            <button onClick={onClose} className="btn-primary mt-6">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <h3 id="inquiry-dialog-title" className="text-xl font-semibold text-forest-900">
              {isQuote ? 'Request a quote' : 'Talk to our team'}
            </h3>
            <p className="mt-1 text-sm text-forest-700">
              {isQuote
                ? 'Tell us what you need and we’ll source it. A firm price and the serial numbers come back to you before any payment is taken.'
                : 'For portfolio enquiries, large orders (1,000+ tonnes), forward contracts or general questions.'}
            </p>

            {context?.listingName && (
              <div className="mt-3 rounded-lg bg-forest-50 px-3 py-2.5 text-xs text-forest-800">
                <p><span className="text-forest-700/80">Project:</span> <strong>{context.listingName}</strong></p>
                {isQuote && typeof context.tonnes === 'number' && (
                  <p className="mt-1"><span className="text-forest-700/80">Volume:</span> <strong>{context.tonnes.toLocaleString()} tCO₂e</strong></p>
                )}
                {isQuote && context.unitType === 'piu' && (
                  <p className="mt-1"><span className="text-forest-700/80">Unit type:</span> <strong>Pending Issuance Units</strong></p>
                )}
                {isQuote && context.unitType !== 'piu' && (
                  <p className="mt-1">
                    <span className="text-forest-700/80">Retirement:</span>{' '}
                    <strong>{context.retire ? `Yes, in your name on the ${context.registry ?? 'registry'}` : 'No, transfer only'}</strong>
                  </p>
                )}
              </div>
            )}

            <div className="mt-5 space-y-3">
              <Field name="name" label="Your name" required autoComplete="name" />
              <Field name="email" label="Work email" type="email" required autoComplete="email" />
              <Field name="company" label="Company" autoComplete="organization" />
              <Field
                name="tonnes"
                label={isQuote ? 'Volume (tCO₂e)' : 'Tonnes of interest (optional)'}
                type="number"
                placeholder="e.g. 5000"
                defaultValue={isQuote && context?.tonnes ? String(context.tonnes) : undefined}
              />
              {isQuote && (
                <Field name="deadline" label="When do you need it by? (optional)" placeholder="e.g. before year end" />
              )}
              <div>
                <label htmlFor="inquiry-message" className="block text-sm font-medium text-forest-800 mb-1">
                  {isQuote ? 'Anything else we should know?' : 'Message'}
                </label>
                <textarea
                  id="inquiry-message"
                  name="message"
                  rows={isQuote ? 3 : 4}
                  placeholder={isQuote ? 'Vintage requirements, reporting standard, budget per tonne…' : 'What are you looking for?'}
                  required
                  defaultValue={isQuote && context?.listingName ? `Quote request for ${context.listingName}.` : undefined}
                  className="w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>
            </div>

            {error && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <p>{error}</p>
                {fallbackEmail && (
                  <p className="mt-1.5">
                    <a className="font-semibold underline" href={`mailto:${fallbackEmail}?subject=${encodeURIComponent(isQuote ? 'Quote request' : 'Enquiry')}`}>
                      Email {fallbackEmail}
                    </a>
                  </p>
                )}
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-forest-700/70">
                By submitting you agree to our <a className="underline" href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>.
              </p>
              <button disabled={loading} className="btn-primary disabled:opacity-60">
                {loading ? 'Sending…' : isQuote ? 'Request quote' : 'Send enquiry'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  name, label, type = 'text', required, placeholder, defaultValue, autoComplete
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  autoComplete?: string;
}) {
  const id = `inquiry-${name}`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-forest-800 mb-1">
        {label}{required && <span className="text-forest-600"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
      />
    </div>
  );
}
