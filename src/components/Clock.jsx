import { useEffect, useRef } from 'react'
import { subscribeClock, pad } from '../lib/clock'

/** Live local time. Writes to the DOM directly — no re-render per second. */
export function Clock({ seconds = false }) {
  const ref = useRef(null)
  useEffect(
    () =>
      subscribeClock((d) => {
        if (!ref.current) return
        const t = `${pad(d.getHours())}:${pad(d.getMinutes())}${seconds ? ':' + pad(d.getSeconds()) : ''}`
        ref.current.textContent = t
        ref.current.dateTime = t
      }),
    [seconds],
  )
  return <time ref={ref} suppressHydrationWarning />
}
