
import { NodeSpec } from "$lib/graph/spec"

export default {
  nodes: [
    new NodeSpec('Range',  "range").at( 50, 50).setPort('min', 1).setPort('max', 3),
    new NodeSpec('Subtract', "sub").at(450, 100).setPort('in1', 2),
    new NodeSpec('Output',   "msg").at(850, 100),
  ],
  edges: [
    { from: { id: 'range', port: 'out' }, to: { id: 'sub', port: 'in0' } },
    { from: { id: 'sub',   port: 'out' }, to: { id: 'msg', port: 'text' } },
  ]
}
