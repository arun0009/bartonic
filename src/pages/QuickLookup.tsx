import { useState, useMemo } from 'react'
import { BART_STATIONS } from '../data/stations'
import { useEtdForRoute } from '../hooks/useEtd'
import { useNearestStations } from '../hooks/useNearestStations'
import { useRecentStations } from '../hooks/useRecentStations'
import { getPopularFirstDestinations } from '../lib/stationSuggestions'
import Countdown from '../components/Countdown'
import styles from './QuickLookup.module.css'

export default function QuickLookup() {
  const [origin, setOrigin] = useState<{ abbr: string; name: string } | null>(null)
  const [destination, setDestination] = useState<{ abbr: string; name: string } | null>(null)
  const [searchOrigin, setSearchOrigin] = useState('')
  const [searchDest, setSearchDest] = useState('')
  const [submitted, setSubmitted] = useState(false)
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

  const originAbbr = origin?.abbr ?? ''
  const destinationAbbr = destination?.abbr ?? ''
  const { departures, loading, error, refresh } = useEtdForRoute(originAbbr, destinationAbbr)

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

  const handleLookup = () => {
    if (origin && destination && origin.abbr !== destination.abbr) setSubmitted(true)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Quick lookup</h1>
        <p className={styles.subtitle}>See next departures for any trip</p>
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
          {filteredOrigin.slice(0, 6).map((s) => (
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
          {filteredDest.slice(0, 6).map((s) => (
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
        <button
          type="button"
          className={styles.lookupBtn}
          onClick={handleLookup}
          disabled={!origin || !destination || origin.abbr === destination.abbr}
        >
          Show departures
        </button>
      </div>
      {submitted && origin && destination && (
        <section className={styles.results}>
          <div className={styles.resultHeader}>
            <h2 className={styles.resultTitle}>
              {origin.name} → {destination.name}
            </h2>
            <button type="button" className={styles.refresh} onClick={() => refresh()}>
              Refresh
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          {loading && departures.length === 0 && <p className={styles.loading}>Loading…</p>}
          {!loading && departures.length === 0 && !error && (
            <p className={styles.noService}>No departures</p>
          )}
          <ul className={styles.departureList}>
            {departures.map((d, i) => (
              <li key={i} className={styles.departureCard}>
                <div className={styles.departureRoute}>
                  {d.firstStationName && <span>{d.firstStationName}</span>}
                  {d.connectingStationName && (
                    <span className={styles.connecting}> → {d.connectingStationName}</span>
                  )}
                  {d.destinationStationName && (
                    <span className={styles.dest}> → {d.destinationStationName}</span>
                  )}
                </div>
                <div className={styles.departureMeta}>
                  {d.noEtd ? (
                    <span className={styles.cars}>
                      {d.origTimeMin != null
                        ? `Scheduled departure at ${d.origTimeMin}`
                        : 'No live ETD'}
                    </span>
                  ) : d.estDepartureSeconds === 'LEAVING_NOW' ? (
                    <span className={styles.leaving}>
                      Leaving {d.carLength != null ? `(${d.carLength} car)` : ''}
                    </span>
                  ) : (
                    <Countdown seconds={d.estDepartureSeconds} className={styles.countdown} />
                  )}
                  {typeof d.estDepartureSeconds === 'number' && d.carLength != null && (
                    <span className={styles.cars}> ({d.carLength} car)</span>
                  )}
                </div>
                <div className={styles.departureFare}>
                  {d.routeFare != null && `$${d.routeFare}`}
                  {d.noEtd && d.origTimeMin != null && ` · Dep ${d.origTimeMin} (scheduled)`}
                  {d.destTimeMin != null && ` · Arr ${d.destTimeMin}`}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
