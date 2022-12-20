<script lang="ts">
  import type { Writable } from 'svelte/store'
  import type { Cable } from "$types"

  import { onMount, setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { cssVar, rgbLerp } from '$utils'


  // State

  let width:number  = 0
  let height:number = 0
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D


  // Shared Context is a list of Cables (curve with metadata)

  let cables:Writable<Cable[]> = writable([])
  setContext('curves', cables)


  // Drawing Functions

  const drawCable = ({ type, multi, brightness, curve }:Cable) => {
    const { termA, termB, ctrlA, ctrlB } = curve

    const color = rgbLerp(cssVar(`type-${type}`), '#ffffff', brightness)

    // Control helpers
    /*
      ctx.lineWidth = 1
      ctx.setLineDash([ 10, 10 ])
      ctx.beginPath()
      ctx.moveTo(...termA)
      ctx.lineTo(...ctrlA)
      ctx.moveTo(...termB)
      ctx.lineTo(...ctrlB)
      ctx.stroke()
    */

    // Main cable
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 4 + 2 * brightness

    ctx.moveTo(termA.x, termA.y)
    ctx.bezierCurveTo(ctrlA.x, ctrlA.y, ctrlB.x, ctrlB.y, termB.x, termB.y)

    if (multi) {
      ctx.lineWidth = 10 + 2 * brightness
      ctx.stroke()

      // Resume normal operation
      ctx.strokeStyle = cssVar('bg-color')
      ctx.lineWidth = 4 - 1 * brightness
    }

    ctx.stroke()

  }

  const drawAll = (cables: Cable[]) => {
    ctx?.clearRect(0, 0, width, height)
    cables.forEach(drawCable)
  }


  // Init

  onMount(() => ctx = canvas.getContext('2d'))

  drawAll($cables)

  $: if (canvas) {
    canvas.width  = width;
    canvas.height = height;
    drawAll($cables)
  }
</script>


<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<div class="Canvas">
  <canvas bind:this={canvas} />

  <slot />
</div>


<style lang="postcss">

  .Canvas {
    position: relative;
    background: var(--white);
    width: 100%;
    height: 100vh;
  }

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background: var(--night);
    pointer-events: none;
  }

</style>
