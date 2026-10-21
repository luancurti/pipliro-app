import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { buildReviewMission, MISSIONS } from '@/data/missions';
import { useLanguage, useMissionText } from '@/i18n';
import { today, useProgress } from '@/state/progress';
import { colors, font, radius } from '@/theme';

export default function World() {
  const { progress } = useProgress();
  const { t } = useLanguage();
  const missionText = useMissionText();
  const review = buildReviewMission(progress.words);
  const reviewDone = progress.lastReview === today();
  const openMission = (id: string) => router.push({ pathname: '/mission/[id]', params: { id } });

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={{ fontSize: 40 }}>{progress.profile?.avatar}</Text>
        <View style={styles.seeds} accessibilityLabel={t.seedsA11y(progress.seeds)}>
          <Text style={styles.seedsText}>🌰 {progress.seeds}</Text>
        </View>
        <View style={{ flex: 1 }} />
        <Pressable accessibilityRole="button" accessibilityLabel={t.gardenA11y} onPress={() => router.push('/garden')} style={styles.iconBtn}>
          <Text style={{ fontSize: 28 }}>🏡</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={t.parentAreaA11y} onPress={() => router.push('/parents')} style={styles.iconBtn}>
          <Text style={{ fontSize: 28 }}>👪</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.page}>
        <Text style={font.title}>🌲 {t.worldName}</Text>
        <Text style={[font.small, { marginBottom: 8 }]}>{t.worldIntro}</Text>

        {review && !reviewDone ? (
          <Pressable accessibilityRole="button" onPress={() => openMission('review')} style={[styles.card, styles.review]}>
            <Text style={styles.cardEmoji}>🔁</Text>
            <View style={{ flex: 1 }}>
              <Text style={font.heading}>{t.dailyReview}</Text>
              <Text style={font.small}>{t.dailyReviewSub}</Text>
            </View>
          </Pressable>
        ) : null}

        <View style={styles.trail}>
          {MISSIONS.map((m, i) => {
            const result = progress.missions[m.id];
            const unlocked = i === 0 || !!progress.missions[MISSIONS[i - 1].id];
            const text = missionText(m);
            return (
              <Pressable
                key={m.id}
                accessibilityRole="button"
                accessibilityState={{ disabled: !unlocked }}
                disabled={!unlocked}
                onPress={() => openMission(m.id)}
                style={[styles.card, { marginLeft: i % 2 ? 48 : 0, marginRight: i % 2 ? 0 : 48 }, !unlocked && styles.locked]}
              >
                <Text style={styles.cardEmoji}>{unlocked ? m.emoji : '🔒'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{text.title}</Text>
                  <Text style={font.small}>{text.theme}</Text>
                </View>
                <Text style={styles.stars}>
                  {[1, 2, 3].map((s) => ((result?.stars ?? 0) >= s ? '⭐' : '☆')).join('')}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[font.small, { textAlign: 'center', marginTop: 12 }]}>{t.comingSoon}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingVertical: 8 },
  seeds: { backgroundColor: colors.sunSoft, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 2, borderColor: colors.sun },
  seedsText: { fontSize: 18, fontWeight: '800', color: colors.ink },
  iconBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.line },
  page: { padding: 20, paddingBottom: 48, gap: 6 },
  trail: { gap: 14, marginTop: 8 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.line,
    borderBottomWidth: 6,
  },
  review: { borderColor: colors.sky, backgroundColor: '#EAF4FF', marginVertical: 6 },
  locked: { opacity: 0.5 },
  cardEmoji: { fontSize: 40 },
  cardTitle: { fontSize: 19, fontWeight: '800', color: colors.ink },
  stars: { fontSize: 14, color: colors.sun },
});
