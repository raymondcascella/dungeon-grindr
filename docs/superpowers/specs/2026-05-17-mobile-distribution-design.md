# Dungeon Grindr — Mobile Distribution & Svelte Rewrite Design

**Date:** 2026-05-17
**Status:** Approved

## Goal

Rewrite the single-file game (`crypt-of-decisions.html`) as a Vite + Svelte project, redesigning the combat UI for mobile (all 3 action cards visible simultaneously, tap-to-stage + swipe-to-play interaction), and package it with Capacitor for Android (Play Store, immediate) and iOS (App Store, deferred until Apple developer account is obtained).

## Project Structure

```
dungeon_grindr/
  src/
    lib/
      gameData.js         ← RECRUITS, CLASS_POOLS, MONSTERS, BOSSES, EVENTS, POTIONS (extracted as-is)
      gameStore.js        ← single Svelte writable store replacing the state object
    components/
      HUD.svelte
      RecruitPhase.svelte
      DungeonPhase.svelte
      CombatTransition.svelte
      CombatPhase.svelte
      Hand.svelte
      ActionCard.svelte
      CenterSlot.svelte
      MonsterDisplay.svelte
      StartModal.svelte
      EndModal.svelte
    App.svelte            ← phase router: recruit | dungeon | combat | end
    main.js
  dist/                   ← Vite build output (Capacitor webDir)
  android/                ← generated Android Studio project
  ios/                    ← generated Xcode project (dormant until Apple account)
  capacitor.config.json
  package.json
```

Game logic is preserved intact — only the rendering layer changes. `gameStore.js` holds the same state shape as the current `state` object (phase, party, deck, gold, stamina, combat sub-object, run stats).

## App Identity

| Field        | Value                    |
|--------------|--------------------------|
| App ID       | `com.dungeongrindr.app`  |
| Display name | `Dungeon Grindr`         |
| Web dir      | `dist`                   |

The app ID must remain stable after first Play Store upload — changing it requires a new listing.

## Combat UI Layout

The combat screen is visually distinct from the dungeon crawl — dark crimson background (`--blood: #8b1a1a`) with a dark vignette, replacing the parchment palette used in crawl and recruit phases.

```
┌─────────────────────────┐
│  HUD: HP · Stamina · Gold│
├─────────────────────────┤
│                         │
│   [Monster Display]     │  ← enemy name, HP bar, icon
│                         │
├─────────────────────────┤
│                         │
│   [ Center Slot ]       │  ← staged card, swipeable L/R
│   swipe ←  →            │
│                         │
├─────────────────────────┤
│  [Card 1][Card 2][Card 3]│  ← hand, always visible, tap to stage
└─────────────────────────┘
```

### Interaction model

- All 3 party member action cards are always visible in the hand at the bottom
- Tapping a hand card slides it up to the center slot; the previously staged card (if any) slides back to the hand
- Swiping the centered card right plays it; swiping left returns it to the hand
- The monster's action card occupies the center slot on its turn — player swipes to resolve (same mechanic as current)

## Crawl → Combat Transition

Triggered when the player swipes right on a monster card in the dungeon phase. Sequence:

1. **Flash** — full-screen crimson overlay fades in (80ms) then out (200ms)
2. **Screen shake** — CSS `translate` keyframe on `#app`, 3 frames over 150ms
3. **Combat screen slides in** — combat layout slides up from the bottom (300ms ease-out)

Total duration: ~650ms. Fast enough to feel reactive, long enough to register the mode change.

## Android Delivery

1. `npm create vite@latest` with Svelte template
2. Install `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`
3. `npx cap init` with app name and ID
4. `npx cap add android`
5. Build game: `npm run build`
6. `npx cap sync`
7. Generate a signing keystore (once — losing it blocks all future Play Store updates)
8. Configure signing in `android/app/build.gradle`
9. `npm run build && npx cap sync && npx cap build android --prod` → signed AAB
10. Upload AAB to Play Console → internal testing → production

## iOS Delivery (Deferred)

`npx cap add ios` generates the Xcode project now alongside Android. When an Apple developer account is available, the remaining steps are:

1. Configure signing in Xcode (team, bundle ID, provisioning profile)
2. Archive and upload via Xcode or `xcrun altool`
3. Submit for App Store review

No rework of the Capacitor setup or game code is required at that point.

## Keystore

- Generated with `keytool` (ships with the JDK)
- Store the `.jks` file and its passwords outside the repository
- Required for every future Play Store update — loss means creating a new listing

## Out of Scope

- PWA manifest / service worker
- In-app purchases, push notifications, or native plugin integrations
- CI/CD pipeline for automated builds
- Status effects, elite enemies, shop between floors (content updates are a separate effort)
