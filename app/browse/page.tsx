'use client';

import { useMemo, useState } from 'react';
import ListingCard from '@/components/ListingCard';
import { listings, categoryLabels } from '@/lib/listings';
import { unitKindOf, type UnitKind } from '@/lib/status';
import type { ProjectCategory, Registry } from '@/lib/types';

/**
 * Every registry in the catalogue. The Woodland Carbon Code and Peatland Code
 * were missing from this list, so 12 of the 30 projects on the site could not
 * be filtered by registry at all.
 */
const allRegistries: Registry[] = [
  'Woodland Carbon Code',
  'Peatland Code',
  'Verra',
  'Gold Standard',
  'ACR',
  'Puro.earth',
  'Climate Action Reserve',
  'Self-Verified'
];
const allCategories: ProjectCategory[] = ['nature-based', 'engineered-removal', 'renewable-energy', 'community'];

/**
 * This filter used to offer "Prime Origins Verified" vs "Self-Verified", which
 * told a buyer nothing about what they were actually buying and implied Atlas
 * had verified something. What a buyer needs to filter on is the instrument.
 */
const unitKindFilters: { kind: UnitKind; label: string; hint: string }[] = [
  { kind: 'issued-credit', label: 'Issued credits', hint: 'Verified and issued on a public registry' },
  { kind: 'pending-unit', label: 'Pending Issuance Units', hint: 'A promise of future verified UK removal' },
  { kind: 'self-reported-unit', label: 'Developer self-verified', hint: 'Developer documentation only, no registry' }
];

export default function BrowsePage() {
  const [query, setQuery] = useState('');
  const [cats, setCats] = useState<ProjectCategory[]>([]);
  const [regs, setRegs] = useState<Registry[]>([]);
  const [kinds, setKinds] = useState<UnitKind[]>([]);
  const [minVintage, setMinVintage] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'year-desc' | 'name-asc'>('price-asc');

  const filtered = useMemo(() => {
    let r = listings.filter((l) => {
      if (query && !`${l.projectName} ${l.country} ${l.developer} ${l.summary}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (cats.length && !cats.includes(l.category)) return false;
      if (regs.length && !regs.includes(l.registry)) return false;
      if (kinds.length && !kinds.includes(unitKindOf(l))) return false;
      if (minVintage !== '' && (l.plantingYear ?? l.vintage) < Number(minVintage)) return false;
      if (maxPrice !== '' && l.pricePerTonne > Number(maxPrice)) return false;
      return true;
    });
    // "Most tonnes available" used to sort on listing.tonnesAvailable, which is
    // zero for every UK project and is not Atlas inventory for any of the rest.
    // Sorting a catalogue by a number that means nothing is worse than not
    // offering the sort, so it is gone.
    r = [...r].sort((a, b) => {
      if (sort === 'price-asc') return a.pricePerTonne - b.pricePerTonne;
      if (sort === 'price-desc') return b.pricePerTonne - a.pricePerTonne;
      if (sort === 'year-desc') return (b.plantingYear ?? b.vintage) - (a.plantingYear ?? a.vintage);
      return a.projectName.localeCompare(b.projectName);
    });
    return r;
  }, [query, cats, regs, kinds, minVintage, maxPrice, sort]);

  return (
    <div className="container-narrow py-10 md:py-14">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-forest-900">Browse projects</h1>
        <p className="mt-2 text-forest-700/80">
          Filter by unit type, project category, registry, year and price.
        </p>
        <p className="mt-3 max-w-2xl rounded-xl border border-forest-100 bg-forest-50/60 px-4 py-3 text-sm leading-relaxed text-forest-800">
          Atlas holds no stock. Every price shown is indicative and every volume is confirmed with the developer when
          we quote. Not everything here is an issued carbon credit &mdash; the UK woodland projects offer{' '}
          <strong>Pending Issuance Units</strong>, which are a promise of future verified removal and cannot be used
          to report against emissions yet. Each card says which it is.
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Filters */}
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start lg:max-h-[80vh] lg:overflow-y-auto">
          <FilterBox label="Search">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Project, country, developer…"
              className="w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </FilterBox>

          <FilterBox label="Unit type">
            <div className="space-y-2">
              {unitKindFilters.map((f) => (
                <Checkbox
                  key={f.kind}
                  label={f.label}
                  hint={f.hint}
                  checked={kinds.includes(f.kind)}
                  onChange={(v) => setKinds(v ? [...kinds, f.kind] : kinds.filter((x) => x !== f.kind))}
                />
              ))}
            </div>
          </FilterBox>

          <FilterBox label="Project category">
            <div className="space-y-1.5">
              {allCategories.map((c) => (
                <Checkbox
                  key={c}
                  label={categoryLabels[c]}
                  checked={cats.includes(c)}
                  onChange={(v) => setCats(v ? [...cats, c] : cats.filter((x) => x !== c))}
                />
              ))}
            </div>
          </FilterBox>

          <FilterBox label="Registry">
            <div className="space-y-1.5">
              {allRegistries.map((r) => (
                <Checkbox
                  key={r}
                  label={r}
                  checked={regs.includes(r)}
                  onChange={(v) => setRegs(v ? [...regs, r] : regs.filter((x) => x !== r))}
                />
              ))}
            </div>
          </FilterBox>

          <FilterBox label="Vintage or planting year (from)">
            <input
              type="number"
              value={minVintage}
              onChange={(e) => setMinVintage(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 2023"
              className="w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </FilterBox>

          <FilterBox label="Max indicative price per tonne (GBP)">
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
              placeholder="No limit"
              className="w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </FilterBox>

          <button
            onClick={() => { setQuery(''); setCats([]); setRegs([]); setKinds([]); setMinVintage(''); setMaxPrice(''); }}
            className="text-xs font-medium text-forest-700 underline underline-offset-2"
          >
            Reset filters
          </button>
        </aside>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-forest-700/80">{filtered.length} {filtered.length === 1 ? 'project' : 'projects'}</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-lg border border-forest-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="year-desc">Most recent vintage or planting</option>
              <option value="name-asc">Project name (A–Z)</option>
            </select>
          </div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-forest-200 p-10 text-center">
              <p className="text-forest-700">No projects match those filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.18em] text-forest-600 font-semibold mb-2">{label}</h3>
      {children}
    </div>
  );
}

function Checkbox({
  label,
  hint,
  checked,
  onChange
}: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-2 text-sm text-forest-800 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-forest-300 text-forest-700 focus:ring-forest-500"
      />
      <span>
        {label}
        {hint && <span className="block text-[11px] leading-snug text-forest-700/70">{hint}</span>}
      </span>
    </label>
  );
}
