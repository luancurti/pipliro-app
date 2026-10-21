# Pipliro

*Play a world. Learn a language.*

A mobile adventure game where children aged 5–10 learn English by playing in **The Magic Forest**. This is the Phase 1 playable slice from the product roadmap: one world, a data-driven mission engine, rewards, progress saving and a basic parent area.

## Run it

Expo SDK 58 needs Node 22.13+ (`.nvmrc` pins 22).

```bash
nvm use
npm install
npm run web      # or: npm run ios / npm run android
```

`npm run typecheck` and `npm run lint` must pass before shipping.

### Native build (outside Expo Go)

```bash
npx expo run:ios --configuration Release       # standalone app on the simulator, JS bundled in
npx expo run:android --variant release
```

`ios/` and `android/` are generated from `app.json` (Continuous Native Generation) and git-ignored; never edit them by hand. Only a Release build shows the real splash screen — Expo Go shows its own.

### Icon and splash

Pip is drawn in code by `scripts/generate-assets.py` (Pillow), which writes `assets/icon.png`, the Android adaptive icon layers, `splash-icon.png` and `favicon.png`. Edit the script and re-run `python3 scripts/generate-assets.py`, then rebuild. The splash is configured by the `expo-splash-screen` plugin in `app.json` and stays up until saved progress and language have loaded (`src/app/_layout.tsx`).

## What's in the slice

| Roadmap item | Where |
|---|---|
| Character creation (avatar only, no child name) | `src/app/onboarding.tsx` |
| Three learning paths (Little Explorers, World Adventurers, Language Heroes) | `src/data/paths.ts` — speech speed and on-screen text adapt per path |
| Living World / Quest Puzzles / Talk to the Characters | `src/components/steps/` — `find`, `choose` (with basket), `build` (sentence), `speak` (guided) |
| 8 missions, ~45 core words, including *The Missing Ingredients* | `src/data/missions.ts`, `src/data/words.ts` |
| Daily Review of the weakest words | `buildReviewMission` in `src/data/missions.ts` |
| My World: golden seeds → garden | `src/app/garden.tsx` |
| Parent dashboard behind a grown-up check | `src/app/parents.tsx` |
| Offline progress | `src/state/progress.tsx` (AsyncStorage, on device only) |

Adding a mission is a data change: append to `MISSIONS` using words from `WORDS`.

## Languages

The interface (menus, buttons, mission titles, parent area) defaults to **Portuguese** and can be switched to **English** or **Spanish** on the welcome screen or in the parent area. The choice is saved on the device, separately from learning progress. What the child hears and learns — Pip's voice, prompts, words and sentences — always stays in English.

Strings live in `src/i18n/strings.ts`; the `pt` object is the source of truth for keys, and `en`/`es` must match it (TypeScript enforces this). The parent area shows each English word's meaning in the chosen language (`pt`/`es` fields in `src/data/words.ts`).

## Deliberate MVP shortcuts

- **Voice**: device text-to-speech (`expo-speech`, en-US) stands in for recorded native-speaker audio. Swap the implementation of `useSpeak` in `src/lib/speech.ts` when recordings exist.
- **Speaking**: guided only. The child answers aloud and taps "I said it!"; the microphone is never used and nothing is recorded.
- **No backend yet**: Supabase accounts and sync come after the family beta.

## Naming

The bundle identifier (`com.luancurti.englishadventure`) is deliberately not tied to the brand, so a rename after trademark and store checks only touches `app.json` `name`, the onboarding title and copy. Replace it with a reverse-domain id for a domain you own before the first store upload.
