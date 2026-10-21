import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { LanguagePicker } from '@/components/LanguagePicker';
import { ParentGate } from '@/components/ParentGate';
import { MISSIONS } from '@/data/missions';
import { PATHS } from '@/data/paths';
import { WORDS } from '@/data/words';
import { Language, useLanguage } from '@/i18n';
import { useProgress } from '@/state/progress';
import { colors, font, radius } from '@/theme';

export default function Parents() {
  const [open, setOpen] = useState(false);
  const unlock = useCallback(() => setOpen(true), []);
  return open ? <Dashboard /> : <ParentGate onUnlock={unlock} />;
}

function Dashboard() {
  const { progress, updatePath, reset } = useProgress();
  const { t, language } = useLanguage();
  const words = Object.entries(progress.words).filter(([id]) => WORDS[id]?.emoji);
  const attempts = words.reduce((n, [, s]) => n + s.correct + s.wrong, 0);
  const correct = words.reduce((n, [, s]) => n + s.correct, 0);
  const mastered = words.filter(([, s]) => s.correct >= 3 && s.correct / (s.correct + s.wrong) >= 0.8);
  const struggling = words
    .filter(([, s]) => s.wrong >= 2)
    .sort(([, a], [, b]) => b.wrong / (b.correct + b.wrong) - a.wrong / (a.correct + a.wrong))
    .slice(0, 6);
  const done = MISSIONS.filter((m) => progress.missions[m.id]).length;

  const confirmReset = () => {
    const msg = t.deleteMessage;
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.(msg)) {
        reset();
        router.replace('/');
      }
      return;
    }
    Alert.alert(t.deleteTitle, msg, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: () => (reset(), router.replace('/')) },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[font.title, { flex: 1 }]}>{t.parentArea}</Text>
          <Pressable accessibilityRole="button" onPress={() => router.back()}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: colors.forest }}>{t.done}</Text>
          </Pressable>
        </View>

        <View style={styles.stats}>
          <Stat label={t.statMissions} value={`${done}/${MISSIONS.length}`} />
          <Stat label={t.statWords} value={String(words.length)} />
          <Stat label={t.statAccuracy} value={attempts ? `${Math.round((correct / attempts) * 100)}%` : '—'} />
        </View>

        <Section title={t.mastered(mastered.length)}>
          <Text style={font.small}>{t.masteredHelp}</Text>
          <WordList ids={mastered.map(([id]) => id)} empty={t.noneYet} gloss={language} />
        </Section>

        <Section title={t.needsPractice}>
          <Text style={font.small}>{t.needsPracticeHelp}</Text>
          <WordList ids={struggling.map(([id]) => id)} empty={t.nothingToWorry} gloss={language} />
        </Section>

        <Section title={t.language}>
          <Text style={font.small}>{t.languageHelp}</Text>
          <LanguagePicker />
        </Section>

        <Section title={t.learningPath}>
          {PATHS.map((p) => (
            <Pressable
              key={p.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: progress.profile?.path === p.id }}
              onPress={() => updatePath(p.id)}
              style={[styles.pathRow, progress.profile?.path === p.id && styles.pathOn]}
            >
              <Text style={{ fontSize: 28 }}>{p.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 17, fontWeight: '800', color: colors.ink }}>{t.paths[p.id].name}</Text>
                <Text style={font.small}>{t.ages(p.ages)}</Text>
              </View>
              {progress.profile?.path === p.id ? <Text style={{ fontSize: 20 }}>✓</Text> : null}
            </Pressable>
          ))}
        </Section>

        <Section title={t.privacy}>
          <Text style={font.small}>{t.privacyText}</Text>
          <Button label={t.deleteAll} variant="secondary" onPress={confirmReset} />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={font.small}>{label}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={font.heading}>{title}</Text>
      {children}
    </View>
  );
}

/** Each English word with its meaning in the interface language (none needed in English). */
function WordList({ ids, empty, gloss }: { ids: string[]; empty: string; gloss: Language }) {
  if (!ids.length) return <Text style={font.body}>{empty}</Text>;
  return (
    <View style={styles.words}>
      {ids.map((id) => (
        <View key={id} style={styles.word}>
          <Text style={{ fontSize: 20 }}>{WORDS[id].emoji}</Text>
          <Text style={{ fontWeight: '800', color: colors.ink }}>{WORDS[id].en}</Text>
          {gloss !== 'en' ? <Text style={font.small}>{WORDS[id][gloss]}</Text> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 18, paddingBottom: 48 },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, padding: 14, borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 2, borderColor: colors.line, alignItems: 'center' },
  statValue: { fontSize: 26, fontWeight: '900', color: colors.forest },
  section: { gap: 10, padding: 16, borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 2, borderColor: colors.line },
  words: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  word: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.sm, backgroundColor: colors.meadow },
  pathRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: radius.sm, borderWidth: 2, borderColor: colors.line },
  pathOn: { borderColor: colors.forest, backgroundColor: colors.meadow },
});
