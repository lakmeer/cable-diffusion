
export type Product = {
  text:     string,
  negative: string,
}

export type Prompt = {
  positive: string,
  negative: string,
}

export type Config = {
  prompt: Prompt,
  cfg:    number,
  steps:  number,
  width:  number,
  height: number,
  model:  string,
  sampler: Sampler,
}

export type Sampler =
  | "Euler A"
  | "Euler"
  | "Heun"
  | "LMS"
  | "DPM2"
  | "DPM2 a"
  | "DPM++ 2S a"
  | "DPM++ 2M"
  | "DPM Fast"
  | "DPM Adaptive"
  | "LMS Karras"
  | "DPM2 Karras"
  | "DPM2 a Karras"
  | "DPM++ 2S a Karras"
  | "DPM++ 2M Karras"
  | "DDIM"
  | "PLMS"

export type Gen = {
  src:    string,
  config: Config,
}

export type AnyDataflow = string
  //| 'string' | 'number' | 'config' | 'gen' | 'vector'

export type Point = [ number, number ]

export type Curve = {
  color: string,
  termA: Point,
  termB: Point,
  ctrlA: Point,
  ctrlB: Point,
}

