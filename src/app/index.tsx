import { Redirect } from 'expo-router';

import { useLanguage } from '@/i18n';
import { useProgress } from '@/state/progress';

export default function Index() {
  const { progress, loaded } = useProgress();
  const { loaded: languageLoaded } = useLanguage();
  // The splash screen stays up until both are loaded (see _layout.tsx).
  if (!loaded || !languageLoaded) return null;
  return <Redirect href={progress.profile ? '/world' : '/onboarding'} />;
}
