
import { getCssValue } from '$utils';


type DragState = {
  x: number,
  y: number,
  dragging: boolean,
}


//
// Dragging Hook
//

export default (node:HTMLElement, params?) => {

  // Node is blank, try again when the DOM is ready
  if (!node) return;

  // If there's no params at all, use the node as it's own target
  if (!params) params = {target: node};

  const target = params.target;

  // Each consumer gets a unique state
  const state:DragState = {
    x: getCssValue(target, 'left'),
    y: getCssValue(target, 'top'),
    dragging: false,
  }

  // Emit custom events
  const emit = (type, x, y) =>
    node.dispatchEvent( new CustomEvent(type, { detail: [ x, y ] }));

  // Functions
  const start = () => {
    state.dragging = true
  }

  const stop = (event) => {
    state.dragging = false;
    emit('dragend', state.x, state.y);
  }

  const move = (event) => {
    if (state.dragging) {
      const { movementX, movementY } = event;
      state.x += movementX;
      state.y += movementY;
      target.style.left = `${state.x}px`;
      target.style.top  = `${state.y}px`;
      emit('drag', state.x, state.y);
    }
  }

  // Listeners
  node.addEventListener('mousedown', start)
  document.addEventListener('mouseup', stop)
  document.addEventListener('mousemove', move)

  // onDestroy
  return {
    destroy () {
      node.removeEventListener('mousedown', start)
      document.removeEventListener('mouseup', stop)
      document.removeEventListener('mousemove', move)
    }
  }
}

