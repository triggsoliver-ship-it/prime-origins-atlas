import Link from 'next/link';
import Stripe from 'stripe';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Your carbon credit order is confirmed.',
  robots: { index: false, follow: false }
};

// Depends on the session_id query param and a live Stripe lookup.
export const dynamic = 'force-dynamic';

type PaymentState = 'paid' | 'processing' | 'unpaid' | 'unverified';

async function checkSession(sessionId: string | undefined): Promise<{ state: PaymentState; tonnes?: string; retire?: boolean }> {
  if (!sessionId) return { state: 'unverified' };
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return { state: 'unverified' };

  try {
    const stripe = new Stripe(key, { apiVersion: '2024-06-20' });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const tonnes = session.metadata?.tonnes;
    const retire = session.metadata?.retire === 'yes';
    if (session.payment_status === 'paid') return { state: 'paid', tonnes, retire };
    if (session.payment_status === 'no_payment_required') return { state: 'paid', tonnes, retire };
    if (session.status === 'open') return { state: 'unpaid', tonnes, retire };
    return { state: 'processing', tonnes, retire };
  } catch (e) {
    console.error('[checkout success] could not verify session', e);
    return { state: 'unverified' };
  }
}

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  // Next 15: searchParams is a Promise.
  const { session_id: sessionId } = await searchParams;
  const { state, tonnes, retire } = await checkSession(sessionId);

  if (state === 'paid') {
    return (
      <div className="container-narrow py-20 text-center">
        <div className="mx-auto h-14 w-14 grid place-items-center rounded-full bg-forest-700 text-white text-2xl">✓</div>
        <h1 className="mt-6 text-3xl font-semibold text-forest-900">Thank you — your order is confirmed.</h1>
        <p className="mt-3 text-forest-700/85 max-w-lg mx-auto">
          We&rsquo;ve received your payment{tonnes ? ` for ${Number(tonnes).toLocaleString()} tCO₂e` : ''}.{' '}
          {retire
            ? 'Our team will retire your credits on the registry within 48 hours and email you the retirement certificate.'
            : 'Our team will be in touch to arrange transfer of the credits.'}
        </p>
        {sessionId && <p className="mt-4 text-xs text-forest-600 font-mono">Order ref: {sessionId.slice(-12)}</p>}
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/browse" className="btn-primary">Browse more credits</Link>
          <Link href="/" className="btn-secondary">Back to home</Link>
        </div>
      </div>
    );
  }

  if (state === 'processing') {
    return (
      <div className="container-narrow py-20 text-center">
        <div className="mx-auto h-14 w-14 grid place-items-center rounded-full bg-forest-100 text-forest-800 text-2xl">…</div>
        <h1 className="mt-6 text-3xl font-semibold text-forest-900">Your payment is still processing.</h1>
        <p className="mt-3 text-forest-700/85 max-w-lg mx-auto">
          Some payment methods take a little while to clear. We&rsquo;ll email you as soon as it settles — there&rsquo;s no need to pay again.
        </p>
        {sessionId && <p className="mt-4 text-xs text-forest-600 font-mono">Order ref: {sessionId.slice(-12)}</p>}
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-secondary">Back to home</Link>
        </div>
      </div>
    );
  }

  // 'unpaid' or 'unverified' — never claim we took money we cannot see.
  return (
    <div className="container-narrow py-20 text-center">
      <div className="mx-auto h-14 w-14 grid place-items-center rounded-full bg-forest-100 text-forest-800 text-2xl">?</div>
      <h1 className="mt-6 text-3xl font-semibold text-forest-900">We couldn&rsquo;t confirm this order.</h1>
      <p className="mt-3 text-forest-700/85 max-w-lg mx-auto">
        No completed payment is showing against this link. If you believe you have been charged, email{' '}
        <a href="mailto:oliver@primeorigins.org" className="text-forest-700 underline">oliver@primeorigins.org</a>{' '}
        with the reference below and we&rsquo;ll look into it straight away.
      </p>
      {sessionId && <p className="mt-4 text-xs text-forest-600 font-mono">Reference: {sessionId.slice(-12)}</p>}
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/browse" className="btn-primary">Back to browse</Link>
      </div>
    </div>
  );
}
