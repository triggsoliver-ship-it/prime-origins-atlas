import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carbon Credit Marketplace FAQ — Pricing, Quality, Retirement',
  description:
    'Frequently asked questions about buying and selling carbon credits on Prime Origins Atlas: vetting, pricing, retirement, SBTi/VCMI/CSRD compliance, and self-verified credits.',
  alternates: { canonical: '/faq' }
};

const faqs = [
  {
    q: 'How do I know the credits are real?',
    a: 'Every listing shows the public registry (Verra, Gold Standard, ACR, Puro.earth, or Climate Action Reserve) and project ID. You can verify each credit\'s serial number directly on the registry before or after purchase.'
  },
  {
    q: 'What\'s included in the 4% platform fee?',
    a: 'Vetting, registry transfer/retirement coordination, the certificate of retirement, and ongoing buyer support. There are no hidden listing or transaction fees.'
  },
  {
    q: 'Can I retire credits in my own name?',
    a: 'Yes. At checkout, tick the retire option and we handle the registry retirement on your behalf — typically within 48 hours. You receive the official certificate by email.'
  },
  {
    q: 'How are projects vetted before listing?',
    a: 'Our team reviews five things: additionality, permanence (and buffer pool adequacy), methodology rigour, co-benefit substance, and traceability. We turn down roughly half of applications.'
  },
  {
    q: 'Are these credits compliant with SBTi / VCMI / CSRD?',
    a: 'Yes — all listed credits include the disclosure fields (registry, methodology, vintage, project type, serial number) required by SBTi Net-Zero Standard, VCMI Claims Code, CSRD and CDP.'
  },
  {
    q: 'Can I buy a large volume or forward contract?',
    a: 'For orders over 1,000 tonnes or multi-year purchase agreements, contact our team at oliver@primeorigins.org. Institutional pricing applies.'
  },
  {
    q: 'What payment methods are supported?',
    a: 'All major credit and debit cards via Stripe. Wire transfer is available for institutional orders.'
  },
  {
    q: 'I\'m a developer — how do I list?',
    a: 'Apply via the For Sellers page. We\'ll review your project and respond within 5 business days. No upfront fee — we earn the 4% only when credits sell.'
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
