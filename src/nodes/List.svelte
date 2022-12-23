<script lang="ts">
  import Node from "$nodes/Node.svelte"
  import IconButton from "$parts/IconButton.svelte"
  import ValueInput from "$parts/ValueInput.svelte"

  import { nodeSpy, updateNodeData } from "$store/the-graph"

  export let id: string;

  let node = nodeSpy(id);
  $: items = $node.data.items
  

  const onItemUpdate = (ix, value) => {
    console.log("onItemUpdate", ix, value)
    updateNodeData(id, 'items', items.map((item, jx) => ix === jx ? value : item))
  }

  const removeItem = (ix) =>
    updateNodeData(id, 'items', items.filter((_, jx) => ix !== jx))
</script>


<Node id={id} title="List" color="--green">
  <div slot="extra-actions">
    <IconButton icon="plus" on:click={() => updateNodeData(id, 'items', [...items, ''])} />
  </div>

  <div class="ListInput" slot="body">
    {#each items as item, ix (ix)}
      <div class="ListInputItem">
        <ValueInput value={item} on:change={(e) => onItemUpdate(ix, e.detail)} />
        <IconButton small subtle icon="minus" on:click={() => removeItem(ix)}>-</IconButton>
      </div>
    {/each}
  </div>
</Node>


<style lang="postcss">

  .ListInput {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .ListInputItem {
    display: flex;
    gap: var(--std-gap);
  }

</style>
