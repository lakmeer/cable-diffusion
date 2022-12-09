<script lang="ts">
  import Node from "$nodes/Node.svelte";
  import Port from "$parts/Port.svelte";

  export let id: string;
</script>

<Node id={id} title="Spread" color="--blue" {...$$props}>
  <div class="PortGroup" slot="inputs">
    <Port id="mid"  label="seed"  mode="in" type="number" />
    <Port id="step" label="step"  mode="in" type="number" filled />
    <Port id="mid"  label="times" mode="in" type="number" />
  </div>

  <div class="NodeContent">
    <h4> TODO: Spread diagram </h4>
  </div>

  <div class="PortGroup" slot="outputs">
    <Port id="out" label="value" mode="out" type="number" />
  </div>
</Node>
