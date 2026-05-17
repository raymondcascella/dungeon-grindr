<script>
  export let monster;
  export let monsterCard = null;
  export let awaitingMonster = false;
</script>

<div class="monster-display {monster.isBoss ? 'boss' : ''}">
  <div class="monster-icon">{monster.icon ?? monster.emblem ?? '👹'}</div>
  <div class="monster-name">{monster.name}</div>
  <div class="monster-hp">
    <div class="hp-bar" style="width: {Math.max(0, (monster.currentHp / monster.hp) * 100)}%"></div>
    <span class="hp-text">{Math.max(0, monster.currentHp)} / {monster.hp}</span>
  </div>
  {#if awaitingMonster && monsterCard}
    <div class="monster-action">
      <span class="action-name">{monsterCard.name}</span>
    </div>
  {/if}
</div>

<style>
  .monster-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px;
    border: 1px solid var(--ink-faint, #5a4a3a);
    border-radius: 8px;
    background: rgba(0,0,0,0.2);
  }
  .boss { border-color: var(--gold, #c9a84c); }
  .monster-icon { font-size: 2.5rem; }
  .monster-name { font-family: var(--font-display, serif); font-size: 1rem; letter-spacing: 0.05em; }
  .monster-hp {
    position: relative;
    width: 100%;
    height: 12px;
    background: rgba(0,0,0,0.4);
    border-radius: 6px;
    overflow: hidden;
  }
  .hp-bar {
    height: 100%;
    background: var(--blood, #8b1a1a);
    border-radius: 6px;
    transition: width 0.3s ease;
  }
  .hp-text {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    letter-spacing: 0.05em;
  }
  .monster-action {
    font-size: 0.8rem;
    color: var(--blood, #8b1a1a);
    font-style: italic;
    animation: pulse 0.8s ease infinite alternate;
  }
  @keyframes pulse { from { opacity: 0.7; } to { opacity: 1; } }
</style>
