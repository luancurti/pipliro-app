export type StepProps<S> = {
  step: S;
  showText: boolean;
  speak: (text: string, onDone?: () => void) => void;
  /** Report one attempt; wrong attempts lower the mission's stars. */
  onAnswer: (correct: boolean, wordIds: string[]) => void;
  /** The step is finished; the mission moves on. */
  onDone: () => void;
};

export const NEXT_DELAY = 1100;
export const WRONG_RESET = 550;
