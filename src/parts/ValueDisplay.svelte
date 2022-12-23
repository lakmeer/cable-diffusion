<script type="ts">
  import Fa from 'svelte-fa'
  import { faCheck, faTimes, faEllipsis } from '@fortawesome/free-solid-svg-icons'

  import type { Value } from '$types'

  import { cssVar, rgbLerp } from '$utils'

  export let value: Value;
  export let type: string
  export let align: 'left' | 'right' = 'left'

  let bgColor = rgbLerp(cssVar('bg-color'), cssVar('node-body-color'), 0.5)

  $: shownValues = value.size >= 7
    ? value.value.slice(0, 2).concat('...').concat(value.value.slice(-2))
    : value.value
</script>


<div class="ValueDisplay {type} {align}">

  {#each shownValues as val}

    {#if val !== "..."}

      <span class="value" class:true={ (type === 'boolean') && val }
            style="--border-color: var(--type-{type});--value-bg: {bgColor}">

        {#if type === "boolean"}
          <Fa icon={val ? faCheck : faTimes} />
        {:else if type === "number"}
          { val % 1 === 0 ? val : val.toFixed(4) }
        {:else}
          { val }
        {/if}
      </span>

    {:else}

      <span class="ellipsis">
        <Fa icon={faEllipsis} />
      </span>

    {/if}
  {:else}
    Nothing to show: { JSON.stringify(shownValues) }
  {/each}

</div>


<style lang="postcss">

  .ValueDisplay {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;

    &.right { justify-content: flex-end; }

    span.value {
      display: block;
      margin: 0;
      height: calc(var(--port-height) - 2px);
      border-radius: 4px;
      padding: 0.0rem 0.5rem;
      //box-shadow: 0px 0px 0px 0.6px var(--border-color);
      border-bottom: 1px solid var(--border-color);
      background: var(--value-bg);
      color: var(--node-text-color);
      font-size: 0.8rem;
    }

    span.ellipsis {
      margin: 0;
      padding: 0.1rem 0.5rem;
      font-size: 1.2rem;
    }


    // Type variants

    &.boolean span {
      width: calc(var(--port-height) - 2px);
      text-align: center;
      color: var(--grey);
      font-size: 1rem;
      :global(svg) { transform: translate(0px, 1px); }
    }

    &.boolean span.true {
      color: var(--node-text-color);
      :global(svg) { transform: translate(-2px, 1px); }
    }
  }

</style>
