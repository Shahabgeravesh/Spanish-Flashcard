import {
  GRAMMAR_SECTIONS,
  grammarCards,
  type GrammarSection,
} from './grammar'
import { shuffle } from './cards'
import { splitAcceptedAnswers } from '../lib/examAnswer'
import type { ExamQuestion } from './exam'

type GrammarExamExample = {
  section: GrammarSection
  instruction: string
  prompt: string
  cloze?: string
  answers: string[]
  hint?: string
  explain: string
  kind?: 'fill' | 'type' | 'choice'
}

/**
 * Curated exam items — at least a couple of diverse examples per grammar topic
 * so a Grammar exam actually covers the whole track.
 */
export const GRAMMAR_EXAM_EXAMPLES: GrammarExamExample[] = [
  // ——— Gender ———
  {
    section: 'gender',
    instruction: 'Fill in the blank — gender & agreement',
    prompt: 'Make the adjective agree: “the red house”',
    cloze: 'la casa ___',
    answers: ['roja'],
    hint: 'casa is feminine',
    explain: 'Adjective matches the noun: la casa roja (not rojo).',
  },
  {
    section: 'gender',
    instruction: 'Type the Spanish — gender exception',
    prompt: 'the hand (ends in -o but…)',
    answers: ['la mano'],
    hint: 'Feminine exception',
    explain: 'la mano is feminine despite -o. Plural: las manos.',
  },
  {
    section: 'gender',
    instruction: 'Fill in the blank — agreement',
    prompt: 'Agree the adjective: “the white books”',
    cloze: 'los libros ___',
    answers: ['blancos'],
    hint: 'masculine plural',
    explain: 'libros → blancos. Color adjectives usually follow the noun.',
  },

  // ——— Articles ———
  {
    section: 'articles',
    instruction: 'Fill in the blank — contraction',
    prompt: '“to the park” (a + el)',
    cloze: 'Voy ___ parque.',
    answers: ['al'],
    hint: 'a + el → ?',
    explain: 'a + el = al. Never contract with la/los/las.',
  },
  {
    section: 'articles',
    instruction: 'Fill in the blank — contraction',
    prompt: '“of the teacher” (masculine)',
    cloze: 'El libro ___ profesor.',
    answers: ['del'],
    hint: 'de + el → ?',
    explain: 'de + el = del. Feminine stays de la profesora.',
  },
  {
    section: 'articles',
    instruction: 'Type the article',
    prompt: 'the (feminine singular)',
    answers: ['la'],
    explain: 'la casa, la mesa. Before stressed á/ha: el agua (still feminine).',
  },

  // ——— Ser vs estar ———
  {
    section: 'ser-estar',
    instruction: 'Fill in the blank — ser or estar',
    prompt: 'Identity / profession',
    cloze: 'Yo ___ profesora.',
    answers: ['soy'],
    hint: 'ser',
    explain: 'Identity and profession use ser: Soy profesora.',
  },
  {
    section: 'ser-estar',
    instruction: 'Fill in the blank — ser or estar',
    prompt: 'Location of a person',
    cloze: 'Ana ___ en Madrid.',
    answers: ['está'],
    hint: 'estar',
    explain: 'People/things location → estar. Events use ser: La fiesta es en…',
  },
  {
    section: 'ser-estar',
    instruction: 'Fill in the blank — condition',
    prompt: 'Temporary feeling',
    cloze: 'Ellos ___ cansados.',
    answers: ['están'],
    hint: 'state / condition',
    explain: 'Temporary states → estar. Es cansado would sound like “is a tiring person.”',
  },

  // ——— Por vs para ———
  {
    section: 'por-para',
    instruction: 'Fill in the blank — por or para',
    prompt: 'Purpose: “in order to learn”',
    cloze: 'Estudio ___ aprender.',
    answers: ['para'],
    hint: 'purpose / goal',
    explain: 'para + infinitive = in order to.',
  },
  {
    section: 'por-para',
    instruction: 'Fill in the blank — por or para',
    prompt: 'Thanks for your help',
    cloze: 'Gracias ___ tu ayuda.',
    answers: ['por'],
    hint: 'gratitude / cause',
    explain: 'Gracias por… is fixed. Cause also often uses por.',
  },
  {
    section: 'por-para',
    instruction: 'Fill in the blank — por or para',
    prompt: 'Deadline: homework is for Friday',
    cloze: 'La tarea es ___ el viernes.',
    answers: ['para'],
    hint: 'deadline / due date',
    explain: 'Deadlines → para. Duration “for three hours” → por.',
  },

  // ——— Prepositions ———
  {
    section: 'prepositions',
    instruction: 'Fill in the blank — personal a',
    prompt: 'I see María (person as direct object)',
    cloze: 'Veo ___ María.',
    answers: ['a'],
    hint: 'personal a',
    explain: 'Specific people as direct objects need a. Things do not: Veo la película.',
  },
  {
    section: 'prepositions',
    instruction: 'Fill in the blank — de',
    prompt: 'Ana’s book / the book of Ana',
    cloze: 'el libro ___ Ana',
    answers: ['de'],
    hint: 'possession',
    explain: 'Spanish uses de for possession — no ’s.',
  },
  {
    section: 'prepositions',
    instruction: 'Fill in the blank — location',
    prompt: 'I am at home',
    cloze: 'Estoy ___ casa.',
    answers: ['en'],
    hint: 'in / at',
    explain: 'en casa is the set phrase for “at home.”',
  },

  // ——— Object pronouns ———
  {
    section: 'object-pronouns',
    instruction: 'Fill in the blank — direct object',
    prompt: 'I see it (masculine singular)',
    cloze: '___ veo.',
    answers: ['Lo', 'lo'],
    hint: 'lo / la / los / las',
    explain: 'lo replaces a masculine singular noun. Feminine: La veo.',
  },
  {
    section: 'object-pronouns',
    instruction: 'Fill in the blank — double pronouns',
    prompt: 'I give it to her (le + lo)',
    cloze: '___ lo doy.',
    answers: ['Se', 'se'],
    hint: 'le/les → se before lo/la',
    explain: 'le/les become se before lo/la/los/las: Se lo doy.',
  },
  {
    section: 'object-pronouns',
    instruction: 'Type the Spanish',
    prompt: 'Tell me (tú affirmative command)',
    answers: ['Dime', 'dime'],
    hint: 'decir + me',
    explain: 'Affirmative commands attach pronouns: Dime. Negative: No me digas.',
  },

  // ——— Gustar ———
  {
    section: 'gustar',
    instruction: 'Fill in the blank — agreement',
    prompt: 'I like books (plural thing liked)',
    cloze: 'Me ___ los libros.',
    answers: ['gustan'],
    hint: 'gusta vs gustan',
    explain: 'Verb agrees with what is liked: Me gustan los libros.',
  },
  {
    section: 'gustar',
    instruction: 'Fill in the blank — pronoun',
    prompt: 'She likes the movie',
    cloze: '___ gusta la película.',
    answers: ['Le', 'le'],
    hint: 'indirect object',
    explain: 'le = to her/him/you formal. Clarify with A ella le gusta…',
  },
  {
    section: 'gustar',
    instruction: 'Type the polite request',
    prompt: 'I would like a water, please',
    answers: [
      'Me gustaría un agua, por favor',
      'Me gustaría un agua por favor',
    ],
    hint: 'conditional gustar',
    explain: 'Me gustaría softens requests — very common when ordering.',
  },

  // ——— Reflexives ———
  {
    section: 'reflexives',
    instruction: 'Fill in the blank — routine',
    prompt: 'I wake up at 7',
    cloze: '___ despierto a las 7.',
    answers: ['Me', 'me'],
    hint: 'reflexive pronoun',
    explain: 'despertarse → Me despierto.',
  },
  {
    section: 'reflexives',
    instruction: 'Fill in the blank — name',
    prompt: 'Her name is Ana',
    cloze: '___ llama Ana.',
    answers: ['Se', 'se'],
    hint: 'llamarse',
    explain: 'Se llama Ana. ¿Cómo te llamas?',
  },
  {
    section: 'reflexives',
    instruction: 'Type the Spanish',
    prompt: 'I’m leaving / I’m going away',
    answers: ['Me voy', 'me voy'],
    hint: 'irse',
    explain: 'ir = to go · irse = to leave / go away.',
  },

  // ——— Negation ———
  {
    section: 'negation',
    instruction: 'Fill in the blank — double negative',
    prompt: 'I don’t see anyone',
    cloze: 'No veo a ___.',
    answers: ['nadie'],
    hint: 'no… nadie',
    explain: 'Spanish keeps both: No veo a nadie. Nadie can also start the sentence alone.',
  },
  {
    section: 'negation',
    instruction: 'Fill in the blank — never',
    prompt: 'I never eat meat',
    cloze: '___ como carne.',
    answers: ['Nunca', 'nunca'],
    hint: 'or: No como carne nunca',
    explain: 'Nunca can open the sentence, or pair with no… nunca.',
  },
  {
    section: 'negation',
    instruction: 'Type the Spanish',
    prompt: 'There is nothing here',
    answers: ['No hay nada aquí', 'No hay nada aqui'],
    hint: 'no… nada',
    explain: 'no + hay + nada. Double negatives reinforce, they don’t cancel.',
  },

  // ——— Comparisons ———
  {
    section: 'comparisons',
    instruction: 'Fill in the blank — comparison',
    prompt: 'taller than (masculine)',
    cloze: 'más alto ___',
    answers: ['que'],
    hint: 'más / menos + adj + ?',
    explain: 'más / menos + adjective + que.',
  },
  {
    section: 'comparisons',
    instruction: 'Fill in the blank — equality',
    prompt: 'as interesting as',
    cloze: 'tan interesante ___',
    answers: ['como'],
    hint: 'tan… como',
    explain: 'Equality with adjectives: tan + adj + como.',
  },
  {
    section: 'comparisons',
    instruction: 'Type the irregular comparative',
    prompt: 'better / worse',
    answers: ['mejor / peor', 'mejor, peor', 'mejor y peor'],
    hint: 'not más bueno',
    explain: 'Use mejor/peor instead of más bueno/más malo in most cases.',
  },

  // ——— Demonstratives ———
  {
    section: 'demonstratives',
    instruction: 'Fill in the blank — near speaker',
    prompt: 'this book',
    cloze: '___ libro',
    answers: ['este'],
    hint: 'este / esta / estos / estas',
    explain: 'este = this (masc.) near the speaker. Feminine: esta.',
  },
  {
    section: 'demonstratives',
    instruction: 'Fill in the blank — neuter',
    prompt: 'What is that? (unknown thing/idea)',
    cloze: '¿Qué es ___?',
    answers: ['eso'],
    hint: 'esto / eso / aquello',
    explain: 'Neuter eso for an unnamed thing or situation.',
  },
  {
    section: 'demonstratives',
    instruction: 'Type the Spanish',
    prompt: 'that book over there (far)',
    answers: ['aquel libro'],
    hint: 'aquel / aquella',
    explain: 'aquel marks distance (or remote time: aquellos días).',
  },

  // ——— Possessives ———
  {
    section: 'possessives',
    instruction: 'Fill in the blank — short possessive',
    prompt: 'my houses (plural noun)',
    cloze: '___ casas',
    answers: ['mis'],
    hint: 'mi / mis',
    explain: 'Possessives agree with what is owned: mis casas (not mi).',
  },
  {
    section: 'possessives',
    instruction: 'Fill in the blank — long form',
    prompt: 'The book is mine',
    cloze: 'El libro es ___.',
    answers: ['mío', 'mio'],
    hint: 'mío / tuyo / suyo…',
    explain: 'Long forms after ser: Es mío. Or un amigo mío.',
  },
  {
    section: 'possessives',
    instruction: 'Type the Spanish',
    prompt: 'our house (feminine)',
    answers: ['nuestra casa'],
    hint: 'nuestro / nuestra',
    explain: 'nuestro changes for gender/number: nuestra casa, nuestros libros.',
  },

  // ——— Preterite vs imperfect ———
  {
    section: 'pret-imp',
    instruction: 'Fill in the blank — completed past',
    prompt: 'Yesterday I ate tapas (completed)',
    cloze: 'Ayer ___ tapas.',
    answers: ['comí', 'comi'],
    hint: 'preterite',
    explain: 'Single completed action → preterite: Ayer comí.',
  },
  {
    section: 'pret-imp',
    instruction: 'Fill in the blank — habit / background',
    prompt: 'I used to eat tapas every Friday',
    cloze: '___ tapas todos los viernes.',
    answers: ['Comía', 'Comia', 'comía', 'comia'],
    hint: 'imperfect',
    explain: 'Habits and repeated past → imperfect: Comía todos los viernes.',
  },
  {
    section: 'pret-imp',
    instruction: 'Fill in the blank — scene + event',
    prompt: 'It was raining when I left',
    cloze: '___ cuando salí.',
    answers: ['Llovía', 'Llovia', 'llovía', 'llovia'],
    hint: 'background verb',
    explain: 'Imperfect sets the scene (llovía); preterite moves the plot (salí).',
  },

  // ——— Commands ———
  {
    section: 'commands',
    instruction: 'Fill in the blank — tú affirmative',
    prompt: 'Speak! (tú)',
    cloze: '¡___!',
    answers: ['Habla', 'habla'],
    hint: 'present él/ella form for most -ar verbs',
    explain: 'Tú affirmative often = 3rd-person present: ¡Habla!',
  },
  {
    section: 'commands',
    instruction: 'Fill in the blank — tú negative',
    prompt: 'Don’t speak! (tú)',
    cloze: '¡No ___!',
    answers: ['hables'],
    hint: 'present subjunctive',
    explain: 'Negative tú uses subjunctive: No hables.',
  },
  {
    section: 'commands',
    instruction: 'Type the command',
    prompt: 'Come! (tú irregular)',
    answers: ['Ven', 'ven', '¡Ven!', '¡ven!'],
    hint: 'venir irregular command',
    explain: 'Irregular tú: ven, ten, pon, haz, sal, sé, di, ve.',
  },
]

const TOPIC_LABEL: Record<GrammarSection, string> = {
  gender: 'Gender & agreement',
  articles: 'Articles',
  'ser-estar': 'Ser vs estar',
  'por-para': 'Por vs para',
  prepositions: 'Prepositions',
  'object-pronouns': 'Object pronouns',
  gustar: 'Gustar verbs',
  reflexives: 'Reflexives',
  negation: 'Negation',
  comparisons: 'Comparisons',
  demonstratives: 'Demonstratives',
  possessives: 'Possessives',
  'pret-imp': 'Preterite vs imperfect',
  commands: 'Commands',
}

function exampleToQuestion(
  ex: GrammarExamExample,
  index: number,
): ExamQuestion {
  const kind =
    ex.kind ??
    (ex.cloze ? 'fill' : 'type')
  return {
    id: `grammar-ex-${ex.section}-${index}`,
    section: 'grammar',
    kind,
    instruction: ex.instruction,
    prompt: ex.prompt,
    cloze: ex.cloze,
    answers: ex.answers,
    hint: ex.hint
      ? `${TOPIC_LABEL[ex.section]} · ${ex.hint}`
      : TOPIC_LABEL[ex.section],
    explain: ex.explain,
  }
}

function cardToQuestion(
  card: (typeof grammarCards)[number],
  asChoice: boolean,
  pool: string[],
): ExamQuestion {
  const answers = splitAcceptedAnswers(card.back)
  // Prefer fill when the Spanish answer is a short content word in a tip-friendly way:
  // use type-in with topic label so cards stay usable as "produce the form"
  return {
    id: `grammar-card-${card.id}`,
    section: 'grammar',
    kind: asChoice ? 'choice' : 'type',
    instruction: `Type the Spanish — ${TOPIC_LABEL[card.section]}`,
    prompt: card.front,
    answers,
    choices: asChoice && answers[0] ? pickThree(answers[0], pool) : undefined,
    hint: card.rule
      ? `${TOPIC_LABEL[card.section]} · ${card.rule}`
      : TOPIC_LABEL[card.section],
    explain: card.tip,
  }
}

function pickThree(correct: string, pool: string[]): string[] {
  const folded = correct.toLowerCase()
  const opts = shuffle(pool.filter((p) => p.toLowerCase() !== folded)).slice(
    0,
    3,
  )
  return shuffle([correct, ...opts])
}

/** Grammar topics excluding the "All" hub chip. */
export const GRAMMAR_EXAM_TOPICS: GrammarSection[] = GRAMMAR_SECTIONS.filter(
  (s): s is { id: GrammarSection; label: string } => s.id !== 'all',
).map((s) => s.id)

/**
 * Build a Grammar exam that covers every topic when possible.
 * Uses curated example sentences first, then flashcard prompts for diversity.
 */
export function buildGrammarExamQuestions(limit: number): ExamQuestion[] {
  const n = Math.max(5, Math.min(30, limit))
  const topics = GRAMMAR_EXAM_TOPICS

  const byTopicExamples = new Map<GrammarSection, GrammarExamExample[]>()
  for (const topic of topics) byTopicExamples.set(topic, [])
  for (const ex of GRAMMAR_EXAM_EXAMPLES) {
    byTopicExamples.get(ex.section)?.push(ex)
  }
  for (const [topic, list] of byTopicExamples) {
    byTopicExamples.set(topic, shuffle(list))
  }

  const byTopicCards = new Map<GrammarSection, typeof grammarCards>()
  for (const topic of topics) {
    byTopicCards.set(
      topic,
      shuffle(grammarCards.filter((c) => c.section === topic)),
    )
  }

  const answerPool = grammarCards.flatMap((c) => splitAcceptedAnswers(c.back))
  const picked: ExamQuestion[] = []
  const usedExampleKeys = new Set<string>()
  const usedCardIds = new Set<number>()

  // Pass 1: one curated example from every topic (guarantees full coverage when n >= 14)
  for (const topic of shuffle([...topics])) {
    if (picked.length >= n) break
    const list = byTopicExamples.get(topic) ?? []
    const ex = list[0]
    if (!ex) continue
    const key = `${ex.section}-${ex.prompt}`
    usedExampleKeys.add(key)
    picked.push(exampleToQuestion(ex, picked.length))
  }

  // Pass 2: second curated example per topic for diversity
  if (picked.length < n) {
    for (const topic of shuffle([...topics])) {
      if (picked.length >= n) break
      const list = byTopicExamples.get(topic) ?? []
      const ex = list.find((e) => !usedExampleKeys.has(`${e.section}-${e.prompt}`))
      if (!ex) continue
      usedExampleKeys.add(`${ex.section}-${ex.prompt}`)
      picked.push(exampleToQuestion(ex, picked.length))
    }
  }

  // Pass 3: third curated examples if still short
  if (picked.length < n) {
    for (const topic of shuffle([...topics])) {
      if (picked.length >= n) break
      const list = byTopicExamples.get(topic) ?? []
      for (const ex of list) {
        const key = `${ex.section}-${ex.prompt}`
        if (usedExampleKeys.has(key)) continue
        usedExampleKeys.add(key)
        picked.push(exampleToQuestion(ex, picked.length))
        break
      }
    }
  }

  // Pass 4: flashcard prompts from underrepresented topics
  if (picked.length < n) {
    for (const topic of shuffle([...topics])) {
      if (picked.length >= n) break
      const cards = byTopicCards.get(topic) ?? []
      for (const card of cards) {
        if (usedCardIds.has(card.id)) continue
        usedCardIds.add(card.id)
        picked.push(cardToQuestion(card, Math.random() < 0.22, answerPool))
        break
      }
    }
  }

  // Pass 5: any remaining cards
  while (picked.length < n) {
    const remaining = shuffle(
      grammarCards.filter((c) => !usedCardIds.has(c.id)),
    )
    if (remaining.length === 0) break
    const card = remaining[0]
    usedCardIds.add(card.id)
    picked.push(cardToQuestion(card, Math.random() < 0.25, answerPool))
  }

  return shuffle(picked).slice(0, n)
}

export function grammarExamCoverageNote(questionCount: number): string {
  const topics = GRAMMAR_EXAM_TOPICS.length
  if (questionCount >= topics) {
    return `Includes all ${topics} grammar topics, with example sentences for each.`
  }
  return `Covers ${questionCount} of ${topics} topics this round — pick 16 for full coverage.`
}
