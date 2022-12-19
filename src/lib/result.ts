
//
// Result Monad
//

export type Result<T> = Ok<T> | Err

export type Ok<T> = { ok: true,  value: T,      unwrap: () => T }
export type Err   = { ok: false, error: string, unwrap: () => never }


export const Ok = (value):Ok<T> => ({
  ok: true,  
  value,
  unwrap: () => value
})

export const Err = (error):Err => ({
  ok: false,
  error,
  unwrap: () => { throw new Error(error) }
})

