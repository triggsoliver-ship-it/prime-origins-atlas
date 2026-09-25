import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getListing, listings, categoryLabels } from '@/lib/listings';
import {
  assuranceLabel,
  availabilityLabel,
  isUkCode,
  retirementExplainer,
  retirementLabel,
  statusChip,
  statusLabel,
  supplyBasisOf,
  unitKindOf,
  volumeField,
} from '@/lib/status';
import BuyPanel from '@/components/BuyPanel';
import ProjectMap from '@/components/ProjectMap';
import ProjectPlate from '@/components/ProjectPlate';

export function generateStaticParams() {
  return listings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  // Next 15: params is a Promise.
  const { slug } = await params;
  const l = getListing(slug);
  if (!l) return { title: 'Listing not found' };
  // The title and search snippet are promises like any other. They must name
  // the right instrument: a Pending Issuance Unit is not a carbon credit, and
  // the UK codes publish a planting year rather than a unit vintage.
  const kind = unitKindOf(l);
  const noun = kind === 'pending-unit'
    ? 'Pending Issuance Units'
    : kind === 'self-reported-unit'
    ? 'Self-Verified Units'
    : 'Carbon Credits';
  const dated = isUkCode(l) ? `planted ${l.plantingYear ?? l.vintage}` : `vintage ${l.vintage}`;
  const title = `${l.projectName} — ${l.registry} ${noun} | £${l.pricePerTonne.toFixed(2)}/tCO₂e indicative`;
  const held = supplyBasisOf(l) === 'held';
  const description = held
    ? `${l.summary} Buy ${l.projectName} ${noun.toLowerCase()} from £${l.pricePerTonne.toFixed(2)} per tonne. ${l.registry}, ${l.country}, ${dated}. ${statusLabel(l)}.`
    : kind === 'pending-unit'
    ? `${l.summary} Request a quote for ${l.projectName} Pending Issuance Units, indicative £${l.pricePerTonne.toFixed(2)} per tonne. ${l.registry}, ${l.country}, ${dated}. Pending Issuance Units are a promise of future verified removal and cannot yet be used to report against emissions. Availability confirmed with the developer on request.`
    : kind === 'self-reported-unit'
    ? `${l.summary} Request a quote for ${l.projectName}, indicative £${l.pricePerTonne.toFixed(2)} per tonne. ${l.country}, ${dated}. Documented by the developer, not issued on a registry and not independently verified. Availability confirmed on request.`
    : `${l.summary} Request a quote for ${l.projectName} carbon credits, indicative £${l.pricePerTonne.toFixed(2)} per tonne. ${l.registry}, ${l.country}, ${dated}. Sourced to order, with availability and registry serial numbers confirmed in writing before payment.`;
  return {
    title,
    description,
    keywords: [
      `${l.projectName} ${noun.toLowerCase()}`,
      `${l.registry} ${noun.toLowerCase()}`,
      `${l.country} carbon market`,
      `${categoryLabels[l.category]} projects`,
      `${l.methodology}`,
      'carbon credit marketplace'
    ],
    alternates: { canonical: `/listings/${l.slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/listings/${l.slug}`,
      ...(l.imageUrl ? { images: [{ url: l.imageUrl, alt: l.projectName }] } : {})
    },
    twitter: { card: 'summary_large_image', title, description, ...(l.imageUrl ? { images: [l.imageUrl] } : {}) }
  };
}

export default async function ListingDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = getListing(slug);
  if (!listing) notFound();

  // Every judgement about what this listing is comes from lib/status.ts, so
  // the chips, the detail table, the structured data and the quote panel
  // cannot disagree with each other.
  const inStock = supplyBasisOf(listing) === 'held';
  const ukCode = isUkCode(listing);
  const isPending = unitKindOf(listing) === 'pending-unit';
  const status = statusChip(listing);
  const volume = volumeField(listing);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.projectName,
    description: listing.description,
    ...(listing.imageUrl ? { image: listing.imageUrl } : {}),
    brand: { '@type': 'Organization', name: listing.developer },
    category: `Carbon Credits / ${categoryLabels[listing.category]}`,
    offers: {
      '@type': 'Offer',
      url: `/listings/${listing.slug}`,
      priceCurrency: 'GBP',
      price: listing.pricePerTonne,
      availability: inStock
        ? (listing.tonnesAvailable > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock')
        : 'https://schema.org/PreOrder',
      itemCondition: 'https://schema.org/NewCondition'
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Registry', value: listing.registry },
      { '@type': 'PropertyValue', name: 'Project ID', value: listing.projectId },
      { '@type': 'PropertyValue', name: 'Methodology', value: listing.methodology },
      ...(ukCode
        ? [{ '@type': 'PropertyValue', name: 'Planting year', value: String(listing.plantingYear ?? listing.vintage) }]
        : [{ '@type': 'PropertyValue', name: 'Vintage', value: String(listing.vintage) }]),
      { '@type': 'PropertyValue', name: 'Country', value: listing.country },
      { '@type': 'PropertyValue', name: 'Unit type', value: statusLabel(listing) },
      { '@type': 'PropertyValue', name: 'Verification status', value: assuranceLabel(listing) },
      { '@type': 'PropertyValue', name: 'Availability', value: availabilityLabel(listing) }
    ]
  };

  return (
    <div className="container-narrow py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/browse" className="text-sm text-forest-700 hover:text-forest-600">← Back to browse</Link>

      <div className="mt-6 grid lg:grid-cols-[1.4fr_1fr] gap-10">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-forest-100">
            {listing.imageUrl ? (
              <Image src={listing.imageUrl} alt={listing.projectName} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" priority />
            ) : (
              <ProjectPlate listing={listing} />
            )}
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="chip">{categoryLabels[listing.category]}</span>
              <span className={status.tone === 'solid' ? 'chip-solid' : 'chip-warn'}>{statusLabel(listing)}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-forest-900">{listing.projectName}</h1>
            <p className="mt-1 text-forest-700">{listing.developer} · {listing.country}{listing.region ? `, ${listing.region}` : ''}</p>
            <p className="mt-5 text-forest-800 leading-relaxed">{listing.description}</p>

            {isPending && (
              <div className="mt-6 rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-5">
                <p className="text-[11px] uppercase tracking-wider text-amber-700 font-semibold">
                  This listing offers Pending Issuance Units, not carbon credits
                </p>
                <p className="mt-2 text-sm leading-relaxed text-forest-900">
                  The Woodland Carbon Code defines a Pending Issuance Unit as &ldquo;a promise to deliver a Woodland
                  Carbon Unit in the future, based on predicted carbon dioxide equivalent removal&rdquo;.{' '}
                  <strong>It is not guaranteed, so it cannot be used to report against UK-based emissions.</strong>{' '}
                  Only a verified Woodland Carbon Unit can do that &mdash; and not against overseas emissions, or
                  emissions from international aviation or shipping.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-forest-800">
                  What it is good for: the Code&rsquo;s own position is that pending units let a company make a
                  credible statement about supporting UK woodland creation, and they lock in future removals at
                  today&rsquo;s price. Units convert to Woodland Carbon Units once the woodland is found to be
                  performing well at verification &mdash; first at year five, then at least every ten years.
                </p>
                <p className="mt-3 text-xs text-forest-700">
                  Source:{' '}
                  <a
                    href="https://www.woodlandcarboncode.org.uk/what-you-can-buy"
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    Woodland Carbon Code &mdash; What you can buy
                  </a>
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
              {ukCode ? (
                <>
                  <Field label="Planting year" value={String(listing.plantingYear ?? listing.vintage)} />
                  {listing.areaHectares !== undefined && (
                    <Field label="Area planted" value={`${listing.areaHectares.toLocaleString()} ha`} />
                  )}
                  {volume && (
                    <Field label={volume.label} value={`${volume.value.toLocaleString()} tCO₂e`} note={volume.note} />
                  )}
                </>
              ) : (
                <>
                  <Field label="Vintage" value={String(listing.vintage)} />
                  {volume && (
                    <Field label={volume.label} value={`${volume.value.toLocaleString()} tCO₂e`} note={volume.note} />
                  )}
                </>
              )}
              {listing.bufferPoolPct !== undefined && <Field label="Buffer pool" value={`${listing.bufferPoolPct}%`} />}
              <Field
                label="Available through Atlas"
                value={availabilityLabel(listing)}
                note={inStock ? undefined : 'Atlas holds no stock of this project. We confirm the real figure with the developer when we quote.'}
              />
              <Field label="Retirement" value={retirementLabel(listing)} note={retirementExplainer(listing)} />
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
                  : 'Supporting documents from the registry record, checked by Prime Origins. Prime Origins does not itself verify or certify the underlying units.'}
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
              <Check label={assuranceLabel(listing)} />
              <Check label={`Methodology: ${listing.methodology}`} />
              {listing.bufferPoolPct ? (
                <Check label={ukCode
                  ? `${listing.bufferPoolPct}% of this project's units go to the Woodland Carbon Code buffer, which covers losses across the scheme`
                  : `${listing.bufferPoolPct}% contribution to permanence buffer pool`} />
              ) : null}
              {listing.tier === 'prime-origins-verified' ? (
                <Check label="Registry record and project documentation checked by Prime Origins. Atlas does not issue, verify or certify units itself." />
              ) : (
                <Check label="Listed on the developer's own documentation and not independently reviewed by Prime Origins — read the documents before committing" />
              )}
              <Check label={retirementExplainer(listing)} />
              <Check label="Suitability for your own reporting depends on the unit, the claim and the rules that apply to your organisation. Check before you buy." />
            </ul>
          </section>
        </div>

        <BuyPanel listing={listing} />
      </div>
    </div>
  );
}

function Field({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-forest-600">{label}</dt>
      <dd className="text-sm font-medium text-forest-900 mt-0.5">{value}</dd>
      {note && <p className="mt-1 text-[11px] leading-snug text-forest-700/75">{note}</p>}
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
