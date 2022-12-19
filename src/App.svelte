<script lang="ts">
  import type { Node, Edge } from "$types"

  import { loadSpec, allNodes, allEdges, runGraph } from '$store/the-graph';
  import { NodeSpec } from '$lib/graph/spec'

  import ErrorBox from '$parts/ErrorBox.svelte'


  // Setup

  loadSpec({
    nodes: [
      new NodeSpec('Const',    "a").at(50,  50).state('value', 3),
      new NodeSpec('Const',    "b").at(50, 280).state('value', 7),
      new NodeSpec('Subtract', "c").at(450, 150),
      new NodeSpec('Output', "msg").at(850, 150),
    ],
    edges: [
      { from: { id: 'a', port: 'out' }, to: { id: 'c',   port: 'in0' } },
      { from: { id: 'b', port: 'out' }, to: { id: 'c',   port: 'in1' } },
      { from: { id: 'c', port: 'out' }, to: { id: 'msg', port: 'text' } },
    ]
  })

  runGraph();


  // Todo:
  //
  // - Investigate state machine model for nodes
  // - Implement actor-style inbox and then use that for busy/debounce
  // - More complex test graph
  // - Dynamic attaching cables
  // - Bring in some diffusion node types



  // UI

  import Cables     from '$parts/Cables.svelte'
  import Cable      from '$parts/Cable.svelte'

  import * as NodeComponents from '$nodes'
</script>


<main>
  <div class="backdrop">
    <Cables>
      {#each $allEdges as edge, ix}
        <Cable index={ix} type={edge.type} {...edge} />
      {/each}
    </Cables>
  </div>

  {#each $allNodes as node (node.id)}
    {#if node.type in NodeComponents}
      <svelte:component this={NodeComponents[node.type]} id={node.id} />
    {:else}
      <ErrorBox x={node.x} y={node.y}>
        <strong>Unsupported node</strong>: {node.type}
      </ErrorBox>
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
