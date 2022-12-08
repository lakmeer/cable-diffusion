
const { min, max, abs, sin, cos, random, pow, exp, PI } = Math;

const EPSILON = 1e-4;


//
// Utility Functions
//

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

