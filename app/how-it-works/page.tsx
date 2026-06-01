import Link from 'next/link';

export default function HowItWorks() {
  return (
    <div className="container-narrow py-12 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-semibold text-forest-900">How Atlas works</h1>
      <p className="mt-3 text-forest-700/85">
        Atlas connects buyers — corporates with net-zero targets, traders, and intermediaries — with project developers
        issuing credits under recognised standards. Every step is designed for transparency.
      </p>

      <Section title="For buyers">
        <Step n={1} title="Browse vetted projects">
          Filter by category (nature-based, engineered removal, renewable energy, community), registry, vintage and price.
          Each listing shows the public registry serial number and methodology.
        </Step>
        <Step n={2} title="Buy and (optionally) retire">
          Stripe-powered checkout. Choose how many tonnes you want. Tick the box to retire credits in your name —
          we handle the registry retirement and email you the certificate.
        </Step>
        <Step n={3} title="Use the credit for your claim">
          Compatible with SBTi, VCMI, CSRD and CDP reporting requirements. Registry, methodology, vintage and serial
          numbers are all on the certificate.
        </Step>
      </Section>

      <Section title="For project developers">
        <Step n={1} title="Apply to list">
          Submit your project, registry ID and asking price. Our team checks the registry record and methodology rigour.
        </Step>
        <Step n={2} title="Get approved">
          We screen for additionality, permanence, methodology, and co-benefit substance. Typical review takes 5 business days.
        </Step>
        <Step n={3} title="Sell with a 4% fee">
          We charge 4% on credits sold — no upfront listing fee. Payouts settle weekly via Stripe.
        </Step>
      </Section>

      <Section title="Pricing & fees">
        <p>Prime Origins charges a flat <strong>4% platform fee</strong> on top of the listed credit price, paid by the buyer at checkout.</p>
        <p className="mt-2">For institutional orders ({'>'}1,000 tCO₂e) we offer custom pricing and forward contracts.
          <Link href="/sell" className="text-forest-700 underline ml-1">Talk to us</Link>.</p>
      </Section>

      <Section title="Supported registries">
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {['Verra (VCS)', 'Gold Standard', 'ACR', 'Puro.earth', 'Climate Action Reserve'].map((r) => (
            <li key={r} className="rounded-xl border border-forest-100 bg-white px-3 py-2 text-sm">{r}</li>
          ))}
        </ul>
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
