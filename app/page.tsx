import Link from 'next/link';
import ListingCard from '@/components/ListingCard';
import TalkToUs from '@/components/TalkToUs';
import { getFeaturedListings, listings } from '@/lib/listings';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://primeoriginsatlas.org';

export default function HomePage() {
  const featured = getFeaturedListings();
  // The catalogue total, which is what the projects could supply — not stock
  // Atlas holds. Labelled "Tonnes listed" for that reason.
  const totalTonnes = listings.reduce((s, l) => s + l.tonnesAvailable, 0);
  // This counts where credits came from, not that anyone here reviewed them.
  // "Vetted" was claiming a review process the seeded catalogue never had;
  // registry-issued is a fact about the listing that a buyer can check.
  const registryIssuedCount = listings.filter((l) => l.tier === 'prime-origins-verified').length;

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Prime Origins Atlas',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    parentOrganization: { '@type': 'Organization', name: 'Prime Origins', url: 'https://www.primeorigins.org' },
    description: 'A curated marketplace for high-integrity carbon credits — from major registries and self-verified developers.',
    sameAs: ['https://www.primeorigins.org']
  };
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Prime Origins Atlas',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/browse?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-700 via-forest-800 to-forest-900" aria-hidden />
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.45),transparent_55%)]" aria-hidden />
        <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_85%_80%,rgba(140,198,158,0.9),transparent_45%)]" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-sand-50/90 to-transparent" aria-hidden />
        <div className="container-narrow relative py-20 md:py-28 text-sand-50">
          <span className="chip reveal bg-white/15 text-sand-50 border border-white/20 backdrop-blur">
            On-chain origin · Full transparency
          </span>
          <h1 className="reveal reveal-delay-1 mt-5 text-4xl md:text-6xl font-semibold tracking-tight max-w-3xl text-balance">
            Carbon credits, traced to the source.
          </h1>
          <p className="reveal reveal-delay-2 mt-5 text-lg md:text-xl text-sand-100/85 max-w-2xl">
            A curated marketplace for high-integrity carbon credits — from major registries (Verra, Gold Standard,
            ACR, Puro.earth) and directly from <strong className="text-white">self-verified</strong> project
            developers. Tell us what you need and we source it, with the registry serial numbers confirmed in
            writing before you pay a penny.
          </p>
          <div className="reveal reveal-delay-3 mt-8 flex flex-wrap gap-3">
            <Link href="/browse" className="btn-primary bg-sand-50 text-forest-900 hover:bg-white shadow-lift">
              Browse credits →
            </Link>
            <Link href="/sell" className="btn-secondary border-sand-50 text-sand-50 hover:bg-white/10">
              List your project
            </Link>
          </div>
          <dl className="reveal reveal-delay-4 mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
            <Stat label="Projects listed" value={String(listings.length)} />
            <Stat label="Registry-issued" value={String(registryIssuedCount)} />
            <Stat label="Tonnes listed" value={`${(totalTonnes / 1000).toFixed(0)}k`} />
            <Stat label="Countries" value={String(new Set(listings.map((l) => l.country)).size)} />
          </dl>
        </div>
      </section>

      {/* Featured */}
      <section className="container-narrow py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="reveal text-2xl md:text-3xl font-semibold text-forest-900">Featured projects</h2>
            <p className="mt-2 text-forest-700/80">Hand-picked listings across nature-based, engineered, and community categories.</p>
          </div>
          <Link href="/browse" className="hidden md:inline text-sm font-medium text-forest-700 hover:text-forest-600">View all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      {/* Quality */}
      <section className="bg-gradient-to-b from-white to-sand-50/40 border-y border-forest-100">
        <div className="container-narrow py-16">
          <div className="grid md:grid-cols-3 gap-10">
            <Pillar
              title="Two-tier verification"
              body="Choose between Prime Origins Verified credits (registered with Verra, Gold Standard, ACR, Puro.earth, or Climate Action Reserve) or Self-Verified credits with transparent developer documentation. Filter by tier when you browse."
            />
            <Pillar
              title="Labelled, not laundered"
              body="Registry-backed listings carry public serial numbers and third-party validation. Self-verified listings publish the developer's own documentation in full, marked as exactly that. Every listing says which it is, so you are never guessing what you are buying."
            />
            <Pillar
              title="Priced before you commit"
              body="Request a quote and we come back with a firm price against a named project — registry, vintage and serial numbers included. Nothing is charged until you accept, and we handle the registry retirement in your name once it is."
            />
          </div>
        </div>
      </section>

      {/* Tiers explained */}
      <section className="container-narrow py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-forest-900">Two ways to source credits on Atlas</h2>
          <p className="mt-2 text-forest-700/80">The difference is who issued the underlying verification — and every listing is labelled with which.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <TierCard
            badgeColor="bg-forest-700"
            badge="✓ Prime Origins Verified"
            title="Registry-issued credits"
            body="Credits issued under Verra, Gold Standard, ACR, Puro.earth, or Climate Action Reserve. Public serial numbers, formal methodologies, third-party validation and verification. Best for corporate buyers with strict compliance requirements (SBTi, VCMI, CSRD, CDP)."
            bullets={[
              'Public registry serial numbers',
              'Independently validated & verified',
              'Buffer-pool contributions where applicable',
              'Suitable for compliance reporting'
            ]}
          />
          <TierCard
            badgeColor="bg-amber-500"
            badge="Self-Verified"
            title="Direct from developers"
            body="Smaller projects and innovative methodologies that aren't yet on a major registry. Developers provide their own documentation — coordinates, sampling reports, COAs — which we publish transparently so buyers can review."
            bullets={[
              'Developer documentation published in full, unedited',
              'Coordinates and on-the-ground evidence',
              'Clearly labelled so it is never mistaken for registry-issued',
              'Suited to voluntary action and pilot programmes'
            ]}
          />
        </div>
      </section>

      {/* Talk to us */}
      <TalkToUs variant="banner" />

      {/* CTA */}
      <section className="container-narrow py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-forest-900">Get a real price, against a real project.</h2>
        <p className="mt-3 text-forest-700/80 max-w-xl mx-auto">
          Whether you're hitting a net-zero target or sourcing for a portfolio mandate, tell us the volume, vintage and whether you need retirement in your own name. You'll get a firm quote and the paperwork to check before you commit.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Link href="/browse" className="btn-primary">Browse the catalogue</Link>
          <Link href="/how-it-works" className="btn-secondary">How it works</Link>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l-2 border-white/15 pl-3">
      <dd className="text-3xl font-semibold tracking-tight">{value}</dd>
      <dt className="mt-1 text-xs uppercase tracking-wider text-sand-100/70">{label}</dt>
    </div>
  );
}

function Pillar({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-forest-900">{title}</h3>
      <p className="mt-2 text-sm text-forest-800/90 leading-relaxed">{body}</p>
    </div>
  );
}

function TierCard({ badgeColor, badge, title, body, bullets }: { badgeColor: string; badge: string; title: string; body: string; bullets: string[] }) {
  return (
    <div className="rounded-2xl border border-forest-100 bg-white p-6 md:p-8 shadow-soft transition-all duration-300 hover:shadow-lift motion-safe:hover:-translate-y-1">
      <span className={`chip ${badgeColor} text-white`}>{badge}</span>
      <h3 className="mt-4 text-xl font-semibold text-forest-900">{title}</h3>
      <p className="mt-2 text-sm text-forest-800/90 leading-relaxed">{body}</p>
      <ul className="mt-4 space-y-1.5 text-sm text-forest-800">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2"><span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-forest-600" /><span>{b}</span></li>
        ))}
      </ul>
    </div>
  );
}
