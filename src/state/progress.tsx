import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { PathId } from '@/data/paths';

const STORAGE_KEY = 'progress:v1';

/** No name, photo or voice is stored for the child — only an avatar and learning data. */
export type Profile = { avatar: string; path: PathId; createdAt: number };

export type WordStat = { seen: number; correct: number; wrong: number; lastSeen: number };

export type MissionResult = { stars: number; completedAt: number; plays: number };

export type Progress = {
  profile?: Profile;
  seeds: number;
  missions: Record<string, MissionResult>;
  words: Record<string, WordStat>;
  garden: string[];
  /** Day stamp (YYYY-MM-DD) of the last finished daily review. */
  lastReview?: string;
};

const EMPTY: Progress = { seeds: 0, missions: {}, words: {}, garden: [] };

type ProgressContextValue = {
  progress: Progress;
  loaded: boolean;
  createProfile: (profile: Omit<Profile, 'createdAt'>) => void;
  updatePath: (path: PathId) => void;
  recordAnswer: (wordIds: string[], correct: boolean) => void;
  completeMission: (missionId: string, stars: number) => number;
  plant: (item: string, cost: number) => boolean;
  reset: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export const today = () => new Date().toISOString().slice(0, 10);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => raw && setProgress({ ...EMPTY, ...JSON.parse(raw) }))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress)).catch(() => {});
  }, [progress, loaded]);

  const createProfile = useCallback((profile: Omit<Profile, 'createdAt'>) => {
    setProgress((p) => ({ ...p, profile: { ...profile, createdAt: Date.now() } }));
  }, []);

  const updatePath = useCallback((path: PathId) => {
    setProgress((p) => (p.profile ? { ...p, profile: { ...p.profile, path } } : p));
  }, []);

  const recordAnswer = useCallback((wordIds: string[], correct: boolean) => {
    setProgress((p) => {
      const words = { ...p.words };
      for (const id of wordIds) {
        const s = words[id] ?? { seen: 0, correct: 0, wrong: 0, lastSeen: 0 };
        words[id] = {
          seen: s.seen + 1,
          correct: s.correct + (correct ? 1 : 0),
          wrong: s.wrong + (correct ? 0 : 1),
          lastSeen: Date.now(),
        };
      }
      return { ...p, words };
    });
  }, []);

  /** Returns the golden seeds earned: one per star, but only for improving on a previous best. */
  const completeMission = useCallback(
    (missionId: string, stars: number) => {
      const best = progress.missions[missionId]?.stars ?? 0;
      const earned = missionId === 'review' ? 1 : Math.max(0, stars - best);
      setProgress((p) => {
        const prev = p.missions[missionId];
        return {
          ...p,
          seeds: p.seeds + earned,
          lastReview: missionId === 'review' ? today() : p.lastReview,
          missions: {
            ...p.missions,
            [missionId]: {
              stars: Math.max(stars, prev?.stars ?? 0),
              completedAt: Date.now(),
              plays: (prev?.plays ?? 0) + 1,
            },
          },
        };
      });
      return earned;
    },
    [progress.missions],
  );

  const plant = useCallback(
    (item: string, cost: number) => {
      if (progress.seeds < cost) return false;
      setProgress((p) => ({ ...p, seeds: p.seeds - cost, garden: [...p.garden, item] }));
      return true;
    },
    [progress.seeds],
  );

  const reset = useCallback(() => setProgress(EMPTY), []);

  const value = useMemo(
    () => ({ progress, loaded, createProfile, updatePath, recordAnswer, completeMission, plant, reset }),
    [progress, loaded, createProfile, updatePath, recordAnswer, completeMission, plant, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
