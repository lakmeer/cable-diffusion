<script lang="ts">

  import { onMount, setContext } from 'svelte';

  import cableStore from "$store/cables";

  import type { Point, Cable, AnyDataflow } from "$types";

  let width:number = 0;
  let height:number = 0;

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let cables = [];
  cableStore.subscribe((all) => cables = all);


  // Drawing Functions

  const curve = (color: string, start: Point, end: Point, ctlA: Point, ctlB: Point) => {
    if (!start || !end) console.log(start, end);

    const [ x1, y1 ] = start;
    const [ x2, y2 ] = end;

    ctx.strokeStyle = color;

    // Control helpers
    ctx.lineWidth = 1;
    ctx.setLineDash([ 10, 10 ]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(...ctlA);
    ctx.moveTo(x2, y2);
    ctx.lineTo(...ctlB);
    ctx.stroke();

    // Main cable
    ctx.lineWidth = 4;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(...ctlA, ...ctlB, x2, y2);
    ctx.stroke();

  };

  const drawCable = (cable: Cable) => {
    const { color, termA, termB, ctrlA, ctrlB } = cable;
    curve(color, termA, termB, ctrlA, ctrlB);
  };


  // Init

  onMount(() => {
    ctx = canvas.getContext('2d');
    canvas.width  = width;
    canvas.height = height;
  });

  $: {
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      cables.forEach(drawCable);
    }
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
