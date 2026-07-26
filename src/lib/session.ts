import { canUseStorage } from './progress'

const SESSION_KEY = 'habla:session:v1'

export type HablaSession = {
  lastTrack?: string
  reverseByTrack?: Record<string, boolean>
}

export function loadSession(): HablaSession {
  if (!canUseStorage()) return {}
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as HablaSession
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function saveSession(patch: Partial<HablaSession>): HablaSession {
  const prev = loadSession()
  const next: HablaSession = {
    ...prev,
    ...patch,
    reverseByTrack: {
      ...prev.reverseByTrack,
      ...patch.reverseByTrack,
    },
  }
  if (!canUseStorage()) return next
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(next))
  } catch {
    // ignore
  }
  return next
}

export function getTrackReverse(track: string, fallback = false): boolean {
  return loadSession().reverseByTrack?.[track] ?? fallback
}
