
import type { NodeSpec } from '../lib/graph/spec'
import { Result, Ok, Err } from './result';


//
// Types used by the Graph
//

export type Port = {
  type:     string,
  label:    string | null,
  x:        number,
  y:        number,
  value:    any,
  noSocket: boolean,
  filled:   boolean,
  removable:boolean,
}

export type NodeState = {
  value:   any,
  busy:    boolean,
  error:   boolean,
  time:    number,
  bounced: boolean,
  [key:string]:any,
}

export type PortGroup = {
  [key: string]:Port,
}

export type Node = {
  id:         string,
  x:          number,
  y:          number,
  type:       string
  state:      NodeState,
  multi:      boolean,
  dynamic:    boolean,
  blocking:   boolean,
  debounce:   number,
  inports:    { [tag:string]: Port },
  outport:    Port,
  compute:    Computer,
  initFn?:    (node:Node) => Node,
  newPort?:   () => Port,
}

export type Edge = {
  from:   { id: string, port: string },
  to:     { id: string, port: string },
  type?:  string,
}

export type Graph = {
  nodes: Node[],
  edges: Edge[],
}

export type Computer = (state:NodeState, inports:PortGroup) =>
  Promise<Result<NodeState>>

export type NodeConstructor = (node:Node) =>
  Node | NodeSpec


