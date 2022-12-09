<script lang="ts">
  import type { Point, Curve, Cable } from '$types';

  const { min } = Math;

  import { cssVar, hyp } from '$utils';

  import Cables from "$parts/Cables.svelte";
  import Cable_ from "$parts/Cable.svelte";

  import PromptNode from "$nodes/Prompt.svelte";
  import SpreadNode from "$nodes/Spread.svelte";
  import RangeNode  from "$nodes/Range.svelte";

  import theGraph from "$store/the-graph";


  // Master state

  let nodes = [
    { id: "", type: 'Prompt', x: 50,  y: 250, state: {} },
    { id: "", type: 'Spread', x: 400, y: 500, state: {} },
    { id: "", type: 'Range',  x: 850, y: 750, state: {} },
    { id: "", type: 'Range',  x: 400, y: 850, state: {} },
  ]

  let cables = [
    {
      id: "",
      type:  'number',
      from:  "0:out",
      to:    "1:mid",
      curve: null
    },
    {
      id: "",
      type:  'number',
      from:  "1:out",
      to:    "2:mid",
      curve: null
    },
    {
      id: "",
      type:  'string',
      from:  "3:out",
      to:    "2:steps",
      curve: null
    },
  ];


  // Autogenerate node id's

  nodes.forEach((node, ix) => {
    node.id = ix.toString();
  });


  // Autogenerate cable curves

  const tempColors = [ 'blue', 'gold', 'red', 'gold' ]

  const findNode = (nodeId:string) => nodes.find(node => node.id === nodeId)

  // @ts-ignore
  const getPortOffset = (node, portId) => {
    return [ 0, 73 ]
  }

  cables.forEach((cable, ix) => {
    const [ fromNodeId, fromPortId ] = cable.from.split(':');
    const [ toNodeId,   toPortId   ] = cable.to.split(':');

    const fromNode = findNode(fromNodeId);
    const toNode   = findNode(toNodeId);

    const [ fromX, fromY ] = getPortOffset(fromNode, fromPortId);
    const [ toX,   toY   ] = getPortOffset(toNode,   toPortId);

    const termA:Point = [ fromNode.x + fromX + 300, fromNode.y + fromY + 108 ];
    const termB:Point = [   toNode.x + toX,         toNode.y + toY   ];

    const strength = min(150, hyp(termA, termB) / 2);

    const ctrlA:Point = [ termA[0] + strength, termA[1] ];
    const ctrlB:Point = [ termB[0] - strength, termB[1] ];

    const curve:Curve = { termA, termB, ctrlA, ctrlB, color: cssVar(tempColors[ix]) }

    cable.id = ix.toString();
    cable.curve = curve;
  })

  theGraph.set({ nodes, cables: cables as Cable[] });
</script>


<main>
  <div class="backdrop">
    <Cables>
      {#each cables as cable, ix}
        <Cable_ id={ix.toString()} {...cable} />
      {/each}
    </Cables>
  </div>

  {#each nodes as node, ix}
    {#if node.type == 'Prompt'}
      <PromptNode id={ix.toString()} {...node} />
    {:else if node.type == 'Spread'}
      <SpreadNode id={ix.toString()} {...node} />
    {:else if node.type == 'Range'}
      <RangeNode  id={ix.toString()} {...node} />
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
