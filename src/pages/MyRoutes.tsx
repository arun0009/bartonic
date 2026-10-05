import { useMemo, useRef, useState, type PointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFavorites, useFavoritesActions } from '../hooks/useFavorites'
import { useEtdForFavorites } from '../hooks/useEtd'
import { useTrainPositions, getPositionForYourTrain } from '../hooks/useTrainPosition'
import DepartureMeta from '../components/DepartureMeta'
import type { FavoriteRoute } from '../types'
import styles from './MyRoutes.module.css'

const DRAG_THRESHOLD_PX = 10

export default function MyRoutes() {
  const navigate = useNavigate()
  const favorites = useFavorites()
  const { remove, reorder } = useFavoritesActions()
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
  const routeByPair = useMemo(() => {
    const m = new Map<string, (typeof routes)[0]>()
    for (const route of routes) {
      const originAbbr = (route.originAbbr ?? '').toUpperCase()
      const destinationAbbr = (route.destinationAbbr ?? '').toUpperCase()
      if (!originAbbr || !destinationAbbr) continue
      m.set(`${originAbbr}\0${destinationAbbr}`, route)
    }
    return m
  }, [routes])

  const listRef = useRef<HTMLUListElement>(null)
  const dragRef = useRef<{
    id: string
    pointerId: number
    startY: number
    dragging: boolean
  } | null>(null)
  const draftIdsRef = useRef<string[] | null>(null)
  const suppressClickRef = useRef(false)
  const [draftIds, setDraftIds] = useState<string[] | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const visibleIds = draftIds ?? favorites.map((f) => f.id)
  const favoritesById = useMemo(() => new Map(favorites.map((f) => [f.id, f])), [favorites])
  const visibleFavorites = visibleIds
    .map((id) => favoritesById.get(id))
    .filter((item): item is FavoriteRoute => item != null)

  function currentIds(): string[] {
    return draftIdsRef.current ?? favorites.map((f) => f.id)
  }

  function moveId(id: string, toIndex: number) {
    const ids = currentIds()
    const from = ids.indexOf(id)
    if (from === -1 || toIndex < 0 || toIndex >= ids.length || from === toIndex) return
    const next = [...ids]
    next.splice(from, 1)
    next.splice(toIndex, 0, id)
    draftIdsRef.current = next
    setDraftIds(next)
  }

  function pointerTargetIndex(clientY: number, dragId: string): number {
    const list = listRef.current
    if (!list) return currentIds().indexOf(dragId)
    const cards = [...list.querySelectorAll<HTMLElement>('[data-route-id]')]
    const ids = currentIds()
    const from = ids.indexOf(dragId)
    let to = from
    for (let i = 0; i < cards.length; i++) {
      const mid = cards[i].getBoundingClientRect().top + cards[i].offsetHeight / 2
      if (i < from && clientY < mid) {
        to = i
        break
      }
      if (i > from && clientY > mid) to = i
    }
    return to
  }

  function onCardPointerDown(event: PointerEvent<HTMLLIElement>, id: string) {
    if ((event.target as HTMLElement | null)?.closest('[data-no-drag]')) return
    dragRef.current = {
      id,
      pointerId: event.pointerId,
      startY: event.clientY,
      dragging: false
    }
  }

  function onCardPointerMove(event: PointerEvent<HTMLLIElement>) {
    const drag = dragRef.current
    if (!drag || event.pointerId !== drag.pointerId) return
    const dy = event.clientY - drag.startY
    if (!drag.dragging) {
      if (Math.abs(dy) < DRAG_THRESHOLD_PX) return
      drag.dragging = true
      suppressClickRef.current = true
      draftIdsRef.current = currentIds()
      setDraggingId(drag.id)
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    event.preventDefault()
    moveId(drag.id, pointerTargetIndex(event.clientY, drag.id))
  }

  function endDrag(event: PointerEvent<HTMLLIElement>) {
    const drag = dragRef.current
    if (!drag || event.pointerId !== drag.pointerId) return
    if (drag.dragging) {
      const next = draftIdsRef.current
      if (next) reorder(next)
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    }
    dragRef.current = null
    draftIdsRef.current = null
    setDraggingId(null)
    setDraftIds(null)
  }

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
          {favorites.length > 1 ? ' · drag to reorder' : ''}
        </p>
      </header>
      {loading && routes.length === 0 ? (
        <div className={styles.loading}>Loading…</div>
      ) : (
        <ul
          ref={listRef}
          className={draggingId ? `${styles.list} ${styles.listDragging}` : styles.list}
        >
          {visibleFavorites.map((fav) => {
            const originAbbr = fav.originAbbr.toUpperCase()
            const destinationAbbr = fav.destinationAbbr.toUpperCase()
            const route = routeByPair.get(`${originAbbr}\0${destinationAbbr}`)
            const trainPos = getPositionForYourTrain(
              tripPositions,
              fav.originAbbr,
              fav.destinationAbbr,
              route?.departAtMs ?? undefined
            )
            const dragging = draggingId === fav.id
            return (
              <li
                key={fav.id}
                data-route-id={fav.id}
                className={dragging ? `${styles.card} ${styles.cardDragging}` : styles.card}
                onPointerDown={(event) => onCardPointerDown(event, fav.id)}
                onPointerMove={onCardPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              >
                <button
                  type="button"
                  className={styles.cardInner}
                  onClick={() => {
                    if (suppressClickRef.current) {
                      suppressClickRef.current = false
                      return
                    }
                    navigate(
                      `/schedule/${encodeURIComponent(fav.originAbbr)}/${encodeURIComponent(fav.destinationAbbr)}`
                    )
                  }}
                >
                  <div className={styles.route}>
                    <span className={styles.routeOrigin}>
                      {route?.originName ?? fav.originName}
                    </span>
                    <span className={styles.routeTo}>
                      → {route?.destinationName ?? fav.destinationName}
                    </span>
                  </div>
                  {route ? (
                    <DepartureMeta
                      noEtd={route.noEtd}
                      estDepartureSeconds={route.estDepartureSeconds}
                      departAtMs={route.departAtMs}
                      tripKey={route.tripKey}
                      originAbbr={route.originAbbr ?? fav.originAbbr}
                      destinationAbbr={route.destinationAbbr ?? fav.destinationAbbr}
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
                  ) : (
                    <div className={styles.meta}>
                      <span className={styles.cars}>Loading…</span>
                    </div>
                  )}
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
                  {route && !route.noEtd && route.routeFare != null && route.destTimeMin != null && (
                    <div className={styles.fare}>
                      ${route.routeFare} · Arr {route.destTimeMin}
                    </div>
                  )}
                  {route?.noEtd && route.origTimeMin != null && (
                    <div className={styles.fare}>
                      Dep {route.origTimeMin} (scheduled)
                      {route.routeFare != null && ` · $${route.routeFare}`}
                      {route.destTimeMin != null && ` · Arr ${route.destTimeMin}`}
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  className={styles.reverseBtn}
                  data-no-drag
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
                <button
                  type="button"
                  className={styles.deleteBtn}
                  data-no-drag
                  onClick={(e) => {
                    e.stopPropagation()
                    remove(fav.id)
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
