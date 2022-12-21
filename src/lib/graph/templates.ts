
import type { Port } from '$types';
import type { NodeSpec } from './spec'

import { newValue } from '$lib/graph/value'
import { defaultValueForType } from "$utils"



// Port Helper (not a builder)

export const newPort = (type:string, others:any = {}):Port => {
  const initialValue = others.value ?? defaultValueForType(type)
  delete others.value

  return {
    x: 0,
    y: 0,
    type,
    value: newValue(type, initialValue),
    label: null,
    filled: false,
    noSocket: false,
    removable: false,
    ...others
  }
}


//
// Pre-made Templates for common node types
//

export const TwoInOneOut = (type: string) => (spec:NodeSpec) => {
  const startValue = defaultValueForType(type)
  return spec
    .port('in0', newPort(type, startValue))
    .port('in1', newPort(type, startValue))
    .port('out', newPort(type, startValue, { label: 'Value' }))
}


export const MathBinary = TwoInOneOut('number')


