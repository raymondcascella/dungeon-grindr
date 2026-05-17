<script>
  import { game } from './lib/gameStore.js';
  import HUD from './components/HUD.svelte';
  import StartModal from './components/StartModal.svelte';
  import EndModal from './components/EndModal.svelte';
  import RecruitPhase from './components/RecruitPhase.svelte';
  import DungeonPhase from './components/DungeonPhase.svelte';
  import CombatTransition from './components/CombatTransition.svelte';
  import CombatPhase from './components/CombatPhase.svelte';

  let shaking = false;

  function onTransitionDone() {
    shaking = false;
    game.enterCombat();
  }

  $: if ($game.phase === 'transitioning') shaking = true;
</script>

<div id="app-root" class:combat-mode={$game.phase === 'combat'} class:shaking>
  {#if $game.phase === 'start'}
    <StartModal />
  {:else if $game.phase === 'end'}
    <EndModal />
  {:else}
    <HUD />
    {#if $game.phase === 'recruit'}
      <RecruitPhase />
    {:else if $game.phase === 'dungeon'}
      <DungeonPhase />
    {:else if $game.phase === 'transitioning'}
      <CombatTransition on:done={onTransitionDone} />
    {:else if $game.phase === 'combat'}
      <CombatPhase />
    {/if}
  {/if}
</div>
