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
