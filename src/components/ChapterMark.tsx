/** Tiny colorful mark so chapter rows are easier to remember. */

import type { CSSProperties } from 'react'

type Props = {
  seed: string
  label?: string
  className?: string
}

const PALETTE = [
  ['#f43f5e', '#fda4af'],
  ['#f59e0b', '#fde047'],
  ['#10b981', '#6ee7b7'],
  ['#3b82f6', '#93c5fd'],
  ['#8b5cf6', '#c4b5fd'],
  ['#ec4899', '#f9a8d4'],
  ['#06b6d4', '#67e8f9'],
  ['#ea580c', '#fdba74'],
] as const

function hashSeed(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return h
}

export function ChapterMark({ seed, label, className = '' }: Props) {
  const i = hashSeed(seed) % PALETTE.length
  const [ink, wash] = PALETTE[i]
  const letter = (label ?? seed).trim().charAt(0).toUpperCase() || '·'

  return (
    <span
      className={`chapter-mark ${className}`.trim()}
      style={
        {
          '--mark-ink': ink,
          '--mark-wash': wash,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <span className="chapter-mark-blob" />
      <span className="chapter-mark-letter">{letter}</span>
    </span>
  )
}
