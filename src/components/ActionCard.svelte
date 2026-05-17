<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let card;
  export let staged = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="action-card {card.kind} {staged ? 'staged' : ''}" on:click={() => dispatch('tap', card)}>
  <div class="owner-icon">{card.ownerIcon}</div>
  <div class="card-name">{card.name}</div>
  <div class="card-kind">{card.kind}</div>
  {#if card.dmg}<div class="card-stat">ATK {card.dmg}</div>{/if}
  {#if card.block}<div class="card-stat">BLK {card.block}</div>{/if}
  {#if card.heal}<div class="card-stat">+{card.heal} HP</div>{/if}
  {#if card.cost}<div class="card-cost">⚡{card.cost}</div>{/if}
</div>

<style>
  .action-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 8px;
    border: 1px solid var(--ink-faint, #5a4a3a);
    border-radius: 8px;
    background: var(--parchment, #f5e6c8);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    min-width: 72px;
    text-align: center;
    user-select: none;
  }
  .action-card:active { transform: scale(0.95); }
  .action-card.staged {
    border-color: var(--gold, #c9a84c);
    box-shadow: 0 0 12px rgba(201,168,76,0.5);
    transform: translateY(-4px);
  }
  .action-card.attack { border-top: 3px solid var(--blood, #8b1a1a); }
  .action-card.block  { border-top: 3px solid var(--moss, #5a7a3a); }
  .action-card.special{ border-top: 3px solid var(--gold, #c9a84c); }
  .owner-icon { font-size: 1.4rem; }
  .card-name { font-size: 0.7rem; font-family: var(--font-display, serif); letter-spacing: 0.05em; }
  .card-kind { font-size: 0.6rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.08em; }
  .card-stat { font-size: 0.75rem; font-weight: bold; }
  .card-cost { font-size: 0.65rem; color: var(--gold, #c9a84c); }
</style>
