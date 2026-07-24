import {
  formatNumberDisplay,
  numberPatternGroup,
  numberToSpanish,
  type NumberPatternGroup,
  type NumberRangeId,
} from '../lib/spanishNumbers'

export type NumberCard = {
  id: number
  front: string
  back: string
  value: number
  range: NumberRangeId
  kind: 'foundation' | 'pattern'
  group: NumberPatternGroup
}

/** Hand-picked building blocks + pattern examples learners must know. */
const FOUNDATION_VALUES: {
  value: number
  range: NumberRangeId
  kind: NumberCard['kind']
}[] = [
  // Core 1–20 (irregular)
  ...Array.from({ length: 20 }, (_, i) => ({
    value: i + 1,
    range: '1-20' as const,
    kind: 'foundation' as const,
  })),
  // Twenties (irregular compounds)
  { value: 21, range: '1-100', kind: 'foundation' },
  { value: 22, range: '1-100', kind: 'foundation' },
  { value: 25, range: '1-100', kind: 'foundation' },
  { value: 29, range: '1-100', kind: 'foundation' },
  // Regular tens + y pattern
  { value: 30, range: '1-100', kind: 'foundation' },
  { value: 31, range: '1-100', kind: 'pattern' },
  { value: 40, range: '1-100', kind: 'foundation' },
  { value: 42, range: '1-100', kind: 'pattern' },
  { value: 45, range: '1-100', kind: 'pattern' },
  { value: 50, range: '1-100', kind: 'foundation' },
  { value: 60, range: '1-100', kind: 'foundation' },
  { value: 70, range: '1-100', kind: 'foundation' },
  { value: 80, range: '1-100', kind: 'foundation' },
  { value: 90, range: '1-100', kind: 'foundation' },
  { value: 94, range: '1-100', kind: 'pattern' },
  { value: 99, range: '1-100', kind: 'pattern' },
  // Hundreds — mix irregular (cien, 500/700/900) and regular
  { value: 100, range: '1-1000', kind: 'foundation' },
  { value: 101, range: '1-1000', kind: 'pattern' },
  { value: 115, range: '1-1000', kind: 'pattern' },
  { value: 200, range: '1-1000', kind: 'foundation' },
  { value: 234, range: '1-1000', kind: 'pattern' },
  { value: 300, range: '1-1000', kind: 'foundation' },
  { value: 400, range: '1-1000', kind: 'foundation' },
  { value: 500, range: '1-1000', kind: 'foundation' },
  { value: 600, range: '1-1000', kind: 'foundation' },
  { value: 648, range: '1-1000', kind: 'pattern' },
  { value: 700, range: '1-1000', kind: 'foundation' },
  { value: 800, range: '1-1000', kind: 'foundation' },
  { value: 900, range: '1-1000', kind: 'foundation' },
  { value: 999, range: '1-1000', kind: 'pattern' },
  // Thousands
  { value: 1000, range: '1-10000', kind: 'foundation' },
  { value: 1001, range: '1-10000', kind: 'pattern' },
  { value: 2000, range: '1-10000', kind: 'foundation' },
  { value: 2400, range: '1-10000', kind: 'pattern' },
  { value: 2500, range: '1-10000', kind: 'pattern' },
  { value: 10_000, range: '1-10000', kind: 'foundation' },
  { value: 12_345, range: '1-100000', kind: 'pattern' },
  { value: 21_000, range: '1-100000', kind: 'pattern' },
  { value: 40_000, range: '1-100000', kind: 'pattern' },
  { value: 50_000, range: '1-100000', kind: 'foundation' },
  { value: 100_000, range: '1-100000', kind: 'foundation' },
  { value: 101_000, range: '1-100000', kind: 'pattern' },
  { value: 250_000, range: '1-1000000', kind: 'pattern' },
  { value: 400_000, range: '1-1000000', kind: 'pattern' },
  { value: 500_000, range: '1-1000000', kind: 'foundation' },
  { value: 840_000, range: '1-1000000', kind: 'pattern' },
  { value: 999_999, range: '1-1000000', kind: 'pattern' },
  { value: 1_000_000, range: '1-1000000', kind: 'foundation' },
]

function buildCard(
  id: number,
  value: number,
  range: NumberRangeId,
  kind: NumberCard['kind'],
): NumberCard {
  return {
    id,
    value,
    range,
    kind,
    group: numberPatternGroup(value),
    front: formatNumberDisplay(value),
    back: numberToSpanish(value),
  }
}

export const numberCards: NumberCard[] = FOUNDATION_VALUES.map((item, i) =>
  buildCard(i + 1, item.value, item.range, item.kind),
)

const RANGE_ORDER: NumberRangeId[] = [
  '1-20',
  '1-100',
  '1-1000',
  '1-10000',
  '1-100000',
  '1-1000000',
]

export function filterNumberCards(
  cards: NumberCard[],
  options: {
    range?: NumberRangeId | 'all'
    group?: NumberPatternGroup | 'all'
  } = {},
): NumberCard[] {
  const range = options.range ?? 'all'
  const group = options.group ?? 'all'
  const cutoff = range === 'all' ? Infinity : RANGE_ORDER.indexOf(range)

  return cards.filter((c) => {
    if (group !== 'all' && c.group !== group) return false
    if (range !== 'all' && RANGE_ORDER.indexOf(c.range) > cutoff) return false
    return true
  })
}

export function countNumberGroups(cards: NumberCard[]): {
  regular: number
  irregular: number
} {
  return {
    regular: cards.filter((c) => c.group === 'regular').length,
    irregular: cards.filter((c) => c.group === 'irregular').length,
  }
}

export function getNumberCard(id: number): NumberCard | undefined {
  return numberCards.find((c) => c.id === id)
}
