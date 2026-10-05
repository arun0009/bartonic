import { useEffect, useMemo } from 'react'
import { preferGtfsDepartAtMs } from '../lib/departureTime'
import type { Urgency } from '../lib/urgency'
import { useGtfsDepartAtMs } from '../hooks/useTrainPosition'
import Countdown from './Countdown'

interface DepartureMetaProps {
  noEtd?: boolean
  estDepartureSeconds: number | 'LEAVING_NOW' | null
  departAtMs?: number | null
  tripKey?: string
  originAbbr?: string
  destinationAbbr?: string
  /** When true, refine countdown with GTFS-RT second-precision departure time. */
  useGtfsPrecision?: boolean
  carLength?: number
  platform?: string
  delaySeconds?: number
  hexcolor?: string
  origTimeMin?: string
  className?: string
  countdownClassName?: string
  warnClassName?: string
  leavingClassName?: string
  mutedClassName?: string
  layout?: 'inline' | 'hero'
  onUrgency?: (urgency: Urgency) => void
}

function delayLabel(delaySeconds: number | undefined): string | null {
  if (delaySeconds == null || delaySeconds <= 0) return null
  const minutes = Math.max(1, Math.round(delaySeconds / 60))
  return `+${minutes}m delay`
}

/** Shared live/scheduled departure line: countdown, cars, platform, delay, line color. */
export default function DepartureMeta({
  noEtd,
  estDepartureSeconds,
  departAtMs,
  tripKey,
  originAbbr,
  destinationAbbr,
  useGtfsPrecision = false,
  carLength,
  platform,
  delaySeconds,
  hexcolor,
  origTimeMin,
  className,
  countdownClassName,
  warnClassName,
  leavingClassName,
  mutedClassName,
  layout = 'inline',
  onUrgency
}: DepartureMetaProps) {
  const gtfsDepartAtMs = useGtfsDepartAtMs(
    useGtfsPrecision ? originAbbr : undefined,
    useGtfsPrecision ? destinationAbbr : undefined,
    useGtfsPrecision ? departAtMs : null
  )
  const delay = delayLabel(delaySeconds)

  const effectiveDepartAtMs = useMemo(
    () => preferGtfsDepartAtMs(departAtMs, gtfsDepartAtMs),
    [departAtMs, gtfsDepartAtMs]
  )

  const leavingNow = estDepartureSeconds === 'LEAVING_NOW'
  const canCountdown =
    effectiveDepartAtMs != null &&
    tripKey != null &&
    (typeof estDepartureSeconds === 'number' ||
      leavingNow ||
      (noEtd && effectiveDepartAtMs != null))

  const clock = canCountdown ? (
    <Countdown
      departAtMs={effectiveDepartAtMs}
      tripKey={tripKey}
      className={countdownClassName}
      warnClassName={warnClassName}
      leavingClassName={leavingClassName}
      onUrgency={onUrgency}
    />
  ) : leavingNow ? (
    <span className={leavingClassName}>Leaving</span>
  ) : estDepartureSeconds == null ? (
    <span className={mutedClassName}>
      {noEtd
        ? origTimeMin != null
          ? `Scheduled departure at ${origTimeMin}`
          : 'No live ETD'
        : 'No service'}
    </span>
  ) : null

  useEffect(() => {
    if (canCountdown) return
    onUrgency?.(leavingNow ? 'leave' : 'none')
  }, [canCountdown, leavingNow, onUrgency])

  const annotation = (
    <>
      {canCountdown && carLength != null && <span className={mutedClassName}>{carLength} car</span>}
      {platform && (
        <span className={mutedClassName}>
          {canCountdown && carLength != null ? ' · ' : ''}
          Plat {platform}
        </span>
      )}
      {delay && (
        <span className={mutedClassName}>
          {(canCountdown && carLength != null) || platform ? ' · ' : ''}
          {delay}
        </span>
      )}
      {noEtd && canCountdown && <span className={mutedClassName}> · scheduled</span>}
      {hexcolor && (
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: '0.5rem',
            height: '0.5rem',
            borderRadius: '999px',
            background: hexcolor,
            marginLeft: '0.45rem',
            verticalAlign: 'middle',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.15)'
          }}
        />
      )}
    </>
  )

  if (layout === 'hero') {
    return (
      <div className={className}>
        <div>{clock}</div>
        <div>{annotation}</div>
      </div>
    )
  }

  return (
    <div className={className}>
      {clock}
      {canCountdown && annotation}
      {!canCountdown && leavingNow && carLength != null && (
        <span className={mutedClassName}> · {carLength} car</span>
      )}
      {!canCountdown && !leavingNow && annotation}
    </div>
  )
}
