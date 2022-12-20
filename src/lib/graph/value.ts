
import type { Value } from "$types"

export const newValue = (type: string, value: any): Value => {
  const multi = typeof value === 'object'

  if (type != 'any') {
    if (multi) {
      if (typeof value[0] !== type) {
        throw new Error(`Value::Error - expected <${type}> got [<${typeof value[0]}>]`)
      }
    } else {
      if (typeof value !== type) {
        throw new Error(`Value::Error - expected <${type}> got <${typeof value}>`)
      }
    }
  }

  return { type, multi, value }
}

export const compare = (a: Value, b: Value): boolean =>
  JSON.stringify(a.value) === JSON.stringify(b.value)

export const format = (value: Value): string =>
  `[${value.type}|${value.value}]`

