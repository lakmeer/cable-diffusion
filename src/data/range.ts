
import { NodeSpec } from "$lib/graph/spec"

export default {
  nodes: [
    new NodeSpec('Range',  "range").at( 50, 50).setPort('min', 1).setPort('max', 2),
    new NodeSpec('Product',  "mul").at(450, 100).setPort('in1', 2),
    new NodeSpec('Output',   "msg").at(850, 100),

    new NodeSpec('Spread',   "spr").at( 50, 350),
    new NodeSpec('Product', "mul2").at(450, 400).setPort('in1', 3),
    new NodeSpec('Output',  "msg2").at(850, 400),
  ],
  edges: [
    { from: { id: 'range', port: 'out' }, to: { id: 'mul',  port: 'in0'  } },
    { from: { id: 'mul',   port: 'out' }, to: { id: 'msg',  port: 'text' } },
    { from: { id: 'spr',   port: 'out' }, to: { id: 'mul2', port: 'in0'  } },
    { from: { id: 'mul2',  port: 'out' }, to: { id: 'msg2', port: 'text' } },
  ]
}
