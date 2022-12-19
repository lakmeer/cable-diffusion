
import type { Port } from '$types';
import type { NodeSpec } from './spec'

import { Ok, Err } from "$lib/result"
import { defer } from "$utils"



// Port Helper (not a builder)

export const PortSpec = (type:string, value:any = null, others:any = {}):Port => ({
  x: 0,
  y: 0,
  type,
  value,
  label: null,
  filled: false,
  noSocket: false,
  removable: false,
  ...others
})



//
// Pre-made Templates for common node types
//

export const MathBinary = (op) =>
  (spec:NodeSpec) =>
    spec
      .initialState({ out: 0, args: [] })
      .port('in0', PortSpec('number', 0))
      .port('in1', PortSpec('number', 0))
      .port('out', PortSpec('number', 0, { label: 'Value' }))
      .setBlocking(false)
      .debounce(100)
      .setDynamic(() => PortSpec('number', 0, { removable: true }))
      .compute(async (_, ports) => {
        const args = Object.values(ports).map(p => p.value)

        if (args.some(v => typeof v !== 'number')) {
          return defer(Err('Add::Error - invalid input'))
        }

        return defer(Ok({
          args,
          value: op(...args)
        }))
      })
