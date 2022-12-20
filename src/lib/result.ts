
//
// Result Monad
//

export type Result<T> = {
  ok: true,
  value: T,
  error: string;
  unwrap: () => T,
} | {
  ok: false,
  error: string,
  unwrap: () => never
}

export const Ok = <T>(value:T):Result<T> => ({
  ok: true,  
  value,
  error: "",
  unwrap: () => value
})

export const Err = <T>(error):Result<T> => ({
  ok: false,
  error,
  unwrap: () => { throw new Error(error) }
})

