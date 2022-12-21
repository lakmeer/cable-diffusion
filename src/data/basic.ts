
import { NodeSpec } from "$lib/graph/spec"

export default {
  nodes: [
    new NodeSpec('Const', 'a').at(50, 50).setPort('set', 7),
    new NodeSpec('Const', 'b').at(50, 250).setPort('set', 3),
    new NodeSpec('Add',      "add").at(450, 100),
    new NodeSpec('Output',   "msg").at(850, 100),
  ],
  edges: [
    { from: { id: 'a',     port: 'out' }, to: { id: 'add', port: 'in0' } },
    { from: { id: 'b',     port: 'out' }, to: { id: 'add', port: 'in1' } },
    { from: { id: 'add',   port: 'out' }, to: { id: 'msg', port: 'text' } },
  ]
}
