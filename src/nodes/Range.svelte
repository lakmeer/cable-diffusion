<script lang="ts">
  import Node from "$nodes/Node.svelte";
  import Port from "$parts/Port.svelte";
</script>

<Node title="Range" color="--red" {...$$props}>
  <div class="PortGroup" slot="inputs">
    <Port label="seed"  mode="in" type="number" />
    <Port label="step"  mode="in" type="number" />
    <Port label="times" mode="in" type="number" />
  </div>

  <div class="PortGroup" slot="outputs">
    <Port label="value" mode="out" type="vector" />
  </div>
</Node>
