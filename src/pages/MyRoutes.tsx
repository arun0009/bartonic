import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFavorites, useFavoritesActions } from '../hooks/useFavorites'
import { useEtdForFavorites } from '../hooks/useEtd'
import { useTrainPositions, getPositionForYourTrain } from '../hooks/useTrainPosition'
import Countdown from '../components/Countdown'
import styles from './MyRoutes.module.css'

export default function MyRoutes() {
  const navigate = useNavigate()
  const favorites = useFavorites()
  const { remove } = useFavoritesActions()
  const favoriteInput = useMemo(
    () =>
      favorites.map((f) => ({
        originAbbr: f.originAbbr,
        originName: f.originName,
        destinationAbbr: f.destinationAbbr,
        destinationName: f.destinationName,
        index: f.index
      })),
    [favorites]
  )
  const { routes, loading } = useEtdForFavorites(favoriteInput)
  const tripPositions = useTrainPositions()
  const favById = useMemo(() => {
    const m = new Map<string, (typeof favorites)[0]>()
    for (const f of favorites) {
      m.set(`${f.originName}\0${f.destinationName}`, f)
    }
    return m
  }, [favorites])

  if (favorites.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>No favorite routes</p>
        <p className={styles.emptySub}>Add your usual BART trips to see live countdowns here.</p>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => navigate('/add')}
        >
          Add a route
        </button>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Routes</h1>
        <p className={styles.subtitle}>Next departures · updates every 15s</p>
      </header>
      {loading && routes.length === 0 ? (
        <div className={styles.loading}>Loading…</div>
      ) : (
        <ul className={styles.list}>
          {routes.map((route) => {
            const fav = favById.get(`${route.originName}\0${route.destinationName}`)
            const trainPos = fav ? getPositionForYourTrain(tripPositions, fav.originAbbr, fav.destinationAbbr) : undefined
            return (
              <li key={fav?.id ?? `${route.originName}-${route.destinationName}`} className={styles.card}>
                <button
                  type="button"
                  className={styles.cardInner}
                  onClick={() => {
                    if (!fav) return
                    navigate(
                      `/schedule/${encodeURIComponent(fav.originAbbr)}/${encodeURIComponent(fav.destinationAbbr)}`
                    )
                  }}
                >
                  <div className={styles.route}>
                    <span className={styles.routeOrigin}>{route.originName}</span>
                    <span className={styles.routeTo}>→ {route.destinationName}</span>
                  </div>
                  <div className={styles.meta}>
                    {route.estDepartureSeconds === null && !route.noEtd && (
                      <span className={styles.noService}>No service</span>
                    )}
                    {route.noEtd && (
                      <span className={styles.noEtd}>
                        {route.origTimeMin != null
                          ? `Scheduled departure at ${route.origTimeMin}`
                          : 'No live ETD'}
                      </span>
                    )}
                    {!route.noEtd && route.estDepartureSeconds === 'LEAVING_NOW' && (
                      <span className={styles.leaving}>
                        Leaving {route.carLength != null ? `(${route.carLength} car)` : ''}
                      </span>
                    )}
                    {!route.noEtd && typeof route.estDepartureSeconds === 'number' && (
                      <Countdown
                        seconds={route.estDepartureSeconds}
                        className={styles.countdown}
                      />
                    )}
                    {!route.noEtd && route.estDepartureSeconds !== null && route.carLength != null && typeof route.estDepartureSeconds === 'number' && (
                      <span className={styles.cars}> ({route.carLength} car)</span>
                    )}
                  </div>
                  {trainPos && (
                    <div className={styles.trainAt}>
                      Train at {trainPos.currentStationName}
                      {trainPos.stopsAway != null && trainPos.stopsAway > 0 && (
                        <span> · {trainPos.stopsAway} stop{trainPos.stopsAway !== 1 ? 's' : ''} away</span>
                      )}
                    </div>
                  )}
                  {!route.noEtd && route.routeFare != null && route.destTimeMin != null && (
                    <div className={styles.fare}>
                      ${route.routeFare} · Arr {route.destTimeMin}
                    </div>
                  )}
                  {route.noEtd && route.origTimeMin != null && (
                    <div className={styles.fare}>
                      Dep {route.origTimeMin} (scheduled)
                      {route.routeFare != null && ` · $${route.routeFare}`}
                      {route.destTimeMin != null && ` · Arr ${route.destTimeMin}`}
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (fav) remove(fav.id)
                  }}
                  aria-label="Remove route"
                >
                  −
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
