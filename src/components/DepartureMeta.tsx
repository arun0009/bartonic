import { useMemo } from 'react'
import { preferGtfsDepartAtMs } from '../lib/departureTime'
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
  leavingClassName?: string
  mutedClassName?: string
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
  leavingClassName,
  mutedClassName
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

  const canCountdown =
    effectiveDepartAtMs != null &&
    tripKey != null &&
    (typeof estDepartureSeconds === 'number' ||
      estDepartureSeconds === 'LEAVING_NOW' ||
      (noEtd && effectiveDepartAtMs != null))

  return (
    <div className={className}>
      {hexcolor && (
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: '0.65rem',
            height: '0.65rem',
            borderRadius: '999px',
            background: hexcolor,
            marginRight: '0.4rem',
            verticalAlign: 'middle',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.15)'
          }}
        />
      )}
      {canCountdown ? (
        <Countdown
          departAtMs={effectiveDepartAtMs}
          tripKey={tripKey}
          className={countdownClassName}
          leavingClassName={leavingClassName}
        />
      ) : estDepartureSeconds === 'LEAVING_NOW' ? (
        <span className={leavingClassName}>
          Leaving{carLength != null ? ` (${carLength} car)` : ''}
        </span>
      ) : estDepartureSeconds == null ? (
        <span className={mutedClassName}>
          {noEtd
            ? origTimeMin != null
              ? `Scheduled departure at ${origTimeMin}`
              : 'No live ETD'
            : 'No service'}
        </span>
      ) : null}
      {canCountdown && carLength != null && <span className={mutedClassName}> ({carLength} car)</span>}
      {platform && <span className={mutedClassName}> · Plat {platform}</span>}
      {delay && <span className={mutedClassName}> · {delay}</span>}
      {noEtd && canCountdown && <span className={mutedClassName}> · scheduled</span>}
    </div>
  )
}
