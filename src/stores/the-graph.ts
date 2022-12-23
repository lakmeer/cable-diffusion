
import type { Readable, Writable } from 'svelte/store'
import type { Graph, Node, Edge, Port, Result } from "$types"
import type { Value } from "$types"
import type { NodeSpec } from "$lib/graph/spec"

import { get, writable, derived } from 'svelte/store'
import { compare, format as formatValue } from '$lib/graph/value'
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
  if (portId === 'out') {
    return derived(theGraph, $graph => $graph.nodes.find(n => n.id === nodeId).outport)
  } else {
    return derived(theGraph, $graph => $graph.nodes.find(n => n.id === nodeId).inports[portId])
  }
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

export const setPortValue = (nodeId:string, portName:string, value:Value) => {
  updateNodePort(nodeId, portName, { value, multi: value.size > 1 })
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

export const removeNodePort = (nodeId:string, portName:string) => {
  mutateNodes(nodes => nodes.map(storedNode => {
    if (storedNode.id !== nodeId) return storedNode

    if (portName === 'out') {
      return { ...storedNode, outport: null }
    } else {
      const newPorts = { ...storedNode.inports }
      delete newPorts[portName]
      return { ...storedNode, inports: newPorts }
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

export const findEdge = (nodeId:string, portName:string) =>
  get(theGraph).edges.find(e => e.from.id === nodeId && e.from.port === portName)

export const updateEdge = (nodeId:string, portName:string, updates:any) =>
  mutateEdges(edges => edges.map(storedEdge =>
    (storedEdge.from.id !== nodeId && storedEdge.from.port !== portName)
      ? storedEdge
      : { ...storedEdge, ...updates }))



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

  if (node.state.busy && node.config.blocking) {
    return warnNode(node, "is busy");
  }

  logNode(node, 'Running...' + (force ? '(forced)' : ''))

  updateNodeState(nodeId, { busy: true, bounced: false })


  // Debouncing

  const timeSinceLastRun = time - node.state.time

  if (timeSinceLastRun < node.config.debounce) {
    if (!node.state.bounced) {
      updateNodeState(nodeId, { bounced: true, time })
      setTimeout(() => {
        runSingleNode(nodeId)
      }, node.config.debounce - timeSinceLastRun)
      return warnNode(node, "debounced, waiting", node.config.debounce - timeSinceLastRun, "ms")
    }
  }


  // Port Typechecking

  const ports = Object.entries(node.inports);

  ports.forEach(([name, port]) => {
    if (port.type === 'any') return;
    if (port.type !== port.value.type) {
      updateNodeState(nodeId, { busy: false, error: true, time })
      throw new TypeError(`Port ${nodeId}.${name} expected ${port.type}, got ${port.value.type}`)
    }
  });


  // Actual computation

  const result:Result<Value> = await node.compute(node.state, node.inports)

  //await sleep(500)

  if (!result.ok) {
    console.error(formatNode(node), "computation failed:", result.error, node.state, node.inports)
    return updateNodeState(nodeId, { error: result.error, busy: false, time })
  }

  const resultValue = result.unwrap()

  // If node has an update function (optional), run that with reference to the 
  // computed result
  if (node.config.update) {
    const delta = node.config.update(node, resultValue);
    if (delta) updateNode(nodeId, delta) // ignore failure to return a delta
  }

  logNode(node, "yields", formatValue(resultValue))


  // Flow results onward unless output didn't change

  if (node.outport) {
    const changed = !compare(resultValue, node.outport.value)

    if (changed) {
      logNode(node, node.outport.value.value, "=>", resultValue.value)
    } else if (!changed && force) {
      logNode(node, 'no change (but updates were forced)')
    } else {
      logNode(node, 'no change')
      return updateNodeState(nodeId, { busy: false, error: false, time })
    }
  }

  updateNodeState(nodeId, { busy: false, error: false, time })

  if (node.outport) {
    // Find connected edges and update inport value with new value
    // Save any found nodes for the next pass

    setPortValue(nodeId, 'out', resultValue)

    // If the yielded value changed size, update the outport and connected edge
    if (resultValue.multi !== node.outport.multi) {
      const edge = findEdge(nodeId, 'out')
      updateEdge(edge.from.id, edge.from.port, { multi: resultValue.multi })
    }

    const next = get(theGraph).edges
      .filter(e => e.from.id === nodeId) // Get edges from this outport
      .filter(e => e.to.id   !== nodeId) // Never link to self
      .map(e => {
        setPortValue(e.to.id, e.to.port, resultValue)
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

  const inports = { ...node.inports, [portId]: node.config.newPort() }
  updateNode(nodeId, { inports })
}


export const runGraph = async () => {
  if (ENABLE_LOGGING) {
    red("New graph run...")
  }

  await Promise.all(get(allNodes)
    .filter(n => !get(allEdges).some(e => e.to.id === n.id))
    .map(n => runSingleNode(n.id, true)))
}



//
// Loading & Saving
//

type GraphSpec = { nodes: NodeSpec[], edges: Edge[] }

export const loadSpec = (spec: GraphSpec) => {

  const graph:Graph = { nodes: [], edges: [] }

  // For each node, complete the spec
  graph.nodes = spec.nodes.map((node:NodeSpec) => node.done())

  // For each edge, find the matching ports and mark them as filled
  spec.edges.forEach(edge => {
    const fromNode = graph.nodes.find(n => n.id === edge.from.id)
    const toNode   = graph.nodes.find(n => n.id === edge.to.id)

    fromNode.outport.filled = true
    toNode.inports[edge.to.port].filled = true

    edge.type = fromNode.outport.type

    if (fromNode.outport.multi) {
      edge.multi = true
      toNode.inports[edge.to.port].multi = true
    }

    graph.edges.push(edge)
  })

  theGraph.set(graph)
}

