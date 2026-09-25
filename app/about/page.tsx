import type { Metadata } from 'next';
import { ECOSYSTEM } from '@/lib/ecosystem';

export const metadata: Metadata = {
  title: 'About Prime Origins Atlas — What We Check, and What We Do Not',
  description:
    'Prime Origins Atlas lists registry-issued carbon credits, UK Woodland Carbon Code Pending Issuance Units and developer self-verified projects. What Atlas checks before listing, what it does not, and where it sits in the Prime Origins ecosystem.',
  alternates: { canonical: '/about' }
};

export default function About() {
  return (
    <div className="container-narrow py-12 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-semibold text-forest-900">About Prime Origins Atlas</h1>
      <p className="mt-4 text-forest-700/85 text-lg">
        Atlas is the carbon and environmental markets platform in the Prime Origins ecosystem. It lists
        registry-issued carbon credits, UK Woodland Carbon Code Pending Issuance Units and projects documented by
        their own developers &mdash; and it labels which is which on every page.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-forest-900">Why Atlas exists</h2>
        <p className="mt-3 text-forest-800">
          The voluntary carbon market still struggles with fragmented data, inconsistent quality signals and
          double-counting risk. We built Atlas so buyers can compare projects on the things that decide what they may
          claim &mdash; registry, unit type, verification status, methodology, permanence, buffer pool and
          substantive co-benefits &mdash; instead of glossy storytelling alone.
        </p>
        <p className="mt-3 text-forest-800">
          Atlas holds no stock of its own. Every price on the site is indicative and every volume is confirmed with
          the developer when we quote. That is a deliberate position: in September 2026 a listing on this site that
          looked buyable was bought against a project with no supply behind it, and the order had to be refunded.
          Nothing on Atlas is card-payable until the units exist, are held and can be transferred.
        </p>
      </section>

      <section id="quality" className="mt-10">
        <h2 className="text-xl font-semibold text-forest-900">What we check, and what we don&rsquo;t</h2>
        <p className="mt-3 text-forest-800">
          Prime Origins does not issue, verify or certify any unit sold through Atlas. What we do is check the public
          record and publish what it says, on five dimensions:
        </p>
        <ul className="mt-4 space-y-3">
          <Item label="Project registration" body="That the project exists on the registry or code it claims, under the project ID shown, and is not suspended." />
          <Item label="Verification status" body="Whether the units have actually been verified and issued, or are pending issuance against a prediction. These are different instruments and the listing says which." />
          <Item label="Methodology" body="That the methodology named is one the issuing registry approves, with validation and verification reports where they exist." />
          <Item label="Permanence and buffer" body="That storage durability suits the unit type, and that the buffer-pool contribution the methodology requires is in place." />
          <Item label="Supply basis" body="Whether Atlas holds the units, or sources them to order. At present it holds none, so every listing is sourced to order." />
        </ul>
        <p className="mt-4 text-forest-800">
          What we do not do: independently measure carbon, audit a developer&rsquo;s own figures, or judge whether a
          unit fits your reporting obligations. Each listing identifies its registry or developer documentation, unit
          type and verification status. Buyers should assess whether the units and proposed use meet the requirements
          applicable to their organisation and claim.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-forest-900">The Prime Origins ecosystem</h2>
        <p className="mt-3 text-forest-800">
          Atlas is one of five platforms that share the Prime Origins name. They are separate products with separate
          audiences, listed here so you can find the right one.
        </p>
        <ul className="mt-4 space-y-2">
          {ECOSYSTEM.map((site) => (
            <li key={site.url} className="rounded-2xl border border-forest-100 bg-white px-5 py-3">
              {site.current ? (
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-semibold text-forest-900">{site.name}</span>
                  <span className="text-[10px] uppercase tracking-wider text-forest-600">You are here</span>
                  <span className="basis-full text-sm text-forest-700/80">{site.role}</span>
                </span>
              ) : (
                <a href={site.url} target="_blank" rel="noreferrer" className="flex flex-wrap items-baseline gap-x-2 hover:text-forest-600">
                  <span className="font-medium text-forest-900">{site.name}</span>
                  <span aria-hidden className="text-forest-600">↗</span>
                  <span className="basis-full text-sm text-forest-700/80">{site.role}</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-forest-900">Get in touch</h2>
        <p className="mt-3 text-forest-800">
          Buyer questions, seller applications, or media: <a className="underline" href="mailto:oliver@primeorigins.org">oliver@primeorigins.org</a>.
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
