<script lang="ts">
  import type { Value } from '$types'
  import { createEventDispatcher } from 'svelte'

  import Toggle from '$parts/Toggle.svelte'

  export let value: Value
  export let type: string
  export let multiline: boolean = false

  // No user-input mode for multivalues, so we'll assume that any that end up
  // here will be in single mode
  let rawValue = value.value[0]

  const emit = createEventDispatcher()
  const onChange = (event) => { emit('change', rawValue) }
</script>


<div class="ValueInput {type}" class:checked={type === "boolean" && value}>
  {#if type === "number"}

    <input type="number" bind:value={rawValue} on:change={onChange} />

  {:else if type === "string"}

    {#if multiline}
      <textarea rows="4" bind:value={rawValue} on:change={onChange} />
    {:else}
      <input type="text" bind:value={rawValue} on:change={onChange} />
    {/if}

  {:else if type === "boolean"}

    <Toggle bind:checked={rawValue} on:change={onChange} />

  {:else}

    <input type="text" bind:value={rawValue} on:change={onChange} />

  {/if}
</div>


<style lang="postcss">

  .ValueInput {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    height: var(--port-height);
    position: relative;

    input, textarea {
      display: block;
      height: var(--port-height);
      border: none;
      border-radius: 4px;
      font-size: 1.1rem;
      width: 100%;
      color: var(--text-color);
      padding-left: 0.5rem;
      padding-top: 0.2rem;
      background: var(--night);
      margin: 0;
      box-shadow: 0px 0px 5px 0px rgba(0,10,40,0.4) inset,
                  0px 0px 2px 0px rgba(0,10,40,0.4) inset;

      &:focus {
        outline: none;
        box-shadow:
          0px 0px 5px 0px rgba(0,10,40,0.4) inset,
          0px 0px 2px 0px rgba(0,10,40,0.4) inset,
          0px 0px 0px 1px var(--node-text-color) inset;
      }

      &[type="number"] {
        max-width: 3rem;
      }

      &[disabled] {
        opacity: 0.5;
      }
    }

    textarea {
      flex: 1;
      resize: vertical;
    }
  }

</style>
