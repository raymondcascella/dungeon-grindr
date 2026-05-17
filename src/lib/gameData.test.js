import { describe, it, expect } from 'vitest';
import { RECRUITS, CLASS_POOLS, MONSTER_POOLS, ENCOUNTERS, FLOOR_NAMES } from './gameData.js';

describe('gameData', () => {
  it('has 12 recruits each with icon, name, cls, hp, atk, flavor', () => {
    expect(RECRUITS).toHaveLength(12);
    RECRUITS.forEach(r => {
      expect(r).toMatchObject({ icon: expect.any(String), name: expect.any(String), cls: expect.any(String), hp: expect.any(Number), atk: expect.any(Number) });
    });
  });

  it('has a CLASS_POOLS entry for every recruit class', () => {
    const classes = [...new Set(RECRUITS.map(r => r.cls))];
    classes.forEach(cls => expect(CLASS_POOLS[cls]).toBeDefined());
  });

  it('each CLASS_POOLS entry has exactly 5 cards', () => {
    Object.values(CLASS_POOLS).forEach(pool => expect(pool).toHaveLength(5));
  });

  it('ENCOUNTERS has monsters, treasures, potions, events, bosses arrays', () => {
    expect(ENCOUNTERS.monsters.length).toBeGreaterThan(0);
    expect(ENCOUNTERS.treasures.length).toBeGreaterThan(0);
    expect(ENCOUNTERS.potions.length).toBeGreaterThan(0);
    expect(ENCOUNTERS.events.length).toBeGreaterThan(0);
    expect(ENCOUNTERS.bosses.length).toBeGreaterThan(0);
  });

  it('FLOOR_NAMES has 4 entries', () => {
    expect(FLOOR_NAMES).toHaveLength(4);
  });
});
