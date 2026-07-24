export type FoundationSection =
  | 'days'
  | 'months'
  | 'seasons'
  | 'questions'
  | 'articles'
  | 'ser-estar'
  | 'family'
  | 'body'
  | 'clothing'
  | 'places'

export type FoundationCard = {
  id: number
  front: string // English
  back: string // Spanish
  tip: string
  section: FoundationSection
  speak?: string // optional override for TTS if back has alternatives
}

export const FOUNDATION_SECTIONS: {
  id: FoundationSection | 'all'
  label: string
}[] = [
  { id: 'all', label: 'All' },
  { id: 'days', label: 'Days' },
  { id: 'months', label: 'Months' },
  { id: 'seasons', label: 'Seasons' },
  { id: 'questions', label: 'Question words' },
  { id: 'articles', label: 'Articles' },
  { id: 'ser-estar', label: 'Ser vs estar' },
  { id: 'family', label: 'Family' },
  { id: 'body', label: 'Body' },
  { id: 'clothing', label: 'Clothing' },
  { id: 'places', label: 'Places' },
]

const RAW: {
  front: string
  back: string
  tip: string
  section: FoundationSection
  speak?: string
}[] = [
  // ——— Days ———
  {
    front: 'Monday',
    back: 'lunes',
    section: 'days',
    tip: 'Days are lowercase in Spanish. “On Monday” = el lunes (use the article).',
  },
  {
    front: 'Tuesday',
    back: 'martes',
    section: 'days',
    tip: 'Same form singular and plural: el martes / los martes (on Tuesdays).',
  },
  {
    front: 'Wednesday',
    back: 'miércoles',
    section: 'days',
    tip: 'Accent on é. “On Wednesday” = el miércoles.',
  },
  {
    front: 'Thursday',
    back: 'jueves',
    section: 'days',
    tip: 'Like martes, singular = plural form. el jueves / los jueves.',
  },
  {
    front: 'Friday',
    back: 'viernes',
    section: 'days',
    tip: 'Same singular/plural form. Weekend starts after el viernes for many speakers.',
  },
  {
    front: 'Saturday',
    back: 'sábado',
    section: 'days',
    tip: 'Accent on á. Plural: los sábados. “On Saturday” = el sábado.',
  },
  {
    front: 'Sunday',
    back: 'domingo',
    section: 'days',
    tip: 'Plural: los domingos. First day of the week on many Spanish calendars.',
  },
  {
    front: 'On Monday',
    back: 'el lunes',
    section: 'days',
    tip: 'English “on” → Spanish definite article with days: el + day (not en lunes).',
  },
  {
    front: 'On weekends / On Saturdays',
    back: 'los sábados / los fines de semana',
    section: 'days',
    tip: 'Plural article + day = habitual: los lunes = on Mondays.',
    speak: 'los sábados',
  },

  // ——— Months ———
  {
    front: 'January',
    back: 'enero',
    section: 'months',
    tip: 'Months are lowercase. “In January” = en enero (no article usually).',
  },
  {
    front: 'February',
    back: 'febrero',
    section: 'months',
    tip: 'Lowercase. Date pattern: el 14 de febrero.',
  },
  {
    front: 'March',
    back: 'marzo',
    section: 'months',
    tip: 'Lowercase. en marzo = in March.',
  },
  {
    front: 'April',
    back: 'abril',
    section: 'months',
    tip: 'Lowercase. Stress on -bril.',
  },
  {
    front: 'May',
    back: 'mayo',
    section: 'months',
    tip: 'Lowercase. Don’t confuse with the name Mayo.',
  },
  {
    front: 'June',
    back: 'junio',
    section: 'months',
    tip: 'Lowercase. Often start of summer holidays in the Northern Hemisphere.',
  },
  {
    front: 'July',
    back: 'julio',
    section: 'months',
    tip: 'Lowercase. Spelling: julio (not “julyo”).',
  },
  {
    front: 'August',
    back: 'agosto',
    section: 'months',
    tip: 'Lowercase. Silent g sound cluster — a-gos-to.',
  },
  {
    front: 'September',
    back: 'septiembre',
    section: 'months',
    tip: 'Lowercase. Often pronounced “setiembre” in speech; both spellings exist regionally.',
  },
  {
    front: 'October',
    back: 'octubre',
    section: 'months',
    tip: 'Lowercase. Stress: oc-TU-bre.',
  },
  {
    front: 'November',
    back: 'noviembre',
    section: 'months',
    tip: 'Lowercase. Same -iembre ending family as septiembre.',
  },
  {
    front: 'December',
    back: 'diciembre',
    section: 'months',
    tip: 'Lowercase. Dates: el 25 de diciembre.',
  },

  // ——— Seasons ———
  {
    front: 'Spring',
    back: 'la primavera',
    section: 'seasons',
    tip: 'Feminine. “In spring” = en primavera / en la primavera.',
  },
  {
    front: 'Summer',
    back: 'el verano',
    section: 'seasons',
    tip: 'Masculine. en verano = in summer. Seasons reverse in the Southern Hemisphere.',
  },
  {
    front: 'Fall / Autumn',
    back: 'el otoño',
    section: 'seasons',
    tip: 'Masculine. ñ sound (ny). en otoño = in autumn.',
  },
  {
    front: 'Winter',
    back: 'el invierno',
    section: 'seasons',
    tip: 'Masculine. en invierno = in winter. v sounds like b in Spanish.',
  },

  // ——— Question words ———
  {
    front: 'What?',
    back: '¿qué?',
    section: 'questions',
    tip: 'Accent marks question words. qué = what/which (definition); no accent: que = that/which (relative).',
  },
  {
    front: 'Who? (singular)',
    back: '¿quién?',
    section: 'questions',
    tip: 'Singular who. With personal a when object: ¿A quién llamaste?',
  },
  {
    front: 'Who? (plural)',
    back: '¿quiénes?',
    section: 'questions',
    tip: 'Use quiénes when you expect more than one person: ¿Quiénes vienen?',
  },
  {
    front: 'Where?',
    back: '¿dónde?',
    section: 'questions',
    tip: 'dónde = where (location). de dónde = from where; a dónde / adónde = to where.',
  },
  {
    front: 'When?',
    back: '¿cuándo?',
    section: 'questions',
    tip: 'Accent distinguishes from cuando (“when” as conjunction): ¿Cuándo sales? vs cuando salgas…',
  },
  {
    front: 'Why?',
    back: '¿por qué?',
    section: 'questions',
    tip: 'Two words + accent on qué. Because = porque (one word, no accent).',
  },
  {
    front: 'How?',
    back: '¿cómo?',
    section: 'questions',
    tip: 'cómo = how. Also in ¿Cómo te llamas? (what’s your name). No accent: como = like/as/I eat.',
  },
  {
    front: 'Which? (singular)',
    back: '¿cuál?',
    section: 'questions',
    tip: 'cuál picks from a set. Before a noun, Spanish often prefers qué: ¿Qué libro? vs ¿Cuál es tu libro?',
  },
  {
    front: 'Which? (plural)',
    back: '¿cuáles?',
    section: 'questions',
    tip: 'Plural of cuál: ¿Cuáles son tus favoritos?',
  },
  {
    front: 'How much? (masculine singular)',
    back: '¿cuánto?',
    section: 'questions',
    tip: 'Agrees with the noun: ¿Cuánto cuesta? / ¿Cuánto dinero?',
  },
  {
    front: 'How much? (feminine singular)',
    back: '¿cuánta?',
    section: 'questions',
    tip: 'With feminine nouns: ¿Cuánta agua? ¿Cuánta harina?',
  },
  {
    front: 'How many? (masculine plural)',
    back: '¿cuántos?',
    section: 'questions',
    tip: 'Plural masculine: ¿Cuántos hermanos tienes?',
  },
  {
    front: 'How many? (feminine plural)',
    back: '¿cuántas?',
    section: 'questions',
    tip: 'Plural feminine: ¿Cuántas personas hay?',
  },

  // ——— Articles ———
  {
    front: 'the (masculine singular)',
    back: 'el',
    section: 'articles',
    tip: 'Definite article with masculine singular nouns: el libro, el día. a + el → al; de + el → del.',
  },
  {
    front: 'the (feminine singular)',
    back: 'la',
    section: 'articles',
    tip: 'With feminine singular: la casa, la noche. Exception: el agua (feminine noun, uses el for sound).',
  },
  {
    front: 'the (masculine plural)',
    back: 'los',
    section: 'articles',
    tip: 'Masculine plural: los libros. Also used for mixed-gender groups: los padres.',
  },
  {
    front: 'the (feminine plural)',
    back: 'las',
    section: 'articles',
    tip: 'Feminine plural: las casas, las noches.',
  },
  {
    front: 'a / an (masculine)',
    back: 'un',
    section: 'articles',
    tip: 'Indefinite masculine singular: un perro, un problema (even though problema ends in -a, it’s masculine).',
  },
  {
    front: 'a / an (feminine)',
    back: 'una',
    section: 'articles',
    tip: 'Indefinite feminine singular: una mesa, una idea.',
  },
  {
    front: 'some (masculine plural)',
    back: 'unos',
    section: 'articles',
    tip: 'unos = some / a few (masculine): unos amigos. Also softens numbers: unos diez minutos.',
  },
  {
    front: 'some (feminine plural)',
    back: 'unas',
    section: 'articles',
    tip: 'unas = some / a few (feminine): unas manzanas.',
  },
  {
    front: 'Gender tip: el vs la',
    back: 'el (m) / la (f)',
    section: 'articles',
    tip: 'Noun gender is mostly arbitrary — memorize with the article: el problema, la mano. -o often m, -a often f (many exceptions).',
    speak: 'el, la',
  },

  // ——— Ser vs estar ———
  {
    front: 'I am (identity / permanent) — ser',
    back: 'Soy',
    section: 'ser-estar',
    tip: 'ser for who/what you are: Soy profesor. Soy de México. Not for location.',
  },
  {
    front: 'I am (location / temporary state) — estar',
    back: 'Estoy',
    section: 'ser-estar',
    tip: 'estar for location and changing states: Estoy en casa. Estoy cansado.',
  },
  {
    front: 'She is a doctor (profession)',
    back: 'Ella es médica / doctora',
    section: 'ser-estar',
    tip: 'Professions use ser (often without un/una in Spanish): Es médica.',
    speak: 'Ella es médica',
  },
  {
    front: 'She is tired (feeling)',
    back: 'Ella está cansada',
    section: 'ser-estar',
    tip: 'Temporary condition → estar. Contrast: es cansada would sound like “she’s a tiring person.”',
  },
  {
    front: 'The party is on Saturday (event time)',
    back: 'La fiesta es el sábado',
    section: 'ser-estar',
    tip: 'ser for where/when an event takes place: La reunión es a las tres.',
  },
  {
    front: 'The party is at my house (event place)',
    back: 'La fiesta es en mi casa',
    section: 'ser-estar',
    tip: 'Events use ser + en for venue. People/things’ location uses estar: Estoy en mi casa.',
  },
  {
    front: 'Madrid is in Spain (fact)',
    back: 'Madrid está en España',
    section: 'ser-estar',
    tip: 'Geographic location of places uses estar: Madrid está en España.',
  },
  {
    front: 'The soup is delicious (taste right now)',
    back: 'La sopa está deliciosa',
    section: 'ser-estar',
    tip: 'estar for how food tastes/looks now. ser deliciosa = it is (generally) a delicious soup.',
  },
  {
    front: 'He is tall (characteristic)',
    back: 'Él es alto',
    section: 'ser-estar',
    tip: 'Inherent description → ser. Temporary posture/height joke uses estar alto rarely.',
  },
  {
    front: 'He is sick (today)',
    back: 'Él está enfermo',
    section: 'ser-estar',
    tip: 'Illness as a state → estar. Chronic identity framing can use ser in some contexts, but learners use estar.',
  },
  {
    front: 'The door is open (state)',
    back: 'La puerta está abierta',
    section: 'ser-estar',
    tip: 'Resulting state from an action → estar + participle: abierta, cerrada, rota.',
  },
  {
    front: 'The book is Maria’s (possession)',
    back: 'El libro es de María',
    section: 'ser-estar',
    tip: 'ser de = belong to / be made of: Es de madera (it’s wooden).',
  },
  {
    front: 'I am from Colombia (origin)',
    back: 'Soy de Colombia',
    section: 'ser-estar',
    tip: 'Origin always ser de. Living there now: Vivo en Colombia (different verb).',
  },
  {
    front: 'We are ready',
    back: 'Estamos listos / listas',
    section: 'ser-estar',
    tip: 'Ready = temporary state → estar. Agree gender with the speakers.',
    speak: 'Estamos listos',
  },
  {
    front: 'What time is it? (ser)',
    back: '¿Qué hora es?',
    section: 'ser-estar',
    tip: 'Clock time uses ser: Es la una / Son las dos — never estar for telling time.',
  },
  {
    front: 'How are you? (estar)',
    back: '¿Cómo estás?',
    section: 'ser-estar',
    tip: 'Ask about someone’s state with estar. ¿Cómo eres? asks about personality.',
  },

  // ——— Family ———
  {
    front: 'Mother',
    back: 'la madre / mamá',
    section: 'family',
    tip: 'madre is neutral/formal; mamá is affectionate. Possessive: mi mamá.',
    speak: 'la madre',
  },
  {
    front: 'Father',
    back: 'el padre / papá',
    section: 'family',
    tip: 'padre / papá. Accent on papá — papa without accent = potato.',
    speak: 'el padre',
  },
  {
    front: 'Parents',
    back: 'los padres',
    section: 'family',
    tip: 'los padres = parents (or fathers). Both parents: mis padres.',
  },
  {
    front: 'Brother',
    back: 'el hermano',
    section: 'family',
    tip: 'hermano = brother. Older/younger: hermano mayor / menor.',
  },
  {
    front: 'Sister',
    back: 'la hermana',
    section: 'family',
    tip: 'hermana = sister. Plural mixed siblings often: mis hermanos.',
  },
  {
    front: 'Sibling(s)',
    back: 'el hermano / la hermana / los hermanos',
    section: 'family',
    tip: 'No single gender-neutral everyday word like English “sibling”; hermanos covers mixed groups.',
    speak: 'los hermanos',
  },
  {
    front: 'Grandfather',
    back: 'el abuelo',
    section: 'family',
    tip: 'abuelo. Affectionate: abuelito.',
  },
  {
    front: 'Grandmother',
    back: 'la abuela',
    section: 'family',
    tip: 'abuela / abuelita. Plural: los abuelos = grandparents.',
  },
  {
    front: 'Grandparents',
    back: 'los abuelos',
    section: 'family',
    tip: 'Masculine plural can include both grandma and grandpa.',
  },
  {
    front: 'Son',
    back: 'el hijo',
    section: 'family',
    tip: 'hijo = son. Also used in interjections: ¡Hijo! (hey/man) in some regions.',
  },
  {
    front: 'Daughter',
    back: 'la hija',
    section: 'family',
    tip: 'hija = daughter. Silent h. Plural kids: los hijos (can mean sons or children).',
  },
  {
    front: 'Husband',
    back: 'el esposo / el marido',
    section: 'family',
    tip: 'esposo and marido both common; preference varies by region.',
    speak: 'el esposo',
  },
  {
    front: 'Wife',
    back: 'la esposa / la mujer',
    section: 'family',
    tip: 'esposa is clear. mi mujer is common but literally “my woman” — know your audience.',
    speak: 'la esposa',
  },
  {
    front: 'Friend',
    back: 'el amigo / la amiga',
    section: 'family',
    tip: 'Gender of the friend: amigo/amiga. Best friend: mejor amigo/a.',
    speak: 'el amigo',
  },
  {
    front: 'Boyfriend',
    back: 'el novio',
    section: 'family',
    tip: 'novio = boyfriend or groom (context). Dating: mi novio.',
  },
  {
    front: 'Girlfriend',
    back: 'la novia',
    section: 'family',
    tip: 'novia = girlfriend or bride. Same dual meaning as novio.',
  },

  // ——— Body ———
  {
    front: 'Head',
    back: 'la cabeza',
    section: 'body',
    tip: 'Feminine. Pain: me duele la cabeza (article, not mi, with doler).',
  },
  {
    front: 'Eyes',
    back: 'los ojos',
    section: 'body',
    tip: 'ojo singular, ojos plural. Eye color: tengo los ojos cafés / azules.',
  },
  {
    front: 'Ears',
    back: 'las orejas / los oídos',
    section: 'body',
    tip: 'oreja = outer ear; oído = inner ear/hearing. “I can’t hear”: no oigo.',
    speak: 'las orejas',
  },
  {
    front: 'Mouth',
    back: 'la boca',
    section: 'body',
    tip: 'Feminine. Open your mouth (doctor): Abra la boca.',
  },
  {
    front: 'Hand',
    back: 'la mano',
    section: 'body',
    tip: 'Ends in -o but is feminine: la mano, las manos — classic gender exception.',
  },
  {
    front: 'Foot',
    back: 'el pie',
    section: 'body',
    tip: 'Plural: los pies. Pain: me duelen los pies.',
  },
  {
    front: 'Stomach',
    back: 'el estómago / la barriga',
    section: 'body',
    tip: 'estómago is anatomical; barriga/panza more colloquial for belly.',
    speak: 'el estómago',
  },
  {
    front: 'Back',
    back: 'la espalda',
    section: 'body',
    tip: 'espalda = back (body). Behind (location) is detrás / atrás — different words.',
  },
  {
    front: 'Arm',
    back: 'el brazo',
    section: 'body',
    tip: 'brazo. Forearm: el antebrazo. Hug: un abrazo.',
  },
  {
    front: 'Leg',
    back: 'la pierna',
    section: 'body',
    tip: 'pierna = leg. Don’t confuse with la peña or el pie (foot).',
  },

  // ——— Clothing ———
  {
    front: 'Shirt',
    back: 'la camisa / la camiseta',
    section: 'clothing',
    tip: 'camisa = button shirt; camiseta = T-shirt. Fit: me queda bien.',
    speak: 'la camisa',
  },
  {
    front: 'Pants',
    back: 'los pantalones',
    section: 'clothing',
    tip: 'Usually plural in Spanish (like scissors). A pair: unos pantalones.',
  },
  {
    front: 'Dress',
    back: 'el vestido',
    section: 'clothing',
    tip: 'Masculine noun despite being a “dress.” Soft d sounds between vowels.',
  },
  {
    front: 'Shoes',
    back: 'los zapatos',
    section: 'clothing',
    tip: 'zapato singular. Sneakers: los tenis / las zapatillas (region varies).',
  },
  {
    front: 'Jacket',
    back: 'la chaqueta / la chamarra',
    section: 'clothing',
    tip: 'chaqueta widely understood; chamarra common in Mexico; abrigo = coat.',
    speak: 'la chaqueta',
  },
  {
    front: 'Hat',
    back: 'el sombrero / el gorro',
    section: 'clothing',
    tip: 'sombrero = brimmed hat; gorro = beanie/cap without wide brim; gorra = baseball cap.',
    speak: 'el sombrero',
  },
  {
    front: 'Socks',
    back: 'los calcetines / las medias',
    section: 'clothing',
    tip: 'calcetines common for socks; medias can mean socks or stockings by region.',
    speak: 'los calcetines',
  },

  // ——— Places ———
  {
    front: 'School',
    back: 'la escuela / el colegio',
    section: 'places',
    tip: 'escuela general; colegio often K–12. University: la universidad.',
    speak: 'la escuela',
  },
  {
    front: 'Work / Workplace',
    back: 'el trabajo',
    section: 'places',
    tip: 'el trabajo = work or job. “At work”: en el trabajo. Verb: trabajar.',
  },
  {
    front: 'House / Home',
    back: 'la casa',
    section: 'places',
    tip: 'en casa = at home (no article). a casa = (to) home.',
  },
  {
    front: 'Hospital',
    back: 'el hospital',
    section: 'places',
    tip: 'Masculine. Silent h. “To the hospital”: al hospital.',
  },
  {
    front: 'Bank',
    back: 'el banco',
    section: 'places',
    tip: 'banco = bank (also bench). Context clarifies: voy al banco a sacar dinero.',
  },
  {
    front: 'Pharmacy',
    back: 'la farmacia',
    section: 'places',
    tip: 'Feminine. Look for the green cross sign in many countries.',
  },
  {
    front: 'Supermarket',
    back: 'el supermercado',
    section: 'places',
    tip: 'Often shortened to el súper in speech.',
  },
  {
    front: 'Park',
    back: 'el parque',
    section: 'places',
    tip: 'Masculine. Playground area sometimes: el parque infantil.',
  },
  {
    front: 'Beach',
    back: 'la playa',
    section: 'places',
    tip: 'Feminine. “At the beach”: en la playa.',
  },
  {
    front: 'Church',
    back: 'la iglesia',
    section: 'places',
    tip: 'Feminine. Soft g before e (like h in some accents / soft in others): i-GLE-sia.',
  },
]

export const foundationCards: FoundationCard[] = RAW.map((item, i) => ({
  id: i + 1,
  front: item.front,
  back: item.back,
  tip: item.tip,
  section: item.section,
  ...(item.speak ? { speak: item.speak } : {}),
}))

export function filterFoundations(
  cards: FoundationCard[],
  section: FoundationSection | 'all',
): FoundationCard[] {
  if (section === 'all') return cards
  return cards.filter((c) => c.section === section)
}
