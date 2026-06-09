import type { Metadata } from 'next';
import { legal } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookies used on Prime Origins Atlas and how to control them.',
  alternates: { canonical: '/cookies' }
};

export default function CookiesPage() {
  return (
    <div className="container-narrow py-12 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-semibold text-forest-900">Cookie Policy</h1>
      <p className="text-sm text-forest-700/70 mt-2">Last updated: {legal.lastUpdated}</p>

      <Section title="What cookies are">
        <p>Cookies are small text files stored on your device when you visit a website. They are used to remember preferences, keep you signed in, and measure how the site is used.</p>
      </Section>

      <Section title="Cookies we use">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-forest-100 rounded-lg overflow-hidden">
            <thead className="bg-forest-50 text-forest-800">
              <tr>
                <th className="text-left px-3 py-2">Cookie</th>
                <th className="text-left px-3 py-2">Purpose</th>
                <th className="text-left px-3 py-2">Type</th>
                <th className="text-left px-3 py-2">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-100">
              <tr>
                <td className="px-3 py-2 font-mono text-xs">__stripe_*</td>
                <td className="px-3 py-2">Secure payment processing</td>
                <td className="px-3 py-2">Strictly necessary</td>
                <td className="px-3 py-2">Up to 1 year</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-xs">_vercel_*</td>
                <td className="px-3 py-2">Site hosting & performance</td>
                <td className="px-3 py-2">Strictly necessary</td>
                <td className="px-3 py-2">Session</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-xs">va-*</td>
                <td className="px-3 py-2">Vercel Web Analytics (page views)</td>
                <td className="px-3 py-2">Analytics</td>
                <td className="px-3 py-2">Up to 1 year</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Managing cookies">
        <p>You can control cookies through your browser settings — block all, block third-party cookies only, or delete cookies on exit. Note that blocking strictly necessary cookies may break checkout and other site functionality.</p>
        <p>You can also opt out of Vercel Analytics by enabling &quot;Do Not Track&quot; in your browser.</p>
      </Section>

      <Section title="Questions">
        <p>If you have questions about this policy, email <a className="underline" href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a>.</p>
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
