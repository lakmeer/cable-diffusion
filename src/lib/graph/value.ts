
import type { Value } from "$types"

export const newValue = (type: string, val: Value['value']): Value => {
  const multi = Array.isArray(val)

  // Type checking
  if (type != 'any') {
    if (multi) {
      if (typeof val[0] !== type) {
        throw new Error(`Value::Error - expected <${type}> got [<${typeof val[0]}>]`)
      }
    } else {
      if (typeof val !== type) {
        throw new Error(`Value::Error - expected <${type}> got <${typeof val}>`)
      }
    }
  }

  const value = multi ? val : [val]

  return {
    type,
    multi,
    value,
    size: multi ? value.length : 1
  }
}

export const compare = (a: Value, b: Value): boolean =>
  JSON.stringify(a.value) === JSON.stringify(b.value)

export const format = (value: Value): string =>
  `[${value.type}|${value.value}]`

