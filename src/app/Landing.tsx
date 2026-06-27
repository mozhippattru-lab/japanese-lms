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

const KIDS_COURSE = {
  price: 3000, hours: '40 Hours', color: '#7c3aed',
  points: ['Basic speaking & listening', 'Hiragana reading & writing', 'Fun vocabulary & greetings', 'Interactive activities & games'],
}

// Donation stats (update these as actual donations come in)
const DONATION_STATS = { raised: 45000, wheelchairs: 1, target: 300000 }

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
            <a href="#donate" onClick={() => setMenuOpen(false)}>Donate</a>
            <Link href="/login" className="lp-nav-login" onClick={() => setMenuOpen(false)}>Login</Link>
            <a href="#demo" className="lp-btn lp-btn-primary" onClick={() => setMenuOpen(false)}>Free Demo</a>
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
                日本語学校
              </div>
              <h1 className="lp-hero-title">
                <span className="lp-hero-line">From your first <span className="lp-jp-accent">あ</span></span>
                <span className="lp-hero-line">to fluent <span className="lp-jp-accent">日本語</span></span>
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

            {/* Kids course — featured row */}
            <KidsCourse />
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

        {/* ─── Why us — Thirukkural + mission cards ─────── */}
        <section id="why" className="lp-section lp-section-paper">
          <div className="lp-container">
            <div className="lp-kural-split">
              <div className="lp-kural-headtext">
                <SectionTag ta="ஏன் நாங்கள்" jp="選ばれる理由">Why Mozhippattru</SectionTag>
                <h2 className="lp-h2">Small school. Serious results.</h2>
                <p className="lp-p">
                  We kept the things that actually move a learner forward, and left out the rest.
                  Here&apos;s what you can count on with us.
                </p>
              </div>
              <div className="lp-kural-verse">
                <div className="lp-kural-num">திருக்குறள் -392 • ティルックラル -392 • Thirukkural-392</div>
                <p className="lp-kural-ta">
                  எண்ணென்ப ஏனை எழுத்தென்ப இவ்விரண்டும்<br />
                  கண்ணென்ப வாழும் உயிர்க்கு.
                </p>
                <p className="lp-kural-jp">
                  数字と文字と呼ばれるこの二つは、<br />
                  生きる者にとって目であると賢者は言う。
                </p>
                <p className="lp-kural-en">
                  &ldquo;Numeracy and literacy are the two eyes that guide human life.&rdquo;
                </p>
              </div>
            </div>

            {/* Special mission cards */}
            <div className="lp-why-specials">
              {/* Free Education */}
              <div className="lp-mission-card lp-mission-green">
                <div className="lp-mission-icon">🌳</div>
                <div className="lp-mission-body">
                  <div className="lp-mission-badge">Free Education Initiative</div>
                  <h3 className="lp-mission-title">Free Japanese Education for Government School Students</h3>
                  <p className="lp-mission-desc">
                    We provide free Japanese language education to students studying in nearby government schools.
                    Our mission is to create equal learning opportunities for every child regardless of their
                    financial background.
                  </p>
                  <div className="lp-mission-tree">
                    <span className="lp-mission-tree-icon">🌱</span>
                    <div>
                      <strong>Tree Planting Initiative</strong>
                      <p>Every student receiving free education must plant at least one tree near their home or school.</p>
                    </div>
                  </div>
                  <div className="lp-mission-tagline">
                    &ldquo;We provide education. Our students give back to nature by planting trees and creating a greener future.&rdquo;
                  </div>
                </div>
              </div>

              {/* Wheelchair Donation */}
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
                      <p>An electric wheelchair (≈ ₹37,500) can restore independent movement for years —
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

        {/* ─── Annanin Parisu — free education for those who need it most ── */}
        <section id="annanin" className="lp-section lp-annanin">
          <div className="lp-container">
            <div className="lp-annanin-head">
              <SectionTag ta="அண்ணனின் பரிசு" jp="無償教育">The Elder Brother&apos;s Gift</SectionTag>
              <h2 className="lp-h2">A gift of education for those who need it most</h2>
              <p className="lp-p lp-annanin-lead">
                Some students carry far more than their share. Through <em>Annanin Parisu</em>{' '}— the elder
                brother&apos;s gift — we open our Japanese classroom to them, completely free. Learning should
                never depend on what life has taken away.
              </p>
            </div>

            <div className="lp-annanin-grid">
              <div className="lp-ap-card" style={{ ['--c' as string]: 'var(--gold)' }}>
                <div className="lp-ap-icon">🕊️</div>
                <h3 className="lp-ap-title">Children who lost a parent</h3>
                <p className="lp-ap-desc">
                  Students who have lost one or both parents can learn Japanese with us at no cost. Each
                  application is gently verified before we welcome them in.
                </p>
              </div>

              <div className="lp-ap-card" style={{ ['--c' as string]: 'var(--red)' }}>
                <div className="lp-ap-icon">♿</div>
                <h3 className="lp-ap-title">Persons with disabilities</h3>
                <p className="lp-ap-desc">
                  UDID cardholders who wish to study Japanese are supported fully and taught free — online
                  or in class, whichever serves them best.
                </p>
              </div>

              <div className="lp-ap-card" style={{ ['--c' as string]: 'var(--navy)' }}>
                <div className="lp-ap-icon">🤝</div>
                <h3 className="lp-ap-title">Thirunar community</h3>
                <p className="lp-ap-desc">
                  Thirunar learners who wish to study Japanese are warmly welcome to join and learn
                  with us, with dignity and free of charge.
                </p>
              </div>
            </div>

            <div className="lp-annanin-foot">
              <span className="lp-ap-chip">Verified with care</span>
              <span className="lp-ap-dot" />
              <span className="lp-ap-chip">Taught with dignity</span>
              <a href="#demo" className="lp-ap-apply">Apply through our free demo <ArrowRight size={15} /></a>
            </div>
          </div>
        </section>

        {/* ─── Donation section ────────────────── */}
        <section id="donate" className="lp-section lp-donate-section">
          <div className="lp-container">
            <div className="lp-donate-inner">

              {/* Left — copy + stats */}
              <div className="lp-donate-copy">
                <SectionTag light ta="கொடை" jp="寄付・車椅子">Support</SectionTag>
                <h2 className="lp-h2 lp-on-dark">Support Our Electric Wheelchair Mission</h2>
                <p className="lp-p lp-p-light">
                  Students, parents, alumni, and supporters can voluntarily contribute to our Electric
                  Wheelchair Donation Fund. Every contribution helps someone with a disability regain
                  independence. <em style={{ color: 'rgba(255,255,255,0.55)', fontStyle: 'normal' }}>Donations are completely optional.</em>
                </p>

                {/* 3-stat row */}
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

                {/* Progress bar */}
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
                  <a href="#demo" className="lp-btn lp-btn-donate">🤍 Donate Now</a>
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
                  <div className="lp-dic-cost-val">≈ ₹37,500</div>
                </div>

                <div className="lp-dic-quote">
                  &ldquo;When you learn Japanese here, someone somewhere gains the freedom to move.&rdquo;
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── Demo ────────────────────────────── */}
        <section id="demo" className="lp-section lp-demo">
          <div className="lp-container lp-demo-grid">
            <div className="lp-demo-copy">
              <SectionTag ta="இலவச செயல்முறை விளக்கம்" jp="無料体験">Free demo</SectionTag>
              <h2 className="lp-h2">Sit in on a class. On us.</h2>
              <p className="lp-p">
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
              Japanese Language School · 日本語学校. JLPT N5–N3 coaching by N1-certified teachers,
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
            <a className="lp-fc" href="tel:+919092882957"><Phone size={15} /> +91 90928 82957</a>
            <a className="lp-fc lp-fc-email" href="mailto:japanese.school@mozhippattru.org"><Mail size={15} /> japanese.school@mozhippattru.org</a>
            <span className="lp-fc"><MapPin size={15} /> Online &amp; in-class · India</span>
          </div>
        </div>
        <div className="lp-footer-bar">
          <span>© {new Date().getFullYear()} {ENG} — Japanese Language School. All rights reserved.</span>
          <span className="lp-footer-jp">頑張ろう。Let&apos;s learn, together.</span>
        </div>
        <div className="lp-footer-credit">
          Developed &amp; maintained by{' '}
          <a href="https://nexaex.in" target="_blank" rel="noopener noreferrer">Nexaex Digital Services Pvt. Ltd.</a>
          {' '}·{' '}
          <a href="https://nexaex.in" target="_blank" rel="noopener noreferrer">nexaex.in</a>
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

function KidsCourse() {
  return (
    <div className="lp-kids-card">
      <div className="lp-kids-badge">⭐ Special Course · குழந்தைகளுக்கான பாடநெறி</div>
      <div className="lp-kids-inner">
        <div className="lp-kids-left">
          <div className="lp-kids-emoji">👦👧</div>
          <div>
            <div className="lp-kids-jp">子ども向け · 초급</div>
            <h3 className="lp-kids-title">Japanese Basics for Kids</h3>
            <div className="lp-kids-meta">40 Hours · Ages 6–15 · Beginner Friendly</div>
            <div className="lp-kids-price-tag">{inr(KIDS_COURSE.price)}</div>
          </div>
        </div>
        <div className="lp-kids-desc">
          <p>A beginner-friendly Japanese language course specially designed for school children.
            The course focuses on basic Japanese speaking, listening, reading, writing, vocabulary,
            greetings, and fun interactive activities.</p>
          <ul className="lp-kids-points">
            {KIDS_COURSE.points.map(p => <li key={p}><Check size={14} /> {p}</li>)}
          </ul>
        </div>
        <div className="lp-kids-cta">
          <a href="#demo" className="lp-btn lp-btn-primary">Enquire now <ArrowRight size={16} /></a>
          <div className="lp-kids-note">Limited seats · Online &amp; in-class</div>
        </div>
      </div>
    </div>
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
      .lp-hero-title { font-family: var(--serif); font-weight: 700; font-size: clamp(30px, 5.2vw, 60px);
        line-height: 1.08; letter-spacing: -0.01em; margin: 0 0 24px; color: var(--ink); }
      .lp-hero-line { display: block; white-space: nowrap; }
      .lp-jp-accent { font-family: var(--jp); color: var(--red); font-weight: 700; }

      /* Thirukkural banner at the very top of the hero */
      .lp-kural { text-align: center; max-width: 760px; margin: 0 auto; padding: 26px 16px 22px;
        border-bottom: 1px solid var(--line); }
      .lp-kural-split { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 56px;
        align-items: center; margin: 0 0 56px; }
      .lp-kural-headtext .lp-p { margin-bottom: 0; }
      .lp-kural-verse { text-align: left; }
      .lp-kural-verse .lp-kural-num { margin-bottom: 14px; }
      .lp-kural-num { font-family: var(--ta); font-size: 12.5px; font-weight: 700; letter-spacing: .08em;
        text-transform: uppercase; color: var(--red); margin-bottom: 12px; }
      .lp-kural-ta { font-family: var(--ta); font-size: clamp(16px, 2.3vw, 21px); line-height: 1.85;
        font-weight: 600; color: var(--ink); margin: 0; }
      .lp-kural-jp { font-family: var(--jp, 'Shippori Mincho', serif); font-size: clamp(13px, 1.7vw, 15.5px);
        line-height: 1.8; color: var(--ink); margin: 14px 0 0; }
      .lp-kural-en { font-size: 13.5px; font-style: italic; line-height: 1.6; color: var(--ink-soft); margin: 12px 0 0; }
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
      .lp-demo { background:
          radial-gradient(100% 80% at 92% 8%, rgba(45,111,184,0.07), transparent 55%),
          linear-gradient(180deg, #fff 0%, #fcfaf4 100%);
        border-top: 1px solid var(--line); }
      .lp-demo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
      .lp-demo-points { list-style: none; margin: 30px 0 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
      .lp-demo-points li { display: flex; align-items: center; gap: 11px; color: var(--ink); font-size: 15px; font-weight: 500; }
      .lp-demo-points li svg { color: #2f9e63; flex-shrink: 0; }

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
      .lp-footer-grid { display: grid; grid-template-columns: 1.6fr 0.9fr 0.9fr 1.5fr; gap: 32px; padding-bottom: 46px; }
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
      .lp-fc-email { font-size: 12.5px; align-items: flex-start; line-height: 1.45; overflow-wrap: anywhere; }
      .lp-fc-email svg { flex-shrink: 0; margin-top: 3px; }
      .lp-footer-credit { border-top: 1px solid rgba(255,255,255,0.07); padding: 16px 28px; text-align: center;
        font-size: 12px; color: rgba(255,255,255,0.4); max-width: 1180px; margin: 0 auto; }
      .lp-footer-credit a { display: inline; margin: 0; font-size: 12px; color: rgba(255,255,255,0.62);
        text-decoration: none; }
      .lp-footer-credit a:hover { color: var(--gold-soft); }

      /* Kids course card */
      .lp-kids-card { margin-top: 36px; background: #fff; border: 1px solid var(--line);
        border-radius: 8px; overflow: hidden; position: relative;
        box-shadow: 0 4px 24px -8px rgba(40,32,20,0.12); }
      .lp-kids-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
        background: linear-gradient(90deg, var(--red), var(--gold)); }
      .lp-kids-badge { background: var(--navy); color: var(--gold-soft); font-size: 11.5px; font-weight: 700;
        letter-spacing: .04em; padding: 7px 22px; display: inline-block; font-family: var(--jp); }
      .lp-kids-inner { display: grid; grid-template-columns: 1fr 1.6fr auto; gap: 32px; padding: 28px 32px; align-items: center; }
      .lp-kids-left { display: flex; align-items: flex-start; gap: 18px; }
      .lp-kids-emoji { font-size: 40px; line-height: 1; flex-shrink: 0; letter-spacing: -4px; }
      .lp-kids-jp { font-family: var(--jp); font-size: 13px; color: var(--gold); font-weight: 600; margin-bottom: 4px; }
      .lp-kids-title { font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--ink); margin: 0 0 6px; }
      .lp-kids-meta { font-size: 12.5px; color: var(--ink-soft); margin-bottom: 10px; }
      .lp-kids-price-tag { font-family: var(--serif); font-size: 28px; font-weight: 700; color: var(--red); }
      .lp-kids-desc p { font-size: 14px; line-height: 1.65; color: var(--ink-soft); margin: 0 0 14px; }
      .lp-kids-points { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
      .lp-kids-points li { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--ink); }
      .lp-kids-points li svg { color: var(--red); flex-shrink: 0; }
      .lp-kids-cta { display: flex; flex-direction: column; align-items: center; gap: 10px; }
      .lp-kids-note { font-size: 11px; color: var(--ink-soft); text-align: center; }

      /* Why Us special mission cards — editorial brand style */
      .lp-why-specials { display: grid; grid-template-columns: 1fr 1fr; gap: 26px; margin-top: 52px; }
      .lp-mission-card { position: relative; background: #fff; border: 1px solid var(--line);
        border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;
        transition: transform 200ms, box-shadow 200ms, border-color 200ms; }
      .lp-mission-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--mc); }
      .lp-mission-card:hover { transform: translateY(-6px); box-shadow: 0 28px 50px -22px rgba(40,32,20,0.4); border-color: transparent; }
      .lp-mission-green { --mc: #2f9e63; --mc-ink: #2f9e63; }
      .lp-mission-blue { --mc: linear-gradient(90deg, var(--red), var(--gold)); --mc-ink: var(--red); }
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

      /* Annanin Parisu — free education program */
      .lp-annanin { background:
          radial-gradient(120% 90% at 12% 0%, rgba(194,151,75,0.10), transparent 55%),
          radial-gradient(100% 80% at 90% 100%, rgba(226,65,56,0.06), transparent 50%),
          linear-gradient(180deg, #fcfaf4 0%, var(--paper) 100%);
        border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
      .lp-annanin-head { max-width: 720px; margin: 0 auto 48px; text-align: center; }
      .lp-annanin-head .lp-tag { justify-content: center; }
      .lp-annanin-lead { margin: 0 auto; }
      .lp-annanin-lead em { font-family: var(--serif); font-style: italic; color: var(--red); font-weight: 600; }
      .lp-annanin-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
      .lp-ap-card { position: relative; background: #fff; border: 1px solid var(--line); border-radius: 8px;
        padding: 30px 28px; overflow: hidden; display: flex; flex-direction: column;
        transition: transform 200ms, box-shadow 200ms, border-color 200ms; }
      .lp-ap-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--c); }
      .lp-ap-card:hover { transform: translateY(-6px); box-shadow: 0 28px 50px -22px rgba(40,32,20,0.4); border-color: transparent; }
      .lp-ap-icon { width: 54px; height: 54px; border-radius: 12px; display: flex; align-items: center;
        justify-content: center; font-size: 28px; margin-bottom: 18px;
        background: color-mix(in srgb, var(--c) 12%, #fff); }
      .lp-ap-title { font-family: var(--serif); font-size: 19px; font-weight: 700; color: var(--ink); margin: 0 0 10px; line-height: 1.3; }
      .lp-ap-desc { font-size: 14px; line-height: 1.7; color: var(--ink-soft); margin: 0; }
      .lp-annanin-foot { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 14px;
        margin-top: 40px; }
      .lp-ap-chip { font-size: 12.5px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: var(--ink-soft); }
      .lp-ap-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); }
      .lp-ap-apply { display: inline-flex; align-items: center; gap: 6px; font-size: 13.5px; font-weight: 600;
        color: var(--red); text-decoration: none; margin-left: 8px; transition: gap 150ms; }
      .lp-ap-apply:hover { gap: 10px; }

      /* Donation section */
      .lp-donate-section { background: var(--navy);
        background-image: radial-gradient(110% 80% at 85% 15%, rgba(226,65,56,0.14), transparent 55%),
          radial-gradient(80% 60% at 5% 90%, rgba(194,151,75,0.08), transparent 50%); }
      /* Donation impact card (right panel) */
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
      .lp-donate-actions { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
      .lp-donate-note { font-size: 12px; color: rgba(255,255,255,0.4); }
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
      .lp-btn-donate { background: var(--red); color: #fff;
        box-shadow: 0 6px 18px rgba(226,65,56,0.28); font-size: 15px; padding: 14px 28px; }
      .lp-btn-donate:hover { background: var(--red-deep); transform: translateY(-2px); box-shadow: 0 10px 26px rgba(226,65,56,0.38); }
      .lp-donate-recent { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px; padding: 26px; }
      .lp-donate-recent-title { font-family: var(--serif); font-size: 17px; font-weight: 700; color: #fff; margin: 0 0 20px; }
      .lp-donate-card { display: flex; gap: 12px; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.07); }
      .lp-donate-card:last-child { border-bottom: none; padding-bottom: 0; }
      .lp-donate-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #e24138);
        color: #fff; font-weight: 700; font-size: 15px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .lp-donate-name { font-size: 13.5px; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 4px; }
      .lp-donate-tag { font-size: 11.5px; font-weight: 700; color: #f9a8d4; margin-left: 8px; }
      .lp-donate-msg { font-size: 12.5px; color: rgba(255,255,255,0.45); font-style: italic; line-height: 1.5; }
      .lp-donate-info { flex: 1; min-width: 0; }

      /* Responsive */
      @media (max-width: 1000px) {
        .lp-hero-grid { grid-template-columns: 1fr; gap: 44px; }
        .lp-hero-copy { text-align: center; }
        .lp-hero-sub { margin-left: auto; margin-right: auto; }
        .lp-hero-cta, .lp-cred, .lp-kicker { justify-content: center; }
        .lp-about, .lp-why { grid-template-columns: 1fr; gap: 36px; }
        .lp-kural-split { grid-template-columns: 1fr; gap: 28px; }
        .lp-course-grid { grid-template-columns: repeat(2, 1fr); }
        .lp-price-grid { grid-template-columns: repeat(2, 1fr); }
        .lp-price-feature { transform: none; }
        .lp-demo-grid { grid-template-columns: 1fr; gap: 38px; }
        .lp-footer-grid { grid-template-columns: 1fr 1fr; gap: 30px; }
        .lp-kids-inner { grid-template-columns: 1fr 1fr; gap: 20px; }
        .lp-kids-cta { grid-column: 1 / -1; flex-direction: row; justify-content: flex-start; }
        .lp-why-specials { grid-template-columns: 1fr; }
        .lp-annanin-grid { grid-template-columns: 1fr; }
        .lp-donate-inner { grid-template-columns: 1fr; gap: 36px; }
        .lp-donate-stats-row { flex-wrap: wrap; }
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
        .lp-hero-title { white-space: normal; }
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
        .lp-kids-inner { grid-template-columns: 1fr; }
        .lp-kids-left { flex-direction: column; gap: 10px; }
        .lp-kids-points { grid-template-columns: 1fr; }
        .lp-donate-stats-row { flex-direction: column; }
        .lp-dstat-div { width: 100%; height: 1px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .kc-card { animation-duration: 0.01ms; }
        .kc-hand { transition-duration: 0.01ms; }
      }
    `}</style>
  )
}
