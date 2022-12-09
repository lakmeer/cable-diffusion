<script lang="ts">
  import dragging from "$lib/dragging";

  let node:HTMLElement, grip:HTMLElement;

  $: dragging(grip, { target: node })

  export let id: string;
  export let title:string = "Untitled Node";
  export let color:string = "--blue"; // Should be a css var

  export let x:number = 0;
  export let y:number = 0;

  $: css = `
    top:  ${y}px;
    left: ${x}px;

    --title-bg: var(${color});
  `

  import theGraph from "$store/the-graph";

  $: thisNode = $theGraph.nodes.find(node => node.id === id);

  const dragged = (event) => {
    console.log("dragged", event.detail);
    thisNode.x = event.detail.x;
    thisNode.y = event.detail.y;
  }
</script>


<div class="Node" on:drag={dragged} bind:this={node} style="{css}" data-id="{id}">
  <div class="title" bind:this={grip}>
     { title }
  </div>

  <div class="body">
    <div class="inputs">
      <slot name="inputs" />
    </div>

    <div class="inner">
      <slot name="body" />
    </div>

    <div class="outputs">
      <slot name="outputs" />
    </div>
  </div>
</div>


<style lang="postcss">
  .Node {
    border-radius: var(--node-radius-minus-one);
    background-color: var(--node-body-color);
    box-shadow: 0 8px 20px 1px rgba(0, 0, 0, 0.2);
    width: 300px;

    .title {
      cursor: move;
      font-weight: bold;
      text-align: center;
      font-size: larger;
      text-shadow: 0px 1px 3px var(--shade-color), 0px 1px 0px var(--shade-color);
      padding: var(--std-pad);
      user-select: none;
      border-radius: var(--node-radius) var(--node-radius) 0 0;
      background-color: var(--title-bg);
      background-image: linear-gradient(
        to bottom right,
        var(--highlight-color) 10%,
        var(--shade-color) 100%
      );
    }

    .body {
      padding: var(--std-pad) 0;
    }

    .inner {
      display: flex;
      flex-direction: column;
      gap: var(--std-gap);
      padding: var(--std-pad);
    }

    .inputs > :global(div), .outputs > :global(div) {
      display: flex;
      flex-direction: column;
      gap: var(--std-gap);
      justify-content: center;
    }
  }
</style>
