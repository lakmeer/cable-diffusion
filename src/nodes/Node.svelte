<script lang="ts">
  import { runNode, nodeSpy, updateNode } from '$store/the-graph';

  import RunButton    from "$parts/RunButton.svelte";
  import NodeTitleBar from "$parts/NodeTitleBar.svelte";

  // Props
  export let id: string;
  export let title: string = "Untitled Node";
  export let color: string = "--blue"; // Should be a css var

  let node = nodeSpy(id);


  // Drag setup

  import dragging from "$lib/dragging";

  let dom:HTMLElement, grip:HTMLElement;
  $: dragging(grip, { target: dom })

  const dragged = (event) => {
    updateNode(id, old => ({ ...old, x: event.detail[0], } ))
  }


  // Style

  $: css = `
    top:  ${$node.y}px;
    left: ${$node.x}px;
    --title-bg: var(${color});
  `
</script>


<div class="Node" bind:this={dom} style="{css}">
  <div class="NodeBody">
    <NodeTitleBar {title} bind:grip on:drag={dragged} />

    <div class="body">
      <div class="inputs">
        <slot name="inputs" />
      </div>

      <div class="inner">
        <slot name="body">
          <pre>{ JSON.stringify($node.state, null, 2) }</pre>
        </slot>

        <RunButton running={$node.busy} on:run={() => runNode(id)} />
      </div>

      <div class="outputs">
        <slot name="outputs" />
      </div>
    </div>
  </div>

  <div class="status-indicator"
    class:running={$node.busy}
    class:error={$node.error} />
</div>


<style lang="postcss">

  .Node {
    position: absolute;
  }

  .NodeBody {
    border-radius: var(--node-radius-minus-one);
    background-color: var(--node-body-color);
    box-shadow: 0 8px 20px 1px rgba(0, 0, 0, 0.2);
    width: 300px;
    z-index: 1;

    .body {
      padding: var(--std-pad) 0;
    }

    .inner {
      display: flex;
      flex-direction: column;
      gap: var(--std-gap);
      padding: calc(2 * var(--std-pad));
    }

    .inputs > :global(div), .outputs > :global(div) {
      display: flex;
      flex-direction: column;
      gap: var(--std-gap);
      justify-content: center;
    }
  }

  .status-indicator {
    border-radius: var(--node-radius-minus-one);
    position: absolute;
    top:    -5px;
    left:   -5px;
    width:  calc(100% + 10px);
    height: calc(100% + 10px);
    pointer-events: none;
    z-index: -1;

    --stripe-on:  var(--node-body-color);
    --stripe-off: rgba(255,255,255,0.8);

    // Gradient
    background-color: var(--node-body-color);
    background-size: 40px 40px;
    background-image:
      linear-gradient(-45deg,
        var(--stripe-on) 0%,
        var(--stripe-on) 24%,
        var(--stripe-off) 25%,
        var(--stripe-off) 49%,
        var(--stripe-on) 50%,
        var(--stripe-on) 74%,
        var(--stripe-off) 75%,
        var(--stripe-off) 99%
      );

    // States
    animation: progress 0.2s linear infinite;
    transition: opacity 0.4s; // release
    opacity: 0;

    &.running {
      opacity: 0.8;
      transition-duration: 0.1s; // attack
    }

    &.error {
      --stripe-off: rgba(255,255,255,0.2);
      opacity: 1.0;
      background-color: var(--red);
      background-blend-mode:luminosity;
      animation-duration: 2s;
    }
  }

</style>
