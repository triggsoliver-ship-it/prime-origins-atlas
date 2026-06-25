'use client';

import { useEffect, useState } from 'react';

const KEY = 'po-consent';

declare global {
  interface Window {
    __gaLoaded?: boolean;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function loadGA(id: string) {
  if (window.__gaLoaded) return;
  window.__gaLoaded = true;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id, { anonymize_ip: true });
}

export default function CookieConsent({ gaId }: { gaId: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let choice: string | null = null;
    try {
      choice = localStorage.getItem(KEY);
    } catch {}
    if (choice === 'granted') loadGA(gaId);
    else if (choice !== 'denied') setShow(true);
  }, [gaId]);

  function choose(v: 'granted' | 'denied') {
    try {
      localStorage.setItem(KEY, v);
    } catch {}
    setShow(false);
    if (v === 'granted') loadGA(gaId);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-[1200] mx-auto flex max-w-2xl flex-col gap-3 rounded-xl border border-forest-200 bg-white/95 p-4 shadow-lift backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-5"
    >
      <p className="text-sm leading-relaxed text-forest-800">
        We use cookies to measure traffic and improve the site. Analytics only runs if you accept.
      </p>
      <div className="flex shrink-0 gap-2">
        <button type="button" onClick={() => choose('denied')} className="btn-secondary">
          Decline
        </button>
        <button type="button" onClick={() => choose('granted')} className="btn-primary">
          Accept
        </button>
      </div>
    </div>
  );
}
