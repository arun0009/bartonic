import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  fetchEtd,
  fetchSchedule,
  getEtdForDestination,
  getFirstEstimateLength,
  getFirstEstimateMinutes,
  getTrips,
  getTrainHeadStation
} from '../api/bart'
import { getStation } from '../data/stations'
import { getBestEtdForRoute, getBestEtdMatch, selectEstimate, toSeconds } from '../lib/etdMatching'
import type { DepartureInfo, QuickLookupTrip } from '../types'

const REFRESH_MS = 15_000

type FavoriteInput = {
  originAbbr: string
  originName: string
  destinationAbbr: string
  destinationName: string
  index?: number
}

const LIVE_MATCH_MAX_AHEAD_MIN = 90
const LIVE_MATCH_MAX_BEHIND_MIN = 5
const LIVE_EARLY_MISMATCH_TOLERANCE_MIN = 4
const LIVE_NEAR_NOW_STRICT_MIN = 5

export function minutesUntilScheduledDeparture(
  timeMin: string | undefined,
  nowDate: Date = new Date()
): number | null {
  const raw = String(timeMin ?? '').trim()
  const match = raw.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i)
  if (!match) return null

  const hour12 = parseInt(match[1], 10)
  const minute = parseInt(match[2], 10)
  const meridiem = match[3].toUpperCase()
  if (Number.isNaN(hour12) || Number.isNaN(minute)) return null

  let hour24 = hour12 % 12
  if (meridiem === 'PM') hour24 += 12

  const nowMinutes = nowDate.getHours() * 60 + nowDate.getMinutes()
  let delta = hour24 * 60 + minute - nowMinutes

  // Around midnight BART can return next-day departures. Roll forward if needed.
  if (delta < -180) delta += 24 * 60
  return delta
}

export function isTripLiveMatchEligible(
  origTimeMin: string | undefined,
  nowDate: Date = new Date()
): boolean {
  const minutes = minutesUntilScheduledDeparture(origTimeMin, nowDate)
  if (minutes == null) return false
  return minutes >= -LIVE_MATCH_MAX_BEHIND_MIN && minutes <= LIVE_MATCH_MAX_AHEAD_MIN
}

function isLiveEstimateTooEarlyForSchedule(minutes: number | null, origTimeMin: string | undefined): boolean {
  if (minutes == null) return false
  if (minutes > LIVE_NEAR_NOW_STRICT_MIN) return false
  const scheduledDelta = minutesUntilScheduledDeparture(origTimeMin)
  if (scheduledDelta == null) return false
  return minutes < scheduledDelta - LIVE_EARLY_MISMATCH_TOLERANCE_MIN
}

function getEstimateList(
  etd: ReturnType<typeof getEtdForDestination>
): NonNullable<ReturnType<typeof getEtdForDestination>>['estimate'][] {
  if (!etd) return []
  const list = Array.isArray(etd.estimate) ? etd.estimate : [etd.estimate]
  return list.filter((item) => item != null)
}

async function buildRouteDepartures(originAbbr: string, destinationAbbr: string): Promise<QuickLookupTrip[]> {
  const [etdRoot, schedRoot] = await Promise.all([
    fetchEtd(originAbbr).catch(() => null),
    fetchSchedule(originAbbr, destinationAbbr).catch(() => null)
  ])

  const trips = schedRoot ? getTrips(schedRoot) : []
  if (trips.length > 0) {
    const etdUsageByAbbr = new Map<string, number>()

    return trips.slice(0, 4).map((trip) => {
      const head = getTrainHeadStation(trip) || destinationAbbr
      const legList = Array.isArray(trip.leg) ? trip.leg : [trip.leg]
      const firstLegDestination = legList[0]?._destination

      const match = isTripLiveMatchEligible(trip._origTimeMin)
        ? getBestEtdMatch(etdRoot, destinationAbbr, head, firstLegDestination)
        : null
      const etdMatched = match?.etd ?? null
      const sequenceIndex = match ? (etdUsageByAbbr.get(match.abbr) ?? 0) : 0
      const { minutes: mins, carLength } = selectEstimate(etdMatched, sequenceIndex)
      const minutesForUi = isLiveEstimateTooEarlyForSchedule(mins, trip._origTimeMin) ? null : mins
      if (match && minutesForUi != null) {
        etdUsageByAbbr.set(match.abbr, sequenceIndex + 1)
      }
      return {
        destination: destinationAbbr,
        estDepartureSeconds: toSeconds(minutesForUi) ?? 'LEAVING_NOW',
        noEtd: etdMatched == null || minutesForUi == null,
        carLength: minutesForUi == null ? undefined : carLength,
        routeFare: trip._fare,
        destTimeMin: trip._destTimeMin,
        origTimeMin: trip._origTimeMin,
        firstStationName: getStation(legList[0]?._origin ?? originAbbr)?.name,
        connectingStationName: legList[1] ? getStation(legList[1]._origin)?.name : undefined,
        destinationStationName: getStation(legList[legList.length - 1]?._destination ?? destinationAbbr)?.name,
        trainHeadStation: head || undefined
      }
    })
  }

  const fallbackEtd = etdRoot ? getEtdForDestination(etdRoot, destinationAbbr) : null
  const fallbackEstimates = getEstimateList(fallbackEtd)
  if (fallbackEtd && fallbackEstimates.length > 0) {
    return fallbackEstimates.slice(0, 3).map((estimate) => {
      const mins = getFirstEstimateMinutes({ ...fallbackEtd, estimate })
      const carLength =
        parseInt(String(estimate.length ?? ''), 10) || getFirstEstimateLength({ ...fallbackEtd, estimate })
      return {
        destination: destinationAbbr,
        estDepartureSeconds: toSeconds(mins) ?? 'LEAVING_NOW',
        carLength
      }
    })
  }

  return []
}

function buildFavoriteRoute(item: FavoriteInput, scheduleRoot: Awaited<ReturnType<typeof fetchSchedule>> | null, etdRoot: Awaited<ReturnType<typeof fetchEtd>> | null): DepartureInfo {
  const scheduleTrips = scheduleRoot ? getTrips(scheduleRoot) : []
  const firstTrip = scheduleTrips[0] ?? null

  let selectedTrip = firstTrip
  let selectedHead = item.destinationAbbr
  let selectedEtd = null
  let selectedMinutes: number | null = null

  for (const trip of scheduleTrips) {
    if (!isTripLiveMatchEligible(trip._origTimeMin)) continue
    const head = getTrainHeadStation(trip) || item.destinationAbbr
    const firstLegDest = Array.isArray(trip.leg) ? trip.leg[0]?._destination : trip.leg?._destination
    const etd = getBestEtdForRoute(etdRoot, item.destinationAbbr, head, firstLegDest)
    const minutes = etd ? getFirstEstimateMinutes(etd) : null
    if (isLiveEstimateTooEarlyForSchedule(minutes, trip._origTimeMin)) continue
    if (minutes == null) continue
    if (selectedMinutes == null || minutes < selectedMinutes) {
      selectedTrip = trip
      selectedHead = head
      selectedEtd = etd
      selectedMinutes = minutes
    }
  }

  const hasScheduledTrip = scheduleTrips.length > 0

  return {
    index: item.index,
    originName: item.originName,
    destinationName: item.destinationName,
    estDepartureSeconds: toSeconds(selectedMinutes) ?? null,
    noEtd: hasScheduledTrip && (selectedEtd == null || selectedMinutes == null),
    carLength: selectedEtd ? getFirstEstimateLength(selectedEtd) : undefined,
    routeFare: selectedTrip?._fare,
    origTimeMin: selectedTrip?._origTimeMin,
    destTimeMin: selectedTrip?._destTimeMin,
    hasLink: true,
    trainHeadStation: selectedHead || undefined
  }
}

export function useEtdForRoute(originAbbr: string, destinationAbbr: string) {
  const [departures, setDepartures] = useState<QuickLookupTrip[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const refresh = useCallback(() => setTick((n) => n + 1), [])

  useEffect(() => {
    const origin = String(originAbbr ?? '').trim().toUpperCase()
    const dest = String(destinationAbbr ?? '').trim().toUpperCase()
    if (!origin || !dest || origin === dest) {
      setDepartures([])
      setError(null)
      setLoading(false)
      return
    }

    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const next = await buildRouteDepartures(origin, dest)
        if (!cancelled) setDepartures(next)
      } catch {
        if (!cancelled) setError('Unable to load departures right now.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    const timer = window.setInterval(load, REFRESH_MS)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [originAbbr, destinationAbbr, tick])

  return { departures, loading, error, refresh }
}

export function useEtdForFavorites(input: FavoriteInput[]) {
  const [routes, setRoutes] = useState<DepartureInfo[]>([])
  const [loading, setLoading] = useState(false)

  const normalized = useMemo(
    () =>
      input.map((x) => ({
        ...x,
        originAbbr: x.originAbbr.toUpperCase(),
        destinationAbbr: x.destinationAbbr.toUpperCase()
      })),
    [input]
  )

  useEffect(() => {
    if (normalized.length === 0) {
      setRoutes([])
      setLoading(false)
      return
    }

    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const originList = [...new Set(normalized.map((x) => x.originAbbr))]
        const etdPairs = await Promise.all(
          originList.map(async (origin) => [origin, await fetchEtd(origin).catch(() => null)] as const)
        )
        const etdByOrigin = new Map(etdPairs)

        const schedules = await Promise.all(
          normalized.map(async (item) => {
            return await fetchSchedule(item.originAbbr, item.destinationAbbr).catch(() => null)
          })
        )

        const next = normalized.map((item, index) => {
          const scheduleRoot = schedules[index]
          const etdRoot = etdByOrigin.get(item.originAbbr) ?? null
          return buildFavoriteRoute(item, scheduleRoot, etdRoot)
        })
        if (!cancelled) {
          setRoutes(
            next.sort((a, b) => {
              const ai = a.index ?? 0
              const bi = b.index ?? 0
              return ai - bi
            })
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    const timer = window.setInterval(load, REFRESH_MS)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [normalized])

  return { routes, loading }
}
