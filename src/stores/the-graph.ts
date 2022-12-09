
import type { Cable, Point } from "$types";

import { pluck } from "$utils";
import { writable } from 'svelte/store';


// Data

type Node = {
  id: string,
  x: number,
  y: number,
}

type Graph = {
  nodes:  Node[],
  cables: Cable[],
}

const graph:Graph = { nodes: [], cables: [] }

const store = writable(graph)

const { update } = store;


// Helpers

type NodeMutator  = (a: Node[])  => Node[]
type CableMutator = (a: Cable[]) => Cable[]

const updateCables = (fn:CableMutator) =>
  update(graph => ({
    nodes: graph.nodes,
    cables: fn(graph.cables)
  }))

const updateNodes = (fn:NodeMutator) =>
  update(graph => ({
    nodes: fn(graph.nodes),
    cables: graph.cables
  }))


// Mutators

export default store;

export const findNode = (id:string) => {
  return graph.nodes.find(node => node.id === id)
}

export const addCable = (cable:Cable) =>
  updateCables(cables => cables.concat(cable))

export const updateCable = (cable:Cable) =>
  updateCables(cables => cables.map(storedCable =>
      (storedCable.id === cable.id) ? cable : storedCable))

