
import type { NodeSpec } from '../lib/graph/spec'
import type { Result } from '../lib/result';


//
// Types used by the Graph
//

// Value
//
// Wraps the values flowing through the graph. Has a type and flags for
// managing multivalues, where the value is an array of values.
//
// TODO: Probably I will change this so that all values in the system are
// multivalues and all nodes so a matrix multiply type thing during compute.

export type Value = {
  type:  string,
  multi: boolean,
  size:  number,
  value: any,
}


// Port
//
// A port is a named value that can be connected to other ports. It has
// a type which will be used to validate connections, and a value which
// is a Value object. It also has properties that are used to control
// the UI, such as tracking where it's parent node renders it to the screen.

export type Port = {
  type:       string,
  label?:     string,
  x:          number,
  y:          number,
  value:      Value,
  multi:      boolean,  // Whether this port accepts/expects multivalues
  filled:     boolean,  // Whether there is a connection on this port
  removable:  boolean,  // Whether this port can be removed by the UI
  noSocket:   boolean,  // This is a port that does not accept connections
  noInput:    boolean,  // This is a nodetype that the user cannot change
                        // - TODO: I will probably remove this and just let
                        //    the node define bespoke inputs for these cases
}

export type PortGroup = {
  [key: string]:Port,
}



//
// Nodes
//

// NodeState
//
// Is used to track internal states of the node that
// are not relevant to the compute function.

export type NodeState = {
  busy:    boolean,         // Whether the node is computing (compute can be async)
  error:   string | false,  // A string here will be shown in the UI as an error
  time:    number,          // Timestamp of the last time this node was computed
  bounced: boolean,         // Whether the node got debounced last time
}


// NodeConfig
//
// Used to store the node's configuration, set at creation time.

export type NodeConfig = {
  dynamic:  boolean,      // Whether new ports can be added by the user
  blocking: boolean,      // Whether the node will ignore new values when busy
  debounce: number,       // The debounce time in ms

  // A function that runs once to set up any special data that the node requires
  init?:    (node:Node) => void,

  // A function that runs after `compute`, to keep special data up to date
  update?:  (node:Node, result:Value) => void,

  // A function that generates new ports
  newPort?: (node:Node) => Port,
}


// NodeData
//
// Any bespoke data that the node needs for it's job. Can be manipulated
// by the `update` function, and will be passed to the computer function
// to produce new values.

export type NodeData = {
  [key:string]: any,
}


// Computer
//
// The function that computes the node's output value. Takes the node's
// data object and it's inport group and returns a Promise<Result<Value>>.
// This result is what this node's outport will provide to downstream nodes.

export type Computer = (data:NodeData, inports:PortGroup) =>
  Promise<Result<Value>>


// Node
//
// Puts the above parts together, plus a unique id, it's position on the
// screen, and a type. Note this type is not the same as a Value type, it
// is the type of the node, reflecting it's job (e.g. "Add", "Subtract")

export type Node = {
  id:         string,
  type:       string,
  x:          number,
  y:          number,
  state:      NodeState,
  data:       NodeData,
  config:     NodeConfig,
  inports:    PortGroup,
  outport:    Port,       // TODO: I will probably allow multiple outports
  compute:    Computer,
}



//
// Edges
//

export type Edge = {
  from:   { id: string, port: string },
  to:     { id: string, port: string },
  type?:  string,
  multi?: boolean,
}



//
// Other Graph Types
//

export type Graph = {
  nodes: Node[],
  edges: Edge[],
}

export type NodeDelta = {
  [key:string]: any,
}

export type NodeConstructor = (node:Node) =>
  Node | NodeSpec


