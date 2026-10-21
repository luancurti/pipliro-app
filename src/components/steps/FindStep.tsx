import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PipPrompt } from '@/components/PipPrompt';
import { Tile, TileState } from '@/components/Tile';
import { FindStep as FindStepData, shuffle } from '@/data/missions';
import { word } from '@/data/words';
import { colors } from '@/theme';
import { NEXT_DELAY, StepProps, WRONG_RESET } from './types';

export function FindStep({ step, showText, speak, onAnswer, onDone }: StepProps<FindStepData>) {
  const tiles = useMemo(
    () => shuffle([...Array(step.count).fill(step.target), ...step.distractors]).map((id, i) => ({ key: `${id}-${i}`, id })),
    [step],
  );
  const [states, setStates] = useState<Record<string, TileState>>({});
  const found = Object.values(states).filter((s) => s === 'done').length;

  useEffect(() => speak(step.prompt), [step, speak]);

  const tap = (key: string, id: string) => {
    if (found >= step.count) return;
    if (id === step.target) {
      const n = found + 1;
      setStates((s) => ({ ...s, [key]: 'done' }));
      onAnswer(true, [id]);
      if (n === step.count) {
        speak(`${n}! Great job, you found them all!`);
        setTimeout(onDone, NEXT_DELAY + 500);
      } else {
        speak(String(n));
      }
    } else {
      setStates((s) => ({ ...s, [key]: 'wrong' }));
      onAnswer(false, [step.target]);
      speak(`That is a ${word(id).en}. Try again!`);
      setTimeout(() => setStates((s) => ({ ...s, [key]: 'idle' })), WRONG_RESET);
    }
  };

  return (
    <View style={styles.wrap}>
      <PipPrompt text={step.prompt} showText={showText} onReplay={() => speak(step.prompt)} />
      <View style={styles.counter}>
        {Array.from({ length: step.count }, (_, i) => (
          <Text key={i} style={[styles.dot, i < found && styles.dotOn]}>
            {i < found ? word(step.target).emoji : '○'}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {tiles.map((t) => (
          <Tile
            key={t.key}
            emoji={word(t.id).emoji}
            accessibilityLabel={word(t.id).en}
            size={92}
            state={states[t.key] ?? 'idle'}
            onPress={() => tap(t.key, t.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 22 },
  counter: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  dot: { fontSize: 30, color: colors.line },
  dotOn: { color: colors.ink },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
});
