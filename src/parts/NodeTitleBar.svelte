<script lang="ts">
  export let grip:HTMLElement;
  export let title:string;
</script>


<div class="NodeTitleBar" bind:this={grip}>
  <slot name="left-actions" />
  <span> { title } </span>
  <slot name="right-actions" />
</div>


<style lang="postcss">

  .NodeTitleBar {
    cursor: move;
    font-weight: bold;
    text-align: center;
    font-size: larger;
    text-shadow: 0px 1px 3px var(--shade-color), 0px 1px 0px var(--shade-color);

    height: 50px;
    padding: 0 var(--std-pad);
    user-select: none;
    border-radius: var(--node-radius) var(--node-radius) 0 0;

    background-color: var(--title-bg);
    background-image: linear-gradient(
      to bottom right,
      var(--highlight-color) 10%,
      var(--shade-color) 100%
      );

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    border-bottom: 1px solid rgba(0,0,0,0.5);

    span {
      display: block;
      flex: 1;
      justify-self: center;
    }
  }

</style>
