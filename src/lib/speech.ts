import * as Speech from 'expo-speech';
import { useCallback } from 'react';

import { getPath } from '@/data/paths';
import { useProgress } from '@/state/progress';

/**
 * MVP voice: device text-to-speech in US English. The roadmap calls for recorded
 * native-speaker audio before launch; swap this hook's implementation when it exists.
 */
export function useSpeak() {
  const { progress } = useProgress();
  const rate = progress.profile ? getPath(progress.profile.path).speechRate : 0.85;

  return useCallback(
    (text: string, onDone?: () => void) => {
      Speech.stop();
      Speech.speak(text, { language: 'en-US', rate, pitch: 1.1, onDone });
    },
    [rate],
  );
}

export const stopSpeaking = () => Speech.stop();
