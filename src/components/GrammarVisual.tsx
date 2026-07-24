import { useId, type ReactNode } from 'react'
import type { GrammarSection } from '../data/grammar'

export type GrammarVisualId = GrammarSection | 'all'

type Props = {
  id: GrammarVisualId
  size?: 'hero' | 'thumb'
  className?: string
  title?: string
}

const TONE: Record<GrammarVisualId, string> = {
  all: 'gviz-tone-rainbow',
  gender: 'gviz-tone-split',
  articles: 'gviz-tone-frame',
  'ser-estar': 'gviz-tone-duo',
  'por-para': 'gviz-tone-paths',
  prepositions: 'gviz-tone-map',
  'object-pronouns': 'gviz-tone-pass',
  gustar: 'gviz-tone-heart',
  reflexives: 'gviz-tone-mirror',
  negation: 'gviz-tone-stop',
  comparisons: 'gviz-tone-scale',
  demonstratives: 'gviz-tone-point',
  possessives: 'gviz-tone-home',
  'pret-imp': 'gviz-tone-time',
  commands: 'gviz-tone-speak',
}

function Frame({
  children,
  uid,
}: {
  children: ReactNode
  uid: string
}) {
  return (
    <svg viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="55%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="#f9a8d4" />
        </linearGradient>
        <linearGradient id={`${uid}-sun`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
        <linearGradient id={`${uid}-grass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id={`${uid}-rose`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
        <linearGradient id={`${uid}-mint`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id={`${uid}-lilac`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
        <linearGradient id={`${uid}-coral`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id={`${uid}-blue`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#fff7ed" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {children}
    </svg>
  )
}

function Ground({ uid, y = 148 }: { uid: string; y?: number }) {
  return (
    <>
      <ellipse
        cx="160"
        cy={y + 8}
        rx="130"
        ry="14"
        fill="#0f172a"
        opacity="0.08"
      />
      <path
        d={`M20 ${y} Q160 ${y - 18} 300 ${y} L300 180 H20 Z`}
        fill={`url(#${uid}-grass)`}
      />
    </>
  )
}

function Person({
  x,
  y,
  shirt,
  hair,
  scale = 1,
  flip = false,
}: {
  x: number
  y: number
  shirt: string
  hair: string
  scale?: number
  flip?: boolean
}) {
  const t = `translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`
  return (
    <g transform={t}>
      {/* head */}
      <circle cx="0" cy="-38" r="12" fill="#fde8d0" />
      <path
        d="M-12 -42 Q0 -54 12 -40 Q6 -34 0 -36 Q-8 -34 -12 -42Z"
        fill={hair}
      />
      <circle cx="-4" cy="-38" r="1.4" fill="#1c1917" />
      <circle cx="4" cy="-38" r="1.4" fill="#1c1917" />
      <path
        d="M-3 -32 Q0 -29 3 -32"
        stroke="#b45309"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* body */}
      <path
        d="M-14 -24 Q0 -28 14 -24 L18 8 Q0 14 -18 8 Z"
        fill={shirt}
      />
      <path d="M-8 8 L-10 36 L-2 36 L2 10 Z" fill="#1e3a8a" />
      <path d="M8 8 L10 36 L2 36 L-2 10 Z" fill="#1e3a8a" />
      <path d="M-10 36 h8 v4 h-8z M2 36 h8 v4 h-8z" fill="#78350f" />
      {/* arms */}
      <path
        d="M-14 -18 Q-28 -8 -24 6"
        stroke={shirt}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M14 -18 Q28 -8 24 6"
        stroke={shirt}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  )
}

function Art({ id, uid }: { id: GrammarVisualId; uid: string }) {
  const g = uid

  switch (id) {
    case 'gender':
      return (
        <Frame uid={g}>
          <rect width="320" height="180" fill={`url(#${g}-sky)`} opacity="0.35" />
          <rect x="0" y="0" width="160" height="180" fill="#dbeafe" opacity="0.85" />
          <rect x="160" y="0" width="160" height="180" fill="#fce7f3" opacity="0.9" />
          <circle cx="78" cy="48" r="28" fill={`url(#${g}-blue)`} />
          <circle cx="242" cy="48" r="28" fill={`url(#${g}-rose)`} />
          <text
            x="78"
            y="56"
            textAnchor="middle"
            fill="#fff"
            fontSize={28}
            fontFamily="Georgia, serif"
            fontWeight={700}
          >
            o
          </text>
          <text
            x="242"
            y="56"
            textAnchor="middle"
            fill="#fff"
            fontSize={28}
            fontFamily="Georgia, serif"
            fontWeight={700}
          >
            a
          </text>
          {/* book masc */}
          <g transform="translate(48 92)">
            <rect width="60" height="48" rx="6" fill="#3b82f6" />
            <rect x="8" y="10" width="44" height="6" rx="2" fill="#bfdbfe" />
            <rect x="8" y="22" width="34" height="6" rx="2" fill="#93c5fd" />
            <text x="30" y="42" textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700}>
              el
            </text>
          </g>
          {/* house fem */}
          <g transform="translate(212 88)">
            <path d="M8 28 L30 8 L52 28 V56 H8 Z" fill="#f43f5e" />
            <rect x="22" y="34" width="16" height="22" fill="#fecdd3" />
            <text x="30" y="72" textAnchor="middle" fill="#9f1239" fontSize={11} fontWeight={700}>
              la
            </text>
          </g>
          <line
            x1="160"
            y1="20"
            x2="160"
            y2="160"
            stroke="#fff"
            strokeWidth="3"
            strokeDasharray="6 6"
            opacity="0.8"
          />
        </Frame>
      )

    case 'articles':
      return (
        <Frame uid={g}>
          <rect width="320" height="180" fill={`url(#${g}-glow)`} />
          <rect width="320" height="180" fill="#fff7ed" />
          <Ground uid={g} />
          {/* picture frames = articles framing nouns */}
          <g transform="translate(36 28)">
            <rect width="72" height="88" rx="8" fill={`url(#${g}-sun)`} />
            <rect x="8" y="8" width="56" height="56" rx="4" fill="#fff" />
            <circle cx="36" cy="36" r="16" fill="#86efac" />
            <text x="36" y="78" textAnchor="middle" fill="#78350f" fontSize={13} fontWeight={800}>
              el
            </text>
          </g>
          <g transform="translate(124 28)">
            <rect width="72" height="88" rx="8" fill={`url(#${g}-rose)`} />
            <rect x="8" y="8" width="56" height="56" rx="4" fill="#fff" />
            <path d="M20 48 L36 22 L52 48 Z" fill="#f472b6" />
            <text x="36" y="78" textAnchor="middle" fill="#fff" fontSize={13} fontWeight={800}>
              la
            </text>
          </g>
          <g transform="translate(212 28)">
            <rect width="72" height="88" rx="8" fill={`url(#${g}-mint)`} />
            <rect x="8" y="8" width="56" height="56" rx="4" fill="#fff" />
            <rect x="18" y="22" width="36" height="24" rx="4" fill="#38bdf8" />
            <text x="36" y="78" textAnchor="middle" fill="#fff" fontSize={13} fontWeight={800}>
              un
            </text>
          </g>
          {/* al / del badges */}
          <g transform="translate(70 128)">
            <rect width="70" height="28" rx="14" fill="#2563eb" />
            <text x="35" y="18" textAnchor="middle" fill="#fff" fontSize={12} fontWeight={800}>
              a+el → al
            </text>
          </g>
          <g transform="translate(180 128)">
            <rect width="78" height="28" rx="14" fill="#c2410c" />
            <text x="39" y="18" textAnchor="middle" fill="#fff" fontSize={12} fontWeight={800}>
              de+el → del
            </text>
          </g>
        </Frame>
      )

    case 'ser-estar':
      return (
        <Frame uid={g}>
          <rect width="160" height="180" fill="#dbeafe" />
          <rect x="160" width="160" height="180" fill="#d1fae5" />
          {/* Ser side: ID card / portrait */}
          <text x="80" y="28" textAnchor="middle" fill="#1d4ed8" fontSize={16} fontWeight={800}>
            SER
          </text>
          <rect x="36" y="40" width="88" height="100" rx="10" fill={`url(#${g}-blue)`} />
          <circle cx="80" cy="78" r="22" fill="#fde8d0" />
          <path d="M58 78 Q80 58 102 78" fill="#78350f" />
          <rect x="48" y="108" width="64" height="10" rx="3" fill="#bfdbfe" />
          <rect x="54" y="122" width="52" height="8" rx="3" fill="#93c5fd" />
          <text x="80" y="158" textAnchor="middle" fill="#1e3a8a" fontSize={11} fontWeight={700}>
            who you are
          </text>
          {/* Estar side: location pin + mood */}
          <text x="240" y="28" textAnchor="middle" fill="#047857" fontSize={16} fontWeight={800}>
            ESTAR
          </text>
          <path
            d="M240 52c-18 0-32 14-32 32 0 24 32 52 32 52s32-28 32-52c0-18-14-32-32-32z"
            fill={`url(#${g}-mint)`}
          />
          <circle cx="240" cy="82" r="12" fill="#fff" />
          <circle cx="240" cy="82" r="6" fill="#0d9488" />
          {/* smile cloud */}
          <ellipse cx="240" cy="148" rx="36" ry="16" fill="#6ee7b7" />
          <circle cx="228" cy="146" r="2.5" fill="#065f46" />
          <circle cx="252" cy="146" r="2.5" fill="#065f46" />
          <path
            d="M230 152 Q240 158 250 152"
            stroke="#065f46"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </Frame>
      )

    case 'por-para':
      return (
        <Frame uid={g}>
          <rect width="320" height="180" fill={`url(#${g}-sky)`} opacity="0.45" />
          <Ground uid={g} y={150} />
          {/* winding path = por */}
          <path
            d="M24 120 C70 90, 90 140, 140 110 S200 70, 240 100"
            stroke={`url(#${g}-coral)`}
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          <path
            d="M24 120 C70 90, 90 140, 140 110 S200 70, 240 100"
            stroke="#fff7ed"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="10 12"
            fill="none"
          />
          <text x="70" y="168" fill="#9a3412" fontSize={14} fontWeight={800}>
            por · through / reason
          </text>
          {/* arrow destination = para */}
          <path
            d="M250 48 L290 48 L290 78 L310 78 L270 118 L230 78 L250 78 Z"
            fill={`url(#${g}-sun)`}
          />
          <circle cx="270" cy="40" r="16" fill="#fbbf24" />
          <text x="200" y="36" fill="#92400e" fontSize={14} fontWeight={800}>
            para → goal
          </text>
          <Person x={50} y={118} shirt="#ea580c" hair="#1c1917" scale={0.85} />
          <Person x={255} y={125} shirt="#2563eb" hair="#78350f" scale={0.85} />
        </Frame>
      )

    case 'prepositions':
      return (
        <Frame uid={g}>
          <rect width="320" height="180" fill="#ecfeff" />
          <Ground uid={g} />
          {/* table with objects: en, de, con */}
          <ellipse cx="160" cy="118" rx="110" ry="18" fill="#b45309" />
          <rect x="55" y="100" width="210" height="18" rx="6" fill="#d97706" />
          {/* cup on table = en */}
          <g transform="translate(90 62)">
            <rect width="36" height="40" rx="8" fill={`url(#${g}-rose)`} />
            <path d="M36 12 h12 a12 12 0 0 1 0 24 H36" stroke="#be123c" strokeWidth="5" fill="none" />
            <text x="18" y="70" textAnchor="middle" fill="#9f1239" fontSize={12} fontWeight={800}>
              en
            </text>
          </g>
          {/* gift from = de */}
          <g transform="translate(150 58)">
            <rect width="44" height="44" rx="6" fill={`url(#${g}-lilac)`} />
            <rect x="18" width="8" height="44" fill="#fde047" />
            <rect y="18" width="44" height="8" fill="#fde047" />
            <text x="22" y="74" textAnchor="middle" fill="#5b21b6" fontSize={12} fontWeight={800}>
              de
            </text>
          </g>
          {/* two people with = con */}
          <Person x={250} y={108} shirt="#0ea5e9" hair="#422006" scale={0.7} />
          <Person x={280} y={108} shirt="#f472b6" hair="#1c1917" scale={0.7} />
          <text x="265" y="168" textAnchor="middle" fill="#0e7490" fontSize={12} fontWeight={800}>
            con
          </text>
          {/* path to = a */}
          <path
            d="M40 150 L40 80 L70 80"
            stroke={`url(#${g}-blue)`}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <polygon points="70,70 90,80 70,90" fill="#2563eb" />
          <text x="48" y="70" fill="#1d4ed8" fontSize={12} fontWeight={800}>
            a
          </text>
        </Frame>
      )

    case 'object-pronouns':
      return (
        <Frame uid={g}>
          <rect width="320" height="180" fill="#faf5ff" />
          <Ground uid={g} y={152} />
          <Person x={70} y={120} shirt="#8b5cf6" hair="#1c1917" />
          <Person x={250} y={120} shirt="#06b6d4" hair="#78350f" flip />
          {/* flying gift / ball being passed = object */}
          <g transform="translate(140 70)">
            <circle cx="20" cy="20" r="22" fill={`url(#${g}-sun)`} />
            <text x="20" y="26" textAnchor="middle" fill="#78350f" fontSize={14} fontWeight={800}>
              lo
            </text>
          </g>
          {/* motion arcs */}
          <path
            d="M100 90 C140 40, 180 40, 220 90"
            stroke="#a78bfa"
            strokeWidth="3"
            strokeDasharray="6 6"
            fill="none"
          />
          <path
            d="M100 110 C150 150, 190 150, 220 110"
            stroke="#22d3ee"
            strokeWidth="3"
            strokeDasharray="6 6"
            fill="none"
          />
          <g transform="translate(118 128)">
            <rect width="84" height="26" rx="13" fill="#4c1d95" />
            <text x="42" y="17" textAnchor="middle" fill="#fff" fontSize={11} fontWeight={800}>
              se lo doy
            </text>
          </g>
        </Frame>
      )

    case 'gustar':
      return (
        <Frame uid={g}>
          <rect width="320" height="180" fill={`url(#${g}-sky)`} opacity="0.4" />
          <rect width="320" height="180" fill="#fff1f2" opacity="0.65" />
          <Ground uid={g} />
          <Person x={90} y={120} shirt="#fb7185" hair="#422006" />
          {/* big heart / pleasing object */}
          <path
            d="M210 70c0-18 14-30 30-30 10 0 18 5 22 12 4-7 12-12 22-12 16 0 30 12 30 30 0 36-52 64-52 64S210 106 210 70z"
            fill={`url(#${g}-rose)`}
          />
          <circle cx="220" cy="48" r="18" fill="#fde047" />
          <circle cx="248" cy="42" r="10" fill="#86efac" />
          {/* sparkles */}
          <circle cx="160" cy="40" r="4" fill="#fbbf24" />
          <circle cx="130" cy="55" r="3" fill="#f472b6" />
          <circle cx="175" cy="70" r="3.5" fill="#38bdf8" />
          <g transform="translate(40 36)">
            <rect width="100" height="36" rx="18" fill="#be123c" />
            <text x="50" y="23" textAnchor="middle" fill="#fff" fontSize={13} fontWeight={800}>
              Me gusta…
            </text>
          </g>
        </Frame>
      )

    case 'reflexives':
      return (
        <Frame uid={g}>
          <rect width="320" height="180" fill="#f0fdfa" />
          {/* bathroom / mirror scene */}
          <rect x="40" y="24" width="120" height="130" rx="12" fill={`url(#${g}-mint)`} />
          <rect x="52" y="36" width="96" height="90" rx="8" fill="#ecfeff" stroke="#99f6e4" strokeWidth="4" />
          <Person x={100} y={100} shirt="#14b8a6" hair="#1c1917" scale={0.75} />
          {/* reflection slightly faded */}
          <g opacity="0.55">
            <Person x={100} y={95} shirt="#5eead4" hair="#1c1917" scale={0.55} flip />
          </g>
          {/* toothbrush / sink */}
          <rect x="190" y="100" width="90" height="50" rx="10" fill="#67e8f9" />
          <ellipse cx="235" cy="110" rx="28" ry="10" fill="#a5f3fc" />
          <rect x="250" y="70" width="10" height="40" rx="4" fill="#f472b6" />
          <rect x="246" y="62" width="18" height="12" rx="4" fill="#fb923c" />
          <text x="235" y="168" textAnchor="middle" fill="#0f766e" fontSize={13} fontWeight={800}>
            me / te / se
          </text>
          <text x="100" y="168" textAnchor="middle" fill="#115e59" fontSize={12} fontWeight={700}>
            mirror · myself
          </text>
        </Frame>
      )

    case 'negation':
      return (
        <Frame uid={g}>
          <rect width="320" height="180" fill="#fff1f2" />
          <Ground uid={g} />
          {/* big NO stamp */}
          <circle cx="160" cy="78" r="52" fill={`url(#${g}-rose)`} opacity="0.95" />
          <circle cx="160" cy="78" r="40" fill="none" stroke="#fff" strokeWidth="6" />
          <text
            x="160"
            y="90"
            textAnchor="middle"
            fill="#fff"
            fontSize={36}
            fontFamily="Georgia, serif"
            fontWeight={700}
          >
            NO
          </text>
          {/* crossed out icons */}
          <g transform="translate(40 120)">
            <rect width="56" height="36" rx="8" fill="#fecdd3" />
            <text x="28" y="23" textAnchor="middle" fill="#9f1239" fontSize={11} fontWeight={800}>
              nada
            </text>
            <line x1="6" y1="6" x2="50" y2="30" stroke="#e11d48" strokeWidth="3" />
          </g>
          <g transform="translate(132 120)">
            <rect width="56" height="36" rx="8" fill="#fecdd3" />
            <text x="28" y="23" textAnchor="middle" fill="#9f1239" fontSize={11} fontWeight={800}>
              nadie
            </text>
            <line x1="6" y1="6" x2="50" y2="30" stroke="#e11d48" strokeWidth="3" />
          </g>
          <g transform="translate(224 120)">
            <rect width="56" height="36" rx="8" fill="#fecdd3" />
            <text x="28" y="23" textAnchor="middle" fill="#9f1239" fontSize={11} fontWeight={800}>
              nunca
            </text>
            <line x1="6" y1="6" x2="50" y2="30" stroke="#e11d48" strokeWidth="3" />
          </g>
        </Frame>
      )

    case 'comparisons':
      return (
        <Frame uid={g}>
          <rect width="320" height="180" fill="#fffbeb" />
          <Ground uid={g} />
          {/* balance scale */}
          <rect x="154" y="40" width="12" height="90" rx="4" fill="#92400e" />
          <circle cx="160" cy="36" r="10" fill={`url(#${g}-sun)`} />
          <line
            x1="70"
            y1="70"
            x2="250"
            y2="70"
            stroke="#b45309"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* left pan smaller */}
          <path d="M50 70 L90 70 L80 110 H60 Z" fill={`url(#${g}-blue)`} />
          <text x="70" y="130" textAnchor="middle" fill="#1e3a8a" fontSize={12} fontWeight={800}>
            menos
          </text>
          {/* right pan bigger */}
          <path d="M230 70 L270 70 L285 120 H215 Z" fill={`url(#${g}-coral)`} />
          <text x="250" y="140" textAnchor="middle" fill="#9a3412" fontSize={12} fontWeight={800}>
            más
          </text>
          <g transform="translate(118 145)">
            <rect width="84" height="24" rx="12" fill="#ca8a04" />
            <text x="42" y="16" textAnchor="middle" fill="#fff" fontSize={11} fontWeight={800}>
              tan · como
            </text>
          </g>
        </Frame>
      )

    case 'demonstratives':
      return (
        <Frame uid={g}>
          <rect width="320" height="180" fill={`url(#${g}-sky)`} opacity="0.5" />
          <Ground uid={g} />
          <Person x={55} y={120} shirt="#2563eb" hair="#1c1917" scale={0.9} />
          {/* near este */}
          <g transform="translate(100 88)">
            <rect width="40" height="40" rx="8" fill="#4ade80" />
            <text x="20" y="58" textAnchor="middle" fill="#166534" fontSize={11} fontWeight={800}>
              este
            </text>
          </g>
          {/* mid ese */}
          <g transform="translate(170 70)">
            <rect width="40" height="40" rx="8" fill="#fbbf24" />
            <text x="20" y="58" textAnchor="middle" fill="#92400e" fontSize={11} fontWeight={800}>
              ese
            </text>
          </g>
          {/* far aquel */}
          <g transform="translate(240 48)">
            <rect width="40" height="40" rx="8" fill="#a78bfa" />
            <text x="20" y="58" textAnchor="middle" fill="#5b21b6" fontSize={11} fontWeight={800}>
              aquel
            </text>
          </g>
          {/* pointing arm visual */}
          <path
            d="M75 95 L115 100"
            stroke="#1d4ed8"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M75 95 L185 78"
            stroke="#ca8a04"
            strokeWidth="3"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />
          <path
            d="M75 95 L250 60"
            stroke="#7c3aed"
            strokeWidth="2"
            strokeDasharray="3 5"
            strokeLinecap="round"
          />
          <text x="160" y="168" textAnchor="middle" fill="#1e3a8a" fontSize={12} fontWeight={700}>
            aquí → ahí → allí
          </text>
        </Frame>
      )

    case 'possessives':
      return (
        <Frame uid={g}>
          <rect width="320" height="180" fill="#fef3c7" />
          <Ground uid={g} />
          {/* house */}
          <path
            d="M60 120 L120 70 L180 120 V160 H60 Z"
            fill={`url(#${g}-coral)`}
          />
          <rect x="100" y="118" width="36" height="42" fill="#fde68a" />
          <circle cx="128" cy="140" r="3" fill="#92400e" />
          <rect x="74" y="100" width="24" height="20" fill="#7dd3fc" />
          <rect x="142" y="100" width="24" height="20" fill="#7dd3fc" />
          {/* key + label mi */}
          <g transform="translate(200 70)">
            <circle cx="20" cy="20" r="18" fill={`url(#${g}-sun)`} />
            <rect x="34" y="16" width="40" height="8" rx="3" fill="#fbbf24" />
            <rect x="64" y="16" width="6" height="16" rx="2" fill="#f59e0b" />
            <rect x="72" y="16" width="6" height="12" rx="2" fill="#f59e0b" />
          </g>
          <g transform="translate(200 120)">
            <rect width="90" height="32" rx="16" fill="#b45309" />
            <text x="45" y="21" textAnchor="middle" fill="#fff" fontSize={13} fontWeight={800}>
              mi casa
            </text>
          </g>
          <text x="120" y="50" textAnchor="middle" fill="#9a3412" fontSize={14} fontWeight={800}>
            mío · tuyo · suyo
          </text>
        </Frame>
      )

    case 'pret-imp':
      return (
        <Frame uid={g}>
          {/* split sky: sunset snap vs soft ongoing */}
          <rect width="160" height="180" fill="#ffedd5" />
          <rect x="160" width="160" height="180" fill="#e0e7ff" />
          <text x="80" y="28" textAnchor="middle" fill="#c2410c" fontSize={13} fontWeight={800}>
            PRETERITE
          </text>
          <text x="240" y="28" textAnchor="middle" fill="#4338ca" fontSize={13} fontWeight={800}>
            IMPERFECT
          </text>
          {/* camera flash / finished moment */}
          <g transform="translate(40 50)">
            <rect width="80" height="60" rx="10" fill={`url(#${g}-coral)`} />
            <circle cx="40" cy="30" r="18" fill="#1c1917" />
            <circle cx="40" cy="30" r="10" fill="#67e8f9" />
            <rect x="58" y="12" width="14" height="10" rx="2" fill="#fde047" />
            <polygon points="40,-8 48,8 32,8" fill="#fbbf24" />
          </g>
          <text x="80" y="140" textAnchor="middle" fill="#9a3412" fontSize={11} fontWeight={700}>
            snap · happened
          </text>
          {/* scrolling film / landscape ongoing */}
          <g transform="translate(185 48)">
            <rect width="100" height="70" rx="12" fill={`url(#${g}-lilac)`} />
            <path d="M0 50 Q30 30 50 48 T100 40 V70 H0 Z" fill="#86efac" />
            <circle cx="78" cy="22" r="10" fill="#fde047" />
            <path
              d="M12 20 h16 M12 32 h22 M12 44 h14"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.7"
            />
          </g>
          <text x="240" y="140" textAnchor="middle" fill="#3730a3" fontSize={11} fontWeight={700}>
            scene · used to
          </text>
          <line
            x1="160"
            y1="36"
            x2="160"
            y2="160"
            stroke="#fff"
            strokeWidth="3"
            strokeDasharray="5 5"
          />
        </Frame>
      )

    case 'commands':
      return (
        <Frame uid={g}>
          <rect width="320" height="180" fill="#fff7ed" />
          <Ground uid={g} />
          <Person x={90} y={118} shirt="#ea580c" hair="#1c1917" />
          {/* megaphone */}
          <g transform="translate(150 48)">
            <path d="M10 30 L70 8 L70 70 L10 48 Z" fill={`url(#${g}-sun)`} />
            <rect x="0" y="28" width="16" height="22" rx="4" fill="#c2410c" />
            <path
              d="M78 20 Q95 39 78 58"
              stroke="#fb923c"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M88 10 Q115 39 88 68"
              stroke="#fdba74"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </g>
          <g transform="translate(40 36)">
            <rect width="88" height="28" rx="14" fill="#16a34a" />
            <text x="44" y="18" textAnchor="middle" fill="#fff" fontSize={12} fontWeight={800}>
              ¡Hazlo!
            </text>
          </g>
          <g transform="translate(40 150)">
            <rect width="110" height="22" rx="11" fill="#e11d48" />
            <text x="55" y="15" textAnchor="middle" fill="#fff" fontSize={11} fontWeight={800}>
              ¡No lo hagas!
            </text>
          </g>
        </Frame>
      )

    case 'all':
    default:
      return (
        <Frame uid={g}>
          <rect width="320" height="180" fill={`url(#${g}-sky)`} opacity="0.55" />
          <rect width="320" height="180" fill={`url(#${g}-glow)`} />
          <Ground uid={g} />
          {/* open book */}
          <path d="M60 50 Q160 30 160 50 L160 140 Q100 120 60 140 Z" fill="#fff" />
          <path d="M260 50 Q160 30 160 50 L160 140 Q220 120 260 140 Z" fill="#fef3c7" />
          <path d="M160 50 V140" stroke="#fdba74" strokeWidth="3" />
          {/* colorful grammar chips on pages */}
          <rect x="78" y="70" width="50" height="14" rx="4" fill="#93c5fd" />
          <rect x="78" y="92" width="40" height="14" rx="4" fill="#86efac" />
          <rect x="78" y="114" width="46" height="14" rx="4" fill="#f9a8d4" />
          <rect x="190" y="70" width="48" height="14" rx="4" fill="#fde047" />
          <rect x="190" y="92" width="42" height="14" rx="4" fill="#c4b5fd" />
          <rect x="190" y="114" width="50" height="14" rx="4" fill="#fdba74" />
          <circle cx="280" cy="36" r="16" fill={`url(#${g}-sun)`} />
          <text
            x="160"
            y="168"
            textAnchor="middle"
            fill="#9a3412"
            fontSize={13}
            fontWeight={800}
          >
            Grammar · see it, then say it
          </text>
        </Frame>
      )
  }
}

/** Rich illustrated scene for each grammar chapter. */
export function GrammarVisual({
  id,
  size = 'hero',
  className = '',
  title,
}: Props) {
  const uid = useId().replace(/:/g, '')

  return (
    <figure
      className={`grammar-visual ${TONE[id]} grammar-visual-${size} ${className}`.trim()}
      aria-hidden={title ? undefined : true}
    >
      <div className="grammar-visual-glow" />
      <div className="grammar-visual-glow grammar-visual-glow-b" />
      <div className="grammar-visual-art">
        <Art id={id} uid={uid} />
      </div>
      {title ? <figcaption className="sr-only">{title}</figcaption> : null}
    </figure>
  )
}
