
import type { Readable, WritableStore } from 'svelte/store'
import type { Graph, Node, Edge, Port } from "$lib/graph/types"

import { get, writable, derived } from 'svelte/store'
import { log, blue, sleep, defer } from "$utils"


//
// Master State
//

let theGraph:WritableStore<Graph> = writable({ nodes: [], edges: [] })



//
// Derived Stores
//

export default theGraph

export const allNodes:Readable<Node[]> =
  derived(theGraph, $graph => Object.values($graph.nodes))

export const nodeSpy = (nodeId):Readable<Node> =>
  derived(theGraph, $graph => $graph.nodes.find(n => n.id === nodeId))

export const allEdges:Readable<Edge[]> =
  derived(theGraph, $graph => $graph.edges)


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

export const updateNode = (nodeId:string, updates: any) =>
  mutateNodes(nodes => nodes.map(storedNode =>
    (storedNode.id !== nodeId) ? storedNode : { ...storedNode, ...updates }))

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

export const logNode = (node, ...rest) => {}
  //blue(`${formatNode(node)} =>`, ...rest)

export const dumpJson = () =>
  JSON.stringify(get(theGraph), null, 2)


//
// Execution
//

export const runNode = (nodeId) => runSingleNode(nodeId, true)

const runSingleNode = async (nodeId, force = false) => {
  const node = get(nodeSpy(nodeId))

  if (!node)     return console.warn("Couldn't find node with id", nodeId)
  if (node.busy) return console.warn("Node is busy", nodeId)

  logNode(node, 'Running...', force ? '(forced)' : '')


  // Nodes will do computation with the `compute` method, which will take the current
  // state and the inport group, and should return Promise<Result<NodeState, Err>>
  // state. State can include whatever it likes for a particular node but must
  // have an 'out' property, which will be propagated to the outport.

  updateNode(nodeId, { busy: true })

  const result = await node.compute(node.state, node.inports)

  if (!result.ok) {
    console.error(formatNode(node), "computation failed:", result.error, node.state, node.inports)
    return updateNode(nodeId, { error: true, busy: false })
  }

  const newState = result.unwrap()

  // If node's computer didn't set `out` correctly, there's a problem
  if (newState.out === undefined || newState.out === null) {
    if (node.type !== 'Output') { // Unless it was Output
      console.error(formatNode(node), "`out` not set:", newState)
      return updateNode(nodeId, { error: true, busy: false })
    }
  }

  const changed = JSON.stringify(newState) !== JSON.stringify(node.state)

  if (changed) {
    logNode(node, node.state, "=>", newState)
  } else if (!changed && force) {
    logNode(node, 'no change (but updates were forced)')
  } else {
    logNode(node, 'no change')
    return updateNode(nodeId, { busy: false, error: false })
  }

  updateNode(nodeId, { busy: false, error: false, state: newState })


  // Find connected edges and update inport value with new value
  // Save any found nodes for the next pass
  if (node.outport) {
    const next = get(theGraph).edges
      .filter(e => e.from.id === nodeId) // Get edges from this outport
      .filter(e => e.to.id   !== nodeId) // Never link to self
      .map(e => {
        updateNodePort(e.to.id, e.to.port, { value: newState.out })
        return e.to.id
      })

    // Run downstream nodes
    await Promise.all(
      next.map(async (nextNodeId) =>
        defer(await (runSingleNode(nextNodeId)))))
  }

  logNode(node, 'Done')
}

export const runGraph = async (graph: Graph) =>
  await Promise.all(get(allNodes)
    .filter(n => !get(allEdges).some(e => e.to.id === n.id))
    .map(n => runSingleNode(n.id, true)))

/*
const addPort = (nodeId:string, port:Port) => {
  const node = testGraph.nodes.find(n => n.id === nodeId)
  if (!node) throw new Error(`Node ${nodeId} not found`)
  const portId = Object.keys(node.inports).length
  if (node.inports[portId]) throw new Error(`Port ${portId} already exists on node ${nodeId}`)
  node.inports[portId] = port
  stores[nodeId]?.update(oldNode => node)
}
*/


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

    graph.edges.push(edge)
  })

  theGraph.set(graph)
}

