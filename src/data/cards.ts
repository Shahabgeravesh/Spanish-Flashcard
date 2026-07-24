export type FlashCard = {
  id: number
  front: string
  back: string
}

/** English → Spanish pairs from Wordwall “Making requests, INTENTIONS, Phrases” */
export const cards: FlashCard[] = [
  { id: 1, front: 'Can I?', back: '¿Puedo?' },
  { id: 2, front: 'Can you?', back: '¿Puedes?' },
  { id: 3, front: 'I can', back: 'Puedo' },
  { id: 4, front: 'You can', back: 'Puedes' },
  { id: 5, front: 'I want', back: 'Quiero' },
  { id: 6, front: 'I would like', back: 'Quisiera / me gustaría' },
  {
    id: 7,
    front: 'Can you bring me the bill? Please',
    back: '¿Puedes traerme la cuenta? por favor',
  },
  {
    id: 8,
    front: 'Can I see the Menu? Please',
    back: '¿Puedo ver la carta? por favor',
  },
  { id: 9, front: 'I go to', back: 'Voy a' },
  { id: 10, front: "I'm going to eat", back: 'Voy a comer' },
  { id: 11, front: 'To bring', back: 'Traer' },
  { id: 12, front: 'Bring me', back: 'Tráeme' },
  { id: 13, front: 'To give', back: 'Dar' },
  { id: 14, front: 'Give me', back: 'Dame' },
  {
    id: 15,
    front: 'Bring me the bill, please',
    back: 'Tráeme la cuenta, por favor',
  },
  {
    id: 16,
    front: 'Give me the Menu, please',
    back: 'Dame la carta, por favor',
  },
  { id: 17, front: 'I have to', back: 'Tengo que' },
  { id: 18, front: 'I have to eat', back: 'Tengo que comer' },
  {
    id: 19,
    front: 'I have to go to the gym',
    back: 'Tengo que ir al gym',
  },
  { id: 20, front: 'I order', back: 'Pido' },
  { id: 21, front: "I'm going to order", back: 'Voy a pedir' },
  { id: 22, front: 'I have been to', back: 'He estado en' },
  { id: 23, front: 'Have you been to…?', back: '¿Has estado en…?' },
  {
    id: 24,
    front: 'I have been to Argentina',
    back: 'He estado en Argentina',
  },
  { id: 25, front: "it's like", back: 'es como' },
  { id: 26, front: 'You know', back: 'Sabes' },
  { id: 27, front: 'I think', back: 'Creo que' },
  { id: 28, front: 'You think', back: 'Crees que' },
  { id: 29, front: 'I should', back: 'Debería' },
  { id: 30, front: 'You should', back: 'Deberías' },
  { id: 31, front: 'I should eat less', back: 'Debería comer menos' },
  {
    id: 32,
    front: 'You should work out',
    back: 'Deberías hacer ejercicios',
  },
  {
    id: 33,
    front: 'Can you give me money? please',
    back: '¿Puedes darme dinero? por favor',
  },
  {
    id: 34,
    front: 'I was supposed to go',
    back: 'Iba a ir / Se suponía que debía ir',
  },
  {
    id: 35,
    front: 'I was supposed to go with them',
    back: 'Iba a ir con ellos',
  },
  { id: 36, front: 'I used to', back: 'Solía' },
  { id: 37, front: 'I used to go', back: 'Solía ir / iba' },
  {
    id: 38,
    front: 'Have a good weekend!',
    back: '¡Que tengas un buen fin de semana!',
  },
  {
    id: 39,
    front: 'Have a good trip!',
    back: '¡Que tengas un buen viaje!',
  },
  {
    id: 40,
    front: 'Have a good day!',
    back: '¡Que tengas un buen día!',
  },
  {
    id: 41,
    front: 'I mean',
    back: 'quiero decir / es decir / o sea',
  },
  {
    id: 42,
    front: "I mean, it's not easy",
    back: 'Quiero decir, no es fácil',
  },
  { id: 43, front: 'Therefore', back: 'Por ende / por consiguiente' },
  { id: 44, front: 'But', back: 'Pero' },
  { id: 45, front: 'However', back: 'Sin embargo' },
  { id: 46, front: 'moreover', back: 'Además' },
  { id: 47, front: 'I want to play', back: 'Quiero jugar' },
  { id: 48, front: 'I like', back: 'Me gusta' },
  { id: 49, front: 'I like to play', back: 'Me gusta jugar' },
  { id: 50, front: "I don't know", back: 'No sé' },
  { id: 51, front: 'It depends', back: 'depende' },
  { id: 52, front: 'Maybe', back: 'Quizá / talvez' },
  { id: 53, front: 'Of course', back: 'Por supuesto' },
  { id: 54, front: 'Actually', back: 'En realidad' },
  { id: 55, front: 'For example', back: 'Por ejemplo' },
  { id: 56, front: 'By the way', back: 'Por cierto' },
  { id: 57, front: 'What do you mean?', back: '¿Qué quieres decir?' },
  { id: 58, front: 'How do you say…?', back: '¿Cómo se dice…?' },
  { id: 59, front: 'Let me think', back: 'Déjame pensar' },
  { id: 60, front: 'To be honest', back: 'Para ser honesto' },
  { id: 61, front: 'In my opinion', back: 'En mi opinión' },
  {
    id: 62,
    front: 'I want to introduce myself',
    back: 'Quiero presentarme',
  },
  { id: 63, front: 'I introduce myself', back: 'Me presento' },
  { id: 64, front: "Don't worry!", back: '¡No te preocupes!' },
  { id: 65, front: 'Useful', back: 'Útil' },
  { id: 66, front: 'Anyway', back: 'De todas maneras' },
  { id: 67, front: 'Whatever', back: 'Lo que sea' },
  { id: 68, front: 'Though', back: 'Aunque' },
  { id: 69, front: 'Nevertheless', back: 'No obstante' },
  { id: 70, front: 'Wherever', back: 'Dónde sea' },
  { id: 71, front: 'Whenever', back: 'Cuándo sea' },
  { id: 72, front: 'Chill out', back: 'Relájate' },
  { id: 73, front: 'Let me see', back: 'Déjame ver' },
]

export function shuffle<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}
