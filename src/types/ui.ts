
//
// Types used by Svelte components
//

export type AnyDataflow = string

export type Point = [ number, number ]

export type Cable = {
  type:  string,
  multi: boolean,
  curve: Curve,
}

export type Curve = {
  termA: Point,
  termB: Point,
  ctrlA: Point,
  ctrlB: Point,
}

