
import { NodeSpec } from "$lib/graph/spec"

export default {
  nodes: [
    new NodeSpec('List', 'list').at(50, 50)
      .data('type', 'string')
      .data('items', [
        "Alpha",
        "Beta",
        "Gamma",
        "Delta",
      ]),
    new NodeSpec('Random', 'rnd').at(450, 50),
    new NodeSpec('Random', 'rnd2').at(50, 250).data('max', 10),
    new NodeSpec('Output', "msg").at(850, 180),
  ],

  edges: [
    { from: { id: 'list',  port: 'out' }, to: { id: 'rnd', port: 'opt' } },
    { from: { id: 'rnd2',  port: 'out' }, to: { id: 'rnd', port: 'max' } },
    { from: { id: 'rnd',   port: 'out' }, to: { id: 'msg', port: 'text' } },
  ]
}
