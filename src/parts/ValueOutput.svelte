<script lang="ts">
  import type { Value } from '$types'

  export let type:string;
  export let value:Value;
</script>


<div class="DisplayOutput {type}" style="--type-color: var(--type-{type})">
</div>


<style lang="postcss">
  .DisplayOutput {
    min-height: var(--port-height);
  }
</style>
