
import type { Node, Port, Computer, NodeConstructor } from '$types';
import type { NodeSpec } from '$lib/graph/spec';

import { Ok, Err }              from "$lib/result"
import { newValue }             from '$lib/graph/value';
import { newPort, MathBinary } from '$lib/graph/templates';
import { reducePorts }          from '$lib/graph/computers';
import { green, defer }         from "$utils"



//
// Node Constructors
//
// Nodes will do computation with the `compute` method, which will take the current
// state and the inport group, and should return Promise<Result<NodeState, Err>>
// state. State can include whatever it likes for a particular node but must
// have an 'out' property, which will be propagated to the outport.
//


// Const
//
// Doesn't do any computation here cos it doens't have a port to read from.
// It's UI will
// - value: any
// - out:   any

export const Const = (spec:NodeSpec) =>
  spec
    .port('set', newPort('number', 0, { label: 'Value', noSocket: true }))
    .port('out', newPort('number', 0, { label: 'Value' }))
    .compute(async (_, ports) => defer(Ok(ports.set.value)))


export const Add = (spec:NodeSpec) =>
  MathBinary(spec)
    .setDynamic(() => newPort('number', 0, { removable: true }))
    .compute(reducePorts((...args) => args.reduce((a, b) => a + b, 0)))


export const Subtract = (spec:NodeSpec) =>
  MathBinary(spec)
    .setDynamic(() => newPort('number', 0, { removable: true }))
    .compute(reducePorts((x, ...ys) => ys.reduce((a, b) => a - b, x)))


export const Multiply = (spec:NodeSpec) =>
  MathBinary(spec)
    .setDynamic(() => newPort('number', 1, { removable: true }))
    .compute(reducePorts((...args) => args.reduce((a, b) => a * b, 1)))


export const Divide = (spec:NodeSpec) =>
  MathBinary(spec)
    .compute(async (_, ports) => {
      const args = Object.values(ports).map(p => p.value.value)

      if (args.some(v => typeof v !== 'number')) {
        return defer(Err('Divide::Error - invalid input'))
      }

      if (args[1] === 0) {
        return defer(Err('Divide::Error - divide by zero'))
      }

      return defer(Ok(newValue('number', args[0] / args[1])))
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

export const Output = (spec:NodeSpec) =>
  spec
    .port('text', newPort('any', { label: '' }))
    .update((node) => {
      console.log(green(node.inports.text.value.value))
      return { }
    })
    .compute(async (_, ports) => defer(Ok(ports.text.value)))


// Spread

export const Spread = (spec:NodeSpec) =>
  spec
    .port('mid',   newPort('number', { value: 3, label: "Midpoint" }))
    .port('step',  newPort('number', { value: 1, label: "Step" }))
    .port('times', newPort('number', { value: 5, label: "Times" }))
    .port('out',   newPort('number', { label: "Value", multi: true }))
    .compute(async (state, ports) => {
      const mid   = ports.mid.value.value
      const step  = ports.step.value.value
      const times = ports.times.value.value
      if (mid === null || step === null || times === null) return Err('Missing input')
      return defer(Ok(newValue('number', [])))
    })


// Range

export const Range = (spec:NodeSpec) =>
  spec
    .port('min',  newPort('number', { value: 0, label: "Min" }))
    .port('max',  newPort('number', { value: 3, label: "Max" }))
    .port('step', newPort('number', { value: 1, label: "Step" }))
    .port('out',  newPort('number', { value: 1, label: "Value", multi: true }))
    .compute(async (_, ports) => {
      const min  = ports.min.value.value
      const max  = ports.max.value.value
      const step = ports.step.value.value

      if (min === null || max === null || step === null) return Err('Missing input')
      if (step === 0) return Err('Step cannot be zero')
      if (min > max) return Err('Min cannot be greater than max')

      const range = []
      for (let i = min; i <= max; i += step) { range.push(i) }

      return defer(Ok(newValue('number', range)))
    })



//
// Diffusion-Specific Nodes
//


// Prompt
//
// Captures positive and negative prompt values together.

export const Prompt = (spec:NodeSpec) =>
  spec
    .port('pos', newPort('string', { label: "Positive" }))
    .port('neg', newPort('string', { label: "Negative" }))
    .port('out', newPort('prompt', { label: "Value" }))
    .compute(async (state, ports) => {
      const pos = ports.pos.value.value
      const neg = ports.neg.value.value
      return defer(Ok(newValue('prompt', { pos, neg })))
    })





//
// Debugging Nodes
//

export const InputTest = (spec:NodeSpec) =>
  spec
    .port('in1', newPort('number',  { label: "Number"  }))
    .port('in2', newPort('string',  { label: "String"  }))
    .port('in3', newPort('boolean', { label: "Boolean" }))
    .port('in4', newPort('number',  { label: "[Number]", multi: true }))


