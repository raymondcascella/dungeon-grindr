<script>
  import ActionCard from './ActionCard.svelte';

  export let hand = [];
  export let stagedCard = null;
  export let onTap;
</script>

<div class="hand">
  {#each hand as card (card.ownerName + card.name)}
    <ActionCard
      {card}
      staged={stagedCard === card}
      on:tap={e => onTap(e.detail)}
    />
  {/each}
</div>

<style>
  .hand {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
    padding: 8px 0;
  }
</style>
