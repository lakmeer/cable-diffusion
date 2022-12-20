<script lang="ts">
  import Node from "$nodes/Node.svelte"
  import { nodeSpy } from "$store/the-graph"

  export let id: string;

  let node = nodeSpy(id);
  let title = $node.type;
</script>


<Node id={id} title="{title}" color="--indigo" />
