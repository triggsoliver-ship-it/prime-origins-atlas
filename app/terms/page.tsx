import type { Metadata } from 'next';
import { legal } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms governing use of the Prime Origins Atlas carbon credit marketplace.',
  alternates: { canonical: '/terms' }
};

export default function TermsPage() {
  return (
    <div className="container-narrow py-12 max-w-3xl prose prose-forest">
      <h1 className="text-3xl md:text-4xl font-semibold text-forest-900">Terms of Service</h1>
      <p className="text-sm text-forest-700/70 mt-2">Last updated: {legal.lastUpdated}</p>

      <Section title="1. About these terms">
        <p>These Terms of Service (&quot;Terms&quot;) govern your use of the {legal.tradingName} marketplace operated by {legal.companyName} (&quot;Prime Origins&quot;, &quot;we&quot;, &quot;us&quot;), accessible at {legal.websiteUrl}. By accessing or using the marketplace you agree to be bound by these Terms.</p>
      </Section>

      <Section title="2. Who we are">
        <p>{legal.companyName} is a company registered in {legal.jurisdiction} (company number {legal.registrationNumber}), with its registered office at {legal.registeredAddress}. Contact: <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>.</p>
      </Section>

      <Section title="3. What the marketplace does">
        <p>Atlas is a curated marketplace where verified buyers can purchase carbon credits listed by project developers. Credits are either &quot;Prime Origins Verified&quot; (issued under recognised registries such as Verra, Gold Standard, ACR, Puro.earth and Climate Action Reserve) or &quot;Self-Verified&quot; (issued by project developers under their own documented methodologies). Each listing identifies its tier.</p>
        <p>Prime Origins acts as an intermediary between buyers and sellers. Title to credits transfers via the underlying registry where applicable. Prime Origins does not itself issue credits.</p>
      </Section>

      <Section title="4. Eligibility">
        <p>You must be at least 18 years old and legally capable of entering into a binding contract to use the marketplace. Where you are acting on behalf of an organisation, you confirm that you have authority to bind that organisation.</p>
      </Section>

      <Section title="5. Accounts and information accuracy">
        <p>You agree to provide accurate, current and complete information when interacting with the marketplace and to update it as necessary. You are responsible for maintaining the confidentiality of any account credentials.</p>
      </Section>

      <Section title="6. Buying carbon credits">
        <p>Credit listings show price per tonne CO₂ equivalent (tCO₂e), vintage, registry, methodology and additional metadata. Prices are quoted in US dollars (USD) unless otherwise stated and exclude any applicable taxes. A 4% platform fee is added to the credit price at checkout.</p>
        <p>Orders are processed via Stripe. Payment is captured at the point of order. Where you elect retirement at checkout, Prime Origins will arrange retirement on the underlying registry within 48 business hours and provide you with the certificate by email.</p>
        <p>Because carbon credits are non-tangible commodities and retirement is irreversible, all sales are final unless required otherwise by law.</p>
      </Section>

      <Section title="7. Selling / listing credits">
        <p>Project developers may apply to list credits via the seller application form. All listings are subject to manual review and approval by Prime Origins. We may decline any application at our sole discretion. Sellers warrant that they have full legal title to the credits being listed and that all submitted documentation is accurate and complete.</p>
        <p>Sellers agree to a 4% platform fee on credits sold via Atlas. Payouts settle on a schedule set by Prime Origins.</p>
      </Section>

      <Section title="8. Quality, additionality, and our role">
        <p>Prime Origins reviews each listing against a five-pillar framework (additionality, permanence, methodology rigour, co-benefit substance, traceability). Our review is a curation step, not a financial or environmental guarantee. We do not warrant the climate outcomes of any individual credit. Buyers are responsible for their own due diligence, particularly where credits will be used in regulated disclosure (SBTi, VCMI, CSRD, CDP).</p>
        <p>Self-Verified credits rely on documentation provided by the project developer. Buyers should review the linked documentation before purchase.</p>
      </Section>

      <Section title="9. Intellectual property">
        <p>All content on the marketplace (excluding listing content provided by third-party project developers) is owned by or licensed to Prime Origins. You may not reproduce, modify, or distribute it without our written consent.</p>
      </Section>

      <Section title="10. Acceptable use">
        <p>You agree not to: (a) attempt to interfere with the integrity or security of the marketplace; (b) use it to engage in fraudulent, deceptive or unlawful activity; (c) scrape, mirror, or systematically extract data without our consent; or (d) infringe the rights of any third party.</p>
      </Section>

      <Section title="11. Liability">
        <p>To the maximum extent permitted by law, Prime Origins&apos; total aggregate liability arising out of or in connection with the marketplace or these Terms is limited to the platform fees paid to us by you in the 12 months preceding the claim. We exclude liability for indirect, incidental, special, consequential or punitive losses, including loss of profits, business or goodwill.</p>
        <p>Nothing in these Terms limits liability for death or personal injury caused by negligence, for fraud or fraudulent misrepresentation, or for any other liability that cannot be limited by law.</p>
      </Section>

      <Section title="12. Termination">
        <p>We may suspend or terminate access to the marketplace at any time without notice if you breach these Terms, if required by law, or for legitimate operational reasons. Provisions that by their nature survive termination (including liability, intellectual property and governing law) will continue to apply.</p>
      </Section>

      <Section title="13. Changes to these Terms">
        <p>We may amend these Terms from time to time. The current version will always be available at {legal.websiteUrl}/terms with the &quot;last updated&quot; date shown above. Continued use of the marketplace after changes constitutes acceptance.</p>
      </Section>

      <Section title="14. Governing law">
        <p>These Terms are governed by the laws of {legal.jurisdiction}. The courts of {legal.jurisdiction} have exclusive jurisdiction over any dispute, save that we may bring proceedings in the courts of the country where you are based.</p>
      </Section>

      <Section title="15. Contact">
        <p>For any questions about these Terms, contact <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>.</p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold text-forest-900 mb-2">{title}</h2>
      <div className="space-y-3 text-forest-800 text-sm leading-relaxed">{children}</div>
    </section>
  );
}
