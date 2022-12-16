<script lang="ts">
  export let grip:HTMLElement;
  export let title:string;
</script>


<div class="NodeTitleBar" bind:this={grip}>
   { title }
</div>


<style lang="postcss">

  .NodeTitleBar {
    cursor: move;
    font-weight: bold;
    text-align: center;
    font-size: larger;
    text-shadow: 0px 1px 3px var(--shade-color), 0px 1px 0px var(--shade-color);

    padding: var(--std-pad);
    user-select: none;
    border-radius: var(--node-radius) var(--node-radius) 0 0;

    background-color: var(--title-bg);
    background-image: linear-gradient(
      to bottom right,
      var(--highlight-color) 10%,
      var(--shade-color) 100%
    );
  }

</style>
