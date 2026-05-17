<script>
  import { game } from '../lib/gameStore.js';
  $: s = $game;
  $: survived = s.party.filter(m => m.currentHp > 0);
</script>

<div class="modal">
  <div class="modal-content">
    {#if s.victory}
      <div class="ornament">✦ ❦ ✦</div>
      <h1 style="color: var(--gold-bright);">VICTORY</h1>
      <h2>YOU HAVE PLUMBED THE DEPTHS</h2>
      <p>The First Buried King falls silent. Daylight, when you find it, will feel impossibly strange.</p>
      <div class="summary">
        <strong>{survived.length}</strong> companion{survived.length === 1 ? '' : 's'} survived<br>
        <strong>{s.stats.kills}</strong> foes vanquished<br>
        <strong>{s.gold}</strong> gold recovered<br>
        <strong>{s.stats.fled}</strong> times fled, <strong>{s.stats.fellComrades}</strong> fallen
      </div>
    {:else}
      <div class="ornament">☠ ☠ ☠</div>
      <h1>A PARTY WIPE</h1>
      <h2>THE CRYPT KEEPS WHAT IT CLAIMS</h2>
      <p>The torches gutter. No one returns to tell the tale.</p>
      <div class="verdict">Floor {s.floor} of 3</div>
      <div class="summary">
        <strong>{s.stats.kills}</strong> foes vanquished<br>
        <strong>{s.gold}</strong> gold lost to the dark<br>
        <strong>{s.stats.fellComrades}</strong> comrades fallen
      </div>
    {/if}
    <button on:click={() => game.newGame()}>
      {s.victory ? 'DESCEND ANEW' : 'TRY AGAIN'}
    </button>
  </div>
</div>
