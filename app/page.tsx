import Link from 'next/link';
import ListingCard from '@/components/ListingCard';
import { getFeaturedListings, listings } from '@/lib/listings';

export default function HomePage() {
  const featured = getFeaturedListings();
  const totalTonnes = listings.reduce((s, l) => s + l.tonnesAvailable, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-700 via-forest-800 to-forest-900" aria-hidden />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_50%)]" aria-hidden />
        <div className="container-narrow relative py-20 md:py-28 text-sand-50">
          <span className="chip bg-white/15 text-sand-50 border border-white/20">
            On-chain origin · Full transparency
          </span>
          <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight max-w-3xl">
            Carbon credits, traced to the source.
          </h1>
          <p className="mt-5 text-lg md:text-xl text-sand-100/85 max-w-2xl">
            Prime Origins Atlas is a curated marketplace for high-integrity carbon credits —
            nature-based, engineered removals, and renewable energy — each one vetted, verifiable, and retirable.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/browse" className="btn-primary bg-sand-50 text-forest-900 hover:bg-white">
              Browse credits →
            </Link>
            <Link href="/sell" className="btn-secondary border-sand-50 text-sand-50 hover:bg-white/10">
              List your project
            </Link>
          </div>
          <dl className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
            <Stat label="Vetted projects" value={String(listings.length)} />
            <Stat label="Tonnes available" value={`${(totalTonnes / 1000).toFixed(0)}k`} />
            <Stat label="Registries supported" value="5" />
            <Stat label="Countries" value={String(new Set(listings.map((l) => l.country)).size)} />
          </dl>
        </div>
      </section>

      {/* Featured */}
      <section className="container-narrow py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-forest-900">Featured projects</h2>
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
      <section className="bg-white border-y border-forest-100">
        <div className="container-narrow py-16">
          <div className="grid md:grid-cols-3 gap-10">
            <Pillar
              title="Registry-verified"
              body="Every credit links to a public serial number on Verra, Gold Standard, ACR, Puro.earth, or Climate Action Reserve. No mystery offsets."
            />
            <Pillar
              title="Quality-filtered"
              body="Prime Origins screens for additionality, permanence, methodology rigour, and co-benefit substance before listing — not after."
            />
            <Pillar
              title="Retirement on request"
              body="Buy and retire in a single flow. We handle registry retirement and send you the certificate within 48 hours."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-narrow py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-forest-900">Start retiring credits with confidence.</h2>
        <p className="mt-3 text-forest-700/80 max-w-xl mx-auto">
          Whether you're hitting a net-zero target or sourcing for a portfolio mandate, Atlas gets you to verified, claimable credits faster.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Link href="/browse" className="btn-primary">Browse the catalog</Link>
          <Link href="/how-it-works" className="btn-secondary">How it works</Link>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-sand-100/70">{label}</dt>
      <dd className="mt-1 text-3xl font-semibold">{value}</dd>
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
