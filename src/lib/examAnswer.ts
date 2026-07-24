/** Normalize learner input for exam scoring. */
export function normalizeExamAnswer(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:…""«»]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Split stored answers that allow alternatives (`a / b`, `a, b`). */
export function splitAcceptedAnswers(back: string): string[] {
  return back
    .split(/\s*\/\s*|\s*\bor\b\s*/i)
    .flatMap((part) => part.split(/\s*,\s*/))
    .map((s) => s.trim())
    .filter(Boolean)
}

export function answersMatch(input: string, accepted: string[]): boolean {
  const got = normalizeExamAnswer(input)
  if (!got) return false
  return accepted.some((a) => normalizeExamAnswer(a) === got)
}
