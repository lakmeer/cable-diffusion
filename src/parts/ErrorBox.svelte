<script lang="ts">
  export let x:number;
  export let y:number;

  let dom:HTMLElement;
  $: dom && console.error(dom.textContent);
</script>


<div bind:this={dom} class="ErrorBox" style="top: {y}px; left: {x}px">
  <slot />
</div>


<style>
  .ErrorBox {
    z-index: 100;
    position: absolute;
    padding: 0.5rem 1rem;
    background-color: var(--error);
    color: var(--white);
    border-radius: var(--node-radius);
    box-shadow:
      0 0 1.0rem var(--error),
      0 0 2.0rem var(--error);
    font-size: 1.8rem;
    line-height: 1.5;
    max-width: 300px;
  }
</style>

