import { ImageResponse } from 'next/og';
import { getListing, categoryLabels } from '@/lib/listings';
import { statusChip } from '@/lib/status';

export const runtime = 'edge';
export const alt = 'Prime Origins Atlas listing';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Fallback social-share image for a listing.
 *
 * All 30 listings currently have no project photograph (`imageUrl` is empty
 * — see components/ProjectPlate.tsx for why), so `og:image` and
 * `twitter:image` had nothing to point at and were omitted entirely on
 * every listing page. This generates a branded, factual card instead: the
 * project name, its category and country, and its actual instrument type
 * (Registry-issued / Pending Issuance Units / Self-verified) pulled from
 * lib/status.ts, the single source of truth for that label. No project
 * photograph is invented — if a listing ever gets a real `imageUrl`,
 * generateMetadata in app/listings/[slug]/page.tsx uses that instead and
 * this route is not reached for it.
 */
const LOGO_SRC =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMTIwIiBmaWxsPSJub25lIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icG8tYmx1ZSIgeDE9IjAiIHkxPSIyMCIgeDI9IjEwMCIgeTI9IjEwMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMxZDRlZDgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIwLjUiIHN0b3AtY29sb3I9IiMxZTZmYjgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMGU4YThhIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJwby1ncmVlbiIgeDE9IjEwMCIgeTE9IjIwIiB4Mj0iMjAwIiB5Mj0iMTAwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzBlOGE4YSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjAuNSIgc3RvcC1jb2xvcj0iIzE3OGY0ZSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMxZDRkMmMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBvLXNoaW5lLWJsdWUiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxMjAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjN2NiNmZmIiBzdG9wLW9wYWNpdHk9IjAuNTUiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIwLjUiIHN0b3AtY29sb3I9IiNmZmZmZmYiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwYTFhM2EiIHN0b3Atb3BhY2l0eT0iMC41Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJwby1zaGluZS1ncmVlbiIgeDE9IjAiIHkxPSIwIiB4Mj0iMCIgeTI9IjEyMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNhZWYwYmYiIHN0b3Atb3BhY2l0eT0iMC41NSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjAuNSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzBkMmExOCIgc3RvcC1vcGFjaXR5PSIwLjUiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDwhLS0gTGVmdCBsb29wIChQIHNpZGUpIC0tPgogIDxwYXRoIGQ9Ik0gMTAwIDYwIEMgODAgMjAsIDMwIDIwLCAyMiA2MCBDIDE0IDEwMCwgNjQgMTAwLCAxMDAgNjAgWiIKICAgICAgICBmaWxsPSJ1cmwoI3BvLWJsdWUpIi8+CiAgPHBhdGggZD0iTSAxMDAgNjAgQyA4MCAyMCwgMzAgMjAsIDIyIDYwIEMgMTQgMTAwLCA2NCAxMDAsIDEwMCA2MCBaIgogICAgICAgIGZpbGw9InVybCgjcG8tc2hpbmUtYmx1ZSkiLz4KICA8cGF0aCBkPSJNIDEwMCA2MCBDIDgwIDI4LCAzNiAyOCwgMzAgNjAgQyAyNCA5MiwgNjQgOTIsIDEwMCA2MCIKICAgICAgICBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjE4IiBzdHJva2Utd2lkdGg9IjEuNSIvPgogIDwhLS0gUmlnaHQgbG9vcCAoTyBzaWRlKSAtLT4KICA8cGF0aCBkPSJNIDEwMCA2MCBDIDEyMCAyMCwgMTcwIDIwLCAxNzggNjAgQyAxODYgMTAwLCAxMzYgMTAwLCAxMDAgNjAgWiIKICAgICAgICBmaWxsPSJ1cmwoI3BvLWdyZWVuKSIvPgogIDxwYXRoIGQ9Ik0gMTAwIDYwIEMgMTIwIDIwLCAxNzAgMjAsIDE3OCA2MCBDIDE4NiAxMDAsIDEzNiAxMDAsIDEwMCA2MCBaIgogICAgICAgIGZpbGw9InVybCgjcG8tc2hpbmUtZ3JlZW4pIi8+CiAgPHBhdGggZD0iTSAxMDAgNjAgQyAxMjAgMjgsIDE2NCAyOCwgMTcwIDYwIEMgMTc2IDkyLCAxMzYgOTIsIDEwMCA2MCIKICAgICAgICBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjE4IiBzdHJva2Utd2lkdGg9IjEuNSIvPgogIDwhLS0gSW5uZXIgY3V0LW91dHMgdG8gbWFrZSByaWJib24gdHJhbnNwYXJlbnQgaW5zaWRlIC0tPgogIDxlbGxpcHNlIGN4PSI2MCIgY3k9IjYwIiByeD0iMTYiIHJ5PSIxNCIgZmlsbD0iIzAwMCIvPgogIDxlbGxpcHNlIGN4PSIxNDAiIGN5PSI2MCIgcng9IjE2IiByeT0iMTQiIGZpbGw9IiMwMDAiLz4KICA8IS0tIENlbnRlciBoaWdobGlnaHQgLS0+CiAgPHBhdGggZD0iTSA5MiA2MCBDIDk2IDU2LCAxMDQgNTYsIDEwOCA2MCBDIDEwNCA2NCwgOTYgNjQsIDkyIDYwIFoiCiAgICAgICAgZmlsbD0iIzBiMWUxZSIgb3BhY2l0eT0iMC44NSIvPgo8L3N2Zz4K';

const CATEGORY_TINT: Record<string, string> = {
  'nature-based': 'linear-gradient(135deg, #2F6B4F 0%, #1C4634 55%, #0E2A1F 100%)',
  'engineered-removal': 'linear-gradient(135deg, #3A566B 0%, #243848 55%, #131F29 100%)',
  'renewable-energy': 'linear-gradient(135deg, #2B6470 0%, #1A434C 55%, #0D262C 100%)',
  community: 'linear-gradient(135deg, #6B5433 0%, #463521 55%, #291F13 100%)'
};

export default async function Image({ params }: { params: { slug: string } }) {
  const listing = getListing(params.slug);

  const projectName = listing?.projectName ?? 'Prime Origins Atlas';
  const category = listing ? categoryLabels[listing.category] : 'Carbon & environmental markets';
  const country = listing?.country ?? '';
  const registry = listing?.registry ?? 'primeoriginsatlas.org';
  const instrument = listing ? statusChip(listing).label : '';
  const background = (listing && CATEGORY_TINT[listing.category]) || CATEGORY_TINT['nature-based'];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          background,
          color: '#fbf8f3',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders via satori, not next/image */}
          <img src={LOGO_SRC} width={44} height={26} alt="" style={{ display: 'flex' }} />
          <span style={{ fontSize: 16, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#dcefe0' }}>
            Prime Origins Atlas
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 22, color: '#dcefe0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {category}
            {country ? ` · ${country}` : ''}
          </span>
          <h1 style={{ fontSize: 56, fontWeight: 600, lineHeight: 1.08, margin: '16px 0 0', maxWidth: 1020 }}>
            {projectName}
          </h1>
          {instrument && (
            <span
              style={{
                marginTop: 24,
                display: 'flex',
                alignSelf: 'flex-start',
                fontSize: 24,
                fontWeight: 600,
                padding: '10px 22px',
                borderRadius: 999,
                background: 'rgba(0,0,0,0.45)',
                color: '#fbf8f3'
              }}
            >
              {instrument}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 20, color: '#dcefe0' }}>
          <span>primeoriginsatlas.org</span>
          <span>{registry}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
