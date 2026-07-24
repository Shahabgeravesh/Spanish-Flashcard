import { useEffect, useRef } from 'react'
import {
  canUseStorage,
  saveProgress,
  type DeckCard,
  type PersistedProgress,
} from './progress'

/**
 * Persist progress whenever it changes, and flush again when the tab hides
 * or the page unloads so a quick exit still keeps mastery.
 */
export function usePersistentProgress(
  progress: PersistedProgress,
  storageKey: string,
  deck: DeckCard[],
  _legacyKeys: string[] = [],
) {
  const latest = useRef(progress)
  latest.current = progress
  const deckRef = useRef(deck)
  deckRef.current = deck

  useEffect(() => {
    saveProgress(progress, storageKey, deck)
  }, [progress, storageKey, deck])

  useEffect(() => {
    if (!canUseStorage()) return

    const flush = () => {
      saveProgress(latest.current, storageKey, deckRef.current)
    }

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush()
    }

    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      flush()
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [storageKey])
}
