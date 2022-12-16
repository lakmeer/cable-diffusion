
export type Port = {
  type: string,
  label: string | null,
  x: number,
  y: number,
  value: any,
  filled: boolean,
  removable: boolean,
}

export type PortGroup = {
  [key: string]: Port,
}

export type Node = {
  id: string,
  x: number,
  y: number,
  type: string
  busy: boolean
  multi: boolean,
  error: boolean,
  state: NodeState,
  inports: { [tag:string]: Port },
  dynamic: boolean,
  outport: Outport,
  compute: Computer,
}

export type Edge = {
  from: { id: string, port: string },
  to:   { id: string, port: string },
}

export type NodeState = {
  out:           any,
  [key:string] : any,
}

export type Graph = {
  nodes: Node[],
  edges: Edge[],
}

export type Computer = (state:NodeState, inports:PortGroup) =>
  Promise<Result<NodeState, Err>>

