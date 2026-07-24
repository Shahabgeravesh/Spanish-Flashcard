export type FlashCard = {
  id: number
  front: string
  back: string
  tip?: string
}

/** English → Spanish pairs — requests, intentions, connectors, with learner tips. */
export const cards: FlashCard[] = [
  {
    id: 1,
    front: 'Can I?',
    back: '¿Puedo?',
    tip: 'poder + yo → puedo. Soft request opener before an infinitive: ¿Puedo entrar?',
  },
  {
    id: 2,
    front: 'Can you?',
    back: '¿Puedes?',
    tip: 'tú form of poder. Polite ask: ¿Puedes ayudarme?',
  },
  {
    id: 3,
    front: 'I can',
    back: 'Puedo',
    tip: 'Statement of ability: Puedo hablar español.',
  },
  {
    id: 4,
    front: 'You can',
    back: 'Puedes',
    tip: 'Ability or permission for “you”: Puedes sentarte aquí.',
  },
  {
    id: 5,
    front: 'I want',
    back: 'Quiero',
    tip: 'Direct desire. Soften with me gustaría / quisiera in polite settings.',
  },
  {
    id: 6,
    front: 'I would like',
    back: 'Quisiera / me gustaría',
    tip: 'Politer than quiero — great for restaurants and shops.',
  },
  {
    id: 7,
    front: 'Can you bring me the bill? Please',
    back: '¿Puedes traerme la cuenta? por favor',
    tip: 'Restaurant line. la cuenta = the check/bill. por favor softens the request.',
  },
  {
    id: 8,
    front: 'Can I see the Menu? Please',
    back: '¿Puedo ver la carta? por favor',
    tip: 'In restaurants, la carta (or el menú) = the menu.',
  },
  {
    id: 9,
    front: 'I go to',
    back: 'Voy a',
    tip: 'ir + a + place, or ir + a + infinitive for near future: Voy a comer.',
  },
  {
    id: 10,
    front: "I'm going to eat",
    back: 'Voy a comer',
    tip: 'Near-future pattern: voy a + infinitive (very common spoken Spanish).',
  },
  {
    id: 11,
    front: 'To bring',
    back: 'Traer',
    tip: 'Irregular infinitive. Commands: tráeme, tráigame (formal).',
  },
  {
    id: 12,
    front: 'Bring me',
    back: 'Tráeme',
    tip: 'Informal command: traer + me → tráeme (accent on á).',
  },
  {
    id: 13,
    front: 'To give',
    back: 'Dar',
    tip: 'Highly irregular. Commands: dame, déme.',
  },
  {
    id: 14,
    front: 'Give me',
    back: 'Dame',
    tip: 'Informal affirmative command of dar + me.',
  },
  {
    id: 15,
    front: 'Bring me the bill, please',
    back: 'Tráeme la cuenta, por favor',
    tip: 'Direct restaurant request. Use tráigame with strangers/formal staff.',
  },
  {
    id: 16,
    front: 'Give me the Menu, please',
    back: 'Dame la carta, por favor',
    tip: 'Same idea as “bring me the menu”; dame is casual.',
  },
  {
    id: 17,
    front: 'I have to',
    back: 'Tengo que',
    tip: 'Obligation: tener que + infinitive. Tengo que estudiar.',
  },
  {
    id: 18,
    front: 'I have to eat',
    back: 'Tengo que comer',
    tip: 'tengo que + infinitive = must / have to.',
  },
  {
    id: 19,
    front: 'I have to go to the gym',
    back: 'Tengo que ir al gym',
    tip: 'a + el → al. gym / gimnasio both heard.',
  },
  {
    id: 20,
    front: 'I order',
    back: 'Pido',
    tip: 'pedir (e→i stem change): yo pido. Ordering food or asking for something.',
  },
  {
    id: 21,
    front: "I'm going to order",
    back: 'Voy a pedir',
    tip: 'Near future again: voy a + infinitive.',
  },
  {
    id: 22,
    front: 'I have been to',
    back: 'He estado en',
    tip: 'Present perfect of estar: he estado + en + place (experience).',
  },
  {
    id: 23,
    front: 'Have you been to…?',
    back: '¿Has estado en…?',
    tip: 'tú perfect: has estado. Fill the place after en.',
  },
  {
    id: 24,
    front: 'I have been to Argentina',
    back: 'He estado en Argentina',
    tip: 'Countries often take en (not a) with estar for “been in/to”.',
  },
  {
    id: 25,
    front: "it's like",
    back: 'es como',
    tip: 'Comparing or explaining: Es como… Filler in casual speech too.',
  },
  {
    id: 26,
    front: 'You know',
    back: 'Sabes',
    tip: 'Discourse marker (“you know…”) or real “you know”: ¿Sabes qué?',
  },
  {
    id: 27,
    front: 'I think',
    back: 'Creo que',
    tip: 'Opinion: creo que + clause. Creo que sí / no.',
  },
  {
    id: 28,
    front: 'You think',
    back: 'Crees que',
    tip: 'tú of creer + que. ¿Crees que va a llover?',
  },
  {
    id: 29,
    front: 'I should',
    back: 'Debería',
    tip: 'Conditional of deber = soft advice / obligation.',
  },
  {
    id: 30,
    front: 'You should',
    back: 'Deberías',
    tip: 'Advice to “you”: Deberías descansar.',
  },
  {
    id: 31,
    front: 'I should eat less',
    back: 'Debería comer menos',
    tip: 'debería + infinitive. menos = less.',
  },
  {
    id: 32,
    front: 'You should work out',
    back: 'Deberías hacer ejercicios',
    tip: 'hacer ejercicio (singular) is also very common.',
  },
  {
    id: 33,
    front: 'Can you give me money? please',
    back: '¿Puedes darme dinero? por favor',
    tip: 'Object pronoun attaches to infinitive: dar + me → darme.',
  },
  {
    id: 34,
    front: 'I was supposed to go',
    back: 'Iba a ir / Se suponía que debía ir',
    tip: 'iba a + infinitive = was going to / meant to. Soft unfinished plan.',
  },
  {
    id: 35,
    front: 'I was supposed to go with them',
    back: 'Iba a ir con ellos',
    tip: 'con ellos = with them (masc./mixed). con ellas for all women.',
  },
  {
    id: 36,
    front: 'I used to',
    back: 'Solía',
    tip: 'soler in imperfect: solía + infinitive = used to / would (habit).',
  },
  {
    id: 37,
    front: 'I used to go',
    back: 'Solía ir / iba',
    tip: 'Both solía ir and iba express past habit; iba is more everyday.',
  },
  {
    id: 38,
    front: 'Have a good weekend!',
    back: '¡Que tengas un buen fin de semana!',
    tip: 'Que + subjunctive wish: ¡Que tengas…! Very natural farewell.',
  },
  {
    id: 39,
    front: 'Have a good trip!',
    back: '¡Que tengas un buen viaje!',
    tip: 'Same wish pattern. Also: ¡Buen viaje!',
  },
  {
    id: 40,
    front: 'Have a good day!',
    back: '¡Que tengas un buen día!',
    tip: 'Friendly send-off. ¡Que le vaya bien! is more formal.',
  },
  {
    id: 41,
    front: 'I mean',
    back: 'quiero decir / es decir / o sea',
    tip: 'Clarifiers: quiero decir (I mean), es decir / o sea (that is / I mean).',
  },
  {
    id: 42,
    front: "I mean, it's not easy",
    back: 'Quiero decir, no es fácil',
    tip: 'Comma pause after the clarifier, same as English “I mean,”.',
  },
  {
    id: 43,
    front: 'Therefore',
    back: 'Por ende / por consiguiente',
    tip: 'Formal connectors. Everyday speech often uses entonces / así que.',
  },
  {
    id: 44,
    front: 'But',
    back: 'Pero',
    tip: 'Basic contrast. sino = but rather (after a negation).',
  },
  {
    id: 45,
    front: 'However',
    back: 'Sin embargo',
    tip: 'Stronger contrast than pero; often between sentences.',
  },
  {
    id: 46,
    front: 'moreover',
    back: 'Además',
    tip: 'Adds another point: Además, es barato.',
  },
  {
    id: 47,
    front: 'I want to play',
    back: 'Quiero jugar',
    tip: 'querer + infinitive. No “to” word needed after querer.',
  },
  {
    id: 48,
    front: 'I like',
    back: 'Me gusta',
    tip: 'gustar: the liked thing is the subject. Me gusta el café.',
  },
  {
    id: 49,
    front: 'I like to play',
    back: 'Me gusta jugar',
    tip: 'Me gusta + infinitive = I like doing X.',
  },
  {
    id: 50,
    front: "I don't know",
    back: 'No sé',
    tip: 'saber → yo sé (accent). Negation: no sé.',
  },
  {
    id: 51,
    front: 'It depends',
    back: 'Depende',
    tip: 'Often + de: Depende del día.',
  },
  {
    id: 52,
    front: 'Maybe',
    back: 'Quizá / tal vez',
    tip: 'Both common. May trigger subjunctive: Quizá vaya.',
  },
  {
    id: 53,
    front: 'Of course',
    back: 'Por supuesto',
    tip: 'Agreement / obvious yes. Also: claro / claro que sí.',
  },
  {
    id: 54,
    front: 'Actually',
    back: 'En realidad',
    tip: 'Soft correction or emphasis: En realidad, no.',
  },
  {
    id: 55,
    front: 'For example',
    back: 'Por ejemplo',
    tip: 'Introduces an example. Abbreviated p. ej. in writing.',
  },
  {
    id: 56,
    front: 'By the way',
    back: 'Por cierto',
    tip: 'Topic shift: Por cierto, ¿vienes mañana?',
  },
  {
    id: 57,
    front: 'What do you mean?',
    back: '¿Qué quieres decir?',
    tip: 'Clarify meaning. Softer: ¿Cómo?',
  },
  {
    id: 58,
    front: 'How do you say…?',
    back: '¿Cómo se dice…?',
    tip: 'Learner gold. se dice = “one says / is said”.',
  },
  {
    id: 59,
    front: 'Let me think',
    back: 'Déjame pensar',
    tip: 'dejar + me → déjame + infinitive (command).',
  },
  {
    id: 60,
    front: 'To be honest',
    back: 'Para ser honesto / honestamente',
    tip: 'Honesty marker before an opinion.',
  },
  {
    id: 61,
    front: 'In my opinion',
    back: 'En mi opinión',
    tip: 'Formal-ish opinion opener. Casual: Yo creo que…',
  },
  {
    id: 62,
    front: 'I want to introduce myself',
    back: 'Quiero presentarme',
    tip: 'Reflexive presentarse: introduce oneself.',
  },
  {
    id: 63,
    front: 'I introduce myself',
    back: 'Me presento',
    tip: 'Present tense reflexive: Me presento, soy…',
  },
  {
    id: 64,
    front: "Don't worry!",
    back: '¡No te preocupes!',
    tip: 'Negative tú command → subjunctive: no te preocupes.',
  },
  {
    id: 65,
    front: 'Useful',
    back: 'Útil',
    tip: 'Adjective; same for masc./fem. Accent on ú.',
  },
  {
    id: 66,
    front: 'Anyway',
    back: 'De todas maneras / de todos modos',
    tip: 'Moves the conversation on or softens a point.',
  },
  {
    id: 67,
    front: 'Whatever',
    back: 'Lo que sea',
    tip: 'Indifference / “anything”. Tone matters — can sound dismissive.',
  },
  {
    id: 68,
    front: 'Though',
    back: 'Aunque',
    tip: 'aunque + indicative = although (fact); + subjunctive = even if.',
  },
  {
    id: 69,
    front: 'Nevertheless',
    back: 'No obstante',
    tip: 'Formal however. Everyday: igual / de todas formas.',
  },
  {
    id: 70,
    front: 'Wherever',
    back: 'Donde sea',
    tip: 'Free-choice “wherever” — no accent on donde here.',
  },
  {
    id: 71,
    front: 'Whenever',
    back: 'Cuando sea',
    tip: 'Free-choice “whenever” — no accent on cuando here.',
  },
  {
    id: 72,
    front: 'Chill out',
    back: 'Relájate',
    tip: 'Informal command of reflexives: relajarse → relájate.',
  },
  {
    id: 73,
    front: 'Let me see',
    back: 'Déjame ver',
    tip: 'Buying time while you look or think. Same déjame + infinitive pattern.',
  },
]

export function shuffle<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}
