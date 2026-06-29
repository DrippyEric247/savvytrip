import { useEffect, useState } from 'react'

export function formatCountdown(msRemaining: number): string {
  if (msRemaining <= 0) return '00:00'
  const totalSec = Math.floor(msRemaining / 1000)
  const hours = Math.floor(totalSec / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function useDealCountdown(expiresAt: number) {
  const [label, setLabel] = useState(() => formatCountdown(expiresAt - Date.now()))

  useEffect(() => {
    const tick = () => setLabel(formatCountdown(expiresAt - Date.now()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [expiresAt])

  return label
}
