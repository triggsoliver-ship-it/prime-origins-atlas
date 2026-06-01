'use client';

import { useState } from 'react';

type DocEntry = { id: string; label: string; mode: 'upload' | 'url'; file?: File; url?: string };

export default function SellPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tier, setTier] = useState<'prime-origins-verified' | 'self-verified'>('prime-origins-verified');
  const [docs, setDocs] = useState<DocEntry[]>([{ id: crypto.randomUUID(), label: '', mode: 'upload' }]);

  function updateDoc(id: string, patch: Partial<DocEntry>) {
    setDocs((arr) => arr.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }
  function addDoc() {
    setDocs((arr) => [...arr, { id: crypto.randomUUID(), label: '', mode: 'upload' }]);
  }
  function removeDoc(id: string) {
    setDocs((arr) => arr.filter((d) => d.id !== id));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    // Tier (controlled)
    fd.set('tier', tier);
    // Attach docs
    docs.forEach((d, i) => {
      if (!d.label.trim()) return;
      fd.append(`docLabel_${i}`, d.label);
      if (d.mode === 'upload' && d.file) fd.append(`docFile_${i}`, d.file);
      if (d.mode === 'url' && d.url) fd.append(`docUrl_${i}`, d.url);
    });
    try {
      const res = await fetch('/api/sell', { method: 'POST', body: fd });
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
          Thanks for submitting your project to Prime Origins Atlas. Our vetting team will review your submission
          and supporting documents. Expect to hear back within 5 business days.
        </p>
      </div>
    );
  }

  return (
    <div className="container-narrow py-12 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-semibold text-forest-900">List your project on Atlas</h1>
      <p className="mt-3 text-forest-700/85">
        Atlas accepts both <strong>registry-verified</strong> credits (Verra, Gold Standard, ACR, Puro.earth,
        Climate Action Reserve) and <strong>self-verified</strong> credits where you provide your own documentation.
        Every project is manually reviewed before going live.
      </p>

      <div className="mt-8 rounded-2xl border border-forest-100 bg-white p-2 inline-flex">
        <TierBtn active={tier === 'prime-origins-verified'} onClick={() => setTier('prime-origins-verified')}>
          Registry-verified
        </TierBtn>
        <TierBtn active={tier === 'self-verified'} onClick={() => setTier('self-verified')}>
          Self-verified
        </TierBtn>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-forest-100 bg-white p-6 md:p-8 space-y-6">
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
          <Field
            name="projectId"
            label={tier === 'prime-origins-verified' ? 'Registry project ID' : 'Project reference / ID'}
            required
            placeholder={tier === 'prime-origins-verified' ? 'e.g. VCS-2613, GS-852' : 'e.g. your internal ID'}
          />
          {tier === 'prime-origins-verified' ? (
            <Select name="registry" label="Registry" required options={['Verra', 'Gold Standard', 'ACR', 'Puro.earth', 'Climate Action Reserve']} />
          ) : (
            <Field name="registry" label="Registry" defaultValue="Self-Verified" readOnly />
          )}
          <Select name="category" label="Category" required options={['nature-based', 'engineered-removal', 'renewable-energy', 'community']} />
          <Field name="country" label="Country" required />
          <Field name="region" label="Region (optional)" />
          <Field name="vintage" label="Vintage year" type="number" required placeholder="2025" />
          <Field name="tonnesAvailable" label="Tonnes available" type="number" required placeholder="10000" />
          <Field name="pricePerTonne" label="Asking price (USD / tCO₂e)" type="number" required placeholder="15" />
          <Field name="methodology" label="Methodology" required placeholder={tier === 'prime-origins-verified' ? 'e.g. VM0007 REDD+ MF' : 'Describe your methodology'} />
        </div>

        <h2 className="text-lg font-semibold text-forest-900 pt-2">Project location</h2>
        <p className="text-sm text-forest-700/85 -mt-3">Pin the project's central point so buyers see it on a map.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <Field name="latitude" label="Latitude" type="number" step="any" required placeholder="e.g. 50.85" />
          <Field name="longitude" label="Longitude" type="number" step="any" required placeholder="e.g. 0.10" />
        </div>

        <div>
          <label className="block text-sm font-medium text-forest-800 mb-1">Project summary <span className="text-forest-600">*</span></label>
          <textarea name="summary" required rows={4} placeholder="What does the project do? Methodology highlights, co-benefits, why it's high-integrity…" className="w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
        </div>

        <h2 className="text-lg font-semibold text-forest-900 pt-2">Verification documents</h2>
        <p className="text-sm text-forest-700/85 -mt-3">
          {tier === 'self-verified'
            ? 'Required: upload or link to your COA, soil/biomass reports, methodology disclosure, or any third-party validation.'
            : 'Optional: validation/verification reports, PDDs, or other supporting documents.'}
        </p>

        <div className="space-y-3">
          {docs.map((d, idx) => (
            <div key={d.id} className="rounded-xl border border-forest-100 p-4">
              <div className="flex gap-3 items-start">
                <input
                  type="text"
                  value={d.label}
                  onChange={(e) => updateDoc(d.id, { label: e.target.value })}
                  placeholder={`Document ${idx + 1} label (e.g. Certificate of Analysis)`}
                  className="flex-1 rounded-lg border border-forest-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
                <button type="button" onClick={() => removeDoc(d.id)} className="text-xs text-forest-600 px-2">Remove</button>
              </div>
              <div className="mt-3 flex gap-1.5 text-xs">
                <button type="button" onClick={() => updateDoc(d.id, { mode: 'upload' })} className={`px-3 py-1 rounded-full ${d.mode === 'upload' ? 'bg-forest-700 text-white' : 'bg-forest-50 text-forest-700'}`}>Upload file</button>
                <button type="button" onClick={() => updateDoc(d.id, { mode: 'url' })} className={`px-3 py-1 rounded-full ${d.mode === 'url' ? 'bg-forest-700 text-white' : 'bg-forest-50 text-forest-700'}`}>Paste URL</button>
              </div>
              <div className="mt-3">
                {d.mode === 'upload' ? (
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.kml,.geojson"
                    onChange={(e) => updateDoc(d.id, { file: e.target.files?.[0] })}
                    className="block w-full text-sm text-forest-800 file:mr-3 file:rounded-lg file:border-0 file:bg-forest-700 file:px-3 file:py-1.5 file:text-white"
                  />
                ) : (
                  <input
                    type="url"
                    value={d.url || ''}
                    onChange={(e) => updateDoc(d.id, { url: e.target.value })}
                    placeholder="https://drive.google.com/… or https://your-host/file.pdf"
                    className="w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                )}
              </div>
            </div>
          ))}
          <button type="button" onClick={addDoc} className="text-sm text-forest-700 font-medium hover:text-forest-600">+ Add another document</button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex items-center justify-between pt-2 border-t border-forest-100">
          <p className="text-xs text-forest-700/70 max-w-xs">By submitting you authorise Prime Origins to verify the information provided.</p>
          <button disabled={loading} className="btn-primary disabled:opacity-60">
            {loading ? 'Submitting…' : 'Submit for review'}
          </button>
        </div>
      </form>
    </div>
  );
}

function TierBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-sm font-medium transition ${active ? 'bg-forest-700 text-white' : 'text-forest-700 hover:bg-forest-50'}`}
    >
      {children}
    </button>
  );
}

function Field({ name, label, type = 'text', required, placeholder, defaultValue, readOnly, step }: { name: string; label: string; type?: string; required?: boolean; placeholder?: string; defaultValue?: string; readOnly?: boolean; step?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-forest-800 mb-1">{label}{required && <span className="text-forest-600"> *</span>}</label>
      <input name={name} type={type} required={required} placeholder={placeholder} defaultValue={defaultValue} readOnly={readOnly} step={step} className={`w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 ${readOnly ? 'bg-forest-50' : ''}`} />
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
