<script lang="ts">
  import Fa from 'svelte-fa'
  import { faHome, faPlay, faPlus, faRotateRight } from '@fortawesome/free-solid-svg-icons'

  export let icon:string
  export let spin:boolean = false
</script>


<button class="IconButton" on:click|preventDefault>
  {#if icon === 'run'}
    <Fa icon={ spin ? faRotateRight : faPlay} {spin} />
  {:else if icon === 'plus'}
    <Fa icon={faPlus} />
  {:else}
    <Fa icon={faHome} />
  {/if}
</button>


<style lang="postcss">
  .IconButton {
    font-size: 1.2rem;
    padding:   0px;
    height:    36px;
    width:     36px;
  }
</style>
