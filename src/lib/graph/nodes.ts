
import type { Node, Port, Computer, NodeConstructor } from '$types';
import type { NodeSpec } from '$lib/graph/spec';

import { PortSpec, MathBinary } from '$lib/graph/templates';
import { reducePorts } from '$lib/graph/computers';
import { green, defer } from "$utils"

import { Ok, Err } from "$lib/result"


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
    .state('value', 0)
    .port('set', PortSpec('number', 0, { label: 'Value', noSocket: true }))
    .port('out', PortSpec('number', 0, { label: 'Value' }))
    .compute(async (_, ports) => defer(Ok({ value: ports.set.value })))
    .init(({ inports, state }) => inports.set.value = state.value)


export const Add = (spec:NodeSpec) =>
  MathBinary(spec)
    .setDynamic(() => PortSpec('number', 0, { removable: true }))
    .compute(reducePorts((...args) => args.reduce((a, b) => a + b, 0)))


export const Subtract = (spec:NodeSpec) => 
  MathBinary(spec)
    .setDynamic(() => PortSpec('number', 0, { removable: true }))
    .compute(reducePorts((x, ...ys) => ys.reduce((a, b) => a - b, x)))


export const Multiply = (spec:NodeSpec) =>
  MathBinary(spec)
    .setDynamic(() => PortSpec('number', 1, { removable: true }))
    .compute(reducePorts((...args) => args.reduce((a, b) => a * b, 1)))


export const Divide = (spec:NodeSpec) => 
  MathBinary(spec)
    .compute(async (_, ports) => {
      const args = Object.values(ports).map(p => p.value)

      if (args.some(v => typeof v !== 'number')) {
        return defer(Err('Divide::Error - invalid input'))
      }

      if (args[1] === 0) {
        return defer(Err('Divide::Error - divide by zero'))
      }

      return defer(Ok({ args, value: args[0] / args[1] }))
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
    .port('text', PortSpec('string', "", { label: 'Text' }))
    .compute(async (state, ports) => {
      const text = ports.text.value;
      green(`Output::result - ${text}`)
      return Ok({ last: ports.text.value, value: text, rnd: Math.random() })
    })


// Spread

export const Spread = (spec:NodeSpec) =>
  spec
    .port('mid',   PortSpec('number', 0, { label: "Midpoint" }))
    .port('step',  PortSpec('number', 0, { label: "Step" }))
    .port('times', PortSpec('number', 0, { label: "Times" }))
    .port('out',   PortSpec('number', 0, { label: "Value", multi: true }))
    .compute(async (state, ports) => {
      const mid   = ports.mid.value
      const step  = ports.step.value
      const times = ports.times.value
      if (mid === null || step === null || times === null) return Err('Missing input')
      return Ok(Array.from({ length: times }, (_, i) => mid + step * i))
    })


// Range

export const Range = (spec:NodeSpec) =>
  spec
    .port('min',  PortSpec('number', 0, { label: "Min" }))
    .port('max',  PortSpec('number', 0, { label: "Max" }))
    .port('step', PortSpec('number', 0, { label: "Step" }))
    .port('out',  PortSpec('number', 0, { label: "Value", multi: true }))
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

export const Prompt = (spec:NodeSpec) =>
  spec
    .port('pos', PortSpec('string', "", { label: "Positive" }))
    .port('neg', PortSpec('string', "", { label: "Negative" }))
    .port('out', PortSpec('prompt', "", { label: "Value" }))
    .compute(async (state, ports) => {
      const pos = ports.pos.value
      const neg = ports.neg.value
      return Ok({ pos, neg, value: pos + " ### " + neg })
    })

