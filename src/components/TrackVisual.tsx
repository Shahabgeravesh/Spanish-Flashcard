/** Colorful mnemonic marks for hub tracks and exam sections. */

export type HubTrackId =
  | 'foundations'
  | 'grammar'
  | 'stories'
  | 'phrases'
  | 'daily'
  | 'verbs'
  | 'numbers'
  | 'colors'
  | 'exam'

export type ExamVisualId =
  | 'conjugations'
  | 'foundations'
  | 'grammar'
  | 'phrases'
  | 'daily'
  | 'numbers'
  | 'colors'
  | 'mixed'

type Props = {
  id: HubTrackId | ExamVisualId
  size?: 'hub' | 'sm'
  className?: string
}

const TONE: Record<string, string> = {
  foundations: 'track-tone-mint',
  grammar: 'track-tone-sand',
  stories: 'track-tone-sky',
  phrases: 'track-tone-rose',
  daily: 'track-tone-leaf',
  verbs: 'track-tone-lilac',
  numbers: 'track-tone-sun',
  colors: 'track-tone-pink',
  exam: 'track-tone-coral',
  conjugations: 'track-tone-lilac',
  mixed: 'track-tone-rainbow',
}

function Art({ id }: { id: string }) {
  const common = {
    viewBox: '0 0 64 64',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true as const,
  }

  switch (id) {
    case 'foundations':
      return (
        <svg {...common}>
          <path
            d="M10 34 32 14l22 20"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M18 32v18h28V32"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <rect x="28" y="40" width="8" height="10" fill="currentColor" opacity="0.35" />
        </svg>
      )
    case 'grammar':
      return (
        <svg {...common}>
          <path
            d="M16 12h20c8 0 14 5 14 12s-6 12-14 12H28v16"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 24h18"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'stories':
      return (
        <svg {...common}>
          <path
            d="M14 14h16c6 0 10 4 10 10v28c-4-3-8-4-10-4H14V14z"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path
            d="M50 14H34c-6 0-10 4-10 10v28c4-3 8-4 10-4h16V14z"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="28" r="2.5" fill="currentColor" />
          <circle cx="40" cy="28" r="2.5" fill="currentColor" />
        </svg>
      )
    case 'phrases':
      return (
        <svg {...common}>
          <path
            d="M12 22c0-6 8-10 20-10s20 4 20 10v6c0 6-8 10-20 10h-4L16 48v-8h-2c-1.5 0-2-1-2-2v-16z"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path
            d="M24 26h16M24 34h10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'daily':
      return (
        <svg {...common}>
          <circle
            cx="32"
            cy="32"
            r="18"
            stroke="currentColor"
            strokeWidth="3.2"
          />
          <path
            d="M32 18v14l10 6"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'verbs':
    case 'conjugations':
      return (
        <svg {...common}>
          <path
            d="M18 44c4-14 10-22 14-26 4 4 10 12 14 26"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M22 36h20M26 28h12"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="32" cy="48" r="3" fill="currentColor" />
        </svg>
      )
    case 'numbers':
      return (
        <svg {...common}>
          <circle cx="20" cy="22" r="6" fill="#f59e0b" />
          <circle cx="44" cy="22" r="6" fill="#22c55e" />
          <circle cx="20" cy="44" r="6" fill="#3b82f6" />
          <circle cx="44" cy="44" r="6" fill="#ec4899" />
          <circle cx="32" cy="33" r="5" fill="#8b5cf6" />
        </svg>
      )
    case 'colors':
      return (
        <svg {...common}>
          <circle cx="24" cy="28" r="12" fill="#f43f5e" opacity="0.9" />
          <circle cx="40" cy="28" r="12" fill="#3b82f6" opacity="0.9" />
          <circle cx="32" cy="40" r="12" fill="#22c55e" opacity="0.9" />
        </svg>
      )
    case 'exam':
      return (
        <svg {...common}>
          <rect
            x="14"
            y="12"
            width="36"
            height="44"
            rx="6"
            stroke="currentColor"
            strokeWidth="3.2"
          />
          <path
            d="M24 26h16M24 36h16M24 46h10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="44" cy="46" r="5" fill="#22c55e" />
        </svg>
      )
    case 'mixed':
      return (
        <svg {...common}>
          <path
            d="M32 10 38 26h16l-13 10 5 16-14-10-14 10 5-16-13-10h16z"
            fill="#fbbf24"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="16" fill="currentColor" opacity="0.35" />
        </svg>
      )
  }
}

export function TrackVisual({ id, size = 'hub', className = '' }: Props) {
  const tone = TONE[id] ?? 'track-tone-sky'

  return (
    <div
      className={`track-visual track-visual-${size} ${tone} ${className}`.trim()}
      aria-hidden="true"
    >
      <span className="track-visual-blob track-visual-blob-a" />
      <span className="track-visual-blob track-visual-blob-b" />
      <span className="track-visual-spark" />
      <div className="track-visual-icon">
        <Art id={id} />
      </div>
    </div>
  )
}
