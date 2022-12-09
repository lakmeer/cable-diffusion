<script lang="ts">
  import type { Curve, Point, AnyDataflow } from "$types";

  import { cssVar } from '$utils';

  import dragging from '$lib/dragging';

  import { addCable, updateCable } from "$store/the-graph";


  export let id:    string;
  export let from:  string;
  export let to:    string;
  export let type:  AnyDataflow;
  export let curve: Curve;

  const thisCable = { id, type, from, to, curve };

  if (curve.color.substring(0,1) == '--') curve.color = cssVar(curve.color);


  // From this point on the original props will be ignored. I don't think that's
  // a good idea, but I don't know how to do integrate this with a store otherwise.

  const update = (prop) => (event) => {
    thisCable.curve[prop] = event.detail;
    updateCable(thisCable);
  }

  const handleStyle = (prop: string) => `
    left: ${curve[prop][0]}px;
    top:  ${curve[prop][1]}px;
  `

  addCable(thisCable);
</script>


<div id={id} class="Cable" style="color: {curve.color}">
  <div class="terminal handle {type}" use:dragging on:drag={update('termA')} style={ handleStyle('termA') } />
  <div class="terminal handle {type}" use:dragging on:drag={update('termB')} style={ handleStyle('termB') } />
  <div class="control  handle {type}" use:dragging on:drag={update('ctrlA')} style={ handleStyle('ctrlA') } />
  <div class="control  handle {type}" use:dragging on:drag={update('ctrlB')} style={ handleStyle('ctrlB') } />
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
