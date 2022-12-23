<script lang="ts">
  import { nodeSpy } from '$store/the-graph'

  import Node from "$nodes/Node.svelte"

  export let id: string
  let node = nodeSpy(id)

  $: displayValue = $node.inports.text.value.value
</script>


<Node id={id} title="Output" color="--rust">
  <div slot="body">
    {#each displayValue as value}
      <div class="readout big-text">
        { value }
      </div>
    {/each}
  </div>
</Node>


<style lang="postcss">
  .big-text {
    overflow: hidden;
    max-width: 100%;
  }

  .readout {
    background: var(--bg-color);
    padding: 0.2em 0.5em;
    border-radius: var(--node-radius-minus-one);
    box-shadow: 0 0 2px 0px var(--shadow-color) inset,
                0 0 5px var(--shadow-color) inset;
    font-family: monospace;
  }

  .readout + .readout {
    margin-top: var(--std-gap);
  }
</style>
