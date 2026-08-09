import { useEffect, useRef, useState } from 'react'
import { mergeDepartAtMs, secondsUntil } from '../lib/departureTime'

interface CountdownProps {
  /** Absolute epoch ms when this train should depart. */
  departAtMs: number
  /** Stable identity for this trip; changing it resets the anchor. */
  tripKey: string
  className?: string
  leavingClassName?: string
}

/**
 * Deadline-based countdown.
 * Anchors on first sight of a trip, never jumps upward on minute-bucket refreshes,
 * and prefers earlier updates (train advanced) or large delay jumps.
 */
export default function Countdown({
  departAtMs,
  tripKey,
  className,
  leavingClassName
}: CountdownProps) {
  const anchorRef = useRef<{ tripKey: string; departAtMs: number }>({
    tripKey,
    departAtMs
  })
  const [left, setLeft] = useState(() => secondsUntil(departAtMs))

  useEffect(() => {
    const prev = anchorRef.current
    if (prev.tripKey !== tripKey) {
      anchorRef.current = { tripKey, departAtMs }
    } else {
      anchorRef.current = {
        tripKey,
        departAtMs: mergeDepartAtMs(prev.departAtMs, departAtMs)
      }
    }

    const tick = () => setLeft(secondsUntil(anchorRef.current.departAtMs))
    tick()
    // Sub-second tick keeps the display honest near departure.
    const timer = window.setInterval(tick, 250)
    return () => window.clearInterval(timer)
  }, [departAtMs, tripKey])

  if (left <= 0) {
    return <span className={leavingClassName ?? className}>Leaving</span>
  }

  const m = Math.floor(left / 60)
  const s = left % 60
  return <span className={className}>{`${m}m ${s.toString().padStart(2, '0')}s`}</span>
}
