<script lang="ts">
  import Node from "$nodes/Node.svelte";
  import Port from "$parts/Port.svelte";

  export let id: string;
</script>

<Node id={id} title="Spread" color="--blue" {...$$props}>
  <div class="PortGroup" slot="inputs">
    <Port name="mid"   label="Seed"  mode="in" type="number" />
    <Port name="step"  label="Step"  mode="in" type="number" filled />
    <Port name="times" label="Times" mode="in" type="number" />
  </div>

  <div class="NodeContent">
    <h4> TODO: Spread diagram </h4>
  </div>

  <div class="PortGroup" slot="outputs">
    <Port name="out" label="value" mode="out" type="number" />
  </div>
</Node>
