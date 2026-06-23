'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

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

// Japanese-flavoured major pentatonic scale (no semitones → always pleasant).
// The 12 vowels climb the scale across octaves, so cycling plays a little melody.
const SCALE = [0, 2, 4, 7, 9]
const freqForStep = (i: number) => {
  const base = 233.08 // ~Bb3, warm koto register
  const semis = SCALE[i % SCALE.length] + 12 * Math.floor(i / SCALE.length)
  return base * Math.pow(2, semis / 12)
}

export default function KanaClock() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const [sound, setSound] = useState(false)

  const audioRef = useRef<AudioContext | null>(null)
  const soundRef = useRef(false)
  soundRef.current = sound
  const firstRef = useRef(true)

  // A soft, clean music-box / marimba pluck: pure sine partials, each with its
  // own decay (higher partials fade faster, like a real struck string). No buzz.
  function pluck(i: number) {
    const ctx = audioRef.current
    if (!ctx) return
    const t = ctx.currentTime
    const freq = freqForStep(i)

    // Gentle master, with a soft lowpass to keep everything mellow.
    const master = ctx.createGain()
    master.gain.value = 1
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 5000
    lp.connect(master)
    master.connect(ctx.destination)

    // partial: [harmonic ratio, peak gain, decay seconds]
    const partials: [number, number, number][] = [
      [1, 0.34, 1.9],   // fundamental — long, warm
      [2, 0.14, 1.1],   // octave — adds shimmer, fades sooner
      [3, 0.05, 0.6],   // soft sparkle on the attack
    ]
    for (const [ratio, peak, decay] of partials) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq * ratio
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(peak, t + 0.018) // soft attack, no click
      g.gain.exponentialRampToValueAtTime(0.0001, t + decay)
      osc.connect(g); g.connect(lp)
      osc.start(t); osc.stop(t + decay + 0.1)
    }
  }

  // Advance one vowel per beat.
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setIdx(i => (i + 1) % PAIRS.length), 1600)
    return () => clearInterval(t)
  }, [paused])

  // Play on each tick, but never on the very first render (avoids a blast on enable).
  useEffect(() => {
    if (firstRef.current) { firstRef.current = false; return }
    if (soundRef.current) pluck(idx)
  }, [idx])

  async function toggleSound() {
    if (!sound) {
      // First enable creates / resumes the AudioContext within the user gesture.
      try {
        if (!audioRef.current) {
          const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
          audioRef.current = new AC()
        }
        await audioRef.current.resume()
        pluck(idx) // immediate confirmation chime
      } catch { /* ignore */ }
      setSound(true)
    } else {
      setSound(false)
    }
  }

  const p = PAIRS[idx]
  const angle = idx * 30 // 360 / 12

  return (
    <div
      className="kc-wrap"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="kc-face"
        role="img"
        aria-label={`Tamil vowel ${p.tamil} maps to Japanese ${p.kana} (${p.romaji})`}
      >
        <div className="kc-ring" />

        {PAIRS.map((pair, i) => (
          <button
            key={pair.tamil}
            className={`kc-mark ${i === idx ? 'on' : ''}`}
            style={{ transform: `rotate(${i * 30}deg) translateY(calc(var(--kc-r) * -1)) rotate(${-i * 30}deg)` }}
            onClick={() => { setIdx(i); setPaused(true); if (soundRef.current) pluck(i) }}
            aria-label={`${pair.tamil} — ${pair.romaji}`}
          >
            {pair.tamil}
          </button>
        ))}

        <div className="kc-hand" style={{ transform: `rotate(${angle}deg)` }}>
          <span className="kc-hand-line" />
          <span className="kc-hand-dot" />
        </div>

        <div className="kc-stage">
          <div className="kc-card" key={idx}>
            <div className="kc-kana">{p.kana}</div>
            <div className="kc-bridge"><span className="kc-romaji">{p.romaji}</span></div>
            <div className="kc-tamil">{p.tamil}</div>
          </div>
        </div>
      </div>

      <div className="kc-footer">
        <p className="kc-caption">
          <span>தமிழ் உயிர் எழுத்துக்கள்</span> ↔ <span>日本語の母音</span>
        </p>
        <button
          className={`kc-sound ${sound ? 'on' : ''}`}
          onClick={toggleSound}
          aria-pressed={sound}
          aria-label={sound ? 'Turn tick sound off' : 'Turn tick sound on'}
        >
          {sound ? <Volume2 size={15} /> : <VolumeX size={15} />}
          {sound ? 'Sound on' : 'Play sound'}
        </button>
      </div>
    </div>
  )
}
