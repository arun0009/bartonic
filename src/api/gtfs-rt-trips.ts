/**
 * BART GTFS-Realtime trip updates.
 *
 * Feed notes (2025+ platform GTFS):
 * - Protobuf JSON uses camelCase (tripUpdate, tripId, stopTimeUpdate, stopId)
 * - Trips identify via tripId; routeId is often absent
 * - stopId values are platform codes (e.g. M16-1) → map to station abbr via GTFS stops
 */
import { TRIP_UPDATE_URL } from './constants'
import { stationAbbrFromStopId } from '../data/gtfsPlatformStops'
import { getStation } from '../data/stations'
import { GTFS_MATCH_TOLERANCE_MS } from '../lib/departureTime'

const CACHE_MS = 15_000
let cache: { at: number; trips: TripPosition[] } | null = null
let lastError: string | null = null
let lastSuccessAt: number | null = null

export interface TrainPosition {
  tripId?: string
  destinationAbbr: string
  destinationName: string
  currentStopId: string
  currentStationName: string
  /** Unix seconds departure at origin when matched */
  departAtOriginEpoch?: number
  stopsAway?: number
}

export interface TripPosition extends TrainPosition {
  tripId: string
  stopTimes: Array<{ stopId: string; departureTime: number; platformStopId?: string }>
}

function toEpochSeconds(value: unknown): number {
  if (value == null) return Infinity
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const n = parseInt(value, 10)
    return Number.isNaN(n) ? Infinity : n
  }
  if (typeof value === 'object') {
    const obj = value as { toNumber?: () => number; low?: number }
    if (typeof obj.toNumber === 'function') return obj.toNumber()
    if (typeof obj.low === 'number') return obj.low
  }
  return Infinity
}

function pickTripUpdate(entity: Record<string, unknown>): Record<string, unknown> | null {
  const tu = (entity.tripUpdate ?? entity.trip_update) as Record<string, unknown> | undefined
  return tu ?? null
}

function pickTrip(tu: Record<string, unknown>): Record<string, unknown> | null {
  return (tu.trip as Record<string, unknown> | undefined) ?? null
}

function pickStopUpdates(tu: Record<string, unknown>): Array<Record<string, unknown>> {
  const raw = tu.stopTimeUpdate ?? tu.stop_time_update
  return Array.isArray(raw) ? (raw as Array<Record<string, unknown>>) : []
}

function stopUpdateTime(stu: Record<string, unknown>): number {
  const dep = (stu.departure as Record<string, unknown> | undefined)?.time
  const arr = (stu.arrival as Record<string, unknown> | undefined)?.time
  return toEpochSeconds(dep ?? arr)
}

function normStation(stopId: string): string {
  return stationAbbrFromStopId(stopId) ?? String(stopId).toUpperCase()
}

/**
 * Related termini that share a corridor / short-turn in GTFS-RT.
 * ETD headsigns often name the full terminus while the feed ends one stop early
 * (DUBL↔WDUB, DALY↔BALB). Do not alias MLBR↔SBRN — Millbrae is a spur.
 */
function relatedDestinations(abbr: string): string[] {
  const a = normStation(abbr)
  if (a === 'PITT' || a === 'ANTC' || a === 'PCTR') return ['PITT', 'ANTC', 'PCTR']
  if (a === 'SFIA' || a === 'MLBR') return ['SFIA', 'MLBR']
  if (a === 'DUBL' || a === 'WDUB') return ['DUBL', 'WDUB']
  if (a === 'DALY' || a === 'BALB') return ['DALY', 'BALB']
  return [a]
}

async function decodeTripUpdates(): Promise<TripPosition[]> {
  const mod = await import('gtfs-realtime-bindings')
  const root = (mod as { transit_realtime?: { FeedMessage?: { decode: (buf: Uint8Array) => { entity?: unknown[] } } } }).transit_realtime
    ?? (mod as { default?: { transit_realtime?: { FeedMessage?: { decode: (buf: Uint8Array) => { entity?: unknown[] } } } } }).default?.transit_realtime
  const FeedMessage = root?.FeedMessage
  if (!FeedMessage) {
    lastError = 'GTFS-RT decoder unavailable'
    return []
  }

  const res = await fetch(TRIP_UPDATE_URL)
  if (!res.ok) {
    lastError = `GTFS-RT HTTP ${res.status}`
    return []
  }
  const buf = new Uint8Array(await res.arrayBuffer())
  const feed = FeedMessage.decode(buf)
  const now = Math.floor(Date.now() / 1000)
  const trips: TripPosition[] = []

  for (const entity of feed.entity || []) {
    const tu = pickTripUpdate(entity as Record<string, unknown>)
    if (!tu) continue
    const trip = pickTrip(tu)
    const tripId = String(trip?.tripId ?? trip?.trip_id ?? '').trim()
    const stopUpdates = pickStopUpdates(tu)
      .filter((s) => (s.stopId ?? s.stop_id) != null && stopUpdateTime(s) !== Infinity)
      .sort((a, b) => {
        const seqA = Number(a.stopSequence ?? a.stop_sequence ?? 0)
        const seqB = Number(b.stopSequence ?? b.stop_sequence ?? 0)
        return seqA - seqB || stopUpdateTime(a) - stopUpdateTime(b)
      })

    if (!tripId || stopUpdates.length === 0) continue

    const stopTimes = stopUpdates.map((s) => {
      const platformStopId = String(s.stopId ?? s.stop_id ?? '')
      return {
        platformStopId,
        stopId: normStation(platformStopId),
        departureTime: stopUpdateTime(s)
      }
    })

    const lastStopId = stopTimes[stopTimes.length - 1]?.stopId
    if (!lastStopId) continue

    const future = stopTimes.find((s) => s.departureTime > now)
    const current = future ?? stopTimes[stopTimes.length - 1]
    const destStation = getStation(lastStopId)
    const currentStation = getStation(current.stopId)

    trips.push({
      tripId,
      destinationAbbr: lastStopId,
      destinationName: destStation?.name ?? lastStopId,
      currentStopId: current.stopId,
      currentStationName: currentStation?.name ?? current.stopId,
      stopTimes
    })
  }

  lastError = null
  lastSuccessAt = Date.now()
  return trips
}

export function getTrainPositionError(): string | null {
  return lastError
}

export function getTrainPositionsUpdatedAt(): number | null {
  return lastSuccessAt
}

export async function fetchTrainPositions(): Promise<TripPosition[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.trips
  try {
    const trips = await decodeTripUpdates()
    if (trips.length > 0) {
      cache = { at: Date.now(), trips }
      return trips
    }
    return cache?.trips ?? []
  } catch {
    lastError = 'GTFS-RT fetch failed'
    return cache?.trips ?? []
  }
}

type ServingCandidate = {
  trip: TripPosition
  depAtOrigin: number
  originIdx: number
}

function findServingCandidates(
  trips: TripPosition[],
  originAbbr: string,
  destinationAbbr: string
): ServingCandidate[] {
  const origin = normStation(originAbbr)
  const dest = normStation(destinationAbbr)
  const destSet = new Set(relatedDestinations(dest))
  const now = Math.floor(Date.now() / 1000)
  const out: ServingCandidate[] = []

  for (const t of trips) {
    const originIdx = t.stopTimes.findIndex((s) => s.stopId === origin)
    if (originIdx === -1) continue

    const destIdx = t.stopTimes.findIndex(
      (s, i) => i > originIdx && (s.stopId === dest || destSet.has(s.stopId))
    )
    const terminusOk = destSet.has(t.destinationAbbr)
    if (destIdx === -1 && !terminusOk) continue

    const depAtOrigin = t.stopTimes[originIdx].departureTime
    if (depAtOrigin < now) continue
    out.push({ trip: t, depAtOrigin, originIdx })
  }

  out.sort((a, b) => a.depAtOrigin - b.depAtOrigin)
  return out
}

/**
 * Second-precision departure at origin for a train serving this OD.
 * Prefer the trip closest to `nearEpochMs` when provided.
 */
export function getDepartureEpochAtOrigin(
  trips: TripPosition[],
  originAbbr: string,
  destinationAbbr: string,
  nearEpochMs?: number
): number | undefined {
  return getMatchedServingTrip(trips, originAbbr, destinationAbbr, nearEpochMs)?.depAtOrigin
}

/** Full matched trip for unified countdown + position identity. */
export function getMatchedServingTrip(
  trips: TripPosition[],
  originAbbr: string,
  destinationAbbr: string,
  nearEpochMs?: number
): ServingCandidate | undefined {
  const candidates = findServingCandidates(trips, originAbbr, destinationAbbr)
  if (candidates.length === 0) return undefined

  if (nearEpochMs == null) return candidates[0]

  const nearSec = nearEpochMs / 1000
  let best = candidates[0]
  let bestDelta = Math.abs(best.depAtOrigin - nearSec)
  for (const c of candidates) {
    const delta = Math.abs(c.depAtOrigin - nearSec)
    if (delta < bestDelta) {
      best = c
      bestDelta = delta
    }
  }
  // Same window as preferGtfsDepartAtMs — never bind countdown/position to a different train.
  if (bestDelta * 1000 > GTFS_MATCH_TOLERANCE_MS) return undefined
  return best
}

export function getPositionForYourTrain(
  trips: TripPosition[],
  originAbbr: string,
  destinationAbbr: string,
  nearEpochMs?: number
): TrainPosition | undefined {
  const best = getMatchedServingTrip(trips, originAbbr, destinationAbbr, nearEpochMs)
  if (!best) return undefined

  const t = best.trip
  const currentIdx = t.stopTimes.findIndex((s) => s.stopId === t.currentStopId)
  const stopsBeforeOrigin = currentIdx === -1 ? best.originIdx : Math.max(0, best.originIdx - currentIdx)
  return {
    tripId: t.tripId,
    destinationAbbr: t.destinationAbbr,
    destinationName: t.destinationName,
    currentStopId: t.currentStopId,
    currentStationName: t.currentStationName,
    departAtOriginEpoch: best.depAtOrigin,
    stopsAway: stopsBeforeOrigin
  }
}
