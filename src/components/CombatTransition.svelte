<script>
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  onMount(() => {
    // crimson flash 80ms → fade 200ms → shake 150ms → done
    const t = setTimeout(() => dispatch('done'), 430);
    return () => clearTimeout(t);
  });
</script>

<div class="transition-overlay" />

<style>
  .transition-overlay {
    position: fixed;
    inset: 0;
    background: var(--blood, #8b1a1a);
    animation: combat-flash 430ms forwards;
    z-index: 100;
    pointer-events: none;
  }

  @keyframes combat-flash {
    0%   { opacity: 0.9; }
    18%  { opacity: 0.9; }   /* 80ms flash */
    65%  { opacity: 0; }     /* 200ms fade */
    100% { opacity: 0; }
  }
</style>
