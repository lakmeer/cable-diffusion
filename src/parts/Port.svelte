<script lang="ts">
  import type { AnyDataflow } from "$types";

  import { updateNodePort } from "$store/the-graph";

  // Standard Port props
  export let type:AnyDataflow;
  export let label:string;
  export let filled:boolean = false;
  export let removable: boolean = false;
  export let x: number = 0;
  export let y: number = 0;

  // Will get value set by parent node, but report updates directly
  // to the graph. Parent node doesn't have to worry about bindings
  export let value;

  // UI-specific props
  export let nodeId: string;
  export let name: string;
  export let mode: 'in' | 'out' = 'out';
  export let noInput:boolean = false;
  export let noSocket:boolean = false;
  export let multiline:boolean = false;

  // UI
  let dom: HTMLElement;

  $: if (dom) {
    x = dom.getBoundingClientRect().x;
    y = dom.getBoundingClientRect().y;
  }

  $: updateNodePort(nodeId, name, { value });

  import { createEventDispatcher } from "svelte"
  const emit = createEventDispatcher()
  const onChange = (event) => emit('updated', event.target.value)
</script>


<div name={name}
  bind:this={dom}
  class="Port {mode}"
  class:filled
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
      border-style: solid;
      background: currentColor;
    }

    &.no-socket .socket {
      display: none;
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
