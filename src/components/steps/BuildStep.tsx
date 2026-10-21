import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PipPrompt } from '@/components/PipPrompt';
import { BuildStep as BuildStepData, shuffle } from '@/data/missions';
import { word } from '@/data/words';
import { useLanguage } from '@/i18n';
import { colors, radius } from '@/theme';
import { NEXT_DELAY, StepProps } from './types';

const sentenceText = (ids: string[]) => {
  const s = ids.map((id) => word(id).en).join(' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function BuildStep({ step, speak, onAnswer, onDone }: StepProps<BuildStepData>) {
  const chips = useMemo(
    () => shuffle([...step.sentence, ...(step.extras ?? [])]).map((id, i) => ({ key: `${id}-${i}`, id })),
    [step],
  );
  const { t } = useLanguage();
  const [picked, setPicked] = useState<string[]>([]);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const target = sentenceText(step.sentence);
  // Building a sentence is reading, so every path sees the English target: the instruction is localized.
  const prompt = `${t.buildInstruction} ${target}`;

  useEffect(() => speak(target), [target, speak]);

  const idOf = (key: string) => chips.find((c) => c.key === key)!.id;

  const check = (keys: string[]) => {
    // Compare by spelling so duplicate words are judged on what was built, not which chip.
    const ok = sentenceText(keys.map(idOf)) === target;
    setResult(ok ? 'correct' : 'wrong');
    onAnswer(ok, step.sentence);
    if (ok) {
      speak(`${target} Perfect!`);
      setTimeout(onDone, NEXT_DELAY + 900);
    } else {
      speak('Almost! Try again.');
      setTimeout(() => {
        setPicked([]);
        setResult(null);
      }, 900);
    }
  };

  const toggle = (key: string) => {
    if (result) return;
    if (picked.includes(key)) {
      setPicked(picked.filter((k) => k !== key));
      return;
    }
    const next = [...picked, key];
    setPicked(next);
    if (next.length === step.sentence.length) check(next);
    else speak(word(idOf(key)).en);
  };

  return (
    <View style={styles.wrap}>
      <PipPrompt text={prompt} showText onReplay={() => speak(target)} />
      <View style={[styles.answer, result === 'correct' && styles.answerOk, result === 'wrong' && styles.answerBad]}>
        {picked.length === 0 ? <Text style={styles.placeholder}>{t.tapWordsInOrder}</Text> : null}
        {picked.map((key) => (
          <Chip key={key} id={idOf(key)} onPress={() => toggle(key)} />
        ))}
      </View>
      <View style={styles.bank}>
        {chips.map((c) =>
          picked.includes(c.key) ? (
            <View key={c.key} style={[styles.chip, styles.chipGhost]}>
              <Text style={[styles.chipText, { opacity: 0 }]}>{word(c.id).en}</Text>
            </View>
          ) : (
            <Chip key={c.key} id={c.id} onPress={() => toggle(c.key)} />
          ),
        )}
      </View>
    </View>
  );
}

function Chip({ id, onPress }: { id: string; onPress: () => void }) {
  const w = word(id);
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.chip, pressed && { transform: [{ scale: 0.95 }] }]}>
      {w.emoji ? <Text style={styles.chipEmoji}>{w.emoji}</Text> : null}
      <Text style={styles.chipText}>{w.en}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 24 },
  answer: {
    minHeight: 84,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: colors.line,
    backgroundColor: '#ffffffaa',
  },
  answerOk: { borderColor: colors.leaf, borderStyle: 'solid', backgroundColor: colors.meadow },
  answerBad: { borderColor: colors.berry, borderStyle: 'solid', backgroundColor: '#FDE8EA' },
  placeholder: { ...{ fontSize: 16, color: colors.muted }, flex: 1, textAlign: 'center' },
  bank: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.line,
    borderBottomWidth: 5,
  },
  chipGhost: { backgroundColor: colors.line, borderColor: colors.line },
  chipEmoji: { fontSize: 22 },
  chipText: { fontSize: 20, fontWeight: '800', color: colors.ink },
});
