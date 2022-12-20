
//
// Types used by Svelte components
//

export type Point = {
  x: number,
  y: number
}

export type Cable = {
  type:       string,
  multi:      boolean,
  curve:      Curve,
  brightness: number,
}

export type Curve = {
  termA: Point,
  termB: Point,
  ctrlA: Point,
  ctrlB: Point,
}

