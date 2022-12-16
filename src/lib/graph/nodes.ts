
import type { Node, Port } from './types';

import { defer } from "$utils"



//
// Result Monad
//

type Result<T, E> = Ok<T> | Err

type Ok<T> = { ok: true,  value: T,      unwrap: () => T }
type Err   = { ok: false, error: string, unwrap: () => never }

const Ok  = (value: T):Ok<T>    => ({ ok: true,  value, unwrap: () => value })
const Err = (error: string):Err => ({ ok: false, error, unwrap: () => { throw new Error(error) }})



//
// Port Helper (not a builder)
//

export const Port = (type:string, value:any = null, others:any = {}):Port => ({
  x: 0,
  y: 0,
  type,
  value,
  label: null,
  filled: false,
  removable: false,
  ...others
})



//
// Node Constructors
//

type NodeContructor = (node:Node) => Node

// Nodes will do computation with the `compute` method, which will take the current
// state and the inport group, and should return Promise<Result<NodeState, Err>>
// state. State can include whatever it likes for a particular node but must
// have an 'out' property, which will be propagated to the outport.


// Const
// Doesn't do any computation here cos it doens't have a port to read from.
// Instead will just copy the value from state.value to state.out
// - out: any

export const Const:NodeContructor = (spec:NodeSpec) =>
  spec
    .state('out', 0)
    .port('out', Port('number', 0, { label: 'Value' }))
    .compute(async (state) => defer(Ok({ ...state, out: state.value })))


// Add
// Adds numbers together. Extensible.
// - out: number
// - args: number[] - capture of current port values

export const Add:NodeContructor = (spec:NodeSpec) =>
  spec
    .initialState({ out: 0, args: [] })
    .port('in0', Port('number', 0))
    .port('in1', Port('number', 0))
    .port('out', Port('number', 0, { label: 'Value' }))
    .setDynamic((id) => Port('number', 0, { removable: true }))
    .compute(async (state, ports) => {
      const args = Object.values(ports).map(p => p.value)

      if (args.some(v => typeof v !== 'number')) {
        return defer(Err('Add::Error - invalid input'))
      }

      return defer(Ok({ args, out:  args.reduce((a, b) => a + b, 0) }))
    })


// Output
// Echo's it's value to the console
// - out: any

export const Output:NodeContructor = (spec:NodeSpec) =>
  spec
    .port('text', Port('string', "", { label: 'Text' }))
    .compute(async (state, ports) => {
      console.info(`%cOutput::result - ${ports.text.value}`, 'color: #0a0')
      return Ok(Math.random()); // Never the same means this node will fire every time
    })


// Prompt

export const Prompt:NodeContructor = (spec:NodeSpec) =>
  spec
    .port('pos', Port('string', "", { label: "Positive" }))
    .port('neg', Port('string', "", { label: "Negative" }))
    .port('out', Port('prompt', "", { label: "Value" }))
    .compute(async (state, ports) => {
      return Ok(ports.pos.value + " ### " + ports.neg.value)
    })


// Spread

export const Spread:NodeContructor = (spec:NodeSpec) =>
  spec
    .setMultiple(true)
    .port('mid',   Port('number', 0, { label: "Midpoint" }))
    .port('step',  Port('number', 0, { label: "Step" }))
    .port('times', Port('number', 0, { label: "Times" }))
    .port('out',   Port('number', 0, { label: "Value", multi: true }))
    .compute(async (state, ports) => {
      const mid   = ports.mid.value
      const step  = ports.step.value
      const times = ports.times.value
      if (mid === null || step === null || times === null) return Err('Missing input')
      return Ok(Array.from({ length: times }, (_, i) => mid + step * i))
    })


// Range

export const Range:NodeContructor = (spec:NodeSpec) =>
  spec
    .setMultiple(true)
    .port('min',  Port('number', 0, { label: "Min" }))
    .port('max',  Port('number', 0, { label: "Max" }))
    .port('step', Port('number', 0, { label: "Step" }))
    .port('out',  Port('number', 0, { label: "Value", multi: true }))
    .compute(async (state, ports) => {
      const min  = ports.min.value
      const max  = ports.max.value
      const step = ports.step.value
      if (min === null || max === null || step === null) return Err('Missing input')
      return Ok(Array.from({ length: (max - min) / step }, (_, i) => min + step * i))
    })


