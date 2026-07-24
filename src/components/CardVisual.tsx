import {
  resolveCardVisual,
  type VisualHints,
  type VisualKey,
  type VisualTone,
} from '../lib/cardVisuals'

type Props = VisualHints & {
  /** Smaller mark for tight verb cards */
  size?: 'md' | 'sm'
  className?: string
}

const TONE_CLASS: Record<VisualTone, string> = {
  sky: 'viz-tone-sky',
  mint: 'viz-tone-mint',
  sun: 'viz-tone-sun',
  rose: 'viz-tone-rose',
  lilac: 'viz-tone-lilac',
  sand: 'viz-tone-sand',
  ink: 'viz-tone-ink',
  coral: 'viz-tone-coral',
}

function Icon({ name }: { name: VisualKey }) {
  const common = {
    viewBox: '0 0 64 64',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true as const,
  }

  switch (name) {
    case 'speak':
      return (
        <svg {...common}>
          <path
            d="M12 40V24c0-8 8-14 20-14s20 6 20 14v8c0 8-8 14-20 14h-4L16 54v-8h-2c-1 0-2-1-2-2z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="26" cy="30" r="2.5" fill="currentColor" />
          <circle cx="34" cy="30" r="2.5" fill="currentColor" />
          <circle cx="42" cy="30" r="2.5" fill="currentColor" />
        </svg>
      )
    case 'eat':
    case 'food':
      return (
        <svg {...common}>
          <path
            d="M20 10v20c0 6 4 10 12 10s12-4 12-10V10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M32 40v14M22 54h20"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M44 12c6 2 8 8 6 14M48 14c4 2 5 7 3 11"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'live':
      return (
        <svg {...common}>
          <path
            d="M10 30 32 12l22 18"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M18 28v24h28V28"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M28 52V36h8v16"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'identity':
      return (
        <svg {...common}>
          <circle cx="32" cy="22" r="10" stroke="currentColor" strokeWidth="3" />
          <path
            d="M14 52c4-12 12-16 18-16s14 4 18 16"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'location':
      return (
        <svg {...common}>
          <path
            d="M32 56s16-16 16-28a16 16 0 1 0-32 0c0 12 16 28 16 28z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="26" r="5" stroke="currentColor" strokeWidth="3" />
        </svg>
      )
    case 'have':
      return (
        <svg {...common}>
          <rect
            x="12"
            y="20"
            width="40"
            height="28"
            rx="6"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M12 30h40M22 20v-4a10 10 0 0 1 20 0v4"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'go':
    case 'travel':
      return (
        <svg {...common}>
          <path
            d="M12 40c8-2 14-10 20-10s12 8 20 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M18 28 32 14l14 14M32 14v30"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'make':
      return (
        <svg {...common}>
          <path
            d="M20 44 40 12l8 4-20 32-10 2 2-6z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M36 16l8 4M18 48l6-2"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'want':
    case 'gustar':
    case 'polite':
      return (
        <svg {...common}>
          <path
            d="M32 52s-18-11-18-24a10 10 0 0 1 18-6 10 10 0 0 1 18 6c0 13-18 24-18 24z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'can':
    case 'request':
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="3" />
          <path
            d="M22 33l7 7 14-16"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'say':
      return (
        <svg {...common}>
          <path
            d="M14 18h28a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H28l-10 8v-8h-4a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'come':
      return (
        <svg {...common}>
          <path
            d="M32 12v28M22 30l10 10 10-10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 50h36"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'give':
      return (
        <svg {...common}>
          <path
            d="M18 28h12l4-8 4 8h12v8H18v-8z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M24 36v12h16V36"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'see':
      return (
        <svg {...common}>
          <path
            d="M8 32s10-14 24-14 24 14 24 14-10 14-24 14S8 32 8 32z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="32" r="7" stroke="currentColor" strokeWidth="3" />
        </svg>
      )
    case 'know-fact':
      return (
        <svg {...common}>
          <path
            d="M18 16h28v36l-6-4-8 4-8-4-6 4V16z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M26 28h12M26 36h12"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'put':
      return (
        <svg {...common}>
          <rect
            x="14"
            y="34"
            width="36"
            height="14"
            rx="3"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M32 12v18M24 22l8 8 8-8"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'leave':
      return (
        <svg {...common}>
          <path
            d="M14 12h20v40H14"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M28 32h24M42 22l10 10-10 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'bring':
      return (
        <svg {...common}>
          <path
            d="M16 28h32l-4 24H20l-4-24z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M24 28v-6a8 8 0 0 1 16 0v6"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
      )
    case 'hear':
      return (
        <svg {...common}>
          <path
            d="M18 28a14 14 0 0 1 28 0"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M12 34a22 22 0 0 1 40 0"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="32" cy="42" r="4" fill="currentColor" />
        </svg>
      )
    case 'know-people':
    case 'family':
      return (
        <svg {...common}>
          <circle cx="22" cy="20" r="7" stroke="currentColor" strokeWidth="3" />
          <circle cx="42" cy="20" r="7" stroke="currentColor" strokeWidth="3" />
          <path
            d="M8 50c2-10 8-14 14-14s12 4 14 14M28 50c2-10 8-14 14-14s12 4 14 14"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'calendar':
    case 'time':
      return (
        <svg {...common}>
          <rect
            x="12"
            y="16"
            width="40"
            height="36"
            rx="6"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M12 28h40M22 12v8M42 12v8"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="24" cy="38" r="2.5" fill="currentColor" />
          <circle cx="32" cy="38" r="2.5" fill="currentColor" />
          <circle cx="40" cy="38" r="2.5" fill="currentColor" />
        </svg>
      )
    case 'weather':
      return (
        <svg {...common}>
          <circle cx="40" cy="22" r="8" stroke="currentColor" strokeWidth="3" />
          <path
            d="M18 42h26a10 10 0 0 0-1-20 12 12 0 0 0-23 6A8 8 0 0 0 18 42z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'body':
      return (
        <svg {...common}>
          <circle cx="32" cy="14" r="6" stroke="currentColor" strokeWidth="3" />
          <path
            d="M32 20v18M20 28h24M24 54l8-16 8 16"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'clothes':
      return (
        <svg {...common}>
          <path
            d="M22 14 32 20l10-6 8 8-6 4v24H20V26l-6-4 8-8z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'place':
    case 'hotel':
      return (
        <svg {...common}>
          <path
            d="M12 52V24l20-12 20 12v28"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M26 52V34h12v18"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'question':
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="3" />
          <path
            d="M24 26c1-6 5-8 8-8s7 3 7 7-4 6-7 8v4"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="32" cy="46" r="2.5" fill="currentColor" />
        </svg>
      )
    case 'article':
    case 'gender':
      return (
        <svg {...common}>
          <circle cx="24" cy="28" r="10" stroke="currentColor" strokeWidth="3" />
          <circle cx="40" cy="36" r="10" stroke="currentColor" strokeWidth="3" />
          <path
            d="M20 48h8M36 20h8"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'por-para':
      return (
        <svg {...common}>
          <path
            d="M12 32h16M36 32h16"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M22 22 12 32l10 10M42 22l10 10-10 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'preposition':
      return (
        <svg {...common}>
          <circle cx="18" cy="32" r="8" stroke="currentColor" strokeWidth="3" />
          <circle cx="46" cy="32" r="8" stroke="currentColor" strokeWidth="3" />
          <path
            d="M26 32h12"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'pronoun':
    case 'reflexive':
      return (
        <svg {...common}>
          <circle cx="32" cy="20" r="8" stroke="currentColor" strokeWidth="3" />
          <path
            d="M16 50c3-12 10-16 16-16s13 4 16 16"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M44 18a12 12 0 1 1-8-8"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'negation':
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="3" />
          <path
            d="M20 20 44 44"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'compare':
      return (
        <svg {...common}>
          <path
            d="M14 44V28h12v16M28 44V18h12v26M42 44V34h12v10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'point':
      return (
        <svg {...common}>
          <circle cx="20" cy="32" r="6" stroke="currentColor" strokeWidth="3" />
          <circle cx="36" cy="32" r="4" stroke="currentColor" strokeWidth="3" />
          <circle cx="48" cy="32" r="2.5" fill="currentColor" />
          <path
            d="M26 32h6M40 32h5"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'possess':
      return (
        <svg {...common}>
          <path
            d="M18 28h28v24H18z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M26 28v-6a6 6 0 0 1 12 0v6"
            stroke="currentColor"
            strokeWidth="3"
          />
          <circle cx="32" cy="40" r="3" fill="currentColor" />
        </svg>
      )
    case 'past-split':
      return (
        <svg {...common}>
          <path
            d="M12 32h40"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M20 20h8v24h-8zM36 28h8v16h-8z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'command':
      return (
        <svg {...common}>
          <path
            d="M18 14h20l8 10v26H18V14z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M28 30h12M28 38h8"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'cafe':
      return (
        <svg {...common}>
          <path
            d="M16 24h28v16a10 10 0 0 1-10 10H26a10 10 0 0 1-10-10V24z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M44 28h4a6 6 0 0 1 0 12h-4M24 14c2 3 2 5 0 8M32 14c2 3 2 5 0 8"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'health':
      return (
        <svg {...common}>
          <path
            d="M28 12h8v16h16v8H36v16h-8V36H12v-8h16V12z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'shop':
      return (
        <svg {...common}>
          <path
            d="M16 24h32l-3 28H19L16 24z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M24 24v-6a8 8 0 0 1 16 0v6"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
      )
    case 'number':
      return (
        <svg {...common}>
          <rect
            x="12"
            y="12"
            width="40"
            height="40"
            rx="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M24 40V24l-4 4M34 24v16M30 40h8"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'color':
      return (
        <svg {...common}>
          <circle cx="24" cy="26" r="10" stroke="currentColor" strokeWidth="3" />
          <circle cx="40" cy="26" r="10" stroke="currentColor" strokeWidth="3" />
          <circle cx="32" cy="40" r="10" stroke="currentColor" strokeWidth="3" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <path
            d="M18 40c0-12 6-20 14-20s14 8 14 20"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="32" cy="18" r="6" stroke="currentColor" strokeWidth="3" />
          <path
            d="M20 48h24"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )
  }
}

function NumberDots({ value }: { value: number }) {
  const n = Math.max(0, Math.min(12, Math.floor(value)))
  if (n === 0 || value > 12) return <Icon name="number" />
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const cols = n <= 4 ? 2 : n <= 9 ? 3 : 4
        const col = i % cols
        const row = Math.floor(i / cols)
        const gap = 64 / (cols + 1)
        const rows = Math.ceil(n / cols)
        const yGap = 64 / (rows + 1)
        return (
          <circle
            key={i}
            cx={gap * (col + 1)}
            cy={yGap * (row + 1)}
            r="5"
            fill="currentColor"
          />
        )
      })}
    </svg>
  )
}

/** Mnemonic illustration for a flashcard face — flips with the card. */
export function CardVisual({
  size = 'md',
  className = '',
  ...hints
}: Props) {
  const { key, tone } = resolveCardVisual(hints)

  return (
    <div
      className={`card-visual ${TONE_CLASS[tone]} card-visual-${size}${hints.swatch ? ' card-visual-swatch-wrap' : ''} ${className}`.trim()}
      aria-hidden="true"
    >
      <div className="card-visual-blob" />
      <div className="card-visual-icon">
        {hints.swatch ? (
          <span
            className="card-visual-swatch"
            style={{
              background: hints.swatch,
              boxShadow:
                hints.swatch === '#f8fafc' || hints.swatch === '#fce7f3'
                  ? 'inset 0 0 0 1px rgba(28, 25, 23, 0.18)'
                  : undefined,
            }}
          />
        ) : key === 'number' && hints.value != null ? (
          <NumberDots value={hints.value} />
        ) : (
          <Icon name={key} />
        )}
      </div>
    </div>
  )
}
