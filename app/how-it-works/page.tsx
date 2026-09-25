import Link from 'next/link';
import type { Metadata } from 'next';
import {
  FEE_EXCLUSIONS,
  FEE_POLICY_SUMMARY,
  PLATFORM_FEE_BASIS,
  PLATFORM_FEE_PCT as FEE_PCT,
  feeWorkedExample,
  gbp
} from '@/lib/pricing';

const example = feeWorkedExample(25, 100);

export const metadata: Metadata = {
  title: 'How Atlas Works — Buying, Selling and What the Fee Covers',
  description:
    `How to buy carbon credits and UK Pending Issuance Units on Prime Origins Atlas, and how developers list. One ${FEE_PCT} platform fee, added on top of the credit price and paid by the buyer; the seller receives the listed price in full.`,
  alternates: { canonical: '/how-it-works' }
};

export default function HowItWorks() {
  return (
    <div className="container-narrow py-12 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-semibold text-forest-900">How Atlas works</h1>
      <p className="mt-3 text-forest-700/85">
        Atlas connects buyers &mdash; corporates with net-zero targets, traders and intermediaries &mdash; with
        project developers. Atlas holds no stock of its own: every price on the site is indicative, and availability
        is confirmed with the developer when we quote.
      </p>

      <Section title="For buyers">
        <Step n={1} title="Browse the catalogue">
          Filter by unit type (issued credits, Pending Issuance Units, developer self-verified), project category,
          registry, year and indicative price. Each listing shows its registry, project ID, methodology and
          verification status, and says plainly what instrument it is offering.
        </Step>
        <Step n={2} title="Request a quote">
          Set the tonnage and say whether you need the units retired in your own name. Atlas holds no stock at
          present, so every project is sourced to order: we come back with a firm price, the unit type and, where
          units have been issued, the serial numbers &mdash; and nothing is charged until you accept in writing. If a
          project is ever held in stock, its listing says so and offers card checkout instead.
        </Step>
        <Step n={3} title="Check the unit fits your claim">
          Each listing identifies its registry or developer documentation, unit type and verification status. Buyers
          should assess whether the units and proposed use meet the requirements applicable to their organisation and
          claim &mdash; suitability depends on the unit, the claim, the buyer and the rules in force at the time, and
          Atlas cannot make that assessment for you. Two things are settled: the Woodland Carbon Code states that a
          Pending Issuance Unit &ldquo;can&rsquo;t be used to report against UK-based emissions&rdquo;, and that
          Woodland Carbon Units &ldquo;can&rsquo;t currently be used in compliance programmes like the UK Emissions
          Trading Scheme&rdquo;. Tell us what you need to report against and we will quote accordingly.
        </Step>
      </Section>

      <Section title="For project developers">
        <Step n={1} title="Apply to list">
          Submit your project, registry ID and asking price. Our team checks the registry record and methodology rigour.
        </Step>
        <Step n={2} title="Get approved">
          Registry-backed projects are checked against the public registry record. Self-verified projects are published
          with your documentation attached and labelled as such. Typical review takes 5 business days.
        </Step>
        <Step n={3} title="Get paid the price you set">
          {FEE_POLICY_SUMMARY} So on a {example.tonnes} tCO₂e order listed at {gbp(example.pricePerTonne)} per tonne,
          you receive {gbp(example.sellerReceives)} and the buyer pays {gbp(example.total)}. Payouts settle weekly via
          Stripe.
        </Step>
      </Section>

      <Section title="Pricing & fees">
        <p>{FEE_POLICY_SUMMARY}</p>
        <p className="mt-2">
          It is calculated on {PLATFORM_FEE_BASIS}, and it covers sourcing, registry transfer and retirement
          coordination, and the retirement record.
        </p>

        <div className="mt-4 rounded-2xl border border-forest-100 bg-white p-5">
          <h3 className="text-sm font-semibold text-forest-900">Worked example</h3>
          <dl className="mt-3 space-y-1.5 text-sm">
            <FeeRow
              label={`Credits (${example.tonnes} tCO₂e × ${gbp(example.pricePerTonne)})`}
              value={gbp(example.subtotal)}
            />
            <FeeRow label={`Platform fee (${FEE_PCT} of ${gbp(example.subtotal)})`} value={gbp(example.fee)} />
            <div className="border-t border-forest-100 pt-2 mt-1">
              <FeeRow label={<strong>Buyer pays</strong>} value={<strong>{gbp(example.total)}</strong>} />
            </div>
            <div className="pt-1">
              <FeeRow label="Seller receives" value={gbp(example.sellerReceives)} />
              <FeeRow label="Atlas receives" value={gbp(example.atlasReceives)} />
            </div>
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-forest-700/85">
            The same arithmetic runs on the quote panel and at checkout, from one constant, so the figure you are
            shown is the figure that is charged.
          </p>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold text-forest-900">What the quoted total does not include</h3>
          <ul className="mt-2 space-y-1.5 text-sm text-forest-800">
            {FEE_EXCLUSIONS.map((x) => (
              <li key={x} className="flex gap-2">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-forest-600" />
                <span>{x}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-forest-800">
            Any charge that does apply is set out in writing before you confirm. Nothing else is added at checkout.
          </p>
        </div>

        <p className="mt-4">For institutional orders ({'>'}1,000 tCO₂e) we quote custom pricing and forward contracts.
          <Link href="/sell" className="text-forest-700 underline ml-1">Talk to us</Link>.</p>
      </Section>

      <Section title="Registries and codes on Atlas">
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {[
            'Woodland Carbon Code',
            'Peatland Code',
            'Verra (VCS)',
            'Gold Standard',
            'ACR',
            'Puro.earth',
            'Climate Action Reserve'
          ].map((r) => (
            <li key={r} className="rounded-xl border border-forest-100 bg-white px-3 py-2 text-sm">{r}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-forest-700/85">
          Projects listed on the developer&rsquo;s own documentation are not on any registry, and are labelled
          &ldquo;Developer self-verified&rdquo; throughout the site.
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-forest-900">{title}</h2>
      <div className="mt-3 space-y-3 text-forest-800">{children}</div>
    </section>
  );
}

function FeeRow({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-forest-700">{label}</dt>
      <dd className="whitespace-nowrap tabular-nums text-forest-900">{value}</dd>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-forest-100 bg-white p-5">
      <span className="shrink-0 grid h-9 w-9 place-items-center rounded-full bg-forest-700 text-white text-sm font-semibold">{n}</span>
      <div>
        <h3 className="font-semibold text-forest-900">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
