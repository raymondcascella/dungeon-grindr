import { writable } from 'svelte/store';

const { subscribe, set, update } = writable({ phase: 'start' });

export const game = { subscribe, set, update, newGame: () => {} };
