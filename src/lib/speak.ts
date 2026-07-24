/** Spanish text-to-speech via the Web Speech API. */

export type SpanishVoiceLang = 'es-ES' | 'es-MX' | 'es-US' | 'es-AR'

let voicesReady: Promise<SpeechSynthesisVoice[]> | null = null

function getSynth(): SpeechSynthesis | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  return window.speechSynthesis
}

export function canSpeak(): boolean {
  return getSynth() != null
}

export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  const synth = getSynth()
  if (!synth) return Promise.resolve([])

  const current = synth.getVoices()
  if (current.length > 0) return Promise.resolve(current)

  if (voicesReady) return voicesReady

  voicesReady = new Promise((resolve) => {
    const done = () => {
      resolve(synth.getVoices())
      synth.removeEventListener('voiceschanged', done)
    }
    synth.addEventListener('voiceschanged', done)
    // Fallback if voiceschanged never fires
    window.setTimeout(() => {
      resolve(synth.getVoices())
      synth.removeEventListener('voiceschanged', done)
    }, 750)
  })

  return voicesReady
}

function pickSpanishVoice(
  voices: SpeechSynthesisVoice[],
  preferred: SpanishVoiceLang = 'es-ES',
): SpeechSynthesisVoice | undefined {
  const es = voices.filter((v) => v.lang.toLowerCase().startsWith('es'))
  if (es.length === 0) return undefined

  const exact = es.find((v) => v.lang.replace('_', '-') === preferred)
  if (exact) return exact

  const ranked = [...es].sort((a, b) => {
    const score = (v: SpeechSynthesisVoice) => {
      const lang = v.lang.toLowerCase()
      let s = 0
      if (lang.startsWith('es-es')) s += 3
      if (lang.startsWith('es-mx')) s += 2
      if (lang.startsWith('es-us')) s += 1
      if (/google|microsoft|premium|enhanced|neural/i.test(v.name)) s += 4
      if (/jorge|paulina|sabina|monica|enrique|juan|lucia/i.test(v.name)) s += 2
      return s
    }
    return score(b) - score(a)
  })

  return ranked[0]
}

export function cleanSpanishForSpeech(text: string): string {
  return text
    .replace(/\s*\/\s*/g, '. ')
    .replace(/\s*\|\s*/g, '. ')
    .replace(/[…·]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function stopSpeaking(): void {
  const synth = getSynth()
  if (!synth) return
  synth.cancel()
}

/** Speak Spanish aloud. Safe to call repeatedly — cancels any current utterance. */
export function speakSpanish(
  text: string,
  options: { lang?: SpanishVoiceLang; rate?: number } = {},
): void {
  const synth = getSynth()
  if (!synth) return

  const cleaned = cleanSpanishForSpeech(text)
  if (!cleaned) return

  const lang = options.lang ?? 'es-ES'
  const rate = options.rate ?? 0.9

  const run = (voices: SpeechSynthesisVoice[]) => {
    synth.cancel()

    const utterance = new SpeechSynthesisUtterance(cleaned)
    utterance.lang = lang
    utterance.rate = rate
    utterance.pitch = 1

    const voice = pickSpanishVoice(voices, lang)
    if (voice) {
      utterance.voice = voice
      utterance.lang = voice.lang
    }

    // Chrome sometimes stays paused after cancel — nudge it.
    if (synth.paused) synth.resume()

    try {
      // Call speak() synchronously when possible so Reveal taps work on iOS.
      synth.speak(utterance)
    } catch {
      // ignore
    }
  }

  const ready = synth.getVoices()
  if (ready.length > 0) {
    run(ready)
    return
  }

  void loadVoices().then(run)
}

/** Warm up voices on first user gesture / app load. */
export function warmUpSpeech(): void {
  void loadVoices()
}
