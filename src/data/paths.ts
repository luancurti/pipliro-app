export type PathId = 'explorers' | 'adventurers' | 'heroes';

export type LearningPath = {
  id: PathId;
  name: string;
  ages: string;
  emoji: string;
  description: string;
  /** Speech rate for prompts; younger children hear slower English. */
  speechRate: number;
  /** Whether prompt text is shown on screen (younger children play audio-first). */
  showText: boolean;
};

export const PATHS: LearningPath[] = [
  {
    id: 'explorers',
    name: 'Little Explorers',
    ages: '5–6',
    emoji: '🐣',
    description: 'Listen, look and tap. First words and simple commands.',
    speechRate: 0.75,
    showText: false,
  },
  {
    id: 'adventurers',
    name: 'World Adventurers',
    ages: '7–8',
    emoji: '🧭',
    description: 'Build sentences and talk with forest friends.',
    speechRate: 0.85,
    showText: true,
  },
  {
    id: 'heroes',
    name: 'Language Heroes',
    ages: '9–10',
    emoji: '🦸',
    description: 'Solve riddles and use English on your own.',
    speechRate: 0.95,
    showText: true,
  },
];

export function getPath(id: PathId): LearningPath {
  return PATHS.find((p) => p.id === id) ?? PATHS[0];
}
