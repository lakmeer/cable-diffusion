
import { NodeSpec } from "$lib/graph/spec"

export default {
  nodes: [
    new NodeSpec('InputTest', "inputs").at( 450, 50),
    new NodeSpec('Const', 'c1').at( 50, 150),
    new NodeSpec('Const', 'c2').at( 50, 550),
  ],
  edges: [
    { from: { id: 'c1', port: 'out' }, to: { id: 'inputs', port: 'in7' } },
    { from: { id: 'c2', port: 'out' }, to: { id: 'inputs', port: 'inA' }, multi: true }
  ]
}
