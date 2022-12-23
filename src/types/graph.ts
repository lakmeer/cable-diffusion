
import type { NodeSpec } from '../lib/graph/spec'
import type { Result } from '../lib/result';


//
// Types used by the Graph
//

export type Value = {
  type:  string,
  multi: boolean,
  value: any,
  size:  number,
}

export type Port = {
  type:     string,
  label:    string | null,
  x:        number,
  y:        number,
  value:    Value,
  multi:    boolean,
  noSocket: boolean,
  noInput:  boolean,
  filled:   boolean,
  removable:boolean,
}

export type PortGroup = {
  [key: string]:Port,
}

export type NodeState = {
  busy:    boolean,
  error:   boolean,
  time:    number,
  bounced: boolean,
  [key:string]:any,
}

export type Node = {
  id:         string,
  x:          number,
  y:          number,
  type:       string
  state:      NodeState,
  dynamic:    boolean,
  blocking:   boolean,
  debounce:   number,
  inports:    { [tag:string]: Port },
  outport:    Port,
  compute:    Computer,
  updateFn?:  (node:Node, result:Value) => NodeDelta,
  initFn?:    (node:Node) => Node,
  newPort?:   () => Port,
}

export type Edge = {
  from:   { id: string, port: string },
  to:     { id: string, port: string },
  type?:  string,
  multi?: boolean,
}

export type Graph = {
  nodes: Node[],
  edges: Edge[],
}

export type NodeDelta = {
  [key:string]: any,
}

export type Computer = (state:NodeState, inports:PortGroup) =>
  Promise<Result<Value>>

export type NodeConstructor = (node:Node) =>
  Node | NodeSpec


