<script type="ts">
  import Fa from 'svelte-fa'
  import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'

  import type { Value } from '$types'

  import { cssVar, rgbLerp } from '$utils'

  export let value: Value;
  export let type: string

  let bgColor = rgbLerp(cssVar('bg-color'), cssVar('node-body-color'), 0.5)
</script>


<div class="ValueDisplay {type}">
  {#each value.value as val}
    <span class:true={ (type === 'boolean') && val }
          style="--border-color: var(--type-{type});--value-bg: {bgColor}">

      {#if type === "boolean"}
        <Fa icon={val ? faCheck : faTimes} />
      {:else}
        {val}
      {/if}
    </span>
  {/each}
</div>


<style lang="postcss">

  .ValueDisplay {
    display: flex;
    gap: 4px;

    span {
      display: block;
      margin: 0;
      height: calc(var(--port-height) - 2px);
      border-radius: 4px;
      padding: 0.1rem 0.5rem;
      box-shadow: 0px 0px 0px 0.5px var(--border-color);
      background: var(--value-bg);
      color: var(--node-text-color);
      font-size: 0.8rem;
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
