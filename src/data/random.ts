
import { NodeSpec } from "$lib/graph/spec"

export default {
  nodes: [
    new NodeSpec('List',   'list').at(50, 50)
      .data('type', 'string')
      .data('list', [
        "Alpha",
        "Beta",
        "Gamma",
        "Delta",
        "Epsilon",
        "Zeta",
      ]),

    new NodeSpec('Random', 'rnd').at(50, 250),
    new NodeSpec('Output', "msg").at(850, 100),
  ],
  edges: [
    { from: { id: 'list',  port: 'out' }, to: { id: 'rnd', port: 'opt' } },
    { from: { id: 'rnd',   port: 'out' }, to: { id: 'msg', port: 'text' } },
  ]
}
