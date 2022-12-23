
import type { Value, Computer } from '$types';

import { defer } from "$utils"
import { Ok, Err } from "$lib/result"

import { newValue } from '$lib/graph/value'


//
// Computer Tempaltes
//

export const reducePorts = (op):Computer => (state, ports) => {
  const args = Object.values(ports).map(p => p.value)
  const numberOfMultivalues = args.filter(a => a.multi).length

  let result:Value

  switch (numberOfMultivalues) {
    case 0:
      result = newValue('number', op(...args.map(a => a.value[0])))
      break;

    case 1:
      const multi = args.find(a => a.multi)
      const other = args.filter(a => !a.multi)

      result = newValue('number', multi.value.map(v =>
        op(...other.map(o => o.value[0]), v)))
          break;

    default:
      return defer(Err("reducePorts only supports one multivalue inport"))
  }

  return defer(Ok(result))
}

