import type { PronounKey, Tense } from '../data/verbs'

export type VisualTone =
  | 'sky'
  | 'mint'
  | 'sun'
  | 'rose'
  | 'lilac'
  | 'sand'
  | 'ink'
  | 'coral'

export type VisualKey =
  | 'speak'
  | 'eat'
  | 'live'
  | 'identity'
  | 'location'
  | 'have'
  | 'go'
  | 'make'
  | 'want'
  | 'can'
  | 'say'
  | 'come'
  | 'give'
  | 'see'
  | 'know-fact'
  | 'put'
  | 'leave'
  | 'bring'
  | 'hear'
  | 'know-people'
  | 'calendar'
  | 'weather'
  | 'family'
  | 'body'
  | 'clothes'
  | 'place'
  | 'question'
  | 'article'
  | 'gender'
  | 'por-para'
  | 'preposition'
  | 'pronoun'
  | 'gustar'
  | 'reflexive'
  | 'negation'
  | 'compare'
  | 'point'
  | 'possess'
  | 'past-split'
  | 'command'
  | 'food'
  | 'travel'
  | 'hotel'
  | 'health'
  | 'shop'
  | 'cafe'
  | 'polite'
  | 'number'
  | 'color'
  | 'request'
  | 'time'
  | 'default'

export type ResolvedVisual = {
  key: VisualKey
  tone: VisualTone
}

const VERB_VISUAL: Record<string, VisualKey> = {
  hablar: 'speak',
  comer: 'eat',
  vivir: 'live',
  ser: 'identity',
  estar: 'location',
  tener: 'have',
  ir: 'go',
  hacer: 'make',
  querer: 'want',
  poder: 'can',
  decir: 'say',
  venir: 'come',
  dar: 'give',
  ver: 'see',
  saber: 'know-fact',
  poner: 'put',
  salir: 'leave',
  traer: 'bring',
  oír: 'hear',
  oir: 'hear',
  conocer: 'know-people',
}

const SECTION_VISUAL: Record<string, VisualKey> = {
  days: 'calendar',
  months: 'calendar',
  seasons: 'weather',
  questions: 'question',
  articles: 'article',
  'ser-estar': 'identity',
  family: 'family',
  body: 'body',
  clothing: 'clothes',
  places: 'place',
  routines: 'reflexive',
  frequency: 'time',
  commands: 'command',
  gender: 'gender',
  'por-para': 'por-para',
  prepositions: 'preposition',
  'object-pronouns': 'pronoun',
  gustar: 'gustar',
  reflexives: 'reflexive',
  negation: 'negation',
  comparisons: 'compare',
  demonstratives: 'point',
  possessives: 'possess',
  'pret-imp': 'past-split',
}

const CATEGORY_VISUAL: Record<string, VisualKey> = {
  food: 'food',
  cafe: 'cafe',
  coffee: 'cafe',
  restaurant: 'food',
  travel: 'travel',
  transport: 'travel',
  hotel: 'hotel',
  lodging: 'hotel',
  doctor: 'health',
  health: 'health',
  shop: 'shop',
  shopping: 'shop',
  market: 'shop',
  greetings: 'polite',
  polite: 'polite',
  home: 'live',
  routine: 'reflexive',
  work: 'make',
  school: 'know-fact',
  weather: 'weather',
  time: 'time',
  directions: 'go',
  family: 'family',
  commands: 'command',
  help: 'speak',
}

const KEYWORD_RULES: { re: RegExp; key: VisualKey }[] = [
  { re: /\b(menu|carta|eat|comer|comida|food|bill|cuenta|breakfast|almuerzo|cena)\b/i, key: 'food' },
  { re: /\b(coffee|café|tea|té|juice|jugo)\b/i, key: 'cafe' },
  { re: /\b(hotel|room|habitación|check.?in|llave)\b/i, key: 'hotel' },
  { re: /\b(train|tren|bus|vuelo|airport|aeropuerto|ticket|billete|viaje)\b/i, key: 'travel' },
  { re: /\b(doctor|médico|duele|pain|farmacia|sick|enferm)/i, key: 'health' },
  { re: /\b(buy|comprar|shop|tienda|market|mercado|price|precio)\b/i, key: 'shop' },
  { re: /\b(please|por favor|thank|gracias|sorry|perdón|disculp)/i, key: 'polite' },
  { re: /\b(brush|teeth|dientes|comb|peino|shower|ducho|wake|despierto|levant|lavo|acost|routine|cepill|pijama|pajama)\b/i, key: 'reflexive' },
  { re: /\b(mother|father|madre|padre|hermano|hermana|family|familia|abuelo|tío)\b/i, key: 'family' },
  { re: /\b(hand|mano|head|cabeza|eye|ojo|body|cuerpo|foot|pie)\b/i, key: 'body' },
  { re: /\b(shirt|camisa|pants|pantalón|dress|vestido|shoe|zapato|hat|sombrero)\b/i, key: 'clothes' },
  { re: /\b(house|casa|school|escuela|park|parque|city|ciudad|street|calle)\b/i, key: 'place' },
  { re: /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|lunes|martes|miércoles|jueves|viernes|sábado|domingo)\b/i, key: 'calendar' },
  { re: /\b(january|february|march|april|may|june|july|august|september|october|november|december|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\b/i, key: 'calendar' },
  { re: /\b(spring|summer|autumn|fall|winter|primavera|verano|otoño|invierno)\b/i, key: 'weather' },
  { re: /\b(what|quién|quien|dónde|donde|cuándo|cuando|cómo|como|cuánto|cuanto|why|por qué)\b/i, key: 'question' },
  { re: /\b(can i|can you|puedo|puedes|want|quiero|would like|gustaría)\b/i, key: 'request' },
  { re: /\b(bring|traer|tráeme|see|ver|go|voy|ir)\b/i, key: 'request' },
  { re: /\b(ser|estar|identity|location)\b/i, key: 'identity' },
  { re: /\b(por\b|para\b)\b/i, key: 'por-para' },
  { re: /\b(gustar|encantar|doler)\b/i, key: 'gustar' },
  { re: /\b(no |nunca|nadie|nada|ningún)\b/i, key: 'negation' },
]

const TONE_BY_KEY: Record<VisualKey, VisualTone> = {
  speak: 'sky',
  eat: 'sun',
  live: 'mint',
  identity: 'lilac',
  location: 'mint',
  have: 'sand',
  go: 'sky',
  make: 'coral',
  want: 'rose',
  can: 'sky',
  say: 'lilac',
  come: 'mint',
  give: 'rose',
  see: 'sky',
  'know-fact': 'lilac',
  put: 'sand',
  leave: 'coral',
  bring: 'sun',
  hear: 'lilac',
  'know-people': 'rose',
  calendar: 'sky',
  weather: 'sun',
  family: 'rose',
  body: 'coral',
  clothes: 'lilac',
  place: 'mint',
  question: 'sun',
  article: 'sand',
  gender: 'lilac',
  'por-para': 'coral',
  preposition: 'sand',
  pronoun: 'sky',
  gustar: 'rose',
  reflexive: 'mint',
  negation: 'ink',
  compare: 'sun',
  point: 'sky',
  possess: 'sand',
  'past-split': 'lilac',
  command: 'coral',
  food: 'sun',
  travel: 'sky',
  hotel: 'lilac',
  health: 'mint',
  shop: 'coral',
  cafe: 'sand',
  polite: 'rose',
  number: 'sky',
  color: 'sun',
  request: 'coral',
  time: 'sand',
  default: 'mint',
}

export type VisualHints = {
  /** Explicit override */
  key?: VisualKey
  front?: string
  back?: string
  tip?: string
  section?: string
  category?: string
  situation?: string
  infinitive?: string
  tense?: Tense
  pronounKey?: PronounKey
  swatch?: string
  value?: number
  kind?: string
}

export function resolveCardVisual(hints: VisualHints): ResolvedVisual {
  if (hints.key) {
    return { key: hints.key, tone: TONE_BY_KEY[hints.key] }
  }

  if (hints.swatch || hints.kind === 'basic' || hints.kind === 'shade') {
    return { key: 'color', tone: 'sun' }
  }

  if (hints.value != null || hints.kind === 'number' || hints.section === 'numbers') {
    return { key: 'number', tone: 'sky' }
  }

  if (hints.infinitive) {
    const fromVerb = VERB_VISUAL[hints.infinitive.toLowerCase()]
    if (fromVerb) return { key: fromVerb, tone: TONE_BY_KEY[fromVerb] }
  }

  if (hints.section) {
    const fromSection = SECTION_VISUAL[hints.section]
    if (fromSection) return { key: fromSection, tone: TONE_BY_KEY[fromSection] }
  }

  const cat = (hints.category ?? hints.situation ?? '').toLowerCase()
  if (cat) {
    for (const [needle, key] of Object.entries(CATEGORY_VISUAL)) {
      if (cat.includes(needle)) return { key, tone: TONE_BY_KEY[key] }
    }
  }

  const blob = [hints.front, hints.back, hints.tip, hints.section, hints.category]
    .filter(Boolean)
    .join(' ')

  for (const rule of KEYWORD_RULES) {
    if (rule.re.test(blob)) {
      return { key: rule.key, tone: TONE_BY_KEY[rule.key] }
    }
  }

  return { key: 'default', tone: 'mint' }
}
