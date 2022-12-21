<script type="ts">
  export let value: any;
  export let type: string;
  export let multi: boolean = false;
</script>


<div class="ValueDisplay">
  vd
  {#if multi}
    {#each value as v}
      <span> { v } </span>
    {/each}
  {:else}
    <span> { value } </span>
  {/if}
</div>


<style lang="postcss">

</style>
