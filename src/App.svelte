<script lang="ts">
  import { cssVar } from '$utils';

  import Cables from "$parts/Cables.svelte";
  import Cable  from "$parts/Cable.svelte";

  import PromptNode from "$nodes/Prompt.svelte";
  import SpreadNode from "$nodes/Spread.svelte";
  import RangeNode  from "$nodes/Range.svelte";


  // Master state

  let nodes = [
    { type: 'Prompt', x: 50,  y: 650, state: {} },
    { type: 'Spread', x: 400, y: 700, state: {} },
    { type: 'Range',  x: 750, y: 750, state: {} },
  ]

  let cables = [
    { type: 'number', color: cssVar('blue'), termA: [200, 200], termB: [400, 400], ctrlA: [400, 200], ctrlB: [200, 400] },
    { type: 'string', color: cssVar('red'),  termA: [500, 200], termB: [500, 400], ctrlA: [800, 200], ctrlB: [800, 400] },
  ];
</script>


<main>
  <div class="backdrop">
    <Cables>
      {#each cables as cable, id}
        <Cable {id} {...cable} />
      {/each}
    </Cables>
  </div>

  {#each nodes as node, id}
    {#if node.type == 'Prompt'}
      <PromptNode {id} {...node} />
    {:else if node.type == 'Spread'}
      <SpreadNode {id} {...node} />
    {:else if node.type == 'Range'}
      <RangeNode  {id} {...node} />
    {/if}
  {/each}
</main>


<style global lang="postcss">

  .backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
  }

  main {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: var(--night);

    :global(.Node) {
      position: absolute;
      z-index: 2;
    }
  }

</style>
