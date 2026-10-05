import { useCallback, useMemo, useRef, useState, type PointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFavorites, useFavoritesActions } from '../hooks/useFavorites'
import { useEtdForFavorites } from '../hooks/useEtd'
import { useTrainPositions, getPositionForYourTrain } from '../hooks/useTrainPosition'
import { useAdvisories } from '../hooks/useAdvisories'
import { useNearestStations } from '../hooks/useNearestStations'
import { BART_STATIONS, getStation } from '../data/stations'
import { suggestDowntownDestination } from '../lib/stationSuggestions'
import { getActionableAdvisories, type Urgency } from '../lib/urgency'
import DepartureMeta from '../components/DepartureMeta'
import AdvisoryStrip from '../components/AdvisoryStrip'
import { AlertIcon, PlusIcon } from '../components/Icons'
import type { FavoriteRoute } from '../types'
import styles from './MyRoutes.module.css'

const DRAG_THRESHOLD_PX = 10

function HeaderActions({
  alertCount,
  onAlerts,
  onAdd
}: {
  alertCount: number
  onAlerts: () => void
  onAdd: () => void
}) {
  return (
    <div className={styles.headerActions}>
      <button
        type="button"
        className={styles.iconWell}
        onClick={onAlerts}
        aria-label={alertCount > 0 ? `BART advisories, ${alertCount} active` : 'BART advisories'}
      >
        <AlertIcon size={18} />
        {alertCount > 0 && (
          <span className={styles.alertBadge} aria-hidden>
            {Math.min(99, alertCount)}
          </span>
        )}
      </button>
      <button
        type="button"
        className={styles.addWell}
        onClick={onAdd}
        aria-label="Add route"
        title="Add route"
      >
        <PlusIcon size={18} />
      </button>
    </div>
  )
}

export default function MyRoutes() {
  const navigate = useNavigate()
  const favorites = useFavorites()
  const { add, remove, reorder } = useFavoritesActions()
  const { advisories } = useAdvisories()
  const { nearestStations, hasLocation, locating, locationError, requestLocation, nearestFromCoords } =
    useNearestStations(BART_STATIONS)
  const [pendingConvert, setPendingConvert] = useState(false)

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

  const suggested = useMemo(() => {
    if (hasLocation && nearestStations[0]) {
      const origin = nearestStations[0]
      const dest = getStation(suggestDowntownDestination(origin.abbr))
      if (!dest) return null
      return { origin, dest, example: false }
    }
    if (locationError) {
      const origin = getStation('EMBR')
      const dest = getStation('MONT')
      if (!origin || !dest) return null
      return { origin, dest, example: true }
    }
    return null
  }, [hasLocation, nearestStations, locationError])

  function savePair(originAbbr: string, originName: string, destAbbr: string, destName: string) {
    add({
      originAbbr,
      originName,
      destinationAbbr: destAbbr,
      destinationName: destName
    })
  }

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
    const wasDragging = drag.dragging
    const next = wasDragging ? draftIdsRef.current : null
    const target = event.currentTarget
    const pointerId = event.pointerId
    dragRef.current = null
    draftIdsRef.current = null
    setDraggingId(null)
    setDraftIds(null)
    if (wasDragging) {
      if (next) reorder(next)
      if (target.hasPointerCapture(pointerId)) {
        target.releasePointerCapture(pointerId)
      }
      suppressClickRef.current = true
      window.setTimeout(() => {
        suppressClickRef.current = false
      }, 400)
    }
  }

  const goAdd = () => {
    setPendingConvert(false)
    navigate('/add')
  }
  const goAlerts = () => navigate('/info')
  const alertCount = getActionableAdvisories(advisories).length

  const onConvert = () => {
    if (locationError) {
      navigate('/add')
      return
    }
    if (hasLocation && suggested && !suggested.example) {
      savePair(
        suggested.origin.abbr,
        suggested.origin.name,
        suggested.dest.abbr,
        suggested.dest.name
      )
      return
    }
    setPendingConvert(true)
    void requestLocation().then((coords) => {
      setPendingConvert(false)
      if (!coords) return
      const origin = nearestFromCoords(coords)
      const dest = origin ? getStation(suggestDowntownDestination(origin.abbr)) : undefined
      if (!origin || !dest) return
      savePair(origin.abbr, origin.name, dest.abbr, dest.name)
    })
  }

  const chooseStations = () => {
    setPendingConvert(false)
    if (hasLocation && nearestStations[0]) {
      navigate(`/add?from=${encodeURIComponent(nearestStations[0].abbr)}`)
      return
    }
    navigate('/add')
  }

  const primaryLabel = locating && pendingConvert
    ? 'Finding nearest station…'
    : hasLocation && suggested && !suggested.example
      ? `Save ${suggested.origin.name} → ${suggested.dest.name}`
      : locationError
        ? 'Add a route'
        : 'Save nearest → Embarcadero'

  if (favorites.length === 0) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>My Routes</h1>
            <HeaderActions alertCount={alertCount} onAlerts={goAlerts} onAdd={goAdd} />
          </div>
        </header>
        <AdvisoryStrip advisories={advisories} onOpen={goAlerts} />
        <div className={styles.empty}>
          <p className={styles.ghostClock} aria-hidden>
            —m ——s
          </p>
          <h2 className={styles.emptyTitle}>Should you run?</h2>
          <p className={styles.emptySub}>
            Save one commute. Next time you open this, the seconds are already ticking.
          </p>
          <div className={styles.ghostCard} aria-hidden>
            <div className={styles.route}>
              <span className={styles.routeOrigin}>
                {suggested && !suggested.example ? suggested.origin.name : 'Nearest station'}
              </span>
              <span className={styles.routeTo}>
                → {suggested && !suggested.example ? suggested.dest.name : 'Embarcadero'}
              </span>
            </div>
            {suggested?.example && <div className={styles.exampleTag}>Example</div>}
            <div className={styles.ghostMeta}>8m 12s</div>
            <div className={styles.cars}>10 car · Plat 2</div>
          </div>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={onConvert}
            disabled={locating && pendingConvert}
          >
            {primaryLabel}
          </button>
          <button type="button" className={styles.secondaryButton} onClick={chooseStations}>
            Choose stations
          </button>
          {locationError && (
            <p className={styles.locationError} role="status">
              {locationError}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>My Routes</h1>
          <HeaderActions alertCount={alertCount} onAlerts={goAlerts} onAdd={goAdd} />
        </div>
        <p className={styles.subtitle}>
          {stale
            ? 'Reconnecting…'
            : updatedAt
              ? favorites.length > 1
                ? 'Live · drag to reorder'
                : 'Live'
              : 'Updating…'}
        </p>
      </header>
      <AdvisoryStrip advisories={advisories} onOpen={goAlerts} />
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
              <FavoriteCard
                key={fav.id}
                fav={fav}
                route={route}
                trainPos={trainPos}
                dragging={dragging}
                onPointerDown={onCardPointerDown}
                onPointerMove={onCardPointerMove}
                onPointerUp={endDrag}
                onOpen={() => {
                  if (suppressClickRef.current) {
                    suppressClickRef.current = false
                    return
                  }
                  navigate(
                    `/schedule/${encodeURIComponent(fav.originAbbr)}/${encodeURIComponent(fav.destinationAbbr)}`
                  )
                }}
                onReverse={() =>
                  navigate(
                    `/schedule/${encodeURIComponent(fav.destinationAbbr)}/${encodeURIComponent(fav.originAbbr)}`
                  )
                }
                onRemove={() => remove(fav.id)}
              />
            )
          })}
        </ul>
      )}
    </div>
  )
}

function FavoriteCard({
  fav,
  route,
  trainPos,
  dragging,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onOpen,
  onReverse,
  onRemove
}: {
  fav: FavoriteRoute
  route: ReturnType<typeof useEtdForFavorites>['routes'][number] | undefined
  trainPos: ReturnType<typeof getPositionForYourTrain>
  dragging: boolean
  onPointerDown: (event: PointerEvent<HTMLLIElement>, id: string) => void
  onPointerMove: (event: PointerEvent<HTMLLIElement>) => void
  onPointerUp: (event: PointerEvent<HTMLLIElement>) => void
  onOpen: () => void
  onReverse: () => void
  onRemove: () => void
}) {
  const [urgency, setUrgency] = useState<Urgency>('none')
  const onUrgency = useCallback((next: Urgency) => setUrgency(next), [])
  const rail =
    urgency === 'leave'
      ? styles.railLeave
      : urgency === 'soon'
        ? styles.railSoon
        : urgency === 'calm'
          ? styles.railCalm
          : ''

  return (
    <li
      data-route-id={fav.id}
      className={`${styles.card} ${rail} ${dragging ? styles.cardDragging : ''}`.trim()}
      onPointerDown={(event) => onPointerDown(event, fav.id)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onLostPointerCapture={onPointerUp}
    >
      <button type="button" className={styles.cardInner} onClick={onOpen}>
        <div className={styles.route}>
          <span className={styles.routeOrigin}>{route?.originName ?? fav.originName}</span>
          <span className={styles.routeTo}>→ {route?.destinationName ?? fav.destinationName}</span>
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
            warnClassName={styles.warn}
            leavingClassName={styles.leaving}
            mutedClassName={styles.cars}
            layout="hero"
            onUrgency={onUrgency}
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
          onReverse()
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
          onRemove()
        }}
        aria-label="Remove route"
      >
        −
      </button>
    </li>
  )
}
