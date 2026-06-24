import { type ReactNode } from 'react'

// The single, app-wide KPI/stat card. Use everywhere so every module looks
// identical. Pass `onClick`+`active` to turn it into a filter card.
export default function StatCard({
  icon, label, value, color = '#2d7dd2', sub, trend, onClick, active = false,
}: {
  icon?: ReactNode
  label: string
  value: string | number
  color?: string
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
  onClick?: () => void
  active?: boolean
}) {
  const trendColor = trend === 'down' ? '#dc2626' : trend === 'up' ? '#16a34a' : '#9ca3af'
  const clickable = !!onClick

  const style: React.CSSProperties = {
    textAlign: 'left', display: 'flex', alignItems: 'center', gap: '13px',
    padding: '15px 17px', borderRadius: '14px', background: '#fff',
    border: `1px solid ${active ? color : 'var(--line-warm)'}`,
    borderLeft: `3px solid ${color}`,
    boxShadow: active ? `0 8px 22px ${color}1f` : '0 2px 10px rgba(40,32,20,0.04)',
    cursor: clickable ? 'pointer' : 'default',
    fontFamily: 'inherit', width: '100%',
    transition: 'all 160ms cubic-bezier(0.4,0,0.2,1)',
  }

  const inner = (
    <>
      {icon != null && (
        <div style={{ width: '40px', height: '40px', borderRadius: '11px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: color + '16', color }}>
          {icon}
        </div>
      )}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px' }}>
          <span style={{ fontFamily: 'var(--display)', fontSize: '24px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
          {sub && <span style={{ fontSize: '11px', fontWeight: 600, color: trendColor }}>{sub}</span>}
        </div>
        <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink-soft)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
      </div>
    </>
  )

  if (clickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={style}
        onMouseEnter={e => { if (active) return; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { if (active) return; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'none' }}
      >
        {inner}
      </button>
    )
  }
  return <div style={style}>{inner}</div>
}

// Standard grid wrapper for a row of StatCards — identical reflow everywhere.
export function StatGrid({ children, min = 170 }: { children: ReactNode; min?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`, gap: '12px', marginBottom: '20px' }}>
      {children}
    </div>
  )
}
