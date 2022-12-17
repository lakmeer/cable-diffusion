<script lang="ts">
  import { logNode, nodeSpy, updateNodeState } from '$store/the-graph';

  import Node from "$nodes/Node.svelte"
  import Port from "$parts/Port.svelte"

  export let id: string;

  let node = nodeSpy(id);
</script>


<Node id={id} title="Const" color="--teal">
  <div class="PortGroup" slot="inputs">
    <Port nodeId={id} mode="in" name="set" {...$node.inports.set} />
  </div>

  <div slot="body"></div>

  <div class="PortGroup" slot="outputs">
    <Port nodeId={id} mode="out" name="out" {...$node.outport} />
  </div>
</Node>

