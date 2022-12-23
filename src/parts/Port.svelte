<script lang="ts">
  import { newValue } from "$lib/graph/value"

  import { nodeSpy, portSpy, updateNodePort, removeNodePort } from "$store/the-graph"

  import IconButton   from "$parts/IconButton.svelte"

  import ValueInput   from "$parts/ValueInput.svelte"
  import ValueDisplay from "$parts/ValueDisplay.svelte"
  import ValueOutput  from "$parts/ValueOutput.svelte"


  // Props

  export let x: number = 0
  export let y: number = 0
  export let nodeId: string
  export let name: string
  export let mode: 'in' | 'out' = 'out'

  let node = nodeSpy(nodeId)
  let port = portSpy(nodeId, name)

  $: value     = $port.value
  $: label     = $port.label
  $: type      = $port.type
  $: filled    = $port.filled
  $: removable = $port.removable
  $: multi     = $port.multi
  $: noSocket  = $port.noSocket
  //$: multiline = $port.multiline

  //$: name == 'out' && console.log('NodeSpy:', nodeId, $node)
  //$: console.log('PortSpy:', nodeId, name, $port.value.value);


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

  const onChange = ({ detail }) =>
    updateNodePort(nodeId, name, { value: newValue(type, detail) })
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
    {#if filled}
      <ValueDisplay {value} {type} />
    {:else if !multi}
      <ValueInput {value} {type} on:change={onChange} />
    {/if}
  {:else}
    <ValueOutput {value} {type} />
  {/if}

  <div class="socket" />

  {#if removable}
    <IconButton icon="minus" small subtle on:click={() => removeNodePort(nodeId, name)} />
  {/if}
</div>


<style lang="postcss">

  .Port {
    position: relative;
    width: 100%;
    text-align: left;
    text-transform: capitalize;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .label {
      max-width: 8rem;
    }


    // Cable Socket

    .socket {
      position: absolute;
      top: 50%;
      width: var(--socket-radius);
      height: var(--socket-radius);
      background: var(--bg-color);
      border-radius: 50%;
      border: 3px solid currentColor;
      box-shadow:
        0 0 2px 1px var(--shade-color),
        0 0 2px 1px var(--shade-color) inset,
        0 0 6px var(--shade-color) inset,
        0 0 6px var(--shade-color) inset,
        0 0 6px var(--shade-color) inset;
    }

    &.filled .socket {
      background: currentColor;
      box-shadow: 0 0 2px 1px var(--shade-color);
    }

    &.no-socket .socket {
      display: none;
    }

    &.multi .socket {
      border-style: dashed;
      border-width: 1px;
      border-color: var(--bright);
      box-shadow:
        0 0 2px 1px var(--shade-color),
        // Outside in
        0 0 0 2px var(--bg-color) inset,
        0 0 0 3px currentColor    inset;
    }
  }

  .ValueGroup {
    display: flex;
    gap: 4px;
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
    margin-top: var(--std-gap);
    border-top: 1px solid var(--shadow-color);
    padding-top: var(--std-pad);

    .socket {
      right: 0;
      transform: translate(50%, -50%);
    }
  }


  // Data coloring

  .Port[data-type="number"] .socket { color: var(--type-number); }
  .Port[data-type="string"] .socket { color: var(--type-string); }
  .Port[data-type="object"] .socket { color: var(--type-object); }
  .Port[data-type="boolean"] .socket { color: var(--type-boolean); }

</style>
