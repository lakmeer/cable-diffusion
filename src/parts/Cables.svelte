<script lang="ts">
  import type { Curve } from "$types";

  import { onMount, tick } from 'svelte';

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

  const redraw = async () => {
    await tick();
    ctx.clearRect(0, 0, width, height);
    cables.forEach(cable => drawCurve(cable.curve));
  }


  // Init

  onMount(() => ctx = canvas.getContext('2d'));

  $: if (canvas) {
    canvas.width  = width;
    canvas.height = height;
    redraw();
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
