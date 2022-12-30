
import { writable } from 'svelte/store';

import { addEdge } from '$store/the-graph';


type OriginSocket = {
  id:     string,
  port:   string,
  type:   string,
  x:      number,
  y:      number,
}

type SocketState = {
  dragging: boolean,
  x:        number,
  y:        number,
  origin:   OriginSocket | null,
}


let socketState:SocketState = {
  dragging: false,
  x: 0,
  y: 0,
  origin: null,
}


const sockets = writable(socketState)

export default sockets

export const startCable = (id:string, port:string, type:string, x:number, y:number) => {
  sockets.update(() => {
    return {
      dragging: true, x, y, 
      origin: { id, port, type, x, y }
    }
  })
}

export const abortCable = () => {
  sockets.update((s) => {
    return { ...s, dragging: false, origin: null }
  })
}

export const completeCable = (id:string, port:string) => {
  sockets.update((s) => {
    const { origin } = s

    addEdge({
      from: { id: origin.id, port: origin.port },
      to:   { id, port },
      type: origin.type,
    })

    return { ...s, dragging: false, origin: null }
  })
}

export const dragUpdate = (x, y) => {
  sockets.update((s) => {
    return { ...s, x, y }
  })
}


