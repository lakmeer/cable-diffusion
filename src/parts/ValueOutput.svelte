<script lang="ts">
  import type { Value } from '$types'
  import ValueDisplay from '$parts/ValueDisplay.svelte'

  export let type:string;
  export let value:Value;
</script>


<div class="DisplayOutput {type}">
  <ValueDisplay {type} {value} align="right" />
</div>


<style lang="postcss">
  .DisplayOutput {
    min-height: var(--port-height);
  }
</style>
