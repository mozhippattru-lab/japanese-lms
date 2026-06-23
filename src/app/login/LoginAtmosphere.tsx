'use client'

import { useEffect, useState } from 'react'

// Ambient login backdrop: a Tamil word on the left, its Japanese twin on the
// right, both ticking to the next pair in sync — over a drift of sakura petals.
// Purely decorative (pointer-events: none); side words hide on small screens.

const PAIRS = [
  { ta: 'அம்மா',   tr: 'amma',     jp: '母',         jr: 'haha',       en: 'mother' },
  { ta: 'அப்பா',   tr: 'appa',     jp: '父',         jr: 'chichi',     en: 'father' },
  { ta: 'அன்பு',   tr: 'anbu',     jp: '愛',         jr: 'ai',         en: 'love' },
  { ta: 'பாசம்',   tr: 'paasam',   jp: '愛情',       jr: 'aijō',       en: 'affection' },
  { ta: 'கல்வி',   tr: 'kalvi',    jp: '学び',       jr: 'manabi',     en: 'learning' },
  { ta: 'மொழி',   tr: 'mozhi',    jp: '言葉',       jr: 'kotoba',     en: 'language' },
  { ta: 'நண்பன்', tr: 'nanban',   jp: '友',         jr: 'tomo',       en: 'friend' },
  { ta: 'ஆசிரியர்', tr: 'aasiriyar', jp: '先生',     jr: 'sensei',     en: 'teacher' },
  { ta: 'மாணவன்', tr: 'maanavan', jp: '学生',       jr: 'gakusei',    en: 'student' },
  { ta: 'கனவு',   tr: 'kanavu',   jp: '夢',         jr: 'yume',       en: 'dream' },
  { ta: 'நன்றி',   tr: 'nandri',   jp: '感謝',       jr: 'kansha',     en: 'gratitude' },
  { ta: 'வணக்கம்', tr: 'vanakkam', jp: 'こんにちは', jr: 'konnichiwa', en: 'greetings' },
]

// Fixed petal configs (no Math.random → no hydration mismatch).
const PETALS = [
  { left: '6%',  size: 14, dur: 11, delay: 0,   drift: 40 },
  { left: '15%', size: 10, dur: 14, delay: 3,   drift: -30 },
  { left: '24%', size: 16, dur: 9,  delay: 1.5, drift: 55 },
  { left: '33%', size: 11, dur: 13, delay: 5,   drift: -45 },
  { left: '44%', size: 13, dur: 10, delay: 2,   drift: 35 },
  { left: '56%', size: 9,  dur: 15, delay: 6,   drift: -25 },
  { left: '66%', size: 15, dur: 11, delay: 0.8, drift: 50 },
  { left: '75%', size: 11, dur: 13, delay: 4,   drift: -40 },
  { left: '84%', size: 13, dur: 10, delay: 2.5, drift: 30 },
  { left: '92%', size: 10, dur: 16, delay: 7,   drift: -35 },
  { left: '38%', size: 12, dur: 12, delay: 8,   drift: 45 },
  { left: '60%', size: 14, dur: 9,  delay: 3.5, drift: -50 },
]

export default function LoginAtmosphere() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setI(x => (x + 1) % PAIRS.length), 3000)
    return () => clearInterval(t)
  }, [])

  const p = PAIRS[i]

  return (
    <div className="la-field" aria-hidden="true">
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+Tamil:wght@500;600;700&family=Shippori+Mincho:wght@600;700&display=swap"
        rel="stylesheet"
      />

      <div className="la-glow" />

      {/* falling sakura */}
      {PETALS.map((pt, idx) => (
        <span
          key={idx}
          className="la-petal"
          style={{
            left: pt.left,
            width: pt.size, height: pt.size,
            // @ts-expect-error custom props
            '--dur': `${pt.dur}s`, '--delay': `${pt.delay}s`, '--drift': `${pt.drift}px`,
          }}
        />
      ))}

      {/* left: Tamil */}
      <div className="la-word la-left" key={'l' + i}>
        <span className="la-ta">{p.ta}</span>
        <span className="la-sub">{p.tr} · {p.en}</span>
      </div>

      {/* right: Japanese */}
      <div className="la-word la-right" key={'r' + i}>
        <span className="la-jp">{p.jp}</span>
        <span className="la-sub la-sub-gold">{p.jr}</span>
      </div>

      <style>{`
        .la-field { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .la-glow { position: absolute; inset: 0;
          background:
            radial-gradient(40% 50% at 12% 28%, rgba(247,197,210,0.12), transparent 70%),
            radial-gradient(42% 55% at 88% 72%, rgba(216,184,120,0.10), transparent 70%),
            radial-gradient(60% 40% at 50% 0%, rgba(247,197,210,0.07), transparent 65%); }

        /* sakura petals */
        .la-petal { position: absolute; top: -6%;
          background: linear-gradient(135deg, #fbd7e0 0%, #f3a9bd 60%, #e88aa6 100%);
          border-radius: 150% 0 150% 0; opacity: 0; transform: rotate(0deg);
          box-shadow: 0 1px 4px rgba(232,138,166,0.3);
          animation: laFall var(--dur) linear var(--delay) infinite; }
        @keyframes laFall {
          0%   { transform: translateY(-6vh) translateX(0) rotate(0deg); opacity: 0; }
          12%  { opacity: 0.85; }
          88%  { opacity: 0.85; }
          100% { transform: translateY(108vh) translateX(var(--drift)) rotate(460deg); opacity: 0; }
        }

        /* side words */
        .la-word { position: absolute; top: 50%; transform: translateY(-50%);
          display: flex; flex-direction: column; max-width: 320px;
          animation: laReveal 900ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        /* Anchored a fixed gap from the centered card (≈210px half-width + gap),
           hugging inward toward the sign-in box. */
        .la-left  { right: calc(50% + 250px); align-items: flex-end;   text-align: right; }
        .la-right { left:  calc(50% + 250px); align-items: flex-start; text-align: left; }
        @keyframes laReveal {
          0%   { opacity: 0; transform: translateY(calc(-50% + 16px)); filter: blur(7px); }
          100% { opacity: 1; transform: translateY(-50%); filter: blur(0); }
        }
        .la-ta { font-family: 'Noto Serif Tamil', serif; font-weight: 700;
          font-size: clamp(34px, 4.2vw, 60px); line-height: 1.05; color: #fff;
          text-shadow: 0 4px 30px rgba(0,0,0,0.45); }
        .la-jp { font-family: 'Shippori Mincho', 'Noto Sans JP', serif; font-weight: 700;
          font-size: clamp(34px, 4.2vw, 60px); line-height: 1.05; color: #e7c98a;
          text-shadow: 0 4px 30px rgba(0,0,0,0.45); }
        .la-sub { margin-top: 8px; font-size: 12px; letter-spacing: .14em; text-transform: uppercase;
          color: rgba(255,255,255,0.42); font-family: Inter, sans-serif; }
        .la-sub-gold { color: rgba(231,201,138,0.6); }

        /* keep the form the focus on smaller screens (petals stay) */
        @media (max-width: 980px) { .la-word { display: none; } }
        @media (prefers-reduced-motion: reduce) {
          .la-petal { display: none; }
          .la-word { animation: none; }
        }
      `}</style>
    </div>
  )
}
