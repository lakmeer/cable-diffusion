<script lang="ts">
  import Node from "$nodes/Node.svelte"
  import Port from "$parts/Port.svelte"

  export let id: string;
</script>


<Node id={id} title="Prompt" color="--lime" {...$$props}>
  <div class="PortGroup" slot="inputs">
    <Port id="pos" label="Prompt"   mode="in" type="string" multiline />
    <Port id="neg" label="Negative" mode="in" type="string" multiline />
  </div>

  <div class="PortGroup" slot="outputs">
    <Port id="out" label="Value" mode="out" type="number" />
  </div>
</Node>

