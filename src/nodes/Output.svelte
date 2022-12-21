<script lang="ts">
  import Node from "$nodes/Node.svelte"

  import { nodeSpy } from '$store/the-graph';

  export let id: string;
  let node = nodeSpy(id);

  $: displayValue = $node.inports.text.value.value;
</script>


<Node id={id} title="Output" color="--rust">
  <div slot="body" class="big-text">
    { displayValue }
  </div>
</Node>


<style lang="postcss">
  .big-text {
    overflow: hidden;
    max-width: 100%;
  }
</style>
