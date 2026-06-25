'use client';

import { useEffect, useState, useCallback } from 'react';

const KEY = 'po-consent';

declare global {
  interface Window {
    __gaInit?: boolean;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function CookieConsent({ gaId }: { gaId: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let choice: string | null = null;
    try {
      choice = localStorage.getItem(KEY);
    } catch {}

    if (!window.__gaInit) {
      window.__gaInit = true;
      window.dataLayer = window.dataLayer || [];
      const gtag = (...args: unknown[]) => {
        window.dataLayer!.push(args);
      };
      window.gtag = gtag;
      gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: choice === 'granted' ? 'granted' : 'denied',
        wait_for_update: 500,
      });
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(s);
      gtag('js', new Date());
      gtag('config', gaId, { anonymize_ip: true });
    }

    if (choice !== 'granted' && choice !== 'denied') setShow(true);

    const onSettings = (e: Event) => {
      const el = (e.target as HTMLElement | null)?.closest?.('[data-cookie-settings]');
      if (el) {
        e.preventDefault();
        setShow(true);
      }
    };
    document.addEventListener('click', onSettings);
    return () => document.removeEventListener('click', onSettings);
  }, [gaId]);

  const choose = useCallback((v: 'granted' | 'denied') => {
    try {
      localStorage.setItem(KEY, v);
    } catch {}
    setShow(false);
    window.gtag?.('consent', 'update', {
      analytics_storage: v === 'granted' ? 'granted' : 'denied',
    });
  }, []);

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
