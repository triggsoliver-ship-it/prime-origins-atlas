import Link from 'next/link';
import ListingCard from '@/components/ListingCard';
import TalkToUs from '@/components/TalkToUs';
import { getFeaturedListings, listings } from '@/lib/listings';
import { catalogueStats, compactTonnes } from '@/lib/status';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://primeoriginsatlas.org';

export default function HomePage() {
  const featured = getFeaturedListings();
  /**
   * Every figure in the hero comes from catalogueStats(), computed from the
   * catalogue itself. The previous row counted `tier === 'prime-origins-verified'`
   * as "Registry-issued", which swept all 12 Woodland Carbon Code projects into
   * the issued-credit total even though their units are pending issuance — and
   * it printed a "Tonnes listed" figure that was the sum of a field meaning
   * nothing on two-thirds of the catalogue.
   */
  const stats = catalogueStats(listings);

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Prime Origins Atlas',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    // No parentOrganization claim: Atlas sits in the Prime Origins ecosystem,
    // which is a brand relationship. Asserting a legal parent in structured
    // data would be stating a corporate fact this site cannot evidence.
    description:
      'A marketplace for registry-issued carbon credits and UK Woodland Carbon Code Pending Issuance Units, each listed with its registry, unit type and verification status.'
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
            Every listing says what it is
          </span>
          <h1 className="reveal reveal-delay-1 mt-5 text-4xl md:text-6xl font-semibold tracking-tight max-w-3xl text-balance">
            Carbon projects, traced to the source.
          </h1>
          <p className="reveal reveal-delay-2 mt-5 text-lg md:text-xl text-sand-100/85 max-w-2xl">
            Registry-issued credits from Verra, Gold Standard, ACR, Puro.earth and Climate Action Reserve; UK
            woodland <strong className="text-white">Pending Issuance Units</strong> under the Woodland Carbon Code;
            and projects listed on their developer&rsquo;s own documentation. Each one is labelled with its registry,
            its unit type and what has actually been verified &mdash; because those three things decide what you can
            claim.
          </p>
          <div className="reveal reveal-delay-3 mt-8 flex flex-wrap gap-3">
            <Link href="/browse" className="btn-primary bg-sand-50 text-forest-900 hover:bg-white shadow-lift">
              Browse projects →
            </Link>
            <Link href="/sell" className="btn-secondary border-sand-50 text-sand-50 hover:bg-white/10">
              List your project
            </Link>
          </div>
          <dl className="reveal reveal-delay-4 mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
            <Stat
              label="Projects listed"
              value={String(stats.totalProjects)}
              note={`across ${stats.countries} countries`}
            />
            <Stat
              label="With issued credits"
              value={String(stats.projectsWithIssuedCredits)}
              note="verified and issued on a registry"
            />
            <Stat
              label="UK woodland projects"
              value={String(stats.ukCodeProjects)}
              note="Pending Issuance Units, not yet verified"
            />
            <Stat
              label="Availability"
              value="On request"
              note="Atlas holds no stock of its own"
            />
          </dl>
          <p className="reveal reveal-delay-4 mt-6 max-w-2xl text-sm leading-relaxed text-sand-100/70">
            Reading those numbers: the {stats.projectsWithIssuedCredits} registry-issued projects have been issued{' '}
            {compactTonnes(stats.issuedTonnesLifetime)} tCO₂e in total by their registries over the projects&rsquo;
            whole lifetimes, and the {stats.ukCodeProjects} UK woodland projects forecast{' '}
            {stats.predictedTonnesLifetime.toLocaleString()} tCO₂e of removal over theirs. Neither figure is stock for
            sale. We confirm what is actually available, and at what price, with the developer when we quote.
          </p>
        </div>
      </section>

      {/* Featured */}
      <section className="container-narrow py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="reveal text-2xl md:text-3xl font-semibold text-forest-900">UK woodland, and the wider market</h2>
            <p className="mt-2 text-forest-700/80 max-w-xl">
              Woodland Carbon Code projects you can source domestically, listed with their registry number, planted
              area and predicted removal. Their units are <strong>Pending Issuance Units</strong> &mdash; a promise of
              future verified removal, which cannot yet be used to report against emissions. Every card says which
              instrument it is offering.
            </p>
          </div>
          <Link href="/browse" className="hidden md:inline text-sm font-medium text-forest-700 hover:text-forest-600">View all {stats.totalProjects} →</Link>
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
              title="The instrument is named"
              body="An issued credit, a Pending Issuance Unit and a developer's own measurement are three different things, and only the first is a verified carbon credit. Every listing states which one it is offering, on the card and on the page. You can filter the whole catalogue by it."
            />
            <Pillar
              title="Suitability is yours to judge"
              body="Each listing identifies its registry or developer documentation, unit type and verification status. Buyers should assess whether the units and proposed use meet the requirements applicable to their organisation and claim. Atlas does not issue, verify or certify anything itself."
            />
            <Pillar
              title="Priced before you commit"
              body="Atlas holds no stock, so every price here is indicative. Request a quote and we come back with a firm price against a named project, stating the unit type and the registry position — including serial numbers where the units have been issued. Nothing is charged until you accept in writing."
            />
          </div>
        </div>
      </section>

      {/* Tiers explained */}
      <section className="container-narrow py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-forest-900">Three instruments, and they are not interchangeable</h2>
          <p className="mt-2 text-forest-700/80">
            What you may claim depends on which of these you buy. Every listing is labelled with one of them.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <TierCard
            badgeColor="bg-forest-700"
            badge="Registry-issued"
            title="Issued carbon credits"
            body="Units already verified and issued under Verra, Gold Standard, ACR, Puro.earth or Climate Action Reserve. Public serial numbers, a published methodology, third-party validation and verification."
            bullets={[
              'Public registry serial numbers',
              'Independently validated and verified',
              'Buffer-pool contribution where the methodology requires one',
              'Retired in your name on the registry'
            ]}
          />
          <TierCard
            badgeColor="bg-amber-500"
            badge="Pending Issuance Units"
            title="UK woodland, not yet verified"
            body="The Woodland Carbon Code's own definition: a promise to deliver a Woodland Carbon Unit in future, based on predicted removal. It is not guaranteed, so it cannot be used to report against UK-based emissions."
            bullets={[
              'Project registered and validated under the Woodland Carbon Code',
              'Assigned to you on the UK Land Carbon Registry, not retired',
              'Converts to a Woodland Carbon Unit at verification',
              'Supports a credible statement about funding UK woodland creation'
            ]}
          />
          <TierCard
            badgeColor="bg-amber-500"
            badge="Self-verified"
            title="Developer documentation only"
            body="Smaller projects and newer methodologies not on a registry. The developer supplies its own evidence — coordinates, sampling reports, certificates of analysis — which we publish unedited."
            bullets={[
              "Developer's documentation published in full",
              'Not verified by a third party and not registry-issued',
              'No registry retirement available',
              'Labelled so it is never mistaken for an issued credit'
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
          Tell us the volume, the vintage and whether you need the units retired in your own name. You will get a firm price against a named project, with the unit type and registry position stated in writing, before you commit to anything.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Link href="/browse" className="btn-primary">Browse the catalogue</Link>
          <Link href="/how-it-works" className="btn-secondary">How it works</Link>
        </div>
      </section>
    </>
  );
}

/**
 * A figure is only auditable if its scope is printed with it. `note` is not
 * decoration — it is the difference between "16" and "16 projects whose units
 * a registry has verified and issued".
 */
function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  // A word-value like "On request" needs a smaller size than a two-digit
  // number, or it wraps and throws the row's baselines out.
  const isWordy = value.length > 4;
  return (
    <div className="border-l-2 border-white/15 pl-3">
      <dd className={`font-semibold tracking-tight ${isWordy ? 'text-xl leading-snug' : 'text-3xl'}`}>{value}</dd>
      <dt className="mt-1 text-xs uppercase tracking-wider text-sand-100/70">{label}</dt>
      {note && <p className="mt-1 text-[11px] leading-snug text-sand-100/55">{note}</p>}
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
