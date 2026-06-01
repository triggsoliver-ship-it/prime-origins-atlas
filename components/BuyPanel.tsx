'use client';

import { useState } from 'react';
import type { Listing } from '@/lib/types';

export default function BuyPanel({ listing }: { listing: Listing }) {
  const [tonnes, setTonnes] = useState(10);
  const [retire, setRetire] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = tonnes * listing.pricePerTonne;
  const platformFee = subtotal * 0.04; // 4% Prime Origins fee
  const total = subtotal + platformFee;

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ listingId: listing.id, tonnes, retire })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setLoading(false);
    }
  }

  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-forest-600">Price</p>
            <p className="text-3xl font-semibold text-forest-900">${listing.pricePerTonne.toFixed(2)}
              <span className="text-sm font-normal text-forest-700"> / tCO₂e</span></p>
          </div>
          <p className="text-xs text-forest-700">{listing.tonnesAvailable.toLocaleString()} available</p>
        </div>

        <div className="mt-5">
          <label className="text-xs uppercase tracking-wider text-forest-600">Tonnes</label>
          <div className="mt-1 flex items-center gap-2">
            <button onClick={() => setTonnes(Math.max(1, tonnes - 10))} className="h-9 w-9 rounded-lg border border-forest-200 text-forest-700 hover:bg-forest-50">–</button>
            <input
              type="number"
              min={1}
              max={listing.tonnesAvailable}
              value={tonnes}
              onChange={(e) => setTonnes(Math.max(1, Math.min(listing.tonnesAvailable, Number(e.target.value || 1))))}
              className="h-9 flex-1 rounded-lg border border-forest-200 text-center text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
            <button onClick={() => setTonnes(Math.min(listing.tonnesAvailable, tonnes + 10))} className="h-9 w-9 rounded-lg border border-forest-200 text-forest-700 hover:bg-forest-50">+</button>
          </div>
        </div>

        <label className="mt-4 flex items-start gap-2 text-sm text-forest-800 cursor-pointer">
          <input type="checkbox" checked={retire} onChange={(e) => setRetire(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-forest-300 text-forest-700 focus:ring-forest-500" />
          <span>Retire credits in my name on the {listing.registry} registry (certificate within 48h)</span>
        </label>

        <dl className="mt-5 space-y-1.5 text-sm border-t border-forest-100 pt-4">
          <Row label={`Credits (${tonnes} × $${listing.pricePerTonne.toFixed(2)})`} value={`$${subtotal.toFixed(2)}`} />
          <Row label="Platform fee (4%)" value={`$${platformFee.toFixed(2)}`} />
          <div className="border-t border-forest-100 pt-2 mt-1">
            <Row label={<strong>Total</strong>} value={<strong className="text-forest-900">${total.toFixed(2)}</strong>} />
          </div>
        </dl>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="btn-primary w-full mt-5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Redirecting…' : 'Continue to checkout'}
        </button>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        <p className="mt-3 text-[11px] text-forest-700/70 text-center">Secure checkout via Stripe. You can cancel any time before payment.</p>
      </div>

      <div className="mt-4 rounded-2xl border border-forest-100 bg-forest-50/50 p-5 text-sm text-forest-800">
        <p className="font-semibold mb-1">Buying for an organisation?</p>
        <p>For orders over 1,000 tonnes we offer institutional pricing and forward contracts. <a className="underline" href="mailto:hello@primeorigins.com">Talk to us</a>.</p>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <span className="text-forest-700">{label}</span>
      <span>{value}</span>
    </div>
  );
}
