import { useId, type ReactNode } from 'react'

/** Shared palette keys used for story atmosphere (kept for CSS tones). */
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

type Props = {
  scene: StoryScene
  /** Unique illustration key — each nightly story gets its own art */
  night: number
  title?: string
  className?: string
  size?: 'hero' | 'thumb'
}

function Frame({ uid, children }: { uid: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 360 200" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-skyDusk`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="45%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id={`${uid}-skyDay`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#bfdbfe" />
        </linearGradient>
        <linearGradient id={`${uid}-skyNight`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
        <linearGradient id={`${uid}-sun`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id={`${uid}-warm`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id={`${uid}-wood`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <linearGradient id={`${uid}-mint`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id={`${uid}-rose`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
        <linearGradient id={`${uid}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id={`${uid}-grass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id={`${uid}-lilac`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <radialGradient id={`${uid}-lamp`} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-glow`} cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#fff7ed" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {children}
    </svg>
  )
}

function Person({
  x,
  y,
  shirt,
  hair = '#292524',
  scale = 1,
  flip = false,
}: {
  x: number
  y: number
  shirt: string
  hair?: string
  scale?: number
  flip?: boolean
}) {
  const t = `translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`
  return (
    <g transform={t}>
      <circle cx={0} cy={-36} r={11} fill="#f5d0b0" />
      <path
        d="M-11 -40 Q0 -52 11 -38 Q4 -32 0 -34 Q-7 -32 -11 -40Z"
        fill={hair}
      />
      <circle cx={-3.5} cy={-36} r={1.3} fill="#1c1917" />
      <circle cx={3.5} cy={-36} r={1.3} fill="#1c1917" />
      <path
        d="M-2.5 -30.5 Q0 -28 2.5 -30.5"
        stroke="#b45309"
        strokeWidth={1.1}
        strokeLinecap="round"
        fill="none"
      />
      <path d="M-13 -22 Q0 -27 13 -22 L16 10 Q0 16 -16 10 Z" fill={shirt} />
      <path d="M-7 10 L-9 34 L-1 34 L2 12 Z" fill="#1e3a8a" />
      <path d="M7 10 L9 34 L1 34 L-2 12 Z" fill="#1e3a8a" />
      <path d="M-9 34 h8 v3.5 h-8z M1 34 h8 v3.5 h-8z" fill="#44403c" />
      <path
        d="M-13 -16 Q-26 -6 -22 8"
        stroke={shirt}
        strokeWidth={6.5}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M13 -16 Q26 -6 22 8"
        stroke={shirt}
        strokeWidth={6.5}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  )
}

function WindowPane({
  x,
  y,
  w,
  h,
  night = false,
}: {
  x: number
  y: number
  w: number
  h: number
  night?: boolean
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        fill={night ? '#1e3a8a' : '#bae6fd'}
        stroke="#78716c"
        strokeWidth={3}
      />
      <line
        x1={x + w / 2}
        y1={y}
        x2={x + w / 2}
        y2={y + h}
        stroke="#a8a29e"
        strokeWidth={2}
      />
      <line
        x1={x}
        y1={y + h / 2}
        x2={x + w}
        y2={y + h / 2}
        stroke="#a8a29e"
        strokeWidth={2}
      />
      <rect
        x={x + 4}
        y={y + 4}
        width={w * 0.28}
        height={h * 0.22}
        fill="#fff"
        opacity={0.35}
      />
    </g>
  )
}

/** One realistic scene per nightly story (1–31). */
function NightArt({ night, uid }: { night: number; uid: string }) {
  switch (night) {
    case 1: // kitchen light
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill="#1c1917" />
          <rect x="0" y="110" width="360" height="90" fill="#44403c" />
          <rect x="0" y="0" width="360" height="110" fill="#292524" />
          <circle cx="180" cy="48" r="70" fill={`url(#${uid}-lamp)`} />
          <ellipse cx="180" cy="28" rx="36" ry="10" fill="#fef08a" />
          <rect x="172" y="8" width="16" height="18" fill="#a8a29e" />
          {/* cabinets */}
          <rect x="20" y="100" width="320" height="14" fill={`url(#${uid}-wood)`} />
          <rect x="30" y="114" width="90" height="70" rx="4" fill="#78350f" />
          <rect x="135" y="114" width="90" height="70" rx="4" fill="#92400e" />
          <rect x="240" y="114" width="90" height="70" rx="4" fill="#78350f" />
          <circle cx="70" cy="148" r="4" fill="#fde68a" />
          <circle cx="180" cy="148" r="4" fill="#fde68a" />
          <circle cx="285" cy="148" r="4" fill="#fde68a" />
          <WindowPane x={250} y={28} w={70} h={55} night />
          <Person x={110} y={108} shirt="#f97316" hair="#44403c" scale={0.9} />
          <Person x={160} y={110} shirt="#3b82f6" scale={0.85} />
          {/* book */}
          <rect x="175" y="95" width="22" height="14" rx="2" fill="#2563eb" />
        </Frame>
      )

    case 2: // café window
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill={`url(#${uid}-skyDay)`} />
          <rect x="0" y="130" width="360" height="70" fill="#a8a29e" />
          {/* café interior wall */}
          <rect x="0" y="0" width="200" height="200" fill="#fff7ed" />
          <WindowPane x={40} y={28} w={100} h={80} />
          {/* street bits through window already in pane */}
          <ellipse cx="90" cy="148" rx="48" ry="10" fill="#78716c" opacity={0.25} />
          <rect x="55" y="118" width="70" height="8" rx="2" fill={`url(#${uid}-wood)`} />
          <path
            d="M70 90 h40 v28 a12 12 0 0 1-12 12 h-16 a12 12 0 0 1-12-12 V90z"
            fill="#fef3c7"
            stroke="#d97706"
            strokeWidth={2}
          />
          <path
            d="M110 98 h10 a10 10 0 0 1 0 20 h-10"
            stroke="#b45309"
            strokeWidth={4}
            fill="none"
          />
          <path
            d="M78 78c4 5 4 9 0 14M92 76c4 5 4 9 0 14"
            stroke="#a8a29e"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <Person x={90} y={118} shirt="#fb7185" scale={0.8} />
          <Person x={145} y={120} shirt="#38bdf8" scale={0.75} />
          {/* outdoor buildings */}
          <rect x="230" y="70" width="50" height="60" fill="#94a3b8" />
          <rect x="290" y="50" width="45" height="80" fill="#64748b" />
          <rect x="240" y="85" width="12" height="12" fill="#fde68a" />
          <rect x="300" y="65" width="12" height="12" fill="#7dd3fc" />
        </Frame>
      )

    case 3: // perfect blue (shop)
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill="#fdf2f8" />
          <rect x="0" y="150" width="360" height="50" fill="#e7e5e4" />
          {/* rack */}
          <line x1="40" y1="50" x2="320" y2="50" stroke="#78716c" strokeWidth={5} />
          <line x1="50" y1="50" x2="50" y2="150" stroke="#a8a29e" strokeWidth={4} />
          <line x1="310" y1="50" x2="310" y2="150" stroke="#a8a29e" strokeWidth={4} />
          {/* shirts */}
          <path d="M80 55 L100 75 L100 130 L60 130 L60 75 Z" fill="#f472b6" />
          <path d="M140 55 L160 75 L160 130 L120 130 L120 75 Z" fill="#4ade80" />
          <path d="M200 55 L220 75 L220 135 L180 135 L180 75 Z" fill="#2563eb" />
          <path d="M260 55 L280 75 L280 130 L240 130 L240 75 Z" fill="#fbbf24" />
          {/* highlight blue */}
          <circle cx="200" cy="100" r="28" fill="none" stroke="#fde047" strokeWidth={3} strokeDasharray="4 3" />
          <Person x={200} y={155} shirt="#1d4ed8" scale={0.85} />
          <text x="200" y="40" textAnchor="middle" fill="#1e3a8a" fontSize={14} fontWeight={800}>
            el azul perfecto
          </text>
        </Frame>
      )

    case 4: // market apples
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill={`url(#${uid}-skyDay)`} />
          <path d="M0 150 Q180 120 360 150 L360 200 H0 Z" fill={`url(#${uid}-grass)`} />
          {/* awning */}
          <path d="M60 40 H300 L280 90 H80 Z" fill={`url(#${uid}-rose)`} />
          <path d="M60 40 H300" stroke="#9f1239" strokeWidth={4} />
          <rect x="80" y="90" width="200" height="70" fill={`url(#${uid}-wood)`} />
          {/* apples */}
          <circle cx="120" cy="115" r="16" fill="#ef4444" />
          <circle cx="150" cy="118" r="15" fill="#dc2626" />
          <circle cx="180" cy="114" r="16" fill="#f43f5e" />
          <circle cx="210" cy="120" r="14" fill="#e11d48" />
          <circle cx="240" cy="116" r="15" fill="#b91c1c" />
          <path d="M120 100 q4 -10 0 -14" stroke="#365314" strokeWidth={2} fill="none" />
          <path d="M180 99 q4 -10 0 -14" stroke="#365314" strokeWidth={2} fill="none" />
          <Person x={95} y={145} shirt="#ea580c" scale={0.8} />
          <Person x={280} y={148} shirt="#0ea5e9" scale={0.75} />
        </Frame>
      )

    case 5: // hotel key 201
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill="#eef2ff" />
          <rect x="0" y="140" width="360" height="60" fill="#c7d2fe" />
          {/* desk */}
          <rect x="40" y="100" width="160" height="50" rx="6" fill={`url(#${uid}-wood)`} />
          <Person x={100} y={100} shirt="#6366f1" scale={0.75} />
          {/* key */}
          <g transform="translate(220 70)">
            <circle cx="24" cy="24" r="22" fill={`url(#${uid}-sun)`} />
            <circle cx="24" cy="24" r="8" fill="#fff7ed" />
            <rect x="42" y="18" width="50" height="12" rx="3" fill="#fbbf24" />
            <rect x="82" y="18" width="8" height="20" rx="2" fill="#f59e0b" />
            <rect x="92" y="18" width="8" height="14" rx="2" fill="#f59e0b" />
          </g>
          <rect x="230" y="130" width="70" height="36" rx="8" fill="#4c1d95" />
          <text x="265" y="153" textAnchor="middle" fill="#fff" fontSize={16} fontWeight={800}>
            201
          </text>
          {/* plant */}
          <rect x="310" y="110" width="14" height="30" fill="#78716c" />
          <ellipse cx="317" cy="100" rx="22" ry="16" fill="#22c55e" />
        </Frame>
      )

    case 6: // train and sea
      return (
        <Frame uid={uid}>
          <rect width="360" height="110" fill={`url(#${uid}-skyDay)`} />
          <rect x="0" y="110" width="360" height="50" fill={`url(#${uid}-sea)`} />
          <path
            d="M0 130 Q40 120 80 132 T160 128 T240 134 T360 126 V160 H0 Z"
            fill="#22d3ee"
            opacity={0.5}
          />
          <rect x="0" y="160" width="360" height="40" fill="#78716c" />
          <line x1="0" y1="170" x2="360" y2="170" stroke="#e7e5e4" strokeWidth={3} strokeDasharray="14 10" />
          {/* train */}
          <rect x="40" y="115" width="160" height="48" rx="8" fill="#1d4ed8" />
          <rect x="55" y="125" width="28" height="22" rx="3" fill="#7dd3fc" />
          <rect x="95" y="125" width="28" height="22" rx="3" fill="#7dd3fc" />
          <rect x="135" y="125" width="28" height="22" rx="3" fill="#7dd3fc" />
          <rect x="200" y="120" width="50" height="40" rx="6" fill="#2563eb" />
          <circle cx="70" cy="165" r="10" fill="#1c1917" />
          <circle cx="150" cy="165" r="10" fill="#1c1917" />
          <circle cx="220" cy="165" r="10" fill="#1c1917" />
          <circle cx="290" cy="40" r="18" fill={`url(#${uid}-sun)`} />
          <Person x={155} y={140} shirt="#f97316" scale={0.55} />
        </Frame>
      )

    case 7: // calm doctor
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill="#ecfdf5" />
          <rect x="0" y="140" width="360" height="60" fill="#ccfbf1" />
          <rect x="40" y="40" width="140" height="100" rx="12" fill="#fff" stroke="#5eead4" strokeWidth={4} />
          <Person x={110} y={110} shirt="#14b8a6" scale={0.85} />
          {/* cross */}
          <rect x="250" y="50" width="50" height="50" rx="10" fill={`url(#${uid}-mint)`} />
          <rect x="268" y="58" width="14" height="34" rx="2" fill="#fff" />
          <rect x="258" y="68" width="34" height="14" rx="2" fill="#fff" />
          <Person x={250} y={145} shirt="#fda4af" scale={0.8} />
          <ellipse cx="180" cy="170" rx="80" ry="10" fill="#0f766e" opacity={0.12} />
        </Frame>
      )

    case 8: // restaurant please
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill="#fff1f2" />
          <rect x="0" y="150" width="360" height="50" fill="#44403c" />
          <ellipse cx="180" cy="130" rx="90" ry="28" fill={`url(#${uid}-wood)`} />
          <rect x="100" y="100" width="160" height="20" rx="4" fill="#b45309" />
          {/* plates */}
          <circle cx="140" cy="118" r="18" fill="#fafaf9" stroke="#d6d3d1" strokeWidth={2} />
          <circle cx="220" cy="118" r="18" fill="#fafaf9" stroke="#d6d3d1" strokeWidth={2} />
          <circle cx="140" cy="118" r="8" fill="#fb923c" />
          <circle cx="220" cy="118" r="8" fill="#86efac" />
          <Person x={120} y={95} shirt="#e11d48" scale={0.7} />
          <Person x={240} y={95} shirt="#2563eb" scale={0.7} />
          {/* candle */}
          <rect x="175" y="85" width="8" height="22" fill="#fef3c7" />
          <ellipse cx="179" cy="82" rx="5" ry="8" fill="#f97316" />
          <text x="180" y="40" textAnchor="middle" fill="#9f1239" fontSize={13} fontWeight={800}>
            por favor…
          </text>
        </Frame>
      )

    case 9: // map of days / city
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill={`url(#${uid}-skyDay)`} />
          <rect x="30" y="70" width="50" height="100" fill="#64748b" />
          <rect x="90" y="50" width="60" height="120" fill="#475569" />
          <rect x="160" y="80" width="45" height="90" fill="#94a3b8" />
          <rect x="220" y="40" width="70" height="130" fill="#334155" />
          <rect x="300" y="90" width="40" height="80" fill="#64748b" />
          {/* windows lit */}
          {[100, 120, 140].map((yy) => (
            <rect key={yy} x="105" y={yy} width="12" height="12" fill="#fde047" />
          ))}
          {[60, 90, 120].map((yy) => (
            <rect key={yy} x="240" y={yy} width="12" height="12" fill="#7dd3fc" />
          ))}
          <rect x="0" y="170" width="360" height="30" fill="#57534e" />
          {/* map paper */}
          <g transform="translate(130 100)">
            <rect width="90" height="60" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth={2} />
            <path d="M15 20 L40 15 L70 30 L50 45 L20 35 Z" stroke="#ea580c" strokeWidth={2} fill="none" />
            <circle cx="40" cy="15" r="4" fill="#ef4444" />
          </g>
          <Person x={100} y={165} shirt="#f97316" scale={0.7} />
        </Frame>
      )

    case 10: // laughs at table evening
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill={`url(#${uid}-skyDusk)`} />
          <rect x="0" y="130" width="360" height="70" fill="#1c1917" opacity={0.35} />
          <ellipse cx="180" cy="145" rx="110" ry="32" fill={`url(#${uid}-wood)`} />
          <Person x={110} y={130} shirt="#fb7185" scale={0.75} />
          <Person x={170} y={128} shirt="#38bdf8" scale={0.75} />
          <Person x={230} y={132} shirt="#a3e635" scale={0.75} />
          <Person x={280} y={135} shirt="#c084fc" scale={0.7} />
          <circle cx="180" cy="40" r="22" fill={`url(#${uid}-sun)`} />
          {/* wine glasses */}
          <path d="M145 140 v-18 h10 v18 M150 140 v12" stroke="#e7e5e4" strokeWidth={2} />
          <path d="M200 140 v-18 h10 v18 M205 140 v12" stroke="#e7e5e4" strokeWidth={2} />
        </Frame>
      )

    case 11: // voice from yesterday (phone)
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill="#1e1b4b" />
          <circle cx="60" cy="40" r="3" fill="#fde68a" />
          <circle cx="120" cy="28" r="2" fill="#fff" />
          <circle cx="300" cy="50" r="2.5" fill="#fde68a" />
          <circle cx="260" cy="30" r="2" fill="#fff" />
          <Person x={120} y={140} shirt="#818cf8" scale={0.95} />
          {/* phone */}
          <rect x="200" y="70" width="70" height="120" rx="12" fill="#0f172a" stroke="#94a3b8" strokeWidth={3} />
          <rect x="210" y="85" width="50" height="80" rx="4" fill="#67e8f9" />
          <circle cx="235" cy="175" r="6" fill="#475569" />
          {/* sound waves */}
          <path
            d="M175 100 Q185 120 175 140"
            stroke="#a5b4fc"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M160 90 Q175 120 160 150"
            stroke="#c4b5fd"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
        </Frame>
      )

    case 12: // toast and time
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill="#fffbeb" />
          <WindowPane x={220} y={20} w={100} h={90} />
          <rect x="0" y="140" width="360" height="60" fill="#fef3c7" />
          <ellipse cx="140" cy="145" rx="70" ry="18" fill={`url(#${uid}-wood)`} />
          {/* toast */}
          <rect x="100" y="110" width="36" height="28" rx="4" fill="#fbbf24" />
          <rect x="108" y="116" width="20" height="8" rx="2" fill="#fef9c3" />
          <path
            d="M160 100 h36 v28 a10 10 0 0 1-10 10 h-16 a10 10 0 0 1-10-10 V100z"
            fill="#fef3c7"
            stroke="#b45309"
            strokeWidth={2}
          />
          {/* clock */}
          <circle cx="70" cy="50" r="28" fill="#fff" stroke="#78716c" strokeWidth={4} />
          <line x1="70" y1="50" x2="70" y2="32" stroke="#1c1917" strokeWidth={3} />
          <line x1="70" y1="50" x2="88" y2="50" stroke="#1c1917" strokeWidth={2.5} />
          <Person x={140} y={140} shirt="#f97316" scale={0.8} />
        </Frame>
      )

    case 13: // three days Madrid museum
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill="#faf5ff" />
          <rect x="0" y="160" width="360" height="40" fill="#e7e5e4" />
          {/* museum facade */}
          <rect x="60" y="50" width="240" height="110" fill="#e2e8f0" />
          <rect x="80" y="70" width="50" height="70" fill="#1e3a8a" />
          <rect x="155" y="70" width="50" height="70" fill="#1e3a8a" />
          <rect x="230" y="70" width="50" height="70" fill="#1e3a8a" />
          <rect x="50" y="40" width="260" height="18" fill={`url(#${uid}-lilac)`} />
          {/* columns */}
          <rect x="70" y="50" width="12" height="110" fill="#cbd5e1" />
          <rect x="278" y="50" width="12" height="110" fill="#cbd5e1" />
          <Person x={180} y={155} shirt="#f472b6" scale={0.7} />
          <Person x={220} y={158} shirt="#38bdf8" scale={0.65} />
          <text x="180" y="32" textAnchor="middle" fill="#5b21b6" fontSize={13} fontWeight={800}>
            Madrid · 3 días
          </text>
        </Frame>
      )

    case 14: // hotel by port
      return (
        <Frame uid={uid}>
          <rect width="360" height="100" fill={`url(#${uid}-skyDusk)`} />
          <rect x="0" y="100" width="360" height="60" fill={`url(#${uid}-sea)`} />
          <rect x="0" y="160" width="360" height="40" fill="#57534e" />
          {/* hotel */}
          <rect x="40" y="50" width="120" height="110" fill="#e0e7ff" stroke="#6366f1" strokeWidth={3} />
          {[65, 90, 115].map((yy) =>
            [55, 85, 115].map((xx) => (
              <rect key={`${xx}-${yy}`} x={xx} y={yy} width="16" height="14" fill="#fde68a" />
            )),
          )}
          {/* boats */}
          <path d="M200 130 L260 130 L245 150 H215 Z" fill="#f97316" />
          <path d="M270 125 L330 125 L318 148 H282 Z" fill="#fff" />
          <line x1="230" y1="130" x2="230" y2="100" stroke="#78716c" strokeWidth={2} />
          <path d="M230 100 L255 125 L230 125 Z" fill="#fef3c7" />
          <circle cx="300" cy="35" r="16" fill={`url(#${uid}-sun)`} />
        </Frame>
      )

    case 15: // felt better / doctor
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill="#f0fdfa" />
          <rect x="0" y="140" width="360" height="60" fill="#99f6e4" opacity={0.5} />
          {/* bed */}
          <rect x="50" y="100" width="160" height="50" rx="8" fill="#fff" stroke="#5eead4" strokeWidth={3} />
          <rect x="50" y="90" width="40" height="20" rx="6" fill="#ccfbf1" />
          <Person x={120} y={115} shirt="#fda4af" scale={0.7} />
          {/* thermometer / heart */}
          <path
            d="M260 70c0-14 10-24 22-24 8 0 14 4 18 10 4-6 10-10 18-10 12 0 22 10 22 24 0 28-40 50-40 50S260 98 260 70z"
            fill={`url(#${uid}-rose)`}
          />
          <text x="280" y="170" textAnchor="middle" fill="#0f766e" fontSize={12} fontWeight={800}>
            ya estoy mejor
          </text>
        </Frame>
      )

    case 16: // sale shop
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill="#fff7ed" />
          <rect x="0" y="150" width="360" height="50" fill="#fed7aa" />
          <rect x="40" y="40" width="280" height="100" rx="8" fill="#fff" stroke="#fb923c" strokeWidth={4} />
          <rect x="60" y="55" width="70" height="70" fill="#f472b6" />
          <rect x="145" y="55" width="70" height="70" fill="#38bdf8" />
          <rect x="230" y="55" width="70" height="70" fill="#a3e635" />
          <g transform="translate(130 20)">
            <rect width="100" height="32" rx="8" fill="#ea580c" transform="rotate(-8 50 16)" />
            <text x="50" y="22" textAnchor="middle" fill="#fff" fontSize={14} fontWeight={800} transform="rotate(-8 50 16)">
              ¡OFERTA!
            </text>
          </g>
          <Person x={180} y={155} shirt="#f97316" scale={0.8} />
        </Frame>
      )

    case 17: // red dress
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill="#fff1f2" />
          <rect x="0" y="160" width="360" height="40" fill="#fecdd3" />
          {/* mannequin dress */}
          <circle cx="180" cy="48" r="18" fill="#f5d0b0" />
          <path d="M150 70 Q180 60 210 70 L220 150 H140 Z" fill={`url(#${uid}-rose)`} />
          <path d="M140 150 Q180 170 220 150" fill="#be123c" />
          <ellipse cx="180" cy="78" rx="28" ry="8" fill="#fb7185" opacity={0.6} />
          <Person x={80} y={140} shirt="#38bdf8" scale={0.75} />
          <Person x={280} y={140} shirt="#fbbf24" scale={0.75} />
          {/* mirror arc */}
          <path
            d="M40 40 Q40 160 40 160"
            stroke="#a8a29e"
            strokeWidth={4}
            fill="none"
          />
        </Frame>
      )

    case 18: // ordered with spell
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill="#1c1917" />
          <rect x="0" y="0" width="360" height="200" fill={`url(#${uid}-skyDusk)`} opacity={0.55} />
          <ellipse cx="180" cy="140" rx="100" ry="30" fill="#44403c" />
          <rect x="100" y="115" width="160" height="16" fill={`url(#${uid}-wood)`} />
          {/* sparkles / spell */}
          <circle cx="180" cy="70" r="8" fill="#fde047" />
          <circle cx="150" cy="55" r="4" fill="#f9a8d4" />
          <circle cx="210" cy="50" r="5" fill="#67e8f9" />
          <circle cx="170" cy="40" r="3" fill="#fff" />
          <circle cx="200" cy="80" r="3" fill="#fbbf24" />
          <Person x={140} y={115} shirt="#c084fc" scale={0.7} />
          <Person x={220} y={118} shirt="#fb7185" scale={0.7} />
          <text x="180" y="185" textAnchor="middle" fill="#fde68a" fontSize={12} fontWeight={800}>
            pedí con un hechizo
          </text>
        </Frame>
      )

    case 19: // full week museum
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill="#f5f5f4" />
          {/* gallery wall with 7 frames */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const x = 30 + i * 46
            const colors = ['#f43f5e', '#f59e0b', '#84cc16', '#06b6d4', '#6366f1', '#d946ef', '#ea580c']
            return (
              <g key={i}>
                <rect x={x} y={50} width={38} height={48} fill="#fff" stroke="#78716c" strokeWidth={3} />
                <rect x={x + 6} y={56} width={26} height={28} fill={colors[i]} />
              </g>
            )
          })}
          <Person x={180} y={150} shirt="#8b5cf6" scale={0.85} />
          <text x="180" y="35" textAnchor="middle" fill="#44403c" fontSize={13} fontWeight={800}>
            una semana completa
          </text>
        </Frame>
      )

    case 20: // came to the door party
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill={`url(#${uid}-skyNight)`} />
          <rect x="100" y="40" width="160" height="140" fill="#44403c" />
          <rect x="130" y="70" width="100" height="110" fill={`url(#${uid}-warm)`} />
          <circle cx="215" cy="130" r="5" fill="#fde68a" />
          {/* party lights */}
          {[110, 140, 170, 200, 230].map((x, i) => (
            <circle key={x} cx={x} cy={55} r={5} fill={['#f43f5e', '#fbbf24', '#22d3ee', '#a3e635', '#e879f9'][i]} />
          ))}
          <Person x={80} y={155} shirt="#22d3ee" scale={0.75} />
          <Person x={280} y={155} shirt="#f472b6" scale={0.75} />
          <Person x={180} y={160} shirt="#fbbf24" scale={0.7} />
        </Frame>
      )

    case 21: // tomorrow we'll talk
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill={`url(#${uid}-skyDusk)`} />
          <circle cx="280" cy="45" r="28" fill={`url(#${uid}-sun)`} />
          <Person x={140} y={140} shirt="#6366f1" scale={0.95} />
          <rect x="200" y="90" width="50" height="85" rx="10" fill="#0f172a" />
          <rect x="208" y="100" width="34" height="55" rx="3" fill="#a5b4fc" />
          {/* calendar chip */}
          <rect x="40" y="50" width="70" height="60" rx="8" fill="#fff" />
          <rect x="40" y="50" width="70" height="18" fill="#e11d48" />
          <text x="75" y="64" textAnchor="middle" fill="#fff" fontSize={10} fontWeight={800}>
            MAÑANA
          </text>
          <text x="75" y="95" textAnchor="middle" fill="#1c1917" fontSize={22} fontWeight={800}>
            24
          </text>
        </Frame>
      )

    case 22: // we'll eat out
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill={`url(#${uid}-skyDay)`} />
          <path d="M0 140 Q180 110 360 140 L360 200 H0 Z" fill={`url(#${uid}-grass)`} />
          {/* patio table umbrella */}
          <path d="M80 90 L180 40 L280 90 Z" fill={`url(#${uid}-rose)`} />
          <line x1="180" y1="90" x2="180" y2="150" stroke="#78716c" strokeWidth={4} />
          <ellipse cx="180" cy="155" rx="55" ry="14" fill={`url(#${uid}-wood)`} />
          <Person x={145} y={145} shirt="#0ea5e9" scale={0.7} />
          <Person x={215} y={148} shirt="#f97316" scale={0.7} />
          <circle cx="300" cy="40" r="18" fill={`url(#${uid}-sun)`} />
        </Frame>
      )

    case 23: // we'll live nearby park
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill={`url(#${uid}-skyDay)`} />
          <path d="M0 130 Q180 100 360 130 L360 200 H0 Z" fill={`url(#${uid}-grass)`} />
          {/* trees */}
          <rect x="60" y="100" width="14" height="40" fill="#78350f" />
          <ellipse cx="67" cy="85" rx="32" ry="28" fill="#16a34a" />
          <rect x="280" y="105" width="14" height="40" fill="#78350f" />
          <ellipse cx="287" cy="90" rx="30" ry="26" fill="#22c55e" />
          {/* houses distant */}
          <path d="M140 110 L170 85 L200 110 V145 H140 Z" fill="#fdba74" />
          <path d="M210 115 L235 95 L260 115 V145 H210 Z" fill="#93c5fd" />
          <Person x={180} y={150} shirt="#f472b6" scale={0.8} />
          <Person x={220} y={152} shirt="#38bdf8" scale={0.75} />
        </Frame>
      )

    case 24: // hotel sunrise beach
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill={`url(#${uid}-skyDusk)`} />
          <circle cx="180" cy="70" r="36" fill={`url(#${uid}-sun)`} />
          <rect x="0" y="110" width="360" height="50" fill={`url(#${uid}-sea)`} />
          <path d="M0 150 Q90 140 180 155 T360 148 V200 H0 Z" fill="#fde68a" />
          <rect x="40" y="70" width="80" height="70" fill="#e0e7ff" stroke="#6366f1" strokeWidth={2} />
          <rect x="55" y="85" width="14" height="12" fill="#fde047" />
          <rect x="80" y="85" width="14" height="12" fill="#fde047" />
          <Person x={220} y={145} shirt="#06b6d4" scale={0.7} />
        </Frame>
      )

    case 25: // photos of Seville
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill="#faf5ff" />
          <rect x="0" y="150" width="360" height="50" fill="#ede9fe" />
          {/* photo scatter */}
          <g transform="translate(50 40) rotate(-8)">
            <rect width="90" height="70" fill="#fff" stroke="#a78bfa" strokeWidth={3} />
            <rect x="8" y="8" width="74" height="45" fill="#fdba74" />
            <path d="M8 40 L30 25 L50 45 L65 30 L82 53 H8 Z" fill="#22c55e" />
          </g>
          <g transform="translate(150 55) rotate(6)">
            <rect width="90" height="70" fill="#fff" stroke="#f472b6" strokeWidth={3} />
            <rect x="8" y="8" width="74" height="45" fill="#7dd3fc" />
            <rect x="25" y="20" width="40" height="30" fill="#fef3c7" />
          </g>
          <g transform="translate(240 35) rotate(-4)">
            <rect width="90" height="70" fill="#fff" stroke="#38bdf8" strokeWidth={3} />
            <rect x="8" y="8" width="74" height="45" fill="#f9a8d4" />
            <circle cx="45" cy="28" r="12" fill="#fde047" />
          </g>
          <text x="180" y="175" textAnchor="middle" fill="#5b21b6" fontSize={13} fontWeight={800}>
            Sevilla
          </text>
        </Frame>
      )

    case 26: // Thursday at ten
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill="#ecfeff" />
          {/* big clock */}
          <circle cx="120" cy="100" r="70" fill="#fff" stroke="#0e7490" strokeWidth={6} />
          <circle cx="120" cy="100" r="6" fill="#0e7490" />
          <line x1="120" y1="100" x2="120" y2="50" stroke="#164e63" strokeWidth={5} strokeLinecap="round" />
          <line x1="120" y1="100" x2="165" y2="100" stroke="#164e63" strokeWidth={4} strokeLinecap="round" />
          <text x="120" y="185" textAnchor="middle" fill="#0e7490" fontSize={14} fontWeight={800}>
            10:00
          </text>
          {/* calendar jueves */}
          <rect x="220" y="50" width="100" height="110" rx="10" fill="#fff" stroke="#06b6d4" strokeWidth={3} />
          <rect x="220" y="50" width="100" height="28" fill="#0891b2" />
          <text x="270" y="70" textAnchor="middle" fill="#fff" fontSize={12} fontWeight={800}>
            JUEVES
          </text>
          <text x="270" y="120" textAnchor="middle" fill="#164e63" fontSize={36} fontWeight={800}>
            10
          </text>
        </Frame>
      )

    case 27: // two kilos apples
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill={`url(#${uid}-skyDay)`} />
          <path d="M0 150 H360 V200 H0 Z" fill={`url(#${uid}-grass)`} />
          <path d="M70 50 H290 L270 100 H90 Z" fill="#fbbf24" />
          <rect x="90" y="100" width="180" height="60" fill={`url(#${uid}-wood)`} />
          {/* scale */}
          <rect x="140" y="70" width="80" height="50" rx="6" fill="#e7e5e4" stroke="#78716c" strokeWidth={2} />
          <text x="180" y="100" textAnchor="middle" fill="#1c1917" fontSize={14} fontWeight={800}>
            2 kg
          </text>
          <circle cx="120" cy="125" r="14" fill="#ef4444" />
          <circle cx="150" cy="130" r="13" fill="#dc2626" />
          <circle cx="180" cy="124" r="14" fill="#f43f5e" />
          <circle cx="210" cy="128" r="12" fill="#e11d48" />
          <circle cx="235" cy="126" r="13" fill="#b91c1c" />
          <Person x={300} y={145} shirt="#ea580c" scale={0.75} />
        </Frame>
      )

    case 28: // I'll choose blue
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill="#eff6ff" />
          <rect x="0" y="150" width="360" height="50" fill="#dbeafe" />
          {/* closet */}
          <rect x="40" y="30" width="160" height="130" rx="6" fill="#fff" stroke="#60a5fa" strokeWidth={4} />
          <line x1="120" y1="30" x2="120" y2="160" stroke="#93c5fd" strokeWidth={3} />
          <path d="M60 50 L85 70 L85 130 L55 130 Z" fill="#f472b6" />
          <path d="M95 50 L115 70 L115 135 L90 135 Z" fill="#2563eb" />
          <path d="M135 50 L160 70 L160 130 L130 130 Z" fill="#4ade80" />
          <circle cx="102" cy="95" r="22" fill="none" stroke="#fde047" strokeWidth={3} />
          <Person x={260} y={140} shirt="#1d4ed8" scale={0.9} />
          <text x="260" y="50" textAnchor="middle" fill="#1e3a8a" fontSize={13} fontWeight={800}>
            elegiré el azul
          </text>
        </Frame>
      )

    case 29: // we'll ask for help
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill="#fff7ed" />
          <rect x="0" y="150" width="360" height="50" fill="#ffedd5" />
          <ellipse cx="160" cy="135" rx="80" ry="22" fill={`url(#${uid}-wood)`} />
          <Person x={120} y={125} shirt="#f97316" scale={0.75} />
          <Person x={200} y={128} shirt="#38bdf8" scale={0.75} />
          {/* waiter */}
          <Person x={290} y={130} shirt="#1c1917" scale={0.8} />
          <rect x="270" y="70" width="60" height="28" rx="14" fill="#ea580c" />
          <text x="300" y="88" textAnchor="middle" fill="#fff" fontSize={11} fontWeight={800}>
            ¿Ayuda?
          </text>
          <path d="M270 90 L255 110" stroke="#ea580c" strokeWidth={3} />
        </Frame>
      )

    case 30: // Friday lights plaza
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill={`url(#${uid}-skyNight)`} />
          {/* plaza ground */}
          <path d="M0 150 Q180 130 360 150 L360 200 H0 Z" fill="#44403c" />
          {/* fountain */}
          <ellipse cx="180" cy="145" rx="40" ry="12" fill="#67e8f9" />
          <rect x="170" y="110" width="20" height="35" fill="#94a3b8" />
          <ellipse cx="180" cy="108" rx="28" ry="10" fill="#22d3ee" />
          {/* string lights */}
          <path d="M20 60 Q180 90 340 55" stroke="#fde68a" strokeWidth={2} fill="none" />
          {[40, 80, 120, 160, 200, 240, 280, 320].map((x, i) => (
            <circle
              key={x}
              cx={x}
              cy={60 + Math.sin(i) * 12}
              r={5}
              fill={['#f43f5e', '#fbbf24', '#22d3ee', '#a3e635', '#e879f9', '#fb923c', '#38bdf8', '#f472b6'][i]}
            />
          ))}
          <Person x={100} y={155} shirt="#f472b6" scale={0.65} />
          <Person x={250} y={158} shirt="#38bdf8" scale={0.65} />
          <Person x={180} y={160} shirt="#fbbf24" scale={0.6} />
        </Frame>
      )

    case 31: // morning mirror
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill="#fffbeb" />
          <rect x="0" y="150" width="360" height="50" fill="#fef3c7" />
          {/* mirror */}
          <rect x="110" y="25" width="140" height="120" rx="16" fill={`url(#${uid}-mint)`} />
          <rect x="122" y="37" width="116" height="96" rx="10" fill="#ecfeff" stroke="#99f6e4" strokeWidth={4} />
          <Person x={180} y={110} shirt="#14b8a6" scale={0.7} />
          {/* sink */}
          <ellipse cx="180" cy="160" rx="50" ry="16" fill="#67e8f9" />
          <rect x="250" y="80" width="12" height="50" rx="4" fill="#f472b6" />
          <rect x="245" y="70" width="22" height="14" rx="4" fill="#fb923c" />
          <circle cx="70" cy="50" r="20" fill={`url(#${uid}-sun)`} />
          <WindowPane x={20} y={70} w={55} h={50} />
        </Frame>
      )

    default:
      return (
        <Frame uid={uid}>
          <rect width="360" height="200" fill={`url(#${uid}-skyDay)`} />
          <path d="M0 140 Q180 110 360 140 L360 200 H0 Z" fill={`url(#${uid}-grass)`} />
          <circle cx="280" cy="45" r="24" fill={`url(#${uid}-sun)`} />
          <Person x={180} y={145} shirt="#f97316" />
        </Frame>
      )
  }
}

/** Storybook illustration — unique art for each nightly story. */
export function StoryVisual({
  scene,
  night,
  title,
  className = '',
  size = 'hero',
}: Props) {
  const uid = useId().replace(/:/g, '')

  return (
    <figure
      className={`story-visual ${SCENE_TONE[scene]} story-visual-${size} ${className}`.trim()}
      aria-hidden={title ? undefined : true}
    >
      <div className="story-visual-glow" />
      <div className="story-visual-glow story-visual-glow-b" />
      <div className="story-visual-art">
        <NightArt night={night} uid={uid} />
      </div>
      {title ? <figcaption className="sr-only">{title}</figcaption> : null}
    </figure>
  )
}
