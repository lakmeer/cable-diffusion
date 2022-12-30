<script lang="ts">
  import type { Writable } from 'svelte/store'
  import type { Cable } from "$types"

  import { writable } from 'svelte/store'
  import { onMount, onDestroy, setContext } from 'svelte'
  import { cssVar, rgbLerp } from '$utils'

  import sockets, { abortCable, dragUpdate } from '$store/sockets'


  // State

  let width:number  = 0
  let height:number = 0
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D


  // Shared Context is a writable store of Cables (curve with metadata)

  let cables:Writable<Cable[]> = writable([])
  setContext('curves', cables)


  // Drawing Functions

  const drawCable = ({ type, multi, brightness, curve }:Cable) => {
    const { termA, termB, ctrlA, ctrlB } = curve

    const color = rgbLerp(cssVar(`type-${type}`), '#ffffff', brightness)

    // Main cable
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 4 + 2 * brightness

    ctx.moveTo(termA.x, termA.y)
    ctx.bezierCurveTo(ctrlA.x, ctrlA.y, ctrlB.x, ctrlB.y, termB.x, termB.y)

    if (multi) {
      ctx.globalAlpha = 0.5 + 0.5 * brightness
      ctx.strokeStyle = 'white'
      ctx.setLineDash([ 4, 3 ])
      ctx.lineWidth = 10 ;
      ctx.stroke()

      ctx.globalAlpha = 1
      ctx.setLineDash([])
      ctx.strokeStyle = cssVar('bg-color')
      ctx.lineWidth = 8;
      ctx.stroke();

      // Resume normal operation
      ctx.lineWidth = 4 + 2 * brightness
    }

    ctx.strokeStyle = color
    ctx.stroke()
  }

  const drawAll = (cables: Cable[]) => {
    ctx?.clearRect(0, 0, width, height)
    cables.forEach(drawCable)
    if (inProgressCable) drawCable(inProgressCable)
  }


  // Keep one 'in-progress' cable that we will use for when the user is dragging
  // a new cable from a socket. Keep it in sync with the store that coordinates that.

  let inProgressCable: Cable | null;

  const onCableDrag = (event) => {
    const { clientX, clientY } = event
    dragUpdate(clientX, clientY)
  }

  const onDragAbort = () => {
    abortCable()
    drawAll($cables)
  }

  sockets.subscribe((socketState) => {

    if (!socketState.dragging) {
      inProgressCable = null
      return
    }

    const { origin, x, y } = socketState

    inProgressCable = {
      type:  'boolean',
      multi: false,     
      brightness: 0.5,
      curve: {
        termA: { x: origin.x, y: origin.y },
        termB: { x, y },
        ctrlA: { x: origin.x + 100, y: origin.y },
        ctrlB: { x: x - 100, y },
      }
    }

    drawAll($cables)
  })


  // Init

  onMount(() => {
    ctx = canvas.getContext('2d')
    window.addEventListener('mousemove', onCableDrag)
    window.addEventListener('mouseup', onDragAbort)
  })

  onDestroy(() => {
    window.removeEventListener('mousemove', onCableDrag)
    window.removeEventListener('mouseup', onDragAbort)
  })

  $: if (canvas) {
    canvas.width  = width
    canvas.height = height
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
  }

</style>
