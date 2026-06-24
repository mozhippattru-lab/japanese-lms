// Shared premium dashboard design system (washi + gold + Shippori serif over
// navy/red), used by the student / teacher / admin dashboards. Server-safe
// (no hooks). Class prefix: dash-.

import { ArrowRight } from 'lucide-react'

export function CardHead({ jp, title, href }: { jp: string; title: string; href?: string }) {
  return (
    <div className="dash-cardhead">
      <div>
        <span className="dash-cardhead-jp">{jp}</span>
        <h2 className="dash-cardhead-title">{title}</h2>
      </div>
      {href && (
        <a href={href} className="dash-cardhead-link" aria-label={`View all ${title}`}>
          <ArrowRight size={16} />
        </a>
      )}
    </div>
  )
}

export function Kpi({ label, value, sub, icon, color }: {
  label: string; value: string; sub?: string; icon: React.ReactNode; color: string
}) {
  return (
    <div className="dash-kpi" style={{ ['--c' as string]: color }}>
      <div className="dash-kpi-icon">{icon}</div>
      <div>
        <div className="dash-kpi-label">{label}</div>
        <div className="dash-kpi-value">{value}</div>
        {sub && <div className="dash-kpi-sub">{sub}</div>}
      </div>
    </div>
  )
}

export function DashStyles() {
  return (
    <style>{`
      .dash-shell { display: flex; min-height: 100vh; background: var(--paper); }
      .dash-main { margin-left: 260px; flex: 1; padding: 30px 36px 48px;
        background: radial-gradient(60% 40% at 100% 0%, rgba(194,151,75,0.06), transparent 60%), var(--paper);
        font-family: Inter, sans-serif; }

      /* Header */
      .dash-header { display: flex; justify-content: space-between; align-items: flex-start;
        gap: 20px; flex-wrap: wrap; margin-bottom: 28px; }
      .dash-eyebrow { font-family: var(--display); font-size: 12px; color: var(--gold); letter-spacing: .04em; margin: 0 0 8px; }
      .dash-title { font-family: var(--display); font-weight: 700; font-size: clamp(26px, 3.4vw, 36px);
        color: var(--ink); margin: 0; letter-spacing: -0.01em; line-height: 1.15; }
      .dash-title span { color: var(--red); }
      .dash-subtitle { color: var(--ink-soft); font-size: 14px; margin: 8px 0 0; }
      .dash-datechip { display: flex; align-items: center; gap: 14px; background: #fff;
        border: 1px solid var(--line-warm); border-radius: 12px; padding: 10px 16px; box-shadow: 0 2px 10px rgba(40,32,20,0.04); }
      .dash-datechip-jp { font-family: var(--display); font-weight: 700; font-size: 22px; color: var(--red); line-height: 1; }
      .dash-datechip-sub { font-size: 12.5px; color: var(--ink-soft); font-weight: 500; border-left: 1px solid var(--line-warm); padding-left: 14px; }

      /* KPIs */
      .dash-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(185px, 1fr)); gap: 14px; margin-bottom: 22px; }
      .dash-kpi { display: flex; align-items: center; gap: 14px; background: #fff; border: 1px solid var(--line-warm);
        border-radius: 14px; padding: 17px 18px; position: relative; overflow: hidden;
        box-shadow: 0 2px 10px rgba(40,32,20,0.04); transition: transform 160ms, box-shadow 160ms; }
      .dash-kpi:hover { transform: translateY(-3px); box-shadow: 0 14px 30px -14px rgba(40,32,20,0.3); }
      .dash-kpi::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--c); }
      .dash-kpi-icon { width: 44px; height: 44px; border-radius: 11px; flex-shrink: 0; display: flex;
        align-items: center; justify-content: center; color: var(--c); background: color-mix(in srgb, var(--c) 12%, transparent); }
      .dash-kpi-label { font-size: 12px; color: var(--ink-soft); font-weight: 500; }
      .dash-kpi-value { font-family: var(--display); font-weight: 700; font-size: 25px; color: var(--ink); line-height: 1.15; margin: 1px 0; }
      .dash-kpi-sub { font-size: 11px; color: #a39e93; }

      /* Grids */
      .dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
      .dash-grid-32 { display: grid; grid-template-columns: 3fr 2fr; gap: 18px; margin-bottom: 18px; }
      .dash-span2 { grid-column: span 2; }

      /* Cards */
      .dash-card { background: #fff; border: 1px solid var(--line-warm); border-radius: 16px; padding: 22px 24px;
        box-shadow: 0 2px 12px rgba(40,32,20,0.04); }
      .dash-cardhead { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px;
        padding-bottom: 14px; border-bottom: 1px solid var(--line-warm); }
      .dash-cardhead-jp { font-family: var(--display); font-size: 13px; color: var(--gold); letter-spacing: .04em; }
      .dash-cardhead-title { font-family: var(--display); font-weight: 700; font-size: 18px; color: var(--ink); margin: 2px 0 0; }
      .dash-cardhead-link { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center;
        justify-content: center; color: var(--ink-soft); border: 1px solid var(--line-warm); transition: all 150ms; }
      .dash-cardhead-link:hover { color: var(--red); border-color: var(--red); }

      /* Generic rows */
      .dash-list { display: flex; flex-direction: column; gap: 10px; }
      .dash-row { display: flex; justify-content: space-between; align-items: center; gap: 12px;
        padding: 13px 15px; background: var(--paper); border-radius: 11px; }
      .dash-row.accent { border-left: 3px solid var(--c, var(--red)); }
      .dash-row-title { font-size: 14px; font-weight: 600; color: var(--ink); }
      .dash-row-sub { font-size: 12px; color: var(--ink-soft); margin-top: 3px; }
      .dash-row-meta { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--gold); font-weight: 600; margin-bottom: 4px; }
      .dash-chip { font-size: 10.5px; font-weight: 700; padding: 3px 10px; border-radius: 99px; white-space: nowrap; }

      /* Buttons */
      .dash-btn { padding: 8px 16px; border: none; border-radius: 8px; font-size: 12.5px; font-weight: 600;
        cursor: pointer; font-family: inherit; flex-shrink: 0; color: #fff; transition: filter 150ms; }
      .dash-btn:hover { filter: brightness(0.93); }
      .dash-btn-red { background: var(--red); }
      .dash-btn-navy { background: var(--navy); }

      /* Bars */
      .dash-barrow { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 7px; }
      .dash-bar { height: 6px; background: var(--paper-2); border-radius: 99px; overflow: hidden; }
      .dash-bar-fill { height: 100%; border-radius: 99px; }
      .dash-pct { font-family: var(--display); font-size: 14px; font-weight: 700; }

      /* Divided list (scores / activity) */
      .dash-divrow { display: flex; justify-content: space-between; align-items: center; padding: 13px 0; border-bottom: 1px solid var(--line-warm); }
      .dash-divrow:last-child { border-bottom: none; }
      .dash-num { font-family: var(--display); display: flex; align-items: baseline; gap: 2px; }
      .dash-num span { font-size: 24px; font-weight: 700; }
      .dash-num small { font-size: 12px; color: #a39e93; }
      .dash-avatar { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center;
        justify-content: center; color: #fff; font-size: 13px; font-weight: 700; flex-shrink: 0; }

      /* Table */
      .dash-tablewrap { overflow-x: auto; }
      .dash-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 480px; }
      .dash-table th { padding: 9px 12px; text-align: left; color: var(--gold); font-family: var(--display);
        font-weight: 600; border-bottom: 1px solid var(--line-warm); font-size: 11px; letter-spacing: .04em; }
      .dash-table td { padding: 11px 12px; color: var(--ink); font-size: 12.5px; border-bottom: 1px solid var(--line-warm); }
      .dash-table tr:last-child td { border-bottom: none; }

      /* Mini bar chart */
      .dash-chart { position: relative; height: 120px; display: flex; align-items: flex-end; gap: 9px; }
      .dash-chart-col { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; }
      .dash-chart-val { font-size: 11px; color: var(--ink-soft); margin-bottom: 5px; }
      .dash-chart-val.on { color: var(--ink); font-weight: 700; font-family: var(--display); }
      .dash-chart-bar { width: 100%; border-radius: 5px 5px 0 0; background: var(--paper-2); }
      .dash-chart-bar.on { background: var(--navy); }
      .dash-chart-x { display: flex; gap: 9px; margin-top: 8px; }
      .dash-chart-x span { flex: 1; text-align: center; font-size: 10.5px; color: var(--ink-soft); }

      .dash-foot { margin-top: 16px; padding-top: 13px; border-top: 1px solid var(--line-warm); font-size: 12px; color: var(--ink-soft); }
      .dash-total { padding: 12px 15px; background: var(--paper); border-radius: 10px; display: flex; justify-content: space-between; align-items: center; }
      .dash-total span:first-child { font-size: 12.5px; font-weight: 500; color: var(--ink-soft); }
      .dash-total span:last-child { font-family: var(--display); font-size: 17px; font-weight: 700; color: var(--ink); }

      /* Responsive */
      @media (max-width: 900px) {
        .dash-main { margin-left: 0; padding: 70px 18px 36px; }
        .dash-grid, .dash-grid-32 { grid-template-columns: 1fr; }
        .dash-span2 { grid-column: auto; }
      }
      @media (max-width: 480px) {
        .dash-datechip { display: none; }
        .dash-kpis { grid-template-columns: 1fr 1fr; gap: 10px; }
        .dash-kpi { padding: 14px; }
        .dash-card { padding: 18px; }
      }
    `}</style>
  )
}
