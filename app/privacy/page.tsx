import type { Metadata } from 'next';
import { legal } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Prime Origins Atlas collects, uses and protects personal data, in line with UK GDPR and EU GDPR.',
  alternates: { canonical: '/privacy' }
};

export default function PrivacyPage() {
  return (
    <div className="container-narrow py-12 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-semibold text-sand-50">Privacy Policy</h1>
      <p className="text-sm text-sand-100/55 mt-2">Last updated: {legal.lastUpdated}</p>

      <Section title="1. Who we are">
        <p>{legal.companyName} (&quot;Prime Origins&quot;, &quot;we&quot;) operates {legal.tradingName} at {legal.websiteUrl}. We are the data controller for personal data collected through the marketplace. Contact for privacy queries: <a className="text-gold-400 underline" href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a>.</p>
      </Section>

      <Section title="2. What data we collect">
        <p>We collect the following categories of personal data:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-sand-50">Contact details</strong> — name, email, phone, organisation — when you submit an inquiry, seller application, or purchase credits.</li>
          <li><strong className="text-sand-50">Transaction data</strong> — billing information, order details, retirement preferences — processed by Stripe on our behalf.</li>
          <li><strong className="text-sand-50">Project documentation</strong> (sellers only) — files you upload for verification of carbon credit projects.</li>
          <li><strong className="text-sand-50">Technical data</strong> — IP address, browser type, device, pages visited — via Vercel Analytics and standard server logs.</li>
        </ul>
      </Section>

      <Section title="3. How we use it (legal bases)">
        <p>We process personal data on the following bases under UK GDPR / EU GDPR:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-sand-50">Contract</strong> — to provide the marketplace services you request (browsing, purchase, retirement, seller listing).</li>
          <li><strong className="text-sand-50">Legitimate interest</strong> — to operate, secure and improve the marketplace, including analytics and fraud prevention.</li>
          <li><strong className="text-sand-50">Legal obligation</strong> — to meet our regulatory and tax obligations.</li>
          <li><strong className="text-sand-50">Consent</strong> — for optional marketing communications, withdrawable at any time.</li>
        </ul>
      </Section>

      <Section title="4. Who we share data with">
        <p>We share personal data only with the following categories of recipient, each bound by data-processing agreements:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-sand-50">Stripe</strong> — payment processing</li>
          <li><strong className="text-sand-50">Vercel</strong> — hosting, analytics, file storage (Vercel Blob)</li>
          <li><strong className="text-sand-50">Carbon registries</strong> (Verra, Gold Standard, ACR, Puro.earth, Climate Action Reserve) — to retire credits on your behalf where you request retirement</li>
          <li><strong className="text-sand-50">Professional advisers</strong> — legal, accounting, regulatory</li>
          <li><strong className="text-sand-50">Authorities</strong> — where legally required</li>
        </ul>
        <p>We do not sell personal data.</p>
      </Section>

      <Section title="5. International transfers">
        <p>Some of our processors (notably Stripe and Vercel) are based outside the UK/EEA. Where data is transferred internationally we rely on adequacy decisions or Standard Contractual Clauses to ensure equivalent protection.</p>
      </Section>

      <Section title="6. How long we keep it">
        <p>We retain personal data only for as long as necessary for the purposes set out above, or as required by law. Order and tax records are retained for 7 years. Marketing contacts are retained until you unsubscribe. Inquiry records are deleted within 24 months of last contact unless ongoing business interest requires longer retention.</p>
      </Section>

      <Section title="7. Your rights">
        <p>Under UK GDPR / EU GDPR you have the right to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Access the personal data we hold about you</li>
          <li>Have inaccurate data corrected</li>
          <li>Request erasure (subject to legal retention obligations)</li>
          <li>Restrict or object to processing</li>
          <li>Receive your data in a portable format</li>
          <li>Withdraw consent for marketing at any time</li>
        </ul>
        <p>Exercise any of these rights by emailing <a className="text-gold-400 underline" href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a>. You also have the right to complain to the UK Information Commissioner&apos;s Office (<a className="text-gold-400 underline" href="https://ico.org.uk" target="_blank" rel="noreferrer">ico.org.uk</a>) or your local data protection authority.</p>
      </Section>

      <Section title="8. Cookies">
        <p>We use a small number of strictly necessary cookies for site functionality and, with your consent, analytics cookies via Vercel Analytics. See our <a className="text-gold-400 underline" href="/cookies">Cookie Policy</a> for details.</p>
      </Section>

      <Section title="9. Security">
        <p>We use industry-standard technical and organisational measures including HTTPS encryption, access controls, and audit logging. No system is perfectly secure — if you believe an incident has occurred please contact <a className="text-gold-400 underline" href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a> immediately.</p>
      </Section>

      <Section title="10. Children">
        <p>The marketplace is not directed at children under 18 and we do not knowingly collect personal data from them.</p>
      </Section>

      <Section title="11. Changes to this policy">
        <p>We may update this Privacy Policy from time to time. The current version is always available at {legal.websiteUrl}/privacy with the &quot;last updated&quot; date shown above.</p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold text-sand-50 mb-2">{title}</h2>
      <div className="space-y-3 text-sand-100/80 text-sm leading-relaxed">{children}</div>
    </section>
  );
}
