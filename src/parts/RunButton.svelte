<script lang="ts">
  import Fa from 'svelte-fa'
  import { faPlay, faRotateRight } from '@fortawesome/free-solid-svg-icons'
  import { createEventDispatcher } from 'svelte'

  export let running:boolean

  const emit = createEventDispatcher()
</script>

<button class="RunButton" class:running on:click={() => emit('run')}>
  <Fa icon={ running ? faRotateRight : faPlay} spin={running} />
</button>


<style lang="postcss">

  .run-button {
    font-size: 1.2rem;
    padding: 4px;
  }

</style>
