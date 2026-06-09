'use client';

import { useState, useEffect } from 'react';

export default function InquiryDialog({
  open,
  onClose,
  context
}: {
  open: boolean;
  onClose: () => void;
  context?: { listingId?: string; listingName?: string };
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd);
    if (context?.listingId) (payload as Record<string, string>).listingId = context.listingId;
    if (context?.listingName) (payload as Record<string, string>).listingName = context.listingName;
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Submission failed');
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-forest-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-forest-600 hover:text-forest-900 text-xl leading-none" aria-label="Close">×</button>
        {done ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-12 w-12 grid place-items-center rounded-full bg-forest-700 text-white text-xl">✓</div>
            <h3 className="mt-4 text-xl font-semibold text-forest-900">Thanks — we&apos;ll be in touch.</h3>
            <p className="mt-2 text-sm text-forest-700">Expect a reply from our team within one business day.</p>
            <button onClick={onClose} className="btn-primary mt-6">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <h3 className="text-xl font-semibold text-forest-900">Talk to our team</h3>
            <p className="mt-1 text-sm text-forest-700">For portfolio enquiries, large orders (1,000+ tonnes), forward contracts or general questions.</p>
            {context?.listingName && (
              <p className="mt-2 text-xs text-forest-700/80 bg-forest-50 rounded-lg px-3 py-2">Re: <strong>{context.listingName}</strong></p>
            )}
            <div className="mt-5 space-y-3">
              <Field name="name" label="Your name" required />
              <Field name="email" label="Work email" type="email" required />
              <Field name="company" label="Company" />
              <Field name="tonnes" label="Tonnes of interest (optional)" type="number" placeholder="e.g. 5000" />
              <div>
                <label className="block text-sm font-medium text-forest-800 mb-1">Message</label>
                <textarea name="message" rows={4} placeholder="What are you looking for?" required className="w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="text-xs text-forest-700/70">By submitting you agree to our <a className="underline" href="/privacy" target="_blank">Privacy Policy</a>.</p>
              <button disabled={loading} className="btn-primary disabled:opacity-60">{loading ? 'Sending…' : 'Send enquiry'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ name, label, type = 'text', required, placeholder }: { name: string; label: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-forest-800 mb-1">{label}{required && <span className="text-forest-600"> *</span>}</label>
      <input name={name} type={type} required={required} placeholder={placeholder} className="w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
    </div>
  );
}
