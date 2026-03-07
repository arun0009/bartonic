import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFavoritesActions } from '../hooks/useFavorites'
import { useNearestStations } from '../hooks/useNearestStations'
import { useRecentStations } from '../hooks/useRecentStations'
import { BART_STATIONS } from '../data/stations'
import { getPopularFirstDestinations } from '../lib/stationSuggestions'
import styles from './AddRoute.module.css'

export default function AddRoute() {
  const navigate = useNavigate()
  const { add } = useFavoritesActions()
  const [origin, setOrigin] = useState<{ abbr: string; name: string } | null>(null)
  const [destination, setDestination] = useState<{ abbr: string; name: string } | null>(null)
  const [returnTrip, setReturnTrip] = useState(false)
  const [searchOrigin, setSearchOrigin] = useState('')
  const [searchDest, setSearchDest] = useState('')
  const { nearestStations, hasLocation, locating, locationError, requestLocation } =
    useNearestStations(BART_STATIONS)
  const {
    recentOrigins,
    recentDestinations,
    markOrigin,
    markDestination,
    rankStationsByRecents
  } = useRecentStations()
  const defaultDestinations = useMemo(() => getPopularFirstDestinations(BART_STATIONS), [])
  const defaultOrigins = useMemo(
    () => rankStationsByRecents(nearestStations, recentOrigins),
    [nearestStations, recentOrigins, rankStationsByRecents]
  )
  const rankedDestinations = useMemo(
    () => rankStationsByRecents(defaultDestinations, recentDestinations),
    [defaultDestinations, recentDestinations, rankStationsByRecents]
  )

  const filteredOrigin = useMemo(
    () =>
      !searchOrigin.trim()
        ? defaultOrigins
        : defaultOrigins.filter(
            (s) =>
              s.name.toLowerCase().includes(searchOrigin.toLowerCase()) ||
              s.abbr.toLowerCase().includes(searchOrigin.toLowerCase())
          ),
    [searchOrigin, defaultOrigins]
  )
  const filteredDest = useMemo(
    () =>
      !searchDest.trim()
        ? rankedDestinations
        : rankedDestinations.filter(
            (s) =>
              s.name.toLowerCase().includes(searchDest.toLowerCase()) ||
              s.abbr.toLowerCase().includes(searchDest.toLowerCase())
          ),
    [searchDest, rankedDestinations]
  )

  const handleAdd = () => {
    if (!origin || !destination || origin.abbr === destination.abbr) return
    add({
      originAbbr: origin.abbr,
      originName: origin.name,
      destinationAbbr: destination.abbr,
      destinationName: destination.name
    })
    if (returnTrip) {
      add({
        originAbbr: destination.abbr,
        originName: destination.name,
        destinationAbbr: origin.abbr,
        destinationName: origin.name
      })
    }
    navigate('/routes')
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Add route</h1>
        <p className={styles.subtitle}>Save your frequent BART trips</p>
      </header>
      <div className={styles.form}>
        <label className={styles.label}>From</label>
        <div className={styles.locationRow}>
          <button type="button" className={styles.locationBtn} onClick={requestLocation} disabled={locating}>
            {locating ? 'Locating…' : hasLocation ? 'Using nearest stations' : 'Use my location'}
          </button>
          {locationError && <span className={styles.locationError}>{locationError}</span>}
        </div>
        <input
          type="text"
          placeholder="Search station…"
          value={searchOrigin}
          onChange={(e) => setSearchOrigin(e.target.value)}
          className={styles.input}
        />
        <div className={styles.stationList}>
          {filteredOrigin.slice(0, 8).map((s) => (
            <button
              key={s.abbr}
              type="button"
              className={origin?.abbr === s.abbr ? styles.stationActive : styles.station}
              onClick={() => {
                setOrigin({ abbr: s.abbr, name: s.name })
                markOrigin(s.abbr)
              }}
            >
              {s.name}
            </button>
          ))}
        </div>

        <label className={styles.label}>To</label>
        <input
          type="text"
          placeholder="Search station…"
          value={searchDest}
          onChange={(e) => setSearchDest(e.target.value)}
          className={styles.input}
        />
        <div className={styles.stationList}>
          {filteredDest.slice(0, 8).map((s) => (
            <button
              key={s.abbr}
              type="button"
              className={destination?.abbr === s.abbr ? styles.stationActive : styles.station}
              onClick={() => {
                setDestination({ abbr: s.abbr, name: s.name })
                markDestination(s.abbr)
              }}
            >
              {s.name}
            </button>
          ))}
        </div>

        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            checked={returnTrip}
            onChange={(e) => setReturnTrip(e.target.checked)}
          />
          Add return route
        </label>

        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={() => navigate('/routes')}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.submit}
            onClick={handleAdd}
            disabled={!origin || !destination || origin.abbr === destination.abbr}
          >
            Add to My Routes
          </button>
        </div>
      </div>
    </div>
  )
}
