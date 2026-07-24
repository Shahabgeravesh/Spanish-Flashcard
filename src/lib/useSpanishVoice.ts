import { useEffect, useState } from 'react'
import { canSpeak, speakSpanish, stopSpeaking, warmUpSpeech } from '../lib/speak'
import { loadSession, saveSession } from '../lib/session'

/** Auto-read Spanish when the Spanish side of a card is showing. */
export function useSpanishVoice(options: {
  spanishText: string | undefined
  /** True when the Spanish face is visible */
  showingSpanish: boolean
  /** Change when the card identity changes */
  cardKey: string | number | undefined
}) {
  const { spanishText, showingSpanish, cardKey } = options
  const [autoSpeak, setAutoSpeakState] = useState(
    () => loadSession().autoSpeak !== false,
  )
  const [supported] = useState(() => canSpeak())

  useEffect(() => {
    warmUpSpeech()
  }, [])

  useEffect(() => {
    if (!supported || !autoSpeak || !spanishText?.trim()) return
    if (!showingSpanish) {
      stopSpeaking()
      return
    }
    speakSpanish(spanishText)
    return () => stopSpeaking()
  }, [supported, autoSpeak, showingSpanish, spanishText, cardKey])

  const setAutoSpeak = (on: boolean) => {
    setAutoSpeakState(on)
    saveSession({ autoSpeak: on })
    if (!on) stopSpeaking()
    else if (showingSpanish && spanishText) speakSpanish(spanishText)
  }

  const replay = () => {
    if (spanishText) speakSpanish(spanishText)
  }

  return {
    supported,
    autoSpeak,
    setAutoSpeak,
    replay,
    stop: stopSpeaking,
  }
}
