
import type { Node, Port } from './types';

import { green, defer } from "$utils"



//
// Node Constructors
//
// Nodes will do computation with the `compute` method, which will take the current
// state and the inport group, and should return Promise<Result<NodeState, Err>>
// state. State can include whatever it likes for a particular node but must
// have an 'out' property, which will be propagated to the outport.
//

type NodeConstructor = (node:Node) => Node


// Result Monad

type Result<T, E> = Ok<T> | Err

type Ok<T> = { ok: true,  value: T,      unwrap: () => T }
type Err   = { ok: false, error: string, unwrap: () => never }

const Ok  = (value: T):Ok<T>    => ({ ok: true,  value, unwrap: () => value })
const Err = (error: string):Err => ({ ok: false, error, unwrap: () => { throw new Error(error) }})


// Port Helper (not a builder)

export const Port = (type:string, value:any = null, others:any = {}):Port => ({
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
// Basic Math Nodes
//


// Const
//
// Doesn't do any computation here cos it doens't have a port to read from.
// It's UI will
// - value: any
// - out:   any

export const Const:NodeConstructor = (spec:NodeSpec) =>
  spec
    .state('value', 0)
    .port('set', Port('number', 0, { label: 'Value', noSocket: true }))
    .port('out', Port('number', 0, { label: 'Value' }))
    .compute(async (state, ports) => defer(Ok({ value: ports.set.value })))
    .init(({ inports, state }) => inports.set.value = state.value)


// Add
//
// Adds numbers together. Extensible.
// - out:  number
// - args: number[] - capture of current port values

export const Add:NodeConstructor = (spec:NodeSpec) =>
  spec
    .initialState({ out: 0, args: [] })
    .port('in0', Port('number', 0))
    .port('in1', Port('number', 0))
    .port('out', Port('number', 0, { label: 'Value' }))
    .setBlocking(false)
    .debounce(100)
    .setDynamic((id) => Port('number', 0, { removable: true }))
    .compute(async (state, ports) => {
      const args = Object.values(ports).map(p => p.value)

      if (args.some(v => typeof v !== 'number')) {
        return defer(Err('Add::Error - invalid input'))
      }

      return defer(Ok({
        args,
        value: args.reduce((a, b) => a + b, 0)
      }))
    })



//
// Utility Nodes
//


// Output
//
// Echo's it's value to the console.
// The only node allowed to not have an out value
// - rnd: number - random number to trigger updates
// - last: any   - the most recently received value

export const Output:NodeConstructor = (spec:NodeSpec) =>
  spec
    .port('text', Port('string', "", { label: 'Text' }))
    .compute(async (state, ports) => {
      const text = ports.text.value;
      green(`Output::result - ${text}`)
      return Ok({ last: ports.text.value, value: text, rnd: Math.random() })
    })


// Spread

export const Spread:NodeConstructor = (spec:NodeSpec) =>
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

export const Range:NodeConstructor = (spec:NodeSpec) =>
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




//
// Diffusion-Specific Nodes
//


// Prompt
//
// Captures positive and negative prompt values together.

export const Prompt:NodeConstructor = (spec:NodeSpec) =>
  spec
    .port('pos', Port('string', "", { label: "Positive" }))
    .port('neg', Port('string', "", { label: "Negative" }))
    .port('out', Port('prompt', "", { label: "Value" }))
    .compute(async (state, ports) => {
      return Ok(ports.pos.value + " ### " + ports.neg.value)
    })

