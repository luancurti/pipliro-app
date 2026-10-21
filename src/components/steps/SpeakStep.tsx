import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { PipPrompt } from '@/components/PipPrompt';
import { SpeakStep as SpeakStepData } from '@/data/missions';
import { useLanguage } from '@/i18n';
import { colors, radius } from '@/theme';
import { NEXT_DELAY, StepProps } from './types';

/**
 * Guided speaking, stage one of the roadmap: the child answers aloud and taps when done.
 * Nothing is recorded — no microphone, no voice data stored.
 */
export function SpeakStep({ step, showText, speak, onDone }: StepProps<SpeakStepData>) {
  const { t } = useLanguage();
  const [helped, setHelped] = useState(false);
  const [said, setSaid] = useState(false);

  useEffect(() => speak(step.question), [step, speak]);

  const help = () => {
    setHelped(true);
    speak(`You can say: ${step.answer}`);
  };

  const done = () => {
    setSaid(true);
    speak(step.reply);
    setTimeout(onDone, NEXT_DELAY + 1200);
  };

  return (
    <View style={styles.wrap}>
      <PipPrompt text={step.question} showText={showText} onReplay={() => speak(step.question)} />
      <View style={styles.stage}>
        <Text style={{ fontSize: 96 }}>{step.emoji}</Text>
        {said ? (
          <Text style={styles.reply}>{step.reply}</Text>
        ) : helped || showText ? (
          <View style={styles.model}>
            <Text style={styles.modelLabel}>{t.say}</Text>
            <Text style={styles.modelText}>“{step.answer}”</Text>
          </View>
        ) : null}
      </View>
      {!said ? (
        <View style={styles.actions}>
          <Button label={t.iSaidIt} onPress={done} variant="sun" />
          <Button label={t.helpMe} onPress={help} variant="secondary" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 24 },
  stage: { alignItems: 'center', gap: 16, minHeight: 210, justifyContent: 'center' },
  model: {
    alignItems: 'center',
    padding: 16,
    borderRadius: radius.md,
    backgroundColor: colors.sunSoft,
    borderWidth: 2,
    borderColor: colors.sun,
  },
  modelLabel: { fontSize: 14, fontWeight: '700', color: colors.muted },
  modelText: { fontSize: 26, fontWeight: '800', color: colors.ink },
  reply: { fontSize: 24, fontWeight: '800', color: colors.forest, textAlign: 'center' },
  actions: { gap: 12 },
});
