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
  | 'routines'
  | 'frequency'
  | 'commands'

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
  { id: 'routines', label: 'Daily routines' },
  { id: 'frequency', label: 'Every day & how often' },
  { id: 'commands', label: 'Commands' },
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

  // ——— Daily routines (often reflexive) ———
  {
    front: 'I wake up',
    back: 'Me despierto',
    section: 'routines',
    tip: 'despertarse (e→ie). Reflexive: me/te/se… Spanish uses the article with body parts: Me lavo la cara.',
  },
  {
    front: 'I get up',
    back: 'Me levanto',
    section: 'routines',
    tip: 'levantarse. Different from despertarse (wake up) — you can wake up and still stay in bed.',
  },
  {
    front: 'I brush my teeth',
    back: 'Me cepillo los dientes',
    section: 'routines',
    tip: 'cepillarse. Use el/los with body parts, not mi/mis: los dientes (not mis dientes) when the owner is clear.',
  },
  {
    front: 'I brush my hair',
    back: 'Me cepillo el pelo / el cabello',
    section: 'routines',
    tip: 'Same cepillarse. pelo and cabello both work; pelo is very common in speech.',
    speak: 'Me cepillo el pelo',
  },
  {
    front: 'I comb my hair',
    back: 'Me peino',
    section: 'routines',
    tip: 'peinarse = to comb one’s hair. Me peino el pelo is also fine if you name the hair.',
  },
  {
    front: 'I wash my face',
    back: 'Me lavo la cara',
    section: 'routines',
    tip: 'lavarse + body part with the article: la cara, las manos, el pelo.',
  },
  {
    front: 'I wash my hands',
    back: 'Me lavo las manos',
    section: 'routines',
    tip: 'Plural body part → las manos. Before meals: Me lavo las manos antes de comer.',
  },
  {
    front: 'I take a shower',
    back: 'Me ducho',
    section: 'routines',
    tip: 'ducharse. Longer form: Me estoy duchando / Voy a ducharme.',
  },
  {
    front: 'I take a bath',
    back: 'Me baño',
    section: 'routines',
    tip: 'bañarse. In some regions bañarse also covers showering — context decides.',
  },
  {
    front: 'I get dressed',
    back: 'Me visto',
    section: 'routines',
    tip: 'vestirse (e→i). Opposite: me desvisto (I get undressed).',
  },
  {
    front: 'I put on makeup',
    back: 'Me maquillo',
    section: 'routines',
    tip: 'maquillarse. Also: Me pongo maquillaje.',
  },
  {
    front: 'I shave',
    back: 'Me afeito',
    section: 'routines',
    tip: 'afeitarse. For legs etc. you can say Me afeito las piernas.',
  },
  {
    front: 'I put on perfume / cologne',
    back: 'Me pongo perfume / colonia',
    section: 'routines',
    tip: 'ponerse + item. Perfume and colonia are both common.',
    speak: 'Me pongo perfume',
  },
  {
    front: 'I make the bed',
    back: 'Hago la cama',
    section: 'routines',
    tip: 'hacer la cama — not reflexive. Morning chore after levantarse.',
  },
  {
    front: 'I have breakfast',
    back: 'Desayuno',
    section: 'routines',
    tip: 'desayunar is a regular -ar verb. Also: Tomo el desayuno.',
  },
  {
    front: 'I go to work / school',
    back: 'Voy al trabajo / a la escuela',
    section: 'routines',
    tip: 'ir a + place. University: Voy a la universidad.',
    speak: 'Voy al trabajo',
  },
  {
    front: 'I come home',
    back: 'Vuelvo a casa / Llego a casa',
    section: 'routines',
    tip: 'volver (o→ue) and llegar both work. Ya llegué = I’m home (announcing arrival).',
    speak: 'Vuelvo a casa',
  },
  {
    front: 'I have dinner',
    back: 'Ceno',
    section: 'routines',
    tip: 'cenar. Lunch: como / almuerzo (almorzar is common in Latin America).',
  },
  {
    front: 'I watch TV',
    back: 'Veo la tele',
    section: 'routines',
    tip: 'ver la tele / la televisión. Evening wind-down phrase.',
  },
  {
    front: 'I brush my teeth (at night)',
    back: 'Me cepillo los dientes (por la noche)',
    section: 'routines',
    tip: 'Same morning phrase — add por la mañana / por la noche for time.',
    speak: 'Me cepillo los dientes',
  },
  {
    front: 'I put on pajamas',
    back: 'Me pongo el pijama',
    section: 'routines',
    tip: 'ponerse. Spelling: pijama (Spain) / piyama (some regions).',
  },
  {
    front: 'I go to bed',
    back: 'Me acuesto',
    section: 'routines',
    tip: 'acostarse (o→ue). Different from dormirse (to fall asleep): Me acuesto a las 11; me duermo rápido.',
  },
  {
    front: 'I fall asleep',
    back: 'Me duermo',
    section: 'routines',
    tip: 'dormirse. dormir = to sleep; dormirse = to fall asleep.',
  },
  {
    front: 'I turn off the light',
    back: 'Apago la luz',
    section: 'routines',
    tip: 'apagar. Opposite: enciendo la luz (encender, e→ie).',
  },

  // ——— Frequency: every day / how often ———
  {
    front: 'every day / everyday',
    back: 'todos los días / cada día',
    section: 'frequency',
    tip: 'todos los días is the most natural “every day.” cada día is fine too. Adjective “everyday” (ordinary) ≈ cotidiano / de cada día.',
    speak: 'todos los días',
  },
  {
    front: 'every morning',
    back: 'todas las mañanas / cada mañana',
    section: 'frequency',
    tip: 'Also: por las mañanas for habitual mornings. Me levanto todas las mañanas a las siete.',
    speak: 'todas las mañanas',
  },
  {
    front: 'every afternoon',
    back: 'todas las tardes / cada tarde',
    section: 'frequency',
    tip: 'tarde = afternoon/evening before night. Estudio español todas las tardes.',
    speak: 'todas las tardes',
  },
  {
    front: 'every evening / every night',
    back: 'todas las noches',
    section: 'frequency',
    tip: 'For after dark. Also: por las noches. Veo la tele todas las noches.',
  },
  {
    front: 'every week',
    back: 'todas las semanas / cada semana',
    section: 'frequency',
    tip: 'Both common. Voy al gimnasio todas las semanas.',
    speak: 'todas las semanas',
  },
  {
    front: 'every weekend',
    back: 'todos los fines de semana',
    section: 'frequency',
    tip: 'Casual: todos los findes. Visitamos a la familia todos los fines de semana.',
  },
  {
    front: 'every month',
    back: 'todos los meses / cada mes',
    section: 'frequency',
    tip: 'Pago el alquiler todos los meses. Also: una vez al mes = once a month.',
    speak: 'todos los meses',
  },
  {
    front: 'every year',
    back: 'todos los años / cada año',
    section: 'frequency',
    tip: 'Viajamos a México todos los años. On birthdays: cada año / todos los años.',
    speak: 'todos los años',
  },
  {
    front: 'every Monday',
    back: 'todos los lunes',
    section: 'frequency',
    tip: 'Pattern for any day: todos los + plural day. No work Mondays: No trabajo los lunes (article often drops after no + verb).',
  },
  {
    front: 'every Friday',
    back: 'todos los viernes',
    section: 'frequency',
    tip: 'Same pattern. Salimos todos los viernes por la noche.',
  },
  {
    front: 'every hour',
    back: 'cada hora / todas las horas',
    section: 'frequency',
    tip: 'cada hora is usual for schedules (buses, medicine). El tren sale cada hora.',
    speak: 'cada hora',
  },
  {
    front: 'every two weeks / biweekly',
    back: 'cada dos semanas / quincenalmente',
    section: 'frequency',
    tip: 'cada dos semanas is clear everywhere. quincena ≈ a fortnight / half-month in many places.',
    speak: 'cada dos semanas',
  },
  {
    front: 'always',
    back: 'siempre',
    section: 'frequency',
    tip: 'Place before the verb or after: Siempre estudio / Estudio siempre. With no: no… nunca (not no siempre for “never”).',
  },
  {
    front: 'never',
    back: 'nunca / jamás',
    section: 'frequency',
    tip: 'nunca is everyday; jamás is stronger. Double negative OK: No voy nunca.',
    speak: 'nunca',
  },
  {
    front: 'sometimes',
    back: 'a veces',
    section: 'frequency',
    tip: 'Fixed phrase. Also: de vez en cuando (every now and then).',
  },
  {
    front: 'often / frequently',
    back: 'a menudo / frecuentemente',
    section: 'frequency',
    tip: 'a menudo is very common in speech. Also: muchas veces.',
    speak: 'a menudo',
  },
  {
    front: 'usually / normally',
    back: 'normalmente / por lo general',
    section: 'frequency',
    tip: 'Both mean “usually.” Also: generalmente. Normalmente desayuno café.',
    speak: 'normalmente',
  },
  {
    front: 'once a day',
    back: 'una vez al día',
    section: 'frequency',
    tip: 'una vez + a + period. Twice: dos veces al día. Medicine labels love this pattern.',
  },
  {
    front: 'twice a week',
    back: 'dos veces a la semana',
    section: 'frequency',
    tip: 'Same pattern: tres veces al mes, una vez al año.',
  },
  {
    front: 'once a month',
    back: 'una vez al mes',
    section: 'frequency',
    tip: 'al mes / a la semana / al año — use al before masculine, a la before feminine.',
  },
  {
    front: 'every now and then',
    back: 'de vez en cuando',
    section: 'frequency',
    tip: 'Idiom for occasional habits. Voy al cine de vez en cuando.',
  },
  {
    front: 'from time to time',
    back: 'de vez en cuando / de cuando en cuando',
    section: 'frequency',
    tip: 'Same idea as “every now and then.” Both variants are correct.',
    speak: 'de vez en cuando',
  },
  {
    front: 'all day (long)',
    back: 'todo el día',
    section: 'frequency',
    tip: 'Not “every day.” Trabajo todo el día = I work all day. All morning: toda la mañana.',
  },
  {
    front: 'all week',
    back: 'toda la semana',
    section: 'frequency',
    tip: 'Estuve enfermo toda la semana. Contrast: todas las semanas = every week.',
  },

  // ——— Common everyday commands (tú) ———
  {
    front: 'Come here',
    back: 'Ven aquí / Ven acá',
    section: 'commands',
    tip: 'venir → ven (irregular). aquí (Spain-neutral) / acá (very common in LatAm). Softer: Ven, por favor.',
    speak: 'Ven aquí',
  },
  {
    front: 'Go there',
    back: 'Ve allí / Ve allá',
    section: 'commands',
    tip: 'ir → ve (irregular; not “vas”). allí / allá = over there. Don’t confuse with ver → ve (look!).',
    speak: 'Ve allí',
  },
  {
    front: 'Go away / Leave',
    back: 'Vete / Sal de aquí',
    section: 'commands',
    tip: 'irse → vete. Stronger: ¡Fuera! Soften with por favor when you can.',
    speak: 'Vete',
  },
  {
    front: 'Eat',
    back: 'Come',
    section: 'commands',
    tip: 'tú affirmative of comer. Eat this: Come esto. Don’t eat that: No comas eso.',
  },
  {
    front: 'Drink',
    back: 'Bebe',
    section: 'commands',
    tip: 'beber. Soft drinks/water: Bebe agua. Don’t drink: No bebas.',
  },
  {
    front: 'Sit down',
    back: 'Siéntate',
    section: 'commands',
    tip: 'sentarse → siéntate (accent). Formal: Siéntese. Negative: No te sientes.',
  },
  {
    front: 'Stand up',
    back: 'Levántate',
    section: 'commands',
    tip: 'levantarse. Same verb as “get up” in the morning.',
  },
  {
    front: 'Listen',
    back: 'Escucha',
    section: 'commands',
    tip: 'escuchar. Listen to me: Escúchame. Formal: Escuche.',
  },
  {
    front: 'Look / Look at this',
    back: 'Mira / Mira esto',
    section: 'commands',
    tip: 'mirar. Look! as “check this out”: ¡Mira! Don’t confuse with ve from ver (“see/look”).',
    speak: 'Mira esto',
  },
  {
    front: 'Look out / Watch out',
    back: '¡Cuidado! / Ten cuidado',
    section: 'commands',
    tip: '¡Cuidado! is the instant shout. tener → ten: Ten cuidado = be careful.',
    speak: 'Cuidado',
  },
  {
    front: 'Wait',
    back: 'Espera',
    section: 'commands',
    tip: 'Wait for me: Espérame. A moment: Espera un momento. Formal: Espere.',
  },
  {
    front: 'Stop',
    back: 'Para / Detente',
    section: 'commands',
    tip: 'parar → para (also means “for”—context!). detenerse → detente is clearer for “halt.”',
    speak: 'Para',
  },
  {
    front: 'Stop it / Cut it out',
    back: 'Basta / Ya párale',
    section: 'commands',
    tip: '¡Basta! = enough! LatAm casual: Ya párale / Ya párenle.',
    speak: 'Basta',
  },
  {
    front: 'Open the door / window',
    back: 'Abre la puerta / la ventana',
    section: 'commands',
    tip: 'abrir → abre. Formal: Abra… Negative: No abras…',
    speak: 'Abre la puerta',
  },
  {
    front: 'Close the door / window',
    back: 'Cierra la puerta / la ventana',
    section: 'commands',
    tip: 'cerrar (e→ie) → cierra. Formal: Cierre…',
    speak: 'Cierra la puerta',
  },
  {
    front: 'Give me…',
    back: 'Dame…',
    section: 'commands',
    tip: 'dar → da + me → dame. Dame eso / Dame la mano. Formal: Déme…',
  },
  {
    front: 'Bring me…',
    back: 'Tráeme…',
    section: 'commands',
    tip: 'traer + me with accent: tráeme. Tráeme un café, por favor.',
  },
  {
    front: 'Help me',
    back: 'Ayúdame',
    section: 'commands',
    tip: 'ayudar + me. Urgent shout: ¡Ayuda! Formal: Ayúdeme.',
  },
  {
    front: 'Tell me',
    back: 'Dime',
    section: 'commands',
    tip: 'decir → di + me. Dime la verdad. Negative: No me digas.',
  },
  {
    front: 'Call me',
    back: 'Llámame',
    section: 'commands',
    tip: 'llamar + me with accent. Llámame mañana. Formal: Llámame → Llámeme.',
  },
  {
    front: 'Write it / Write to me',
    back: 'Escríbelo / Escríbeme',
    section: 'commands',
    tip: 'escribir + lo/me. Accent on í when a pronoun attaches.',
    speak: 'Escríbeme',
  },
  {
    front: 'Do it / Make it',
    back: 'Hazlo',
    section: 'commands',
    tip: 'hacer → haz + lo. Don’t do it: No lo hagas.',
  },
  {
    front: 'Put it here',
    back: 'Ponlo aquí',
    section: 'commands',
    tip: 'poner → pon + lo. Put it there: Ponlo allí. Negative: No lo pongas aquí.',
  },
  {
    front: 'Take it / Take this',
    back: 'Tómalo / Toma',
    section: 'commands',
    tip: 'tomar. Handing something over: Toma. Also coge (Spain) / agarra (LatAm).',
    speak: 'Toma',
  },
  {
    front: 'Come in / Come through',
    back: 'Pasa / Adelante',
    section: 'commands',
    tip: 'Welcoming someone in. Also: Pasa, por favor. Formal: Pase / Adelante.',
    speak: 'Pasa',
  },
  {
    front: 'Hurry up',
    back: 'Date prisa / Apúrate',
    section: 'commands',
    tip: 'darse prisa → date prisa. LatAm: apurarse → apúrate.',
    speak: 'Date prisa',
  },
  {
    front: 'Slow down',
    back: 'Más despacio / Ve más despacio',
    section: 'commands',
    tip: 'Great for taxis and fast talkers. Also: Despacio, por favor.',
    speak: 'Más despacio',
  },
  {
    front: 'Speak slower / Speak louder',
    back: 'Habla más despacio / más alto',
    section: 'commands',
    tip: 'Learner survival phrase. Soften: ¿Puedes hablar más despacio, por favor?',
    speak: 'Habla más despacio',
  },
  {
    front: 'Repeat, please',
    back: 'Repite, por favor',
    section: 'commands',
    tip: 'repetir (e→i) → repite. Formal: Repita, por favor. Also: ¿Cómo?',
  },
  {
    front: 'Don’t worry',
    back: 'No te preocupes',
    section: 'commands',
    tip: 'Negative tú = no + subjunctive. Formal: No se preocupe.',
  },
  {
    front: 'Don’t touch that',
    back: 'No toques eso',
    section: 'commands',
    tip: 'Negative command pattern. Kids/home: ¡No toques!',
  },
  {
    front: 'Don’t go',
    back: 'No te vayas / No vayas',
    section: 'commands',
    tip: 'no te vayas = don’t leave (irse). no vayas = don’t go (to a place).',
    speak: 'No te vayas',
  },
  {
    front: 'Let’s go',
    back: 'Vamos / Vámonos',
    section: 'commands',
    tip: 'vamos = let’s go / we’re going. vámonos = let’s get out of here (irse).',
    speak: 'Vamos',
  },
  {
    front: 'Follow me',
    back: 'Sígueme',
    section: 'commands',
    tip: 'seguir (e→i) + me. Directions: Sígueme, por favor. Formal: Sígame.',
  },
  {
    front: 'Turn left / right',
    back: 'Gira a la izquierda / a la derecha',
    section: 'commands',
    tip: 'Also: Dobla… (LatAm). Keep going: Sigue derecho / todo recto.',
    speak: 'Gira a la izquierda',
  },
  {
    front: 'Be quiet / Shut up (soft → strong)',
    back: 'Silencio / Cállate',
    section: 'commands',
    tip: 'Silencio is polite in class/library. cállate is blunt — use carefully.',
    speak: 'Silencio',
  },
  {
    front: 'Smile',
    back: 'Sonríe',
    section: 'commands',
    tip: 'sonreír (e→i). Photos: ¡Sonrían! (plural).',
  },
  {
    front: 'Wake up',
    back: 'Despiértate',
    section: 'commands',
    tip: 'despertarse (e→ie). Soften: Despiértate, por favor.',
  },
  {
    front: 'Go to sleep / Sleep',
    back: 'Duerme / Acuéstate',
    section: 'commands',
    tip: 'dormir → duerme. Get in bed: acuéstate (acostarse).',
    speak: 'Duerme',
  },
  {
    front: 'Wash your hands',
    back: 'Lávate las manos',
    section: 'commands',
    tip: 'lavarse. Classic home/parent command before meals.',
  },
  {
    front: 'Please (with a command)',
    back: '…, por favor',
    section: 'commands',
    tip: 'Add por favor to soften almost any tú command: Ven aquí, por favor.',
    speak: 'por favor',
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
