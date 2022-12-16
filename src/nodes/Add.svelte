<script lang="ts">
  import Node from "$nodes/Node.svelte"
  import Port from "$parts/Port.svelte"

  export let id: string;

  import { nodeSpy } from '$store/the-graph';

  let node = nodeSpy(id);
</script>


<Node id={id} title="Add" color="--indigo">
  <div class="PortGroup" slot="inputs">
    {#each Object.entries($node.inports) as [name, port]}
      <Port nodeId={id} mode="in" {name} {...port} />
    {/each}
  </div>

  <div slot="body">
    <button on:click={$node.newPort}> + Add port </button>
  </div>

  <div class="PortGroup" slot="outputs">
    <Port nodeId={id} mode="out" name="out" {...$node.outport} />
  </div>
</Node>

