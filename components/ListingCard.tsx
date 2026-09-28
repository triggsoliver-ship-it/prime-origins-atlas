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
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-forest-900/60 shadow-soft transition-all duration-300 hover:border-gold-500/30 hover:shadow-lift motion-safe:hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-950"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-forest-800/60">
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
          <span className="chip backdrop-blur bg-white/85 text-forest-800 shadow-sm">{categoryLabels[listing.category]}</span>
        </div>
      </div>
      <div className="flex flex-col p-5 gap-3">
        <div>
          <h3 className="text-base font-semibold text-sand-50 leading-tight transition-colors group-hover:text-gold-400">{listing.projectName}</h3>
          <p className="text-xs text-sand-100/70 mt-0.5">{listing.developer} · {listing.country}</p>
        </div>
        <p className="text-sm text-sand-100/80 line-clamp-2">{listing.summary}</p>
        <div className="flex flex-wrap gap-1.5">
          <span className={status.tone === 'solid' ? 'chip-solid' : 'chip-warn'}>{status.label}</span>
          <span className="chip-outline">{listing.registry}</span>
          <span className="chip-outline">
            {isUkCode(listing)
              ? `Planted ${listing.plantingYear ?? listing.vintage}`
              : `Vintage ${listing.vintage}`}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-3 gap-y-1 border-t border-white/10 pt-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-sand-100/55">{isIndicativePrice(listing) ? 'Indicative' : 'From'}</p>
            <p className="whitespace-nowrap text-lg font-semibold text-sand-50">£{listing.pricePerTonne.toFixed(2)}<span className="text-xs font-normal text-sand-100/60">/tCO₂e</span></p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-medium text-sand-100/65 transition-all group-hover:text-gold-400 group-hover:gap-1.5">
            {availabilityShort(listing)}
            <span aria-hidden className="transition-transform motion-safe:group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
