import Link from 'next/link';
import Image from 'next/image';
import type { Listing } from '@/lib/types';
import { categoryLabels } from '@/lib/listings';
import { availabilityShort, isIndicativePrice, isUkCode, statusChip } from '@/lib/status';
import ProjectPlate from './ProjectPlate';

export default function ListingCard({ listing }: { listing: Listing }) {
  // One status chip, from lib/status.ts. This card used to render a
  // "Registry-issued" badge and a "Pending units" badge side by side, which
  // told the buyer two opposite things about the same listing.
  const status = statusChip(listing);

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-soft transition-all duration-300 hover:border-forest-200 hover:shadow-lift motion-safe:hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-forest-100">
        {listing.imageUrl ? (
          <Image
            src={listing.imageUrl}
            alt={listing.projectName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.06]"
          />
        ) : (
          <ProjectPlate listing={listing} compact />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-900/35 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" aria-hidden />
        {/* Only the category sits on the image. The status chip is the longest
            label on the card ("Pending Issuance Units") and overlapped the
            plate's place name when both were anchored here, so it moved down
            into the fact row where it has the card's full width. */}
        <div className="pointer-events-none absolute left-3 top-3">
          <span className="chip backdrop-blur bg-white/85 shadow-sm">{categoryLabels[listing.category]}</span>
        </div>
      </div>
      <div className="flex flex-col p-5 gap-3">
        <div>
          <h3 className="text-base font-semibold text-forest-900 leading-tight transition-colors group-hover:text-forest-700">{listing.projectName}</h3>
          <p className="text-xs text-forest-700/80 mt-0.5">{listing.developer} · {listing.country}</p>
        </div>
        <p className="text-sm text-forest-800/90 line-clamp-2">{listing.summary}</p>
        <div className="flex flex-wrap gap-1.5">
          <span className={status.tone === 'solid' ? 'chip-solid' : 'chip-warn'}>{status.label}</span>
          <span className="chip-outline">{listing.registry}</span>
          <span className="chip-outline">
            {isUkCode(listing)
              ? `Planted ${listing.plantingYear ?? listing.vintage}`
              : `Vintage ${listing.vintage}`}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-3 gap-y-1 border-t border-forest-100 pt-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-forest-600">{isIndicativePrice(listing) ? 'Indicative' : 'From'}</p>
            <p className="whitespace-nowrap text-lg font-semibold text-forest-900">£{listing.pricePerTonne.toFixed(2)}<span className="text-xs font-normal text-forest-700">/tCO₂e</span></p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-medium text-forest-700/80 transition-all group-hover:text-forest-700 group-hover:gap-1.5">
            {availabilityShort(listing)}
            <span aria-hidden className="transition-transform motion-safe:group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
