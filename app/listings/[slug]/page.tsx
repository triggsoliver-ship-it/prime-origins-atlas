import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getListing, listings, categoryLabels } from '@/lib/listings';
import { isSaleable } from '@/lib/saleable';
import BuyPanel from '@/components/BuyPanel';
import ProjectMap from '@/components/ProjectMap';

export function generateStaticParams() {
  return listings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  // Next 15: params is a Promise.
  const { slug } = await params;
  const l = getListing(slug);
  if (!l) return { title: 'Listing not found' };
  const title = `${l.projectName} — ${l.registry} ${l.vintage} Carbon Credits | £${l.pricePerTonne}/tCO₂e`;
  // Only say "buy" and promise retirement where Atlas actually holds the
  // credits. Everything else is sourced to order, and the search snippet is a
  // promise like any other.
  const held = isSaleable(l.id);
  const description = held
    ? `${l.summary} Buy ${l.projectName} carbon credits from £${l.pricePerTonne.toFixed(2)} per tonne. ${l.registry}, ${l.country}, vintage ${l.vintage}. Retirement included.`
    : `${l.summary} Request a quote for ${l.projectName} carbon credits, indicative £${l.pricePerTonne.toFixed(2)} per tonne. ${l.registry}, ${l.country}, vintage ${l.vintage}. Sourced to order with registry serial numbers confirmed before payment.`;
  return {
    title,
    description,
    keywords: [
      `${l.projectName} carbon credits`,
      `${l.registry} credits`,
      `${l.country} carbon credits`,
      `${categoryLabels[l.category]} credits`,
      `buy ${l.registry} credits`,
      `${l.methodology} credits`,
      'carbon credit marketplace',
      'verified carbon credits'
    ],
    alternates: { canonical: `/listings/${l.slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/listings/${l.slug}`,
      images: [{ url: l.imageUrl, alt: l.projectName }]
    },
    twitter: { card: 'summary_large_image', title, description, images: [l.imageUrl] }
  };
}

export default async function ListingDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = getListing(slug);
  if (!listing) notFound();

  // Atlas only holds stock for ids in lib/saleable.ts. Everything else is
  // sourced to order, and both the page copy and the structured data have to
  // say so — telling Google "InStock" about credits we do not hold is the same
  // false promise as printing it on the page.
  const inStock = isSaleable(listing.id);
  // The UK codes publish a different set of facts from the international
  // registries, and the pending/verified split changes what a buyer may claim.
  const isUkCode = listing.registry === 'Woodland Carbon Code' || listing.registry === 'Peatland Code';
  const isPending = listing.unitType === 'piu';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.projectName,
    description: listing.description,
    image: listing.imageUrl,
    brand: { '@type': 'Organization', name: listing.developer },
    category: `Carbon Credits / ${categoryLabels[listing.category]}`,
    offers: {
      '@type': 'Offer',
      url: `/listings/${listing.slug}`,
      priceCurrency: 'GBP',
      price: listing.pricePerTonne,
      availability: inStock
        ? (listing.tonnesAvailable > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock')
        : 'https://schema.org/LimitedAvailability',
      itemCondition: 'https://schema.org/NewCondition'
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Registry', value: listing.registry },
      { '@type': 'PropertyValue', name: 'Project ID', value: listing.projectId },
      { '@type': 'PropertyValue', name: 'Methodology', value: listing.methodology },
      { '@type': 'PropertyValue', name: 'Vintage', value: String(listing.vintage) },
      { '@type': 'PropertyValue', name: 'Country', value: listing.country },
      {
        '@type': 'PropertyValue',
        name: inStock ? 'Tonnes available' : 'Indicative project volume',
        value: String(listing.tonnesAvailable)
      }
    ]
  };

  return (
    <div className="container-narrow py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/browse" className="text-sm text-forest-700 hover:text-forest-600">← Back to browse</Link>

      <div className="mt-6 grid lg:grid-cols-[1.4fr_1fr] gap-10">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-forest-100">
            <Image src={listing.imageUrl} alt={listing.projectName} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="chip">{categoryLabels[listing.category]}</span>
              <span className="chip">{listing.registry}</span>
              {listing.tier === 'prime-origins-verified' && <span className="chip bg-forest-700 text-white">Registry-issued</span>}
              {listing.unitType === 'piu' && <span className="chip bg-amber-500 text-white">Pending units</span>}
              {listing.tier === 'self-verified' && <span className="chip bg-amber-500 text-white">Self-Verified</span>}
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-forest-900">{listing.projectName}</h1>
            <p className="mt-1 text-forest-700">{listing.developer} · {listing.country}{listing.region ? `, ${listing.region}` : ''}</p>
            <p className="mt-5 text-forest-800 leading-relaxed">{listing.description}</p>

            {isPending && (
              <div className="mt-6 rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-5">
                <p className="text-[11px] uppercase tracking-wider text-amber-700 font-semibold">
                  This is a Pending Issuance Unit
                </p>
                <p className="mt-2 text-sm leading-relaxed text-forest-900">
                  A Pending Issuance Unit is the Woodland Carbon Code&rsquo;s promise to deliver a verified unit in
                  future, based on predicted removal. <strong>It is not yet a carbon credit, and it cannot be used to
                  report against your emissions.</strong> Only a verified Woodland Carbon Unit can do that, and only
                  against UK emissions &mdash; never against international aviation or shipping.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-forest-800">
                  What it is good for: locking in future UK removals at today&rsquo;s price, and making an honest
                  public statement that you are funding new UK woodland. Units convert as each vintage passes
                  verification, from year five and roughly every ten years after.
                </p>
              </div>
            )}
          </div>

          <section className="mt-10">
            <h2 className="text-xl font-semibold text-forest-900 mb-3">Project details</h2>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 rounded-2xl border border-forest-100 bg-white p-6">
              <Field label="Registry" value={listing.registry} />
              <Field label="Project ID" value={listing.projectId} />
              <Field label="Methodology" value={listing.methodology} />
              {isUkCode ? (
                <>
                  <Field label="Planting year" value={String(listing.plantingYear ?? listing.vintage)} />
                  {listing.areaHectares !== undefined && (
                    <Field label="Area planted" value={`${listing.areaHectares.toLocaleString()} ha`} />
                  )}
                  {listing.predictedTonnes !== undefined && (
                    <Field label="Predicted sequestration" value={`${listing.predictedTonnes.toLocaleString()} tCO₂e`} />
                  )}
                </>
              ) : (
                <>
                  <Field label="Vintage" value={String(listing.vintage)} />
                  <Field label="Total issued" value={`${listing.totalIssued.toLocaleString()} tCO₂e`} />
                  <Field
                    label={inStock ? 'Available' : 'Indicative volume'}
                    value={`${listing.tonnesAvailable.toLocaleString()} tCO₂e`}
                  />
                </>
              )}
              {listing.bufferPoolPct !== undefined && <Field label="Buffer pool" value={`${listing.bufferPoolPct}%`} />}
              <Field label="Retirement" value={listing.retirementSupported ? 'Supported' : 'On request'} />
            </dl>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-semibold text-forest-900 mb-3">Co-benefits</h2>
            <div className="flex flex-wrap gap-2">
              {listing.cobenefits.map((c) => <span key={c} className="chip-outline">{c}</span>)}
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="text-xs uppercase tracking-wider text-forest-600 mr-1 self-center">SDGs:</span>
              {listing.sdgs.map((n) => (
                <span key={n} className="inline-grid h-7 w-7 place-items-center rounded-full bg-forest-700 text-white text-xs font-semibold">{n}</span>
              ))}
            </div>
          </section>

          {listing.latitude !== undefined && listing.longitude !== undefined && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold text-forest-900 mb-3">Project location</h2>
              <ProjectMap lat={listing.latitude} lng={listing.longitude} name={listing.projectName} />
              <p className="text-xs text-forest-700/70 mt-2">{listing.latitude.toFixed(4)}°, {listing.longitude.toFixed(4)}° — {listing.country}{listing.region ? `, ${listing.region}` : ''}</p>
            </section>
          )}

          {listing.documents && listing.documents.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold text-forest-900 mb-3">Verification documents</h2>
              <p className="text-sm text-forest-700 mb-3">
                {listing.tier === 'self-verified'
                  ? 'These documents are provided directly by the project developer. Prime Origins has not independently verified the contents — buyers should review carefully.'
                  : 'Supporting documents reviewed during Prime Origins vetting.'}
              </p>
              <ul className="space-y-2">
                {listing.documents.map((d) => (
                  <li key={d.url}>
                    <a href={d.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-forest-100 bg-white px-4 py-3 hover:bg-forest-50 transition">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-forest-700 text-white text-xs font-semibold">PDF</span>
                      <span className="flex-1">
                        <span className="block text-sm font-medium text-forest-900">{d.label}</span>
                        {d.filename && <span className="block text-xs text-forest-700/70">{d.filename}</span>}
                      </span>
                      <span className="text-forest-600">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-10">
            <h2 className="text-xl font-semibold text-forest-900 mb-3">Quality assurance</h2>
            <ul className="space-y-2 text-sm text-forest-800">
              <Check label={`Registered under ${listing.registry} — public serial numbers available`} />
              <Check label={`Methodology: ${listing.methodology}`} />
              {listing.bufferPoolPct ? (
                <Check label={isUkCode
                  ? `${listing.bufferPoolPct}% of this project's units go to the Woodland Carbon Code buffer, which covers losses across the scheme`
                  : `${listing.bufferPoolPct}% contribution to permanence buffer pool`} />
              ) : null}
              {listing.tier === 'prime-origins-verified' ? (
                <Check label="Listing reviewed by Prime Origins for additionality, permanence and co-benefit substance" />
              ) : (
                <Check label="Listed by the developer and not independently reviewed by Prime Origins — check the documents before committing" />
              )}
              {isPending ? (
                <Check label="Assigned to you on the UK Land Carbon Registry — pending units cannot be retired until they are verified" />
              ) : inStock ? (
                <Check label="Retirement certificate provided within 48h of purchase" />
              ) : (
                <Check label="Retirement handled on your behalf, with the certificate issued once the registry transfer completes" />
              )}
            </ul>
          </section>
        </div>

        <BuyPanel listing={listing} />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-forest-600">{label}</dt>
      <dd className="text-sm font-medium text-forest-900 mt-0.5">{value}</dd>
    </div>
  );
}

function Check({ label }: { label: string }) {
  return (
    <li className="flex gap-2">
      <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-forest-600" />
      <span>{label}</span>
    </li>
  );
}
