import type { GrammarSection } from './grammar'

export type GrammarExample = {
  es: string
  en: string
  /** Small colored tag, e.g. "ser", "por", "✓ tip" */
  tag?: string
  tone?: 'mint' | 'sky' | 'sun' | 'rose' | 'lilac' | 'coral' | 'sand'
}

export type GrammarContrast = {
  label: string
  left: GrammarExample
  right: GrammarExample
}

export type GrammarLesson = {
  title: string
  /** One memorable line at the top */
  hook: string
  summary: string
  bullets: string[]
  examples: GrammarExample[]
  contrasts?: GrammarContrast[]
  /** Sticky mnemonic footer */
  remember: string
}

export const GRAMMAR_LESSONS: Record<GrammarSection, GrammarLesson> = {
  gender: {
    title: 'Gender & agreement',
    hook: 'Every noun has a team color — masculine or feminine — and adjectives wear the same jersey.',
    summary:
      'Spanish nouns are masculine or feminine. Articles and adjectives must match that gender and number. Learn each noun with its article (el / la), not alone.',
    bullets: [
      'Default: nouns in -o → masculine · nouns in -a → feminine (then memorize the rebels).',
      'Adjectives usually change: rojo / roja / rojos / rojas.',
      'Reliable feminine endings: -ción, -sión, -dad, -tad, -tud, -umbre.',
      'Some adjectives ending in -e or a consonant stay the same for gender (verde, fácil) but still pluralize.',
    ],
    examples: [
      { es: 'el libro rojo', en: 'the red book', tag: '-o masc.', tone: 'sky' },
      { es: 'la casa roja', en: 'the red house', tag: '-a fem.', tone: 'rose' },
      { es: 'los libros rojos', en: 'the red books', tag: 'plural', tone: 'sky' },
      { es: 'las casas rojas', en: 'the red houses', tag: 'plural', tone: 'rose' },
      { es: 'la nación / la ciudad', en: 'nation / city (−ción, −dad)', tag: 'pattern', tone: 'lilac' },
      { es: 'el problema / el día', en: 'problem / day (look feminine, aren’t)', tag: 'trap!', tone: 'coral' },
      { es: 'la mano pequeña', en: 'the small hand (−o but feminine)', tag: 'trap!', tone: 'coral' },
      { es: 'una silla verde', en: 'a green chair (verde doesn’t change)', tag: '-e', tone: 'mint' },
    ],
    contrasts: [
      {
        label: 'Same ending, different gender',
        left: { es: 'el mapa', en: 'the map (masc.)', tag: 'el', tone: 'sky' },
        right: { es: 'la mano', en: 'the hand (fem.)', tag: 'la', tone: 'rose' },
      },
    ],
    remember:
      'Always learn “el ___” or “la ___” together. If the adjective disagrees, the whole phrase sounds wrong to native ears.',
  },

  articles: {
    title: 'Articles',
    hook: 'Spanish loves articles — “the” and “a” show up more often than in English.',
    summary:
      'Definite articles (el/la/los/las) mean “the.” Indefinite (un/una/unos/unas) mean “a / some.” Watch the special contractions al and del.',
    bullets: [
      'el / la / los / las = the · un / una / unos / unas = a / some.',
      'a + el → al · de + el → del (only with masculine singular el).',
      'Feminine nouns that start with stressed a-/ha- take el in the singular: el agua, el águila — but adjectives stay feminine.',
      'Days of the week often use the article: el lunes = on Monday.',
    ],
    examples: [
      { es: 'el parque', en: 'the park', tag: 'el', tone: 'sky' },
      { es: 'la escuela', en: 'the school', tag: 'la', tone: 'rose' },
      { es: 'Voy al mercado', en: 'I’m going to the market', tag: 'a+el', tone: 'sun' },
      { es: 'El libro del profesor', en: 'The teacher’s book', tag: 'de+el', tone: 'sun' },
      { es: 'el agua fría', en: 'the cold water (fem. noun!)', tag: 'el agua', tone: 'coral' },
      { es: 'las aguas', en: 'the waters (back to las)', tag: 'plural', tone: 'mint' },
      { es: 'un amigo / una amiga', en: 'a friend (m/f)', tag: 'un/una', tone: 'lilac' },
      { es: 'Nos vemos el viernes', en: 'See you on Friday', tag: 'days', tone: 'sand' },
    ],
    contrasts: [
      {
        label: 'Contraction only with el',
        left: { es: 'a la playa', en: 'to the beach', tag: 'no contract', tone: 'rose' },
        right: { es: 'al cine', en: 'to the movies', tag: 'al', tone: 'sky' },
      },
    ],
    remember:
      'If you can say “the” in English, Spanish usually wants el/la/los/las — especially with general ideas (Me gusta el café).',
  },

  'ser-estar': {
    title: 'Ser vs estar',
    hook: 'Two “to be” verbs. Ser paints who you are; estar pins where/how you are right now.',
    summary:
      'Mixing ser and estar can flip the meaning of an adjective. Use DOCTOR / PLACE as a starting map, then learn the classic pairs.',
    bullets: [
      'Ser: identity, profession, origin, time/date, inherent traits, where an event is held.',
      'Estar: location of people/things, feelings/conditions, progressive (estar + -ando/-iendo).',
      'Adjective switch: ser = essence · estar = temporary state (Es aburrido vs Está aburrido).',
      'Event venue → ser · Person/thing location → estar.',
    ],
    examples: [
      { es: 'Soy estudiante', en: 'I am a student', tag: 'ser · identity', tone: 'sky' },
      { es: 'Ella es de México', en: 'She is from Mexico', tag: 'ser · origin', tone: 'sky' },
      { es: 'Son las tres', en: 'It’s three o’clock', tag: 'ser · time', tone: 'sky' },
      { es: 'La fiesta es en mi casa', en: 'The party is at my place', tag: 'ser · event', tone: 'lilac' },
      { es: 'Estoy en casa', en: 'I’m at home', tag: 'estar · place', tone: 'mint' },
      { es: 'Estamos cansados', en: 'We’re tired', tag: 'estar · state', tone: 'mint' },
      { es: 'Está lloviendo', en: 'It’s raining', tag: 'estar + -ndo', tone: 'mint' },
      { es: 'La sopa está caliente', en: 'The soup is (now) hot', tag: 'condition', tone: 'sun' },
    ],
    contrasts: [
      {
        label: 'Same adjective, different verb',
        left: {
          es: 'Es aburrido',
          en: 'He’s boring (personality)',
          tag: 'ser',
          tone: 'sky',
        },
        right: {
          es: 'Está aburrido',
          en: 'He’s bored (right now)',
          tag: 'estar',
          tone: 'mint',
        },
      },
      {
        label: 'Location of event vs person',
        left: {
          es: 'El concierto es en el parque',
          en: 'The concert is in the park',
          tag: 'ser',
          tone: 'sky',
        },
        right: {
          es: 'Estoy en el parque',
          en: 'I am in the park',
          tag: 'estar',
          tone: 'mint',
        },
      },
    ],
    remember:
      'Ask: “Who/what is it essentially?” → ser. “Where is it / how is it right now?” → estar.',
  },

  'por-para': {
    title: 'Por vs para',
    hook: 'Para looks forward (goal, deadline, recipient). Por looks around/back (cause, route, exchange, duration).',
    summary:
      'Both can mean “for” in English — that’s the trap. Train your ear with purpose (para) vs reason/means (por).',
    bullets: [
      'Para: purpose (in order to), recipient, destination, deadline, opinion (para mí).',
      'Por: motive, exchange, through/along, duration, “per,” passive agent.',
      'Gracias por… (thanks for a reason) · Este regalo es para ti (gift goes to you).',
      'Voy por el parque (through) · Voy para el parque (headed toward).',
    ],
    examples: [
      { es: 'Estudio para aprender', en: 'I study in order to learn', tag: 'para · purpose', tone: 'sun' },
      { es: 'Este café es para Ana', en: 'This coffee is for Ana', tag: 'para · recipient', tone: 'sun' },
      { es: 'Salimos para Madrid', en: 'We’re leaving for Madrid', tag: 'para · destination', tone: 'sun' },
      { es: 'La tarea es para mañana', en: 'The homework is due tomorrow', tag: 'para · deadline', tone: 'sun' },
      { es: 'Lo hago por ti', en: 'I do it because of / for your sake', tag: 'por · motive', tone: 'coral' },
      { es: 'Pagué diez euros por el libro', en: 'I paid €10 for the book', tag: 'por · exchange', tone: 'coral' },
      { es: 'Caminamos por la playa', en: 'We walked along the beach', tag: 'por · through', tone: 'coral' },
      { es: 'Estudié por dos horas', en: 'I studied for two hours', tag: 'por · duration', tone: 'coral' },
    ],
    contrasts: [
      {
        label: 'Thanks vs gift',
        left: {
          es: 'Gracias por la ayuda',
          en: 'Thanks for the help',
          tag: 'por',
          tone: 'coral',
        },
        right: {
          es: 'Flores para mamá',
          en: 'Flowers for mom',
          tag: 'para',
          tone: 'sun',
        },
      },
      {
        label: 'Through vs toward',
        left: {
          es: 'Voy por el centro',
          en: 'I’m going through downtown',
          tag: 'por',
          tone: 'coral',
        },
        right: {
          es: 'Voy para el centro',
          en: 'I’m headed to downtown',
          tag: 'para',
          tone: 'sun',
        },
      },
    ],
    remember:
      'If you can swap in “in order to / destined for,” try para. If you mean “because of / by means of / for a period,” try por.',
  },

  prepositions: {
    title: 'Key prepositions',
    hook: 'Tiny words, big meaning. Learn them glued to phrases — not as dictionary clones of English.',
    summary:
      'a, de, en, con, sin, desde, hasta, and sobre show up constantly. The personal a is a Spanish specialty before people as direct objects.',
    bullets: [
      'a: to / at · also personal a before people (Veo a María).',
      'de: of / from · possession and origin (el libro de Ana, soy de Lima).',
      'en: in / on / at for location — days usually take el lunes, not en lunes.',
      'con / sin · desde / hasta · sobre (on top of / about).',
    ],
    examples: [
      { es: 'Voy a la tienda', en: 'I’m going to the store', tag: 'a', tone: 'sky' },
      { es: 'Llamo a mi madre', en: 'I call my mom (personal a)', tag: 'a + person', tone: 'lilac' },
      { es: 'El coche de Pablo', en: 'Pablo’s car', tag: 'de', tone: 'sand' },
      { es: 'Somos de Colombia', en: 'We’re from Colombia', tag: 'de', tone: 'sand' },
      { es: 'Está en la mesa', en: 'It’s on the table', tag: 'en', tone: 'mint' },
      { es: 'Café con leche', en: 'Coffee with milk', tag: 'con', tone: 'sun' },
      { es: 'Sin azúcar, por favor', en: 'Without sugar, please', tag: 'sin', tone: 'rose' },
      { es: 'Desde las nueve hasta las once', en: 'From 9 until 11', tag: 'desde/hasta', tone: 'coral' },
      { es: 'Un libro sobre historia', en: 'A book about history', tag: 'sobre', tone: 'lilac' },
    ],
    contrasts: [
      {
        label: 'Thing vs person as object',
        left: { es: 'Veo la película', en: 'I see the movie', tag: 'no a', tone: 'mint' },
        right: { es: 'Veo a María', en: 'I see María', tag: 'personal a', tone: 'lilac' },
      },
    ],
    remember:
      'Build chunks: ir a, venir de, estar en, hablar con, pensar en / sobre. Chunks beat word-by-word translation.',
  },

  'object-pronouns': {
    title: 'Object pronouns',
    hook: 'Don’t repeat the noun — point with a tiny word. Placement is half the battle.',
    summary:
      'Direct pronouns replace what/whom you act on. Indirect pronouns replace to/for whom. They go before a conjugated verb, or can attach to infinitives and gerunds.',
    bullets: [
      'Direct: me, te, lo/la, nos, os, los/las.',
      'Indirect: me, te, le, nos, os, les — and le/les → se before lo/la/los/las.',
      'Lo veo · Quiero verlo / Lo quiero ver.',
      'Se lo di = I gave it to him/her/you/them.',
    ],
    examples: [
      { es: 'Te llamo mañana', en: 'I’ll call you tomorrow', tag: 'te', tone: 'sky' },
      { es: 'Lo compro', en: 'I’m buying it (masc.)', tag: 'lo', tone: 'mint' },
      { es: 'La veo en la calle', en: 'I see her / it (fem.) in the street', tag: 'la', tone: 'rose' },
      { es: 'Le doy el libro', en: 'I give him/her the book', tag: 'le', tone: 'sun' },
      { es: 'Se lo doy', en: 'I give it to him/her', tag: 'se + lo', tone: 'coral' },
      { es: '¿Me puedes ayudar?', en: 'Can you help me?', tag: 'before verb', tone: 'lilac' },
      { es: 'Puedes ayudarme', en: 'You can help me', tag: 'attached', tone: 'lilac' },
      { es: 'Estoy leyéndolo', en: 'I’m reading it', tag: 'gerund', tone: 'sand' },
    ],
    contrasts: [
      {
        label: 'le vs se lo',
        left: {
          es: 'Le escribo una carta',
          en: 'I write a letter to him/her',
          tag: 'le',
          tone: 'sun',
        },
        right: {
          es: 'Se la escribo',
          en: 'I write it to him/her',
          tag: 'se + la',
          tone: 'coral',
        },
      },
    ],
    remember:
      'Order when both appear: se → te/me/nos → lo/la/los/las. If it feels crowded, you’re probably right.',
  },

  gustar: {
    title: 'Gustar-type verbs',
    hook: 'Flip the English sentence: the thing is the subject. “Coffee is pleasing to me.”',
    summary:
      'With gustar, encantar, interesar, doler, faltar… the liked thing controls the verb (gusta / gustan), and the person is an indirect object (me, te, le…).',
    bullets: [
      'Me gusta el café · Me gustan los libros — number matches what is liked.',
      'Clarify people with a mí, a ti, a ella, a nosotros…',
      'Same family: encantar, interesar, faltar, doler, parecer, quedar.',
      'Me gustaría… is a polite “I would like…”',
    ],
    examples: [
      { es: 'Me gusta el chocolate', en: 'I like chocolate', tag: 'gusta · singular', tone: 'sun' },
      { es: 'Me gustan las películas', en: 'I like movies', tag: 'gustan · plural', tone: 'sun' },
      { es: '¿Te gusta bailar?', en: 'Do you like to dance?', tag: 'infinitive', tone: 'sky' },
      { es: 'A ella le encanta el verano', en: 'She loves summer', tag: 'encantar', tone: 'rose' },
      { es: 'Nos interesa la historia', en: 'History interests us', tag: 'interesar', tone: 'lilac' },
      { es: 'Me duele la cabeza', en: 'My head hurts', tag: 'doler', tone: 'coral' },
      { es: 'Nos faltan dos sillas', en: 'We’re missing two chairs', tag: 'faltar', tone: 'sand' },
      { es: 'Me gustaría un café', en: 'I would like a coffee', tag: 'polite', tone: 'mint' },
    ],
    contrasts: [
      {
        label: 'Who likes what',
        left: {
          es: 'A mí me gusta',
          en: 'I like it (emphasis on me)',
          tag: 'a mí',
          tone: 'sky',
        },
        right: {
          es: 'A ellos les gusta',
          en: 'They like it',
          tag: 'a ellos',
          tone: 'lilac',
        },
      },
    ],
    remember:
      'Find the thing that is liked — that noun (or infinitive) is the boss of gusta/gustan.',
  },

  reflexives: {
    title: 'Reflexive verbs',
    hook: 'The subject does it to itself — mornings are full of me/te/se: wash, get up, go to bed.',
    summary:
      'Reflexive pronouns: me, te, se, nos, os, se. Many routine verbs are reflexive in Spanish even when English doesn’t say “myself.”',
    bullets: [
      'Me lavo · Te despiertas · Se llama Ana.',
      'Pronoun before conjugated verb, or stuck on infinitive/gerund: Voy a ducharme.',
      'Meaning shifts: ir vs irse, dormir vs dormirse, parecer vs parecerse.',
      'Reciprocal: Nos escribimos = We write to each other.',
    ],
    examples: [
      { es: 'Me levanto a las siete', en: 'I get up at seven', tag: 'routine', tone: 'mint' },
      { es: 'Se cepilla los dientes', en: 'He/She brushes his/her teeth', tag: 'se', tone: 'sky' },
      { es: 'Nos acostamos temprano', en: 'We go to bed early', tag: 'nos', tone: 'lilac' },
      { es: '¿Cómo te llamas?', en: 'What’s your name?', tag: 'llamarse', tone: 'sun' },
      { es: 'Voy a ducharme', en: 'I’m going to shower', tag: 'attached', tone: 'sand' },
      { es: 'Me estoy vistiendo', en: 'I’m getting dressed', tag: 'progressive', tone: 'sand' },
      { es: 'Nos vemos mañana', en: 'See you tomorrow (each other)', tag: 'reciprocal', tone: 'rose' },
      { es: 'Se fue a las diez', en: 'He/She left at ten (irse)', tag: 'irse', tone: 'coral' },
    ],
    contrasts: [
      {
        label: 'With and without se',
        left: { es: 'Duerme ocho horas', en: 'He sleeps eight hours', tag: 'dormir', tone: 'sky' },
        right: {
          es: 'Se duerme en el sofá',
          en: 'He falls asleep on the sofa',
          tag: 'dormirse',
          tone: 'mint',
        },
      },
    ],
    remember:
      'If the English idea is “get ___ / ___ myself / each other,” check for a se-verb in Spanish.',
  },

  negation: {
    title: 'Negation',
    hook: 'Start with no before the verb — then stack nada / nadie / nunca without fear. Double negatives are correct.',
    summary:
      'Spanish negation is friendly once you drop the English rule “two negatives make a positive.” After no, negative words reinforce the no.',
    bullets: [
      'Basic: No + verb → No entiendo.',
      'Add nada, nadie, nunca, tampoco, ningún… after no.',
      'You can also front the negative word: Nadie vino · Nunca como carne.',
      'ningún + masc. noun · ninguna + fem. noun.',
    ],
    examples: [
      { es: 'No hablo francés', en: 'I don’t speak French', tag: 'no + verb', tone: 'coral' },
      { es: 'No quiero nada', en: 'I don’t want anything', tag: 'nada', tone: 'rose' },
      { es: 'No veo a nadie', en: 'I don’t see anyone', tag: 'nadie', tone: 'rose' },
      { es: 'No voy nunca', en: 'I never go', tag: 'nunca', tone: 'lilac' },
      { es: 'Nunca como aquí', en: 'I never eat here', tag: 'fronted', tone: 'lilac' },
      { es: 'Yo tampoco', en: 'Me neither', tag: 'tampoco', tone: 'sun' },
      { es: 'No tengo ningún plan', en: 'I don’t have any plan', tag: 'ningún', tone: 'sand' },
      { es: 'No hay ninguna duda', en: 'There’s no doubt', tag: 'ninguna', tone: 'sand' },
    ],
    contrasts: [
      {
        label: 'English vs Spanish logic',
        left: {
          es: 'No sé nada',
          en: 'I don’t know anything ✓',
          tag: 'correct',
          tone: 'mint',
        },
        right: {
          es: 'No sé algo',
          en: 'Sounds like “I don’t know something” (odd)',
          tag: 'avoid',
          tone: 'coral',
        },
      },
    ],
    remember:
      'Hear “no… nada/nadie/nunca” as one team. They’re teammates, not enemies.',
  },

  comparisons: {
    title: 'Comparisons',
    hook: 'More than, less than, as… as — Spanish builds them with más / menos / tan / tanto.',
    summary:
      'Compare qualities with más/menos + adjective + que. Equal qualities use tan… como. Equal quantities use tanto/a/os/as… como.',
    bullets: [
      'más / menos + adj/adv/noun + que.',
      'tan + adj/adv + como · tanto(a/os/as) + noun + como.',
      'Irregular stars: mejor, peor, mayor, menor.',
      'Superlative: el/la más… · -ísimo for “super” intensity.',
    ],
    examples: [
      { es: 'Más alto que yo', en: 'Taller than me', tag: 'más… que', tone: 'sky' },
      { es: 'Menos caro que ese', en: 'Less expensive than that one', tag: 'menos… que', tone: 'mint' },
      { es: 'Tan rápido como tú', en: 'As fast as you', tag: 'tan… como', tone: 'sun' },
      { es: 'Tantas ideas como ella', en: 'As many ideas as she has', tag: 'tantas', tone: 'sun' },
      { es: 'Mejor que ayer', en: 'Better than yesterday', tag: 'mejor', tone: 'lilac' },
      { es: 'El más divertido de la clase', en: 'The funniest in the class', tag: 'superlative', tone: 'rose' },
      { es: 'Está facilísimo', en: 'It’s super easy', tag: '-ísimo', tone: 'coral' },
      { es: 'Mayor que su hermano', en: 'Older than his brother', tag: 'mayor', tone: 'sand' },
    ],
    contrasts: [
      {
        label: 'Quality vs quantity',
        left: {
          es: 'Tan inteligente como Ana',
          en: 'As smart as Ana',
          tag: 'tan + adj',
          tone: 'sky',
        },
        right: {
          es: 'Tanto dinero como Ana',
          en: 'As much money as Ana',
          tag: 'tanto + noun',
          tone: 'sun',
        },
      },
    ],
    remember:
      'que after más/menos · como after tan/tanto. Mixing them is the classic slip.',
  },

  demonstratives: {
    title: 'Demonstratives',
    hook: 'Point with words: this (by me), that (by you), that way over there (far from us both).',
    summary:
      'este / ese / aquel families mark distance. Neuter esto / eso / aquello point to ideas or unnamed things.',
    bullets: [
      'este/esta/estos/estas = this/these (near speaker).',
      'ese/esa/esos/esas = that/those (near listener / medium).',
      'aquel/aquella/aquellos/aquellas = that/those far away.',
      'esto / eso / aquello = “this/that (thing/idea)” with no gender.',
    ],
    examples: [
      { es: 'Este libro es mío', en: 'This book is mine', tag: 'este', tone: 'mint' },
      { es: 'Esa casa es grande', en: 'That house is big', tag: 'esa', tone: 'sun' },
      { es: 'Aquellas montañas', en: 'Those mountains (far)', tag: 'aquellas', tone: 'lilac' },
      { es: '¿Qué es esto?', en: 'What is this?', tag: 'esto', tone: 'sky' },
      { es: 'No me gusta eso', en: 'I don’t like that', tag: 'eso', tone: 'sky' },
      { es: 'Aquí / ahí / allí', en: 'here / there / over there', tag: 'places', tone: 'sand' },
      { es: 'Estos zapatos', en: 'These shoes', tag: 'estos', tone: 'mint' },
      { es: 'Esos días', en: 'Those days', tag: 'esos', tone: 'sun' },
    ],
    contrasts: [
      {
        label: 'Near me vs far away',
        left: { es: 'Esta silla', en: 'This chair (here)', tag: 'esta', tone: 'mint' },
        right: { es: 'Aquella silla', en: 'That chair (way over there)', tag: 'aquella', tone: 'lilac' },
      },
    ],
    remember:
      'Pair them with place: aquí↔este, ahí↔ese, allí↔aquel. Distance is the whole game.',
  },

  possessives: {
    title: 'Possessives',
    hook: 'Short forms hug the noun (mi libro). Long forms stand alone or after (es mío).',
    summary:
      'mi/tu/su… agree with what is owned. su/sus is flexible (his/her/your/their) — clarify with de él, de usted when needed.',
    bullets: [
      'Before noun: mi/mis, tu/tus, su/sus, nuestro/a/os/as, vuestro…',
      'su/sus ambiguity → de él / de ella / de usted / de ellos.',
      'Long forms: mío, tuyo, suyo, nuestro… (Es mío).',
      'el mío / la mía = mine (the one that is mine).',
    ],
    examples: [
      { es: 'Mi hermana', en: 'My sister', tag: 'mi', tone: 'sky' },
      { es: 'Tus amigos', en: 'Your friends', tag: 'tus', tone: 'mint' },
      { es: 'Su coche', en: 'His/Her/Your/Their car', tag: 'su', tone: 'coral' },
      { es: 'El coche de ella', en: 'Her car (clarified)', tag: 'clarify', tone: 'coral' },
      { es: 'Nuestra casa', en: 'Our house', tag: 'nuestra', tone: 'sun' },
      { es: 'Es mío', en: 'It’s mine', tag: 'mío', tone: 'lilac' },
      { es: '¿Dónde está el tuyo?', en: 'Where’s yours?', tag: 'el tuyo', tone: 'lilac' },
      { es: 'Un amigo mío', en: 'A friend of mine', tag: 'after noun', tone: 'sand' },
    ],
    contrasts: [
      {
        label: 'Short vs long',
        left: { es: 'Mi libro', en: 'My book', tag: 'short', tone: 'sky' },
        right: { es: 'El libro es mío', en: 'The book is mine', tag: 'long', tone: 'lilac' },
      },
    ],
    remember:
      'Agree with the thing owned: nuestras ideas (ideas is feminine plural), even if “we” are mixed genders.',
  },

  'pret-imp': {
    title: 'Preterite vs imperfect',
    hook: 'Preterite snaps a photo of what happened. Imperfect plays the background movie.',
    summary:
      'Both talk about the past. Preterite = completed events that push the story. Imperfect = habits, descriptions, ongoing scenes, “used to.”',
    bullets: [
      'Preterite: Ayer comí · Llegó · Empezó a llover.',
      'Imperfect: Hacía frío · Yo leía cuando… · Íbamos cada domingo.',
      'Clock, age, weather in stories often imperfect: Eran las dos · Tenía diez años.',
      'Blend them: scene (imperfect) + interrupting action (preterite).',
    ],
    examples: [
      { es: 'Ayer visité a mi abuela', en: 'Yesterday I visited my grandma', tag: 'pret.', tone: 'coral' },
      { es: 'De niño jugaba fútbol', en: 'As a kid I used to play soccer', tag: 'imp.', tone: 'sky' },
      { es: 'Eran las ocho', en: 'It was eight o’clock', tag: 'imp. · time', tone: 'sky' },
      { es: 'Hacía sol y cantaban pájaros', en: 'It was sunny and birds were singing', tag: 'scene', tone: 'mint' },
      { es: 'De repente sonó el teléfono', en: 'Suddenly the phone rang', tag: 'plot twist', tone: 'coral' },
      { es: 'Leía cuando llegaste', en: 'I was reading when you arrived', tag: 'mix', tone: 'sun' },
      { es: 'Fui / iba', en: 'I went (once) / I used to go / was going', tag: 'ir', tone: 'lilac' },
      { es: 'Supo / sabía', en: 'Found out / knew (state)', tag: 'saber', tone: 'sand' },
    ],
    contrasts: [
      {
        label: 'One night vs habit',
        left: {
          es: 'Anoche cené pizza',
          en: 'Last night I ate pizza',
          tag: 'preterite',
          tone: 'coral',
        },
        right: {
          es: 'Cenaba pizza los viernes',
          en: 'I used to eat pizza on Fridays',
          tag: 'imperfect',
          tone: 'sky',
        },
      },
      {
        label: 'Story craft',
        left: {
          es: 'Estaba oscuro…',
          en: 'It was dark… (setting)',
          tag: 'imperfect',
          tone: 'sky',
        },
        right: {
          es: '…y entró alguien',
          en: '…and someone came in',
          tag: 'preterite',
          tone: 'coral',
        },
      },
    ],
    remember:
      'If you can say “used to / was ___ing / meanwhile,” lean imperfect. If you can put it on a timeline as a finished event, lean preterite.',
  },

  commands: {
    title: 'Commands (imperative)',
    hook: 'Tell someone what to do — or what not to do. Affirmative and negative tú forms are different recipes.',
    summary:
      'Tú affirmative often looks like 3rd-person present (¡Habla!). Tú negative uses the present subjunctive (¡No hables!). Usted(es) use subjunctive both ways.',
    bullets: [
      'Tú + : habla, come, vive · irregulars: haz, ve, ten, ven, sal, sé, di, pon.',
      'Tú − : no hables, no comas, no vivas.',
      'Usted(es): hable / no hable · hablen / no hablen.',
      'Pronouns attach on affirmative (Dímelo) and go before negatives (No me lo digas).',
    ],
    examples: [
      { es: '¡Habla más alto!', en: 'Speak louder!', tag: 'tú +', tone: 'sun' },
      { es: '¡No hables ahora!', en: 'Don’t speak now!', tag: 'tú −', tone: 'coral' },
      { es: '¡Ven aquí!', en: 'Come here!', tag: 'irregular', tone: 'lilac' },
      { es: '¡Haz la cama!', en: 'Make the bed!', tag: 'haz', tone: 'lilac' },
      { es: '¡Ponga su firma, por favor!', en: 'Please sign (usted)', tag: 'usted', tone: 'mint' },
      { es: '¡No abran la puerta!', en: 'Don’t open the door! (plural)', tag: 'ustedes −', tone: 'mint' },
      { es: 'Dime la verdad', en: 'Tell me the truth', tag: 'attach', tone: 'sky' },
      { es: 'No me digas eso', en: 'Don’t tell me that', tag: 'before', tone: 'rose' },
    ],
    contrasts: [
      {
        label: 'Same verb, + vs −',
        left: { es: 'Come la sopa', en: 'Eat the soup', tag: 'affirmative', tone: 'sun' },
        right: { es: 'No comas la sopa', en: 'Don’t eat the soup', tag: 'negative', tone: 'coral' },
      },
      {
        label: 'Pronoun parking',
        left: { es: 'Páralo', en: 'Stop it', tag: 'attached', tone: 'sky' },
        right: { es: 'No lo pares', en: 'Don’t stop it', tag: 'before', tone: 'rose' },
      },
    ],
    remember:
      'Positive tú ≈ present él/ella form (with irregular short list). Negative tú ≈ present subjunctive. Pronouns stick to “do it,” float before “don’t.”',
  },
}

export function getGrammarLesson(
  section: GrammarSection | 'all',
): GrammarLesson {
  if (section === 'all') {
    return {
      title: 'How to use Grammar',
      hook: 'Pick a chapter below — each one opens a colorful mini-lesson packed with real examples before you drill cards.',
      summary:
        'This track teaches the rules that make Spanish sentences click: agreement, ser/estar, por/para, pronouns, past tenses, and more. Read the lesson, notice the contrast pairs, then lock it in with flashcards.',
      bullets: [
        'Newer? Start with Gender, Articles, and Ser vs estar.',
        'Conversation unlocks: Por/para, Gustar, and Object pronouns.',
        'Story power: Preterite vs imperfect · everyday bossing: Commands.',
        'Every flashcard reveal adds a tip — the lesson is your map; cards are the reps.',
      ],
      examples: [
        {
          es: 'Ser vs estar',
          en: 'Two ways to say “to be”',
          tag: 'start here',
          tone: 'sky',
        },
        {
          es: 'Por vs para',
          en: 'Two ways to say “for”',
          tag: 'classic trap',
          tone: 'sun',
        },
        {
          es: 'Me gusta…',
          en: 'Liking things the Spanish way',
          tag: 'flip it',
          tone: 'rose',
        },
        {
          es: 'Ayer vs siempre',
          en: 'Preterite vs imperfect',
          tag: 'past',
          tone: 'coral',
        },
      ],
      remember:
        'Tap a specific chapter for the full lesson with bilingual examples and side-by-side contrasts.',
    }
  }
  return GRAMMAR_LESSONS[section]
}
