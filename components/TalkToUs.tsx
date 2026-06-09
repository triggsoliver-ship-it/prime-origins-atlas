'use client';

import { useState } from 'react';
import InquiryDialog from './InquiryDialog';

export default function TalkToUs({
  variant = 'banner',
  listingId,
  listingName
}: {
  variant?: 'banner' | 'inline-button';
  listingId?: string;
  listingName?: string;
}) {
  const [open, setOpen] = useState(false);

  if (variant === 'inline-button') {
    return (
      <>
        <button onClick={() => setOpen(true)} className="btn-secondary w-full">
          Ask about this project
        </button>
        <InquiryDialog open={open} onClose={() => setOpen(false)} context={{ listingId, listingName }} />
      </>
    );
  }

  return (
    <>
      <section className="container-narrow py-14">
        <div className="rounded-3xl bg-forest-700 text-sand-50 p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 overflow-hidden relative">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-forest-500/30 blur-3xl" aria-hidden />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-semibold">Buying in volume or building a portfolio?</h2>
            <p className="mt-2 text-sand-100/85 max-w-xl">Our team helps corporate buyers source institutional-scale orders, blend tiers across registries, and lock in forward contracts. Talk to us before you commit.</p>
          </div>
          <button onClick={() => setOpen(true)} className="relative btn-primary bg-sand-50 text-forest-900 hover:bg-white whitespace-nowrap">
            Talk to us →
          </button>
        </div>
      </section>
      <InquiryDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
