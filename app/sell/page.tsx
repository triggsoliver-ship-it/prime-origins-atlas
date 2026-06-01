'use client';

import { useState } from 'react';

export default function SellPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);
    try {
      const res = await fetch('/api/sell', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Submission failed');
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="container-narrow py-20 text-center">
        <div className="mx-auto h-14 w-14 grid place-items-center rounded-full bg-forest-700 text-white text-2xl">✓</div>
        <h1 className="mt-6 text-3xl font-semibold text-forest-900">Application received</h1>
        <p className="mt-3 text-forest-700/85 max-w-xl mx-auto">
          Thanks for submitting your project to Prime Origins Atlas. Our vetting team will review your registry record,
          methodology, and co-benefit evidence. Expect to hear back within 5 business days.
        </p>
      </div>
    );
  }

  return (
    <div className="container-narrow py-12 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-semibold text-forest-900">List your project on Atlas</h1>
      <p className="mt-3 text-forest-700/85">
        Prime Origins works with project developers issuing under <strong>Verra, Gold Standard, ACR, Puro.earth</strong>,
        and <strong>Climate Action Reserve</strong>. We charge a 4% platform fee on credits sold. No upfront cost.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 rounded-2xl border border-forest-100 bg-white p-6 md:p-8 space-y-6">
        <h2 className="text-lg font-semibold text-forest-900">About your organisation</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field name="orgName" label="Organisation name" required />
          <Field name="contactName" label="Your name" required />
          <Field name="email" label="Email" type="email" required />
          <Field name="phone" label="Phone (optional)" />
        </div>

        <h2 className="text-lg font-semibold text-forest-900 pt-2">About the project</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field name="projectName" label="Project name" required />
          <Field name="projectId" label="Registry project ID" required placeholder="e.g. VCS-2613, GS-852" />
          <Select name="registry" label="Registry" required options={['Verra', 'Gold Standard', 'ACR', 'Puro.earth', 'Climate Action Reserve']} />
          <Select name="category" label="Category" required options={['nature-based', 'engineered-removal', 'renewable-energy', 'community']} />
          <Field name="country" label="Country" required />
          <Field name="vintage" label="Vintage year" type="number" required placeholder="2024" />
          <Field name="tonnesAvailable" label="Tonnes available" type="number" required placeholder="10000" />
          <Field name="pricePerTonne" label="Asking price (USD / tCO₂e)" type="number" required placeholder="15" />
        </div>

        <div>
          <label className="block text-sm font-medium text-forest-800 mb-1">Project summary</label>
          <textarea name="summary" required rows={4} placeholder="Methodology, co-benefits, why this project is high-integrity…" className="w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-forest-800 mb-1">Documentation link (optional)</label>
          <input name="documentationUrl" type="url" placeholder="Link to PDD, validation/verification reports" className="w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-forest-700/70 max-w-xs">By submitting you authorise Prime Origins to verify the registry record.</p>
          <button disabled={loading} className="btn-primary disabled:opacity-60">
            {loading ? 'Submitting…' : 'Submit for review'}
          </button>
        </div>
      </form>
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

function Select({ name, label, options, required }: { name: string; label: string; options: string[]; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-forest-800 mb-1">{label}{required && <span className="text-forest-600"> *</span>}</label>
      <select name={name} required={required} defaultValue="" className="w-full rounded-lg border border-forest-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500">
        <option value="" disabled>Choose…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
