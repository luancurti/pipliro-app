import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useLanguage } from '@/i18n';
import { colors, PIP, radius } from '@/theme';

type Props = {
  text: string;
  showText: boolean;
  onReplay: () => void;
  character?: string;
};

/** Pip's speech bubble. Younger paths hide the text and rely on audio plus the replay button. */
export function PipPrompt({ text, showText, onReplay, character = PIP }: Props) {
  const { t } = useLanguage();
  return (
    <View style={styles.row}>
      <Text style={styles.character}>{character}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={t.listenAgainA11y(text)} onPress={onReplay} style={styles.bubble}>
        <Text style={styles.speaker}>🔊</Text>
        {showText ? <Text style={styles.text}>{text}</Text> : <Text style={styles.listen}>{t.listen}</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  character: { fontSize: 56 },
  bubble: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    borderWidth: 3,
    borderColor: colors.sun,
  },
  speaker: { fontSize: 28 },
  text: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.ink },
  listen: { flex: 1, fontSize: 22, fontWeight: '800', color: colors.muted },
});
