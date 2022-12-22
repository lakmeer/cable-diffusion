<script lang="ts">
  export let checked: boolean = false
</script>


<div class="Toggle" class:checked>
  <input type="checkbox" bind:checked on:change />
</div>


<style lang="postcss">

  .Toggle {
    position: relative;
    height: 1.5rem;

    input[type="checkbox"] {
      width: 3rem;
      height: 1.5rem;
      appearance: none;
      cursor: pointer;
      background: var(--bg-color);
      border-radius: 1.5rem;
      margin: 0;

      &:focus {
        outline: none;
        box-shadow:
          0px 0px 5px 0px rgba(0,10,40,0.4) inset,
          0px 0px 2px 0px rgba(0,10,40,0.4) inset,
          0px 0px 0px 1px var(--node-text-color) inset;
      }
    }

    &:before, &:after {
      content: "";
      position: absolute;
      height: 1.5rem;
      top: 50%;
      left: 0;
      border-radius: 1.5rem;
      transform: translateY(-50%);
      pointer-events: none;
      opacity: 1;
    }

    // Inset
    &:before {
      width:  3rem;
      box-shadow: 0px 0px 4px 0px var(--shadow-color) inset;
      background: var(--slate);
      transition: background 0.2s;
      mix-blend-mode: hard-light;
    }

    // Handle
    &:after {
      background: var(--node-body-color);
      width:  1.1rem;
      height: 1.1rem;
      left: 0.27rem;
      transition: left 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 1px 1px 4px 0px var(--shadow-color),
        0px 0px 1px var(--highlight-color) inset;
    }

    &.checked {
      &:before {
        background: var(--bright);
      }

      &:after {
        left: 1.7rem;
      }
    }
  }
</style>
