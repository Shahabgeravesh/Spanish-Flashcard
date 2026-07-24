/** Convert integers 0–1_000_000 to Spanish cardinal words (Latin American / RAE style). */

const ONES = [
  'cero',
  'uno',
  'dos',
  'tres',
  'cuatro',
  'cinco',
  'seis',
  'siete',
  'ocho',
  'nueve',
  'diez',
  'once',
  'doce',
  'trece',
  'catorce',
  'quince',
  'dieciséis',
  'diecisiete',
  'dieciocho',
  'diecinueve',
]

const TENS = [
  '',
  '',
  'veinte',
  'treinta',
  'cuarenta',
  'cincuenta',
  'sesenta',
  'setenta',
  'ochenta',
  'noventa',
]

const HUNDREDS = [
  '',
  'ciento',
  'doscientos',
  'trescientos',
  'cuatrocientos',
  'quinientos',
  'seiscientos',
  'setecientos',
  'ochocientos',
  'novecientos',
]

function underHundred(n: number): string {
  if (n < 20) return ONES[n]
  if (n < 30) {
    if (n === 20) return 'veinte'
    // 21–29: veintiuno, veintidós, …
    const ones = n - 20
    const stem =
      ones === 2
        ? 'veintidós'
        : ones === 3
          ? 'veintitrés'
          : ones === 6
            ? 'veintiséis'
            : `veinti${ONES[ones]}`
    return stem
  }
  const ten = Math.floor(n / 10)
  const one = n % 10
  if (one === 0) return TENS[ten]
  return `${TENS[ten]} y ${ONES[one]}`
}

function underThousand(n: number): string {
  if (n < 100) return underHundred(n)
  if (n === 100) return 'cien'
  const hundreds = Math.floor(n / 100)
  const rest = n % 100
  const head = HUNDREDS[hundreds]
  if (rest === 0) {
    return hundreds === 1 ? 'cien' : head
  }
  return `${head} ${underHundred(rest)}`
}

/**
 * Spanish words for n in [0, 1_000_000].
 * 1_000_000 → "un millón"
 */
export function numberToSpanish(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 1_000_000) {
    throw new RangeError('numberToSpanish expects an integer from 0 to 1,000,000')
  }
  if (n < 1000) return underThousand(n)

  if (n === 1_000_000) return 'un millón'

  const thousands = Math.floor(n / 1000)
  const rest = n % 1000

  let head: string
  if (thousands === 1) {
    head = 'mil'
  } else {
    // 21 mil → veintiún mil; 31 mil → treinta y un mil
    let left = underThousand(thousands)
    if (thousands % 10 === 1 && thousands % 100 !== 11) {
      left = left.endsWith('veintiuno')
        ? left.replace(/veintiuno$/, 'veintiún')
        : left.replace(/uno$/, 'un')
    }
    head = `${left} mil`
  }

  if (rest === 0) return head
  return `${head} ${underThousand(rest)}`
}

/** Format digits with thin-space thousands separators for 5+ digits (Spanish style). */
export function formatNumberDisplay(n: number): string {
  if (n < 10_000) return String(n)
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')
}

export type NumberRangeId =
  | '1-20'
  | '1-100'
  | '1-1000'
  | '1-10000'
  | '1-100000'
  | '1-1000000'

export const NUMBER_RANGES: {
  id: NumberRangeId
  label: string
  min: number
  max: number
}[] = [
  { id: '1-20', label: '1 – 20', min: 1, max: 20 },
  { id: '1-100', label: '1 – 100', min: 1, max: 100 },
  { id: '1-1000', label: '1 – 1,000', min: 1, max: 1_000 },
  { id: '1-10000', label: '1 – 10,000', min: 1, max: 10_000 },
  { id: '1-100000', label: '1 – 100,000', min: 1, max: 100_000 },
  { id: '1-1000000', label: '1 – 1,000,000', min: 1, max: 1_000_000 },
]

export function randomIntInclusive(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export type NumberPatternGroup = 'regular' | 'irregular'

/**
 * Learner-facing split:
 * - irregular: special forms (1–29, cien, quinientos/setecientos/novecientos,
 *   mil / un millón, veintiún mil apocope, etc.)
 * - regular: formula patterns (treinta y…, doscientos…, dos mil…)
 */
function underThousandIsIrregular(n: number): boolean {
  if (n <= 0) return false
  if (n < 30) return true
  if (n === 100) return true

  const hundreds = Math.floor(n / 100)
  const rest = n % 100

  if (hundreds === 1) return true // cien / ciento…
  if (hundreds === 5 || hundreds === 7 || hundreds === 9) return true
  if (rest > 0 && rest < 30) return true
  return false
}

/** Thousands multiplier only — "dos mil" is regular; "cien mil" / "veintiún mil" are not. */
function thousandsMultiplierIsIrregular(n: number): boolean {
  if (n <= 0) return false
  if (n === 1) return true // bare "mil"
  if (n < 30) return false // dos mil, veinte mil…
  if (n === 100) return true // cien mil

  const hundreds = Math.floor(n / 100)
  const rest = n % 100
  if (hundreds === 1) return true
  if (hundreds === 5 || hundreds === 7 || hundreds === 9) return true
  if (rest > 0 && rest < 30) return true
  return false
}

export function numberPatternGroup(n: number): NumberPatternGroup {
  if (!Number.isInteger(n) || n < 0 || n > 1_000_000) return 'irregular'
  if (n === 1_000_000) return 'irregular'
  if (n === 1000) return 'irregular'

  if (n < 1000) {
    return underThousandIsIrregular(n) ? 'irregular' : 'regular'
  }

  const thousands = Math.floor(n / 1000)
  const rest = n % 1000

  // veintiún mil / treinta y un mil (apocope of uno)
  if (thousands % 10 === 1 && thousands % 100 !== 11) return 'irregular'
  if (thousandsMultiplierIsIrregular(thousands)) return 'irregular'
  if (underThousandIsIrregular(rest)) return 'irregular'
  return 'regular'
}

export function randomNumberInGroup(
  min: number,
  max: number,
  group: NumberPatternGroup,
  attempts = 400,
): number | null {
  for (let i = 0; i < attempts; i += 1) {
    const value = randomIntInclusive(min, max)
    if (numberPatternGroup(value) === group) return value
  }
  // Deterministic fallback scan for small ranges
  const start = randomIntInclusive(min, max)
  for (let offset = 0; offset <= max - min; offset += 1) {
    const value = min + ((start - min + offset) % (max - min + 1))
    if (numberPatternGroup(value) === group) return value
  }
  return null
}

