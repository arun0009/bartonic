/**
 * BART GTFS-Realtime trip updates: where is your train?
 * "Your next Dublin/Pleasanton train is at West Oakland" so you can
 * run back a few stations or wait for the next one.
 */
import { TRIP_UPDATE_URL } from './constants'
import { getStation } from '../data/stations'

const CACHE_MS = 30_000
let cache: { at: number; trips: TripPosition[] } | null = null

export interface TrainPosition {
  destinationAbbr: string
  destinationName: string
  currentStopId: string
  currentStationName: string
  /** How many stops until your station (if known) */
  stopsAway?: number
}

export interface TripPosition extends TrainPosition {
  /** Stop IDs this trip will serve (in order), with departure times */
  stopTimes: Array<{ stopId: string; departureTime: number }>
}

interface StopTimeUpdate {
  stop_sequence?: number
  stop_id?: string
  arrival?: { time?: string | number }
  departure?: { time?: string | number }
}

interface TripUpdateEntity {
  trip_update?: {
    trip?: { route_id?: string }
    stop_time_update?: StopTimeUpdate[]
  }
}

function getStopTime(stu: StopTimeUpdate): number {
  const dep = stu.departure?.time
  const arr = stu.arrival?.time
  const t = dep ?? arr
  if (t == null) return Infinity
  return typeof t === 'string' ? parseInt(t, 10) : t
}

function normStopId(s: string): string {
  const u = s.toUpperCase()
  const station = getStation(u) ?? getStation(u.slice(0, 4))
  return station?.abbr ?? u
}

function routeIdToDestinationAbbr(routeId: string): string | null {
  const r = String(routeId).toUpperCase()
  const map: Record<string, string> = {
    '1': 'DUBL', '2': 'MLBR', '3': 'RICH', '4': 'PITT', '5': 'WARM', '6': 'SFIA', '7': 'ANTC', '8': 'OAKL',
    '11': 'DUBL', '12': 'MLBR', '19': 'DUBL', '91': 'DUBL', '92': 'MLBR', '93': 'RICH', '94': 'PITT',
    '95': 'WARM', '96': 'SFIA', '97': 'ANTC', '98': 'OAKL',
    B: 'DUBL', G: 'MLBR', O: 'RICH', Y: 'PITT', R: 'WARM', W: 'SFIA',
  }
  return map[r] ?? null
}

async function decodeTripUpdates(): Promise<TripPosition[]> {
  const mod = await import('gtfs-realtime-bindings')
  const FeedMessage = mod.transit_realtime?.FeedMessage
  if (!FeedMessage) return []

  const res = await fetch(TRIP_UPDATE_URL)
  if (!res.ok) return []
  const buf = new Uint8Array(await res.arrayBuffer())
  const feed = FeedMessage.decode(buf)
  const now = Math.floor(Date.now() / 1000)
  const trips: TripPosition[] = []

  for (const entity of feed.entity || []) {
    const tu = (entity as TripUpdateEntity).trip_update
    if (!tu?.trip?.route_id || !tu.stop_time_update?.length) continue

    const routeId = String(tu.trip.route_id)
    const destinationAbbr = routeIdToDestinationAbbr(routeId)
    if (!destinationAbbr) continue

    const stopUpdates = [...tu.stop_time_update]
      .filter((s) => s.stop_id != null && (s.arrival?.time != null || s.departure?.time != null))
      .sort((a, b) => (a.stop_sequence ?? 0) - (b.stop_sequence ?? 0))

    const stopTimes = stopUpdates.map((s) => ({
      stopId: normStopId(String(s.stop_id)),
      departureTime: getStopTime(s),
    }))

    const future = stopUpdates.find((s) => getStopTime(s) > now)
    const currentStop = future ?? stopUpdates[stopUpdates.length - 1]
    const stopId = normStopId(String(currentStop.stop_id ?? ''))
    const station = getStation(stopId)
    const destStation = getStation(destinationAbbr)

    trips.push({
      destinationAbbr,
      destinationName: destStation?.name ?? destinationAbbr,
      currentStopId: stopId,
      currentStationName: station?.name ?? stopId,
      stopTimes,
    })
  }

  return trips
}

export async function fetchTrainPositions(): Promise<TripPosition[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.trips
  try {
    const trips = await decodeTripUpdates()
    cache = { at: Date.now(), trips }
    return trips
  } catch {
    return cache?.trips ?? []
  }
}

/** Your next train to destination from origin: where is it right now? */
export function getPositionForYourTrain(
  trips: TripPosition[],
  originAbbr: string,
  destinationAbbr: string
): TrainPosition | undefined {
  const origin = normStopId(originAbbr)
  const dest = normStopId(destinationAbbr)
  const now = Math.floor(Date.now() / 1000)

  const candidates = trips.filter((t) => t.destinationAbbr === dest)
  for (const t of candidates) {
    const idx = t.stopTimes.findIndex((s) => s.stopId === origin)
    if (idx === -1) continue
    const depAtOrigin = t.stopTimes[idx].departureTime
    if (depAtOrigin < now) continue
    const currentIdx = t.stopTimes.findIndex((s) => s.stopId === t.currentStopId)
    const stopsBeforeOrigin = currentIdx === -1 ? idx : Math.max(0, idx - currentIdx)
    return {
      destinationAbbr: t.destinationAbbr,
      destinationName: t.destinationName,
      currentStopId: t.currentStopId,
      currentStationName: t.currentStationName,
      stopsAway: stopsBeforeOrigin,
    }
  }
  return undefined
}

/** Fallback: any train on that destination line (no origin filter) */
export function getPositionForDestination(
  trips: TripPosition[],
  destinationAbbr: string
): TrainPosition | undefined {
  const dest = normStopId(destinationAbbr)
  const t = trips.find((p) => p.destinationAbbr === dest)
  if (!t) return undefined
  return {
    destinationAbbr: t.destinationAbbr,
    destinationName: t.destinationName,
    currentStopId: t.currentStopId,
    currentStationName: t.currentStationName,
  }
}
