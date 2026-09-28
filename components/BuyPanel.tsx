'use client';

import { useEffect, useState } from 'react';
import type { Listing } from '@/lib/types';
import { PLATFORM_FEE_LABEL, PLATFORM_FEE_RATE, gbp, quoteFor } from '@/lib/pricing';
import { retirementExplainer, statusLabel, unitKindOf, unitNoun } from '@/lib/status';
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

  const kind = unitKindOf(listing);
  const isPending = kind === 'pending-unit';
  const noRegistry = kind === 'self-reported-unit';
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
      <div className="rounded-2xl border border-white/10 bg-forest-900/60 p-6 shadow-sm">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-sand-100/55">
              {canBuy ? 'Price' : 'Indicative price'}
            </p>
            <p className="text-3xl font-semibold text-sand-50">
              {gbp(listing.pricePerTonne)}
              <span className="text-sm font-normal text-sand-100/70"> / tCO₂e</span>
            </p>
          </div>
          <p className="text-xs text-sand-100/70 text-right">
            {canBuy
              ? `${available.toLocaleString()} available`
              : soldOut
              ? 'Sold out'
              : 'Availability confirmed on request'}
          </p>
        </div>

        <div className="mt-5">
          <label htmlFor="buy-tonnes" className="text-xs uppercase tracking-wider text-sand-100/55">Tonnes</label>
          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              aria-label="Decrease tonnes by 10"
              onClick={() => setTonnes(clamp(tonnes - 10))}
              className="h-9 w-9 rounded-lg border border-white/15 text-sand-100/85 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold-500"
            >–</button>
            <input
              id="buy-tonnes"
              type="number"
              min={1}
              max={canBuy ? available : undefined}
              value={tonnes}
              onChange={(e) => setTonnes(clamp(Number(e.target.value || 1)))}
              className="h-9 flex-1 rounded-lg border border-white/15 bg-forest-900/50 text-center text-sm text-sand-50 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
            <button
              type="button"
              aria-label="Increase tonnes by 10"
              onClick={() => setTonnes(clamp(tonnes + 10))}
              className="h-9 w-9 rounded-lg border border-white/15 text-sand-100/85 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold-500"
            >+</button>
          </div>
        </div>

        {isPending || noRegistry ? (
          /* A Pending Issuance Unit cannot be retired — there is nothing
             verified to retire yet — and a self-verified project has no
             registry to retire on. Offering a retirement tickbox in either
             case promises something that will not happen. */
          <p className="mt-4 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2.5 text-xs leading-relaxed text-sand-100/90">
            <strong className="text-amber-300">{isPending ? 'Pending units are assigned, not retired.' : 'No registry retirement available.'}</strong>{' '}
            {retirementExplainer(listing)}
          </p>
        ) : (
          <label className="mt-4 flex items-start gap-2 text-sm text-sand-100/85 cursor-pointer">
            <input
              type="checkbox"
              checked={retire}
              onChange={(e) => setRetire(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-white/25 bg-forest-900/50 text-gold-500 focus:ring-gold-500"
            />
            <span>Retire credits in my name on the {listing.registry} registry</span>
          </label>
        )}

        <dl className="mt-5 space-y-1.5 text-sm border-t border-white/10 pt-4">
          <Row
            label={`${unitNoun(listing)} (${tonnes.toLocaleString()} × ${gbp(listing.pricePerTonne)})`}
            value={gbp(subtotal)}
          />
          <Row label={PLATFORM_FEE_LABEL} value={gbp(fee)} />
          <div className="border-t border-white/10 pt-2 mt-1">
            <Row
              label={<strong>{canBuy ? 'Total' : 'Indicative total'}</strong>}
              value={<strong className="text-sand-50">{gbp(total)}</strong>}
            />
          </div>
          <p className="pt-1 text-[11px] leading-relaxed text-sand-100/60">
            The {(PLATFORM_FEE_RATE * 100).toFixed(0)}% fee is Atlas&rsquo;s only charge. It is added on top of the
            price the seller sets and paid by you at checkout; the seller receives the listed price in full. VAT,
            registry transfer fees and any currency conversion your bank applies are not included in this figure and
            are confirmed in writing before you pay.
          </p>
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
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
            <p className="mt-3 text-[11px] text-sand-100/55 text-center">
              Secure checkout via Stripe. You can cancel any time before payment.
            </p>
          </>
        ) : (
          <>
            <button onClick={() => setQuoteOpen(true)} className="btn-primary w-full mt-5">
              Request a quote
            </button>
            <p className="mt-3 text-[11px] leading-relaxed text-sand-100/60 text-center">
              {soldOut
                ? 'This allocation has gone. We can usually source more from the same project — tell us what you need.'
                : isPending
                ? 'The indicative price is the 2025 UK market average, not a figure from this developer. We confirm the real price and how many pending units this project has left before you commit to anything.'
                : noRegistry
                ? 'We source this project to order and confirm with the developer what measurement and cancellation evidence they can provide, in writing, before any payment is taken.'
                : 'We source this project to order. You will get a firm price, vintage and registry serial numbers in writing before any payment is taken.'}
            </p>
          </>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-sand-100/85">
        <p className="font-semibold mb-2 text-sand-50">Buying in volume?</p>
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
          retire: isPending || noRegistry ? false : retire,
          registry: listing.registry,
          unitType: listing.unitType,
          unitKind: kind,
          unitLabel: statusLabel(listing)
        }}
      />
    </aside>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-sand-100/70">{label}</span>
      <span className="whitespace-nowrap text-sand-100">{value}</span>
    </div>
  );
}
