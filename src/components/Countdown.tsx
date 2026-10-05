import { useEffect, useRef, useState } from 'react'
import { mergeDepartAtMs, secondsUntil } from '../lib/departureTime'
import { urgencyFromSeconds, type Urgency } from '../lib/urgency'

interface CountdownProps {
  /** Absolute epoch ms when this train should depart. */
  departAtMs: number
  /** Stable identity for this trip; changing it resets the anchor. */
  tripKey: string
  className?: string
  warnClassName?: string
  leavingClassName?: string
  onUrgency?: (urgency: Urgency) => void
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
  warnClassName,
  leavingClassName,
  onUrgency
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

    const tick = () => {
      const next = secondsUntil(anchorRef.current.departAtMs)
      setLeft(next)
      onUrgency?.(urgencyFromSeconds(next))
    }
    tick()
    const timer = window.setInterval(tick, 250)
    return () => window.clearInterval(timer)
  }, [departAtMs, tripKey, onUrgency])

  if (left <= 0) {
    return <span className={leavingClassName ?? className}>Leaving</span>
  }

  const urgent = left <= 300
  const m = Math.floor(left / 60)
  const s = left % 60
  return (
    <span className={urgent && warnClassName ? `${className ?? ''} ${warnClassName}`.trim() : className}>
      {`${m}m ${s.toString().padStart(2, '0')}s`}
    </span>
  )
}
