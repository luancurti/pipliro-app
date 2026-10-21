import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, radius } from '@/theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'sun';
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = 'primary', disabled, style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        disabled && styles.disabled,
        pressed && { transform: [{ scale: 0.97 }] },
        style,
      ]}
    >
      <Text style={[styles.label, variant === 'secondary' && { color: colors.forest }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 58,
    borderRadius: radius.md,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 5,
  },
  primary: { backgroundColor: colors.forest, borderBottomColor: colors.forestDark },
  sun: { backgroundColor: '#F2A900', borderBottomColor: '#B57F00' },
  secondary: { backgroundColor: colors.card, borderBottomColor: colors.line, borderWidth: 2, borderColor: colors.line },
  disabled: { opacity: 0.45 },
  label: { color: 'white', fontSize: 19, fontWeight: '800' },
});
