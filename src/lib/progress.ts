import { shuffle, type FlashCard } from '../data/cards'

export type CardStatus = 'learning' | 'learned'

export type CardProgress = {
  streak: number
  status: CardStatus
}

export type PersistedProgress = {
  /** v1 = byId only; v2 also stores byKey so deck edits don’t wipe mastery */
  version: 1 | 2
  byId: Record<string, CardProgress>
  /** Stable key from card front text → progress (version 2+) */
  byKey?: Record<string, CardProgress>
  queue: number[]
  index: number
}

/** Consecutive correct answers required to move a card into Learned. */
export const STREAK_TO_LEARNED = 2

export type DeckCard = Pick<FlashCard, 'id' | 'front' | 'back'>

export function defaultProgress(): CardProgress {
  return { streak: 0, status: 'learning' }
}

/** Normalize prompt text into a stable progress key. */
export function stableCardKey(front: string): string {
  return front.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function emptyById(deck: DeckCard[]): Record<string, CardProgress> {
  const byId: Record<string, CardProgress> = {}
  for (const card of deck) {
    byId[String(card.id)] = defaultProgress()
  }
  return byId
}

export function buildFreshQueue(
  deck: DeckCard[],
  shouldShuffle: boolean,
): number[] {
  const ids = deck.map((c) => c.id)
  return shouldShuffle ? shuffle(ids) : ids
}

export function createFreshState(
  deck: DeckCard[],
  shouldShuffle = true,
): PersistedProgress {
  return withStableKeys(
    {
      version: 2,
      byId: emptyById(deck),
      queue: buildFreshQueue(deck, shouldShuffle),
      index: 0,
    },
    deck,
  )
}

export function canUseStorage(): boolean {
  try {
    const probe = '__habla_storage_probe__'
    localStorage.setItem(probe, '1')
    localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

function readRaw(storageKey: string): PersistedProgress | null {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedProgress
    if (
      (parsed?.version !== 1 && parsed?.version !== 2) ||
      !parsed.byId ||
      !Array.isArray(parsed.queue)
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

/**
 * Load progress for a deck. Tries the primary key, then any legacy keys
 * (migrates forward on successful legacy read).
 */
export function loadProgress(
  deck: DeckCard[],
  storageKey: string,
  legacyKeys: string[] = [],
): PersistedProgress | null {
  if (!canUseStorage()) return null

  const keys = [storageKey, ...legacyKeys]
  for (const key of keys) {
    const parsed = readRaw(key)
    if (!parsed) continue
    const sanitized = sanitize(deck, parsed)
    // Migrate legacy → primary so the next visit finds it under the new name.
    if (key !== storageKey) {
      saveProgress(sanitized, storageKey, deck)
    }
    return sanitized
  }
  return null
}

export function withStableKeys(
  state: PersistedProgress,
  deck: DeckCard[],
): PersistedProgress {
  const byKey: Record<string, CardProgress> = { ...(state.byKey ?? {}) }
  for (const card of deck) {
    const progress = state.byId[String(card.id)]
    if (progress) {
      byKey[stableCardKey(card.front)] = { ...progress }
    }
  }
  return {
    ...state,
    version: 2,
    byKey,
  }
}

export function saveProgress(
  state: PersistedProgress,
  storageKey: string,
  deck?: DeckCard[],
): void {
  if (!canUseStorage()) return
  try {
    const payload = deck ? withStableKeys(state, deck) : { ...state, version: 2 as const }
    localStorage.setItem(storageKey, JSON.stringify(payload))
  } catch {
    // Quota / private mode — keep studying in-memory.
  }
}

export function clearProgress(storageKey: string, legacyKeys: string[] = []): void {
  if (!canUseStorage()) return
  try {
    localStorage.removeItem(storageKey)
    for (const key of legacyKeys) localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

function pickBetter(
  a: CardProgress | undefined,
  b: CardProgress | undefined,
): CardProgress | undefined {
  if (!a) return b
  if (!b) return a
  if (a.status === 'learned' && b.status !== 'learned') return a
  if (b.status === 'learned' && a.status !== 'learned') return b
  return a.streak >= b.streak ? a : b
}

export function sanitize(
  deck: DeckCard[],
  state: PersistedProgress,
): PersistedProgress {
  const byKeyIn = state.byKey ?? {}
  const byId = emptyById(deck)

  for (const card of deck) {
    const key = String(card.id)
    const fromId = state.byId[key]
    const fromFront = byKeyIn[stableCardKey(card.front)]
    const prev = pickBetter(fromId, fromFront)
    if (prev && (prev.status === 'learning' || prev.status === 'learned')) {
      byId[key] = {
        streak: Math.max(0, Math.floor(Number(prev.streak)) || 0),
        status: prev.status,
      }
      if (prev.status === 'learned') {
        byId[key].streak = Math.max(byId[key].streak, STREAK_TO_LEARNED)
      }
    }
  }

  const learningIds = new Set(
    deck
      .filter((c) => byId[String(c.id)].status === 'learning')
      .map((c) => c.id),
  )
  const seen = new Set<number>()
  const queue: number[] = []
  for (const id of state.queue) {
    if (!learningIds.has(id) || seen.has(id)) continue
    seen.add(id)
    queue.push(id)
  }
  for (const id of learningIds) {
    if (!seen.has(id)) {
      seen.add(id)
      queue.push(id)
    }
  }

  const index =
    queue.length === 0
      ? 0
      : Math.min(Math.max(0, state.index || 0), queue.length - 1)

  return withStableKeys({ version: 2, byId, queue, index }, deck)
}

/**
 * Prefer the saved queue/index when it still has learning cards for this
 * section; otherwise build a fresh shuffled queue. Avoids “start over”
 * when the learner taps Continue.
 */
export function resumeStudyQueue(
  state: PersistedProgress,
  deck: DeckCard[],
  shouldShuffle: boolean,
  allowedIds?: Set<number>,
): { queue: number[]; index: number } {
  const learning = new Set(
    deck
      .filter((c) => {
        if (state.byId[String(c.id)]?.status === 'learned') return false
        if (allowedIds && !allowedIds.has(c.id)) return false
        return true
      })
      .map((c) => c.id),
  )

  if (learning.size === 0) {
    return { queue: [], index: 0 }
  }

  const seen = new Set<number>()
  const resumed: number[] = []
  for (const id of state.queue) {
    if (!learning.has(id) || seen.has(id)) continue
    seen.add(id)
    resumed.push(id)
  }

  // Saved queue still covers this section — keep place in line.
  if (resumed.length > 0 && resumed.length >= Math.min(3, learning.size)) {
    for (const id of learning) {
      if (!seen.has(id)) resumed.push(id)
    }
    const index = Math.min(Math.max(0, state.index || 0), resumed.length - 1)
    // If index points past cards already learned out of queue, clamp; if the
    // card at index isn’t in the section, snap to first remaining.
    const at = resumed[index]
    const safeIndex =
      at != null && learning.has(at)
        ? index
        : resumed.findIndex((id) => learning.has(id))
    return {
      queue: resumed,
      index: safeIndex < 0 ? 0 : safeIndex,
    }
  }

  return {
    queue: buildStudyQueue(deck, state.byId, shouldShuffle, allowedIds),
    index: 0,
  }
}

export function learnedCards<T extends DeckCard>(
  deck: T[],
  byId: Record<string, CardProgress>,
): T[] {
  return deck.filter((c) => byId[String(c.id)]?.status === 'learned')
}

export function learningCount(
  deck: DeckCard[],
  byId: Record<string, CardProgress>,
): number {
  return deck.filter((c) => byId[String(c.id)]?.status !== 'learned').length
}

export function learnedCount(
  deck: DeckCard[],
  byId: Record<string, CardProgress>,
): number {
  return deck.filter((c) => byId[String(c.id)]?.status === 'learned').length
}

/**
 * Smooth mastery 0–100: full points for learned cards, partial credit for
 * in-progress streaks — so the bar moves as the person learns, not only
 * when a card is fully mastered.
 */
export function deckMasteryPercent(
  deck: DeckCard[],
  byId: Record<string, CardProgress>,
): number {
  if (deck.length === 0) return 0
  const max = deck.length * STREAK_TO_LEARNED
  let points = 0
  for (const card of deck) {
    const p = byId[String(card.id)]
    if (!p) continue
    if (p.status === 'learned') {
      points += STREAK_TO_LEARNED
    } else {
      points += Math.min(STREAK_TO_LEARNED, Math.max(0, p.streak))
    }
  }
  return Math.round((points / max) * 100)
}

/**
 * Move a missed card a few places later in the remaining queue
 * (not immediately next when enough cards remain).
 */
export function requeueMissed(
  queue: number[],
  fromIndex: number,
  cardId: number,
): number[] {
  const before = queue.slice(0, fromIndex)
  const remaining = queue.slice(fromIndex + 1).filter((id) => id !== cardId)
  const insertAt = Math.min(remaining.length, 2 + Math.floor(Math.random() * 3))
  return [
    ...before,
    ...remaining.slice(0, insertAt),
    cardId,
    ...remaining.slice(insertAt),
  ]
}

function rebuildLearningQueue(
  deck: DeckCard[],
  byId: Record<string, CardProgress>,
  allowedIds?: Set<number>,
): number[] {
  return shuffle(
    deck
      .filter((c) => {
        if (byId[String(c.id)].status !== 'learning') return false
        if (allowedIds && !allowedIds.has(c.id)) return false
        return true
      })
      .map((c) => c.id),
  )
}

export function markCorrect(
  deck: DeckCard[],
  state: PersistedProgress,
  cardId: number,
  allowedIds?: Set<number>,
): PersistedProgress {
  const key = String(cardId)
  const prev = state.byId[key] ?? defaultProgress()
  const streak = prev.streak + 1
  const nowLearned = streak >= STREAK_TO_LEARNED

  const byId = {
    ...state.byId,
    [key]: {
      streak,
      status: (nowLearned ? 'learned' : 'learning') as CardStatus,
    },
  }

  let next: PersistedProgress
  if (nowLearned) {
    const queue = state.queue.filter((id) => id !== cardId)
    const index =
      queue.length === 0 ? 0 : Math.min(state.index, queue.length - 1)
    next = { version: 2, byId, byKey: state.byKey, queue, index }
  } else {
    const nextIndex = state.index + 1
    if (nextIndex >= state.queue.length) {
      const queue = rebuildLearningQueue(deck, byId, allowedIds)
      next = { version: 2, byId, byKey: state.byKey, queue, index: 0 }
    } else {
      next = {
        version: 2,
        byId,
        byKey: state.byKey,
        queue: state.queue,
        index: nextIndex,
      }
    }
  }

  return withStableKeys(next, deck)
}

export function markIncorrect(
  deck: DeckCard[],
  state: PersistedProgress,
  cardId: number,
  allowedIds?: Set<number>,
): PersistedProgress {
  const key = String(cardId)
  const byId = {
    ...state.byId,
    [key]: { streak: 0, status: 'learning' as CardStatus },
  }

  const queue = requeueMissed(state.queue, state.index, cardId)
  const index = state.index

  let next: PersistedProgress
  if (index >= queue.length) {
    next = {
      version: 2,
      byId,
      byKey: state.byKey,
      queue: rebuildLearningQueue(deck, byId, allowedIds),
      index: 0,
    }
  } else {
    next = { version: 2, byId, byKey: state.byKey, queue, index }
  }

  return withStableKeys(next, deck)
}

/** Move selected learned cards back into the active learning queue. */
export function unlearnCards(
  state: PersistedProgress,
  ids: number[],
  shouldShuffle = true,
): PersistedProgress {
  const byId = { ...state.byId }
  const returning: number[] = []

  for (const id of ids) {
    const key = String(id)
    if (byId[key]?.status === 'learned') {
      byId[key] = { streak: 0, status: 'learning' }
      returning.push(id)
    }
  }

  if (returning.length === 0) return state

  const existing = new Set(state.queue)
  const additions = returning.filter((id) => !existing.has(id))
  const queue = shouldShuffle
    ? shuffle([...state.queue, ...additions])
    : [...state.queue, ...additions]

  return {
    version: 2,
    byId,
    byKey: state.byKey,
    queue,
    index: queue.length === 0 ? 0 : Math.min(state.index, queue.length - 1),
  }
}

export function buildStudyQueue(
  deck: DeckCard[],
  byId: Record<string, CardProgress>,
  shouldShuffle: boolean,
  allowedIds?: Set<number>,
): number[] {
  const ids = deck
    .filter((c) => {
      if (byId[String(c.id)]?.status === 'learned') return false
      if (allowedIds && !allowedIds.has(c.id)) return false
      return true
    })
    .map((c) => c.id)

  return shouldShuffle ? shuffle(ids) : ids
}
