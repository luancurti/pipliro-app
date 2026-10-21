import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { DEFAULT_LANGUAGE, Language, LANGUAGES, STRINGS, Strings } from './strings';

export { LANGUAGES, type Language } from './strings';

// Kept apart from learning progress so "Delete all progress" doesn't switch the language back.
const STORAGE_KEY = 'settings:language';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Strings;
  loaded: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const isLanguage = (value: string | null): value is Language => LANGUAGES.some((l) => l.id === value);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => isLanguage(saved) && setLanguageState(saved))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const value = useMemo(() => ({ language, setLanguage, t: STRINGS[language], loaded }), [language, setLanguage, loaded]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}

/** Mission title and theme in the interface language, falling back to the curriculum's English. */
export function useMissionText() {
  const { t } = useLanguage();
  return (mission: { id: string; title: string; theme: string }) => t.missions?.[mission.id] ?? mission;
}
