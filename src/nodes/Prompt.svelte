<script lang="ts">
  import Node from "$nodes/Node.svelte"
  import Port from "$parts/Port.svelte"
</script>


<Node title="Prompt" color="--lime" {...$$props}>
  <div class="PortGroup" slot="inputs">
    <Port label="pos" mode="in" type="string" multiline />
    <Port label="neg" mode="in" type="string" multiline />
  </div>

  <div class="PortGroup" slot="outputs">
    <Port label="value" mode="out" type="number" />
  </div>
</Node>

