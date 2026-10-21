import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '@/i18n';
import { useSpeak } from '@/lib/speech';
import { useProgress } from '@/state/progress';
import { colors, font, radius } from '@/theme';

/** My World: rewards earned through learning only — there is nothing to buy with real money. */
const SHOP = [
  { item: '🌻', name: 'sunflower', cost: 1 },
  { item: '🌷', name: 'tulip', cost: 1 },
  { item: '🍄', name: 'mushroom', cost: 2 },
  { item: '🦋', name: 'butterfly', cost: 2 },
  { item: '🌳', name: 'tree', cost: 3 },
  { item: '🐿️', name: 'squirrel', cost: 4 },
  { item: '🐢', name: 'turtle', cost: 4 },
  { item: '🏠', name: 'little house', cost: 6 },
];

export default function Garden() {
  const { progress, plant } = useProgress();
  const speak = useSpeak();
  const { t } = useLanguage();

  const buy = (s: (typeof SHOP)[number]) => {
    if (plant(s.item, s.cost)) speak(`A ${s.name}! Beautiful!`);
    else speak(`You need ${s.cost} golden seeds. Play a mission to get more!`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel={t.back} onPress={() => router.back()} style={styles.back}>
          <Text style={{ fontSize: 24, fontWeight: '900', color: colors.muted }}>‹</Text>
        </Pressable>
        <Text style={[font.title, { flex: 1 }]}>{t.myGarden}</Text>
        <View style={styles.seeds}>
          <Text style={styles.seedsText}>🌰 {progress.seeds}</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.garden}>
          {progress.garden.length === 0 ? (
            <Text style={[font.body, { textAlign: 'center', color: colors.muted }]}>
              {t.gardenEmpty}
            </Text>
          ) : (
            progress.garden.map((g, i) => (
              <Text key={i} style={styles.planted}>
                {g}
              </Text>
            ))
          )}
        </View>
        <Text style={font.heading}>{t.plantSomething}</Text>
        <View style={styles.shop}>
          {SHOP.map((s) => {
            const affordable = progress.seeds >= s.cost;
            return (
              <Pressable
                key={s.item}
                accessibilityRole="button"
                accessibilityLabel={t.shopA11y(s.name, s.cost)}
                onPress={() => buy(s)}
                style={[styles.item, !affordable && { opacity: 0.45 }]}
              >
                <Text style={{ fontSize: 44 }}>{s.item}</Text>
                <Text style={styles.cost}>🌰 {s.cost}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8 },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  seeds: { backgroundColor: colors.sunSoft, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 2, borderColor: colors.sun },
  seedsText: { fontSize: 18, fontWeight: '800', color: colors.ink },
  page: { padding: 20, gap: 16, paddingBottom: 48 },
  garden: {
    minHeight: 220,
    borderRadius: radius.lg,
    backgroundColor: '#BFE6A8',
    borderWidth: 4,
    borderColor: '#8FCB72',
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  planted: { fontSize: 44 },
  shop: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  item: {
    width: 96,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.line,
    borderBottomWidth: 5,
  },
  cost: { fontSize: 15, fontWeight: '800', color: colors.ink, marginTop: 4 },
});
