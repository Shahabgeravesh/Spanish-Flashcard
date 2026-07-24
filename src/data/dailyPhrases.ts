import type { FlashCard } from './cards'

export type DailyPhraseCard = FlashCard & {
  category: DailyCategory
}

export type DailyCategory =
  | 'greetings'
  | 'politeness'
  | 'home'
  | 'food'
  | 'shopping'
  | 'travel'
  | 'time'
  | 'feelings'
  | 'social'
  | 'work'
  | 'health'
  | 'phone'
  | 'weather'
  | 'help'

export const DAILY_CATEGORIES: {
  id: DailyCategory | 'all'
  label: string
}[] = [
  { id: 'all', label: 'All' },
  { id: 'greetings', label: 'Greetings' },
  { id: 'politeness', label: 'Politeness' },
  { id: 'home', label: 'Home' },
  { id: 'food', label: 'Food' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'travel', label: 'Travel' },
  { id: 'time', label: 'Time' },
  { id: 'feelings', label: 'Feelings' },
  { id: 'social', label: 'Social' },
  { id: 'work', label: 'Work' },
  { id: 'health', label: 'Health' },
  { id: 'phone', label: 'Phone' },
  { id: 'weather', label: 'Weather' },
  { id: 'help', label: 'Help' },
]

/** High-frequency daily Spanish phrases people actually use. */
const RAW: { en: string; es: string; category: DailyCategory }[] = [
  // Greetings
  { en: 'Hello', es: 'Hola', category: 'greetings' },
  { en: 'Good morning', es: 'Buenos días', category: 'greetings' },
  { en: 'Good afternoon', es: 'Buenas tardes', category: 'greetings' },
  { en: 'Good evening / Good night', es: 'Buenas noches', category: 'greetings' },
  { en: 'How are you?', es: '¿Cómo estás?', category: 'greetings' },
  { en: 'How are you? (formal)', es: '¿Cómo está usted?', category: 'greetings' },
  { en: "What's up?", es: '¿Qué tal?', category: 'greetings' },
  { en: "How's it going?", es: '¿Cómo te va?', category: 'greetings' },
  { en: "I'm fine, thanks", es: 'Estoy bien, gracias', category: 'greetings' },
  { en: 'Nice to meet you', es: 'Mucho gusto', category: 'greetings' },
  { en: 'See you later', es: 'Hasta luego', category: 'greetings' },
  { en: 'See you tomorrow', es: 'Hasta mañana', category: 'greetings' },
  { en: 'See you soon', es: 'Hasta pronto', category: 'greetings' },
  { en: 'Bye', es: 'Adiós', category: 'greetings' },
  { en: 'Take care', es: 'Cuídate', category: 'greetings' },
  { en: 'Welcome', es: 'Bienvenido / Bienvenida', category: 'greetings' },

  // Politeness
  { en: 'Please', es: 'Por favor', category: 'politeness' },
  { en: 'Thank you', es: 'Gracias', category: 'politeness' },
  { en: 'Thank you very much', es: 'Muchas gracias', category: 'politeness' },
  { en: "You're welcome", es: 'De nada', category: 'politeness' },
  { en: 'Excuse me', es: 'Perdón / Disculpe', category: 'politeness' },
  { en: "I'm sorry", es: 'Lo siento', category: 'politeness' },
  { en: 'No problem', es: 'No hay problema', category: 'politeness' },
  { en: 'Of course', es: 'Por supuesto', category: 'politeness' },
  { en: 'With pleasure', es: 'Con mucho gusto', category: 'politeness' },
  { en: 'May I…?', es: '¿Puedo…?', category: 'politeness' },
  { en: 'Could you…?', es: '¿Podrías…?', category: 'politeness' },
  { en: 'Would you mind…?', es: '¿Te importaría…?', category: 'politeness' },
  { en: 'After you', es: 'Después de usted', category: 'politeness' },
  { en: 'Bless you', es: '¡Salud!', category: 'politeness' },

  // Home / daily routine
  { en: "I'm home", es: 'Ya llegué', category: 'home' },
  { en: "I'm leaving", es: 'Me voy', category: 'home' },
  { en: "I'll be right back", es: 'Ya vuelvo', category: 'home' },
  { en: "I'm getting up", es: 'Me estoy levantando', category: 'home' },
  { en: "I'm going to sleep", es: 'Me voy a dormir', category: 'home' },
  { en: "I'm taking a shower", es: 'Me estoy duchando', category: 'home' },
  { en: "I'm hungry", es: 'Tengo hambre', category: 'home' },
  { en: "I'm thirsty", es: 'Tengo sed', category: 'home' },
  { en: "I'm tired", es: 'Estoy cansado / cansada', category: 'home' },
  { en: "I'm busy", es: 'Estoy ocupado / ocupada', category: 'home' },
  { en: 'Where are my keys?', es: '¿Dónde están mis llaves?', category: 'home' },
  { en: 'Turn on the light', es: 'Enciende la luz', category: 'home' },
  { en: 'Turn off the TV', es: 'Apaga la tele', category: 'home' },
  { en: 'Close the door', es: 'Cierra la puerta', category: 'home' },
  { en: 'Open the window', es: 'Abre la ventana', category: 'home' },
  { en: "I'll clean later", es: 'Limpio después', category: 'home' },
  { en: 'Did you lock the door?', es: '¿Cerraste con llave?', category: 'home' },
  { en: "I'm doing laundry", es: 'Estoy lavando la ropa', category: 'home' },

  // Food
  { en: "I'm hungry — let's eat", es: 'Tengo hambre — vamos a comer', category: 'food' },
  { en: 'What do you want to eat?', es: '¿Qué quieres comer?', category: 'food' },
  { en: 'The menu, please', es: 'La carta, por favor', category: 'food' },
  { en: 'I would like water', es: 'Quisiera agua', category: 'food' },
  { en: 'A coffee, please', es: 'Un café, por favor', category: 'food' },
  { en: 'The check, please', es: 'La cuenta, por favor', category: 'food' },
  { en: 'Is this spicy?', es: '¿Esto es picante?', category: 'food' },
  { en: "I'm vegetarian", es: 'Soy vegetariano / vegetariana', category: 'food' },
  { en: "I don't eat meat", es: 'No como carne', category: 'food' },
  { en: 'This is delicious', es: 'Esto está delicioso', category: 'food' },
  { en: 'Cheers!', es: '¡Salud!', category: 'food' },
  { en: 'Can I have more?', es: '¿Me das más?', category: 'food' },
  { en: "I'm full", es: 'Estoy lleno / llena', category: 'food' },
  { en: 'Do you want dessert?', es: '¿Quieres postre?', category: 'food' },
  { en: "Let's grab lunch", es: 'Vamos a almorzar', category: 'food' },
  { en: 'Breakfast', es: 'El desayuno', category: 'food' },
  { en: 'Dinner', es: 'La cena', category: 'food' },
  { en: 'Without sugar, please', es: 'Sin azúcar, por favor', category: 'food' },
  { en: 'For here or to go?', es: '¿Para aquí o para llevar?', category: 'food' },

  // Shopping
  { en: 'How much is this?', es: '¿Cuánto cuesta esto?', category: 'shopping' },
  { en: "It's too expensive", es: 'Es demasiado caro', category: 'shopping' },
  { en: 'Do you have a discount?', es: '¿Hay descuento?', category: 'shopping' },
  { en: "I'm just looking", es: 'Solo estoy mirando', category: 'shopping' },
  { en: 'Do you have this in another size?', es: '¿Lo tienen en otra talla?', category: 'shopping' },
  { en: 'Can I try this on?', es: '¿Puedo probármelo?', category: 'shopping' },
  { en: "I'll take it", es: 'Me lo llevo', category: 'shopping' },
  { en: 'Do you take cards?', es: '¿Aceptan tarjeta?', category: 'shopping' },
  { en: 'Cash only?', es: '¿Solo efectivo?', category: 'shopping' },
  { en: 'Where is the fitting room?', es: '¿Dónde está el probador?', category: 'shopping' },
  { en: 'I need a bag', es: 'Necesito una bolsa', category: 'shopping' },
  { en: 'Is it on sale?', es: '¿Está en oferta?', category: 'shopping' },
  { en: 'Receipt, please', es: 'El recibo, por favor', category: 'shopping' },
  { en: "I want to return this", es: 'Quiero devolver esto', category: 'shopping' },

  // Travel / directions
  { en: 'Where is the bathroom?', es: '¿Dónde está el baño?', category: 'travel' },
  { en: 'How do I get to…?', es: '¿Cómo llego a…?', category: 'travel' },
  { en: 'Is it far?', es: '¿Está lejos?', category: 'travel' },
  { en: 'Is it nearby?', es: '¿Está cerca?', category: 'travel' },
  { en: 'Go straight', es: 'Siga derecho', category: 'travel' },
  { en: 'Turn left', es: 'Gire a la izquierda', category: 'travel' },
  { en: 'Turn right', es: 'Gire a la derecha', category: 'travel' },
  { en: 'At the corner', es: 'En la esquina', category: 'travel' },
  { en: 'I need a taxi', es: 'Necesito un taxi', category: 'travel' },
  { en: 'Where is the bus stop?', es: '¿Dónde está la parada de autobús?', category: 'travel' },
  { en: 'Does this train go to…?', es: '¿Este tren va a…?', category: 'travel' },
  { en: "I'm lost", es: 'Estoy perdido / perdida', category: 'travel' },
  { en: 'Airport', es: 'El aeropuerto', category: 'travel' },
  { en: 'Hotel', es: 'El hotel', category: 'travel' },
  { en: 'I have a reservation', es: 'Tengo una reserva', category: 'travel' },
  { en: 'What time does it leave?', es: '¿A qué hora sale?', category: 'travel' },
  { en: 'What time does it arrive?', es: '¿A qué hora llega?', category: 'travel' },
  { en: 'One ticket, please', es: 'Un boleto, por favor', category: 'travel' },

  // Time
  { en: 'What time is it?', es: '¿Qué hora es?', category: 'time' },
  { en: "It's one o'clock", es: 'Es la una', category: 'time' },
  { en: "It's two o'clock", es: 'Son las dos', category: 'time' },
  { en: 'Today', es: 'Hoy', category: 'time' },
  { en: 'Tomorrow', es: 'Mañana', category: 'time' },
  { en: 'Yesterday', es: 'Ayer', category: 'time' },
  { en: 'Now', es: 'Ahora', category: 'time' },
  { en: 'Later', es: 'Más tarde', category: 'time' },
  { en: 'Soon', es: 'Pronto', category: 'time' },
  { en: 'In a minute', es: 'En un minuto', category: 'time' },
  { en: 'This week', es: 'Esta semana', category: 'time' },
  { en: 'Next week', es: 'La próxima semana', category: 'time' },
  { en: 'Weekend', es: 'El fin de semana', category: 'time' },
  { en: 'Are you free tonight?', es: '¿Estás libre esta noche?', category: 'time' },
  { en: "I'm running late", es: 'Voy tarde', category: 'time' },
  { en: 'Hurry up', es: 'Date prisa', category: 'time' },
  { en: 'Wait a moment', es: 'Espera un momento', category: 'time' },

  // Feelings
  { en: "I'm happy", es: 'Estoy feliz', category: 'feelings' },
  { en: "I'm sad", es: 'Estoy triste', category: 'feelings' },
  { en: "I'm angry", es: 'Estoy enojado / enojada', category: 'feelings' },
  { en: "I'm nervous", es: 'Estoy nervioso / nerviosa', category: 'feelings' },
  { en: "I'm excited", es: 'Estoy emocionado / emocionada', category: 'feelings' },
  { en: "I'm bored", es: 'Estoy aburrido / aburrida', category: 'feelings' },
  { en: "I'm worried", es: 'Estoy preocupado / preocupada', category: 'feelings' },
  { en: "I don't feel well", es: 'No me siento bien', category: 'feelings' },
  { en: 'I love it', es: 'Me encanta', category: 'feelings' },
  { en: 'I hate it', es: 'Lo odio', category: 'feelings' },
  { en: 'I miss you', es: 'Te extraño', category: 'feelings' },
  { en: "I'm proud of you", es: 'Estoy orgulloso / orgullosa de ti', category: 'feelings' },

  // Social
  { en: "What's your name?", es: '¿Cómo te llamas?', category: 'social' },
  { en: 'My name is…', es: 'Me llamo…', category: 'social' },
  { en: 'Where are you from?', es: '¿De dónde eres?', category: 'social' },
  { en: "I'm from…", es: 'Soy de…', category: 'social' },
  { en: 'Do you speak English?', es: '¿Hablas inglés?', category: 'social' },
  { en: 'A little Spanish', es: 'Un poco de español', category: 'social' },
  { en: 'Can you repeat that?', es: '¿Puedes repetir?', category: 'social' },
  { en: 'More slowly, please', es: 'Más despacio, por favor', category: 'social' },
  { en: 'What does that mean?', es: '¿Qué significa eso?', category: 'social' },
  { en: 'I agree', es: 'Estoy de acuerdo', category: 'social' },
  { en: "I don't agree", es: 'No estoy de acuerdo', category: 'social' },
  { en: 'Really?', es: '¿De verdad?', category: 'social' },
  { en: 'No way!', es: '¡No puede ser!', category: 'social' },
  { en: "That's funny", es: 'Qué gracioso / Qué chistoso', category: 'social' },
  { en: 'Congratulations!', es: '¡Felicidades!', category: 'social' },
  { en: 'Happy birthday!', es: '¡Feliz cumpleaños!', category: 'social' },
  { en: 'Good luck!', es: '¡Buena suerte!', category: 'social' },
  { en: 'Let me introduce you', es: 'Te presento a…', category: 'social' },
  { en: 'Are you free this weekend?', es: '¿Estás libre este fin de semana?', category: 'social' },
  { en: "Let's hang out", es: 'Vamos a salir / juntarnos', category: 'social' },

  // Work / school
  { en: 'I have to work', es: 'Tengo que trabajar', category: 'work' },
  { en: 'I have a meeting', es: 'Tengo una reunión', category: 'work' },
  { en: "I'm on break", es: 'Estoy en un descanso', category: 'work' },
  { en: 'Can we talk later?', es: '¿Podemos hablar después?', category: 'work' },
  { en: "I'll send you an email", es: 'Te mando un correo', category: 'work' },
  { en: "I'm studying", es: 'Estoy estudiando', category: 'work' },
  { en: 'I have homework', es: 'Tengo tarea', category: 'work' },
  { en: 'What do you do?', es: '¿A qué te dedicas?', category: 'work' },
  { en: 'I work from home', es: 'Trabajo desde casa', category: 'work' },
  { en: 'Deadline', es: 'La fecha límite', category: 'work' },

  // Health
  { en: 'I have a headache', es: 'Me duele la cabeza', category: 'health' },
  { en: 'My stomach hurts', es: 'Me duele el estómago', category: 'health' },
  { en: 'I have a cold', es: 'Tengo un resfriado', category: 'health' },
  { en: 'I need a doctor', es: 'Necesito un médico', category: 'health' },
  { en: 'Pharmacy', es: 'La farmacia', category: 'health' },
  { en: 'It hurts here', es: 'Me duele aquí', category: 'health' },
  { en: 'I feel dizzy', es: 'Me siento mareado / mareada', category: 'health' },
  { en: 'Get well soon', es: 'Que te mejores', category: 'health' },
  { en: "I'm allergic to…", es: 'Soy alérgico / alérgica a…', category: 'health' },
  { en: 'Emergency', es: 'Emergencia', category: 'health' },

  // Phone / digital
  { en: "What's your number?", es: '¿Cuál es tu número?', category: 'phone' },
  { en: "I'll call you", es: 'Te llamo', category: 'phone' },
  { en: 'Text me', es: 'Mándame un mensaje', category: 'phone' },
  { en: 'Can you hear me?', es: '¿Me oyes?', category: 'phone' },
  { en: 'The signal is bad', es: 'Hay mala señal', category: 'phone' },
  { en: "I'll send you the link", es: 'Te mando el enlace', category: 'phone' },
  { en: 'Are you online?', es: '¿Estás en línea?', category: 'phone' },
  { en: 'My phone died', es: 'Se me murió el celular', category: 'phone' },
  { en: 'Do you have Wi‑Fi?', es: '¿Hay wifi?', category: 'phone' },
  { en: "What's the password?", es: '¿Cuál es la contraseña?', category: 'phone' },

  // Weather
  { en: "It's hot", es: 'Hace calor', category: 'weather' },
  { en: "It's cold", es: 'Hace frío', category: 'weather' },
  { en: "It's raining", es: 'Está lloviendo', category: 'weather' },
  { en: "It's sunny", es: 'Está soleado', category: 'weather' },
  { en: 'What a nice day!', es: '¡Qué buen día!', category: 'weather' },
  { en: 'Bring a jacket', es: 'Lleva una chaqueta', category: 'weather' },
  { en: "It's windy", es: 'Hace viento', category: 'weather' },

  // Help / practical
  { en: 'Help!', es: '¡Ayuda!', category: 'help' },
  { en: 'Can you help me?', es: '¿Me puedes ayudar?', category: 'help' },
  { en: "I don't understand", es: 'No entiendo', category: 'help' },
  { en: "I don't know", es: 'No sé', category: 'help' },
  { en: 'Do you know where…?', es: '¿Sabes dónde…?', category: 'help' },
  { en: 'Is everything okay?', es: '¿Todo bien?', category: 'help' },
  { en: "Don't worry", es: 'No te preocupes', category: 'help' },
  { en: 'Be careful', es: 'Ten cuidado', category: 'help' },
  { en: 'Call the police', es: 'Llama a la policía', category: 'help' },
  { en: 'I need help', es: 'Necesito ayuda', category: 'help' },
  { en: 'Is there a problem?', es: '¿Hay algún problema?', category: 'help' },
  { en: 'Leave me alone', es: 'Déjame en paz', category: 'help' },
  { en: 'I lost my wallet', es: 'Perdí mi billetera / cartera', category: 'help' },
  { en: 'Where can I charge my phone?', es: '¿Dónde puedo cargar el celular?', category: 'help' },
]

export const dailyPhraseCards: DailyPhraseCard[] = RAW.map((item, i) => ({
  id: i + 1,
  front: item.en,
  back: item.es,
  category: item.category,
}))

export function filterDailyPhrases(
  cards: DailyPhraseCard[],
  category: DailyCategory | 'all',
): DailyPhraseCard[] {
  if (category === 'all') return cards
  return cards.filter((c) => c.category === category)
}
