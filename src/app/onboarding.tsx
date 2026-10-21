import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { LanguagePicker } from '@/components/LanguagePicker';
import { PATHS, PathId } from '@/data/paths';
import { useLanguage } from '@/i18n';
import { useSpeak } from '@/lib/speech';
import { useProgress } from '@/state/progress';
import { colors, font, PIP, radius } from '@/theme';

const AVATARS = ['🦊', '🐼', '🐯', '🐨', '🐸', '🦄', '🐵', '🐧'];

export default function Onboarding() {
  const { createProfile } = useProgress();
  const { t } = useLanguage();
  const speak = useSpeak();
  const [stage, setStage] = useState<'hello' | 'avatar' | 'path'>('hello');
  const [avatar, setAvatar] = useState<string>();

  // Pip always speaks English: hearing it is the point of the game.
  useEffect(() => {
    if (stage === 'hello') speak('Hello! I am Pip. Welcome to the Magic Forest!');
    if (stage === 'avatar') speak('Choose your friend!');
  }, [stage, speak]);

  const finish = (path: PathId) => {
    if (!avatar) return;
    createProfile({ avatar, path });
    router.replace('/world');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.page}>
        {stage === 'hello' && (
          <View style={styles.center}>
            <Text style={{ fontSize: 120 }}>{PIP}</Text>
            <Text style={styles.brand}>Pipliro</Text>
            <Text style={styles.tagline}>{t.tagline}</Text>
            <Text style={styles.intro}>{t.worldIntro}</Text>
            <Button label={t.letsGo} onPress={() => setStage('avatar')} style={{ alignSelf: 'stretch' }} />
            <View style={styles.language}>
              <Text style={font.small}>{t.language}</Text>
              <LanguagePicker />
            </View>
          </View>
        )}

        {stage === 'avatar' && (
          <View style={styles.center}>
            <Text style={font.title}>{t.chooseFriend}</Text>
            <View style={styles.avatars}>
              {AVATARS.map((a) => (
                <Pressable
                  key={a}
                  accessibilityRole="button"
                  onPress={() => setAvatar(a)}
                  style={[styles.avatar, avatar === a && styles.avatarOn]}
                >
                  <Text style={{ fontSize: 52 }}>{a}</Text>
                </Pressable>
              ))}
            </View>
            <Button label={t.next} disabled={!avatar} onPress={() => setStage('path')} style={{ alignSelf: 'stretch' }} />
          </View>
        )}

        {stage === 'path' && (
          <View style={{ gap: 16 }}>
            <Text style={styles.parentTag}>{t.forGrownUp}</Text>
            <Text style={font.title}>{t.pickPath}</Text>
            <Text style={font.small}>{t.pickPathHelp}</Text>
            {PATHS.map((p) => (
              <Pressable key={p.id} accessibilityRole="button" onPress={() => finish(p.id)} style={styles.path}>
                <Text style={{ fontSize: 44 }}>{p.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={font.heading}>{t.paths[p.id].name}</Text>
                  <Text style={styles.pathAges}>{t.ages(p.ages)}</Text>
                  <Text style={font.small}>{t.paths[p.id].description}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  center: { alignItems: 'center', gap: 18 },
  brand: { fontSize: 48, fontWeight: '900', color: colors.forest, letterSpacing: 1 },
  tagline: { fontSize: 18, fontWeight: '700', color: colors.muted, textAlign: 'center' },
  intro: { ...font.body, textAlign: 'center', marginVertical: 12 },
  language: { alignItems: 'center', gap: 8, marginTop: 16 },
  avatars: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginVertical: 12 },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 4,
    borderColor: colors.line,
  },
  avatarOn: { borderColor: colors.sun, backgroundColor: colors.sunSoft, transform: [{ scale: 1.08 }] },
  parentTag: { alignSelf: 'flex-start', fontSize: 13, fontWeight: '800', color: colors.sky, textTransform: 'uppercase' },
  path: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    padding: 16,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.line,
    borderBottomWidth: 5,
  },
  pathAges: { fontSize: 14, fontWeight: '700', color: colors.forest },
});
