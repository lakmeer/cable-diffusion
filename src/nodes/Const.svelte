<script lang="ts">
  import { nodeSpy, updateNodeState } from '$store/the-graph';

  import Node from "$nodes/Node.svelte"
  import Port from "$parts/Port.svelte"

  export let id: string;

  let node = nodeSpy(id);
  let value = $node.state.value

  $: updateNodeState(id, { value });
</script>


<Node id={id} title="Const" color="--teal">
  <div class="PortGroup" slot="inputs">
    <!-- Not a real inport -->
    <Port nodeId={id}
      mode="in"
      name="pos"
      label="Value"
      type="number"
      bind:value
      noSocket />
  </div>

  <div class="PortGroup" slot="outputs">
    <Port nodeId={id} mode="out" name="out" label="Output" {...$node.outport} />
  </div>
</Node>

