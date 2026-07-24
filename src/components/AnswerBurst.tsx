import { useCallback, useEffect, useState, type CSSProperties } from 'react'

export type FeedbackKind = 'correct' | 'incorrect' | null

type Burst = {
  id: number
  kind: 'correct' | 'incorrect'
  learned?: boolean
}

const CORRECT_PHRASES = ['Nice!', 'Yes!', 'Nailed it', 'Boom', 'Perfect']
const LEARNED_PHRASES = ['Learned!', 'In the bin!', 'Mastered']
const MISS_PHRASES = ['Almost', 'Try again', 'Keep going', 'No sweat']

function playTone(kind: 'correct' | 'incorrect' | 'learned') {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const now = ctx.currentTime

    const beep = (freq: number, start: number, dur: number, type: OscillatorType, gain = 0.05) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = type
      osc.frequency.value = freq
      g.gain.setValueAtTime(gain, now + start)
      g.gain.exponentialRampToValueAtTime(0.001, now + start + dur)
      osc.connect(g)
      g.connect(ctx.destination)
      osc.start(now + start)
      osc.stop(now + start + dur)
    }

    if (kind === 'correct') {
      beep(523.25, 0, 0.12, 'triangle')
      beep(659.25, 0.08, 0.14, 'triangle')
    } else if (kind === 'learned') {
      beep(523.25, 0, 0.1, 'sine')
      beep(659.25, 0.09, 0.1, 'sine')
      beep(783.99, 0.18, 0.18, 'sine', 0.06)
    } else {
      beep(220, 0, 0.16, 'sawtooth', 0.035)
      beep(185, 0.1, 0.18, 'sawtooth', 0.03)
    }

    window.setTimeout(() => void ctx.close(), 600)
  } catch {
    // ignore audio failures
  }
}

export function useAnswerFeedback() {
  const [burst, setBurst] = useState<Burst | null>(null)

  const trigger = useCallback(
    (kind: 'correct' | 'incorrect', opts?: { learned?: boolean }) => {
      const id = Date.now()
      setBurst({ id, kind, learned: opts?.learned })
      playTone(opts?.learned ? 'learned' : kind)
    },
    [],
  )

  useEffect(() => {
    if (!burst) return
    const t = window.setTimeout(() => setBurst(null), 900)
    return () => window.clearTimeout(t)
  }, [burst])

  return { burst, trigger }
}

export function AnswerBurst({ burst }: { burst: Burst | null }) {
  if (!burst) return null

  const phrasePool =
    burst.kind === 'incorrect'
      ? MISS_PHRASES
      : burst.learned
        ? LEARNED_PHRASES
        : CORRECT_PHRASES
  const phrase = phrasePool[burst.id % phrasePool.length]

  return (
    <div
      className={`answer-burst answer-burst--${burst.kind}${burst.learned ? ' is-learned' : ''}`}
      aria-live="polite"
    >
      <div className="answer-burst__flash" />
      <div className="answer-burst__badge">
        <span className="answer-burst__icon" aria-hidden="true">
          {burst.kind === 'correct' ? (burst.learned ? '★' : '✓') : '↻'}
        </span>
        <span className="answer-burst__text">{phrase}</span>
      </div>
      <div className="answer-burst__bits" aria-hidden="true">
        {Array.from({ length: burst.kind === 'correct' ? 14 : 8 }, (_, i) => (
          <span
            key={i}
            className="answer-burst__bit"
            style={
              {
                '--i': i,
                '--x': `${(i % 7) * 14 - 42}%`,
                '--y': `${Math.floor(i / 7) * 18 - 10}%`,
                '--rot': `${i * 28}deg`,
                '--hue': burst.kind === 'correct' ? 140 + i * 12 : 8 + i * 6,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}
