import { canUseStorage } from './progress'
import { EXAM_SECTIONS, type ExamSectionId } from '../data/exam'

export const EXAM_KEY = 'habla:exam:v1'

export type ExamSectionStats = {
  attempts: number
  bestPercent: number
  lastPercent: number
  lastScore: number
  lastTotal: number
  lastAt: number
}

export type ExamProgress = {
  bySection: Partial<Record<ExamSectionId, ExamSectionStats>>
}

function empty(): ExamProgress {
  return { bySection: {} }
}

export function loadExamProgress(): ExamProgress {
  if (!canUseStorage()) return empty()
  try {
    const raw = localStorage.getItem(EXAM_KEY)
    if (!raw) return empty()
    const parsed = JSON.parse(raw) as ExamProgress
    return {
      bySection: parsed.bySection ?? {},
    }
  } catch {
    return empty()
  }
}

export function saveExamProgress(next: ExamProgress) {
  if (!canUseStorage()) return
  try {
    localStorage.setItem(EXAM_KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
}

export function clearExamProgress() {
  if (!canUseStorage()) return
  try {
    localStorage.removeItem(EXAM_KEY)
  } catch {
    /* ignore */
  }
}

export function recordExamAttempt(
  progress: ExamProgress,
  section: ExamSectionId,
  score: number,
  total: number,
): ExamProgress {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0
  const prev = progress.bySection[section]
  const nextStats: ExamSectionStats = {
    attempts: (prev?.attempts ?? 0) + 1,
    bestPercent: Math.max(prev?.bestPercent ?? 0, percent),
    lastPercent: percent,
    lastScore: score,
    lastTotal: total,
    lastAt: Date.now(),
  }
  return {
    bySection: {
      ...progress.bySection,
      [section]: nextStats,
    },
  }
}

export function sectionBestPercent(
  progress: ExamProgress,
  section: ExamSectionId,
): number {
  return progress.bySection[section]?.bestPercent ?? 0
}

/** Hub mastery = average of best scores across all exam sections. */
export function examMasteryPercent(progress: ExamProgress): number {
  const scores = EXAM_SECTIONS.map(
    (s) => progress.bySection[s.id]?.bestPercent ?? 0,
  )
  if (scores.length === 0) return 0
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}
