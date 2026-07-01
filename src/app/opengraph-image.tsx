import { ImageResponse } from 'next/og'

export const alt = 'Mozhippattru — Japanese Language School | JLPT N5–N3 Coaching'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1f3c 0%, #252b4a 100%)',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', marginBottom: '48px' }}>
          <div
            style={{
              width: '110px',
              height: '110px',
              borderRadius: '26px',
              background: '#e84040',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px',
              color: '#fff',
              fontWeight: 700,
            }}
          >
            本
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '54px', color: '#fff', fontWeight: 800, letterSpacing: '-1px' }}>
              Mozhippattru
            </div>
            <div style={{ fontSize: '26px', color: '#d8b878', letterSpacing: '4px', marginTop: '6px' }}>
              JAPANESE LANGUAGE SCHOOL
            </div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ fontSize: '68px', color: '#fff', fontWeight: 800, lineHeight: 1.1, maxWidth: '900px' }}>
          Learn Japanese for JLPT N5 · N4 · N3
        </div>

        <div style={{ fontSize: '32px', color: 'rgba(255,255,255,0.72)', marginTop: '28px' }}>
          N1-certified teachers · Online &amp; across India · Free demo class
        </div>

        {/* Bottom accent */}
        <div
          style={{
            display: 'flex',
            marginTop: '52px',
            gap: '16px',
          }}
        >
          {['N5', 'N4', 'N3'].map((l) => (
            <div
              key={l}
              style={{
                fontSize: '28px',
                color: '#1a1f3c',
                background: '#d8b878',
                padding: '10px 28px',
                borderRadius: '999px',
                fontWeight: 700,
              }}
            >
              JLPT {l}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
