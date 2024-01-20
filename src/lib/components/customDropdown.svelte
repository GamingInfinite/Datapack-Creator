<script lang="ts">
  export let item = null;
  let expanded: boolean = false;
</script>

<div class="overflow-hidden w-full">
  <button
    class="btn btn-ghost h-4 p-0 max-w-48 min-h-8 w-full"
    on:click={() => {
      expanded = !expanded;
    }}
  >
    <div class="ml-2"></div>
    <slot />
    <div class="m-auto"></div>
  </button>
  <div class="expandable flex flex-col ml-4" class:expanded>
    {#if item}
      {#if Array.isArray(item)}
        {#each item as thing}
          <svelte:self>{thing.name}</svelte:self>
        {/each}
      {:else}
        <svelte:self>{item.name}</svelte:self>
      {/if}
    {/if}
    <button
      class="btn btn-ghost h-4 p-0 max-w-48 min-h-8 w-full"
      on:click={() => {}}
    >
      +</button
    >
  </div>
</div>

<style>
  .expandable {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.15s ease-out;
  }

  .expandable.expanded {
    max-height: max-content;
    transition: max-height 0.25s ease-in;
  }
</style>
