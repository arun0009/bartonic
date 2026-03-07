import { useParams, useNavigate } from 'react-router-dom'
import { useEtdForRoute } from '../hooks/useEtd'
import { useTrainPosition } from '../hooks/useTrainPosition'
import { getStation } from '../data/stations'
import Countdown from '../components/Countdown'
import styles from './RouteSchedule.module.css'

export default function RouteSchedule() {
  const { origin = '', destination = '' } = useParams<{ origin: string; destination: string }>()
  const navigate = useNavigate()
  const decodedOrigin = decodeURIComponent(origin)
  const decodedDest = decodeURIComponent(destination)
  const { departures, loading, error } = useEtdForRoute(decodedOrigin, decodedDest)
  const trainPosition = useTrainPosition(decodedOrigin, decodedDest)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className={styles.title}>Departures</h1>
        <p className={styles.subtitle}>
          {decodedOrigin} → {decodedDest}
        </p>
      </header>
      {trainPosition && (
        <div className={styles.trainPosition}>
          <span className={styles.trainPositionLabel}>Your next train is at</span>{' '}
          <strong>{trainPosition.currentStationName}</strong>
          {trainPosition.stopsAway != null && trainPosition.stopsAway > 0 && (
            <span className={styles.stopsAway}> · {trainPosition.stopsAway} stop{trainPosition.stopsAway !== 1 ? 's' : ''} away</span>
          )}
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
      {loading && departures.length === 0 && <p className={styles.loading}>Loading…</p>}
      {!loading && departures.length === 0 && !error && (
        <p className={styles.noService}>No departures</p>
      )}
      <ul className={styles.list}>
        {departures.map((d, i) => {
          const destName = d.destinationStationName ?? getStation(d.destination)?.name ?? d.destination
          const routeLabel = d.firstStationName
            ? (d.connectingStationName ? `${d.firstStationName} → ${d.connectingStationName} → ` : `${d.firstStationName} → `) + (destName ?? '')
            : `To ${destName ?? 'destination'}`
          return (
            <li key={i} className={styles.card}>
              <div className={styles.route}>
                {routeLabel}
              </div>
              <div className={styles.meta}>
                {d.noEtd ? (
                  <span className={styles.noEtd}>
                    {d.origTimeMin != null
                      ? `Scheduled departure at ${d.origTimeMin}`
                      : 'No live ETD'}
                  </span>
                ) : d.estDepartureSeconds === 'LEAVING_NOW' ? (
                  <span className={styles.leaving}>
                    Leaving{d.carLength != null ? ` (${d.carLength} car)` : ''}
                  </span>
                ) : (
                  <Countdown seconds={d.estDepartureSeconds} className={styles.countdown} />
                )}
                {typeof d.estDepartureSeconds === 'number' && d.carLength != null && (
                  <span className={styles.cars}> ({d.carLength} car)</span>
                )}
              </div>
              <div className={styles.fare}>
                {d.routeFare != null && `$${d.routeFare}`}
                {d.noEtd && d.origTimeMin != null && ` · Dep ${d.origTimeMin} (scheduled)`}
                {d.destTimeMin != null && ` · Arr ${d.destTimeMin}`}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
