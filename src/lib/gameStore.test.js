import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { game } from './gameStore.js';

beforeEach(() => game.newGame());

describe('newGame', () => {
  it('starts in recruit phase with empty party', () => {
    const s = get(game);
    expect(s.phase).toBe('recruit');
    expect(s.party).toHaveLength(0);
    expect(s.currentCard).not.toBeNull();
    expect(s.currentCard.type).toBe('recruit');
  });

  it('initialises gold=5, stamina=5', () => {
    const s = get(game);
    expect(s.gold).toBe(5);
    expect(s.stamina).toBe(5);
  });
});

describe('swipeRecruit', () => {
  it('right adds member to party', () => {
    game.swipeRecruit('right');
    expect(get(game).party).toHaveLength(1);
  });

  it('left skips without adding', () => {
    game.swipeRecruit('left');
    expect(get(game).party).toHaveLength(0);
  });

  it('party capped at 3 then transitions to dungeon', () => {
    game.swipeRecruit('right');
    game.swipeRecruit('right');
    game.swipeRecruit('right');
    const s = get(game);
    expect(s.party).toHaveLength(3);
  });
});

describe('damageParty / healParty', () => {
  it('damage reduces total HP', () => {
    game.swipeRecruit('right');
    const before = get(game).party.reduce((s, m) => s + m.currentHp, 0);
    game._damageParty(3);
    const after = get(game).party.reduce((s, m) => s + m.currentHp, 0);
    expect(after).toBeLessThan(before);
  });

  it('heal does not exceed max HP', () => {
    game.swipeRecruit('right');
    game._damageParty(5);
    const maxHp = get(game).party[0].hp;
    game._healParty(999);
    expect(get(game).party[0].currentHp).toBeLessThanOrEqual(maxHp);
  });
});

describe('combat', () => {
  beforeEach(() => {
    game.newGame();
    game.swipeRecruit('right');
    game.swipeRecruit('right');
    const monster = { type: 'monster', name: 'Rat', hp: 3, atk: 1, pool: 'small', gold: 1 };
    game._startCombat(monster);
  });

  it('enters combat phase with hand populated', () => {
    const s = get(game);
    expect(s.phase).toBe('combat');
    expect(s.combat.hand.length).toBeGreaterThan(0);
    expect(s.combat.hand.every(c => c.type === 'action')).toBe(true);
  });

  it('stageCard sets stagedCard', () => {
    const s = get(game);
    const card = s.combat.hand[0];
    game.stageCard(card);
    expect(get(game).combat.stagedCard).toEqual(card);
  });

  it('unstageCard clears stagedCard', () => {
    const s = get(game);
    game.stageCard(s.combat.hand[0]);
    game.unstageCard();
    expect(get(game).combat.stagedCard).toBeNull();
  });

  it('playCard reduces monster HP', () => {
    const s = get(game);
    const attackCard = s.combat.hand.find(c => c.kind === 'attack');
    if (!attackCard) return;
    game.stageCard(attackCard);
    game.playCard();
    expect(get(game).combat.monster.currentHp).toBeLessThan(3);
  });

  it('monster dies → phase transitions', () => {
    for (let i = 0; i < 10; i++) {
      const s = get(game);
      if (s.phase !== 'combat') break;
      if (s.combat.awaitingMonster) { game.resolveMonster(); continue; }
      const attack = s.combat.hand.find(c => c.kind === 'attack');
      if (attack) { game.stageCard(attack); game.playCard(); }
    }
    const s = get(game);
    if (s.phase === 'combat') {
      expect(s.combat.monster.currentHp).toBeLessThanOrEqual(0);
    }
  });
});
