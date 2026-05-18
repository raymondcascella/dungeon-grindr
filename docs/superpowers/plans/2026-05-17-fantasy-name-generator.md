# Fantasy Name Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate a class-aware random fantasy name for each recruit every run, using syllable assembly + optional epithets, with the existing hardcoded name as fallback.

**Architecture:** Add `NAME_DATA` constant to the GAME DATA section and `generateName(cls)` to the UTILS section of `crypt-of-decisions.html`. Wire it into `buildRecruitDeck()` so each recruit card gets a fresh name each run without mutating the source `RECRUITS` array.

**Tech Stack:** Vanilla JS, single HTML file, no build step.

---

### Task 1: Add NAME_DATA constant

**Files:**
- Modify: `crypt-of-decisions.html` — add after line 985 (end of `RECRUITS` array, before `CLASS ACTION POOLS` comment)

- [ ] **Step 1: Open `crypt-of-decisions.html` and locate the insertion point**

Find the line that reads:
```js
];
// =========================================================================
// CLASS ACTION POOLS
```
This is the end of the `RECRUITS` array at approximately line 985. Insert the `NAME_DATA` block between the closing `];` and the `CLASS ACTION POOLS` comment.

- [ ] **Step 2: Insert NAME_DATA after the RECRUITS closing bracket**

```js
// =========================================================================
// NAME GENERATOR DATA — pre/mid/suf syllable pools + epithets per class
// epChance: 0–1 probability of appending " the <epithet>"
// =========================================================================

const NAME_DATA = {
  Knight: {
    pre: ['Ald', 'Helm', 'Brun', 'Var', 'Ulf'],
    mid: ['gar', 'dric', 'win', 'mar', 'ric'],
    suf: ['helm', 'wyn', 'ar', 'mund', 'ric'],
    ep:  ['the Unyielding', 'the Iron', 'the Last', 'the Steadfast', 'the Unbroken'],
    epChance: 0.6,
  },
  Ranger: {
    pre: ['Ys', 'Bray', 'Fen', 'Wil', 'Ash'],
    mid: ['ol', 'der', 'ow', 'en', 'mar'],
    suf: ['de', 'wick', 'shaw', 'ford', 'fen'],
    ep:  ['the Swift', 'the Silent', 'the Far-Eyed', 'the Keen', 'the Trackless'],
    epChance: 0.6,
  },
  Sorcerer: {
    pre: ['Mag', 'Vel', 'Sor', 'Ael', 'Zyn'],
    mid: ['ist', 'or', 'el', 'ar', 'iv'],
    suf: ['us', 'ix', 'ael', 'en', 'var'],
    ep:  ['the Arcane', 'the Unbound', 'the Veilwalker', 'the Learned', 'the Fell'],
    epChance: 0.6,
  },
  Rogue: {
    pre: ['Cut', 'Slim', 'Jin', 'Pex', 'Brak'],
    mid: ['pur', 'ny', 'sli', 'wick', 'nar'],
    suf: ['se', 'blade', 'finger', 'hook', 'eye'],
    ep:  ['the Quick', 'the Unseen', 'the Light-Fingered', 'the Crooked', 'the Fleet'],
    epChance: 0.6,
  },
  Cleric: {
    pre: ['Bro', 'Ald', 'Ser', 'Dom', 'Ben'],
    mid: ['ther', 'ric', 'dic', 'van', 'mund'],
    suf: ['ius', 'ric', 'as', 'us', 'an'],
    ep:  ['the Devout', 'the Penitent', 'the Merciful', 'the Stern', 'the Ordained'],
    epChance: 0.6,
  },
  Berserker: {
    pre: ['Hro', 'Ulf', 'Bjor', 'Tor', 'Grim'],
    mid: ['thgar', 'mund', 'nar', 'kel', 'var'],
    suf: ['n', 'ar', 'ulf', 'gar', 'or'],
    ep:  ['the Bloody', 'the Mad', 'the Unbroken', 'the Ravager', 'the Howling'],
    epChance: 0.6,
  },
  Bard: {
    pre: ['Ael', 'Tav', 'Ori', 'Sil', 'Mel'],
    mid: ['ov', 'el', 'ar', 'iv', 'an'],
    suf: ['i', 'wyn', 'ara', 'el', 'is'],
    ep:  ['the Bright', 'the Merry', 'the Loquacious', 'the Tuneful', 'the Shameless'],
    epChance: 0.25,
  },
  Druid: {
    pre: ['Old', 'Mun', 'Bri', 'Wyn', 'Ern'],
    mid: ['go', 'ath', 'wyn', 'oak', 'fen'],
    suf: ['wood', 'moss', 'bark', 'root', 'mere'],
    ep:  ['the Ancient', 'the Green', 'the Rootbound', 'the Unshorn', 'the Earthen'],
    epChance: 0.6,
  },
  Alchemist: {
    pre: ['Pev', 'Cor', 'Sal', 'Hex', 'Mer'],
    mid: ['ra', 'cu', 'vi', 'ni', 'bi'],
    suf: ['us', 'ix', 'al', 'ite', 'or'],
    ep:  ['the Pale', 'the Measured', 'the Volatile', 'the Exact', 'the Unstable'],
    epChance: 0.6,
  },
  Necromancer: {
    pre: ['Mor', 'Veth', 'Krul', 'Sev', 'Drav'],
    mid: ['ath', 'vel', 'ax', 'or', 'ul'],
    suf: ['as', 'ix', 'orn', 'eth', 'vex'],
    ep:  ['the Pallid', 'the Hollow', 'the Grave-born', 'the Undying', 'the Bleak'],
    epChance: 0.6,
  },
  Scholar: {
    pre: ['Fel', 'Osw', 'Gal', 'Per', 'Cor'],
    mid: ['ix', 'vin', 'ot', 'mund', 'win'],
    suf: ['us', 'ey', 'ick', 'in', 'ot'],
    ep:  ['the Lost', 'the Obscure', 'the Footnoted', 'the Pedantic', 'the Forgotten'],
    epChance: 0.25,
  },
  Assassin: {
    pre: ['Veil', 'Shad', 'Nox', 'Sil', 'Mir'],
    mid: ['ed', 'ow', 'en', 'ith', 'al'],
    suf: ['ra', 'yn', 'ex', 'is', 'ar'],
    ep:  ['the Unseen', 'the Silent', 'the Faceless', 'the Last Breath', 'the Still'],
    epChance: 0.6,
  },
};
```

- [ ] **Step 3: Commit**

```bash
git add crypt-of-decisions.html
git commit -m "feat: add NAME_DATA syllable pools for all 12 classes"
```

---

### Task 2: Add generateName function

**Files:**
- Modify: `crypt-of-decisions.html` — add to UTILS section, before `spawnFloater` (approximately line 2214)

- [ ] **Step 1: Find the UTILS insertion point**

Search for `function spawnFloater` (line ~2214). Insert `generateName` immediately before it.

- [ ] **Step 2: Insert the function**

```js
function generateName(cls) {
  const d = NAME_DATA[cls];
  if (!d) throw new Error('Unknown class: ' + cls);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const useMid = Math.random() < 0.5;
  const useEp  = Math.random() < d.epChance;
  let name = pick(d.pre) + (useMid ? pick(d.mid) : '') + pick(d.suf);
  if (useEp) name += ' ' + pick(d.ep);
  return name;
}
```

- [ ] **Step 3: Commit**

```bash
git add crypt-of-decisions.html
git commit -m "feat: add generateName(cls) utility function"
```

---

### Task 3: Wire generateName into buildRecruitDeck

**Files:**
- Modify: `crypt-of-decisions.html:1191-1198` — `buildRecruitDeck` function

- [ ] **Step 1: Locate buildRecruitDeck**

Find this block (line ~1191):

```js
function buildRecruitDeck() {
  const shuffled = [...RECRUITS].sort(() => Math.random() - 0.5);
  state.deck = shuffled.slice(0, state.maxRecruits).map(r => ({
    type: 'recruit',
    ...r,
    currentHp: r.hp,
  }));
}
```

- [ ] **Step 2: Replace with name-generating version**

```js
function buildRecruitDeck() {
  const shuffled = [...RECRUITS].sort(() => Math.random() - 0.5);
  state.deck = shuffled.slice(0, state.maxRecruits).map(r => {
    let name = r.name;
    try { name = generateName(r.cls); } catch (_) {}
    return { type: 'recruit', ...r, name, currentHp: r.hp };
  });
}
```

The `try/catch` keeps the hardcoded name as fallback if `generateName` throws (e.g. unknown class).

- [ ] **Step 3: Open `crypt-of-decisions.html` in a browser and start a new game**

Verify:
- Recruit cards show generated names (not "Brunhilde", "Ysolde", etc.)
- Names feel class-appropriate (Necromancer gets dark names, Bard gets melodic ones)
- Start another new game — names should be different from the previous run
- Accepted recruits display their generated name in the party HUD and in combat log messages like `✦ Morthix the Pallid the Necromancer joins the party ✦`

- [ ] **Step 4: Commit**

```bash
git add crypt-of-decisions.html
git commit -m "feat: wire fantasy name generator into recruit deck — names refresh each run"
```
