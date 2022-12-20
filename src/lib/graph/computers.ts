
import type { Computer } from '$types';

import { defer } from "$utils"
import { Ok, Err } from "$lib/result"


//
// Computer Tempaltes
//

export const reducePorts = (op):Computer => (_, ports) => {
  const args = Object.values(ports).map(p => p.value)

  if (args.some(v => typeof v !== 'number')) {
    return defer(Err(`Computer::Error - expected <number> got <${typeof args[0]}>`));
  }

  return defer(Ok({ args, value: op(...args) }))
}

