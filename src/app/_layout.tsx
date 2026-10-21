import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LanguageProvider, useLanguage } from '@/i18n';
import { ProgressProvider, useProgress } from '@/state/progress';
import { colors } from '@/theme';

// Keep Pip on the splash until saved progress and language are read, so there's no flash of the wrong screen.
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 300, fade: true });

function HideSplashWhenReady() {
  const { loaded } = useProgress();
  const { loaded: languageLoaded } = useLanguage();
  useEffect(() => {
    if (loaded && languageLoaded) SplashScreen.hide();
  }, [loaded, languageLoaded]);
  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ProgressProvider>
          <HideSplashWhenReady />
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.meadow } }}>
            <Stack.Screen name="mission/[id]" options={{ gestureEnabled: false, animation: 'fade_from_bottom' }} />
            <Stack.Screen name="parents" options={{ presentation: 'modal' }} />
          </Stack>
        </ProgressProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
