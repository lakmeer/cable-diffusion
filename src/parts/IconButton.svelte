<script lang="ts">
  import Fa from 'svelte-fa'
  import { faHome, faPlay, faPlus, faMinus, faRotateRight } from '@fortawesome/free-solid-svg-icons'

  export let icon:string
  export let spin:boolean = false
  export let small:boolean = false
  export let subtle:boolean = false
</script>


<button class="IconButton {icon}" class:small class:subtle on:click|preventDefault>
  {#if icon === 'run'}
    <Fa icon={ spin ? faRotateRight : faPlay} {spin} />
  {:else if icon === 'plus'}
    <Fa icon={faPlus} />
  {:else if icon === 'minus'}
    <Fa icon={faMinus} />
  {:else}
    <Fa icon={faHome} />
  {/if}
</button>


<style lang="postcss">
  .IconButton {
    font-size: 1.2rem;
    padding:   3px;
    height:    36px;
    width:     36px;

    &.small {
      font-size: 0.8rem;
      height:    24px;
      width:     24px;
    }


    // Aesthetic adjustments

    &.run :global(svg) {
      transform: translateX(1px);
    }
  }
</style>
