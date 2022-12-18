
//
// Result Monad
//

export type Result<T> = Ok<T> | Err

export type Ok<T> = { ok: true,  value: T,      unwrap: () => T }
export type Err   = { ok: false, error: string, unwrap: () => never }

