import { useEffect, useState } from 'react'
import { canSpeak, speakSpanish, stopSpeaking, warmUpSpeech } from '../lib/speak'

/** Manual Spanish playback — user taps Listen when they want it. */
export function useSpanishVoice(options: {
  spanishText: string | undefined
}) {
  const { spanishText } = options
  const [supported] = useState(() => canSpeak())

  useEffect(() => {
    warmUpSpeech()
  }, [])

  const replay = () => {
    if (spanishText) speakSpanish(spanishText)
  }

  return {
    supported,
    replay,
    stop: stopSpeaking,
  }
}
