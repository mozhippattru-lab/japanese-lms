'use client'

import { useState } from 'react'
import Link from 'next/link'

const DONATION_STATS = { raised: 0, wheelchairs: 0, target: 300000 }
const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

export default function DonateClient() {
  const [donateOpen, setDonateOpen] = useState(false)

  return (
    <div className="lp">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;600;700;800&family=Noto+Serif+Tamil:wght@500;600;700&display=swap"
        rel="stylesheet"
      />
      <DonateStyles />

      {/* ─── Top bar ─────────────────────────── */}
      <header className="lp-nav">
        <div className="lp-container lp-nav-inner">
          <Link href="/" className="lp-brand">
            <span className="lp-logo">本</span>
            <span className="lp-brand-text">
              <span className="lp-brand-ta">மொழிப்பற்று</span>
              <span className="lp-brand-en">Mozhippattru · Japanese Language School</span>
            </span>
          </Link>
          <Link href="/" className="lp-btn lp-btn-ghost">← Back to home</Link>
        </div>
      </header>

      <main>
        {/* ─── Learn & Donate mission card ─────── */}
        <section className="lp-section lp-section-paper">
          <div className="lp-container">
            <div className="lp-section-head">
              <div className="lp-tag">
                <span className="lp-tag-ta">கொடை</span>
                <span className="lp-tag-main">Wheelchair Donation</span>
                <span className="lp-tag-jp">寄付・車椅子</span>
              </div>
            </div>

            <div className="lp-why-specials">
              <div className="lp-mission-card lp-mission-blue">
                <div className="lp-mission-icon">♿</div>
                <div className="lp-mission-body">
                  <div className="lp-mission-badge">Learn &amp; Donate</div>
                  <h3 className="lp-mission-title">25% of Every Fee Goes to Our Wheelchair Donation Fund</h3>
                  <p className="lp-mission-desc">
                    Education with a purpose. Whenever a student pays a course fee, <strong>25% of the tuition fee</strong> is
                    automatically allocated to our Electric Wheelchair Donation Fund — helping people with
                    physical disabilities regain independence and mobility.
                  </p>
                  <div className="lp-mission-tree">
                    <span className="lp-mission-tree-icon">💡</span>
                    <div>
                      <strong>Did you know?</strong>
                      <p>An electric wheelchair (≈ ₹90,000) can restore independent movement for years —
                        turning everyday things like getting to class or work from impossible into ordinary.</p>
                    </div>
                  </div>
                  <div className="lp-mission-tagline">
                    {`“So far, students’ learning has gifted ${DONATION_STATS.wheelchairs} electric ${DONATION_STATS.wheelchairs === 1 ? 'wheelchair' : 'wheelchairs'} — that’s ${DONATION_STATS.wheelchairs} ${DONATION_STATS.wheelchairs === 1 ? 'person' : 'people'} back on the move.”`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Support / donate section ─────────── */}
        <section id="donate" className="lp-section lp-donate-section">
          <div className="lp-container">
            <div className="lp-donate-inner">

              {/* Left — copy + stats */}
              <div className="lp-donate-copy">
                <div className="lp-tag lp-tag-light">
                  <span className="lp-tag-ta">கொடை</span>
                  <span className="lp-tag-main">Support</span>
                  <span className="lp-tag-jp">寄付・車椅子</span>
                </div>
                <h2 className="lp-h2 lp-on-dark">Support Our Electric Wheelchair Mission</h2>
                <p className="lp-p lp-p-light">
                  Students, parents, alumni, and supporters can voluntarily contribute to our Electric
                  Wheelchair Donation Fund. Every contribution helps someone with a disability regain
                  independence. <em style={{ color: 'rgba(255,255,255,0.55)', fontStyle: 'normal' }}>Donations are completely optional.</em>
                </p>

                <div className="lp-donate-stats-row">
                  <div className="lp-dstat">
                    <div className="lp-dstat-val">{inr(DONATION_STATS.raised)}</div>
                    <div className="lp-dstat-label">Total Raised</div>
                  </div>
                  <div className="lp-dstat-div" />
                  <div className="lp-dstat">
                    <div className="lp-dstat-val">{DONATION_STATS.wheelchairs}</div>
                    <div className="lp-dstat-label">Wheelchairs Gifted</div>
                  </div>
                  <div className="lp-dstat-div" />
                  <div className="lp-dstat">
                    <div className="lp-dstat-val">{Math.round(DONATION_STATS.raised / DONATION_STATS.target * 100)}%</div>
                    <div className="lp-dstat-label">To Next Batch</div>
                  </div>
                </div>

                <div className="lp-donate-bar-wrap">
                  <div className="lp-donate-bar-track">
                    <div className="lp-donate-bar-fill" style={{ width: `${Math.min(100, Math.round(DONATION_STATS.raised / DONATION_STATS.target * 100))}%` }} />
                  </div>
                  <div className="lp-donate-bar-labels">
                    <span>{inr(DONATION_STATS.raised)} raised</span>
                    <span>Goal: {inr(DONATION_STATS.target)}</span>
                  </div>
                </div>

                <div className="lp-donate-actions">
                  <button onClick={() => setDonateOpen(true)} className="lp-btn lp-btn-donate">🤍 Donate Now</button>
                  <span className="lp-donate-note">Voluntary · No minimum amount</span>
                </div>
              </div>

              {/* Right — impact card */}
              <div className="lp-donate-impact-card">
                <div className="lp-dic-header">
                  <div className="lp-dic-icon">♿</div>
                  <div>
                    <div className="lp-dic-title">Impact So Far</div>
                    <div className="lp-dic-sub">Every student who learns, gives back</div>
                  </div>
                </div>

                <div className="lp-dic-milestones">
                  {[
                    { label: 'Electric wheelchairs gifted', val: `${DONATION_STATS.wheelchairs} ${DONATION_STATS.wheelchairs === 1 ? 'person' : 'people'}`, done: true },
                    { label: 'Families regained mobility', val: `${DONATION_STATS.wheelchairs} ${DONATION_STATS.wheelchairs === 1 ? 'family' : 'families'}`, done: true },
                    { label: 'Current batch fundraising', val: `${Math.round(DONATION_STATS.raised / DONATION_STATS.target * 100)}% funded`, done: false },
                  ].map((m, i) => (
                    <div key={i} className={`lp-dic-row ${m.done ? 'lp-dic-done' : 'lp-dic-pending'}`}>
                      <span className="lp-dic-dot">{m.done ? '✓' : '○'}</span>
                      <span className="lp-dic-item-label">{m.label}</span>
                      <span className="lp-dic-item-val">{m.val}</span>
                    </div>
                  ))}
                </div>

                <div className="lp-dic-cost">
                  <div className="lp-dic-cost-label">Cost of one electric wheelchair</div>
                  <div className="lp-dic-cost-val">≈ ₹90,000</div>
                </div>

                <div className="lp-dic-quote">
                  &ldquo;When you learn Japanese here, someone somewhere gains the freedom to move.&rdquo;
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {donateOpen && <DonateModal onClose={() => setDonateOpen(false)} />}
    </div>
  )
}

// ─── Donate modal ─────────────────────────────────────────────────────────────
function DonateModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', place: '', amount: '' })
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/donate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        alert(d.error || 'Could not submit. Please try again.')
        setLoading(false); return
      }
      setDone(true)
    } catch {
      alert('Network error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '480px', boxShadow: '0 32px 80px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'var(--navy)', padding: '20px 24px', position: 'relative', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', background: 'var(--red)', borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '22px', color: '#fff', boxShadow: '0 4px 14px rgba(232,64,64,0.4)' }}>本</div>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '17px', color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.2 }}>மொழிப்பற்று</div>
            <div style={{ fontSize: '9.5px', color: 'var(--gold-soft)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '3px' }}>Mozhippattru · Japanese Language School</div>
          </div>
          <button onClick={onClose} style={{ position: 'absolute', top: '14px', right: '16px', background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ background: 'var(--navy)', padding: '0 24px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ color: 'var(--gold-soft)', fontSize: '12.5px', margin: 0 }}>🤍 Your gift funds an electric wheelchair for someone in need</p>
        </div>

        <div style={{ padding: '28px' }}>
          {!done ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your full name' },
                { label: 'Mobile Number', key: 'mobile', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com' },
                { label: 'City / Place', key: 'place', type: 'text', placeholder: 'Chennai, Tamil Nadu' },
                { label: 'Amount You Wish to Donate (₹)', key: 'amount', type: 'number', placeholder: 'e.g. 500' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{f.label}</label>
                  <input required type={f.type} placeholder={f.placeholder} value={(form as Record<string,string>)[f.key]}
                    onChange={e => set(f.key, e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <button type="submit" disabled={loading}
                style={{ marginTop: '6px', width: '100%', padding: '13px', background: loading ? '#9ca3af' : 'var(--red)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                {loading ? 'Submitting…' : 'Submit'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🙏</div>
              <h4 style={{ fontFamily: 'var(--serif)', fontSize: '20px', color: 'var(--navy)', margin: '0 0 6px' }}>Thank you, {form.name.split(' ')[0]}!</h4>
              <p style={{ fontSize: '13.5px', color: '#6b7280', margin: '0 0 20px' }}>
                We have received your interest to donate <strong>₹{form.amount}</strong>. Our team will contact you shortly with the payment details.
              </p>
              <p style={{ fontSize: '12.5px', color: '#2f9e63', fontWeight: 600, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px 14px' }}>
                ✅ We will reach out on your <strong>mobile</strong>, <strong>email</strong> and <strong>WhatsApp</strong> with the account details, and send a receipt once your donation is confirmed.
              </p>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '12px' }}>Questions? WhatsApp us at <strong>+91 90928 82957</strong></p>
              <button onClick={onClose} style={{ marginTop: '16px', padding: '10px 28px', background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Close</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Styles (subset of the landing design system) ─────────────────────────────
function DonateStyles() {
  return (
    <style>{`
      .lp {
        --navy: #161a33; --navy-2: #1f2547;
        --red: #e24138; --red-deep: #c5302a;
        --gold: #c2974b; --gold-soft: #d8b878;
        --paper: #f6f1e7; --paper-2: #efe7d8;
        --ink: #2a2724; --ink-soft: #5b564f;
        --line: rgba(40,32,20,0.12);
        --serif: 'Shippori Mincho', 'Noto Serif Tamil', serif;
        --ta: 'Noto Serif Tamil', serif;
        --jp: 'Shippori Mincho', 'Noto Sans JP', serif;
        background: var(--paper); color: var(--ink);
        font-family: Inter, sans-serif; overflow-x: clip; min-height: 100vh;
      }
      .lp * { box-sizing: border-box; }
      .lp-container { max-width: 1180px; margin: 0 auto; padding: 0 28px; }
      .lp-on-dark { color: #fff !important; }
      .lp-section { padding: 72px 0; }
      .lp-section-paper { background: var(--paper); }
      .lp-section-head { max-width: 720px; margin: 0 auto 8px; text-align: center; }
      .lp-section-head .lp-tag { justify-content: center; }

      /* Buttons */
      .lp-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        font-weight: 600; font-size: 14px; border-radius: 4px; padding: 11px 20px; cursor: pointer;
        text-decoration: none; border: none; transition: all 180ms ease; white-space: nowrap; font-family: inherit; }
      .lp-btn-ghost { background: transparent; color: var(--ink); border: 1px solid var(--line); }
      .lp-btn-ghost:hover { border-color: var(--ink); background: rgba(0,0,0,0.02); }
      .lp-btn-donate { background: var(--red); color: #fff;
        box-shadow: 0 6px 18px rgba(226,65,56,0.28); font-size: 15px; padding: 14px 28px; }
      .lp-btn-donate:hover { background: var(--red-deep); transform: translateY(-2px); box-shadow: 0 10px 26px rgba(226,65,56,0.38); }

      /* Top bar */
      .lp-nav { position: sticky; top: 0; z-index: 50; background: rgba(246,241,231,0.82);
        backdrop-filter: saturate(160%) blur(12px); border-bottom: 1px solid var(--line); }
      .lp-nav-inner { display: flex; align-items: center; justify-content: space-between; height: 74px; }
      .lp-brand { display: flex; align-items: center; gap: 18px; text-decoration: none; }
      .lp-logo { width: 44px; height: 44px; border-radius: 8px; background: var(--red); color: #fff;
        font-family: var(--jp); font-weight: 700; font-size: 24px; display: flex; align-items: center;
        justify-content: center; box-shadow: 0 6px 16px rgba(226,65,56,0.3); flex-shrink: 0; }
      .lp-brand-text { display: flex; flex-direction: column; gap: 3px; }
      .lp-brand-ta { font-family: var(--ta); font-weight: 700; font-size: 17px; color: var(--ink); line-height: 1; }
      .lp-brand-en { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-soft); }

      /* Section tag */
      .lp-tag { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 20px; font-size: 12px;
        flex-wrap: wrap; }
      .lp-tag-ta { font-family: var(--ta); color: var(--gold); font-weight: 600; }
      .lp-tag-main { font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--red); }
      .lp-tag-jp { font-family: var(--jp); color: var(--ink-soft); }
      .lp-tag-light .lp-tag-ta { color: var(--gold-soft); }
      .lp-tag-light .lp-tag-jp { color: rgba(255,255,255,0.55); }

      .lp-h2 { font-family: var(--serif); font-weight: 700; font-size: clamp(28px, 3.6vw, 42px);
        line-height: 1.2; margin: 0 0 18px; color: var(--ink); }
      .lp-p { font-size: 16px; line-height: 1.8; color: var(--ink-soft); margin: 0 0 18px; }
      .lp-p-light { color: rgba(255,255,255,0.72); }

      /* Mission card */
      .lp-why-specials { display: grid; grid-template-columns: 1fr; gap: 26px; margin: 24px auto 0; max-width: 720px; }
      .lp-mission-card { position: relative; background: #fff; border: 1px solid var(--line);
        border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;
        transition: transform 200ms, box-shadow 200ms, border-color 200ms; }
      .lp-mission-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--mc); }
      .lp-mission-card:hover { transform: translateY(-6px); box-shadow: 0 28px 50px -22px rgba(40,32,20,0.4); border-color: transparent; }
      .lp-mission-blue { --mc: #1976d2; --mc-ink: #0d47a1; background: linear-gradient(145deg, #e3f0fb 0%, #cce0f5 100%); border-color: #90c4e8; }
      .lp-mission-icon { font-size: 46px; padding: 30px 30px 0; line-height: 1; }
      .lp-mission-body { padding: 16px 30px 30px; flex: 1; }
      .lp-mission-badge { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: .12em;
        text-transform: uppercase; color: var(--mc-ink); margin-bottom: 14px; }
      .lp-mission-title { font-family: var(--serif); font-size: 20px; font-weight: 700; color: var(--ink);
        margin: 0 0 12px; line-height: 1.3; }
      .lp-mission-desc { font-size: 14px; line-height: 1.7; color: var(--ink-soft); margin: 0 0 18px; }
      .lp-mission-desc strong { color: var(--ink); }
      .lp-mission-tree { display: flex; gap: 12px; background: var(--paper); border: 1px solid var(--line);
        border-radius: 6px; padding: 14px 16px; margin-bottom: 16px; align-items: flex-start; }
      .lp-mission-tree-icon { font-size: 24px; flex-shrink: 0; }
      .lp-mission-tree strong { font-size: 13.5px; font-weight: 700; color: var(--ink); display: block; margin-bottom: 4px; }
      .lp-mission-tree p { font-size: 13px; color: var(--ink-soft); margin: 0; line-height: 1.55; }
      .lp-mission-tagline { font-size: 13px; font-style: italic; color: var(--ink-soft); background: var(--paper);
        border-left: 3px solid var(--mc-ink); padding: 10px 14px; border-radius: 0 6px 6px 0; line-height: 1.55; }

      /* Donation section */
      .lp-donate-section { background: var(--navy);
        background-image: radial-gradient(110% 80% at 85% 15%, rgba(226,65,56,0.14), transparent 55%),
          radial-gradient(80% 60% at 5% 90%, rgba(194,151,75,0.08), transparent 50%); }
      .lp-donate-inner { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 60px; align-items: start; }
      .lp-donate-stats-row { display: flex; align-items: center; gap: 0; margin: 32px 0 24px;
        background: rgba(255,255,255,0.06); border-radius: 10px; overflow: hidden; }
      .lp-dstat { flex: 1; padding: 18px 20px; text-align: center; }
      .lp-dstat-val { font-family: var(--serif); font-size: 26px; font-weight: 700; color: #fff; line-height: 1; margin-bottom: 6px; }
      .lp-dstat-label { font-size: 11.5px; color: rgba(255,255,255,0.5); font-weight: 600; letter-spacing: .04em; text-transform: uppercase; }
      .lp-dstat-div { width: 1px; background: rgba(255,255,255,0.12); align-self: stretch; }
      .lp-donate-bar-wrap { margin-bottom: 32px; }
      .lp-donate-bar-track { height: 10px; background: rgba(255,255,255,0.12); border-radius: 99px; overflow: hidden; margin-bottom: 8px; }
      .lp-donate-bar-fill { height: 100%; background: linear-gradient(90deg, #e24138, #f472b6); border-radius: 99px;
        transition: width 1s ease; animation: barGrow 1.5s ease forwards; }
      @keyframes barGrow { from { width: 0 !important; } }
      .lp-donate-bar-labels { display: flex; justify-content: space-between; font-size: 12px; color: rgba(255,255,255,0.45); }
      .lp-donate-actions { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
      .lp-donate-note { font-size: 12px; color: rgba(255,255,255,0.4); }
      .lp-donate-impact-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
        border-radius: 16px; padding: 32px; display: flex; flex-direction: column; gap: 0; }
      .lp-dic-header { display: flex; align-items: center; gap: 18px; padding-bottom: 24px;
        border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 24px; }
      .lp-dic-icon { width: 56px; height: 56px; border-radius: 14px; background: linear-gradient(135deg, var(--red), #f97316);
        display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0;
        box-shadow: 0 8px 20px rgba(226,65,56,0.35); }
      .lp-dic-title { font-family: var(--serif); font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 4px; }
      .lp-dic-sub { font-size: 12.5px; color: rgba(255,255,255,0.5); line-height: 1.5; }
      .lp-dic-milestones { display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px; }
      .lp-dic-row { display: flex; align-items: center; gap: 12px; }
      .lp-dic-dot { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center;
        justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
      .lp-dic-done .lp-dic-dot { background: rgba(226,65,56,0.2); color: var(--red); border: 1.5px solid rgba(226,65,56,0.4); }
      .lp-dic-pending .lp-dic-dot { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.35); border: 1.5px solid rgba(255,255,255,0.15); }
      .lp-dic-item-label { font-size: 13.5px; color: rgba(255,255,255,0.72); flex: 1; line-height: 1.45; }
      .lp-dic-done .lp-dic-item-label { color: rgba(255,255,255,0.88); }
      .lp-dic-item-val { font-size: 12.5px; font-weight: 700; color: var(--gold-soft); white-space: nowrap; }
      .lp-dic-pending .lp-dic-item-val { color: rgba(255,255,255,0.45); }
      .lp-dic-cost { background: rgba(194,151,75,0.1); border: 1px solid rgba(194,151,75,0.25); border-radius: 10px;
        padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
      .lp-dic-cost-label { font-size: 12.5px; color: rgba(255,255,255,0.6); }
      .lp-dic-cost-val { font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--gold-soft); }
      .lp-dic-quote { font-size: 13px; font-style: italic; color: rgba(255,255,255,0.45); line-height: 1.65;
        border-left: 2px solid rgba(226,65,56,0.5); padding-left: 14px; }

      @media (max-width: 1000px) {
        .lp-donate-inner { grid-template-columns: 1fr; gap: 36px; }
        .lp-donate-stats-row { flex-wrap: wrap; }
      }
      @media (max-width: 560px) {
        .lp-brand-en { display: none; }
        .lp-section { padding: 48px 0; }
      }
    `}</style>
  )
}
