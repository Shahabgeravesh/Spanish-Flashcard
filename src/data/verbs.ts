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
  {
    infinitive: 'dar',
    meaning: 'to give',
    group: 'irregular',
    conjugations: {
      present: {
        yo: 'doy',
        tu: 'das',
        el: 'da',
        nosotros: 'damos',
        vosotros: 'dais',
        ellos: 'dan',
      },
      preterite: {
        yo: 'di',
        tu: 'diste',
        el: 'dio',
        nosotros: 'dimos',
        vosotros: 'disteis',
        ellos: 'dieron',
      },
      future: {
        yo: 'daré',
        tu: 'darás',
        el: 'dará',
        nosotros: 'daremos',
        vosotros: 'daréis',
        ellos: 'darán',
      },
    },
  },
  {
    infinitive: 'ver',
    meaning: 'to see / to watch',
    group: 'irregular',
    conjugations: {
      present: {
        yo: 'veo',
        tu: 'ves',
        el: 've',
        nosotros: 'vemos',
        vosotros: 'veis',
        ellos: 'ven',
      },
      preterite: {
        yo: 'vi',
        tu: 'viste',
        el: 'vio',
        nosotros: 'vimos',
        vosotros: 'visteis',
        ellos: 'vieron',
      },
      future: {
        yo: 'veré',
        tu: 'verás',
        el: 'verá',
        nosotros: 'veremos',
        vosotros: 'veréis',
        ellos: 'verán',
      },
    },
  },
  {
    infinitive: 'saber',
    meaning: 'to know (facts) / to know how',
    group: 'irregular',
    conjugations: {
      present: {
        yo: 'sé',
        tu: 'sabes',
        el: 'sabe',
        nosotros: 'sabemos',
        vosotros: 'sabéis',
        ellos: 'saben',
      },
      preterite: {
        yo: 'supe',
        tu: 'supiste',
        el: 'supo',
        nosotros: 'supimos',
        vosotros: 'supisteis',
        ellos: 'supieron',
      },
      future: {
        yo: 'sabré',
        tu: 'sabrás',
        el: 'sabrá',
        nosotros: 'sabremos',
        vosotros: 'sabréis',
        ellos: 'sabrán',
      },
    },
  },
  {
    infinitive: 'poner',
    meaning: 'to put / to place',
    group: 'irregular',
    conjugations: {
      present: {
        yo: 'pongo',
        tu: 'pones',
        el: 'pone',
        nosotros: 'ponemos',
        vosotros: 'ponéis',
        ellos: 'ponen',
      },
      preterite: {
        yo: 'puse',
        tu: 'pusiste',
        el: 'puso',
        nosotros: 'pusimos',
        vosotros: 'pusisteis',
        ellos: 'pusieron',
      },
      future: {
        yo: 'pondré',
        tu: 'pondrás',
        el: 'pondrá',
        nosotros: 'pondremos',
        vosotros: 'pondréis',
        ellos: 'pondrán',
      },
    },
  },
  {
    infinitive: 'salir',
    meaning: 'to leave / to go out',
    group: 'irregular',
    conjugations: {
      present: {
        yo: 'salgo',
        tu: 'sales',
        el: 'sale',
        nosotros: 'salimos',
        vosotros: 'salís',
        ellos: 'salen',
      },
      preterite: {
        yo: 'salí',
        tu: 'saliste',
        el: 'salió',
        nosotros: 'salimos',
        vosotros: 'salisteis',
        ellos: 'salieron',
      },
      future: {
        yo: 'saldré',
        tu: 'saldrás',
        el: 'saldrá',
        nosotros: 'saldremos',
        vosotros: 'saldréis',
        ellos: 'saldrán',
      },
    },
  },
  {
    infinitive: 'traer',
    meaning: 'to bring',
    group: 'irregular',
    conjugations: {
      present: {
        yo: 'traigo',
        tu: 'traes',
        el: 'trae',
        nosotros: 'traemos',
        vosotros: 'traéis',
        ellos: 'traen',
      },
      preterite: {
        yo: 'traje',
        tu: 'trajiste',
        el: 'trajo',
        nosotros: 'trajimos',
        vosotros: 'trajisteis',
        ellos: 'trajeron',
      },
      future: {
        yo: 'traeré',
        tu: 'traerás',
        el: 'traerá',
        nosotros: 'traeremos',
        vosotros: 'traeréis',
        ellos: 'traerán',
      },
    },
  },
  {
    infinitive: 'oír',
    meaning: 'to hear',
    group: 'irregular',
    conjugations: {
      present: {
        yo: 'oigo',
        tu: 'oyes',
        el: 'oye',
        nosotros: 'oímos',
        vosotros: 'oís',
        ellos: 'oyen',
      },
      preterite: {
        yo: 'oí',
        tu: 'oíste',
        el: 'oyó',
        nosotros: 'oímos',
        vosotros: 'oísteis',
        ellos: 'oyeron',
      },
      future: {
        yo: 'oiré',
        tu: 'oirás',
        el: 'oirá',
        nosotros: 'oiremos',
        vosotros: 'oiréis',
        ellos: 'oirán',
      },
    },
  },
  {
    infinitive: 'conocer',
    meaning: 'to know (people / places)',
    group: 'irregular',
    conjugations: {
      present: {
        yo: 'conozco',
        tu: 'conoces',
        el: 'conoce',
        nosotros: 'conocemos',
        vosotros: 'conocéis',
        ellos: 'conocen',
      },
      preterite: {
        yo: 'conocí',
        tu: 'conociste',
        el: 'conoció',
        nosotros: 'conocimos',
        vosotros: 'conocisteis',
        ellos: 'conocieron',
      },
      future: {
        yo: 'conoceré',
        tu: 'conocerás',
        el: 'conocerá',
        nosotros: 'conoceremos',
        vosotros: 'conoceréis',
        ellos: 'conocerán',
      },
    },
  },
]

export type VerbCard = {
  id: number
  front: string
  back: string
  tip: string
  infinitive: string
  meaning: string
  tense: Tense
  pronounKey: PronounKey
  pronounEs: string
  pronounEn: string
  group: 'regular' | 'irregular'
}

function endingFamily(infinitive: string): string {
  if (infinitive.endsWith('ar')) return '-ar'
  if (infinitive.endsWith('er')) return '-er'
  if (infinitive.endsWith('ir')) return '-ir'
  return 'verb'
}

function buildVerbCards(): VerbCard[] {
  const cards: VerbCard[] = []
  let id = 1

  for (const verb of verbs) {
    for (const tense of Object.keys(TENSE_META) as Tense[]) {
      for (const pronoun of PRONOUNS) {
        const form = verb.conjugations[tense][pronoun.key]
        const tenseMeta = TENSE_META[tense]
        const family = endingFamily(verb.infinitive)
        const pattern =
          verb.group === 'regular'
            ? `Regular ${family} pattern.`
            : `Irregular — memorize this form of ${verb.infinitive}.`
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
          tip: `${tenseMeta.tip}. ${pattern} Pronoun: ${pronoun.en}.`,
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
