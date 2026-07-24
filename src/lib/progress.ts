import { shuffle, type FlashCard } from '../data/cards'

export type CardStatus = 'learning' | 'learned'

export type CardProgress = {
  streak: number
  status: CardStatus
}

export type PersistedProgress = {
  version: 1
  byId: Record<string, CardProgress>
  queue: number[]
  index: number
}

/** Consecutive correct answers required to move a card into Learned. */
export const STREAK_TO_LEARNED = 2

export type DeckCard = Pick<FlashCard, 'id' | 'front' | 'back'>

export function defaultProgress(): CardProgress {
  return { streak: 0, status: 'learning' }
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
  return {
    version: 1,
    byId: emptyById(deck),
    queue: buildFreshQueue(deck, shouldShuffle),
    index: 0,
  }
}

export function loadProgress(
  deck: DeckCard[],
  storageKey: string,
): PersistedProgress | null {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedProgress
    if (parsed?.version !== 1 || !parsed.byId || !Array.isArray(parsed.queue)) {
      return null
    }
    return sanitize(deck, parsed)
  } catch {
    return null
  }
}

export function saveProgress(
  state: PersistedProgress,
  storageKey: string,
): void {
  localStorage.setItem(storageKey, JSON.stringify(state))
}

export function clearProgress(storageKey: string): void {
  localStorage.removeItem(storageKey)
}

export function sanitize(
  deck: DeckCard[],
  state: PersistedProgress,
): PersistedProgress {
  const byId = emptyById(deck)
  for (const card of deck) {
    const key = String(card.id)
    const prev = state.byId[key]
    if (prev && (prev.status === 'learning' || prev.status === 'learned')) {
      byId[key] = {
        streak: Math.max(0, Math.floor(Number(prev.streak)) || 0),
        status: prev.status,
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

  return { version: 1, byId, queue, index }
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

  if (nowLearned) {
    const queue = state.queue.filter((id) => id !== cardId)
    const index =
      queue.length === 0 ? 0 : Math.min(state.index, queue.length - 1)
    return { version: 1, byId, queue, index }
  }

  const nextIndex = state.index + 1
  if (nextIndex >= state.queue.length) {
    const queue = rebuildLearningQueue(deck, byId, allowedIds)
    return { version: 1, byId, queue, index: 0 }
  }

  return { version: 1, byId, queue: state.queue, index: nextIndex }
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
  // Current card was removed from its slot; the next card slides into this index.
  const index = state.index

  if (index >= queue.length) {
    return {
      version: 1,
      byId,
      queue: rebuildLearningQueue(deck, byId, allowedIds),
      index: 0,
    }
  }

  return { version: 1, byId, queue, index }
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
    version: 1,
    byId,
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
