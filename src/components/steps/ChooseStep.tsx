import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PipPrompt } from '@/components/PipPrompt';
import { Tile, TileState } from '@/components/Tile';
import { ChooseStep as ChooseStepData, shuffle } from '@/data/missions';
import { word } from '@/data/words';
import { colors, radius } from '@/theme';
import { NEXT_DELAY, StepProps, WRONG_RESET } from './types';

export function ChooseStep({ step, showText, speak, onAnswer, onDone }: StepProps<ChooseStepData>) {
  const options = useMemo(() => shuffle(step.options), [step]);
  const [states, setStates] = useState<Record<string, TileState>>({});
  const [solved, setSolved] = useState(false);

  useEffect(() => speak(step.prompt), [step, speak]);

  const tap = (id: string) => {
    if (solved) return;
    if (id === step.answer) {
      setSolved(true);
      setStates({ [id]: 'correct' });
      onAnswer(true, [id]);
      speak(`Yes! The ${word(id).en}!`);
      setTimeout(onDone, NEXT_DELAY + 400);
    } else {
      setStates((s) => ({ ...s, [id]: 'wrong' }));
      onAnswer(false, [step.answer]);
      speak(`That is the ${word(id).en}. Try again!`);
      setTimeout(() => setStates((s) => ({ ...s, [id]: 'idle' })), WRONG_RESET);
    }
  };

  return (
    <View style={styles.wrap}>
      <PipPrompt text={step.prompt} showText={showText} onReplay={() => speak(step.prompt)} />
      <View style={styles.grid}>
        {options.map((id) =>
          solved && step.basket && id === step.answer ? (
            <View key={id} style={{ width: 120, height: 120 }} />
          ) : (
            <Tile
              key={id}
              emoji={word(id).emoji}
              accessibilityLabel={word(id).en}
              size={120}
              state={states[id] ?? 'idle'}
              onPress={() => tap(id)}
            />
          ),
        )}
      </View>
      {step.basket ? (
        <View style={[styles.basket, solved && styles.basketFull]}>
          <Text style={{ fontSize: 64 }}>🧺</Text>
          {solved ? <Text style={styles.inBasket}>{word(step.answer).emoji}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 28 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14 },
  basket: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 120,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: colors.line,
  },
  basketFull: { borderColor: colors.leaf, backgroundColor: colors.meadow, borderStyle: 'solid' },
  inBasket: { position: 'absolute', top: 6, fontSize: 40 },
});
