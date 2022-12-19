// @ts-nocheck

const { min, max, abs, sin, cos, random, pow, exp, sqrt, PI } = Math;

const EPSILON = 1e-4;


//
// Utility Functions
//

export const log = (...args) =>
  console.log(...args) ?? args[0]

export const red = (first, ...rest) =>
  console.log(`%c${first}`, 'color:#fba', ...rest)

export const blue = (first, ...rest) =>
  console.log(`%c${first}`, 'color:#abf', ...rest)

export const green = (first, ...rest) =>
  console.log(`%c${first}`, 'color:#afb', ...rest)

export const lerp = (a, b, t) =>
  a + (b - a) * t

export const snapLerp = (a, b, t) =>
  abs(a - b) < EPSILON ? b : lerp(a, b, t)

export const cssVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim()

export const getCssValue = (el, prop) =>
  parseInt(getComputedStyle(el).getPropertyValue(prop))

export const pluck = (key) => (obj) =>
  obj[key]

export const hyp = ([ x1, y1 ], [ x2, y2 ]) =>
  sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2))

export const invoke = (...args) => (λ) =>
  λ(...args)

export const sleep = async (ms) =>
  await new Promise((λ) => setTimeout(λ, ms))

export const now = () =>
  new Date().getTime()

export const after = async (ms, λ) => {
  setTimeout(() => {
    console.log('after:', ms, λ)
    λ()
  }, ms)
}

export const defer = (it:T):Promise<T> =>
  new Promise(done => setTimeout(() => done(it), 0))

export const xyToPoint = ({ x, y }, offset?:Point):Point =>
  offset ? [ x + offset[0], y + offset[1] ] : [ x, y ]

export const rgbLerp = (hexA, hexB, t) => {

  const hexAR = parseInt(hexA.slice(1, 3), 16)
  const hexAG = parseInt(hexA.slice(3, 5), 16)
  const hexAB = parseInt(hexA.slice(5, 7), 16)
  const hexBR = parseInt(hexB.slice(1, 3), 16)
  const hexBG = parseInt(hexB.slice(3, 5), 16)
  const hexBB = parseInt(hexB.slice(5, 7), 16)

  const lerpR = Math.round(lerp(hexAR, hexBR, t))
  const lerpG = Math.round(lerp(hexAG, hexBG, t))
  const lerpB = Math.round(lerp(hexAB, hexBB, t))

  return `#${lerpR.toString(16).padStart(2, '0')}${lerpG.toString(16).padStart(2, '0')}${lerpB.toString(16).padStart(2, '0')}`

}

