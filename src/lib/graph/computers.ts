
import type { Computer } from '$types';
import type { Result } from "$lib/result"

import { defer } from "$utils"
import { Ok, Err } from "$lib/result"

import { newValue } from '$lib/graph/value'


//
// Computer Tempaltes
//

export const reducePorts = (op):Computer => (state, ports) => {
  const args = Object.values(ports).map(p => p.value)
  const numberOfMultivalues = args.filter(a => a.multi).length

  let result:Result<Value>

  switch (numberOfMultivalues) {
    case 0:
      return Ok(newValue('number', op(...args.map(a => a.value[0]))))

    case 1:
      const multi = args.find(a => a.multi)
      const other = args.filter(a => !a.multi)

      return Ok(newValue('number', multi.value.map(v =>
        op(...other.map(o => o.value[0]), v))))

    default:
      return Err("reducePorts only supports one multivalue inport")
  }
}

