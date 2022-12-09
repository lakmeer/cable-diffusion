
const { min, max, abs, sin, cos, random, pow, exp, sqrt, PI } = Math;

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

export const hyp = ([ x1, y1 ], [ x2, y2 ]) =>
  sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2))

