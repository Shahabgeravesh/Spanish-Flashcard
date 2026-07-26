export type CardExample = {
  es: string
  en: string
}

type CardLike = {
  front: string
  back: string
  tip?: string
  exampleEs?: string
  exampleEn?: string
}

function looksSpanish(text: string): boolean {
  return (
    /[áéíóúñ¿¡]/i.test(text) ||
    /\b(el|la|los|las|un|una|unos|unas|de|en|a|que|por|para|con|mi|tu|su|es|está|soy|voy|quiero|puedo|me|te|se|nos|hola|buenos|buenas)\b/i.test(
      text,
    )
  )
}

const ENGLISH_STOP =
  /\b(the|and|for|with|from|that|this|are|is|to|until|after|before|never|always|also|often|switch|used|add|fine|universal|informal|roughly|include|exceptions?|default|pattern|learn)\b/i

function mostlySpanish(text: string): boolean {
  if (!looksSpanish(text)) return false
  const words = text.match(/[A-Za-záéíóúñÁÉÍÓÚÑüÜ]+/g) ?? []
  if (words.length === 0) return false
  const enHits = words.filter((w) => ENGLISH_STOP.test(w)).length
  if (words.length <= 4 && enHits === 0) return true
  return enHits <= Math.max(1, Math.floor(words.length / 4))
}

function isMetaPrompt(front: string): boolean {
  const f = front.trim().toLowerCase()
  // Real phrases like "How are you?" are learner content, not grammar prompts
  if (
    f.endsWith('?') &&
    !/^(how do you|how to|which|what is the difference|when do you)\b/.test(f)
  ) {
    return false
  }
  return (
    f.includes('…') ||
    f.includes('...') ||
    /^(most|use|choose|when|which|what|the difference|agree|nouns|adjectives)\b/.test(
      f,
    ) ||
    f.endsWith(' are…') ||
    f.endsWith(' is…') ||
    /\bvs\b/.test(f) ||
    /\(exception\)|\(profession\)/.test(f)
  )
}

/** English tip residue that should never be shown as the Spanish example. */
function isBadExampleEs(text: string): boolean {
  const t = text.trim()
  if (t.length < 2) return true
  const lows = t.toLowerCase()
  if (
    /^(or|not|also|often|after|before|accent|irregular|default|example|use|masculine|feminine|a \+ el|de \+ el)\b/.test(
      lows,
    )
  ) {
    return true
  }
  if (/\b(in some regions|in many places|see the tip|from fotografía|needed:)\b/.test(lows)) {
    return true
  }
  if (
    !looksSpanish(t) &&
    /\b(the|and|for|with|from|that|this|are|is|to)\b/.test(lows)
  ) {
    return true
  }
  return false
}

function firstSpanishSentence(text: string): string | null {
  const q = text.match(/¿[^?!]+\?/)
  if (q && mostlySpanish(q[0])) return q[0].trim()
  const excl = text.match(/¡[^!]+!/)
  if (excl && mostlySpanish(excl[0])) return excl[0].trim()

  const articlePhrase = text.match(
    /\b((?:el|la|los|las|un|una|unos|unas|buenos|buenas)\s+[a-záéíóúñü]+(?:\s+[a-záéíóúñü]+){0,4})/i,
  )
  if (articlePhrase && mostlySpanish(articlePhrase[1])) {
    const p = articlePhrase[1].trim().replace(/[.,;:]+$/, '')
    return p.charAt(0).toUpperCase() + p.slice(1)
  }

  // Take a Spanish-looking clause (allow commas for twin examples)
  const chunks = text.split(/(?<=[.!;])\s+| · |\s+\/\s+/)
  for (const chunk of chunks) {
    const c = chunk.trim().replace(/^[:\-—]\s*/, '')
    if (c.length >= 4 && mostlySpanish(c)) return c.replace(/\.$/, '')
  }
  if (mostlySpanish(text.trim()) && text.trim().length >= 4) {
    return text.trim().replace(/\.$/, '')
  }
  return null
}

/** Pull the best Spanish snippet out of a tip. */
export function extractSpanishFromTip(tip?: string): string | null {
  if (!tip?.trim()) return null
  const tipClean = tip.trim()

  // Prefer labeled examples
  const labeled = tipClean.match(
    /(?:example|e\.g\.|eg\.|say|try|like|pattern)\s*[:—-]\s*(.+)$/i,
  )
  if (labeled) {
    const found = firstSpanishSentence(labeled[1])
    if (found) return found
  }

  // Any clause after a colon
  if (tipClean.includes(':')) {
    const after = tipClean.slice(tipClean.indexOf(':') + 1).trim()
    const found = firstSpanishSentence(after)
    if (found) return found
  }

  const direct = firstSpanishSentence(tipClean)
  if (direct) return direct

  // Parenthetical Spanish
  for (const p of tipClean.matchAll(/\(([^)]+)\)/g)) {
    const found = firstSpanishSentence(p[1])
    if (found) return found
  }
  return null
}

function polishPair(es: string, en: string): CardExample {
  return { es: es.trim(), en: en.trim() }
}

/**
 * Resolve a bilingual example the learner can feel on every reveal.
 * Prefers rich tip sentences, then explicit fields, then the card pair.
 */
export function resolveCardExample(card: CardLike): CardExample | null {
  const tipEs = extractSpanishFromTip(card.tip)
  const storedEsRaw = card.exampleEs?.trim()
  const storedEs =
    storedEsRaw && !isBadExampleEs(storedEsRaw) ? storedEsRaw : undefined
  const storedEn = card.exampleEn?.trim()

  // Tip Spanish wins when it's richer than a lone vocab word on the card
  if (tipEs) {
    const tipRicher =
      !storedEs ||
      isBadExampleEs(storedEs) ||
      tipEs.length >= storedEs.length + 3 ||
      (storedEs.split(/\s+/).length <= 2 && tipEs.split(/\s+/).length >= 3)
    if (tipRicher) {
      const en =
        storedEn &&
        storedEn.length > 2 &&
        !isMetaPrompt(storedEn) &&
        storedEn.toLowerCase() !== tipEs.toLowerCase()
          ? storedEn
          : !isMetaPrompt(card.front)
            ? card.front.trim()
            : storedEn && !isMetaPrompt(storedEn)
              ? storedEn
              : 'In context'
      return polishPair(tipEs, en)
    }
  }

  if (storedEs && storedEn) {
    const en = isMetaPrompt(storedEn)
      ? !isMetaPrompt(card.front)
        ? card.front.trim()
        : 'In context'
      : storedEn
    return polishPair(storedEs, en)
  }

  if (isMetaPrompt(card.front)) {
    if (tipEs) {
      return polishPair(tipEs, 'In context')
    }
    return null
  }

  const es = (storedEs || card.back).trim()
  if (isBadExampleEs(es)) return tipEs ? polishPair(tipEs, card.front.trim()) : null
  const en = (storedEn && !isMetaPrompt(storedEn) ? storedEn : card.front).trim()
  if (!es || !en) return null
  return polishPair(es, en)
}
