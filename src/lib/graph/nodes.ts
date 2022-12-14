
import type { NodeSpec } from '$lib/graph/spec'

import { Ok, Err }              from "$lib/result"
import { newValue, format }     from '$lib/graph/value'
import { newPort, MathBinary }  from '$lib/graph/templates'
import { reducePorts }          from '$lib/graph/computers'
import { green, defer, collatePorts } from "$utils"

const { random, floor } = Math


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
    .port('set', newPort('number', { label: 'Value', noSocket: true }))
    .port('out', newPort('number', { label: 'Value' }))
    .compute(async (_, ports) => defer(Ok(ports.set.value)))


export const Sum = (spec:NodeSpec) =>
  MathBinary(spec)
    .setDynamic(() => newPort('number', { value: 0, removable: true }))
    .compute(reducePorts((...args) => args.reduce((a, b) => a + b, 0)))


export const Product = (spec:NodeSpec) =>
  MathBinary(spec)
    .setDynamic(() => newPort('number', { value: 1, removable: true }))
    .compute(reducePorts((...args) => args.reduce((a, b) => a * b, 1)))



//
// Utility Nodes
//


// Output

export const Output = (spec:NodeSpec) =>
  spec
    .port('text', newPort('any', { label: '' }))
    .update((_, result) => {
      green("OutputNode =>", format(result))
      return {}
    })
    .compute(async (_, ports) => defer(Ok(ports.text.value)))


// Spread

export const Spread = (spec:NodeSpec) =>
  spec
    .port('mid',  newPort('number', { value: 5, label: "Midpoint" }))
    .port('step', newPort('number', { value: 3, label: "Step Size" }))
    .port('pts',  newPort('number', { value: 7, label: "Points" }))
    .port('out',  newPort('number', { multi: true }))
    .compute(async (_, ports) => {
      const { mid, step, pts } = collatePorts(ports)

      if (mid === null || step === null || pts === null)
        return Err('Missing input')

      if (pts < 2)
        return Err(`Requires at least 2 'Points'`)

      let result = []
      for (let i = 0; i < pts; i++) {
        result.push(mid - step * (pts - 1)/2 + i * step)
      }

      return defer(Ok(newValue('number', result)))
    })


// Range

export const Range = (spec:NodeSpec) =>
  spec
    .port('min', newPort('number', { value: 1, label: "Min" }))
    .port('pts', newPort('number', { value: 2, label: "Points" }))
    .port('max', newPort('number', { value: 3, label: "Max" }))
    .port('out', newPort('number', { multi: true }))
    .compute(async (_, ports) => {
      const { min, max, pts } = collatePorts(ports)

      if (min === null || max === null || pts === null)
        return Err('Missing input')

      if (pts < 2)
        return Err(`Requires at least 2 'Points'`)

      if (min > max)
        return Err(`'Min' cannot be greater than 'max'`)

      let result = []
      for (let i = 0; i < pts; i++) {
        result.push(min + i * (max - min) / (pts - 1))
      }

      return defer(Ok(newValue('number', result)))
    })


// List

export const List = (spec:NodeSpec) =>
  spec
    .data('type', 'number')
    .data('items', [])
    .port('out', newPort('any', { multi: true }))
    .compute(async (data, _) => {
      console.log("List::Compute", data.items)
      return defer(Ok(newValue(data.type, data.items.map(x => x.value[0]))))
    })
    .update((node, result) => { 
      console.log("List::Update", result)
      node.outport.type = result.type
    })
    .init((node) => {
      node.data.items = node.data.items.map((item) => {
        if (item instanceof Object && item.type) return item
        else return newValue(node.data.type, item)
      })
    })


// Random

export const Random = (spec:NodeSpec) =>
  spec
    .port('min', newPort('number', { value: 0, label: "Min" }))
    .port('max', newPort('number', { value: 1, label: "Max" }))
    .port('opt', newPort('any',    { multi: true, label: "Options" }))
    .port('out', newPort('any'))
    .compute(async (_, ports) => {
      let { min, max } = collatePorts(ports)
      let opt = ports.opt.value

      // Random selection mode
      if (opt.size > 0) {
        let index = floor(random() * opt.size)
        return defer(Ok(newValue(opt.type, opt.value[index])))
      }

      // Random float mode
      if (min === null || max === null)
        return Err('Missing input')

      if (min > max) {
        let t = min
        min = max
        max = t
      }

      return defer(Ok(newValue('number', Math.random() * (max - min) + min)))
    })
    .update((node, result) => {
      console.log('random:update', result.type)

      node.outport.type = result.type
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
    .compute(async (_, ports) => {
      const pos = ports.pos.value.value
      const neg = ports.neg.value.value
      return defer(Ok(newValue('prompt', { pos, neg })))
    })


export const GenConfig = (spec:NodeSpec) =>
  spec
    .port('out', newPort('config', { label: "Value" }))
    .compute(async (_, __) => {
      return defer(Ok(newValue('config', {})))
    })



//
// Debugging Nodes
//

// Input Test
//
// Showcases all the different states that ports can be displayed in

export const InputTest = (spec:NodeSpec) =>
  spec
    .port('in1', newPort('number',  { label: "Number"  }))
    .port('in2', newPort('string',  { label: "String"  }))
    .port('in3', newPort('boolean', { label: "Boolean" }))
    .port('in4', newPort('boolean', { label: "Boolean" }))
    .port('in7', newPort('number',  { label: "x Number",  filled: true }))
    .port('in8', newPort('string',  { label: "x String",  filled: true }))
    .port('in9', newPort('boolean', { label: "x Boolean", filled: true }))
    .port('inA', newPort('number',  { label: "x [Number]",  multi: true, filled: true }))
    .port('inB', newPort('string',  { label: "x [String]",  multi: true, filled: true }))
    .port('inC', newPort('boolean', { label: "x [Boolean]", multi: true, filled: true }))
    .setPort('in3', false)
    .setPort('in4', true)
    .setPort('in7', 10)
    .setPort('in8', "Cheese")
    .setPort('in9', false)
    .setPort('inA', [ 10, 100, 1000 ])
    .setPort('inB', [ "Even", "more", "Cheese" ])
    .setPort('inC', [ true, false, true ])


