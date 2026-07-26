/** Browser history helpers so swipe-back / system back leave tracks like a native app. */

export type HablaTrack =
  | 'hub'
  | 'phrases'
  | 'daily'
  | 'verbs'
  | 'numbers'
  | 'colors'
  | 'foundations'
  | 'grammar'
  | 'stories'
  | 'exam'

export type HablaHistoryState = {
  habla: true
  track: HablaTrack
  /** Optional nested view (e.g. story id) */
  storyId?: string | null
}

const TRACKS: HablaTrack[] = [
  'hub',
  'phrases',
  'daily',
  'verbs',
  'numbers',
  'colors',
  'foundations',
  'grammar',
  'stories',
  'exam',
]

export function isHablaTrack(value: unknown): value is HablaTrack {
  return typeof value === 'string' && TRACKS.includes(value as HablaTrack)
}

export function trackFromLocation(
  search = window.location.search,
): HablaTrack {
  const params = new URLSearchParams(search)
  const track = params.get('track')
  return isHablaTrack(track) ? track : 'hub'
}

export function storyIdFromLocation(
  search = window.location.search,
): string | null {
  return new URLSearchParams(search).get('story')
}

export function buildTrackUrl(
  track: HablaTrack,
  storyId?: string | null,
): string {
  const base = import.meta.env.BASE_URL || '/'
  const params = new URLSearchParams()
  if (track !== 'hub') params.set('track', track)
  if (storyId) params.set('story', storyId)
  const q = params.toString()
  return q ? `${base}?${q}` : base
}

export function pushHablaState(
  track: HablaTrack,
  storyId?: string | null,
): void {
  const state: HablaHistoryState = {
    habla: true,
    track,
    storyId: storyId ?? null,
  }
  window.history.pushState(state, '', buildTrackUrl(track, storyId))
}

export function replaceHablaState(
  track: HablaTrack,
  storyId?: string | null,
): void {
  const state: HablaHistoryState = {
    habla: true,
    track,
    storyId: storyId ?? null,
  }
  window.history.replaceState(state, '', buildTrackUrl(track, storyId))
}

/** Prefer history.back() when this entry was pushed by Habla (matches swipe-back). */
export function goBackOr(
  fallback: () => void,
): void {
  const state = window.history.state as HablaHistoryState | null
  if (state?.habla) {
    window.history.back()
    return
  }
  fallback()
}
