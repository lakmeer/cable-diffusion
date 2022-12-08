
export type Product = {
  text:     string;
  negative: string;
}

export type Config = {
  prompt: Prompt;
  cfg:    number;
  steps:  number;
  width:  number;
  height: number;
}

export type Gen = {
  src:    string;
  config: Config;
}

export type AnyDataflow = 'string' | 'number' | 'config' | 'gen';


export type Point = [ number, number ];

export type Cable = {
  id: string,
  color: string,
  termA: Point,
  termB: Point,
  ctrlA: Point,
  ctrlB: Point,
  type: AnyDataflow
}

