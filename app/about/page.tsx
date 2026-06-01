import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Prime Origins Atlas — High-Integrity Carbon Credit Marketplace',
  description:
    'Prime Origins Atlas is a curated marketplace for high-integrity carbon credits. Our 5-pillar quality framework: additionality, permanence, methodology, co-benefits, traceability.',
  alternates: { canonical: '/about' }
};

export default function About() {
  return (
    <div className="container-narrow py-12 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-semibold text-forest-900">About Prime Origins Atlas</h1>
      <p className="mt-4 text-forest-700/85 text-lg">
        Atlas is the carbon marketplace from <a href="https://www.primeorigins.org" target="_blank" rel="noreferrer" className="underline">Prime Origins</a> — the team behind on-chain origin tracking for verified commodity producers.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-forest-900">Why Atlas exists</h2>
        <p className="mt-3 text-forest-800">
          The voluntary carbon market still struggles with fragmented data, inconsistent quality signals, and double-counting risk.
          We built Atlas so buyers can compare credits against the things that matter — registry, methodology, vintage, permanence,
          buffer pool, and substantive co-benefits — instead of glossy storytelling alone.
        </p>
      </section>

      <section id="quality" className="mt-10">
        <h2 className="text-xl font-semibold text-forest-900">Our quality framework</h2>
        <p className="mt-3 text-forest-800">Every project on Atlas is reviewed against five dimensions before listing:</p>
        <ul className="mt-4 space-y-3">
          <Item label="Additionality" body="The reductions or removals would not have happened without the project's carbon finance." />
          <Item label="Permanence" body="Storage durability is appropriate to the credit type, with adequate buffer-pool contributions for reversal risk." />
          <Item label="Methodology rigour" body="Approved methodology under the issuing registry, with current validation/verification reports." />
          <Item label="Co-benefit substance" body="Stated SDG and biodiversity claims map to measurable, third-party-verifiable outcomes." />
          <Item label="Traceability" body="Public serial numbers, transparent retirement, and clean chain of custody from issuance to retirement." />
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-forest-900">Get in touch</h2>
        <p className="mt-3 text-forest-800">
          Buyer questions, seller applications, or media: <a className="underline" href="mailto:hello@primeorigins.com">hello@primeorigins.com</a>.
        </p>
      </section>
    </div>
  );
}

function Item({ label, body }: { label: string; body: string }) {
  return (
    <li className="rounded-2xl border border-forest-100 bg-white p-5">
      <p className="font-semibold text-forest-900">{label}</p>
      <p className="mt-1 text-sm text-forest-800">{body}</p>
    </li>
  );
}
