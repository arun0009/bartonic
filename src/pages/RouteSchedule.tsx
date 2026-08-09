import { useParams, useNavigate } from 'react-router-dom'
import { useEtdForRoute } from '../hooks/useEtd'
import { useTrainPosition } from '../hooks/useTrainPosition'
import { getStation } from '../data/stations'
import DepartureMeta from '../components/DepartureMeta'
import styles from './RouteSchedule.module.css'

function fallbackTripKey(d: {
  origTimeMin?: string
  trainHeadStation?: string
  destination: string
  tripKey?: string
}): string {
  return d.tripKey ?? `${d.origTimeMin ?? ''}-${d.trainHeadStation ?? ''}-${d.destination}`
}

export default function RouteSchedule() {
  const { origin = '', destination = '' } = useParams<{ origin: string; destination: string }>()
  const navigate = useNavigate()
  const decodedOrigin = decodeURIComponent(origin).toUpperCase()
  const decodedDest = decodeURIComponent(destination).toUpperCase()
  const originName = getStation(decodedOrigin)?.name ?? decodedOrigin
  const destName = getStation(decodedDest)?.name ?? decodedDest

  const { departures, loading, stale, refresh } = useEtdForRoute(decodedOrigin, decodedDest)
  const {
    departures: reverseDepartures,
    loading: reverseLoading,
    refresh: refreshReverse
  } = useEtdForRoute(decodedDest, decodedOrigin)
  const nextDepartAtMs = departures[0]?.departAtMs
  const { position: trainPosition } = useTrainPosition(
    decodedOrigin,
    decodedDest,
    nextDepartAtMs
  )

  const goReverse = () => {
    navigate(`/schedule/${encodeURIComponent(decodedDest)}/${encodeURIComponent(decodedOrigin)}`)
  }

  const refreshAll = () => {
    refresh()
    refreshReverse()
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Departures</h1>
          <button type="button" className={styles.refresh} onClick={refreshAll}>
            Refresh
          </button>
        </div>
        <p className={styles.subtitle}>
          {originName} → {destName}
          {stale ? ' · showing last known' : ''}
        </p>
        <button type="button" className={styles.reverseLink} onClick={goReverse}>
          ⇄ Other direction · {destName} → {originName}
        </button>
      </header>

      {trainPosition && (
        <div className={styles.trainPosition}>
          <span className={styles.trainPositionLabel}>Your next train is at</span>{' '}
          <strong>{trainPosition.currentStationName}</strong>
          {trainPosition.stopsAway != null && trainPosition.stopsAway > 0 && (
            <span className={styles.stopsAway}>
              {' '}
              · {trainPosition.stopsAway} stop{trainPosition.stopsAway !== 1 ? 's' : ''} away
            </span>
          )}
        </div>
      )}

      {loading && departures.length === 0 && <p className={styles.loading}>Loading…</p>}
      {!loading && departures.length === 0 && (
        <p className={styles.noService}>No departures</p>
      )}
      <ul className={styles.list}>
        {departures.map((d, i) => {
          const tripDestName = d.destinationStationName ?? getStation(d.destination)?.name ?? d.destination
          const routeLabel = d.firstStationName
            ? (d.connectingStationName
                ? `${d.firstStationName} → ${d.connectingStationName} → `
                : `${d.firstStationName} → `) + (tripDestName ?? '')
            : `To ${tripDestName ?? 'destination'}`
          const key = fallbackTripKey(d)
          return (
            <li key={key} className={styles.card}>
              <div className={styles.route}>{routeLabel}</div>
              <DepartureMeta
                noEtd={d.noEtd}
                estDepartureSeconds={d.estDepartureSeconds}
                departAtMs={d.departAtMs}
                tripKey={key}
                originAbbr={decodedOrigin}
                destinationAbbr={decodedDest}
                useGtfsPrecision={i === 0}
                carLength={d.carLength}
                platform={d.platform}
                delaySeconds={d.delaySeconds}
                hexcolor={d.hexcolor}
                origTimeMin={d.origTimeMin}
                className={styles.meta}
                countdownClassName={styles.countdown}
                leavingClassName={styles.leaving}
                mutedClassName={styles.cars}
              />
              <div className={styles.fare}>
                {d.routeFare != null && `$${d.routeFare}`}
                {d.noEtd && d.origTimeMin != null && ` · Dep ${d.origTimeMin} (scheduled)`}
                {d.destTimeMin != null && ` · Arr ${d.destTimeMin}`}
              </div>
            </li>
          )
        })}
      </ul>

      <section className={styles.opposite}>
        <div className={styles.oppositeHeader}>
          <h2 className={styles.oppositeTitle}>Other direction</h2>
          <button type="button" className={styles.reverseLink} onClick={goReverse}>
            Open full list
          </button>
        </div>
        <p className={styles.oppositeSub}>
          {destName} → {originName}
        </p>
        {reverseLoading && reverseDepartures.length === 0 && (
          <p className={styles.loading}>Loading opposite…</p>
        )}
        {!reverseLoading && reverseDepartures.length === 0 && (
          <p className={styles.noService}>No opposite departures</p>
        )}
        <ul className={styles.list}>
          {reverseDepartures.slice(0, 2).map((d, i) => {
            const key = `rev-${fallbackTripKey(d)}`
            return (
            <li key={key} className={styles.cardMuted}>
              <DepartureMeta
                noEtd={d.noEtd}
                estDepartureSeconds={d.estDepartureSeconds}
                departAtMs={d.departAtMs}
                tripKey={key}
                originAbbr={decodedDest}
                destinationAbbr={decodedOrigin}
                useGtfsPrecision={i === 0}
                carLength={d.carLength}
                platform={d.platform}
                delaySeconds={d.delaySeconds}
                hexcolor={d.hexcolor}
                origTimeMin={d.origTimeMin}
                className={styles.meta}
                countdownClassName={styles.countdown}
                leavingClassName={styles.leaving}
                mutedClassName={styles.cars}
              />
              <div className={styles.fare}>
                {d.origTimeMin != null && `Dep ${d.origTimeMin}`}
                {d.destTimeMin != null && ` · Arr ${d.destTimeMin}`}
              </div>
            </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
