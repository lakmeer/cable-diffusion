<script lang="ts">
  import Node from "$nodes/Node.svelte";

  export let id: string;
</script>

<Node id={id} title="Spread" color="--blue">
  <div class="NodeContent" slot="body">
    <h4> TODO: Spread diagram </h4>
  </div>
</Node>
