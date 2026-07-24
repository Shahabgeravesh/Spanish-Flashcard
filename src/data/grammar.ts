export type GrammarSection =
  | 'gender'
  | 'articles'
  | 'ser-estar'
  | 'por-para'
  | 'prepositions'
  | 'object-pronouns'
  | 'gustar'
  | 'reflexives'
  | 'negation'
  | 'comparisons'
  | 'demonstratives'
  | 'possessives'
  | 'pret-imp'
  | 'commands'

export type GrammarCard = {
  id: number
  front: string
  back: string
  tip: string
  /** Short rule label shown above the tip */
  rule?: string
  section: GrammarSection
  speak?: string
}

export {
  getGrammarLesson,
  GRAMMAR_LESSONS,
  type GrammarLesson,
  type GrammarExample,
  type GrammarContrast,
} from './grammarLessons'

export const GRAMMAR_SECTIONS: {
  id: GrammarSection | 'all'
  label: string
}[] = [
  { id: 'all', label: 'All' },
  { id: 'gender', label: 'Gender & agreement' },
  { id: 'articles', label: 'Articles' },
  { id: 'ser-estar', label: 'Ser vs estar' },
  { id: 'por-para', label: 'Por vs para' },
  { id: 'prepositions', label: 'Prepositions' },
  { id: 'object-pronouns', label: 'Object pronouns' },
  { id: 'gustar', label: 'Gustar verbs' },
  { id: 'reflexives', label: 'Reflexives' },
  { id: 'negation', label: 'Negation' },
  { id: 'comparisons', label: 'Comparisons' },
  { id: 'demonstratives', label: 'Demonstratives' },
  { id: 'possessives', label: 'Possessives' },
  { id: 'pret-imp', label: 'Preterite vs imperfect' },
  { id: 'commands', label: 'Commands' },
]

const RAW: {
  front: string
  back: string
  tip: string
  rule?: string
  section: GrammarSection
  speak?: string
}[] = [
  // ——— Gender ———
  {
    section: 'gender',
    front: 'Most nouns ending in -o are…',
    back: 'masculine (el libro)',
    rule: 'Gender endings',
    tip: 'Default pattern only — exceptions exist (la mano, la foto from fotografía). Learn gender with the article.',
  },
  {
    section: 'gender',
    front: 'Most nouns ending in -a are…',
    back: 'feminine (la casa)',
    rule: 'Gender endings',
    tip: 'Exceptions include el día, el mapa, el problema (many -ma from Greek are masculine).',
  },
  {
    section: 'gender',
    front: 'Nouns ending in -ción / -sión are usually…',
    back: 'feminine (la nación, la televisión)',
    rule: 'Reliable endings',
    tip: 'Also feminine: -dad, -tad, -tud, -umbre (la ciudad, la libertad, la virtud).',
  },
  {
    section: 'gender',
    front: 'Agree the adjective: “the red house”',
    back: 'la casa roja',
    rule: 'Agreement',
    tip: 'Adjective matches casa (feminine singular): roja, not rojo. Plural: las casas rojas.',
  },
  {
    section: 'gender',
    front: 'Agree: “the white books”',
    back: 'los libros blancos',
    rule: 'Agreement',
    tip: 'libros is masculine plural → blancos. Color adjectives usually follow the noun.',
  },
  {
    section: 'gender',
    front: '“the hand” (exception)',
    back: 'la mano',
    rule: 'Exceptions',
    tip: 'Ends in -o but is feminine. Plural: las manos. Adjective: la mano pequeña.',
  },
  {
    section: 'gender',
    front: '“the day” (exception)',
    back: 'el día',
    rule: 'Exceptions',
    tip: 'Ends in -a but is masculine. Buenos días. “All day” = todo el día.',
  },
  {
    section: 'gender',
    front: 'Adjectives ending in -e or consonant…',
    back: 'often don’t change for gender (verde, fácil)',
    rule: 'Invariant adjectives',
    tip: 'They still change for number: verdes, fáciles. Some add -a historically, but verde stays verde.',
  },

  // ——— Articles ———
  {
    section: 'articles',
    front: 'the (masc. singular)',
    back: 'el',
    rule: 'Definite',
    tip: 'a + el → al · de + el → del. Don’t contract with la: a la, de la.',
  },
  {
    section: 'articles',
    front: 'the (fem. singular)',
    back: 'la',
    rule: 'Definite',
    tip: 'Before stressed á/ha feminine nouns, Spanish uses el: el agua fría (adjective still feminine).',
  },
  {
    section: 'articles',
    front: 'a / an (masc.)',
    back: 'un',
    rule: 'Indefinite',
    tip: 'Un libro = a book. Plural unos = some / a few (unos amigos).',
  },
  {
    section: 'articles',
    front: 'a / an (fem.)',
    back: 'una',
    rule: 'Indefinite',
    tip: 'Una casa. Plural: unas. Before stressed á: un águila (like el agua).',
  },
  {
    section: 'articles',
    front: '“to the park” (contraction)',
    back: 'al parque',
    rule: 'al / del',
    tip: 'a + el = al. Only with el, never with la/los/las.',
  },
  {
    section: 'articles',
    front: '“of the teacher” (masc.)',
    back: 'del profesor',
    rule: 'al / del',
    tip: 'de + el = del. Feminine stays de la profesora.',
  },
  {
    section: 'articles',
    front: 'On Monday (with article)',
    back: 'el lunes',
    rule: 'Habits with articles',
    tip: 'Spanish often uses the article with days: El lunes trabajo. Los lunes = on Mondays.',
  },
  {
    section: 'articles',
    front: 'I like coffee (generic noun)',
    back: 'Me gusta el café',
    rule: 'Generic “the”',
    tip: 'Talking about coffee in general uses el. English often drops “the”; Spanish usually keeps it.',
  },

  // ——— Ser vs estar ———
  {
    section: 'ser-estar',
    front: 'I am a teacher (identity)',
    back: 'Soy profesor / profesora',
    rule: 'Ser → identity',
    tip: 'Profession and who you are use ser. Temporary role can still be ser: Soy estudiante.',
  },
  {
    section: 'ser-estar',
    front: 'I am in Madrid (location)',
    back: 'Estoy en Madrid',
    rule: 'Estar → location',
    tip: 'People and things: estar for location. Events: La reunión es en Madrid (ser).',
  },
  {
    section: 'ser-estar',
    front: 'She is tired (condition)',
    back: 'Está cansada',
    rule: 'Estar → state',
    tip: 'Temporary condition → estar. Es cansada would sound like “she is a tiring person.”',
  },
  {
    section: 'ser-estar',
    front: 'The party is at my house',
    back: 'La fiesta es en mi casa',
    rule: 'Ser → event place',
    tip: 'Where an event takes place = ser. Where a person is = estar (Estoy en mi casa).',
  },
  {
    section: 'ser-estar',
    front: 'It is 3:00',
    back: 'Son las tres',
    rule: 'Ser → time',
    tip: 'Clock time uses ser. Era/eran for past clock time (imperfect).',
  },
  {
    section: 'ser-estar',
    front: 'I am from Mexico',
    back: 'Soy de México',
    rule: 'Ser → origin',
    tip: 'Origin and nationality: ser de… / Soy mexicano. Location right now still uses estar.',
  },
  {
    section: 'ser-estar',
    front: 'He is boring (personality) vs bored',
    back: 'Es aburrido vs Está aburrido',
    rule: 'Adjective shift',
    tip: 'ser + adjective = characteristic · estar + adjective = how they feel/seem right now.',
  },
  {
    section: 'ser-estar',
    front: 'I am eating (progressive)',
    back: 'Estoy comiendo',
    rule: 'Estar + gerund',
    tip: 'estar + -ando/-iendo = right now. Habitual “I eat” is simply Como.',
  },

  // ——— Por vs para ———
  {
    section: 'por-para',
    front: 'This gift is for you (recipient)',
    back: 'Este regalo es para ti',
    rule: 'Para → recipient',
    tip: 'Intended recipient or beneficiary → para. Gracias por el regalo uses por (thanks for).',
  },
  {
    section: 'por-para',
    front: 'I study in order to learn',
    back: 'Estudio para aprender',
    rule: 'Para → purpose',
    tip: 'para + infinitive = in order to. Motive “because of” is often por.',
  },
  {
    section: 'por-para',
    front: 'The homework is for Friday',
    back: 'La tarea es para el viernes',
    rule: 'Para → deadline',
    tip: 'Deadlines and due dates → para. Duration “for two hours” → por dos horas.',
  },
  {
    section: 'por-para',
    front: 'Thanks for your help',
    back: 'Gracias por tu ayuda',
    rule: 'Por → gratitude / cause',
    tip: 'Gracias por… is fixed. Por also covers cause: Llegué tarde por el tráfico.',
  },
  {
    section: 'por-para',
    front: 'I walked through the park',
    back: 'Caminé por el parque',
    rule: 'Por → through / along',
    tip: 'Movement through a space → por. Heading toward a destination → para el parque.',
  },
  {
    section: 'por-para',
    front: 'I worked for three hours',
    back: 'Trabajé por tres horas',
    rule: 'Por → duration',
    tip: 'por + time = for (duration). durante also works: durante tres horas.',
  },
  {
    section: 'por-para',
    front: 'In my opinion…',
    back: 'Para mí…',
    rule: 'Para → opinion',
    tip: 'para + person often means “as far as X is concerned.” Por mí can mean “for my sake / fine by me.”',
  },
  {
    section: 'por-para',
    front: 'Two dollars each / per day',
    back: 'dos dólares por día',
    rule: 'Por → per / rate',
    tip: 'Rates and “per”: por hora, por persona. Exchange: Te doy 10 por el libro.',
  },

  // ——— Prepositions ———
  {
    section: 'prepositions',
    front: 'I go to the store',
    back: 'Voy a la tienda',
    rule: 'a',
    tip: 'a = to / at. With people as direct objects, add personal a: Visito a mi abuela.',
  },
  {
    section: 'prepositions',
    front: 'The book of Ana / Ana’s book',
    back: 'el libro de Ana',
    rule: 'de',
    tip: 'de marks possession and origin. No ’s in Spanish — use de.',
  },
  {
    section: 'prepositions',
    front: 'I am in the house / at home',
    back: 'Estoy en la casa / en casa',
    rule: 'en',
    tip: 'en covers in, on, at for location. en casa is a set phrase for “at home.”',
  },
  {
    section: 'prepositions',
    front: 'coffee with milk / without sugar',
    back: 'café con leche / sin azúcar',
    rule: 'con / sin',
    tip: 'con = with · sin = without. sin takes no article often: sin azúcar.',
  },
  {
    section: 'prepositions',
    front: 'from Monday until Friday',
    back: 'desde el lunes hasta el viernes',
    rule: 'desde / hasta',
    tip: 'desde = from / since · hasta = until / up to. Also: hasta luego.',
  },
  {
    section: 'prepositions',
    front: 'a book about history',
    back: 'un libro sobre historia',
    rule: 'sobre',
    tip: 'sobre = on top of / about. de can also mean “about” in some phrases.',
  },
  {
    section: 'prepositions',
    front: 'I see María (personal a)',
    back: 'Veo a María',
    rule: 'Personal a',
    tip: 'Direct object that is a specific person (or pet) needs a. Veo la película — no a for things.',
  },
  {
    section: 'prepositions',
    front: 'Think about / of the future',
    back: 'pensar en el futuro',
    rule: 'Verb + fixed prep',
    tip: 'Many verbs demand a set preposition: soñar con, casarse con, depender de. Learn as chunks.',
  },

  // ——— Object pronouns ———
  {
    section: 'object-pronouns',
    front: 'I see it (masc. singular)',
    back: 'Lo veo',
    rule: 'Direct object',
    tip: 'lo/la/los/las replace the thing seen. Feminine singular: La veo.',
  },
  {
    section: 'object-pronouns',
    front: 'She gives me the book → She gives it to me',
    back: 'Me lo da',
    rule: 'Indirect + direct',
    tip: 'Order: indirect then direct. me/te/nos + lo/la… Pronouns before the conjugated verb.',
  },
  {
    section: 'object-pronouns',
    front: 'I give it to him/her (le + lo)',
    back: 'Se lo doy',
    rule: 'le/les → se',
    tip: 'le/les cannot sit before lo/la/los/las — they become se. Se lo doy a Ana.',
  },
  {
    section: 'object-pronouns',
    front: 'I want to see it (two options)',
    back: 'Quiero verlo / Lo quiero ver',
    rule: 'Placement',
    tip: 'With infinitive or gerund, attach or place before the conjugated verb — both correct.',
  },
  {
    section: 'object-pronouns',
    front: 'Tell me (affirmative command)',
    back: 'Dime',
    rule: 'Commands',
    tip: 'Affirmative commands attach pronouns: Dime, Háblame. Negative: No me digas.',
  },
  {
    section: 'object-pronouns',
    front: 'We call you (plural vosotros region)',
    back: 'Os llamamos',
    rule: 'os',
    tip: 'os = you all (Spain informal). In Latin America use los/les + ustedes forms instead.',
  },
  {
    section: 'object-pronouns',
    front: 'I don’t know them (people, masc.)',
    back: 'No los conozco',
    rule: 'Direct object',
    tip: 'People can be lo/la or use personal a with a noun: No conozco a tus amigos.',
  },
  {
    section: 'object-pronouns',
    front: 'Can you explain it to us?',
    back: '¿Nos lo puedes explicar? / ¿Puedes explicárnoslo?',
    rule: 'Placement',
    tip: 'Two pronouns can attach to the infinitive (accent often needed: explicárnoslo) or go before.',
  },

  // ——— Gustar ———
  {
    section: 'gustar',
    front: 'I like coffee',
    back: 'Me gusta el café',
    rule: 'Agreement',
    tip: 'gusta agrees with café (singular). The “I” is me, not the subject.',
  },
  {
    section: 'gustar',
    front: 'I like books',
    back: 'Me gustan los libros',
    rule: 'Agreement',
    tip: 'Plural thing liked → gustan. Me gusta leer is singular because the subject is the infinitive leer.',
  },
  {
    section: 'gustar',
    front: 'She likes the movie',
    back: 'Le gusta la película',
    rule: 'le / les',
    tip: 'Clarify with a ella if needed: A ella le gusta. les for ustedes/ellos.',
  },
  {
    section: 'gustar',
    front: 'We don’t like waiting',
    back: 'No nos gusta esperar',
    rule: 'Negation',
    tip: 'no goes before the pronoun+verb chunk: No nos gusta. Infinitive subject stays singular.',
  },
  {
    section: 'gustar',
    front: 'I love this song (encantar)',
    back: 'Me encanta esta canción',
    rule: 'Same pattern',
    tip: 'encantar, interesar, faltar, doler follow gustar: Me duelen los pies.',
  },
  {
    section: 'gustar',
    front: 'I would like a water, please',
    back: 'Me gustaría un agua, por favor',
    rule: 'Polite request',
    tip: 'Conditional gustaría softens requests — very common when ordering.',
  },
  {
    section: 'gustar',
    front: 'Do you like it? (tú)',
    back: '¿Te gusta?',
    rule: 'Questions',
    tip: 'Invert or use rising intonation. ¿Te gustan? if “they” are plural.',
  },
  {
    section: 'gustar',
    front: 'They like us / We appeal to them',
    back: 'Les gustamos',
    rule: 'People as subject',
    tip: 'If people are what is liked, the verb agrees with those people: Les gustamos (nosotros).',
  },

  // ——— Reflexives ———
  {
    section: 'reflexives',
    front: 'I wake up at 7',
    back: 'Me despierto a las 7',
    rule: 'Daily routine',
    tip: 'Many routine verbs are reflexive: despertarse, levantarse, ducharse, vestirse, acostarse.',
  },
  {
    section: 'reflexives',
    front: 'Her name is Ana',
    back: 'Se llama Ana',
    rule: 'llamarse',
    tip: 'llamarse = to be called. ¿Cómo te llamas? / Me llamo…',
  },
  {
    section: 'reflexives',
    front: 'I’m leaving (going away)',
    back: 'Me voy',
    rule: 'irse vs ir',
    tip: 'ir = to go (somewhere) · irse = to leave / go away. Me voy a casa can mean “I’m heading home.”',
  },
  {
    section: 'reflexives',
    front: 'We see each other tomorrow',
    back: 'Nos vemos mañana',
    rule: 'Reciprocal',
    tip: 'Plural reflexives can mean “each other.” Se escriben = they write to each other.',
  },
  {
    section: 'reflexives',
    front: 'I’m going to take a shower',
    back: 'Voy a ducharme / Me voy a duchar',
    rule: 'Placement',
    tip: 'Attach to infinitive or put before the conjugated verb — both fine.',
  },
  {
    section: 'reflexives',
    front: 'He falls asleep quickly',
    back: 'Se duerme rápido',
    rule: 'Meaning shift',
    tip: 'dormir = to sleep · dormirse = to fall asleep. Similar: despertar vs despertarse.',
  },
  {
    section: 'reflexives',
    front: 'Sit down, please (usted)',
    back: 'Siéntese, por favor',
    rule: 'Commands',
    tip: 'Affirmative command + se attached (accent often added). Negative: No se siente.',
  },
  {
    section: 'reflexives',
    front: 'I wash my hands',
    back: 'Me lavo las manos',
    rule: 'Body parts',
    tip: 'Spanish prefers the article, not “my”: Me lavo las manos (not mis manos) when the owner is clear.',
  },

  // ——— Negation ———
  {
    section: 'negation',
    front: 'I don’t speak French',
    back: 'No hablo francés',
    rule: 'Basic no',
    tip: 'no goes right before the conjugated verb (or before object pronouns: No lo veo).',
  },
  {
    section: 'negation',
    front: 'I don’t see anyone',
    back: 'No veo a nadie',
    rule: 'Double negative',
    tip: 'no… nadie is correct and required. Nadie without no at the start: Nadie vino.',
  },
  {
    section: 'negation',
    front: 'I never eat meat',
    back: 'Nunca como carne / No como carne nunca',
    rule: 'nunca',
    tip: 'Nunca can start the sentence alone, or follow with no… nunca.',
  },
  {
    section: 'negation',
    front: 'There is nothing here',
    back: 'No hay nada aquí',
    rule: 'nada',
    tip: 'no… nada. Nada starting: Nada es imposible. Avoid English-style single negation after no.',
  },
  {
    section: 'negation',
    front: 'I don’t want any book',
    back: 'No quiero ningún libro',
    rule: 'ningún / ninguna',
    tip: 'ningún before masculine singular nouns; ninguna before feminine. Plural: ningunos is rare — usually ninguno/ninguna.',
  },
  {
    section: 'negation',
    front: 'Me neither / Neither do I',
    back: 'Yo tampoco',
    rule: 'tampoco',
    tip: 'tampoco = neither / either (negative). Positive “me too” is también.',
  },
  {
    section: 'negation',
    front: 'Nobody knows',
    back: 'Nadie sabe',
    rule: 'nadie as subject',
    tip: 'When nadie/nada starts the sentence, you don’t add no before the verb.',
  },
  {
    section: 'negation',
    front: 'I don’t have either / I don’t have one either',
    back: 'No tengo ninguno / No tengo tampoco',
    rule: 'Agreement',
    tip: 'ninguno agrees when replacing a noun. tampoco denies addition: Tampoco tengo tiempo.',
  },

  // ——— Comparisons ———
  {
    section: 'comparisons',
    front: 'taller than',
    back: 'más alto/a que',
    rule: 'más / menos',
    tip: 'más + adj + que. menos bajo que = less short than. Agree alto/alta with the person.',
  },
  {
    section: 'comparisons',
    front: 'as interesting as',
    back: 'tan interesante como',
    rule: 'Equality',
    tip: 'tan + adjective/adverb + como. For nouns: tanto/a/os/as + noun + como.',
  },
  {
    section: 'comparisons',
    front: 'as many books as',
    back: 'tantos libros como',
    rule: 'tanto + noun',
    tip: 'tanto agrees: tanta agua, tantos libros, tantas ideas.',
  },
  {
    section: 'comparisons',
    front: 'better / worse',
    back: 'mejor / peor',
    rule: 'Irregulars',
    tip: 'Use mejor/peor instead of más bueno/más malo in most comparisons of quality.',
  },
  {
    section: 'comparisons',
    front: 'older / younger (people)',
    back: 'mayor / menor',
    rule: 'Irregulars',
    tip: 'mayor/menor for age. más viejo can sound blunt for people; más grande is size.',
  },
  {
    section: 'comparisons',
    front: 'the most interesting book',
    back: 'el libro más interesante',
    rule: 'Superlative',
    tip: 'el/la/los/las + noun + más/menos + adj, or el más interesante de…',
  },
  {
    section: 'comparisons',
    front: 'very easy (absolute superlative)',
    back: 'facilísimo / muy fácil',
    rule: '-ísimo',
    tip: '-ísimo intensifies: buenísimo, rapidísimo. Spelling changes: rico → riquísimo.',
  },
  {
    section: 'comparisons',
    front: 'more than 10 (numbers)',
    back: 'más de 10',
    rule: 'más de',
    tip: 'Before numbers use más de / menos de, not más que. más que before clauses/nouns.',
  },

  // ——— Demonstratives ———
  {
    section: 'demonstratives',
    front: 'this book / these books',
    back: 'este libro / estos libros',
    rule: 'este',
    tip: 'Near the speaker. Feminine: esta / estas.',
  },
  {
    section: 'demonstratives',
    front: 'that book (near you) / those',
    back: 'ese libro / esos libros',
    rule: 'ese',
    tip: 'Near the listener or medium distance. esa / esas feminine.',
  },
  {
    section: 'demonstratives',
    front: 'that book over there',
    back: 'aquel libro',
    rule: 'aquel',
    tip: 'Far from both. aquella / aquellos / aquellas. Common in writing and some regions.',
  },
  {
    section: 'demonstratives',
    front: 'this / that (idea, neuter)',
    back: 'esto / eso',
    rule: 'Neuter',
    tip: 'esto/eso/aquello never change for gender — they point to situations or unnamed things: ¿Qué es eso?',
  },
  {
    section: 'demonstratives',
    front: 'here / there / over there',
    back: 'aquí / ahí / allí',
    rule: 'Place adverbs',
    tip: 'Pair with este/ese/aquel. Some speakers use acá/allá (especially Latin America).',
  },
  {
    section: 'demonstratives',
    front: 'I want this one (feminine)',
    back: 'Quiero esta',
    rule: 'Pronoun use',
    tip: 'Demonstratives can stand alone when the noun is clear. Modern Spanish drops written accents on these pronouns.',
  },
  {
    section: 'demonstratives',
    front: 'Those days (far / past nuance)',
    back: 'aquellos días',
    rule: 'aquel',
    tip: 'aquel often colors remoteness in time: en aquellos tiempos = in those days.',
  },
  {
    section: 'demonstratives',
    front: 'What is that?',
    back: '¿Qué es eso?',
    rule: 'eso',
    tip: 'Neuter eso for an unknown object or situation. ¿Qué es esto? if it’s near you.',
  },

  // ——— Possessives ———
  {
    section: 'possessives',
    front: 'my house / my houses',
    back: 'mi casa / mis casas',
    rule: 'Short forms',
    tip: 'mi/mis agree with the noun owned, not with “I.” No gender change for mi/tu/su.',
  },
  {
    section: 'possessives',
    front: 'our book / our house',
    back: 'nuestro libro / nuestra casa',
    rule: 'nuestro',
    tip: 'nuestro/vuestro change for gender and number: nuestros, nuestras.',
  },
  {
    section: 'possessives',
    front: 'his / her / your (usted) / their book',
    back: 'su libro',
    rule: 'su ambiguity',
    tip: 'Clarify: el libro de él / de ella / de usted / de ellos. sus libros for plural nouns.',
  },
  {
    section: 'possessives',
    front: 'The book is mine',
    back: 'El libro es mío',
    rule: 'Long forms',
    tip: 'mío/tuyo/suyo… after ser or after a noun: un amigo mío = a friend of mine.',
  },
  {
    section: 'possessives',
    front: 'mine (the masculine one)',
    back: 'el mío',
    rule: 'el mío',
    tip: 'Article + long form replaces a noun: ¿Tu coche? El mío es azul.',
  },
  {
    section: 'possessives',
    front: 'your (tú) names',
    back: 'tus nombres',
    rule: 'tu / tus',
    tip: 'tu without accent = possessive · tú with accent = subject pronoun “you.”',
  },
  {
    section: 'possessives',
    front: 'a friend of hers',
    back: 'una amiga suya',
    rule: 'Long forms',
    tip: 'After indefinite nouns, long possessives are natural: un compañero suyo.',
  },
  {
    section: 'possessives',
    front: 'Whose is this?',
    back: '¿De quién es esto?',
    rule: 'de quién',
    tip: 'Possession questions use de quién, not a possessive adjective.',
  },

  // ——— Preterite vs imperfect ———
  {
    section: 'pret-imp',
    front: 'Yesterday I ate tapas (completed)',
    back: 'Ayer comí tapas',
    rule: 'Preterite',
    tip: 'Single completed action → preterite. Time markers: ayer, anoche, el año pasado.',
  },
  {
    section: 'pret-imp',
    front: 'I used to eat tapas every Friday',
    back: 'Comía tapas todos los viernes',
    rule: 'Imperfect',
    tip: 'Habit or repeated past → imperfect. todos los… is a classic imperfect cue.',
  },
  {
    section: 'pret-imp',
    front: 'It was raining when I left',
    back: 'Llovía cuando salí',
    rule: 'Background + event',
    tip: 'Imperfect = ongoing background · preterite = interrupting/completed event.',
  },
  {
    section: 'pret-imp',
    front: 'I was 10 years old',
    back: 'Tenía 10 años',
    rule: 'Age / clock / weather',
    tip: 'Age, clock time, and weather descriptions in the past usually take imperfect.',
  },
  {
    section: 'pret-imp',
    front: 'It was 2:00',
    back: 'Eran las dos',
    rule: 'Clock',
    tip: 'Past clock time: era la una / eran las… Preterite would sound like “became 2:00” in a story beat.',
  },
  {
    section: 'pret-imp',
    front: 'She started to speak',
    back: 'Empezó a hablar',
    rule: 'Preterite',
    tip: 'Beginnings and endings (empezar, terminar, llegar) often preterite when they mark plot points.',
  },
  {
    section: 'pret-imp',
    front: 'The house was big and white',
    back: 'La casa era grande y blanca',
    rule: 'Description',
    tip: 'Setting the scene — appearance, personality, ongoing states — imperfect.',
  },
  {
    section: 'pret-imp',
    front: 'I wanted to help, so I called',
    back: 'Quería ayudar, así que llamé',
    rule: 'Mental state + action',
    tip: 'Ongoing desire/feeling (quería) often imperfect; the action taken (llamé) preterite.',
  },

  // ——— Commands ———
  {
    section: 'commands',
    front: 'Speak! (tú, affirmative)',
    back: '¡Habla!',
    rule: 'Tú affirmative',
    tip: 'Most -ar verbs: take present él/ella form. Irregulars: haz, ve, ten, ven, sal, sé, di, pon.',
  },
  {
    section: 'commands',
    front: 'Don’t speak! (tú)',
    back: '¡No hables!',
    rule: 'Tú negative',
    tip: 'Negative tú uses present subjunctive: no hables, no comas, no vivas.',
  },
  {
    section: 'commands',
    front: 'Come! (tú irregular)',
    back: '¡Ven!',
    rule: 'Irregular tú',
    tip: 'Memorize: ven, ten, pon, haz, sal, sé, di, ve (ir). Negative: no vengas.',
  },
  {
    section: 'commands',
    front: 'Speak, please (usted)',
    back: 'Hable, por favor',
    rule: 'Usted',
    tip: 'Usted commands = present subjunctive for yes and no: Hable / No hable.',
  },
  {
    section: 'commands',
    front: 'Tell me the truth (tú)',
    back: 'Dime la verdad',
    rule: 'Pronouns',
    tip: 'Attach pronouns to affirmative commands. Accent: dígamelo (usted). Negative: No me digas.',
  },
  {
    section: 'commands',
    front: 'Let’s go / Let’s eat',
    back: 'Vamos / Comamos',
    rule: 'Nosotros',
    tip: 'vamos can mean “let’s go.” Other verbs: present subjunctive — comamos, hablemos. Negative: no comamos.',
  },
  {
    section: 'commands',
    front: 'Sit down (tú)',
    back: 'Siéntate',
    rule: 'Reflexive command',
    tip: 'Affirmative: stem + te attached (accent). Negative: No te sientes.',
  },
  {
    section: 'commands',
    front: 'Please open the window (ustedes)',
    back: 'Abran la ventana, por favor',
    rule: 'Ustedes',
    tip: 'Latin America uses ustedes for plural you. Form = present subjunctive plural.',
  },
]

export const grammarCards: GrammarCard[] = RAW.map((card, i) => ({
  ...card,
  id: i + 1,
}))

export function filterGrammar(
  cards: GrammarCard[],
  section: GrammarSection | 'all',
): GrammarCard[] {
  if (section === 'all') return cards
  return cards.filter((c) => c.section === section)
}
