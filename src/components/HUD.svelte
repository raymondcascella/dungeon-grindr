<script>
  import { game } from '../lib/gameStore.js';
  import { FLOOR_NAMES } from '../lib/gameData.js';
</script>

<div class="crest">
  <div class="title">Dungeon Grindr</div>
  <div class="floor">{FLOOR_NAMES[$game.floor] ?? '— THE GATES —'}</div>
</div>

<div class="stats">
  <div class="stat"><div class="label">PARTY HP</div><div class="value">{$game.party.reduce((s,m) => s + Math.max(0, m.currentHp), 0)}</div></div>
  <div class="stat"><div class="label">STAMINA</div><div class="value">{$game.stamina}</div></div>
  <div class="stat"><div class="label">GOLD</div><div class="value">{$game.gold}</div></div>
</div>

<div class="party">
  {#each $game.party as member}
    <div class="member {member.currentHp <= 0 ? 'dead' : ''}">
      <span class="icon">{member.icon}</span>
      <div class="name">{member.name}</div>
      <div class="hp">{Math.max(0, member.currentHp)}/{member.hp}</div>
    </div>
  {/each}
</div>

{#if $game.log}
  <div class="log">{$game.log}</div>
{/if}

{#each $game.floaters as f (f.id)}
  <div class="floater {f.kind}">{f.text}</div>
{/each}
