
import type { Node, Port, PortGroup, Computer, NodeState } from './types'

import * as Nodes from './nodes'



//
// Spec Builder API
//


// Helpers

const merge = (node, delta) => {
  if (typeof delta === 'function') {
    Object.assign(node, delta(node))
  } else {
    Object.assign(node, delta)
  }
}


// Fluent 'Builder' Class

export class NodeSpec {

  constructor (type: string, id: string) {

    this.node = {
      id: id,
      x: 0,
      y: 0,
      type: type,
      state: { out: null },
      busy: false,
      multi: false,
      dynamic: false,
      inports: { },
      outport: null,
      compute: async (state, ports) => Promise.resolve(Ok(state))
    } as Node;

    this.deltas = []
    this.custom = []
  }

  at (x: number, y: number) {
    this.deltas.push({ x, y })
    return this
  }

  initialState (state:NodeState) {
    this.deltas.push({ state })
    return this
  }

  state (key: string, value: any) {
    this.deltas.push({ state: { [key]: value } })
    return this
  }

  setMultiple(multiple: boolean = true) {
    this.deltas.push({ multi: multiple })
    return this
  }

  setDynamic (newPortFn: (id: string) => Port) {
    this.deltas.push({ dynamic: true })
    this.deltas.push({ newPort: newPortFn })
    return this
  }

  compute (fn: (state: any, ports: Port[]) => Promise<Result>) {
    this.deltas.push({ compute: fn })
    return this
  }

  port (portId: string, port: Port) {
    if (portId === 'out') {
      this.deltas.push({ outport: port })
    } else {
      this.deltas.push(({ inports }) => ({ inports: { ...inports, [portId]: port } }))
    }
    return this
  }

  done () {

    let node = this.node;

    // Split deltas into custom and builtins so we can apply
    // the builtins first (even tho they are defined last)
    this.custom = Array.from(this.deltas)
    this.deltas = []

    // Dispatch to node definitions to provide builtin deltas
    switch (node.type) {
      case 'Const':  Nodes.Const(this);   break;
      case 'Add':    Nodes.Add(this);     break;
      case 'Output': Nodes.Output(this);  break;
      case 'Spread': Nodes.Spread(this);  break;
      case 'Range':  Nodes.Range(this);   break;
      case 'Prompt': Nodes.Prompt(this);  break;
      default: console.warn(`Unsupported node type: ${node.type}`)
    }

    // Apply custom deltas
    this.deltas.forEach(delta => merge(node, delta))
    this.custom.forEach(delta => merge(node, delta))

    // Sanity Checks
    if (node.type === 'unknown') {
      console.warn(`Node #${node.id} was initialised with no type`)
    }

    if (node.dynamic && typeof node.newPort !== 'function') {
      console.warn(`Node #${node.id}<${node.type}> is dynamic but has no newPort function`)
    }

    return node;
  }

  dehydrate () {
    return JSON.parse(JSON.stringify(this))
  }

}

