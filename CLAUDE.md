# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the game

Open `dungeon-grindr.html` directly in any modern browser. No build step, no npm, no server required. Loads Google Fonts on first open; works offline after that.

## Architecture

Everything lives in a single file (`dungeon-grindr.html`) split into three sections:

**CSS (lines ~10–915)** — CSS custom properties at `:root` define the palette (`--ink`, `--parchment`, `--blood`, `--gold`, `--moss`). Layout is a single `#app` column capped at 480px. SVG-noise and radial-gradient overlays on `body::before`/`::after` create the parchment texture.

**HTML (lines ~917–966)** — Minimal shell: `#app` holds the stats bar, party display, card stack, and swipe hint labels. Two `<div class="modal">` overlays handle start and end screens.

**JavaScript (lines ~968–end)** — No framework, no modules. Organised into labelled sections:

- `GAME DATA` — `RECRUITS[]`, `CLASS_POOLS{}`, `MONSTER_POOLS{}`, `MONSTERS[]`, `BOSSES[]`, `TREASURE_CARDS[]`, `EVENTS[]`, `POTIONS[]`
- `STATE` — single mutable `state` object with phase, party, deck, gold, stamina, combat sub-object, and run stats
- `PHASES` — `state.phase` drives all logic: `'recruit'` → `'dungeon'` → `'combat'` → `'end'`
- `SWIPE / INPUT` — Pointer Events on `#stack`; `onSwipe(direction, card)` is the central dispatcher
- `COMBAT` — `startCombat()` → `drawCombatRound()` → `playActionCard()` / `resolveMonsterCard()` → `combatEndCheck()` → loop or `endGame()`
- `RENDER` — `render()` rebuilds the visible card from `state.currentCard` and updates the HUD
- `UTILS` — `damageParty()`, `healParty()`, `spawnFloater()`, `showLog()`, `drawNext()`

## Game flow summary

1. **Recruit phase**: shuffle `RECRUITS`, swipe right to add (max 3), left to skip. `startDungeon()` is called when the deck runs out or party is full.
2. **Dungeon phase**: deck of monsters/treasures/events/potions per floor. Left = flee (costs 1 stamina), right = engage. Monsters transition to combat phase.
3. **Combat phase**: each living party member draws 1 card from their `CLASS_POOLS` entry; monster draws from `MONSTER_POOLS`. Cards are presented one at a time; player swipes right to play, left to discard. Monster card is last in hand — swiping it resolves the monster's move. Rounds loop until HP hits 0.
4. **End**: `endGame(true/false)` shows the modal with run summary.

## Key data shapes

```js
// Party member (from RECRUITS + runtime fields)
{ icon, name, cls, hp, atk, flavor, currentHp, hand }

// Combat state sub-object
state.combat = { monster, round, hand[], handIndex, blockThisRound, dodgeThisRound, monsterCard, finished }

// Action card kinds: 'attack' | 'block' | 'special' | 'monsterAction'
// Dungeon card types: 'monster' | 'boss' | 'treasure' | 'event' | 'potion'
```

## Possible extensions (from README)

PWA wrapper (manifest.json + service worker), `localStorage` save state, shop between floors, status effects, elite enemies, additional bosses, haptic feedback via Capacitor. For app-store distribution use Capacitor; for desktop use Tauri.
