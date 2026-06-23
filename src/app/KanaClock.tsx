'use client'

import { useEffect, useState } from 'react'

// The 12 Tamil உயிர் எழுத்துக்கள் (vowels) paired with the Japanese kana they map to.
// Long Tamil vowels → doubled kana; diphthongs → kana combos. Genuinely educational.
export const PAIRS = [
  { tamil: 'அ', kana: 'あ',   romaji: 'a',  note: 'short a' },
  { tamil: 'ஆ', kana: 'ああ', romaji: 'ā',  note: 'long a' },
  { tamil: 'இ', kana: 'い',   romaji: 'i',  note: 'short i' },
  { tamil: 'ஈ', kana: 'いい', romaji: 'ī',  note: 'long i' },
  { tamil: 'உ', kana: 'う',   romaji: 'u',  note: 'short u' },
  { tamil: 'ஊ', kana: 'うう', romaji: 'ū',  note: 'long u' },
  { tamil: 'எ', kana: 'え',   romaji: 'e',  note: 'short e' },
  { tamil: 'ஏ', kana: 'ええ', romaji: 'ē',  note: 'long e' },
  { tamil: 'ஐ', kana: 'あい', romaji: 'ai', note: 'diphthong' },
  { tamil: 'ஒ', kana: 'お',   romaji: 'o',  note: 'short o' },
  { tamil: 'ஓ', kana: 'おお', romaji: 'ō',  note: 'long o' },
  { tamil: 'ஔ', kana: 'あう', romaji: 'au', note: 'diphthong' },
]

export default function KanaClock() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setIdx(i => (i + 1) % PAIRS.length), 1600)
    return () => clearInterval(t)
  }, [paused])

  const p = PAIRS[idx]
  const angle = idx * 30 // 360 / 12

  return (
    <div
      className="kc-wrap"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="img"
      aria-label={`Tamil vowel ${p.tamil} maps to Japanese ${p.kana} (${p.romaji})`}
    >
      <div className="kc-face">
        {/* faint tick ring */}
        <div className="kc-ring" />

        {/* 12 Tamil vowels around the dial */}
        {PAIRS.map((pair, i) => (
          <button
            key={pair.tamil}
            className={`kc-mark ${i === idx ? 'on' : ''}`}
            style={{ transform: `rotate(${i * 30}deg) translateY(calc(var(--kc-r) * -1)) rotate(${-i * 30}deg)` }}
            onClick={() => { setIdx(i); setPaused(true) }}
            aria-label={`${pair.tamil} — ${pair.romaji}`}
          >
            {pair.tamil}
          </button>
        ))}

        {/* ticking hand */}
        <div className="kc-hand" style={{ transform: `rotate(${angle}deg)` }}>
          <span className="kc-hand-line" />
          <span className="kc-hand-dot" />
        </div>

        {/* center 3D flip card — re-keyed each tick so the flip re-fires */}
        <div className="kc-stage">
          <div className="kc-card" key={idx}>
            <div className="kc-kana">{p.kana}</div>
            <div className="kc-bridge">
              <span className="kc-romaji">{p.romaji}</span>
            </div>
            <div className="kc-tamil">{p.tamil}</div>
          </div>
        </div>
      </div>

      <p className="kc-caption">
        <span>தமிழ் உயிர் எழுத்துக்கள்</span> ↔ <span>日本語の母音</span>
      </p>
    </div>
  )
}
