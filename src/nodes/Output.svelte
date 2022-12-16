<script lang="ts">
  import Node from "$nodes/Node.svelte"
  import Port from "$parts/Port.svelte"

  import { nodeSpy } from '$store/the-graph';

  export let id: string;

  let node = nodeSpy(id);

  $: displayValue = JSON.stringify($node.inports.text.value, null, 2)
</script>


<Node id={id} title="Output" color="--rust">
  <div class="PortGroup" slot="inputs">
    <Port nodeId={id} mode="in" name="text" {...$node.inports.text} noInput />
  </div>

  <div slot="body" class="big-text">
    { displayValue }
  </div>

  <div class="PortGroup" slot="outputs">
  </div>
</Node>


<style lang="postcss">
  .big-text {
    font-size: 2em;
    padding: 0.5rem 0;
    font-weight: bold;
    text-align: center;
    overflow: hidden;
    max-width: 100%;
    line-height: 1.2;
  }
</style>
