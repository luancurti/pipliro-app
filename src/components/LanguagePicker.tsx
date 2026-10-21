import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LANGUAGES, useLanguage } from '@/i18n';
import { colors, radius } from '@/theme';

export function LanguagePicker() {
  const { language, setLanguage } = useLanguage();
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {LANGUAGES.map((l) => {
        const on = l.id === language;
        return (
          <Pressable
            key={l.id}
            accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            accessibilityLabel={l.label}
            onPress={() => setLanguage(l.id)}
            style={[styles.pill, on && styles.pillOn]}
          >
            <Text style={styles.flag}>{l.flag}</Text>
            <Text style={[styles.label, on && styles.labelOn]}>{l.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  pillOn: { borderColor: colors.forest, backgroundColor: colors.meadow },
  flag: { fontSize: 18 },
  label: { fontSize: 15, fontWeight: '700', color: colors.muted },
  labelOn: { color: colors.forest },
});
