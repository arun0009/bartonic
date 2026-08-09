import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFavorites, useFavoritesActions } from '../hooks/useFavorites'
import { useEtdForFavorites } from '../hooks/useEtd'
import { useTrainPositions, getPositionForYourTrain } from '../hooks/useTrainPosition'
import DepartureMeta from '../components/DepartureMeta'
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
  const { routes, loading, stale, updatedAt } = useEtdForFavorites(favoriteInput)
  const { trips: tripPositions } = useTrainPositions()
  const favById = useMemo(() => {
    const m = new Map<string, (typeof favorites)[0]>()
    for (const f of favorites) {
      m.set(`${f.originAbbr.toUpperCase()}\0${f.destinationAbbr.toUpperCase()}`, f)
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
        <p className={styles.subtitle}>
          {stale
            ? 'Showing last known times · reconnecting…'
            : updatedAt
              ? 'Next departures · live'
              : 'Next departures · updates every 15s'}
        </p>
      </header>
      {loading && routes.length === 0 ? (
        <div className={styles.loading}>Loading…</div>
      ) : (
        <ul className={styles.list}>
          {routes.map((route) => {
            const originAbbr = (route.originAbbr ?? '').toUpperCase()
            const destinationAbbr = (route.destinationAbbr ?? '').toUpperCase()
            const fav =
              favById.get(`${originAbbr}\0${destinationAbbr}`) ??
              favorites.find(
                (f) => f.originName === route.originName && f.destinationName === route.destinationName
              )
            const trainPos = fav
              ? getPositionForYourTrain(
                  tripPositions,
                  fav.originAbbr,
                  fav.destinationAbbr,
                  route.departAtMs ?? undefined
                )
              : undefined
            return (
              <li key={fav?.id ?? `${originAbbr}-${destinationAbbr}`} className={styles.card}>
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
                  <DepartureMeta
                    noEtd={route.noEtd}
                    estDepartureSeconds={route.estDepartureSeconds}
                    departAtMs={route.departAtMs}
                    tripKey={route.tripKey}
                    originAbbr={route.originAbbr ?? fav?.originAbbr}
                    destinationAbbr={route.destinationAbbr ?? fav?.destinationAbbr}
                    useGtfsPrecision
                    carLength={route.carLength}
                    platform={route.platform}
                    delaySeconds={route.delaySeconds}
                    hexcolor={route.hexcolor}
                    origTimeMin={route.origTimeMin}
                    className={styles.meta}
                    countdownClassName={styles.countdown}
                    leavingClassName={styles.leaving}
                    mutedClassName={styles.cars}
                  />
                  {trainPos && (
                    <div className={styles.trainAt}>
                      Your train at {trainPos.currentStationName}
                      {trainPos.stopsAway != null && trainPos.stopsAway > 0 && (
                        <span>
                          {' '}
                          · {trainPos.stopsAway} stop{trainPos.stopsAway !== 1 ? 's' : ''} away
                        </span>
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
                {fav && (
                  <button
                    type="button"
                    className={styles.reverseBtn}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(
                        `/schedule/${encodeURIComponent(fav.destinationAbbr)}/${encodeURIComponent(fav.originAbbr)}`
                      )
                    }}
                    aria-label="Other direction"
                    title="Other direction"
                  >
                    ⇄
                  </button>
                )}
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
