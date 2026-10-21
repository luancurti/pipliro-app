import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { BuildStep } from '@/components/steps/BuildStep';
import { ChooseStep } from '@/components/steps/ChooseStep';
import { FindStep } from '@/components/steps/FindStep';
import { SpeakStep } from '@/components/steps/SpeakStep';
import { buildReviewMission, getMission, Mission, Step } from '@/data/missions';
import { getPath } from '@/data/paths';
import { useLanguage } from '@/i18n';
import { stopSpeaking, useSpeak } from '@/lib/speech';
import { useProgress } from '@/state/progress';
import { colors, font, radius } from '@/theme';

const starsFor = (mistakes: number) => (mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1);

export default function MissionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { progress, recordAnswer, completeMission } = useProgress();
  const speak = useSpeak();
  const { t } = useLanguage();
  // Freeze the mission on mount: the review is generated from stats that change while playing.
  const [mission] = useState<Mission | undefined>(() => (id === 'review' ? buildReviewMission(progress.words) : getMission(id)));
  const [index, setIndex] = useState(0);
  const [reward, setReward] = useState<{ stars: number; seeds: number } | null>(null);
  const mistakes = useRef(0);
  const showText = getPath(progress.profile?.path ?? 'explorers').showText;

  useEffect(() => () => void stopSpeaking(), []);

  if (!mission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={font.heading}>{t.stillGrowing}</Text>
        <Button label={t.backToForest} onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const onAnswer = (correct: boolean, wordIds: string[]) => {
    if (!correct) mistakes.current += 1;
    recordAnswer(wordIds, correct);
  };

  const onDone = () => {
    if (index + 1 < mission.steps.length) {
      setIndex(index + 1);
      return;
    }
    const stars = starsFor(mistakes.current);
    const seeds = completeMission(mission.id, stars);
    setReward({ stars, seeds });
    speak(seeds > 0 ? `Amazing! You earned ${seeds} golden seed${seeds > 1 ? 's' : ''}!` : 'Amazing! You did it!');
  };

  if (reward) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ fontSize: 110 }}>🎉</Text>
        <Text style={font.title}>{t.missionComplete}</Text>
        <Text style={styles.bigStars}>{[1, 2, 3].map((s) => (reward.stars >= s ? '⭐' : '☆')).join(' ')}</Text>
        <View style={styles.rewardCard}>
          <Text style={{ fontSize: 44 }}>🌰</Text>
          <Text style={font.heading}>
            {reward.seeds > 0 ? t.seedsEarned(reward.seeds) : t.playAgain}
          </Text>
        </View>
        <View style={{ alignSelf: 'stretch', gap: 12 }}>
          {reward.seeds > 0 ? <Button label={t.plantInGarden} variant="sun" onPress={() => router.replace('/garden')} /> : null}
          <Button label={t.backToForest} onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const step = mission.steps[index];
  const common = { showText, speak, onAnswer, onDone };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.top}>
        <Pressable accessibilityRole="button" accessibilityLabel={t.leaveMission} onPress={() => router.back()} style={styles.close}>
          <Text style={{ fontSize: 22, fontWeight: '900', color: colors.muted }}>✕</Text>
        </Pressable>
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${(index / mission.steps.length) * 100}%` }]} />
        </View>
        <Text style={{ fontSize: 26 }}>{mission.emoji}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <StepView key={`${mission.id}-${index}`} step={step} {...common} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StepView({ step, ...props }: { step: Step } & Omit<Parameters<typeof FindStep>[0], 'step'>) {
  switch (step.kind) {
    case 'find':
      return <FindStep step={step} {...props} />;
    case 'choose':
      return <ChooseStep step={step} {...props} />;
    case 'build':
      return <BuildStep step={step} {...props} />;
    case 'speak':
      return <SpeakStep step={step} {...props} />;
  }
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18, padding: 24 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 8 },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  bar: { flex: 1, height: 16, borderRadius: 8, backgroundColor: colors.line, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.leaf, borderRadius: 8 },
  body: { padding: 20, paddingBottom: 48 },
  bigStars: { fontSize: 40, color: colors.sun },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: radius.md,
    backgroundColor: colors.sunSoft,
    borderWidth: 2,
    borderColor: colors.sun,
  },
});
