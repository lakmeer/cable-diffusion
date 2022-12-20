<script lang="ts">
  import type { Readable } from 'svelte/store'
  import type { Node } from '$types'

  import IconButton   from "$parts/IconButton.svelte"
  import NodeTitleBar from "$parts/NodeTitleBar.svelte"
  import Port         from "$parts/Port.svelte"

  import { runNode, nodeSpy, updateNode, addPort } from '$store/the-graph';


  // Props

  export let id: string
  export let title: string = "Untitled"
  export let color: string = "--dark"   // A css var
  export let autocompute: boolean = false

  let node:Readable<Node> = nodeSpy(id)
  let run  = () => runNode(id)
  let add  = () => addPort(id)


  // Drag setup

  import dragging from "$lib/dragging";

  let dom:HTMLElement, grip:HTMLElement;

  $: dragging(grip, { target: dom }, (pos) => updateNode(id, pos))


  // Style

  $: css = `
    top:  ${$node.y}px;
    left: ${$node.x}px;
    --title-bg: var(${color});
  `

  // Port events

  const onPortUpdate = () => { if (autocompute) run() }
</script>


<div class="Node" bind:this={dom} style="{css}">
  <div class="NodeBody">
    <NodeTitleBar {title} bind:grip>
      <svelte:fragment slot="left-actions">
        {#if $node.dynamic}
          <IconButton icon="plus" on:click={add} />
        {/if}
      </svelte:fragment>

      <svelte:fragment slot="right-actions">
        {#if $node.outport}
          <IconButton icon="run" spin={$node.state.busy} on:click={run}  />
        {/if}
      </svelte:fragment>
    </NodeTitleBar>

    <div class="body">
      <div class="inputs">
        {#each Object.entries($node.inports) as [name, port] (name) }
          <Port on:updated={onPortUpdate} nodeId={id} mode="in" name={name} {...port} />
        {/each}
        
      </div>

      <div class="inner">
        <slot name="body" />
      </div>

      {#if $node.outport}
        <div class="outputs">
          <Port nodeId={id} mode="out" name="out" {...$node.outport} />
        </div>
      {/if}
    </div>
  </div>

  <div class="status-indicator"
    class:running={$node.state.busy}
    class:error={$node.state.error} />
</div>


<style lang="postcss">

  .Node {
    position: absolute;
    user-select: none;
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
      &:empty { padding: 0; }
    }

    .inputs, .outputs {
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
      animation-duration: 2s;
      background-blend-mode: luminosity;
    }
  }

</style>
