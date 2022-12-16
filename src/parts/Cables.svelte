<script lang="ts">
  import type { Curve } from "$types";

  import { onMount } from 'svelte';

  import theGraph from "$store/the-graph";


  // State

  let width:number = 0;
  let height:number = 0;

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let cables = [];

  theGraph.subscribe( ({ cables: _cables }) => {
    cables = _cables;
    if (ctx) redraw();
  });


  // Drawing Functions

  const drawCurve = (curve:Curve) => {
    console.log("drawCurve", curve);

    const { color, termA, termB, ctrlA, ctrlB } = curve;

    // NOTE: Haven't seen this bug in a while
    if (!termA || !termB) console.log(termA, termB);

    ctx.strokeStyle = color;

    // Control helpers
    ctx.lineWidth = 1;
    ctx.setLineDash([ 10, 10 ]);
    ctx.beginPath();
    ctx.moveTo(...termA);
    ctx.lineTo(...ctrlA);
    ctx.moveTo(...termB);
    ctx.lineTo(...ctrlB);
    ctx.stroke();

    // Main cable
    ctx.lineWidth = 4;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(...termA);
    ctx.bezierCurveTo(...ctrlA, ...ctrlB, ...termB);
    ctx.stroke();
  };

  const redraw = () => {
    ctx.clearRect(0, 0, width, height);
    cables.forEach(cable => drawCurve(cable.curve));
  }



  // TODO
  //
  // - Might need to replace svelte/store with custom mechanism
  // - setContext?
  // - Create unique subscription methods for each type, or take
  //    a unique id to give a custom subscriber
  //    - Update UI when subscription fires
  //    - Push data back into store when UI changes




  // Init

  onMount(() => ctx = canvas.getContext('2d'));

  $: if (canvas) {
    canvas.width  = width;
    canvas.height = height;
    redraw();
  }

  theGraph.subscribe(() =>  {if (ctx) { redraw }})
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
