export type Tense = 'present' | 'preterite' | 'future'

export type PronounKey =
  | 'yo'
  | 'tu'
  | 'el'
  | 'nosotros'
  | 'vosotros'
  | 'ellos'

export const PRONOUNS: {
  key: PronounKey
  es: string
  en: string
}[] = [
  { key: 'yo', es: 'yo', en: 'I' },
  { key: 'tu', es: 'tú', en: 'you (informal)' },
  { key: 'el', es: 'él / ella / usted', en: 'he / she / you (formal)' },
  { key: 'nosotros', es: 'nosotros / nosotras', en: 'we' },
  { key: 'vosotros', es: 'vosotros / vosotras', en: 'you all (Spain)' },
  { key: 'ellos', es: 'ellos / ellas / ustedes', en: 'they / you all' },
]

export const TENSE_META: Record<
  Tense,
  { label: string; esLabel: string; tip: string }
> = {
  present: {
    label: 'Present',
    esLabel: 'Presente',
    tip: 'What happens now or habitually',
  },
  preterite: {
    label: 'Past',
    esLabel: 'Pretérito',
    tip: 'Completed actions in the past',
  },
  future: {
    label: 'Future',
    esLabel: 'Futuro',
    tip: 'What will happen',
  },
}

export type VerbTable = {
  infinitive: string
  meaning: string
  group: 'regular' | 'irregular'
  conjugations: Record<Tense, Record<PronounKey, string>>
}

/** Core learner verbs — regular + high-frequency irregulars */
export const verbs: VerbTable[] = [
  {
    infinitive: 'hablar',
    meaning: 'to speak / to talk',
    group: 'regular',
    conjugations: {
      present: {
        yo: 'hablo',
        tu: 'hablas',
        el: 'habla',
        nosotros: 'hablamos',
        vosotros: 'habláis',
        ellos: 'hablan',
      },
      preterite: {
        yo: 'hablé',
        tu: 'hablaste',
        el: 'habló',
        nosotros: 'hablamos',
        vosotros: 'hablasteis',
        ellos: 'hablaron',
      },
      future: {
        yo: 'hablaré',
        tu: 'hablarás',
        el: 'hablará',
        nosotros: 'hablaremos',
        vosotros: 'hablaréis',
        ellos: 'hablarán',
      },
    },
  },
  {
    infinitive: 'comer',
    meaning: 'to eat',
    group: 'regular',
    conjugations: {
      present: {
        yo: 'como',
        tu: 'comes',
        el: 'come',
        nosotros: 'comemos',
        vosotros: 'coméis',
        ellos: 'comen',
      },
      preterite: {
        yo: 'comí',
        tu: 'comiste',
        el: 'comió',
        nosotros: 'comimos',
        vosotros: 'comisteis',
        ellos: 'comieron',
      },
      future: {
        yo: 'comeré',
        tu: 'comerás',
        el: 'comerá',
        nosotros: 'comeremos',
        vosotros: 'comeréis',
        ellos: 'comerán',
      },
    },
  },
  {
    infinitive: 'vivir',
    meaning: 'to live',
    group: 'regular',
    conjugations: {
      present: {
        yo: 'vivo',
        tu: 'vives',
        el: 'vive',
        nosotros: 'vivimos',
        vosotros: 'vivís',
        ellos: 'viven',
      },
      preterite: {
        yo: 'viví',
        tu: 'viviste',
        el: 'vivió',
        nosotros: 'vivimos',
        vosotros: 'vivisteis',
        ellos: 'vivieron',
      },
      future: {
        yo: 'viviré',
        tu: 'vivirás',
        el: 'vivirá',
        nosotros: 'viviremos',
        vosotros: 'viviréis',
        ellos: 'vivirán',
      },
    },
  },
  {
    infinitive: 'ser',
    meaning: 'to be (identity / traits)',
    group: 'irregular',
    conjugations: {
      present: {
        yo: 'soy',
        tu: 'eres',
        el: 'es',
        nosotros: 'somos',
        vosotros: 'sois',
        ellos: 'son',
      },
      preterite: {
        yo: 'fui',
        tu: 'fuiste',
        el: 'fue',
        nosotros: 'fuimos',
        vosotros: 'fuisteis',
        ellos: 'fueron',
      },
      future: {
        yo: 'seré',
        tu: 'serás',
        el: 'será',
        nosotros: 'seremos',
        vosotros: 'seréis',
        ellos: 'serán',
      },
    },
  },
  {
    infinitive: 'estar',
    meaning: 'to be (location / state)',
    group: 'irregular',
    conjugations: {
      present: {
        yo: 'estoy',
        tu: 'estás',
        el: 'está',
        nosotros: 'estamos',
        vosotros: 'estáis',
        ellos: 'están',
      },
      preterite: {
        yo: 'estuve',
        tu: 'estuviste',
        el: 'estuvo',
        nosotros: 'estuvimos',
        vosotros: 'estuvisteis',
        ellos: 'estuvieron',
      },
      future: {
        yo: 'estaré',
        tu: 'estarás',
        el: 'estará',
        nosotros: 'estaremos',
        vosotros: 'estaréis',
        ellos: 'estarán',
      },
    },
  },
  {
    infinitive: 'tener',
    meaning: 'to have',
    group: 'irregular',
    conjugations: {
      present: {
        yo: 'tengo',
        tu: 'tienes',
        el: 'tiene',
        nosotros: 'tenemos',
        vosotros: 'tenéis',
        ellos: 'tienen',
      },
      preterite: {
        yo: 'tuve',
        tu: 'tuviste',
        el: 'tuvo',
        nosotros: 'tuvimos',
        vosotros: 'tuvisteis',
        ellos: 'tuvieron',
      },
      future: {
        yo: 'tendré',
        tu: 'tendrás',
        el: 'tendrá',
        nosotros: 'tendremos',
        vosotros: 'tendréis',
        ellos: 'tendrán',
      },
    },
  },
  {
    infinitive: 'ir',
    meaning: 'to go',
    group: 'irregular',
    conjugations: {
      present: {
        yo: 'voy',
        tu: 'vas',
        el: 'va',
        nosotros: 'vamos',
        vosotros: 'vais',
        ellos: 'van',
      },
      preterite: {
        yo: 'fui',
        tu: 'fuiste',
        el: 'fue',
        nosotros: 'fuimos',
        vosotros: 'fuisteis',
        ellos: 'fueron',
      },
      future: {
        yo: 'iré',
        tu: 'irás',
        el: 'irá',
        nosotros: 'iremos',
        vosotros: 'iréis',
        ellos: 'irán',
      },
    },
  },
  {
    infinitive: 'hacer',
    meaning: 'to do / to make',
    group: 'irregular',
    conjugations: {
      present: {
        yo: 'hago',
        tu: 'haces',
        el: 'hace',
        nosotros: 'hacemos',
        vosotros: 'hacéis',
        ellos: 'hacen',
      },
      preterite: {
        yo: 'hice',
        tu: 'hiciste',
        el: 'hizo',
        nosotros: 'hicimos',
        vosotros: 'hicisteis',
        ellos: 'hicieron',
      },
      future: {
        yo: 'haré',
        tu: 'harás',
        el: 'hará',
        nosotros: 'haremos',
        vosotros: 'haréis',
        ellos: 'harán',
      },
    },
  },
  {
    infinitive: 'querer',
    meaning: 'to want / to love',
    group: 'irregular',
    conjugations: {
      present: {
        yo: 'quiero',
        tu: 'quieres',
        el: 'quiere',
        nosotros: 'queremos',
        vosotros: 'queréis',
        ellos: 'quieren',
      },
      preterite: {
        yo: 'quise',
        tu: 'quisiste',
        el: 'quiso',
        nosotros: 'quisimos',
        vosotros: 'quisisteis',
        ellos: 'quisieron',
      },
      future: {
        yo: 'querré',
        tu: 'querrás',
        el: 'querrá',
        nosotros: 'querremos',
        vosotros: 'querréis',
        ellos: 'querrán',
      },
    },
  },
  {
    infinitive: 'poder',
    meaning: 'to be able to / can',
    group: 'irregular',
    conjugations: {
      present: {
        yo: 'puedo',
        tu: 'puedes',
        el: 'puede',
        nosotros: 'podemos',
        vosotros: 'podéis',
        ellos: 'pueden',
      },
      preterite: {
        yo: 'pude',
        tu: 'pudiste',
        el: 'pudo',
        nosotros: 'pudimos',
        vosotros: 'pudisteis',
        ellos: 'pudieron',
      },
      future: {
        yo: 'podré',
        tu: 'podrás',
        el: 'podrá',
        nosotros: 'podremos',
        vosotros: 'podréis',
        ellos: 'podrán',
      },
    },
  },
  {
    infinitive: 'decir',
    meaning: 'to say / to tell',
    group: 'irregular',
    conjugations: {
      present: {
        yo: 'digo',
        tu: 'dices',
        el: 'dice',
        nosotros: 'decimos',
        vosotros: 'decís',
        ellos: 'dicen',
      },
      preterite: {
        yo: 'dije',
        tu: 'dijiste',
        el: 'dijo',
        nosotros: 'dijimos',
        vosotros: 'dijisteis',
        ellos: 'dijeron',
      },
      future: {
        yo: 'diré',
        tu: 'dirás',
        el: 'dirá',
        nosotros: 'diremos',
        vosotros: 'diréis',
        ellos: 'dirán',
      },
    },
  },
  {
    infinitive: 'venir',
    meaning: 'to come',
    group: 'irregular',
    conjugations: {
      present: {
        yo: 'vengo',
        tu: 'vienes',
        el: 'viene',
        nosotros: 'venimos',
        vosotros: 'venís',
        ellos: 'vienen',
      },
      preterite: {
        yo: 'vine',
        tu: 'viniste',
        el: 'vino',
        nosotros: 'vinimos',
        vosotros: 'vinisteis',
        ellos: 'vinieron',
      },
      future: {
        yo: 'vendré',
        tu: 'vendrás',
        el: 'vendrá',
        nosotros: 'vendremos',
        vosotros: 'vendréis',
        ellos: 'vendrán',
      },
    },
  },
]

export type VerbCard = {
  id: number
  front: string
  back: string
  infinitive: string
  meaning: string
  tense: Tense
  pronounKey: PronounKey
  pronounEs: string
  pronounEn: string
  group: 'regular' | 'irregular'
}

function buildVerbCards(): VerbCard[] {
  const cards: VerbCard[] = []
  let id = 1

  for (const verb of verbs) {
    for (const tense of Object.keys(TENSE_META) as Tense[]) {
      for (const pronoun of PRONOUNS) {
        const form = verb.conjugations[tense][pronoun.key]
        const tenseMeta = TENSE_META[tense]
        cards.push({
          id: id++,
          infinitive: verb.infinitive,
          meaning: verb.meaning,
          tense,
          pronounKey: pronoun.key,
          pronounEs: pronoun.es,
          pronounEn: pronoun.en,
          group: verb.group,
          front: `${verb.infinitive} · ${tenseMeta.label} · ${pronoun.es}`,
          back: form,
        })
      }
    }
  }

  return cards
}

export const verbCards: VerbCard[] = buildVerbCards()

export function getVerbCard(id: number): VerbCard | undefined {
  return verbCards.find((c) => c.id === id)
}

export function filterVerbCards(
  cards: VerbCard[],
  options: {
    tenses?: Tense[] | 'all'
    group?: 'regular' | 'irregular' | 'all'
  } = {},
): VerbCard[] {
  const tenses = options.tenses ?? 'all'
  const group = options.group ?? 'all'
  return cards.filter((c) => {
    if (group !== 'all' && c.group !== group) return false
    if (tenses !== 'all' && !tenses.includes(c.tense)) return false
    return true
  })
}

export function countByGroup(cards: VerbCard[]): {
  regular: number
  irregular: number
} {
  return {
    regular: cards.filter((c) => c.group === 'regular').length,
    irregular: cards.filter((c) => c.group === 'irregular').length,
  }
}
