import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { useLanguage } from '@/i18n';
import { colors, font, radius } from '@/theme';

type Mode = 'checking' | 'device' | 'math';

/**
 * Asks the device owner to unlock with Face ID, Touch ID / fingerprint or the device passcode.
 * Only when the device has no screen lock at all (or on web) does it fall back to a sum a
 * 5–10 year old is unlikely to solve, so a parent is never locked out of their own settings.
 */
export function ParentGate({ onUnlock }: { onUnlock: () => void }) {
  const { t } = useLanguage();
  // Web has no device authentication, so it starts on the sum.
  const [mode, setMode] = useState<Mode>(Platform.OS === 'web' ? 'math' : 'checking');
  const [failed, setFailed] = useState(false);

  const unlock = useCallback(async () => {
    setFailed(false);
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: t.unlockPrompt,
      cancelLabel: t.cancel,
      // Keep the system passcode fallback: no biometrics enrolled still means "device password".
      disableDeviceFallback: false,
    });
    if (result.success) onUnlock();
    else if (result.error === 'not_enrolled' || result.error === 'passcode_not_set') setMode('math');
    else setFailed(result.error !== 'user_cancel' && result.error !== 'system_cancel' && result.error !== 'app_cancel');
  }, [t, onUnlock]);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    LocalAuthentication.getEnrolledLevelAsync()
      .then((level) => {
        if (level === LocalAuthentication.SecurityLevel.NONE) {
          setMode('math');
        } else {
          setMode('device');
          unlock();
        }
      })
      .catch(() => setMode('math'));
    // Prompt once on open; later attempts come from the button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (mode === 'checking') {
    return (
      <SafeAreaView style={styles.gate}>
        <ActivityIndicator color={colors.forest} size="large" />
      </SafeAreaView>
    );
  }

  if (mode === 'math') return <MathGate onUnlock={onUnlock} />;

  return (
    <SafeAreaView style={styles.gate}>
      <Text style={{ fontSize: 72 }}>🔒</Text>
      <Text style={font.title}>{t.gateTitle}</Text>
      <Text style={[font.small, styles.center]}>{t.unlockHelp}</Text>
      {failed ? <Text style={styles.error}>{t.unlockFailed}</Text> : null}
      <Button label={t.unlockButton} onPress={unlock} style={{ alignSelf: 'stretch' }} />
      <Button label={t.back} variant="secondary" onPress={() => router.back()} style={{ alignSelf: 'stretch' }} />
    </SafeAreaView>
  );
}

function MathGate({ onUnlock }: { onUnlock: () => void }) {
  const { t } = useLanguage();
  const [gate] = useState(() => {
    const a = 6 + Math.floor(Math.random() * 4);
    const b = 6 + Math.floor(Math.random() * 4);
    return { question: `${a} × ${b}`, answer: String(a * b) };
  });
  const [input, setInput] = useState('');

  return (
    <SafeAreaView style={styles.gate}>
      <Text style={font.title}>{t.gateTitle}</Text>
      {Platform.OS !== 'web' ? <Text style={[font.small, styles.center]}>{t.noDeviceLock}</Text> : null}
      <Text style={font.small}>{t.gateHelp}</Text>
      <Text style={styles.question}>{gate.question} = ?</Text>
      <TextInput
        value={input}
        onChangeText={setInput}
        keyboardType="number-pad"
        style={styles.input}
        maxLength={3}
        accessibilityLabel={t.answerA11y}
        onSubmitEditing={() => input === gate.answer && onUnlock()}
      />
      <Button label={t.continue} disabled={input !== gate.answer} onPress={onUnlock} style={{ alignSelf: 'stretch' }} />
      <Button label={t.back} variant="secondary" onPress={() => router.back()} style={{ alignSelf: 'stretch' }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gate: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', gap: 16, backgroundColor: '#F4F8FB' },
  center: { textAlign: 'center' },
  error: { fontSize: 15, fontWeight: '700', color: colors.berry, textAlign: 'center' },
  question: { fontSize: 44, fontWeight: '900', color: colors.ink, marginVertical: 8 },
  input: {
    alignSelf: 'stretch',
    fontSize: 32,
    textAlign: 'center',
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
});
