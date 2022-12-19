
import type { Port, Computer } from '$types';
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

export const TwoInOneOut = (type: string) => (spec:NodeSpec) => {
  const startValue = type === 'number' ? 0 : ''
  return spec
    .initialState({ out: startValue, args: [] })
    .port('in0', PortSpec(type, startValue))
    .port('in1', PortSpec(type, startValue))
    .port('out', PortSpec(type, startValue, { label: 'Value' }))
}


export const MathBinary = TwoInOneOut('number')


