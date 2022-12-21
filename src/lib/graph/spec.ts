
import type { Value, Node, Port, Computer, NodeState, NodeDelta } from '$types'

import { newValue } from "$lib/graph/value"
import { Ok } from '$lib/result'

import { now } from '$utils'
import * as Nodes from './nodes'



//
// Spec Builder API
//
// A convenient way to define nodes. Can be used to make new nodes in a
// live graph or to pre-define nodes for a saved graph.
//


// Helpers

const merge = (node:Node, delta:object) => {
  if (typeof delta === 'function') delta = delta(node)
  Object.assign(node, delta)
}



//
// Fluent 'Builder' Class
//

export class NodeSpec {

  node:     Node;
  deltas:   Array<object>;
  custom:   Array<object>;
  initFn:   (node: Node) => void;
  updateFn: (node: Node) => void;

  constructor (type: string, id: string) {
    this.node = {
      id:       id,
      x:        0,
      y:        0,
      type:     type,
      inports:  {},
      outport:  null,
      compute:  async () => Ok(newValue('number', 0)),
      state: {
        busy:     false,
        error:    false,
        time:     0,
        bounced:  false,
      },
      multi:    false,
      dynamic:  false,
      blocking: true,
      debounce: 0,
    } as Node;

    this.deltas = []
    this.custom = []
  }


  // .at
  //
  // Sets the visual position of the node.

  at (x: number, y: number) {
    this.deltas.push({ x, y })
    return this
  }


  // .initialState
  //
  // Set the internal state as a whole object.
  // Overwrites any existing state.

  initialState (delta: any) {
    this.deltas.push({ state: { delta } })
    return this
  }


  // .state
  //
  // Overwrite a single state property.

  state (key: string, value: any) {
    this.deltas.push({ state: { [key]: value } })
    return this
  }


  // .update
  //
  // Updates anything about the node, runs before computing new values.
  // Returns a delta object to be merged into the node.
  // Different from .compute which will actually send a new value to the outport.

  update (fn: (node: Node) => NodeDelta) {
    this.deltas.push({ update: fn })
    return this
  }


  // .setBlocking
  //
  // Enable/disable blocking.
  // Blocking nodes will not run again until the previous run finishes.
  // Non-blocking nodes will run every time a port value changes.

  setBlocking (flag: boolean = true) {
    this.deltas.push({ noblock: !flag })
    return this
  }


  // .setMultiple
  //
  // Enable/disable multiple mode.
  // Multiple nodes are connected to a multi-value edge, and
  // will run on an array of values, and pass on an array of values.

  setMultiple (flag: boolean = true) {
    this.deltas.push({ multi: flag })
    return this
  }


  // .setDynamic
  //
  // Enable dynamic ports on this node.
  // Sets whether this node can add or remove inports on the fly.
  // Takes a function that will be run to define the new port.

  setDynamic (newPortFn: (id: string) => Port) {
    this.deltas.push({ dynamic: true })
    this.deltas.push({ newPort: newPortFn })
    return this
  }


  // .debounce
  //
  // Debounce the node's compute function.
  // When it does run, it will run once with the latest input.
  // Any values received in the meantime will be discarded.

  debounce (ms: number) {
    this.deltas.push({ debounce: ms })
    return this
  }


  // .compute
  //
  // Set the Computer function on this node.
  // The Computer function takes the node state and inport values
  // and returns a Value object to be sent to the outport.
  // Doesn't return a delta

  compute (fn: Computer) {
    this.deltas.push({ compute: fn })
    return this
  }


  // .port
  //
  // Define an inport with a name and PortSpec object

  port (portId: string, port: Port) {
    if (portId === 'out') {
      this.deltas.push({ outport: port })
    } else {
      this.deltas.push(({ inports }) => ({ inports: { ...inports, [portId]: port } }))
    }
    return this
  }


  // .setPort
  //
  // Doesn't define a whole port but will set the manually-configured value on it's input

  setPort (portId: string, rawValue: any) {
    this.deltas.push(({ inports }) => ({
      inports: {
        ...inports,
        [portId]: {
          ...inports[portId],
          value: newValue(inports[portId].type, rawValue) 
        }
      }
    }))
    return this
  }


  // .init
  //
  // Final chance for the node to do some custom initialisation.
  // Takes and mutates the node object before finalising.

  init (fn: (node: Node) => void) {
    this.initFn = fn
    return this
  }


  // .done
  //
  // Stops taking builder instructions and builds the finished node.
  // Returns a real node instead of the builder API.
  // If you are defining a set of nodes for a future graph, stop
  // before calling done to leave it unhydrated. The graph init
  // function will run .done() to build you graph.

  done () {

    let node = this.node

    // Split deltas into custom and builtins so we can apply
    // the builtins first (even tho they are defined last)
    this.custom = Array.from(this.deltas)
    this.deltas = []

    // Dispatch to node definitions to provide builtin deltas
    if (Nodes[node.type]) {
      Nodes[node.type](this)
    } else {
      throw new Error(`Unsupported node type: ${node.type}`)
    }

    // Apply custom deltas
    this.deltas.forEach(delta => merge(node, delta))
    this.custom.forEach(delta => merge(node, delta))

    // Final setup
    node.state.time = now() - this.node.debounce  // Or it will bounce immediately
    if (this.initFn) this.initFn(node)

    // Sanity Checks
    if (node.type === 'unknown') {
      console.warn(`Node #${node.id} was initialised with no type`)
    }

    if (node.dynamic && typeof node.newPort !== 'function') {
      console.warn(`Node #${node.id}<${node.type}> is dynamic but has no newPort function`)
    }

    return node;
  }


  // .dehydrate
  //
  // Strip builder API and return plain JSON for storage.

  dehydrate () {
    return JSON.parse(JSON.stringify(this))
  }

}

