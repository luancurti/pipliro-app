import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius } from '@/theme';

export type TileState = 'idle' | 'correct' | 'wrong' | 'done';

type Props = {
  emoji: string;
  label?: string;
  state?: TileState;
  size?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/** A big tappable picture card with bounce/shake feedback. */
export function Tile({ emoji, label, state = 'idle', size = 96, onPress, accessibilityLabel }: Props) {
  const [anim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (state === 'wrong') {
      Animated.sequence(
        [10, -10, 8, -8, 0].map((toValue) => Animated.timing(anim, { toValue, duration: 60, useNativeDriver: true })),
      ).start();
    } else if (state === 'correct') {
      Animated.sequence([
        Animated.timing(anim, { toValue: -14, duration: 120, useNativeDriver: true }),
        Animated.spring(anim, { toValue: 0, useNativeDriver: true }),
      ]).start();
    }
  }, [state, anim]);

  const transform = state === 'wrong' ? [{ translateX: anim }] : [{ translateY: anim }];

  return (
    <Animated.View style={{ transform }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        onPress={onPress}
        disabled={state === 'done'}
        style={({ pressed }) => [
          styles.tile,
          { width: size, height: size },
          state === 'correct' && styles.correct,
          state === 'wrong' && styles.wrong,
          state === 'done' && styles.done,
          pressed && { transform: [{ scale: 0.95 }] },
        ]}
      >
        <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        {state === 'done' ? <Text style={styles.check}>✓</Text> : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.line,
    borderBottomWidth: 6,
  },
  correct: { borderColor: colors.leaf, backgroundColor: colors.meadow },
  wrong: { borderColor: colors.berry, backgroundColor: '#FDE8EA' },
  done: { borderColor: colors.leaf, backgroundColor: colors.meadow, opacity: 0.55 },
  label: { fontSize: 13, fontWeight: '700', color: colors.muted, marginTop: 2 },
  check: { position: 'absolute', top: 4, right: 8, fontSize: 18, fontWeight: '900', color: colors.forest },
});
