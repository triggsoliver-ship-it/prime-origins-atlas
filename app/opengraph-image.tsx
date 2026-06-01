import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Prime Origins Atlas — Verified Carbon Credit Marketplace';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
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
          background: 'linear-gradient(135deg, #235838 0%, #173a27 60%, #0b1e1e 100%)',
          color: '#fbf8f3',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              background: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 700,
              color: '#3a8b58'
            }}
          >
            ∞
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 22, fontWeight: 600 }}>Prime Origins</span>
            <span style={{ fontSize: 14, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#bbdec5' }}>ATLAS</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: 76, fontWeight: 600, lineHeight: 1.05, margin: 0, maxWidth: 1000 }}>
            Carbon credits, traced to the source.
          </h1>
          <p style={{ fontSize: 28, color: '#dcefe0', marginTop: 24, maxWidth: 900, lineHeight: 1.3 }}>
            High-integrity carbon credits from Verra, Gold Standard, ACR, Puro.earth and self-verified developers.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 20, color: '#bbdec5' }}>
          <span>primeoriginsatlas.org</span>
          <span>Verified · Traceable · Retirable</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
