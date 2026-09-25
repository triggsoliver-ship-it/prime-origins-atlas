'use client';

import { useEffect, useRef } from 'react';
import { ECOSYSTEM } from '@/lib/ecosystem';

/**
 * The compact ecosystem switcher in the header.
 *
 * Built on <details>/<summary> so it opens, closes and takes keyboard focus
 * with no JavaScript at all; the script below only adds the two conveniences
 * a native disclosure lacks — Escape to close, and closing when you click
 * elsewhere. If the bundle fails to load, the menu still works.
 */
export default function EcosystemMenu() {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onDocClick(e: MouseEvent) {
      if (el && el.open && !el.contains(e.target as Node)) el.open = false;
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && el?.open) {
        el.open = false;
        el.querySelector('summary')?.focus();
      }
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <details ref={ref} className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-forest-800 transition-colors hover:text-forest-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500">
        Ecosystem
        <span aria-hidden className="text-[10px] leading-none text-forest-600">▾</span>
      </summary>
      <div className="absolute right-0 z-50 mt-2 w-[19rem] overflow-hidden rounded-2xl border border-forest-100 bg-white p-2 shadow-lift">
        <p className="px-3 pb-1.5 pt-2 text-[10px] uppercase tracking-[0.18em] text-forest-600">
          Prime Origins ecosystem
        </p>
        <ul>
          {ECOSYSTEM.map((s) => (
            <li key={s.url}>
              {s.current ? (
                <span
                  aria-current="page"
                  className="flex items-baseline justify-between gap-3 rounded-xl bg-forest-50 px-3 py-2"
                >
                  <span>
                    <span className="block text-sm font-semibold text-forest-900">{s.name}</span>
                    <span className="block text-[11px] leading-snug text-forest-700/75">{s.role}</span>
                  </span>
                  <span className="shrink-0 text-[10px] uppercase tracking-wider text-forest-600">You are here</span>
                </span>
              ) : (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-baseline justify-between gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-forest-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500"
                >
                  <span>
                    <span className="block text-sm font-medium text-forest-900">{s.name}</span>
                    <span className="block text-[11px] leading-snug text-forest-700/75">{s.role}</span>
                  </span>
                  <span aria-hidden className="shrink-0 text-forest-600">↗</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
