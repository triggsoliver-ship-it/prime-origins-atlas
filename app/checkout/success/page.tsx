import Link from 'next/link';

export default function SuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
  return (
    <div className="container-narrow py-20 text-center">
      <div className="mx-auto h-14 w-14 grid place-items-center rounded-full bg-forest-700 text-white text-2xl">✓</div>
      <h1 className="mt-6 text-3xl font-semibold text-forest-900">Thank you — your order is confirmed.</h1>
      <p className="mt-3 text-forest-700/85 max-w-lg mx-auto">
        We've received your payment and our team will retire your credits on the registry within 48 hours.
        You'll receive a retirement certificate by email.
      </p>
      {searchParams.session_id && (
        <p className="mt-4 text-xs text-forest-600 font-mono">Order ref: {searchParams.session_id.slice(-12)}</p>
      )}
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/browse" className="btn-primary">Browse more credits</Link>
        <Link href="/" className="btn-secondary">Back to home</Link>
      </div>
    </div>
  );
}
