
import { NodeSpec } from "$lib/graph/spec"

export default {
  nodes: [
    new NodeSpec('Range',  "range").at( 50, 50).setPort('min', 1).setPort('max', 2),
    new NodeSpec('Multiply', "mul").at(450, 100).setPort('in1', 2),
    new NodeSpec('Output',   "msg").at(850, 100),
  ],
  edges: [
    { from: { id: 'range', port: 'out' }, to: { id: 'mul', port: 'in0' } },
    { from: { id: 'mul',   port: 'out' }, to: { id: 'msg', port: 'text' } },
  ]
}
