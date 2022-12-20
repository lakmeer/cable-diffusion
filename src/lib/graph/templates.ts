
import type { Value, Port, Computer } from '$types';
import type { NodeSpec } from './spec'

import { newValue } from '$lib/graph/value'
import { Ok, Err } from "$lib/result"
import { defer } from "$utils"



// Port Helper (not a builder)

export const newPort = (type:string, initialValue:any = 0, others:any = {}):Port => ({
  x: 0,
  y: 0,
  type,
  value: newValue(type, initialValue),
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
    .port('in0', newPort(type, startValue))
    .port('in1', newPort(type, startValue))
    .port('out', newPort(type, startValue, { label: 'Value' }))
}


export const MathBinary = TwoInOneOut('number')


