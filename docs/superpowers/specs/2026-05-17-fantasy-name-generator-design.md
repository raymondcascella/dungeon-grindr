# Fantasy Name Generator — Design Spec

**Date:** 2026-05-17

## Summary

Each recruit gets a randomly generated fantasy name on game start instead of a fixed name. Names are class-aware (tone, syllables, and epithets vary by class). The existing hardcoded recruit names serve as fallbacks.

---

## Architecture

A single `generateName(cls)` function added to the `UTILS` section of `crypt-of-decisions.html`. It reads from a `NAME_DATA` constant defined in the `GAME DATA` section. No new files, no dependencies.

Called once per recruit when building the recruit list at game start. Result replaces the `name` field on each recruit object. If generation throws for any reason, the original hardcoded name is used as fallback.

---

## Name Structure

```
[prefix] + [middle (~50% chance)] + [suffix] + [" the " + epithet (epChance %)]
```

Examples:
- `Aldwyn` (prefix + suffix, no middle, no epithet)
- `Aldgarwyn the Unyielding` (prefix + middle + suffix + epithet)
- `Vethix` (Necromancer, short form)
- `Morthvelorn the Hollow` (Necromancer, long form)

---

## Data Structure

```js
const NAME_DATA = {
  ClassName: {
    pre: ['', '', '', '', ''],   // 5 prefixes
    mid: ['', '', '', '', ''],   // 5 middles
    suf: ['', '', '', '', ''],   // 5 suffixes
    ep:  ['', '', '', '', ''],   // 5 epithets
    epChance: 0.6,               // 0.0–1.0
  }
}
```

One entry per class. `epChance` is 0.6 for most classes, 0.25 for Bard and Scholar.

---

## Class Tones & Syllable Direction

| Class | Tone | epChance |
|-------|------|----------|
| Knight | Strong, Germanic — hard consonants, heavy endings | 0.6 |
| Ranger | Earthy, sharp — short syllables, natural consonants | 0.6 |
| Sorcerer | Arcane, flowing — soft vowels, arcane suffixes | 0.6 |
| Rogue | Clipped, street-edged — short, punchy syllables | 0.6 |
| Cleric | Liturgical, heavy — Latin-adjacent, weighty endings | 0.6 |
| Berserker | Brutal, Norse — harsh clusters, guttural stops | 0.6 |
| Bard | Melodic, light — flowing vowels, light endings | 0.25 |
| Druid | Natural, old — earthy, archaic feeling | 0.6 |
| Alchemist | Clinical, precise — slightly foreign, exact | 0.6 |
| Necromancer | Dark, hollow — hard stops, ominous resonance | 0.6 |
| Scholar | Dry, bookish — soft, slightly forgettable | 0.25 |
| Assassin | Short, shadowed — minimal syllables, sibilants | 0.6 |

---

## generateName Function

```js
function generateName(cls) {
  const d = NAME_DATA[cls];
  if (!d) throw new Error('Unknown class');
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const useMid = Math.random() < 0.5;
  const useEp  = Math.random() < d.epChance;
  let name = pick(d.pre) + (useMid ? pick(d.mid) : '') + pick(d.suf);
  if (useEp) name += ' the ' + pick(d.ep);
  return name;
}
```

---

## Integration Point

In the `RECRUITS` array definition, the `name` field remains as the fallback. At game start (before shuffling), each recruit's name is replaced:

```js
RECRUITS.forEach(r => {
  try { r.name = generateName(r.cls); }
  catch (_) { /* keep original name */ }
});
```

This runs once per page load, so names reset each run.

---

## Out of Scope

- Persistent name memory across runs
- Player-editable names
- Names for monsters or bosses
- Names influenced by HP/ATK stats