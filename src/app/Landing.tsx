'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Menu, X, ArrowRight, ArrowUpRight, Check, Phone, Mail, MapPin,
  CheckCircle2, AlertCircle,
} from 'lucide-react'
import KanaClock from './KanaClock'

// ─── Brand ──────────────────────────────────────────────────────────────────
const TAMIL = 'மொழிப்பற்று'
const ENG = 'Mozhippattru'

// ─── Course data ──────────────────────────────────────────────────────────────
type Course = {
  level: string; jp: string; color: string; title: string; ta: string
  price: number; hours: string; blurb: string; points: string[]
}

const COURSES: Course[] = [
  {
    level: 'N5', jp: '初級', color: '#2f9e63', title: 'Beginner Foundation', ta: 'தொடக்கம்',
    price: 8000, hours: '150 hours',
    blurb: 'Your first step. We build the script, the sound and the everyday phrases until reading kana feels natural.',
    points: ['Hiragana & Katakana mastery', '~100 kanji · ~800 words', 'Self-introduction & daily talk', 'Reading simple sentences'],
  },
  {
    level: 'N4', jp: '初中級', color: '#2d6fb8', title: 'Elementary', ta: 'அடிப்படை',
    price: 10000, hours: '180 hours',
    blurb: 'Words become conversations. You start handling everyday situations and reading written Japanese with ease.',
    points: ['~300 kanji · ~1,500 words', 'Everyday conversation & polite forms', 'Reading familiar topics', 'Listening to natural speech'],
  },
  {
    level: 'N3', jp: '中級', color: '#c98a2b', title: 'Intermediate Bridge', ta: 'இடைநிலை',
    price: 15000, hours: '200 hours',
    blurb: 'The bridge to advanced Japanese — study, work and life in Japan move within reach.',
    points: ['~650 kanji · ~3,750 words', 'Near-natural speed comprehension', 'Newspapers & notices', 'Expressing opinions & ideas'],
  },
]

const PACKAGE_PRICE = 30000
const PACKAGE_ORIGINAL = 8000 + 10000 + 15000 // 33,000

const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="lp">
      <FontLinks />
      <LandingStyles />

      {/* ─── Nav ─────────────────────────────── */}
      <header className="lp-nav">
        <div className="lp-container lp-nav-inner">
          <a href="#top" className="lp-brand" onClick={() => setMenuOpen(false)}>
            <span className="lp-logo">本</span>
            <span className="lp-brand-text">
              <span className="lp-brand-ta">{TAMIL}</span>
              <span className="lp-brand-en">{ENG} · Japanese Language School</span>
            </span>
          </a>

          <nav className={`lp-links ${menuOpen ? 'open' : ''}`}>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#courses" onClick={() => setMenuOpen(false)}>Courses</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
            <a href="#why" onClick={() => setMenuOpen(false)}>Why Us</a>
            <Link href="/login" className="lp-nav-login" onClick={() => setMenuOpen(false)}>Login</Link>
            <a href="#demo" className="lp-btn lp-btn-primary" onClick={() => setMenuOpen(false)}>செயல்முறை விளக்கம்</a>
          </nav>

          <button className="lp-burger" aria-label="Menu" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <main id="top">
        {/* ─── Hero — asymmetric, the clock is the signature ─────── */}
        <section className="lp-hero">
          <div className="lp-container lp-hero-grid">
            <div className="lp-hero-copy">
              <div className="lp-kicker">
                <span className="lp-kicker-ta">{TAMIL}</span>
                <span className="lp-kicker-dot" />
                日本語スクール
              </div>
              <h1 className="lp-hero-title">
                From your first <span className="lp-jp-accent">あ</span><br />
                to fluent <span className="lp-jp-accent">日本語</span>.
              </h1>
              <p className="lp-hero-sub">
                A Japanese language school with a Tamil heart. We teach JLPT N5 to N3 the patient way —
                explained in your mother tongue, mastered in Japanese — guided by{' '}
                <strong>N1-certified teachers</strong>, online &amp; in-class.
              </p>
              <div className="lp-hero-cta">
                <a href="#demo" className="lp-btn lp-btn-primary lp-btn-lg">
                  Book a free demo class <ArrowRight size={18} />
                </a>
                <a href="#courses" className="lp-btn lp-btn-ghost lp-btn-lg">
                  See courses &amp; fees
                </a>
              </div>
              <div className="lp-cred">
                <span>N1-certified faculty</span>
                <i />
                <span>150-hour foundation</span>
                <i />
                <span>Online &amp; in-class</span>
              </div>
            </div>

            <div className="lp-hero-clock">
              <KanaClock />
            </div>
          </div>
        </section>

        {/* ─── About + Future ─────────────────── */}
        <section id="about" className="lp-section">
          <div className="lp-container lp-about">
            <div className="lp-about-main">
              <SectionTag ta="எங்களைப் பற்றி" jp="私たちについて">About us</SectionTag>
              <h2 className="lp-h2">We teach the language, but we begin with the learner.</h2>
              <p className="lp-p">
                {ENG} means <em>devotion to language</em> — and that is exactly how we teach. Our courses are
                shaped by language experts and led by <strong>N1-certified teachers</strong> who have walked the
                JLPT path themselves. Every class weaves speaking, listening, reading and writing together, so you
                grow into someone who <em>communicates</em> — not someone who merely passes a test.
              </p>
              <p className="lp-p">
                Whether you dream of studying in Japan, working with a Japanese company, or simply love the
                language and its culture, we meet you exactly where you are — and take you further.
              </p>
            </div>

            <aside className="lp-future">
              <h3 className="lp-future-title">いま、そして これから — where we&apos;re heading</h3>
              <ol className="lp-future-list">
                <li><b>N2 &amp; N1 advanced batches</b> — the full JLPT ladder, all the way to fluency.</li>
                <li><b>Japan study &amp; placement guidance</b> — visa, university and job-readiness support.</li>
                <li><b>Conversation &amp; culture clubs</b> — weekly speaking circles and culture workshops.</li>
                <li><b>Campus &amp; corporate programs</b> — Japanese delivered on-site, on campus.</li>
                <li><b>A richer learning platform</b> — mock tests, progress tracking and a mobile app.</li>
              </ol>
            </aside>
          </div>
        </section>

        {/* ─── Courses ─────────────────────────── */}
        <section id="courses" className="lp-section lp-section-paper">
          <div className="lp-container">
            <div className="lp-section-head">
              <SectionTag ta="பாடநெறிகள்" jp="コース">Courses</SectionTag>
              <h2 className="lp-h2">A clear path, one level at a time.</h2>
              <p className="lp-lead">
                Structured coaching mapped to the official JLPT syllabus. Start fresh at N5, or join at the
                level that fits where you already are.
              </p>
            </div>

            <div className="lp-course-grid">
              {COURSES.map(c => (
                <article key={c.level} className="lp-course" style={{ ['--c' as string]: c.color }}>
                  <span className="lp-course-ghost">{c.level}</span>
                  <header className="lp-course-head">
                    <span className="lp-course-jp">{c.jp}</span>
                    <span className="lp-course-ta">{c.ta}</span>
                  </header>
                  <h3 className="lp-course-title">JLPT {c.level}</h3>
                  <div className="lp-course-sub">{c.title} · {c.hours}</div>
                  <p className="lp-course-blurb">{c.blurb}</p>
                  <ul className="lp-course-points">
                    {c.points.map(p => <li key={p}><Check size={15} /> {p}</li>)}
                  </ul>
                  <footer className="lp-course-foot">
                    <a href="#pricing" className="lp-course-fees">See fees</a>
                    <a href="#demo" className="lp-course-link">Enquire <ArrowUpRight size={15} /></a>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Pricing ─────────────────────────── */}
        <section id="pricing" className="lp-section">
          <div className="lp-container">
            <div className="lp-section-head">
              <SectionTag ta="கட்டணம்" jp="料金">Pricing</SectionTag>
              <h2 className="lp-h2">Honest, one-time fees.</h2>
              <p className="lp-lead">No hidden charges. Take all three levels together and save {inr(PACKAGE_ORIGINAL - PACKAGE_PRICE)}.</p>
            </div>

            <div className="lp-price-grid">
              {COURSES.map(c => (
                <div key={c.level} className="lp-price" style={{ ['--c' as string]: c.color }}>
                  <div className="lp-price-level">JLPT {c.level}</div>
                  <div className="lp-price-amt">{inr(c.price)}</div>
                  <div className="lp-price-meta">{c.hours} · {c.title}</div>
                  <ul className="lp-price-list">
                    {c.points.slice(0, 3).map(p => <li key={p}><Check size={14} /> {p}</li>)}
                  </ul>
                  <a href="#demo" className="lp-btn lp-btn-outline lp-full">Get started</a>
                </div>
              ))}

              <div className="lp-price lp-price-feature">
                <div className="lp-price-ribbon">Best value · சிறந்த தேர்வு</div>
                <div className="lp-price-level lp-on-dark">Complete Package</div>
                <div className="lp-price-amt lp-on-dark">
                  {inr(PACKAGE_PRICE)}
                  <s>{inr(PACKAGE_ORIGINAL)}</s>
                </div>
                <div className="lp-price-meta lp-meta-gold">N5 + N4 + N3 · 530+ hours · save {inr(PACKAGE_ORIGINAL - PACKAGE_PRICE)}</div>
                <ul className="lp-price-list lp-list-dark">
                  <li><Check size={14} /> All three levels — N5, N4 &amp; N3</li>
                  <li><Check size={14} /> Continuous N1-certified mentorship</li>
                  <li><Check size={14} /> Priority demo &amp; batch placement</li>
                </ul>
                <a href="#demo" className="lp-btn lp-btn-primary lp-full">Enroll for the package</a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Why us — editorial numbered ─────── */}
        <section id="why" className="lp-section lp-section-paper">
          <div className="lp-container lp-why">
            <div className="lp-why-head">
              <SectionTag ta="ஏன் நாங்கள்" jp="選ばれる理由">Why Mozhippattru</SectionTag>
              <h2 className="lp-h2">Small school. Serious results.</h2>
              <p className="lp-p">
                We kept the things that actually move a learner forward, and left out the rest. Here&apos;s what
                you can count on with us.
              </p>
            </div>
            <ol className="lp-why-list">
              <WhyItem n="一" t="N1-certified teachers" d="Learn from the highest JLPT-qualified faculty who know precisely what each level demands of you." />
              <WhyItem n="二" t="Online & in-class" d="Join live online from anywhere, or learn in person — whichever fits your week. Same teachers, same care." />
              <WhyItem n="三" t="Exam-aligned, life-ready" d="Every lesson maps to the JLPT syllabus, but we drill for real speaking and listening — not just the paper." />
              <WhyItem n="四" t="A learning platform that follows you" d="Track classes, attendance, assignments and progress on your own student portal, from day one." />
            </ol>
          </div>
        </section>

        {/* ─── Demo ────────────────────────────── */}
        <section id="demo" className="lp-section lp-demo">
          <div className="lp-container lp-demo-grid">
            <div className="lp-demo-copy">
              <SectionTag light ta="இலவச டெமோ" jp="無料体験">Free demo</SectionTag>
              <h2 className="lp-h2 lp-on-dark">Sit in on a class. On us.</h2>
              <p className="lp-p lp-p-light">
                Experience the teaching first-hand — no fees, no commitment. Tell us a little about yourself and
                our team will reach out to schedule your free online demo with an N1-certified teacher.
              </p>
              <ul className="lp-demo-points">
                <li><CheckCircle2 size={18} /> 100% free online session</li>
                <li><CheckCircle2 size={18} /> Personalised level guidance</li>
                <li><CheckCircle2 size={18} /> Meet your future teacher</li>
              </ul>
            </div>
            <DemoForm />
          </div>
        </section>
      </main>

      {/* ─── Footer ──────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-container lp-footer-grid">
          <div>
            <div className="lp-brand">
              <span className="lp-logo">本</span>
              <span className="lp-brand-text">
                <span className="lp-brand-ta lp-on-dark">{TAMIL}</span>
                <span className="lp-brand-en">{ENG}</span>
              </span>
            </div>
            <p className="lp-footer-about">
              Japanese Language School · 日本語スクール. JLPT N5–N3 coaching by N1-certified teachers,
              online &amp; in-class.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <a href="#about">About us</a><a href="#courses">Courses</a>
            <a href="#pricing">Pricing</a><a href="#demo">Free demo</a>
          </div>
          <div>
            <h4>Portal</h4>
            <Link href="/login">Student login</Link><Link href="/login">Teacher login</Link>
            <Link href="/login">Admin login</Link><Link href="/register">Register</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <span className="lp-fc"><Phone size={15} /> Call us for admissions</span>
            <span className="lp-fc"><Mail size={15} /> mozhippattru@gmail.com</span>
            <span className="lp-fc"><MapPin size={15} /> Online &amp; in-class · India</span>
          </div>
        </div>
        <div className="lp-footer-bar">
          <span>© {new Date().getFullYear()} {ENG} — Japanese Language School.</span>
          <span className="lp-footer-jp">頑張ろう。Let&apos;s learn, together.</span>
        </div>
      </footer>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function SectionTag({ children, ta, jp, light }: { children: React.ReactNode; ta?: string; jp?: string; light?: boolean }) {
  return (
    <div className={`lp-tag ${light ? 'lp-tag-light' : ''}`}>
      {ta && <span className="lp-tag-ta">{ta}</span>}
      <span className="lp-tag-main">{children}</span>
      {jp && <span className="lp-tag-jp">{jp}</span>}
    </div>
  )
}

function WhyItem({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <li className="lp-why-item">
      <span className="lp-why-num">{n}</span>
      <div>
        <h3 className="lp-why-title">{t}</h3>
        <p className="lp-why-desc">{d}</p>
      </div>
    </li>
  )
}

// ─── Demo form ─────────────────────────────────────────────────────────────────
function DemoForm() {
  const [form, setForm] = useState({
    full_name: '', phone: '', email: '', level: 'N5', mode: 'Online', preferred: '', message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading'); setError('')
    try {
      const res = await fetch('/api/demo-request', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong'); setStatus('error'); return }
      setStatus('done')
    } catch { setError('Network error. Please try again.'); setStatus('error') }
  }

  if (status === 'done') {
    return (
      <div className="lp-form lp-form-done">
        <div className="lp-done-icon"><CheckCircle2 size={38} /></div>
        <h3>ありがとう, {form.full_name.split(' ')[0] || 'there'}!</h3>
        <p>Your free demo request is in. We&apos;ll call you on <strong>{form.phone}</strong> soon to set up your online demo class.</p>
        <p className="lp-done-jp">またね — see you in class.</p>
      </div>
    )
  }

  return (
    <form className="lp-form" onSubmit={submit}>
      <h3 className="lp-form-title">Book your free demo</h3>
      {status === 'error' && <div className="lp-form-error"><AlertCircle size={16} /> {error}</div>}

      <label className="lp-label">Full name *</label>
      <input className="lp-input" required value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Your name" />

      <div className="lp-form-row">
        <div>
          <label className="lp-label">Phone *</label>
          <input className="lp-input" required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="Mobile number" />
        </div>
        <div>
          <label className="lp-label">Email</label>
          <input className="lp-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
        </div>
      </div>

      <div className="lp-form-row">
        <div>
          <label className="lp-label">Interested level</label>
          <select className="lp-input" value={form.level} onChange={e => set('level', e.target.value)}>
            <option value="N5">JLPT N5 — Beginner</option>
            <option value="N4">JLPT N4 — Elementary</option>
            <option value="N3">JLPT N3 — Intermediate</option>
            <option value="Package">Complete package (N5+N4+N3)</option>
          </select>
        </div>
        <div>
          <label className="lp-label">Mode</label>
          <select className="lp-input" value={form.mode} onChange={e => set('mode', e.target.value)}>
            <option value="Online">Online</option>
            <option value="In-Class">In-class</option>
          </select>
        </div>
      </div>

      <label className="lp-label">Preferred timing</label>
      <input className="lp-input" value={form.preferred} onChange={e => set('preferred', e.target.value)} placeholder="e.g. weekday evenings, weekends…" />

      <label className="lp-label">Message (optional)</label>
      <textarea className="lp-input" rows={2} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Anything you'd like us to know?" />

      <button type="submit" className="lp-btn lp-btn-primary lp-full lp-btn-lg" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : <>Request free demo <ArrowRight size={18} /></>}
      </button>
      <p className="lp-form-fine">By submitting, you agree to be contacted about your demo class.</p>
    </form>
  )
}

// ─── Fonts ───────────────────────────────────────────────────────────────────
function FontLinks() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;600;700;800&family=Noto+Serif+Tamil:wght@500;600;700&display=swap"
        rel="stylesheet"
      />
    </>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────
function LandingStyles() {
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
        font-family: Inter, sans-serif; overflow-x: clip;
      }
      .lp * { box-sizing: border-box; }
      .lp-container { max-width: 1180px; margin: 0 auto; padding: 0 28px; }
      .lp-on-dark { color: #fff !important; }

      /* Buttons */
      .lp-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        font-weight: 600; font-size: 14px; border-radius: 4px; padding: 11px 20px; cursor: pointer;
        text-decoration: none; border: none; transition: all 180ms ease; white-space: nowrap; font-family: inherit; }
      .lp-btn-lg { padding: 14px 26px; font-size: 15px; }
      .lp-full { width: 100%; }
      .lp-btn-primary { background: var(--red); color: #fff; box-shadow: 0 8px 22px rgba(226,65,56,0.28); }
      .lp-btn-primary:hover { background: var(--red-deep); transform: translateY(-2px); box-shadow: 0 12px 30px rgba(226,65,56,0.38); }
      .lp-btn-primary:disabled { opacity: .55; transform: none; cursor: not-allowed; }
      .lp-btn-ghost { background: transparent; color: var(--ink); border: 1px solid var(--line); }
      .lp-btn-ghost:hover { border-color: var(--ink); background: rgba(0,0,0,0.02); }
      .lp-btn-outline { background: transparent; color: var(--ink); border: 1px solid var(--line); }
      .lp-btn-outline:hover { border-color: var(--c, var(--ink)); color: var(--c, var(--ink)); }

      /* Nav */
      .lp-nav { position: sticky; top: 0; z-index: 50; background: rgba(246,241,231,0.82);
        backdrop-filter: saturate(160%) blur(12px); border-bottom: 1px solid var(--line); }
      .lp-nav-inner { display: flex; align-items: center; justify-content: space-between; height: 74px; }
      .lp-brand { display: flex; align-items: center; gap: 18px; text-decoration: none; }
      .lp-logo { width: 44px; height: 44px; border-radius: 8px; background: var(--red); color: #fff;
        font-family: var(--jp); font-weight: 700; font-size: 24px; display: flex; align-items: center;
        justify-content: center; box-shadow: 0 6px 16px rgba(226,65,56,0.3); flex-shrink: 0; }
      .lp-brand-text { display: flex; flex-direction: column; gap: 3px; }
      .lp-brand-ta { font-family: var(--ta); font-weight: 600; font-size: 19px; color: var(--ink); line-height: 1.45; }
      .lp-brand-en { font-size: 10.5px; color: var(--ink-soft); font-weight: 500; letter-spacing: .04em; text-transform: uppercase; line-height: 1.2; }
      .lp-links { display: flex; align-items: center; gap: 30px; }
      .lp-links > a { text-decoration: none; color: var(--ink); font-size: 14px; font-weight: 500; position: relative; }
      .lp-links > a:not(.lp-btn):not(.lp-nav-login)::after { content: ''; position: absolute; left: 0; bottom: -6px;
        width: 0; height: 2px; background: var(--gold); transition: width 220ms ease; }
      .lp-links > a:not(.lp-btn):not(.lp-nav-login):hover::after { width: 100%; }
      .lp-nav-login { text-decoration: none; color: var(--ink); font-size: 14px; font-weight: 600;
        padding: 9px 18px; border: 1px solid var(--line); border-radius: 4px; transition: all 160ms; }
      .lp-nav-login:hover { border-color: var(--ink); }
      .lp-burger { display: none; background: var(--navy); color: #fff; border: none; width: 44px; height: 44px;
        border-radius: 6px; cursor: pointer; align-items: center; justify-content: center; }

      /* Hero */
      .lp-hero { position: relative; padding: 18px 0 64px;
        background:
          radial-gradient(120% 90% at 88% 0%, rgba(226,65,56,0.06), transparent 55%),
          linear-gradient(180deg, var(--paper) 0%, var(--paper-2) 100%); }
      .lp-hero-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 56px; align-items: center;
        padding-top: 56px; }
      .lp-kicker { display: inline-flex; align-items: center; gap: 12px; font-family: var(--jp);
        font-size: 14px; color: var(--ink-soft); letter-spacing: .02em; margin-bottom: 26px; }
      .lp-kicker-ta { font-family: var(--ta); color: var(--red); font-weight: 600; }
      .lp-kicker-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); }
      .lp-hero-title { font-family: var(--serif); font-weight: 700; font-size: clamp(38px, 5.6vw, 66px);
        line-height: 1.06; letter-spacing: -0.01em; margin: 0 0 24px; color: var(--ink); }
      .lp-jp-accent { font-family: var(--jp); color: var(--red); font-weight: 700; }
      .lp-hero-sub { max-width: 520px; font-size: 17px; line-height: 1.72; color: var(--ink-soft); margin: 0 0 34px; }
      .lp-hero-sub strong { color: var(--ink); }
      .lp-hero-cta { display: flex; gap: 14px; flex-wrap: wrap; }
      .lp-cred { display: flex; align-items: center; gap: 16px; margin-top: 34px; flex-wrap: wrap;
        font-size: 12.5px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--ink-soft); }
      .lp-cred i { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); }
      .lp-hero-clock { display: flex; justify-content: center; }

      /* ─── Kana clock ─────────────────────── */
      .kc-wrap { --kc-r: 142px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
      .kc-face { position: relative; width: 360px; height: 360px; border-radius: 50%;
        background: radial-gradient(circle at 50% 38%, #fffdf8 0%, var(--paper) 62%, var(--paper-2) 100%);
        box-shadow: 0 2px 0 rgba(255,255,255,0.7) inset, 0 30px 60px -20px rgba(40,32,20,0.4),
          0 0 0 1px var(--line); }
      .kc-ring { position: absolute; inset: 26px; border-radius: 50%; border: 1px dashed rgba(194,151,75,0.4); }
      .kc-ring::after { content: ''; position: absolute; inset: 14px; border-radius: 50%; border: 1px solid var(--line); }
      .kc-mark { position: absolute; top: 50%; left: 50%; width: 40px; height: 40px; margin: -20px 0 0 -20px;
        display: flex; align-items: center; justify-content: center; background: transparent; border: none;
        cursor: pointer; font-family: var(--ta); font-size: 19px; font-weight: 600; color: var(--ink-soft);
        opacity: 0.5; transition: all 260ms ease; border-radius: 50%; }
      .kc-mark:hover { opacity: 0.9; }
      .kc-mark.on { opacity: 1; color: var(--red); transform: scale(1.18) !important;
        transform-origin: center; }
      .kc-hand { position: absolute; top: 50%; left: 50%; width: 0; height: 0; z-index: 3;
        transition: transform 700ms cubic-bezier(0.34, 1.45, 0.5, 1); }
      .kc-hand-line { position: absolute; left: -1.5px; top: -116px; width: 3px; height: 96px; border-radius: 3px;
        background: linear-gradient(var(--gold), var(--gold-soft)); }
      .kc-hand-dot { position: absolute; left: -5px; top: -120px; width: 10px; height: 10px; border-radius: 50%;
        background: var(--gold); box-shadow: 0 0 0 4px rgba(194,151,75,0.18); }
      .kc-stage { position: absolute; top: 50%; left: 50%; width: 172px; height: 172px; margin: -86px 0 0 -86px;
        border-radius: 50%; background: var(--navy); z-index: 2; perspective: 800px;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        box-shadow: 0 18px 40px -10px rgba(22,26,51,0.7), 0 0 0 6px rgba(255,255,255,0.5),
          0 0 0 7px var(--line); }
      .kc-card { display: flex; flex-direction: column; align-items: center; justify-content: center;
        transform-style: preserve-3d; animation: kcFlip 700ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
      @keyframes kcFlip {
        0%   { transform: rotateX(-90deg) translateY(8px); opacity: 0; }
        60%  { opacity: 1; }
        100% { transform: rotateX(0deg) translateY(0); opacity: 1; }
      }
      .kc-kana { font-family: var(--jp); font-weight: 700; font-size: 50px; line-height: 1; color: #fff; }
      .kc-bridge { display: flex; align-items: center; gap: 8px; margin: 7px 0; }
      .kc-bridge::before, .kc-bridge::after { content: ''; width: 16px; height: 1px; background: rgba(216,184,120,0.5); }
      .kc-romaji { font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-soft); font-weight: 600; }
      .kc-tamil { font-family: var(--ta); font-weight: 600; font-size: 34px; line-height: 1; color: var(--gold-soft); }
      .kc-footer { display: flex; flex-direction: column; align-items: center; gap: 14px; }
      .kc-caption { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--ink-soft); margin: 0; }
      .kc-caption span:first-child { font-family: var(--ta); }
      .kc-caption span:last-child { font-family: var(--jp); }
      .kc-sound { display: inline-flex; align-items: center; gap: 7px; font-family: inherit; font-size: 12px;
        font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--ink-soft);
        background: transparent; border: 1px solid var(--line); border-radius: 99px; padding: 7px 15px;
        cursor: pointer; transition: all 180ms ease; }
      .kc-sound:hover { border-color: var(--gold); color: var(--gold); }
      .kc-sound.on { background: var(--gold); border-color: var(--gold); color: #2a2410; }
      .kc-sound svg { flex-shrink: 0; }

      /* Sections */
      .lp-section { padding: 96px 0; }
      .lp-section-paper { background: linear-gradient(180deg, #fff 0%, #fcfaf4 100%); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
      .lp-section-head { max-width: 660px; margin: 0 auto 56px; text-align: center; }
      .lp-tag { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 20px; font-size: 12px;
        font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--red); }
      .lp-tag-main { position: relative; }
      .lp-tag-ta { font-family: var(--ta); color: var(--gold); text-transform: none; letter-spacing: 0; font-weight: 600; font-size: 14px; }
      .lp-tag-jp { font-family: var(--jp); color: var(--ink-soft); text-transform: none; letter-spacing: 0; font-weight: 500; font-size: 13px; }
      .lp-tag-light { color: #ff9a8f; }
      .lp-tag-light .lp-tag-jp { color: rgba(255,255,255,0.6); }
      .lp-h2 { font-family: var(--serif); font-weight: 700; font-size: clamp(28px, 3.6vw, 42px);
        line-height: 1.16; letter-spacing: -0.01em; margin: 0 0 18px; color: var(--ink); }
      .lp-p { font-size: 16px; line-height: 1.8; color: var(--ink-soft); margin: 0 0 18px; }
      .lp-p em { font-style: italic; color: var(--ink); }
      .lp-p strong { color: var(--ink); }
      .lp-p-light { color: rgba(255,255,255,0.72); }
      .lp-lead { font-size: 17px; line-height: 1.7; color: var(--ink-soft); }

      /* About */
      .lp-about { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 60px; align-items: start; }
      .lp-future { background: var(--navy); border-radius: 8px; padding: 34px; color: #fff; position: relative; overflow: hidden; }
      .lp-future::before { content: '⛩'; position: absolute; right: -10px; bottom: -18px; font-size: 120px; color: rgba(255,255,255,0.04); }
      .lp-future-title { font-family: var(--jp); font-size: 17px; font-weight: 600; margin: 0 0 22px; color: #fff; }
      .lp-future-list { list-style: none; margin: 0; padding: 0; counter-reset: f; display: flex; flex-direction: column; gap: 17px; }
      .lp-future-list li { position: relative; padding-left: 30px; font-size: 14px; color: rgba(255,255,255,0.66); line-height: 1.55; counter-increment: f; }
      .lp-future-list li::before { content: counter(f, decimal-leading-zero); position: absolute; left: 0; top: 1px;
        font-family: var(--jp); font-size: 12px; color: var(--gold-soft); font-weight: 600; }
      .lp-future-list b { color: #fff; font-weight: 600; }

      /* Courses */
      .lp-course-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; }
      .lp-course { position: relative; background: #fff; border: 1px solid var(--line); border-radius: 8px;
        padding: 30px; overflow: hidden; display: flex; flex-direction: column;
        transition: transform 200ms, box-shadow 200ms, border-color 200ms; }
      .lp-course::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--c); }
      .lp-course:hover { transform: translateY(-6px); box-shadow: 0 28px 50px -22px rgba(40,32,20,0.4); border-color: transparent; }
      .lp-course-ghost { position: absolute; top: 8px; right: 16px; font-family: var(--serif); font-weight: 800;
        font-size: 96px; line-height: 1; color: var(--c); opacity: 0.08; pointer-events: none; }
      .lp-course-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 14px; }
      .lp-course-jp { font-family: var(--jp); font-size: 22px; color: var(--c); font-weight: 600; }
      .lp-course-ta { font-family: var(--ta); font-size: 15px; color: var(--ink-soft); }
      .lp-course-title { font-family: var(--serif); font-weight: 700; font-size: 27px; color: var(--ink); margin: 0; }
      .lp-course-sub { font-size: 13px; color: var(--ink-soft); margin: 4px 0 16px; font-weight: 500; }
      .lp-course-blurb { font-size: 14px; line-height: 1.65; color: var(--ink-soft); margin: 0 0 20px; }
      .lp-course-points { list-style: none; margin: 0 0 22px; padding: 0; display: flex; flex-direction: column; gap: 11px; flex: 1; }
      .lp-course-points li { display: flex; align-items: flex-start; gap: 9px; font-size: 13.5px; color: var(--ink); line-height: 1.45; }
      .lp-course-points li svg { flex-shrink: 0; margin-top: 2px; color: var(--c); }
      .lp-course-foot { display: flex; align-items: center; justify-content: space-between; padding-top: 20px; border-top: 1px solid var(--line); }
      .lp-course-fees { font-size: 13px; font-weight: 600; color: var(--ink-soft); text-decoration: none; transition: color 150ms; }
      .lp-course-fees:hover { color: var(--gold); }
      .lp-course-link { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 600;
        color: var(--c); text-decoration: none; }
      .lp-course-link:hover { gap: 7px; }

      /* Pricing */
      .lp-price-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; align-items: stretch; }
      .lp-price { position: relative; background: #fff; border: 1px solid var(--line); border-radius: 8px;
        padding: 30px 26px; display: flex; flex-direction: column; }
      .lp-price-level { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--c); margin-bottom: 14px; }
      .lp-price-amt { font-family: var(--serif); font-size: 36px; font-weight: 700; color: var(--ink); line-height: 1; margin-bottom: 8px; }
      .lp-price-amt s { display: block; font-family: Inter; font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.5); margin-top: 7px; }
      .lp-price-meta { font-size: 12.5px; color: var(--ink-soft); margin-bottom: 22px; }
      .lp-meta-gold { color: var(--gold-soft) !important; font-weight: 600; }
      .lp-price-list { list-style: none; margin: 0 0 24px; padding: 0; display: flex; flex-direction: column; gap: 10px; flex: 1; }
      .lp-price-list li { display: flex; align-items: flex-start; gap: 9px; font-size: 13px; color: var(--ink); line-height: 1.45; }
      .lp-price-list li svg { flex-shrink: 0; margin-top: 2px; color: var(--c, var(--red)); }
      .lp-list-dark li { color: rgba(255,255,255,0.78); }
      .lp-list-dark li svg { color: var(--gold-soft); }
      .lp-price-feature { background: var(--navy); border-color: transparent; box-shadow: 0 30px 60px -25px rgba(22,26,51,0.8); transform: translateY(-8px); }
      .lp-price-ribbon { position: absolute; top: -12px; left: 26px; background: var(--gold); color: #2a2410;
        font-size: 11px; font-weight: 700; padding: 5px 13px; border-radius: 3px; letter-spacing: .02em; }

      /* Why */
      .lp-why { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 56px; align-items: start; }
      .lp-why-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 32px 36px; }
      .lp-why-item { display: flex; gap: 18px; }
      .lp-why-num { font-family: var(--jp); font-size: 30px; font-weight: 700; color: var(--gold);
        line-height: 1; flex-shrink: 0; width: 38px; }
      .lp-why-title { font-family: var(--serif); font-size: 18px; font-weight: 700; color: var(--ink); margin: 0 0 8px; }
      .lp-why-desc { font-size: 14px; line-height: 1.65; color: var(--ink-soft); margin: 0; }

      /* Demo */
      .lp-demo { background: var(--navy);
        background-image: radial-gradient(110% 80% at 85% 15%, rgba(226,65,56,0.14), transparent 55%); }
      .lp-demo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
      .lp-demo-points { list-style: none; margin: 30px 0 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
      .lp-demo-points li { display: flex; align-items: center; gap: 11px; color: rgba(255,255,255,0.88); font-size: 15px; }
      .lp-demo-points li svg { color: var(--gold-soft); flex-shrink: 0; }

      /* Form */
      .lp-form { background: #fff; border-radius: 10px; padding: 34px; box-shadow: 0 40px 80px -30px rgba(0,0,0,0.6); }
      .lp-form-title { font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--ink); margin: 0 0 22px; }
      .lp-label { display: block; font-size: 11.5px; font-weight: 600; color: var(--ink-soft); margin: 15px 0 6px;
        text-transform: uppercase; letter-spacing: .05em; }
      .lp-label:first-of-type { margin-top: 0; }
      .lp-input { width: 100%; padding: 11px 13px; border: 1px solid #e0dccf; border-radius: 5px;
        font-family: inherit; font-size: 14px; color: var(--ink); background: #fdfcf9; outline: none;
        transition: border-color 160ms, box-shadow 160ms; }
      .lp-input:focus { border-color: var(--red); box-shadow: 0 0 0 3px rgba(226,65,56,0.1); background: #fff; }
      textarea.lp-input { resize: vertical; }
      .lp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      .lp-form-row .lp-label { margin-top: 15px; }
      .lp-form button { margin-top: 24px; }
      .lp-form-fine { font-size: 11px; color: #a39e93; text-align: center; margin: 12px 0 0; }
      .lp-form-error { display: flex; align-items: center; gap: 8px; background: #fef2f2; color: #c5302a;
        padding: 11px 14px; border-radius: 6px; margin-bottom: 16px; font-size: 13px; }
      .lp-form-done { text-align: center; padding: 46px 30px; }
      .lp-done-icon { width: 72px; height: 72px; border-radius: 50%; background: #eefaf1; color: #2f9e63;
        display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
      .lp-form-done h3 { font-family: var(--serif); font-size: 23px; font-weight: 700; color: var(--ink); margin: 0 0 12px; }
      .lp-form-done p { font-size: 14.5px; line-height: 1.65; color: var(--ink-soft); margin: 0 auto; max-width: 320px; }
      .lp-done-jp { margin-top: 16px !important; font-family: var(--jp); color: var(--red) !important; }

      /* Footer */
      .lp-footer { background: #111425; color: rgba(255,255,255,0.62); padding: 60px 0 0; }
      .lp-footer-grid { display: grid; grid-template-columns: 1.7fr 1fr 1fr 1.2fr; gap: 36px; padding-bottom: 46px; }
      .lp-footer .lp-logo { box-shadow: none; }
      .lp-footer-about { font-size: 13.5px; line-height: 1.7; margin: 18px 0 0; color: rgba(255,255,255,0.45); max-width: 320px; }
      .lp-footer h4 { font-size: 12px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: .06em; margin: 0 0 18px; }
      .lp-footer a, .lp-fc { display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.55);
        text-decoration: none; font-size: 14px; margin-bottom: 12px; transition: color 150ms; }
      .lp-footer a:hover { color: var(--gold-soft); }
      .lp-footer-bar { border-top: 1px solid rgba(255,255,255,0.1); padding: 22px 28px; display: flex;
        justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; max-width: 1180px;
        margin: 0 auto; font-size: 12.5px; color: rgba(255,255,255,0.4); }
      .lp-footer-jp { font-family: var(--jp); color: var(--gold-soft); }

      /* Responsive */
      @media (max-width: 1000px) {
        .lp-hero-grid { grid-template-columns: 1fr; gap: 44px; }
        .lp-hero-copy { text-align: center; }
        .lp-hero-sub { margin-left: auto; margin-right: auto; }
        .lp-hero-cta, .lp-cred, .lp-kicker { justify-content: center; }
        .lp-about, .lp-why { grid-template-columns: 1fr; gap: 36px; }
        .lp-course-grid { grid-template-columns: repeat(2, 1fr); }
        .lp-price-grid { grid-template-columns: repeat(2, 1fr); }
        .lp-price-feature { transform: none; }
        .lp-demo-grid { grid-template-columns: 1fr; gap: 38px; }
        .lp-footer-grid { grid-template-columns: 1fr 1fr; gap: 30px; }
      }
      @media (max-width: 820px) {
        .lp-burger { display: inline-flex; }
        .lp-links { position: fixed; top: 74px; left: 0; right: 0; background: var(--paper); flex-direction: column;
          gap: 0; padding: 8px 0 14px; border-bottom: 1px solid var(--line); box-shadow: 0 18px 40px rgba(0,0,0,0.12);
          transform: translateY(-12px); opacity: 0; pointer-events: none; transition: all 200ms ease; }
        .lp-links.open { transform: translateY(0); opacity: 1; pointer-events: all; }
        .lp-links > a, .lp-nav-login { width: calc(100% - 48px); margin: 4px 24px; padding: 13px 16px; text-align: center; }
        .lp-nav-login { border: 1px solid var(--line); }
      }
      @media (max-width: 560px) {
        .lp-section { padding: 64px 0; }
        .lp-container { padding: 0 20px; }
        .lp-course-grid, .lp-price-grid, .lp-why-list, .lp-footer-grid { grid-template-columns: 1fr; }
        .lp-form-row { grid-template-columns: 1fr; }
        .lp-brand-en { display: none; }
        .lp-form { padding: 26px; }
        .kc-wrap { --kc-r: 118px; }
        .kc-face { width: 300px; height: 300px; }
        .kc-hand-line { top: -98px; height: 80px; }
        .kc-hand-dot { top: -102px; }
        .kc-kana { font-size: 42px; }
        .kc-tamil { font-size: 29px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .kc-card { animation-duration: 0.01ms; }
        .kc-hand { transition-duration: 0.01ms; }
      }
    `}</style>
  )
}
