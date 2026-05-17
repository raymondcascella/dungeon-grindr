<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let card = null;

  let startX = 0;
  let dx = 0;
  let dragging = false;

  function onPointerDown(e) {
    if (!card) return;
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
    if (Math.abs(dx) > 60) {
      dispatch('swipe', dx > 0 ? 'right' : 'left');
    }
    dx = 0;
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="center-slot {card ? 'has-card' : 'empty'}"
  style={card ? `transform: translateX(${dx}px) rotate(${dx * 0.04}deg)` : ''}
  on:pointerdown={onPointerDown}
  on:pointermove={onPointerMove}
  on:pointerup={onPointerUp}
>
  {#if card}
    <div class="staged-icon">{card.ownerIcon}</div>
    <div class="staged-name">{card.name}</div>
    <div class="staged-kind">{card.kind}</div>
    {#if card.dmg}<div class="staged-stat">ATK {card.dmg}</div>{/if}
    {#if card.block}<div class="staged-stat">BLK {card.block}</div>{/if}
    {#if card.heal}<div class="staged-stat">+{card.heal} HP</div>{/if}
    <div class="swipe-hint">← return · play →</div>
  {:else}
    <div class="empty-hint">tap a card to stage it</div>
  {/if}
</div>

<style>
  .center-slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 130px;
    min-height: 160px;
    border: 2px dashed var(--ink-faint, #5a4a3a);
    border-radius: 12px;
    text-align: center;
    touch-action: none;
    transition: border-color 0.2s;
  }
  .has-card {
    border-style: solid;
    border-color: var(--gold, #c9a84c);
    background: var(--parchment, #f5e6c8);
    cursor: grab;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  }
  .empty { opacity: 0.5; }
  .staged-icon { font-size: 2rem; }
  .staged-name { font-family: var(--font-display, serif); font-size: 0.85rem; letter-spacing: 0.05em; }
  .staged-kind { font-size: 0.65rem; opacity: 0.6; text-transform: uppercase; }
  .staged-stat { font-size: 0.9rem; font-weight: bold; }
  .swipe-hint { font-size: 0.6rem; opacity: 0.5; margin-top: 8px; }
  .empty-hint { font-size: 0.7rem; padding: 8px; line-height: 1.4; }
</style>
