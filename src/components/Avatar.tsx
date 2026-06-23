// Renders a profile photo when `url` is set, otherwise a colored initial circle.
export default function Avatar({
  url, name, size = 36, bg = '#2d7dd2', fontSize,
}: { url?: string | null; name?: string | null; size?: number; bg?: string; fontSize?: number }) {
  const fs = fontSize ?? Math.round(size * 0.4)
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name || ''}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, background: '#f0f0f2', display: 'block' }}
      />
    )
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: fs }}>
      {(name || '?').charAt(0).toUpperCase()}
    </div>
  )
}
