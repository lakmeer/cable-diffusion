<script lang="ts">
  import type { Value } from '$types'
  import Toggle from '$parts/Toggle.svelte'

  export let value: Value
  export let type: string
  export let multiline: boolean = false
</script>


<div class="ValueInput {type}" class:checked={type === "boolean" && value}>
  {#if type === "number"}

    <input type="number" bind:value on:change />

  {:else if type === "string"}

    {#if multiline}
      <textarea rows="4" bind:value on:change />
    {:else}
      <input type="text" bind:value on:change />
    {/if}

  {:else if type === "boolean"}

    <Toggle bind:checked={value} />

  {:else}

    <input type="text" bind:value on:change />

  {/if}
</div>


<style lang="postcss">

  .ValueInput {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    height: calc(1rem + var(--port-height));
    position: relative;

    input, textarea {
      display: block;
      height: var(--input-height);
      border: 0px solid var(--border-color);
      border-radius: 4px;
      font-size: 1.1rem;
      width: 100%;
      max-width: 10rem;
      color: var(--text-color);
      padding-left: 0.4rem;
      padding-top: 0.07rem;
      background: var(--night);
      margin: 0;
      box-shadow: 0px 0px 5px 0px rgba(0,10,40,0.4) inset,
                  0px 0px 2px 0px rgba(0,10,40,0.4) inset;

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
  }

</style>
