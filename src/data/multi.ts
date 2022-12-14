
import { NodeSpec } from "$lib/graph/spec"

export default {
  nodes: [
    new NodeSpec('Sum',   "add").at(450, 100)
      .setPort('in0', 5)
      .setPort('in1', [ 10, 20, 30 ]),

    new NodeSpec('Output',"msg").at(850, 100),
  ],
  edges: [
    { from: { id: 'add',   port: 'out' }, to: { id: 'msg', port: 'text' }, multi: true },
  ]
}
