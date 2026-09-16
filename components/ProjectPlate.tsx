import type { Listing } from '@/lib/types';

/**
 * Stands in for a photograph on listings where we do not have one.
 *
 * The UK woodland listings were originally given stock images reused from
 * other listings in the catalogue. One of them put a Kenyan savannah with a
 * safari jeep at the top of a Northumberland woodland project. A buyer who
 * notices that stops believing anything else on the page, and rightly so.
 *
 * Rather than ship a generic forest photo that is still not the project, this
 * shows what we actually know and can evidence: where it is, how big it is,
 * what it is predicted to remove, and its registry number. That is more
 * convincing to a real buyer than a photograph of somewhere else.
 */
export default function ProjectPlate({ listing, compact = false }: { listing: Listing; compact?: boolean }) {
  const facts: Array<{ k: string; v: string }> = [];
  if (listing.areaHectares !== undefined) facts.push({ k: 'Area', v: `${listing.areaHectares.toLocaleString()} ha` });
  if (listing.predictedTonnes !== undefined) facts.push({ k: 'Predicted', v: `${listing.predictedTonnes.toLocaleString()} t` });
  if (listing.plantingYear !== undefined) facts.push({ k: 'Planted', v: String(listing.plantingYear) });

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-forest-900"
      role="img"
      aria-label={`${listing.projectName}, ${listing.region ?? listing.country}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-forest-700 via-forest-800 to-forest-900" aria-hidden />
      <div
        className="absolute inset-0 opacity-[0.16] bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,.7),transparent_58%)]"
        aria-hidden
      />
      {/* Contour-like strokes: a nod to a land parcel without pretending to be a photograph of one. */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.18]" viewBox="0 0 400 250" preserveAspectRatio="none" aria-hidden>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            d={`M-20 ${190 - i * 26} C 70 ${160 - i * 26}, 130 ${212 - i * 26}, 210 ${178 - i * 26} S 350 ${140 - i * 26}, 420 ${168 - i * 26}`}
            fill="none"
            stroke="#EAF3EE"
            strokeWidth="1.1"
          />
        ))}
      </svg>

      <div className={`relative flex h-full flex-col justify-end ${compact ? 'p-4' : 'p-6 md:p-7'}`}>
        <p className={`uppercase tracking-[0.14em] text-sand-100/70 ${compact ? 'text-[9px]' : 'text-[10px]'}`}>
          {listing.registry}
        </p>
        <p className={`mt-1 font-semibold leading-tight text-sand-50 ${compact ? 'text-base' : 'text-2xl md:text-3xl'}`}>
          {listing.region ?? listing.country}
        </p>

        {facts.length > 0 && (
          <dl className={`mt-3 flex flex-wrap ${compact ? 'gap-x-4 gap-y-1' : 'gap-x-7 gap-y-2'}`}>
            {facts.map((f) => (
              <div key={f.k}>
                <dt className={`uppercase tracking-[0.12em] text-sand-100/60 ${compact ? 'text-[9px]' : 'text-[10px]'}`}>{f.k}</dt>
                <dd className={`font-semibold tabular-nums text-sand-50 ${compact ? 'text-sm' : 'text-lg'}`}>{f.v}</dd>
              </div>
            ))}
          </dl>
        )}

        {!compact && (
          <p className="mt-4 border-t border-white/15 pt-3 font-mono text-[11px] text-sand-100/60">
            {listing.projectId} &middot; no project photograph held &mdash; figures are the published record
          </p>
        )}
      </div>
    </div>
  );
}
