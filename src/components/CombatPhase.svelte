<script>
  import { game } from '../lib/gameStore.js';
  import MonsterDisplay from './MonsterDisplay.svelte';
  import Hand from './Hand.svelte';
  import CenterSlot from './CenterSlot.svelte';

  $: c = $game.combat;

  function tapCard(card) {
    if (!c) return;
    if (c.stagedCard === card) {
      game.unstageCard();
    } else {
      game.stageCard(card);
    }
  }

  function onCenterSwipe(e) {
    if (e.detail === 'right') {
      game.playCard();
    } else {
      game.unstageCard();
    }
  }

  function onMonsterSwipe() {
    game.resolveMonster();
  }
</script>

{#if c}
  <div class="combat-phase">
    <MonsterDisplay
      monster={c.monster}
      monsterCard={c.monsterCard}
      awaitingMonster={c.awaitingMonster}
    />

    <div class="combat-arena">
      {#if c.awaitingMonster}
        <!-- Monster turn: show monster card as swipeable -->
        <div class="monster-turn">
          <div class="monster-card-prompt">Resolve {c.monster.name}'s move:</div>
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <button class="monster-card-swipe" on:click={onMonsterSwipe}>
            <div class="mc-name">{c.monsterCard?.name}</div>
            <div class="mc-hint">tap to resolve</div>
          </button>
        </div>
      {:else}
        <div class="round-label">Round {c.round}</div>
        <CenterSlot card={c.stagedCard} on:swipe={onCenterSwipe} />
      {/if}
    </div>

    {#if !c.awaitingMonster}
      <Hand
        hand={c.hand}
        stagedCard={c.stagedCard}
        onTap={tapCard}
      />
    {/if}

    {#if c.finished}
      <div class="combat-done">Victory!</div>
    {/if}
  </div>
{/if}

<style>
  .combat-phase {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 16px;
    width: 100%;
  }
  .combat-arena {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 100%;
  }
  .round-label {
    font-size: 0.75rem;
    opacity: 0.6;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .monster-turn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  .monster-card-prompt { font-size: 0.8rem; opacity: 0.7; }
  .monster-card-swipe {
    padding: 20px 32px;
    border: 2px solid var(--blood, #8b1a1a);
    border-radius: 12px;
    text-align: center;
    cursor: pointer;
    background: rgba(139,26,26,0.1);
    color: inherit;
    font-family: inherit;
    width: 100%;
    display: block;
  }
  .mc-name { font-family: var(--font-display, serif); font-size: 1rem; margin-bottom: 6px; }
  .mc-hint { font-size: 0.65rem; opacity: 0.5; }
  .combat-done {
    font-family: var(--font-display, serif);
    font-size: 1.5rem;
    color: var(--gold, #c9a84c);
    animation: pulse 0.8s ease infinite alternate;
  }
  @keyframes pulse { from { opacity: 0.7; } to { opacity: 1; } }
</style>
