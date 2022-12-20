<script lang="ts">
  import type { Writable } from "svelte/store"
  import type { Cable, Curve } from "$types"

  import { getContext, onMount } from 'svelte'

  import { nodeSpy } from "$store/the-graph"
  import { hyp, v2add, xyOnly } from "$utils"

  export let from:  { id: string, port: string }
  export let to:    { id: string, port: string }

  export let index: number
  export let type:  string
  export let multi: boolean = false


  // Bezier Curve

  let color:string = `--type-${type}`

  let curve:Curve = {
    termA: { x: 0, y: 0 },
    termB: { x: 0, y: 0 },
    ctrlA: { x: 0, y: 0 },
    ctrlB: { x: 0, y: 0 },
  }

  let fromNode = nodeSpy(from.id)
  let toNode   = nodeSpy(to.id)

  $: dist = hyp($fromNode.outport, $toNode.inports[to.port])
  $: ctrlStrength = dist/2

  $: curve.termA = xyOnly($fromNode.outport)
  $: curve.termB = xyOnly($toNode.inports[to.port])
  $: curve.ctrlA = v2add($fromNode.outport, { x: ctrlStrength, y: 0 })
  $: curve.ctrlB = v2add($toNode.inports[to.port], { x: -ctrlStrength, y: 0 })


  // Brightness animation

  let brightness = 0
  $: if ($fromNode.state.busy) brightness = 1
  $: if (brightness > 0) requestAnimationFrame(() => brightness *= 0.9)
  $: if (brightness < 0.02) brightness = 0


  // Update cables collection

  let allCables:Writable<Cable[]> = getContext('curves')

  $: allCables.update((cables:Cable[]) =>
    cables.map((storedCable, ix) =>
      ix === index
        ? { curve, type, multi, brightness }
        : storedCable))

  onMount(() => $allCables[index] = { curve, type, multi, brightness })
</script>


<div id={index.toString()} class="Cable" style="color: {color}">
  {#each Object.entries(curve) as [ key, point ] (key)}
    <div class="{key} handle {type}"
       style="left: {point[0]}px; top: {point[1]}px" />
      <!-- use:dragging on:drag={setXY(key)} -->
  {/each}
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

    pointer-events: none;

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

    &.termA, &.termB {
      background-color: currentColor;
      display: none;
    }

    &.ctrlA, &.ctrlB {
      background-color: var(--night);
      display: none;
    }
  }

</style>
