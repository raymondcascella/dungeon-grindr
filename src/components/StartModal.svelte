<script>
  import { game } from '../lib/gameStore.js';
</script>

<div class="modal">
  <div class="modal-content">
    <div class="ornament">❦ ❦ ❦</div>
    <h1>Dungeon Grindr</h1>
    <h2>A SWIPE-BORNE CRAWL</h2>
    <p>The old crypt yawns. Three floors deep, the rumours say. You arrive without companions — only your wits, and a coin to call them.</p>
    <p style="font-size:14px;">Swipe <span style="color:#d57878">left to refuse</span>, <span style="color:#a0c080">right to accept</span>. Recruit up to three. Then descend.</p>
    <div class="ornament">✦</div>
    <button on:click={() => game.newGame()}>BEGIN THE DESCENT</button>
  </div>
</div>
