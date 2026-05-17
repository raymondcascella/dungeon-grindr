<script>
  import { game } from '../lib/gameStore.js';
  import SwipeCard from './SwipeCard.svelte';
</script>

<div class="stack-wrap">
  {#if $game.currentCard}
    <SwipeCard card={$game.currentCard} on:swipe={e => game.swipeRecruit(e.detail)} />
  {/if}
</div>

<div class="actions">
  <div class="action-hint left">
    <div class="arrow">← swipe left</div>
    <div class="label">PASS</div>
  </div>
  <div class="action-hint right">
    <div class="arrow">swipe right →</div>
    <div class="label">RECRUIT</div>
  </div>
</div>
