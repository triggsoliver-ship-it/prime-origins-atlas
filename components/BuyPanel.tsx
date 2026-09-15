'use client';

import { useEffect, useState } from 'react';
import type { Listing } from '@/lib/types';
import { PLATFORM_FEE_LABEL, gbp, quoteFor } from '@/lib/pricing';
import InquiryDialog from './InquiryDialog';

/**
 * Two ways to buy, and the panel picks the honest one.
 *
 * If Atlas holds the credits (lib/saleable.ts), this is a card checkout.
 * If it does not, it is a quote request: same tonnage and retirement choices,
 * but the buyer gets a firm price and serial numbers before paying, and no
 * promise is made about stock that does not exist.
 *
 * It defaults to the quote route until the server says otherwise, so a slow
 * network can never flash a checkout button on a project we cannot deliver.
 */
export default function BuyPanel({ listing }: { listing: Listing }) {
  const [tonnes, setTonnes] = useState(10);
  const [retire, setRetire] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);

  const [available, setAvailable] = useState(listing.tonnesAvailable);
  const [saleable, setSaleable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/inventory?listingId=${encodeURIComponent(listing.id)}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d) return;
        if (typeof d.available === 'number') setAvailable(d.available);
        setSaleable(Boolean(d.saleable));
      })
      .catch(() => {
        // Stay on the quote route rather than guessing we can take a payment.
        if (!cancelled) setSaleable(false);
      });
    return () => { cancelled = true; };
  }, [listing.id]);

  const canBuy = saleable === true && available > 0;
  const soldOut = saleable === true && available <= 0;
  const { subtotal, fee, total } = quoteFor(listing.pricePerTonne, tonnes);

  function clamp(n: number) {
    const ceiling = canBuy ? Math.max(1, available) : 1_000_000;
    return Math.max(1, Math.min(ceiling, Math.round(n) || 1));
  }

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
      if (!res.ok) {
        if (typeof data.available === 'number') {
          setAvailable(data.available);
          setTonnes((t) => clamp(t));
        }
        throw new Error(data.error || 'Checkout failed');
      }
      window.location.href = data.url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setLoading(false);
    }
  }

  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-forest-600">
              {canBuy ? 'Price' : 'Indicative price'}
            </p>
            <p className="text-3xl font-semibold text-forest-900">
              {gbp(listing.pricePerTonne)}
              <span className="text-sm font-normal text-forest-700"> / tCO₂e</span>
            </p>
          </div>
          <p className="text-xs text-forest-700 text-right">
            {canBuy
              ? `${available.toLocaleString()} available`
              : soldOut
              ? 'Sold out'
              : 'Sourced to order'}
          </p>
        </div>

        <div className="mt-5">
          <label htmlFor="buy-tonnes" className="text-xs uppercase tracking-wider text-forest-600">Tonnes</label>
          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              aria-label="Decrease tonnes by 10"
              onClick={() => setTonnes(clamp(tonnes - 10))}
              className="h-9 w-9 rounded-lg border border-forest-200 text-forest-700 hover:bg-forest-50 focus:outline-none focus:ring-2 focus:ring-forest-500"
            >–</button>
            <input
              id="buy-tonnes"
              type="number"
              min={1}
              max={canBuy ? available : undefined}
              value={tonnes}
              onChange={(e) => setTonnes(clamp(Number(e.target.value || 1)))}
              className="h-9 flex-1 rounded-lg border border-forest-200 text-center text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
            <button
              type="button"
              aria-label="Increase tonnes by 10"
              onClick={() => setTonnes(clamp(tonnes + 10))}
              className="h-9 w-9 rounded-lg border border-forest-200 text-forest-700 hover:bg-forest-50 focus:outline-none focus:ring-2 focus:ring-forest-500"
            >+</button>
          </div>
        </div>

        <label className="mt-4 flex items-start gap-2 text-sm text-forest-800 cursor-pointer">
          <input
            type="checkbox"
            checked={retire}
            onChange={(e) => setRetire(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-forest-300 text-forest-700 focus:ring-forest-500"
          />
          <span>Retire credits in my name on the {listing.registry} registry</span>
        </label>

        <dl className="mt-5 space-y-1.5 text-sm border-t border-forest-100 pt-4">
          <Row label={`Credits (${tonnes.toLocaleString()} × ${gbp(listing.pricePerTonne)})`} value={gbp(subtotal)} />
          <Row label={PLATFORM_FEE_LABEL} value={gbp(fee)} />
          <div className="border-t border-forest-100 pt-2 mt-1">
            <Row
              label={<strong>{canBuy ? 'Total' : 'Indicative total'}</strong>}
              value={<strong className="text-forest-900">{gbp(total)}</strong>}
            />
          </div>
        </dl>

        {canBuy ? (
          <>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary w-full mt-5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Redirecting…' : 'Continue to checkout'}
            </button>
            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
            <p className="mt-3 text-[11px] text-forest-700/70 text-center">
              Secure checkout via Stripe. You can cancel any time before payment.
            </p>
          </>
        ) : (
          <>
            <button onClick={() => setQuoteOpen(true)} className="btn-primary w-full mt-5">
              Request a quote
            </button>
            <p className="mt-3 text-[11px] leading-relaxed text-forest-700/80 text-center">
              {soldOut
                ? 'This allocation has gone. We can usually source more from the same project — tell us what you need.'
                : 'We source this project to order. You will get a firm price, vintage and registry serial numbers in writing before any payment is taken.'}
            </p>
          </>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-forest-100 bg-forest-50/50 p-5 text-sm text-forest-800">
        <p className="font-semibold mb-2">Buying in volume?</p>
        <p className="mb-3">Above 1,000 tonnes we quote institutional pricing and can structure a forward contract.</p>
        <button onClick={() => setQuoteOpen(true)} className="btn-secondary w-full">
          Talk to us about a larger order
        </button>
      </div>

      <InquiryDialog
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        mode="quote"
        context={{
          listingId: listing.id,
          listingName: listing.projectName,
          tonnes,
          retire,
          registry: listing.registry
        }}
      />
    </aside>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-forest-700">{label}</span>
      <span className="whitespace-nowrap">{value}</span>
    </div>
  );
}
