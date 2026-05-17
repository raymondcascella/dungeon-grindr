import { writable } from 'svelte/store';
import { RECRUITS, CLASS_POOLS, MONSTER_POOLS, ENCOUNTERS } from './gameData.js';

function createGameStore() {
  const { subscribe, set, update } = writable(makeInitialState());

  function makeInitialState() {
    return {
      phase: 'start',
      party: [],
      maxPartyHp: 0,
      stamina: 5,
      maxStamina: 5,
      gold: 5,
      floor: 0,
      floorProgress: 0,
      floorLength: 0,
      deck: [],
      currentCard: null,
      recruitsShown: 0,
      maxRecruits: 8,
      stats: { kills: 0, fled: 0, fellComrades: 0 },
      combat: null,
      pendingCombat: null,
      victory: false,
      log: '',
      floaters: [],
    };
  }

  function _shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function _buildRecruitDeck(s) {
    const shuffled = _shuffle(RECRUITS).slice(0, s.maxRecruits);
    s.deck = shuffled.map(r => ({ type: 'recruit', ...r, currentHp: r.hp }));
  }

  function _buildFloorDeck(s, floor) {
    const tier = Math.min(floor, 3);
    const pool = [];
    const mons = ENCOUNTERS.monsters.filter(m => m.tier <= tier);
    for (let i = 0; i < 3 + floor; i++) pool.push({ type: 'monster', ...mons[Math.floor(Math.random() * mons.length)] });
    for (let i = 0; i < 2; i++) pool.push({ type: 'treasure', ...ENCOUNTERS.treasures[Math.floor(Math.random() * ENCOUNTERS.treasures.length)] });
    for (let i = 0; i < 2; i++) pool.push({ type: 'potion', ...ENCOUNTERS.potions[Math.floor(Math.random() * ENCOUNTERS.potions.length)] });
    for (let i = 0; i < 2; i++) pool.push({ type: 'event', ...ENCOUNTERS.events[Math.floor(Math.random() * ENCOUNTERS.events.length)] });
    const shuffled = _shuffle(pool);
    if (floor === 3) shuffled.push({ type: 'boss', ...ENCOUNTERS.bosses[Math.floor(Math.random() * ENCOUNTERS.bosses.length)] });
    s.deck = shuffled;
    s.floorLength = shuffled.length;
    s.floorProgress = 0;
  }

  function _showLog(s, msg) { s.log = msg; }

  function _spawnFloater(s, text, kind) {
    const id = Date.now() + Math.random();
    s.floaters = [...s.floaters, { id, text, kind }];
    setTimeout(() => update(st => { st.floaters = st.floaters.filter(f => f.id !== id); return st; }), 1200);
  }

  function _damageParty(s, amount) {
    let remaining = amount;
    const alive = s.party.filter(m => m.currentHp > 0);
    if (!alive.length) return;
    while (remaining > 0 && alive.some(m => m.currentHp > 0)) {
      const target = alive[Math.floor(Math.random() * alive.length)];
      if (target.currentHp <= 0) continue;
      const hit = Math.min(target.currentHp, Math.max(1, Math.ceil(remaining / 2) + Math.floor(Math.random() * 2)));
      target.currentHp -= hit;
      remaining -= hit;
      if (target.currentHp <= 0) {
        s.stats.fellComrades++;
        _showLog(s, `☠ ${target.name} falls.`);
      }
    }
    _spawnFloater(s, `-${amount}`, 'dmg');
  }

  function _healParty(s, amount) {
    let remaining = amount;
    const alive = s.party.filter(m => m.currentHp > 0);
    if (!alive.length) return;
    while (remaining > 0 && alive.some(m => m.currentHp < m.hp)) {
      const target = alive.find(m => m.currentHp < m.hp);
      if (!target) break;
      const heal = Math.min(target.hp - target.currentHp, Math.ceil(remaining / alive.length) + 1, remaining);
      target.currentHp += heal;
      remaining -= heal;
    }
    _spawnFloater(s, `+${amount}`, 'heal');
  }

  function _checkDeath(s) {
    if (s.party.every(m => m.currentHp <= 0)) s.phase = 'end';
  }

  function _drawNext(s) {
    if (s.phase === 'recruit') {
      if (s.deck.length === 0 || s.party.length >= 3) {
        if (s.party.length >= 1) { _startFloor(s, 1); } else { _buildRecruitDeck(s); s.currentCard = s.deck.shift(); }
        return;
      }
      s.currentCard = s.deck.shift();
    } else if (s.phase === 'dungeon') {
      if (s.deck.length === 0) {
        if (s.floor >= 3) { s.phase = 'end'; s.victory = true; return; }
        const rest = Math.floor(s.maxPartyHp * 0.2);
        _healParty(s, rest);
        s.stamina = Math.min(s.maxStamina, s.stamina + 2);
        _showLog(s, `The way deepens. You rest. (+${rest} HP, +2 stamina)`);
        setTimeout(() => update(st => { _startFloor(st, st.floor + 1); return st; }), 1400);
        return;
      }
      s.currentCard = s.deck.shift();
      s.floorProgress++;
    }
  }

  function _startFloor(s, n) {
    s.phase = 'dungeon';
    s.floor = n;
    _buildFloorDeck(s, n);
    _drawNext(s);
  }

  function _doEngage(s, card) {
    switch (card.type) {
      case 'monster':
      case 'boss':
        s.phase = 'transitioning';
        s.pendingCombat = card;
        break;
      case 'treasure':
        if (card.rest === 'short') { s.stamina = Math.min(s.maxStamina, s.stamina + 1); _showLog(s, 'A short rest. +1 stamina.'); break; }
        if (card.rest === 'long') { s.stamina = s.maxStamina; const h = Math.max(1, Math.floor(s.maxPartyHp * (0.3 + Math.random() * 0.4))); _healParty(s, h); _showLog(s, `A long rest. +${h} HP.`); break; }
        if (Math.random() < 0.4 && card.dmg) { _damageParty(s, card.dmg); _showLog(s, `Trapped! -${card.dmg} HP. +${card.gold} gold.`); } else { _showLog(s, `+${card.gold} gold.`); }
        s.gold += card.gold;
        _spawnFloater(s, `+${card.gold}g`, 'gold');
        break;
      case 'potion':
        _healParty(s, card.heal);
        if (card.stamina) s.stamina = Math.min(s.maxStamina, s.stamina + card.stamina);
        _showLog(s, `The party drinks. +${card.heal} HP${card.stamina ? `, +${card.stamina} stamina` : ''}`);
        break;
      case 'event': {
        const success = Math.random() < 0.55;
        const outcome = success ? card.success : card.fail;
        if (outcome.dmg) _damageParty(s, outcome.dmg);
        if (outcome.heal) _healParty(s, outcome.heal);
        if (outcome.gold) { s.gold = Math.max(0, s.gold + outcome.gold); _spawnFloater(s, `${outcome.gold > 0 ? '+' : ''}${outcome.gold}g`, 'gold'); }
        _showLog(s, outcome.flavor);
        break;
      }
    }
  }

  return {
    subscribe,

    newGame() {
      update(s => {
        Object.assign(s, makeInitialState());
        s.phase = 'recruit';
        _buildRecruitDeck(s);
        s.currentCard = s.deck.shift();
        return s;
      });
    },

    swipeRecruit(direction) {
      update(s => {
        const card = s.currentCard;
        if (!card) return s;
        if (direction === 'right') {
          s.party.push({ ...card, currentHp: card.hp });
          s.maxPartyHp += card.hp;
          _showLog(s, `✦ ${card.name} the ${card.cls} joins the party ✦`);
        }
        s.recruitsShown++;
        _drawNext(s);
        return s;
      });
    },

    swipeDungeon(direction) {
      update(s => {
        const card = s.currentCard;
        if (!card) return s;
        if (direction === 'left') {
          if (s.stamina <= 0) { _showLog(s, 'No stamina! You must face it.'); _doEngage(s, card); }
          else {
            s.stamina--;
            s.stats.fled++;
            if ((card.type === 'monster' || card.type === 'boss') && Math.random() < 0.35) {
              const dmg = Math.max(1, Math.floor((card.atk || 4) * 0.4));
              _damageParty(s, dmg);
              _showLog(s, `${card.name} strikes as you flee! (-${dmg})`);
            } else {
              _showLog(s, `You slip past the ${card.name.toLowerCase()}.`);
            }
          }
        } else {
          _doEngage(s, card);
        }
        if (s.phase !== 'transitioning') {
          _checkDeath(s);
          if (s.phase !== 'end') _drawNext(s);
        }
        return s;
      });
    },

    enterCombat() {
      update(s => {
        const monster = s.pendingCombat;
        s.pendingCombat = null;
        s.phase = 'combat';
        s.combat = {
          monster: { ...monster, currentHp: monster.hp, isBoss: monster.type === 'boss' },
          round: 1,
          hand: [],
          stagedCard: null,
          blockThisRound: 0,
          dodgeThisRound: false,
          monsterCard: null,
          awaitingMonster: false,
          finished: false,
        };
        _drawCombatRound(s);
        return s;
      });
    },

    _damageParty(amount) { update(s => { _damageParty(s, amount); return s; }); },
    _healParty(amount) { update(s => { _healParty(s, amount); return s; }); },
  };
}

function _drawCombatRound(s) {
  const c = s.combat;
  c.blockThisRound = 0;
  c.dodgeThisRound = false;
  c.stagedCard = null;
  c.awaitingMonster = false;
  c.hand = [];
  s.party.forEach(member => {
    if (member.currentHp <= 0) return;
    const pool = CLASS_POOLS[member.cls] || CLASS_POOLS.Knight;
    const card = pool[Math.floor(Math.random() * pool.length)];
    c.hand.push({ type: 'action', ownerName: member.name, ownerCls: member.cls, ownerIcon: member.icon, ...card });
  });
  const mpool = MONSTER_POOLS[c.monster.pool] || MONSTER_POOLS.medium;
  c.monsterCard = mpool[Math.floor(Math.random() * mpool.length)];
}

export const game = createGameStore();
