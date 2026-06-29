import { useCallback, useEffect, useState } from 'react'
import type { RequestState } from '../services/types'

export function useAsyncData<T>(
  loader: () => Promise<T>,
  deps: readonly unknown[] = [],
  enabled = true,
) {
  const [state, setState] = useState<RequestState<T>>({ status: 'idle' })

  const reload = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const data = await loader()
      setState({ status: 'success', data })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setState({ status: 'error', error: message })
    }
  }, [loader])

  useEffect(() => {
    if (!enabled) return
    void reload()
  }, [enabled, reload, ...deps])

  return { state, reload }
}
