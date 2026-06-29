export type ServiceErrorCode = 'NOT_FOUND' | 'VALIDATION' | 'STORAGE' | 'NETWORK' | 'UNKNOWN'

export class ServiceError extends Error {
  readonly code: ServiceErrorCode

  constructor(message: string, code: ServiceErrorCode = 'UNKNOWN') {
    super(message)
    this.name = 'ServiceError'
    this.code = code
  }
}

export type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}
