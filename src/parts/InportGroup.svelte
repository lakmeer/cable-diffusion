<script lang="ts">
  import type { Port } from "$types";
  import Port from "$parts/Port.svelte"

  export let nodeId: string;
  export let inports: { [key:Port]: Port } = {};
</script>


<div class="PortGroup">
  {#each Object.entries(inports) as [name, port]}
    <Port mode="in" {nodeId} {name} {...port} />
  {/each}
</div>


