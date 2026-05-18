# Crypt of Decisions

A swipe-based dungeon crawler card game. Single HTML file, no build step, no dependencies.

## Running it locally

Just open `dungeon-grindr.html` in any modern browser (Chrome, Safari, Firefox, Edge). It runs offline once the Google Fonts have loaded once.

## What's in the file

- **HTML** — app shell, modals, card containers
- **CSS** — parchment textures, blackletter typography, swipe physics, layout
- **Vanilla JavaScript** — game logic, state, swipe gesture handling via Pointer Events
- **Google Fonts** — UnifrakturCook, IM Fell English SC, Cormorant Garamond (loaded via `<link>`)

No React, no build tools, no npm. About 2,200 lines total.

## Turning it into a mobile app

You have a few paths. From easiest to most native:

### 1. Progressive Web App (PWA) — simplest

Wrap it so users can "Add to Home Screen" and it runs full-screen, offline, like a native app. You need to add:

- A `manifest.json` next to the HTML with `name`, `icons`, `start_url`, `display: "standalone"`, `theme_color: "#0a0805"`, `background_color: "#0a0805"`
- A `<link rel="manifest" href="manifest.json">` in the HTML head
- A service worker (~30 lines) that caches the HTML and fonts so it works offline
- App icons (192x192 and 512x512 PNGs)

Host it on any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages — all free). Users visit the URL once and tap "Add to Home Screen" on iOS or Android.

### 2. Capacitor — real app store distribution

[Capacitor](https://capacitorjs.com/) wraps your web app in a native iOS/Android shell. Roughly:

```bash
npm install -g @capacitor/cli
npx cap init "Crypt of Decisions" com.yourname.crypt
mkdir www && cp dungeon-grindr.html www/index.html
npx cap add ios
npx cap add android
npx cap copy
npx cap open ios     # opens Xcode
npx cap open android # opens Android Studio
```

From there you build/sign and submit to App Store / Play Store. You'll need an Apple Developer account ($99/yr) for iOS.

### 3. Tauri / Electron — desktop apps

Same idea but for Mac/Windows/Linux. Tauri is much lighter (~3MB output vs Electron's ~100MB).

## Code that may need adjusting for native

A few things are tuned for browser/web:

- **Fonts** are loaded from `fonts.googleapis.com`. For offline-first or app-store builds, download the .woff2 files and host them locally, then update the `@font-face` declarations.
- **Touch handling** uses Pointer Events which work fine in webviews, but on iOS you may want to disable the system swipe-back gesture so it doesn't conflict with left-swipes. In Capacitor, add `<preference name="SwipeGestureEnabled" value="false" />` to the iOS config.
- **No persistence**: the game has no save state — each session starts fresh. For a real mobile app you'd want to save runs/stats to `localStorage` or Capacitor Preferences.
- **No audio**: add sound effects with the Web Audio API if you want polish.

## Game systems already built

- 12 recruitable classes, each with a 5-card combat deck (3 attacks, 1 block, 1 special)
- 11 monsters across 3 tiers + 3 bosses
- 7 treasure types including short/long rest mechanics
- 8 random events with success/fail outcomes
- 4 potion types
- Card-based combat: pick 1 of 3 player cards per round, monster telegraphs its move
- 3 floors with escalating difficulty, boss on floor 3
- Run summary on win or wipe

## Possible next features

- `localStorage` save state and run history
- Shop card between floors (spend gold for permanent upgrades)
- Class synergies (Cleric heals at floor end, Necromancer revives a fallen ally)
- Status effects (poison, burn, regen)
- Elite enemies on floor 2
- Multiple bosses unlocked by completing runs
- Achievements / unlock rare classes by completing runs with specific party compositions
- Sound and music
- Haptic feedback on swipe (Capacitor Haptics plugin)
