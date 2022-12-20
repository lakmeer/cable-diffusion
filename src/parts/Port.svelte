<script lang="ts">
  import { newValue } from "$lib/graph/value";

  import { nodeSpy, portSpy, updateNodePort, removeNodePort } from "$store/the-graph";
  import IconButton from "$parts/IconButton.svelte";

  // Standard Port props

  // UI-specific props
  export let x: number = 0
  export let y: number = 0
  export let nodeId: string;
  export let name: string;
  export let mode: 'in' | 'out' = 'out';
  export let noInput:boolean = false;
  export let noSocket:boolean = false;
  export let multiline:boolean = false;

  // Will get value set by parent node, but report updates directly
  // to the graph. Parent node doesn't have to worry about bindings
  let value;
  let type:string;
  let label:string;

  let node = nodeSpy(nodeId)
  let port = portSpy(nodeId, name)

  $: value     = $port.value?.value ?? ''
  $: label     = $port.label
  $: type      = $port.type
  $: filled    = false;
  $: removable = false;
  $: multi     = false;


  // Positioning

  let dom: HTMLElement
  let width: number = 0
  let height: number = 0
  let bcr = { x: 0, y: 0 }

  node.subscribe(() => { if (dom) bcr = dom.getBoundingClientRect() })

  $: x = bcr.x + (mode === 'out' ? width : 0)
  $: y = bcr.y + (height/2)
  $: updateNodePort(nodeId, name, { x, y })


  // Report user manually changing values

  const onChange = () =>
    updateNodePort(nodeId, name, { value: newValue(type, value) })
</script>


<div name={name}
  bind:this={dom}
  bind:clientWidth={width} 
  bind:clientHeight={height} 
  class="Port {mode}"
  class:filled
  class:multi
  class:no-socket={noSocket}
  data-type={type}>

  {#if label}
    <span class="label"> {label} </span>
  {/if}

  {#if mode === "in"}
    {#if type === "number"}
      <input type="number" bind:value on:change={onChange} disabled={filled} />
    {:else if type === "string"}
      {#if multiline}
        <textarea rows="4" bind:value on:change={onChange} disabled={filled} />
      {:else}
        <input type="text" bind:value on:change={onChange} disabled={filled} />
      {/if}
    {/if}
  {/if}

  <div class="socket" />

  {#if removable}
    <IconButton icon="minus" small subtle on:click={() => removeNodePort(nodeId, name)} />
  {/if}
</div>


<style lang="postcss">

  // Global styles

  .Port {
    position: relative;
    width: 100%;
    min-height: calc(1rem + var(--port-height));
    text-align: left;
    text-transform: capitalize;
    display: flex;
    align-items: center;

    span {
      display: block;
      max-width: 5rem;
      margin: 0;
      margin-right: 1rem;
      font-size: 1.2rem;
    }


    // Input types

    input, textarea {
      display: block;
      height: var(--input-height);
      border: 0px solid var(--border-color);
      border-radius: 4px;
      font-size: 1.1rem;
      width: 100%;
      color: var(--text-color);
      padding-left: 0.4rem;
      padding-top: 0.07rem;
      background: var(--night);
      margin-right: 0.5rem;

      &[type="number"] {
        max-width: 5rem;
      }

      &[disabled] {
        opacity: 0.5;
      }
    }

    textarea {
      flex: 1;
      resize: vertical;
    }


    // Cable Socket

    .socket {
      position: absolute;
      top: 50%;
      width: var(--port-height);
      height: var(--port-height);
      background: var(--bg-color);
      border-radius: 50%;
      border: 3px solid currentColor;
      box-shadow:
        0 0 2px 1px var(--shade-color),
        0 0 2px 1px var(--shade-color) inset,
        0 0 6px var(--shade-color) inset;
    }

    &.filled .socket {
      //border-style: solid;
      background: currentColor;
    }

    &.no-socket .socket {
      display: none;
    }

    &.multi .socket {
      border-width: 2px;
      box-shadow:
        0 0 0 3px var(--bg-color) inset,
        0 0 0 1px currentColor,
        0 0 2px 1px var(--shade-color);
    }
  }
  

  // Modes

  .Port.in {
    padding-left: calc(1.6 * var(--std-pad));
    padding-right: var(--std-pad);

    .socket {
      left: 0;
      transform: translate(-50%, -50%);
    }
  }

  .Port.out {
    justify-content: flex-end;
    text-align: right;
    padding-right: calc(1.6 * var(--std-pad));
    padding-left: var(--std-pad);

    .socket {
      right: 0;
      transform: translate(50%, -50%);
    }
  }


  // Data coloring

  .Port[data-type="number"] .socket { color: var(--type-number); }
  .Port[data-type="string"] .socket { color: var(--type-string); }
  .Port[data-type="object"] .socket { color: var(--type-object); }
  .Port[data-type="vector"] .socket { color: var(--type-vector); }
  .Port[data-type="config"] .socket { color: var(--type-config); }

</style>
