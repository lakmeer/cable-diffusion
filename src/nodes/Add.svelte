<script lang="ts">

  import Node        from "$nodes/Node.svelte"
  import Port        from "$parts/Port.svelte"
  import InportGroup from "$parts/InportGroup.svelte"

  export let id: string;

  import { nodeSpy } from '$store/the-graph';

  let node = nodeSpy(id);
</script>


<Node id={id} title="Add" color="--indigo">
  <svelte:fragment slot="inputs">
    <InportGroup nodeId={id} inports={$node.inports} />
  </svelte:fragment>

  <div slot="body" />

  <div class="PortGroup" slot="outputs">
    <Port nodeId={id} mode="out" name="out" {...$node.outport} />
  </div>
</Node>
