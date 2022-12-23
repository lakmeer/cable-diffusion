<script lang="ts">
  import Node from "$nodes/Node.svelte"
  import { nodeSpy } from "$store/the-graph"

  export let id: string;
  export let color: string = "--grey";

  let node = nodeSpy(id);
  let title = $node.type;
</script>


<Node id={id} title="{title}" {color} />
