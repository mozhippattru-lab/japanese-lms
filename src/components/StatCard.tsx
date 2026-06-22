import { type ReactNode } from 'react'

export default function StatCard({
  icon, label, value, color, sub, trend
}: {
  icon: ReactNode
  label: string
  value: string | number
  color?: string
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
}) {
  const trendColor = trend === 'down' ? '#dc2626' : '#16a34a'

  return (
    <div style={{
      background: '#fff',
      borderRadius: '10px',
      padding: '16px',
      border: '1px solid #ececef',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', color: '#6e6e73', fontWeight: '500' }}>{label}</span>
        <span style={{ color: color || '#86868b', display: 'flex', alignItems: 'center' }}>{icon}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{
          fontSize: '22px', fontWeight: '600',
          color: '#1d1d1f',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {value}
        </span>
        {sub && (
          <span style={{
            fontSize: '11px', fontWeight: '500',
            color: trend === 'up' ? trendColor : trend === 'down' ? trendColor : '#9ca3af',
          }}>
            {sub}
          </span>
        )}
      </div>
    </div>
  )
}
