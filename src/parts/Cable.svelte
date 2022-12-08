<script lang="ts">
  import type { Cable, Point, AnyDataflow } from "$types";

  import { cssVar } from '$utils';
  import dragging from '$lib/dragging';
  import { addCable, updateCable } from "$store/cables";

  export let id: string;
  export let type: AnyDataflow;
  export let termA: Point;
  export let termB: Point;
  export let ctrlA: Point;
  export let ctrlB: Point;
  export let color: string;

  if (color.substring(0,1) == '--') color = cssVar(color);

  // From this point on the original props will be ignored. I don't think that's
  // a good idea, but I don't know how to do integrate this with a store otherwise.
  let thisCable:Cable = { id, type, termA, termB, ctrlA, ctrlB, color };

  const update = (prop) => (event) => {
    thisCable[prop] = event.detail;
    updateCable(thisCable);
  }

  addCable(thisCable);
</script>


<div class="Cable" style="color: {color}">
  <div class="terminal handle" use:dragging on:drag={update('termA')} style="left: {termA[0]}px; top: {termA[1]}px" />
  <div class="terminal handle" use:dragging on:drag={update('termB')} style="left: {termB[0]}px; top: {termB[1]}px" />
  <div class="control  handle" use:dragging on:drag={update('ctrlA')} style="left: {ctrlA[0]}px; top: {ctrlA[1]}px" />
  <div class="control  handle" use:dragging on:drag={update('ctrlB')} style="left: {ctrlB[0]}px; top: {ctrlB[1]}px" />
</div>


<style lang="postcss">

  .handle {
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid currentColor;
    cursor: grab;

    transform: translate(-50%, -50%);
    transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;

    &:active {
      cursor: grabbing;
      border-width: 3px;
      transform: translate(-50%, -70%);
      box-shadow:
        0 1px 1px var(--shade-color),
        0 2px 2px var(--shade-color),
        0 4px 4px var(--shade-color),
        0 8px 8px var(--shade-color),
        0 16px 16px var(--shade-color);
    }

    &.terminal {
      background-color: currentColor;
    }

    &.control {
      background-color: var(--night);
    }
  }

</style>
