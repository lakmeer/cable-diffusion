<script lang="ts">
  import Node from "$nodes/Node.svelte";
  import Port from "$parts/Port.svelte";

  export let id:string;
</script>

<Node id={id} title="Range" color="--red" {...$$props}>
  <div class="PortGroup" slot="inputs">
    <Port id="min"  label="Min"   mode="in" type="number" />
    <Port id="max"  label="Max"   mode="in" type="number" />
    <Port id="step" label="Steps" mode="in" type="number" />
  </div>

  <div class="PortGroup" slot="outputs">
    <Port id="out" label="value" mode="out" type="vector" />
  </div>
</Node>
