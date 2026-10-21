import { WORDS } from './words';

/** Tap every copy of `target` hidden among distractors. */
export type FindStep = {
  kind: 'find';
  prompt: string;
  target: string;
  count: number;
  distractors: string[];
};

/** Hear an instruction and pick one picture. `basket` animates the pick into a basket. */
export type ChooseStep = {
  kind: 'choose';
  prompt: string;
  answer: string;
  options: string[];
  basket?: boolean;
};

/** Tap word chips in order to build a sentence. */
export type BuildStep = {
  kind: 'build';
  sentence: string[];
  extras?: string[];
};

/** Guided speaking: a character asks, the child answers aloud with a model available. */
export type SpeakStep = {
  kind: 'speak';
  question: string;
  answer: string;
  reply: string;
  emoji: string;
};

export type Step = FindStep | ChooseStep | BuildStep | SpeakStep;

export type Mission = {
  id: string;
  title: string;
  emoji: string;
  theme: string;
  steps: Step[];
};

export const MISSIONS: Mission[] = [
  {
    id: 'fruit-finders',
    title: 'Fruit Finders',
    emoji: '🍎',
    theme: 'Fruit and colors',
    steps: [
      { kind: 'choose', prompt: 'Can you find the red apple?', answer: 'apple', options: ['apple', 'banana', 'grapes'] },
      { kind: 'choose', prompt: 'Where is the green apple?', answer: 'green-apple', options: ['apple', 'green-apple', 'orange'] },
      { kind: 'find', prompt: 'Find two strawberries.', target: 'strawberry', count: 2, distractors: ['apple', 'grapes', 'orange', 'banana'] },
      { kind: 'choose', prompt: 'Tap the grapes.', answer: 'grapes', options: ['strawberry', 'grapes', 'banana', 'orange'] },
    ],
  },
  {
    id: 'missing-ingredients',
    title: 'The Missing Ingredients',
    emoji: '🧺',
    theme: 'Food and colors',
    steps: [
      { kind: 'find', prompt: 'Find three yellow bananas.', target: 'banana', count: 3, distractors: ['apple', 'grapes', 'orange', 'strawberry', 'green-apple'] },
      { kind: 'choose', prompt: 'Put the apple in the basket.', answer: 'apple', options: ['banana', 'apple', 'carrot'], basket: true },
      { kind: 'speak', question: 'What do you want?', answer: 'I want an apple.', reply: 'Here is your apple!', emoji: '🍎' },
      { kind: 'build', sentence: ['i', 'want', 'an', 'apple'] },
    ],
  },
  {
    id: 'count-with-pip',
    title: 'Count with Pip',
    emoji: '🍄',
    theme: 'Numbers 1–5',
    steps: [
      { kind: 'choose', prompt: 'Tap number three.', answer: 'three', options: ['one', 'three', 'five'] },
      { kind: 'find', prompt: 'Find four mushrooms.', target: 'mushroom', count: 4, distractors: ['leaf', 'flower', 'tree'] },
      { kind: 'choose', prompt: 'Which one is five?', answer: 'five', options: ['two', 'four', 'five'] },
      { kind: 'find', prompt: 'Find two flowers.', target: 'flower', count: 2, distractors: ['mushroom', 'leaf', 'tree', 'leaf'] },
      { kind: 'choose', prompt: 'Tap number two.', answer: 'two', options: ['two', 'three', 'one'] },
    ],
  },
  {
    id: 'forest-friends',
    title: 'Forest Friends',
    emoji: '🐰',
    theme: 'Animals',
    steps: [
      { kind: 'choose', prompt: 'Where is the rabbit?', answer: 'rabbit', options: ['cat', 'rabbit', 'dog'] },
      { kind: 'choose', prompt: 'Tap the frog.', answer: 'frog', options: ['bird', 'fox', 'frog'] },
      { kind: 'find', prompt: 'Find three birds.', target: 'bird', count: 3, distractors: ['owl', 'cat', 'fox', 'frog'] },
      { kind: 'choose', prompt: 'Give the carrot to the rabbit.', answer: 'carrot', options: ['cake', 'carrot', 'milk'], basket: false },
      { kind: 'speak', question: 'Who are you looking for?', answer: 'Where is the fox?', reply: 'The fox is behind the tree!', emoji: '🦊' },
    ],
  },
  {
    id: 'forest-colors',
    title: 'Colors of the Forest',
    emoji: '🟢',
    theme: 'Colors',
    steps: [
      { kind: 'find', prompt: 'Find two blue circles.', target: 'blue', count: 2, distractors: ['red', 'green', 'yellow', 'purple'] },
      { kind: 'choose', prompt: 'Tap purple.', answer: 'purple', options: ['purple', 'blue', 'red'] },
      { kind: 'find', prompt: 'Find three green circles.', target: 'green', count: 3, distractors: ['yellow', 'red', 'blue'] },
      { kind: 'choose', prompt: 'Which one is yellow?', answer: 'yellow', options: ['green', 'red', 'yellow'] },
    ],
  },
  {
    id: 'picnic-time',
    title: 'Picnic Time',
    emoji: '🍰',
    theme: 'Food and likes',
    steps: [
      { kind: 'choose', prompt: 'Put the bread in the basket.', answer: 'bread', options: ['cheese', 'bread', 'cake'], basket: true },
      { kind: 'choose', prompt: 'Put the milk in the basket.', answer: 'milk', options: ['milk', 'orange', 'cheese'], basket: true },
      { kind: 'speak', question: 'What do you like?', answer: 'I like cake.', reply: 'Yummy! I like cake too!', emoji: '🍰' },
      { kind: 'build', sentence: ['i', 'like', 'cheese'], extras: ['want'] },
    ],
  },
  {
    id: 'how-do-you-feel',
    title: 'How Do You Feel?',
    emoji: '😀',
    theme: 'Feelings',
    steps: [
      { kind: 'choose', prompt: 'Who is happy?', answer: 'happy', options: ['sad', 'happy', 'angry'] },
      { kind: 'choose', prompt: 'Who is sleepy?', answer: 'sleepy', options: ['sleepy', 'happy', 'sad'] },
      { kind: 'choose', prompt: 'Tap the sad face.', answer: 'sad', options: ['angry', 'sleepy', 'sad'] },
      { kind: 'build', sentence: ['the', 'cat', 'is', 'sleeping'] },
    ],
  },
  {
    id: 'pips-riddles',
    title: "Pip's Riddles",
    emoji: '🦉',
    theme: 'Riddles and review',
    steps: [
      { kind: 'choose', prompt: 'It is yellow and long. You can eat it. What is it?', answer: 'banana', options: ['apple', 'banana', 'carrot'] },
      { kind: 'choose', prompt: 'It says meow. What is it?', answer: 'cat', options: ['dog', 'frog', 'cat'] },
      { kind: 'choose', prompt: 'It is orange. Rabbits love it. What is it?', answer: 'carrot', options: ['orange', 'carrot', 'cheese'] },
      { kind: 'build', sentence: ['where', 'is', 'the', 'frog'], extras: ['a'] },
      { kind: 'speak', question: 'I lost my friend. Can you ask for me?', answer: 'Where is the owl?', reply: 'Hoo-hoo! I am here!', emoji: '🦉' },
    ],
  },
];

export function getMission(id: string): Mission | undefined {
  return MISSIONS.find((m) => m.id === id);
}

/** Word ids a step teaches, used for progress tracking. */
export function stepWords(step: Step): string[] {
  switch (step.kind) {
    case 'find':
      return [step.target];
    case 'choose':
      return [step.answer];
    case 'build':
      return step.sentence.filter((id) => WORDS[id]?.emoji);
    case 'speak':
      return [];
  }
}

const shuffle = <T,>(items: T[]): T[] => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Builds a review mission from words the child has already met, weakest first,
 * so earlier vocabulary keeps coming back in new combinations.
 */
export function buildReviewMission(stats: Record<string, { correct: number; wrong: number }>): Mission | undefined {
  const pictured = Object.keys(stats).filter((id) => WORDS[id]?.emoji && !['i', 'want', 'like', 'where', 'sleeping'].includes(id));
  if (pictured.length < 4) return undefined;
  const weakest = [...pictured].sort((a, b) => {
    const score = (id: string) => stats[id].correct / Math.max(1, stats[id].correct + stats[id].wrong);
    return score(a) - score(b);
  });
  const steps: Step[] = weakest.slice(0, 5).map((answer) => ({
    kind: 'choose',
    prompt: `Tap the ${WORDS[answer].en}.`,
    answer,
    options: shuffle([answer, ...shuffle(pictured.filter((id) => id !== answer)).slice(0, 2)]),
  }));
  return { id: 'review', title: 'Daily Review', emoji: '🔁', theme: 'Words you have met', steps };
}

export { shuffle };
