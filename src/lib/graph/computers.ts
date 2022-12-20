
import type { Computer } from '$types';

import { defer } from "$utils"
import { Ok, Err } from "$lib/result"

import { newValue } from '$lib/graph/value'


//
// Computer Tempaltes
//

export const reducePorts = (op):Computer => (state, ports) => {
  const args = Object.values(ports).map(p => p.value.value)
  return defer(Ok(newValue('number', op(...args))))
}

