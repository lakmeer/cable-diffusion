<script lang="ts">

  import type { Node } from "$lib/graph/types"

  import { loadSpec, allNodes, runGraph } from '$store/the-graph';

  import { NodeSpec } from '$lib/graph/spec'


  // Setup

  loadSpec({
    nodes: [
      new NodeSpec('Const',    "a").state('value', 3).at(50, 100),
      new NodeSpec('Const',    "b").state('value', 7).at(50, 500),
      new NodeSpec('Add',      "c").at(450, 300),
      new NodeSpec('Output', "msg").at(850, 300),
    ],
    edges: [
      { from: { id: 'a', port: 'out' }, to: { id: 'c',   port: 'in0' } },
      { from: { id: 'b', port: 'out' }, to: { id: 'c',   port: 'in1' } },
      { from: { id: 'c', port: 'out' }, to: { id: 'msg', port: 'text' } },
    ]
  })

  runGraph();


  // UI

  let nodes:Node[] = $allNodes;

  import ConstNode  from '$nodes/Const.svelte';
  import AddNode    from '$nodes/Add.svelte';
  import OutputNode from '$nodes/Output.svelte';
  import PromptNode from "$nodes/Prompt.svelte";
  import SpreadNode from "$nodes/Spread.svelte";
  import RangeNode  from "$nodes/Range.svelte";
</script>

<main>
  <div class="backdrop">
    <!--
    <Cables>
      {#each cables as cable, ix}
        <Cable_ id={ix.toString()} {...cable} />
      {/each}
    </Cables>
    --> 
  </div>

  {#each nodes as node (node.id)}
    {#if      node.type == 'Const'}
      <ConstNode  id={node.id} />
    {:else if node.type == 'Add'}
      <AddNode    id={node.id} />
    {:else if node.type == 'Output'}
      <OutputNode id={node.id} />
    {:else if node.type == 'Prompt'}
      <PromptNode id={node.id} />
    {:else if node.type == 'Spread'}
      <SpreadNode id={node.id} />
    {:else if node.type == 'Range'}
      <RangeNode  id={node.id} />
    {:else}
      <div>Unknown node type: {node.type}</div>
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
