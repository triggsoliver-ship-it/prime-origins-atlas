import type { Metadata } from 'next';
import { FEE_POLICY_SUMMARY, PLATFORM_FEE_PCT as feePct, feeWorkedExample, gbp } from '@/lib/pricing';

export const metadata: Metadata = {
  title: 'Carbon Credit Marketplace FAQ — Unit Types, Pricing, Retirement',
  description:
    'Questions about buying and selling on Prime Origins Atlas: the difference between issued credits and Pending Issuance Units, how the platform fee works, availability, retirement and developer self-verified listings.',
  alternates: { canonical: '/faq' }
};

// The fee and the worked example both come from lib/pricing.ts. They were
// hardcoded as "4%" here and in two other answers, so changing the rate in code
// silently left the FAQ contradicting what the checkout actually charged.
const ex = feeWorkedExample(25, 100);

const faqs = [
  {
    q: 'How do I know the credits are real?',
    a: 'Every registry-backed listing shows the registry (Woodland Carbon Code, Peatland Code, Verra, Gold Standard, ACR, Puro.earth or Climate Action Reserve) and the project ID, so you can look the project up yourself. Before you pay anything we confirm in writing exactly what you are buying — the unit type, and the serial numbers where units have been issued — and that is verifiable on the registry independently of us.'
  },
  {
    q: 'What is the difference between an issued credit and a Pending Issuance Unit?',
    a: 'An issued credit has been verified and issued by a registry: one tonne of CO₂ equivalent already removed or avoided. A Pending Issuance Unit is the Woodland Carbon Code’s promise to deliver a Woodland Carbon Unit in future, based on predicted removal. In the Code’s own words it "is not guaranteed, so can’t be used to report against UK-based emissions". Pending units are assigned to you on the UK Land Carbon Registry rather than retired, and become eligible for retirement once the project passes verification — first at year five, then at least every ten years. Every card and every listing page on Atlas says which of the two it is offering.'
  },
  {
    q: 'Do you hold the credits you list?',
    a: 'No. Atlas currently holds no stock of its own, so every price on the site is indicative and every listing shows "Availability confirmed on request". The catalogue is what we can source; a quote turns that into a firm price against a named project, with the unit type and, where units have been issued, the serial numbers. If we ever do hold stock, that listing will say so and offer card payment. We would rather run an honest catalogue than show a checkout button we cannot honour — in September 2026 a listing that looked buyable was bought for real against a project with no supply, and the order had to be refunded. That is what all of this is for.'
  },
  {
    q: 'The listing shows a big tonnage. Is that what I can buy?',
    a: 'No, and the site now labels it properly. On registry-issued projects the figure shown is what the registry has issued to that project over its whole life. On UK woodland projects it is the developer’s forecast of removal over the project’s whole life, which is not verified and not yet issued. Neither is inventory, and neither is available through Atlas. What is actually available is confirmed with the developer when we quote.'
  },
  {
    q: `Who pays the ${feePct} platform fee, and what does it cover?`,
    a: `${FEE_POLICY_SUMMARY} It covers sourcing, registry transfer and retirement coordination, the retirement record and buyer support, and it is shown as its own line before you commit. Worked example: ${ex.tonnes} tCO₂e at ${gbp(ex.pricePerTonne)} per tonne is ${gbp(ex.subtotal)} of credits plus a ${feePct} fee of ${gbp(ex.fee)}, so the buyer pays ${gbp(ex.total)} and the seller receives ${gbp(ex.sellerReceives)}. VAT, registry account fees and any currency conversion your bank applies are not in that total; anything that does apply is set out in writing before you confirm.`
  },
  {
    q: 'Can I retire credits in my own name?',
    a: 'For issued credits, yes: tick the retirement option when you request a quote (or at checkout on projects we hold) and we arrange the registry retirement on your behalf and send you the record. On stock we hold, that is within 48 hours of purchase; on sourced credits it follows the registry transfer, and the quote states the expected timing rather than guessing. Pending Issuance Units cannot be retired — there is no verified unit to retire yet — so they are assigned to you on the UK Land Carbon Registry instead, and become eligible for retirement when they convert to Woodland Carbon Units. Developer self-verified projects are not on a registry, so no registry retirement is available for them at all.'
  },
  {
    q: 'How are projects checked before listing?',
    a: 'Registry-backed listings are checked against the public registry record: project ID, methodology, vintage or planting year, validation and verification status, and buffer pool where it applies. That check confirms the record exists and matches — it is not a verification, and Prime Origins does not issue, verify or certify any unit itself. Developer self-verified listings are published with the developer\'s own documentation attached and labelled as self-verified; we have not independently verified those, and the listing says so plainly.'
  },
  {
    q: 'Can I use these for my reporting or disclosure obligations?',
    a: 'That depends on the unit, the claim, your organisation and the rules of the framework as they stand at the time, so it is not something Atlas can answer for you. What each listing gives you is the basis to judge it: its registry or developer documentation, its unit type and its verification status. Two points are settled and worth knowing before you buy — the Woodland Carbon Code states that a Pending Issuance Unit cannot be used to report against UK-based emissions, and that Woodland Carbon Units cannot currently be used in compliance programmes such as the UK Emissions Trading Scheme. Developer self-verified listings are not registry-issued at all. Tell us what you need to report against and we will quote only what fits.'
  },
  {
    q: 'Can I buy a large volume or forward contract?',
    a: `Yes. For orders over 1,000 tonnes or multi-year purchase agreements, request a quote or email oliver@primeorigins.org directly. The published ${feePct} fee is the default and applies unless a different rate is agreed in writing in the contract for that order; institutional pricing and forward structures are quoted case by case.`
  },
  {
    q: 'What payment methods are supported?',
    a: 'All major credit and debit cards via Stripe on projects we hold in stock. Sourced orders are settled against an invoice by bank transfer, or by card if you prefer.'
  },
  {
    q: 'I\'m a developer — how do I list?',
    a: `Apply via the For Sellers page. We'll review your project and respond within 5 business days. Nothing is deducted from you: there is no listing fee and no seller commission, and you receive the price you set in full. The ${feePct} platform fee is charged to the buyer on top of your price, and only when a sale completes.`
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
