export type ColorKind = 'basic' | 'shade' | 'phrase'

export type ColorCard = {
  id: number
  front: string
  back: string
  tip: string
  kind: ColorKind
  /** CSS color for swatch (optional for pure phrases) */
  swatch?: string
}

const RAW: Omit<ColorCard, 'id'>[] = [
  // Basic colors
  {
    front: 'red',
    back: 'rojo / roja',
    tip: 'Basic color. Agrees with gender: un coche rojo, una casa roja.',
    kind: 'basic',
    swatch: '#e11d48',
  },
  {
    front: 'blue',
    back: 'azul',
    tip: 'Same form for masculine and feminine: el cielo azul, la camisa azul.',
    kind: 'basic',
    swatch: '#2563eb',
  },
  {
    front: 'yellow',
    back: 'amarillo / amarilla',
    tip: 'Gender agreement: un plátano amarillo, una flor amarilla.',
    kind: 'basic',
    swatch: '#eab308',
  },
  {
    front: 'green',
    back: 'verde',
    tip: 'Invariable ending in -e: el árbol verde, la hierba verde.',
    kind: 'basic',
    swatch: '#16a34a',
  },
  {
    front: 'orange',
    back: 'naranja',
    tip: 'Usually invariable as a color: una camiseta naranja. (Also the fruit.)',
    kind: 'basic',
    swatch: '#f97316',
  },
  {
    front: 'purple',
    back: 'morado / morada · púrpura',
    tip: 'morado/a is everyday; púrpura is more formal or literary.',
    kind: 'basic',
    swatch: '#7c3aed',
  },
  {
    front: 'pink',
    back: 'rosa · rosado / rosada',
    tip: 'rosa is common and often invariable; rosado/a agrees with gender.',
    kind: 'basic',
    swatch: '#ec4899',
  },
  {
    front: 'brown',
    back: 'marrón · café',
    tip: 'marrón is Spain/common; café is widely used in Latin America.',
    kind: 'basic',
    swatch: '#92400e',
  },
  {
    front: 'black',
    back: 'negro / negra',
    tip: 'Gender agreement: un gato negro, una noche negra.',
    kind: 'basic',
    swatch: '#171717',
  },
  {
    front: 'white',
    back: 'blanco / blanca',
    tip: 'Gender agreement: un papel blanco, una pared blanca.',
    kind: 'basic',
    swatch: '#f8fafc',
  },
  {
    front: 'gray / grey',
    back: 'gris',
    tip: 'Invariable: un día gris, una nube gris.',
    kind: 'basic',
    swatch: '#6b7280',
  },
  {
    front: 'gold',
    back: 'dorado / dorada · de oro',
    tip: 'dorado/a = gold-colored; de oro = made of gold.',
    kind: 'basic',
    swatch: '#d4a017',
  },
  {
    front: 'silver',
    back: 'plateado / plateada · de plata',
    tip: 'plateado/a = silver-colored; de plata = made of silver.',
    kind: 'basic',
    swatch: '#c0c7d1',
  },
  {
    front: 'beige',
    back: 'beige · beige',
    tip: 'Often invariable (loanword). Soft tan/cream color.',
    kind: 'basic',
    swatch: '#d6c6a8',
  },
  {
    front: 'turquoise',
    back: 'turquesa',
    tip: 'Usually invariable. Blue-green like tropical water.',
    kind: 'basic',
    swatch: '#14b8a6',
  },

  // Shades / modifiers
  {
    front: 'light blue',
    back: 'azul claro',
    tip: 'claro/a after the color = light. Azul stays the same; claro agrees if needed in longer phrases.',
    kind: 'shade',
    swatch: '#93c5fd',
  },
  {
    front: 'dark blue',
    back: 'azul oscuro',
    tip: 'oscuro/a = dark. Pattern: color + claro/oscuro.',
    kind: 'shade',
    swatch: '#1e3a8a',
  },
  {
    front: 'light green',
    back: 'verde claro',
    tip: 'Same pattern as azul claro: color + claro.',
    kind: 'shade',
    swatch: '#86efac',
  },
  {
    front: 'dark green',
    back: 'verde oscuro',
    tip: 'color + oscuro = dark shade.',
    kind: 'shade',
    swatch: '#14532d',
  },
  {
    front: 'light red / pinkish red',
    back: 'rojo claro',
    tip: 'claro softens the shade (not the same as rosa).',
    kind: 'shade',
    swatch: '#fb7185',
  },
  {
    front: 'dark red',
    back: 'rojo oscuro',
    tip: 'oscuro deepens the shade: rojo oscuro.',
    kind: 'shade',
    swatch: '#7f1d1d',
  },
  {
    front: 'bright yellow',
    back: 'amarillo brillante · amarillo vivo',
    tip: 'brillante / vivo = vivid, eye-catching.',
    kind: 'shade',
    swatch: '#facc15',
  },
  {
    front: 'pale / pastel',
    back: 'pastel · pálido / pálida',
    tip: 'pastel is often invariable; pálido/a agrees with gender.',
    kind: 'shade',
    swatch: '#fce7f3',
  },
  {
    front: 'multicolored',
    back: 'de muchos colores · multicolor',
    tip: 'de muchos colores is natural spoken Spanish.',
    kind: 'shade',
    swatch: 'conic-gradient(red, orange, yellow, green, blue, violet)',
  },

  // Useful phrases
  {
    front: 'What color is it?',
    back: '¿De qué color es?',
    tip: 'Standard question for asking the color of something.',
    kind: 'phrase',
  },
  {
    front: 'What color do you prefer?',
    back: '¿Qué color prefieres?',
    tip: 'Useful when shopping or choosing options.',
    kind: 'phrase',
  },
  {
    front: 'I like the blue one',
    back: 'Me gusta el azul / la azul',
    tip: 'Use el/la + color as a noun: el azul = the blue one.',
    kind: 'phrase',
    swatch: '#3b82f6',
  },
  {
    front: "It's red",
    back: 'Es rojo / Es roja',
    tip: 'Match gender with the noun you mean (el coche es rojo, la camisa es roja).',
    kind: 'phrase',
    swatch: '#e11d48',
  },
  {
    front: 'Do you have it in black?',
    back: '¿Lo tienen en negro?',
    tip: 'Common shopping line: en + color.',
    kind: 'phrase',
    swatch: '#171717',
  },
  {
    front: 'Do you have it in another color?',
    back: '¿Lo tienen en otro color?',
    tip: 'otro/a color — ask for alternatives in a store.',
    kind: 'phrase',
  },
  {
    front: 'My favorite color is…',
    back: 'Mi color favorito es…',
    tip: 'favorito/a agrees with color (masculine noun): mi color favorito.',
    kind: 'phrase',
  },
  {
    front: 'A white T-shirt',
    back: 'Una camiseta blanca',
    tip: 'Adjective usually after the noun; blanca agrees with camiseta (fem.).',
    kind: 'phrase',
    swatch: '#f8fafc',
  },
  {
    front: 'Black coffee',
    back: 'Café solo · café negro',
    tip: 'café solo = espresso-style black coffee in many places; café negro also used.',
    kind: 'phrase',
    swatch: '#292524',
  },
  {
    front: 'Green light / red light',
    back: 'luz verde / luz roja',
    tip: 'Traffic lights: la luz verde, la luz roja.',
    kind: 'phrase',
  },
  {
    front: 'The sky is blue',
    back: 'El cielo es azul',
    tip: 'Simple description pattern: noun + ser + color.',
    kind: 'phrase',
    swatch: '#38bdf8',
  },
  {
    front: 'In color / black and white',
    back: 'a color / en blanco y negro',
    tip: 'Movies/photos: en blanco y negro vs a color (or en color).',
    kind: 'phrase',
  },
]

export const colorCards: ColorCard[] = RAW.map((card, i) => ({
  ...card,
  id: i + 1,
}))

export type ColorFilter = ColorKind | 'all'

export const COLOR_FILTERS: { id: ColorFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'basic', label: 'Basic colors' },
  { id: 'shade', label: 'Shades' },
  { id: 'phrase', label: 'Phrases' },
]

export function filterColorCards(
  cards: ColorCard[],
  filter: ColorFilter,
): ColorCard[] {
  if (filter === 'all') return cards
  return cards.filter((c) => c.kind === filter)
}
