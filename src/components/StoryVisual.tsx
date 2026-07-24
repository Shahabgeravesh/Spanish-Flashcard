import type { ReactNode } from 'react'

export type StoryScene =
  | 'home'
  | 'cafe'
  | 'shop'
  | 'market'
  | 'hotel'
  | 'train'
  | 'doctor'
  | 'restaurant'
  | 'city'
  | 'evening'
  | 'phone'
  | 'museum'
  | 'party'
  | 'beach'
  | 'rain'
  | 'packing'
  | 'plaza'
  | 'morning'
  | 'kitchen'
  | 'park'
  | 'letters'
  | 'stars'

const SCENE_TONE: Record<StoryScene, string> = {
  home: 'story-scene-warm',
  cafe: 'story-scene-cream',
  shop: 'story-scene-rose',
  market: 'story-scene-sun',
  hotel: 'story-scene-lilac',
  train: 'story-scene-sky',
  doctor: 'story-scene-mint',
  restaurant: 'story-scene-coral',
  city: 'story-scene-sky',
  evening: 'story-scene-indigo',
  phone: 'story-scene-warm',
  museum: 'story-scene-sand',
  party: 'story-scene-rose',
  beach: 'story-scene-aqua',
  rain: 'story-scene-sky',
  packing: 'story-scene-sand',
  plaza: 'story-scene-sun',
  morning: 'story-scene-cream',
  kitchen: 'story-scene-warm',
  park: 'story-scene-mint',
  letters: 'story-scene-lilac',
  stars: 'story-scene-indigo',
}

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 160 100" fill="none" aria-hidden="true">
      {children}
    </svg>
  )
}

/** Filled, colorful scene art for storybook memory. */
function SceneArt({ scene }: { scene: StoryScene }) {
  switch (scene) {
    case 'home':
      return (
        <Svg>
          <circle className="story-fill-soft" cx="122" cy="26" r="14" />
          <path
            className="story-fill-main"
            d="M22 78V50l38-26 38 26v28H22z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            className="story-fill-accent"
            d="M58 78V56h24v22"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </Svg>
      )
    case 'cafe':
      return (
        <Svg>
          <ellipse className="story-fill-soft" cx="80" cy="82" rx="44" ry="8" />
          <path
            className="story-fill-main"
            d="M48 36h50v30a18 18 0 0 1-18 18H66a18 18 0 0 1-18-18V36z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            className="story-fill-accent"
            d="M98 44h12a14 14 0 0 1 0 28H98"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            d="M62 22c5 6 5 10 0 16M78 20c5 6 5 10 0 16"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </Svg>
      )
    case 'shop':
      return (
        <Svg>
          <circle className="story-fill-soft" cx="128" cy="24" r="12" />
          <path
            className="story-fill-main"
            d="M34 38h92l-10 46H44L34 38z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M56 38v-12a24 24 0 0 1 48 0v12"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <circle className="story-fill-accent" cx="68" cy="62" r="6" />
          <circle className="story-fill-accent" cx="92" cy="62" r="6" />
        </Svg>
      )
    case 'market':
      return (
        <Svg>
          <path className="story-fill-soft" d="M20 78h120v8H20z" />
          <path
            className="story-fill-main"
            d="M38 78V44l22-16 22 16v34"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            className="story-fill-accent"
            d="M82 78V48l20-14 20 14v30"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle cx="52" cy="56" r="7" fill="#f43f5e" />
          <circle cx="98" cy="58" r="7" fill="#eab308" />
        </Svg>
      )
    case 'hotel':
      return (
        <Svg>
          <rect
            className="story-fill-main"
            x="42"
            y="24"
            width="76"
            height="54"
            rx="6"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            className="story-fill-accent"
            d="M56 78V52h22v26"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <rect className="story-fill-soft" x="92" y="36" width="16" height="12" rx="2" />
          <rect className="story-fill-soft" x="92" y="54" width="16" height="12" rx="2" />
        </Svg>
      )
    case 'train':
      return (
        <Svg>
          <rect
            className="story-fill-main"
            x="28"
            y="32"
            width="104"
            height="36"
            rx="12"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <circle className="story-fill-accent" cx="52" cy="78" r="10" />
          <circle className="story-fill-accent" cx="108" cy="78" r="10" />
          <rect className="story-fill-soft" x="46" y="42" width="24" height="14" rx="3" />
          <rect className="story-fill-soft" x="90" y="42" width="24" height="14" rx="3" />
        </Svg>
      )
    case 'doctor':
      return (
        <Svg>
          <rect
            className="story-fill-main"
            x="46"
            y="20"
            width="68"
            height="58"
            rx="10"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            className="story-fill-accent"
            d="M72 34h16v14h14v16H88v14H72V64H58V48h14V34z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </Svg>
      )
    case 'restaurant':
      return (
        <Svg>
          <ellipse className="story-fill-soft" cx="80" cy="84" rx="48" ry="7" />
          <path
            className="story-fill-main"
            d="M48 20v40c0 12 8 18 22 18s22-6 22-18V20"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M70 60v24M52 84h36"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            className="story-fill-accent"
            d="M108 22c12 4 16 16 12 28"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </Svg>
      )
    case 'city':
      return (
        <Svg>
          <circle className="story-fill-soft" cx="128" cy="22" r="12" />
          <path
            className="story-fill-main"
            d="M26 82V42h30v40"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            className="story-fill-accent"
            d="M56 82V24h34v58"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            className="story-fill-main"
            d="M90 82V48h30v34"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path d="M34 52h14M66 40h14M100 58h12" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </Svg>
      )
    case 'evening':
    case 'stars':
      return (
        <Svg>
          <circle className="story-fill-soft" cx="122" cy="28" r="16" />
          <path
            className="story-fill-main"
            d="M18 78c24-14 40-30 62-30s40 16 62 30"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            className="story-fill-accent"
            d="M48 30l3 8 8 1.5-6.5 5.5 2 8.5-6.5-4-6.5 4 2-8.5-6.5-5.5 8-1.5 3-8z"
          />
          <path
            className="story-fill-accent"
            d="M78 22l2 5.5 5.5 1-4.5 3.8 1.2 5.7-4.2-2.8-4.2 2.8 1.2-5.7-4.5-3.8 5.5-1L78 22z"
          />
        </Svg>
      )
    case 'phone':
      return (
        <Svg>
          <rect
            className="story-fill-main"
            x="56"
            y="14"
            width="48"
            height="72"
            rx="10"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <rect className="story-fill-soft" x="64" y="26" width="32" height="40" rx="4" />
          <circle className="story-fill-accent" cx="80" cy="76" r="5" />
        </Svg>
      )
    case 'museum':
      return (
        <Svg>
          <path
            className="story-fill-main"
            d="M28 82V50l52-28 52 28v32"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path className="story-fill-accent" d="M28 50h104" stroke="currentColor" strokeWidth="2.5" />
          <path
            className="story-fill-soft"
            d="M48 82V58h22v24M90 82V58h22v24"
            stroke="currentColor"
            strokeWidth="2.5"
          />
        </Svg>
      )
    case 'party':
      return (
        <Svg>
          <path
            className="story-fill-main"
            d="M38 82c10-32 22-48 42-48s32 16 42 48"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            className="story-fill-accent"
            d="M80 34V16M66 26l14 10 14-10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="48" cy="48" r="5" fill="#f43f5e" />
          <circle cx="112" cy="50" r="5" fill="#3b82f6" />
          <circle cx="80" cy="44" r="5" fill="#eab308" />
        </Svg>
      )
    case 'beach':
      return (
        <Svg>
          <circle className="story-fill-accent" cx="120" cy="28" r="16" />
          <path
            className="story-fill-main"
            d="M16 70c34-18 58-18 92 0 18 10 28 10 36 0"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            className="story-fill-soft"
            d="M16 78h128"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path d="M46 70V48M38 56h16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </Svg>
      )
    case 'rain':
      return (
        <Svg>
          <path
            className="story-fill-main"
            d="M42 46h66a20 20 0 0 0-2-36 24 24 0 0 0-46 12A18 18 0 0 0 42 46z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M54 58v18M74 54v22M94 58v18" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
        </Svg>
      )
    case 'packing':
      return (
        <Svg>
          <rect
            className="story-fill-main"
            x="38"
            y="38"
            width="84"
            height="42"
            rx="8"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            d="M56 38v-12a26 26 0 0 1 48 0v12"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path className="story-fill-accent" d="M38 56h84" stroke="currentColor" strokeWidth="2.5" />
        </Svg>
      )
    case 'plaza':
      return (
        <Svg>
          <circle className="story-fill-main" cx="80" cy="46" r="20" stroke="currentColor" strokeWidth="2.5" />
          <circle className="story-fill-accent" cx="80" cy="46" r="8" />
          <path d="M80 26v40M60 46h40M24 82h112" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path className="story-fill-soft" d="M44 82V62M116 82V62" stroke="currentColor" strokeWidth="3" />
        </Svg>
      )
    case 'morning':
      return (
        <Svg>
          <circle className="story-fill-accent" cx="122" cy="28" r="16" />
          <path className="story-fill-soft" d="M20 78h90" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
          <path
            className="story-fill-main"
            d="M38 78V50l20-14 20 14v28"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path className="story-fill-accent" d="M50 78V60h16v18" stroke="currentColor" strokeWidth="2.5" />
        </Svg>
      )
    case 'kitchen':
      return (
        <Svg>
          <rect
            className="story-fill-main"
            x="32"
            y="40"
            width="96"
            height="40"
            rx="6"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            className="story-fill-accent"
            d="M46 40V28h30v12"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <rect className="story-fill-soft" x="92" y="52" width="24" height="16" rx="3" />
          <circle cx="56" cy="58" r="5" fill="#f97316" />
        </Svg>
      )
    case 'park':
      return (
        <Svg>
          <circle className="story-fill-soft" cx="124" cy="24" r="12" />
          <path d="M80 82V50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <path
            className="story-fill-main"
            d="M80 54c-20-2-32-16-32-30 16 2 28 12 32 30 4-18 16-28 32-30 0 14-12 28-32 30z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path className="story-fill-accent" d="M24 82h112" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        </Svg>
      )
    case 'letters':
      return (
        <Svg>
          <rect
            className="story-fill-main"
            x="36"
            y="26"
            width="88"
            height="52"
            rx="8"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            className="story-fill-accent"
            d="M36 32l44 30 44-30"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </Svg>
      )
    default:
      return (
        <Svg>
          <circle className="story-fill-main" cx="80" cy="50" r="26" />
        </Svg>
      )
  }
}

type Props = {
  scene: StoryScene
  title?: string
  className?: string
  size?: 'hero' | 'thumb'
}

/** Storybook illustration for a nightly page. */
export function StoryVisual({
  scene,
  title,
  className = '',
  size = 'hero',
}: Props) {
  return (
    <figure
      className={`story-visual ${SCENE_TONE[scene]} story-visual-${size} ${className}`.trim()}
      aria-hidden={title ? undefined : true}
    >
      <div className="story-visual-glow" />
      <div className="story-visual-glow story-visual-glow-b" />
      <div className="story-visual-art">
        <SceneArt scene={scene} />
      </div>
      {title ? <figcaption className="sr-only">{title}</figcaption> : null}
    </figure>
  )
}
