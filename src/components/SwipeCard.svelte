<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let card;

  let startX = 0;
  let dx = 0;
  let dragging = false;

  function onPointerDown(e) {
    startX = e.clientX;
    dragging = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    dx = e.clientX - startX;
  }

  function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    if (Math.abs(dx) > 60) dispatch('swipe', dx > 0 ? 'right' : 'left');
    dx = 0;
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="card"
  style="transform: translateX({dx}px) rotate({dx * 0.04}deg)"
  on:pointerdown={onPointerDown}
  on:pointermove={onPointerMove}
  on:pointerup={onPointerUp}
>
  <div class="card-emblem">{card.icon ?? card.emblem ?? '❓'}</div>
  <div class="card-name">{card.name}</div>
  {#if card.cls}<div class="card-sub">{card.cls}</div>{/if}
  {#if card.flavor}<div class="card-flavor">{card.flavor}</div>{/if}
  {#if card.hp}<div class="card-stats">HP {card.hp} · ATK {card.atk}</div>{/if}
</div>

<style>
  .card { touch-action: none; cursor: grab; user-select: none; }
</style>
