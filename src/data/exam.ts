import { cards as phraseCards, shuffle } from './cards'
import { foundationCards } from './foundations'
import { dailyPhraseCards } from './dailyPhrases'
import { numberCards } from './numberCards'
import { colorCards } from './colors'
import {
  PRONOUNS,
  TENSE_META,
  verbs,
  type PronounKey,
  type Tense,
} from './verbs'
import { splitAcceptedAnswers } from '../lib/examAnswer'
import { buildGrammarExamQuestions } from './grammarExam'

export type ExamSectionId =
  | 'conjugations'
  | 'foundations'
  | 'grammar'
  | 'phrases'
  | 'daily'
  | 'numbers'
  | 'colors'
  | 'mixed'

export type ExamQuestionKind = 'fill' | 'type' | 'choice'

export type ExamQuestion = {
  id: string
  section: ExamSectionId
  kind: ExamQuestionKind
  /** Short instruction above the task */
  instruction: string
  /** Main prompt (English or meta) */
  prompt: string
  /** Optional Spanish sentence with blank shown as ___ */
  cloze?: string
  hint?: string
  answers: string[]
  choices?: string[]
  explain?: string
}

export const EXAM_SECTIONS: {
  id: ExamSectionId
  label: string
  blurb: string
}[] = [
  {
    id: 'conjugations',
    label: 'Conjugations',
    blurb: 'Fill the blank with the right verb form.',
  },
  {
    id: 'foundations',
    label: 'Foundations',
    blurb: 'Type the Spanish for core vocab.',
  },
  {
    id: 'grammar',
    label: 'Grammar',
    blurb: 'Examples for every topic — fill blanks & type forms.',
  },
  {
    id: 'phrases',
    label: 'Requests',
    blurb: 'Type polite asks and connectors in Spanish.',
  },
  {
    id: 'daily',
    label: 'Daily life',
    blurb: 'Situational phrases — fill or type the Spanish.',
  },
  {
    id: 'numbers',
    label: 'Numbers',
    blurb: 'Write the Spanish for each number.',
  },
  {
    id: 'colors',
    label: 'Colors',
    blurb: 'Name the color in Spanish.',
  },
  {
    id: 'mixed',
    label: 'Mixed exam',
    blurb: 'A little of everything — full self-check.',
  },
]

const CLOZE_TEMPLATES: Record<
  PronounKey,
  { es: string; en: string }
> = {
  yo: { es: 'Yo ___ ahora.', en: 'I ___ now.' },
  tu: { es: 'Tú ___ hoy.', en: 'You ___ today.' },
  el: { es: 'Ella ___ mucho.', en: 'She ___ a lot.' },
  nosotros: { es: 'Nosotros ___ juntos.', en: 'We ___ together.' },
  vosotros: { es: 'Vosotros ___ mañana.', en: 'You all ___ tomorrow.' },
  ellos: { es: 'Ellos ___ siempre.', en: 'They ___ always.' },
}

function pickDistractors(
  correct: string,
  pool: string[],
  count = 3,
): string[] {
  const foldedCorrect = correct.toLowerCase()
  const opts = shuffle(
    pool.filter((p) => p.toLowerCase() !== foldedCorrect),
  ).slice(0, count)
  return shuffle([correct, ...opts])
}

function conjugationQuestions(limit: number): ExamQuestion[] {
  const out: ExamQuestion[] = []
  const tenses = Object.keys(TENSE_META) as Tense[]
  for (const verb of verbs) {
    for (const tense of tenses) {
      for (const p of PRONOUNS) {
        const form = verb.conjugations[tense][p.key]
        const tpl = CLOZE_TEMPLATES[p.key]
        const pool = verbs.flatMap((v) =>
          PRONOUNS.map((pp) => v.conjugations[tense][pp.key]),
        )
        const asChoice = Math.random() < 0.25
        out.push({
          id: `conj-${verb.infinitive}-${tense}-${p.key}`,
          section: 'conjugations',
          kind: asChoice ? 'choice' : 'fill',
          instruction: `Fill in the blank — ${TENSE_META[tense].label}`,
          prompt: `${verb.infinitive} (${verb.meaning}) · ${p.es}`,
          cloze: tpl.es,
          hint: `${TENSE_META[tense].esLabel} · ${p.en}`,
          answers: [form],
          choices: asChoice ? pickDistractors(form, pool) : undefined,
          explain: `${p.es} + ${verb.infinitive} (${TENSE_META[tense].label}) → ${form}`,
        })
      }
    }
  }
  return shuffle(out).slice(0, limit)
}

function typeFromDeck(
  section: ExamSectionId,
  items: { id: string | number; front: string; back: string; tip?: string }[],
  limit: number,
  instruction: string,
): ExamQuestion[] {
  return shuffle(items)
    .slice(0, limit)
    .map((card) => {
      const answers = splitAcceptedAnswers(card.back)
      const asChoice = Math.random() < 0.2 && answers[0]
      const pool = items.flatMap((c) => splitAcceptedAnswers(c.back))
      return {
        id: `${section}-${card.id}`,
        section,
        kind: (asChoice ? 'choice' : 'type') as ExamQuestionKind,
        instruction,
        prompt: card.front,
        answers,
        choices: asChoice
          ? pickDistractors(answers[0], pool)
          : undefined,
        explain: card.tip,
        hint: answers.length > 1 ? 'More than one answer may be accepted.' : undefined,
      }
    })
}

function dailyQuestions(limit: number): ExamQuestion[] {
  return shuffle(dailyPhraseCards)
    .slice(0, limit)
    .map((card) => {
      const answers = splitAcceptedAnswers(card.back)
      const words = answers[0]?.split(/\s+/) ?? []
      // Prefer fill-blank when phrase has 3+ words: blank the last content word
      let cloze: string | undefined
      let fillAnswers = answers
      if (words.length >= 3 && Math.random() < 0.55) {
        const blankAt = words.length - 1
        const target = words[blankAt].replace(/[¿?¡!.,]/g, '')
        const shown = words.map((w, i) => (i === blankAt ? '___' : w)).join(' ')
        cloze = shown
        fillAnswers = [target, ...answers]
      }
      return {
        id: `daily-${card.id}`,
        section: 'daily' as const,
        kind: (cloze ? 'fill' : 'type') as ExamQuestionKind,
        instruction: cloze
          ? 'Fill in the missing Spanish word'
          : 'Type the Spanish phrase',
        prompt: card.front,
        cloze,
        answers: fillAnswers,
        explain: card.tip,
        hint: card.category,
      }
    })
}

function numberQuestions(limit: number): ExamQuestion[] {
  return shuffle(numberCards)
    .slice(0, limit)
    .map((card) => ({
      id: `num-${card.id}`,
      section: 'numbers' as const,
      kind: 'type' as const,
      instruction: 'Write the number in Spanish',
      prompt: String(card.value),
      answers: splitAcceptedAnswers(card.back),
      hint: card.range,
      explain: `${card.value} → ${card.back}`,
    }))
}

function colorQuestions(limit: number): ExamQuestion[] {
  return shuffle(colorCards)
    .slice(0, limit)
    .map((card) => ({
      id: `color-${card.id}`,
      section: 'colors' as const,
      kind: 'type' as const,
      instruction: 'Type the Spanish color / phrase',
      prompt: card.front,
      answers: splitAcceptedAnswers(card.back),
      hint: card.kind,
      explain: card.tip,
    }))
}

export function buildExamQuestions(
  section: ExamSectionId,
  count = 10,
): ExamQuestion[] {
  const n = Math.max(5, Math.min(25, count))
  switch (section) {
    case 'conjugations':
      return conjugationQuestions(n)
    case 'foundations':
      return typeFromDeck(
        'foundations',
        foundationCards,
        n,
        'Type the Spanish',
      )
    case 'grammar':
      return buildGrammarExamQuestions(n)
    case 'phrases':
      return typeFromDeck(
        'phrases',
        phraseCards,
        n,
        'Type the Spanish request / phrase',
      )
    case 'daily':
      return dailyQuestions(n)
    case 'numbers':
      return numberQuestions(n)
    case 'colors':
      return colorQuestions(n)
    case 'mixed': {
      const each = Math.max(2, Math.ceil(n / 6))
      return shuffle([
        ...conjugationQuestions(each),
        ...typeFromDeck('foundations', foundationCards, each, 'Type the Spanish'),
        ...buildGrammarExamQuestions(each),
        ...typeFromDeck('phrases', phraseCards, each, 'Type the Spanish'),
        ...dailyQuestions(each),
        ...numberQuestions(each),
      ]).slice(0, n)
    }
  }
}
