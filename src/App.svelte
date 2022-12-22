<script lang="ts">
  import { loadSpec, allNodes, allEdges, runGraph } from '$store/the-graph';
  import testGraph from '$data/range'

  import ErrorBox from '$parts/ErrorBox.svelte'


  // Setup

  loadSpec(testGraph);

  runGraph();


  // Todo:
  //
  // - Multivalues
  // - Investigate state machine model for nodes
  // - Implement actor-style inbox and then use that for busy/debounce
  // - More complex test graph
  // - Dynamic attaching cables
  // - Bring in some diffusion node types


  // UI

  import Cables from '$parts/Cables.svelte'
  import Cable  from '$parts/Cable.svelte'

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
