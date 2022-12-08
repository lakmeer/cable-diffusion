<script lang="ts">
import type AnyDataFlow from "$types";

export let type:AnyDataFlow;
export let label:string = "Untitled Input";
export let filled:boolean = false;
export let multiline:boolean = false;
export let mode: 'in' | 'out' = 'out';

let value;
</script>


<div class="Port {mode}" class:filled data-type={type}> 
  <span>{ label }</span>

  {#if mode === "in"}
    {#if type === "number"}
      <input type="number" bind:value />
    {:else if type === "string"}
      {#if multiline}
        <textarea bind:value/>
      {:else}
        <input type="text" bind:value/>
      {/if}
    {/if}
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
  }


  .Port span {
    width: 5rem;
    margin: 0;
  }


  // Input types

  .Port input {
    flex: 1;
    height: var(--input-height);
    border: 1px solid var(--border-color);
    border-radius: 4px;
  }

  .Port textarea {
    flex: 1;
    resize: vertical;
  }


  // Cable Socket

  .Port:before {
    content: "";
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

  .Port.filled:before {
    border-style: solid;
    background: currentColor;
  }


  // Modes

  .Port.in {
    padding-left: calc(1.6 * var(--std-pad));
    padding-right: var(--std-pad);

    &:before {
      left: 0;
      transform: translate(-50%, -50%);
    }
  }

  .Port.out {
    justify-content: flex-end;
    text-align: right;
    padding-right: calc(1.6 * var(--std-pad));
    padding-left: var(--std-pad);

    &:before {
      right: 0;
      transform: translate(50%, -50%);
    }
  }


  // Data coloring

  .Port[data-type="number"]:before { color: var(--col-number); }
  .Port[data-type="string"]:before { color: var(--col-string); }
  .Port[data-type="object"]:before { color: var(--col-object); }
  .Port[data-type="vector"]:before { color: var(--col-vector); }
  .Port[data-type="config"]:before { color: var(--col-config); }

</style>
