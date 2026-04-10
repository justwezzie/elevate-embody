import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Elevate + Embody'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #f8f7f5 0%, #eef4ef 100%)',
          color: '#29473b',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 28,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#BC4E70',
          }}
        >
          Based in Staffordshire
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 82, lineHeight: 1.05, fontWeight: 700 }}>
            Elevate + Embody
          </div>
          <div style={{ fontSize: 38, lineHeight: 1.3, maxWidth: 960 }}>
            Group and 1 to 1 yoga and boxing sessions with direct online booking.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 28,
            color: '#557b69',
          }}
        >
          <div>Affordable classes under £15</div>
          <div>elevate + embody</div>
        </div>
      </div>
    ),
    size
  )
}
