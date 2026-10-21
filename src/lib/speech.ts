import { setAudioModeAsync } from 'expo-audio';
import * as Speech from 'expo-speech';
import { useCallback } from 'react';
import { Platform } from 'react-native';

import { getPath } from '@/data/paths';
import { useProgress } from '@/state/progress';

// Listening is the lesson, so Pip must be heard even with the iPhone's ring/silent switch on.
// expo-speech speaks through the app's audio session, which iOS mutes in silent mode by default.
// Playback only: no recording, no background audio.
if (Platform.OS !== 'web') {
  setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'duckOthers', shouldPlayInBackground: false }).catch(() => {});
}

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
