import type { Metadata } from 'next';
import { PLATFORM_FEE_RATE } from '@/lib/pricing';

export const metadata: Metadata = {
  title: 'Carbon Credit Marketplace FAQ — Pricing, Quality, Retirement',
  description:
    'Frequently asked questions about buying and selling carbon credits on Prime Origins Atlas: vetting, pricing, retirement, SBTi/VCMI/CSRD compliance, and self-verified credits.',
  alternates: { canonical: '/faq' }
};

// The fee is interpolated from lib/pricing.ts. It was hardcoded as "4%" here
// and in two other answers, so changing the rate in code silently left the FAQ
// contradicting what the checkout actually charged.
const feePct = `${Number.isInteger(PLATFORM_FEE_RATE * 100) ? PLATFORM_FEE_RATE * 100 : (PLATFORM_FEE_RATE * 100).toFixed(1)}%`;

const faqs = [
  {
    q: 'How do I know the credits are real?',
    a: 'Every listing shows the public registry (Verra, Gold Standard, ACR, Puro.earth, or Climate Action Reserve) and the project ID, so you can look the project up yourself. Before you pay anything we confirm the specific serial numbers you are buying, in writing, and those are verifiable on the registry independently of us.'
  },
  {
    q: 'Do you hold the credits you list?',
    a: 'For most projects, no — we source them to order. The catalogue shows what we can supply and an indicative price; a quote turns that into a firm price against confirmed, serial-numbered credits. Where we do hold stock the listing says so and you can pay by card immediately. We would rather run an honest catalogue than show a checkout button we cannot honour.'
  },
  {
    q: `What's included in the ${feePct} platform fee?`,
    a: `Sourcing, registry transfer and retirement coordination, the certificate of retirement, and buyer support. It is charged on top of the credit price and shown separately before you commit. There are no listing fees and no hidden transaction fees.`
  },
  {
    q: 'Can I retire credits in my own name?',
    a: 'Yes. Tick the retirement option when you request a quote (or at checkout on projects we hold) and we handle the registry retirement on your behalf and send you the official certificate. On stock we hold, that is within 48 hours of purchase. On sourced credits it follows the registry transfer, and we will tell you the expected timing in the quote rather than guess.'
  },
  {
    q: 'How are projects vetted before listing?',
    a: 'Registry-backed listings are checked against the public registry record: project ID, methodology, vintage, validation and verification status, and buffer pool where it applies. Self-verified listings are published with the developer\'s own documentation attached and are labelled as self-verified — we have not independently verified those, and the listing says so plainly.'
  },
  {
    q: 'Are these credits compliant with SBTi / VCMI / CSRD?',
    a: 'Registry-issued credits carry the disclosure fields (registry, methodology, vintage, project type, serial number) those frameworks expect, and are the ones to use where you have a compliance obligation. Self-verified credits are not registry-issued and should not be relied on for SBTi, VCMI or CSRD reporting — they suit voluntary action and pilot programmes. If compliance matters, tell us and we will only quote registry-issued credits.'
  },
  {
    q: 'Can I buy a large volume or forward contract?',
    a: 'Yes. For orders over 1,000 tonnes or multi-year purchase agreements, request a quote or email oliver@primeorigins.org directly. Institutional pricing applies and the fee is negotiable at volume.'
  },
  {
    q: 'What payment methods are supported?',
    a: 'All major credit and debit cards via Stripe on projects we hold in stock. Sourced orders are settled against an invoice by bank transfer, or by card if you prefer.'
  },
  {
    q: 'I\'m a developer — how do I list?',
    a: `Apply via the For Sellers page. We'll review your project and respond within 5 business days. No upfront fee — we earn the ${feePct} only when credits sell.`
  }
];

export default function FAQ() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
  return (
    <div className="container-narrow py-12 max-w-3xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl md:text-4xl font-semibold text-forest-900">Frequently asked questions</h1>
      <div className="mt-8 space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="rounded-2xl border border-forest-100 bg-white p-5 group">
            <summary className="cursor-pointer font-medium text-forest-900 list-none flex justify-between items-start gap-4">
              {f.q}
              <span className="text-forest-600 transition group-open:rotate-45 text-xl leading-none select-none">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-forest-800">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
