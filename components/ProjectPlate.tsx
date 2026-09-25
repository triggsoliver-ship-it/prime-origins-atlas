import type { Listing } from '@/lib/types';
import { isUkCode, unitKindOf } from '@/lib/status';

/**
 * Stands in for a photograph on every listing, because we do not have one for
 * any of them.
 *
 * The catalogue was seeded with stock photos that had nothing to do with the
 * projects. Gyapa Improved Cookstoves in Ghana and Uganda Improved Cookstoves
 * shared a single picture of a man throwing a camera in an autumn wood. Malawi
 * Safe Water Filters showed South Asian children. Doddington North, 254
 * hectares in Northumberland, showed a safari jeep on a savannah — the same
 * photo as a Kenyan REDD+ project. Six images were each used across two or
 * three unrelated projects on different continents, and one did not load at
 * all. A buyer who notices any of that stops believing the numbers too, and
 * they would be right to.
 *
 * So instead of a picture of somewhere else, each listing shows what it can
 * evidence: where it is, its scale, and its registry number. The panel is
 * tinted by project category so the grid still reads as a varied catalogue
 * rather than thirty-seven identical tiles.
 *
 * If a genuine project photograph ever arrives, set imageUrl and it takes
 * precedence automatically — nothing else needs changing.
 */

const PALETTE: Record<string, { from: string; via: string; to: string }> = {
  'nature-based':       { from: '#2F6B4F', via: '#1C4634', to: '#0E2A1F' },
  'engineered-removal': { from: '#3A566B', via: '#243848', to: '#131F29' },
  'renewable-energy':   { from: '#2B6470', via: '#1A434C', to: '#0D262C' },
  'community':          { from: '#6B5433', via: '#463521', to: '#291F13' }
};

export default function ProjectPlate({ listing, compact = false }: { listing: Listing; compact?: boolean }) {
  const c = PALETTE[listing.category] ?? PALETTE['nature-based'];
  const ukCode = isUkCode(listing);
  // "Issued" is a claim about a registry. A self-verified project has no
  // registry, so its tonnage is the developer's own figure and is labelled as
  // exactly that — on the plate as well as in the detail table.
  const kind = unitKindOf(listing);

  const facts: Array<{ k: string; v: string }> = [];
  if (ukCode) {
    if (listing.areaHectares !== undefined) facts.push({ k: 'Area', v: `${listing.areaHectares.toLocaleString()} ha` });
    if (listing.predictedTonnes !== undefined) facts.push({ k: 'Predicted', v: `${listing.predictedTonnes.toLocaleString()} t` });
    if (listing.plantingYear !== undefined) facts.push({ k: 'Planted', v: String(listing.plantingYear) });
  } else {
    facts.push({ k: 'Vintage', v: String(listing.vintage) });
    if (listing.totalIssued > 0) {
      facts.push({
        k: kind === 'self-reported-unit' ? 'Dev. estimate' : 'Issued',
        v: `${listing.totalIssued.toLocaleString()} t`
      });
    }
    if (listing.bufferPoolPct !== undefined) facts.push({ k: 'Buffer', v: `${listing.bufferPoolPct}%` });
  }

  // On a card the plate is ~240px tall with a chip row across the top, so a
  // three-line place name ("North Yorkshire, England, United Kingdom") ran up
  // underneath the chips. The region already names the country for UK
  // listings, so compact mode shows the narrower of the two and clamps it.
  const place = listing.region ? `${listing.region}, ${listing.country}` : listing.country;
  const compactPlace = listing.region ?? listing.country;

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: `linear-gradient(140deg, ${c.from} 0%, ${c.via} 52%, ${c.to} 100%)` }}
      role="img"
      aria-label={`${listing.projectName} — ${place}`}
    >
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{ background: 'radial-gradient(circle at 20% 16%, rgba(255,255,255,.85), transparent 58%)' }}
        aria-hidden
      />
      {/* Contour lines: suggests a mapped parcel without pretending to be a photograph of one. */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.16]" viewBox="0 0 400 250" preserveAspectRatio="none" aria-hidden>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <path
            key={i}
            d={`M-20 ${200 - i * 25} C 70 ${168 - i * 25}, 130 ${220 - i * 25}, 210 ${186 - i * 25} S 350 ${148 - i * 25}, 420 ${176 - i * 25}`}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.1"
          />
        ))}
      </svg>

      <div className={`relative flex h-full flex-col justify-end ${compact ? 'px-4 pb-4 pt-12' : 'p-6 md:p-7'}`}>
        {/* On a card the registry is already shown as an outline chip lower down,
            and the category/tier chips wrap to two rows on longer labels and
            cover this line. Show it on the detail page only. */}
        {!compact && (
          <p className="text-[10px] uppercase tracking-[0.14em] text-white/60">{listing.registry}</p>
        )}
        <p className={`font-semibold leading-tight text-white ${compact ? 'line-clamp-2 text-base' : 'mt-1 text-2xl md:text-3xl'}`}>
          {compact ? compactPlace : place}
        </p>

        {facts.length > 0 && (
          <dl className={`mt-2 flex flex-wrap ${compact ? 'gap-x-4' : 'mt-3 gap-x-7 gap-y-2'}`}>
            {(compact ? facts.slice(0, 2) : facts).map((f) => (
              <div key={f.k}>
                <dt className={`uppercase tracking-[0.12em] text-white/55 ${compact ? 'text-[9px]' : 'text-[10px]'}`}>{f.k}</dt>
                <dd className={`font-semibold tabular-nums text-white ${compact ? 'text-sm' : 'text-lg'}`}>{f.v}</dd>
              </div>
            ))}
          </dl>
        )}

        {!compact && (
          <p className="mt-4 border-t border-white/15 pt-3 font-mono text-[11px] text-white/55">
            {listing.projectId} &middot; no project photograph held
          </p>
        )}
      </div>
    </div>
  );
}
