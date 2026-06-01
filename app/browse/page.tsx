'use client';

import { useMemo, useState } from 'react';
import ListingCard from '@/components/ListingCard';
import { listings, categoryLabels, tierLabels } from '@/lib/listings';
import type { ProjectCategory, Registry, VerificationTier } from '@/lib/types';

const allRegistries: Registry[] = ['Verra', 'Gold Standard', 'ACR', 'Puro.earth', 'Climate Action Reserve', 'Self-Verified'];
const allCategories: ProjectCategory[] = ['nature-based', 'engineered-removal', 'renewable-energy', 'community'];
const allTiers: VerificationTier[] = ['prime-origins-verified', 'self-verified'];

export default function BrowsePage() {
  const [query, setQuery] = useState('');
  const [cats, setCats] = useState<ProjectCategory[]>([]);
  const [regs, setRegs] = useState<Registry[]>([]);
  const [tiers, setTiers] = useState<VerificationTier[]>([]);
  const [minVintage, setMinVintage] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'vintage-desc' | 'tonnes-desc'>('price-asc');

  const filtered = useMemo(() => {
    let r = listings.filter((l) => {
      if (query && !`${l.projectName} ${l.country} ${l.developer} ${l.summary}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (cats.length && !cats.includes(l.category)) return false;
      if (regs.length && !regs.includes(l.registry)) return false;
      if (tiers.length && !tiers.includes(l.tier)) return false;
      if (minVintage !== '' && l.vintage < Number(minVintage)) return false;
      if (maxPrice !== '' && l.pricePerTonne > Number(maxPrice)) return false;
      return true;
    });
    r = r.sort((a, b) => {
      if (sort === 'price-asc') return a.pricePerTonne - b.pricePerTonne;
      if (sort === 'price-desc') return b.pricePerTonne - a.pricePerTonne;
      if (sort === 'vintage-desc') return b.vintage - a.vintage;
      return b.tonnesAvailable - a.tonnesAvailable;
    });
    return r;
  }, [query, cats, regs, tiers, minVintage, maxPrice, sort]);

  return (
    <div className="container-narrow py-10 md:py-14">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-forest-900">Browse carbon credits</h1>
        <p className="mt-2 text-forest-700/80">Filter by project type, registry, vintage, and price.</p>
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

          <FilterBox label="Verification tier">
            <div className="space-y-1.5">
              {allTiers.map((t) => (
                <Checkbox
                  key={t}
                  label={tierLabels[t]}
                  checked={tiers.includes(t)}
                  onChange={(v) => setTiers(v ? [...tiers, t] : tiers.filter((x) => x !== t))}
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

          <FilterBox label="Vintage (min year)">
            <input
              type="number"
              value={minVintage}
              onChange={(e) => setMinVintage(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 2023"
              className="w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </FilterBox>

          <FilterBox label="Max price per tonne (USD)">
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
              placeholder="No limit"
              className="w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </FilterBox>

          <button
            onClick={() => { setQuery(''); setCats([]); setRegs([]); setTiers([]); setMinVintage(''); setMaxPrice(''); }}
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
              <option value="vintage-desc">Newest vintage</option>
              <option value="tonnes-desc">Most tonnes available</option>
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

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-forest-800 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-forest-300 text-forest-700 focus:ring-forest-500"
      />
      {label}
    </label>
  );
}
