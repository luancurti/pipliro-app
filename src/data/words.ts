export type Word = {
  id: string;
  en: string;
  emoji: string;
  /** Translations shown to parents only, in the interface language. */
  pt: string;
  es: string;
};

const list: Word[] = [
  // Food
  { id: 'apple', en: 'apple', emoji: '🍎', pt: 'maçã', es: 'manzana' },
  { id: 'green-apple', en: 'green apple', emoji: '🍏', pt: 'maçã verde', es: 'manzana verde' },
  { id: 'banana', en: 'banana', emoji: '🍌', pt: 'banana', es: 'plátano' },
  { id: 'strawberry', en: 'strawberry', emoji: '🍓', pt: 'morango', es: 'fresa' },
  { id: 'grapes', en: 'grapes', emoji: '🍇', pt: 'uvas', es: 'uvas' },
  { id: 'orange', en: 'orange', emoji: '🍊', pt: 'laranja', es: 'naranja' },
  { id: 'bread', en: 'bread', emoji: '🍞', pt: 'pão', es: 'pan' },
  { id: 'cheese', en: 'cheese', emoji: '🧀', pt: 'queijo', es: 'queso' },
  { id: 'milk', en: 'milk', emoji: '🥛', pt: 'leite', es: 'leche' },
  { id: 'cake', en: 'cake', emoji: '🍰', pt: 'bolo', es: 'pastel' },
  { id: 'carrot', en: 'carrot', emoji: '🥕', pt: 'cenoura', es: 'zanahoria' },
  // Colors
  { id: 'red', en: 'red', emoji: '🔴', pt: 'vermelho', es: 'rojo' },
  { id: 'blue', en: 'blue', emoji: '🔵', pt: 'azul', es: 'azul' },
  { id: 'green', en: 'green', emoji: '🟢', pt: 'verde', es: 'verde' },
  { id: 'yellow', en: 'yellow', emoji: '🟡', pt: 'amarelo', es: 'amarillo' },
  { id: 'purple', en: 'purple', emoji: '🟣', pt: 'roxo', es: 'morado' },
  // Numbers
  { id: 'one', en: 'one', emoji: '1️⃣', pt: 'um', es: 'uno' },
  { id: 'two', en: 'two', emoji: '2️⃣', pt: 'dois', es: 'dos' },
  { id: 'three', en: 'three', emoji: '3️⃣', pt: 'três', es: 'tres' },
  { id: 'four', en: 'four', emoji: '4️⃣', pt: 'quatro', es: 'cuatro' },
  { id: 'five', en: 'five', emoji: '5️⃣', pt: 'cinco', es: 'cinco' },
  // Animals
  { id: 'cat', en: 'cat', emoji: '🐱', pt: 'gato', es: 'gato' },
  { id: 'dog', en: 'dog', emoji: '🐶', pt: 'cachorro', es: 'perro' },
  { id: 'rabbit', en: 'rabbit', emoji: '🐰', pt: 'coelho', es: 'conejo' },
  { id: 'bird', en: 'bird', emoji: '🐦', pt: 'pássaro', es: 'pájaro' },
  { id: 'frog', en: 'frog', emoji: '🐸', pt: 'sapo', es: 'rana' },
  { id: 'owl', en: 'owl', emoji: '🦉', pt: 'coruja', es: 'búho' },
  { id: 'fox', en: 'fox', emoji: '🦊', pt: 'raposa', es: 'zorro' },
  // Forest things
  { id: 'mushroom', en: 'mushroom', emoji: '🍄', pt: 'cogumelo', es: 'hongo' },
  { id: 'tree', en: 'tree', emoji: '🌳', pt: 'árvore', es: 'árbol' },
  { id: 'flower', en: 'flower', emoji: '🌼', pt: 'flor', es: 'flor' },
  { id: 'leaf', en: 'leaf', emoji: '🍃', pt: 'folha', es: 'hoja' },
  { id: 'basket', en: 'basket', emoji: '🧺', pt: 'cesta', es: 'cesta' },
  // Feelings
  { id: 'happy', en: 'happy', emoji: '😀', pt: 'feliz', es: 'feliz' },
  { id: 'sad', en: 'sad', emoji: '😢', pt: 'triste', es: 'triste' },
  { id: 'sleepy', en: 'sleepy', emoji: '😴', pt: 'com sono', es: 'con sueño' },
  { id: 'angry', en: 'angry', emoji: '😠', pt: 'bravo', es: 'enojado' },
  // Sentence words
  { id: 'i', en: 'I', emoji: '🙋', pt: 'eu', es: 'yo' },
  { id: 'want', en: 'want', emoji: '🤲', pt: 'quero', es: 'quiero' },
  { id: 'like', en: 'like', emoji: '❤️', pt: 'gosto', es: 'me gusta' },
  { id: 'an', en: 'an', emoji: '', pt: 'um/uma', es: 'un/una' },
  { id: 'a', en: 'a', emoji: '', pt: 'um/uma', es: 'un/una' },
  { id: 'the', en: 'the', emoji: '', pt: 'o/a', es: 'el/la' },
  { id: 'is', en: 'is', emoji: '', pt: 'é/está', es: 'es/está' },
  { id: 'sleeping', en: 'sleeping', emoji: '💤', pt: 'dormindo', es: 'durmiendo' },
  { id: 'where', en: 'where', emoji: '❓', pt: 'onde', es: 'dónde' },
];

export const WORDS: Record<string, Word> = Object.fromEntries(list.map((w) => [w.id, w]));

export function word(id: string): Word {
  const w = WORDS[id];
  if (!w) throw new Error(`Unknown word: ${id}`);
  return w;
}
