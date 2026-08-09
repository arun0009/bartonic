import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  fetchEtd,
  fetchSchedule,
  getEtdForDestination,
  getFirstEstimateLength,
  getFirstEstimateMinutes,
  getTrips,
  getTrainHeadStation,
  invalidateBartCache,
  type BartFetchOptions
} from '../api/bart'
import { getStation } from '../data/stations'
import {
  buildTripKey,
  minutesToDepartAtMs,
  scheduledDepartureMs
} from '../lib/departureTime'
import { getBestEtdForRoute, getBestEtdMatch, selectEstimate } from '../lib/etdMatching'
import { isDocumentVisible, subscribeVisibility } from '../lib/visibility'
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

function resolveDepartAtMs(
  liveMinutes: number | null | undefined,
  origTimeMin: string | undefined,
  nowMs: number
): { departAtMs: number | null; estDepartureSeconds: number | 'LEAVING_NOW' | null } {
  if (liveMinutes != null) {
    if (liveMinutes <= 0) {
      return { departAtMs: nowMs, estDepartureSeconds: 'LEAVING_NOW' }
    }
    const departAtMs = minutesToDepartAtMs(liveMinutes, nowMs)
    return {
      departAtMs,
      estDepartureSeconds: Math.max(1, Math.round((departAtMs - nowMs) / 1000))
    }
  }

  const scheduledMs = scheduledDepartureMs(origTimeMin, nowMs)
  if (scheduledMs == null) return { departAtMs: null, estDepartureSeconds: null }
  const seconds = Math.max(0, Math.round((scheduledMs - nowMs) / 1000))
  if (seconds <= 0) return { departAtMs: scheduledMs, estDepartureSeconds: 'LEAVING_NOW' }
  return { departAtMs: scheduledMs, estDepartureSeconds: seconds }
}

async function buildRouteDepartures(
  originAbbr: string,
  destinationAbbr: string,
  fetchOptions?: BartFetchOptions
): Promise<QuickLookupTrip[]> {
  const [etdRoot, schedRoot] = await Promise.all([
    fetchEtd(originAbbr, fetchOptions).catch(() => null),
    fetchSchedule(originAbbr, destinationAbbr, 'now', 'now', 'depart', fetchOptions).catch(() => null)
  ])
  // Anchor after the network round-trip so "N minutes" lines up with response time.
  const fetchedAt = Date.now()

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
      const selected = selectEstimate(etdMatched, sequenceIndex)
      const minutesForUi = isLiveEstimateTooEarlyForSchedule(selected.minutes, trip._origTimeMin)
        ? null
        : selected.minutes
      if (match && minutesForUi != null) {
        etdUsageByAbbr.set(match.abbr, sequenceIndex + 1)
      }
      const noEtd = etdMatched == null || minutesForUi == null
      const { departAtMs, estDepartureSeconds } = resolveDepartAtMs(
        minutesForUi,
        trip._origTimeMin,
        fetchedAt
      )
      const schedulePlatform = String(legList[0]?._originPlatform ?? '')
        .replace(/^PL\s*/i, '')
        .trim()
      return {
        destination: destinationAbbr,
        estDepartureSeconds: estDepartureSeconds ?? 'LEAVING_NOW',
        departAtMs,
        tripKey: buildTripKey({
          originAbbr,
          destinationAbbr,
          origTimeMin: trip._origTimeMin,
          trainHeadStation: head
        }),
        noEtd,
        carLength: minutesForUi == null ? undefined : selected.carLength,
        platform: (minutesForUi == null ? undefined : selected.platform) || schedulePlatform || undefined,
        delaySeconds: minutesForUi == null ? undefined : selected.delaySeconds,
        hexcolor: minutesForUi == null ? undefined : selected.hexcolor,
        direction: minutesForUi == null ? undefined : selected.direction,
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
    return fallbackEstimates.slice(0, 3).map((estimate, index) => {
      const selected = selectEstimate({ ...fallbackEtd, estimate }, 0)
      const mins = selected.minutes ?? getFirstEstimateMinutes({ ...fallbackEtd, estimate })
      const carLength =
        selected.carLength ||
        parseInt(String(estimate.length ?? ''), 10) ||
        getFirstEstimateLength({ ...fallbackEtd, estimate })
      const { departAtMs, estDepartureSeconds } = resolveDepartAtMs(mins, undefined, fetchedAt)
      return {
        destination: destinationAbbr,
        estDepartureSeconds: estDepartureSeconds ?? 'LEAVING_NOW',
        departAtMs,
        tripKey: buildTripKey({
          originAbbr,
          destinationAbbr,
          // Fallback ETD rows lack schedule times; sequence distinguishes them.
          origTimeMin: `etd-${index}`,
          trainHeadStation: destinationAbbr
        }),
        carLength,
        platform: selected.platform,
        delaySeconds: selected.delaySeconds,
        hexcolor: selected.hexcolor,
        direction: selected.direction
      }
    })
  }

  return []
}

function buildFavoriteRoute(
  item: FavoriteInput,
  scheduleRoot: Awaited<ReturnType<typeof fetchSchedule>> | null,
  etdRoot: Awaited<ReturnType<typeof fetchEtd>> | null
): DepartureInfo {
  const scheduleTrips = scheduleRoot ? getTrips(scheduleRoot) : []
  const firstTrip = scheduleTrips[0] ?? null

  let selectedTrip = firstTrip
  let selectedHead = item.destinationAbbr
  let selectedEtd = null as ReturnType<typeof getBestEtdForRoute>
  let selectedMinutes: number | null = null
  let selectedEstimate = selectEstimate(null, 0)

  for (const trip of scheduleTrips) {
    if (!isTripLiveMatchEligible(trip._origTimeMin)) continue
    const head = getTrainHeadStation(trip) || item.destinationAbbr
    const firstLegDest = Array.isArray(trip.leg) ? trip.leg[0]?._destination : trip.leg?._destination
    const etd = getBestEtdForRoute(etdRoot, item.destinationAbbr, head, firstLegDest)
    const estimate = selectEstimate(etd, 0)
    const minutes = estimate.minutes
    if (isLiveEstimateTooEarlyForSchedule(minutes, trip._origTimeMin)) continue
    if (minutes == null) continue
    if (selectedMinutes == null || minutes < selectedMinutes) {
      selectedTrip = trip
      selectedHead = head
      selectedEtd = etd
      selectedMinutes = minutes
      selectedEstimate = estimate
    }
  }

  const hasScheduledTrip = scheduleTrips.length > 0
  const noEtd = hasScheduledTrip && (selectedEtd == null || selectedMinutes == null)
  const { departAtMs, estDepartureSeconds } = resolveDepartAtMs(
    noEtd ? null : selectedMinutes,
    selectedTrip?._origTimeMin,
    Date.now()
  )
  const firstLeg = selectedTrip
    ? Array.isArray(selectedTrip.leg)
      ? selectedTrip.leg[0]
      : selectedTrip.leg
    : undefined
  const schedulePlatform = String(firstLeg?._originPlatform ?? '')
    .replace(/^PL\s*/i, '')
    .trim()

  return {
    index: item.index,
    originAbbr: item.originAbbr,
    destinationAbbr: item.destinationAbbr,
    originName: item.originName,
    destinationName: item.destinationName,
    estDepartureSeconds,
    departAtMs,
    tripKey: buildTripKey({
      originAbbr: item.originAbbr,
      destinationAbbr: item.destinationAbbr,
      origTimeMin: selectedTrip?._origTimeMin,
      trainHeadStation: selectedHead
    }),
    noEtd,
    carLength: noEtd ? undefined : selectedEstimate.carLength,
    platform: (noEtd ? undefined : selectedEstimate.platform) || schedulePlatform || undefined,
    delaySeconds: noEtd ? undefined : selectedEstimate.delaySeconds,
    hexcolor: noEtd ? undefined : selectedEstimate.hexcolor,
    direction: noEtd ? undefined : selectedEstimate.direction,
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
  const [stale, setStale] = useState(false)
  const [updatedAt, setUpdatedAt] = useState<number | null>(null)
  const [tick, setTick] = useState(0)
  const lastGoodRef = useRef<QuickLookupTrip[]>([])
  const refresh = useCallback(() => {
    invalidateBartCache()
    setTick((n) => n + 1)
  }, [])

  useEffect(() => {
    const origin = String(originAbbr ?? '').trim().toUpperCase()
    const dest = String(destinationAbbr ?? '').trim().toUpperCase()
    if (!origin || !dest || origin === dest) {
      setDepartures([])
      lastGoodRef.current = []
      setStale(false)
      setUpdatedAt(null)
      setLoading(false)
      return
    }

    let cancelled = false
    let seq = 0
    const bypass = tick > 0

    async function load(forceNetwork: boolean) {
      if (!isDocumentVisible() && lastGoodRef.current.length > 0) return
      const my = ++seq
      if (lastGoodRef.current.length === 0) setLoading(true)
      try {
        const next = await buildRouteDepartures(origin, dest, {
          bypassCache: forceNetwork
        })
        if (cancelled || my !== seq) return
        if (next.length > 0) {
          setDepartures(next)
          lastGoodRef.current = next
          setUpdatedAt(Date.now())
          setStale(false)
        } else if (lastGoodRef.current.length > 0) {
          // Keep last good; mark soft stale — no alarming error banner.
          setStale(true)
        } else {
          setDepartures([])
          setStale(false)
        }
      } catch {
        if (!cancelled && my === seq && lastGoodRef.current.length > 0) setStale(true)
      } finally {
        if (!cancelled && my === seq) setLoading(false)
      }
    }

    load(bypass)
    const timer = window.setInterval(() => load(true), REFRESH_MS)
    const unsub = subscribeVisibility((visible) => {
      if (visible) load(true)
    })
    return () => {
      cancelled = true
      window.clearInterval(timer)
      unsub()
    }
  }, [originAbbr, destinationAbbr, tick])

  return { departures, loading, stale, updatedAt, error: null as string | null, refresh }
}

export function useEtdForFavorites(input: FavoriteInput[]) {
  const [routes, setRoutes] = useState<DepartureInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [stale, setStale] = useState(false)
  const [updatedAt, setUpdatedAt] = useState<number | null>(null)
  const lastGoodRef = useRef<DepartureInfo[]>([])

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
      lastGoodRef.current = []
      setStale(false)
      setUpdatedAt(null)
      setLoading(false)
      return
    }

    let cancelled = false
    let seq = 0

    async function load(forceNetwork = false) {
      if (!isDocumentVisible() && lastGoodRef.current.length > 0) return
      const my = ++seq
      if (lastGoodRef.current.length === 0) setLoading(true)
      try {
        const fetchOpts = forceNetwork ? { bypassCache: true } : undefined
        const originList = [...new Set(normalized.map((x) => x.originAbbr))]
        const etdPairs = await Promise.all(
          originList.map(
            async (origin) => [origin, await fetchEtd(origin, fetchOpts).catch(() => null)] as const
          )
        )
        const etdByOrigin = new Map(etdPairs)

        const schedules = await Promise.all(
          normalized.map(async (item) => {
            return await fetchSchedule(
              item.originAbbr,
              item.destinationAbbr,
              'now',
              'now',
              'depart',
              fetchOpts
            ).catch(() => null)
          })
        )

        const anySource =
          etdPairs.some(([, root]) => root != null) || schedules.some((root) => root != null)

        const next = normalized.map((item, index) => {
          const scheduleRoot = schedules[index]
          const etdRoot = etdByOrigin.get(item.originAbbr) ?? null
          return buildFavoriteRoute(item, scheduleRoot, etdRoot)
        })
        if (cancelled || my !== seq) return

        if (anySource) {
          const sorted = next.sort((a, b) => {
            const ai = a.index ?? 0
            const bi = b.index ?? 0
            return ai - bi
          })
          setRoutes(sorted)
          lastGoodRef.current = sorted
          setUpdatedAt(Date.now())
          setStale(false)
        } else if (lastGoodRef.current.length > 0) {
          setStale(true)
        } else {
          setRoutes(next)
          setStale(false)
        }
      } catch {
        if (!cancelled && my === seq && lastGoodRef.current.length > 0) setStale(true)
      } finally {
        if (!cancelled && my === seq) setLoading(false)
      }
    }

    load(false)
    const timer = window.setInterval(() => load(true), REFRESH_MS)
    const unsub = subscribeVisibility((visible) => {
      if (visible) load(true)
    })
    return () => {
      cancelled = true
      window.clearInterval(timer)
      unsub()
    }
  }, [normalized])

  return { routes, loading, stale, updatedAt }
}
