<script lang="ts">
  import Node from "$nodes/Node.svelte";
  import Port from "$parts/Port.svelte";
</script>

<Node title="Spread" color="--blue" {...$$props}>
  <div class="PortGroup" slot="inputs">
    <Port label="seed"  mode="in" type="number" />
    <Port label="step"  mode="in" type="number" filled />
    <Port label="times" mode="in" type="number" />
  </div>

  <div class="PortGroup" slot="outputs">
    <Port label="value" mode="out" type="number" />
  </div>
</Node>
