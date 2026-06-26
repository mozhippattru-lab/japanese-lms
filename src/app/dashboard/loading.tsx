// Instant skeleton shown on every dashboard navigation while the server
// component fetches its data. Mirrors the real shell (navy 260px rail +
// paper main) so the transition feels seamless rather than frozen.
export default function DashboardLoading() {
  const bar = (w: string, h = 14) => (
    <span className="sk" style={{ width: w, height: h, display: 'block', borderRadius: 6 }} />
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--paper)' }}>
      <style>{`
        @keyframes skShimmer { 0% { background-position: -400px 0 } 100% { background-position: 400px 0 } }
        .sk { background: linear-gradient(90deg, rgba(40,32,20,0.06) 25%, rgba(40,32,20,0.12) 37%, rgba(40,32,20,0.06) 63%);
          background-size: 800px 100%; animation: skShimmer 1.3s ease-in-out infinite; }
        .sk-dark { background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 37%, rgba(255,255,255,0.05) 63%);
          background-size: 800px 100%; animation: skShimmer 1.3s ease-in-out infinite; border-radius: 6px; }
      `}</style>

      {/* Sidebar placeholder */}
      <aside style={{ width: 260, background: 'var(--navy)', position: 'fixed', top: 0, bottom: 0, left: 0,
        padding: '26px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span className="sk-dark" style={{ width: '70%', height: 22, marginBottom: 22 }} />
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="sk-dark" style={{ width: i % 3 === 0 ? '85%' : '70%', height: 30 }} />
        ))}
      </aside>

      {/* Main content placeholder */}
      <main style={{ marginLeft: 260, flex: 1, padding: '30px 36px 48px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {bar('160px', 12)}
            {bar('280px', 26)}
            {bar('220px', 13)}
          </div>
          {bar('120px', 44)}
        </div>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 28 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid var(--line-warm)', borderRadius: 16,
              padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span className="sk" style={{ width: 40, height: 40, borderRadius: 10, display: 'block' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                {bar('60%', 18)}
                {bar('40%', 11)}
              </div>
            </div>
          ))}
        </div>

        {/* Two content cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
          {[0, 1].map(c => (
            <div key={c} style={{ background: '#fff', border: '1px solid var(--line-warm)', borderRadius: 16, padding: '22px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 14,
                borderBottom: '1px solid var(--line-warm)', marginBottom: 18 }}>
                {bar('90px', 12)}
                {bar('160px', 18)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="sk" style={{ width: 38, height: 38, borderRadius: 999, display: 'block' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
                      {bar('45%', 13)}
                      {bar('30%', 11)}
                    </div>
                    {bar('48px', 12)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
