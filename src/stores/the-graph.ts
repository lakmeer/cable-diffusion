
import type { Readable, Writable } from 'svelte/store'
import type { Graph, Node, Edge, Port } from "$types"

import { get, writable, derived } from 'svelte/store'
import { now, red, blue, defer, sleep } from "$utils"

const ENABLE_LOGGING = false



//
// Master State
//

let theGraph:Writable<Graph> = writable({ nodes: [], edges: [] })



//
// Stores and Derived Stores
//

export default theGraph

export const allNodes:Readable<Node[]> =
  derived(theGraph, $graph => Object.values($graph.nodes))

export const nodeSpy = (nodeId):Readable<Node> =>
  derived(theGraph, $graph => $graph.nodes.find(n => n.id === nodeId))

export const allEdges:Readable<Edge[]> =
  derived(theGraph, $graph => $graph.edges)

export const edgesFrom = (nodeId):Readable<Edge[]> =>
  derived(theGraph, $graph => $graph.edges.filter(e => e.from.id === nodeId))

export const portSpy = (nodeId, portId):Readable<Port> => {
  return derived(theGraph, $graph => $graph.nodes.find(n => n.id === nodeId).inports[portId])
}


//
// Mutators
//

type NodeMutator = (a: Node[]) => Node[]

const mutateNodes = (fn:NodeMutator) =>
  theGraph.update(graph => ({
    nodes: fn(graph.nodes),
    edges: graph.edges
  }))

export const addNode = (node:Node) =>
  mutateNodes(nodes => nodes.concat(node))

export const updateNode = (nodeId:string, updates: any) => {
  if (typeof updates === 'function') { throw new Error("updateNode doesn't take a function") }

  mutateNodes(nodes => nodes.map(storedNode =>
    (storedNode.id !== nodeId) ? storedNode : { ...storedNode, ...updates }))
}

export const updateNodePort = (nodeId:string, portName:string, updates:any) => {
  mutateNodes(nodes => nodes.map(storedNode => {
    if (storedNode.id !== nodeId) return storedNode

    if (portName === 'out') {
      return { ...storedNode, outport: { ...storedNode.outport, ...updates } }
    } else {
      const newPort  = { ...storedNode.inports[portName], ...updates }
      const newPorts = { ...storedNode.inports, [portName]: newPort }
      return { ...storedNode, inports: newPorts }
    }
  }))
}

export const updateNodeState = (nodeId:string, updates:any) => {
  mutateNodes(nodes => nodes.map(storedNode => {
    if (storedNode.id !== nodeId) return storedNode

    if (typeof updates === 'function') {
      return { ...storedNode, state: updates(storedNode.state) }
    } else {
      return { ...storedNode, state: { ...storedNode.state, ...updates } }
    }
  }))
}


type EdgeMutator = (a: Edge[]) => Edge[]

const mutateEdges = (fn:EdgeMutator) =>
  theGraph.update(graph => ({
    nodes: graph.nodes,
    edges: fn(graph.edges)
  }))

export const addEdge = (edge:Edge) =>
  mutateEdges(edges => edges.concat(edge))



//
// Formatters
//

export const formatNode = (node:Node) =>
  `#${node.id}<${node.type}>`

export const logNode = (node, ...rest) =>
  ENABLE_LOGGING && blue(`${formatNode(node)} =>`, ...rest)

export const warnNode = (node, ...rest) =>
  ENABLE_LOGGING && red(`${formatNode(node)} =>`, ...rest)

export const dumpJson = () =>
  JSON.stringify(get(theGraph), null, 2)



//
// Execution
//

export const runNode = (nodeId:string) => runSingleNode(nodeId, true)

const runSingleNode = async (nodeId:string, force = false) => {

  const time = now()
  const node = get(nodeSpy(nodeId))

  if (!node) {
    return console.warn("Couldn't find node with id", nodeId)
  }

  if (node.state.busy && node.blocking) {
    return warnNode(node, "is busy");
  }

  logNode(node, 'Running...' + (force ? '(forced)' : ''))

  updateNodeState(nodeId, { busy: true, bounced: false })


  // Debouncing

  const timeSinceLastRun = time - node.state.time

  if (timeSinceLastRun < node.debounce) {
    if (!node.state.bounced) {
      updateNodeState(nodeId, { bounced: true, time })
      setTimeout(() => {
        runSingleNode(nodeId)
      }, node.debounce - timeSinceLastRun)
      return warnNode(node, "debounced, waiting", node.debounce - timeSinceLastRun, "ms")
    }
  }


  // Actual computation

  const result = await node.compute(node.state, node.inports)

  if (!result.ok) {
    console.error(formatNode(node), "computation failed:", result.error, node.state, node.inports)
    return updateNodeState(nodeId, { error: true, busy: false, time })
  }

  const newState = result.unwrap()

  // If node's computer didn't set `value` correctly, there's a problem
  if (newState.value === undefined || newState.value === null) {
    console.error(formatNode(node), "`value` not set:", newState)
    return updateNodeState(nodeId, { error: true, busy: false, time })
  }

  const changed = JSON.stringify(newState.value)
              !== JSON.stringify(node.state.value)

  if (changed) {
    logNode(node, node.state.value, "=>", newState.value)
  } else if (!changed && force) {
    logNode(node, 'no change (but updates were forced)')
  } else {
    logNode(node, 'no change')
    return updateNodeState(nodeId, { busy: false, error: false, time })
  }

  updateNodeState(nodeId, { ...newState, busy: false, error: false, time })


  // Find connected edges and update inport value with new value
  // Save any found nodes for the next pass
  if (node.outport) {
    const next = get(theGraph).edges
      .filter(e => e.from.id === nodeId) // Get edges from this outport
      .filter(e => e.to.id   !== nodeId) // Never link to self
      .map(e => {
        updateNodePort(e.to.id, e.to.port, { value: newState.value })
        return e.to.id
      })

    // Run downstream nodes
    await Promise.all(
      next.map(async (nextNodeId) =>
        defer(await (runSingleNode(nextNodeId)))))
  }

  logNode(node, 'Done')
}


export const addPort = (nodeId:string) => {

  const node = get(nodeSpy(nodeId))
  if (!node) throw new Error(`Node ${nodeId} not found`)

  const portId = `in${Object.keys(node.inports).length}`
  if (node.inports[portId]) throw new Error(`Port ${portId} already exists on node ${nodeId}`)

  const inports = { ...node.inports, [portId]: node.newPort() }
  updateNode(nodeId, { inports })
}


export const runGraph = async () => {
  if (ENABLE_LOGGING) {
    console.clear()
    red("New graph run...")
  }

  await Promise.all(get(allNodes)
    .filter(n => !get(allEdges).some(e => e.to.id === n.id))
    .map(n => runSingleNode(n.id, true)))
}



//
// Loading & Saving
//

export const loadSpec = (spec) => {

  const graph:Graph = { nodes: [], edges: [] }

  // For each node, create a store
  graph.nodes = spec.nodes.map(node => node.done())

  // For each edge, find the matching ports and mark them as filled
  spec.edges.forEach(edge => {
    const fromNode = graph.nodes.find(n => n.id === edge.from.id)
    const toNode   = graph.nodes.find(n => n.id === edge.to.id)

    fromNode.outport.filled = true
    toNode.inports[edge.to.port].filled = true

    edge.type  = fromNode.outport.type
    edge.multi = fromNode.multi

    graph.edges.push(edge)
  })

  theGraph.set(graph)
}

