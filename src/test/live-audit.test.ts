import { describe, expect, it } from 'vitest'
import {
  getTrips,
  getTrainHeadStation,
  type BartEtdRoot,
  type BartScheduleRoot,
  type BartStation
} from '../api/bart'
import { getBestEtdMatch, selectEstimate } from '../lib/etdMatching'

const API_BASE = 'https://api.bart.gov/api'
const API_KEY = 'MW9S-E7SL-26DU-VV8V'

const q = (params: Record<string, string>) =>
  new URLSearchParams({ ...params, key: API_KEY, json: 'y' }).toString()

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`BART API: ${res.status}`)
  return (await res.json()) as T
}

async function fetchStationsLive(): Promise<BartStation[]> {
  const data = await fetchJson<{ root: { stations: { station: BartStation | BartStation[] } } }>(
    `${API_BASE}/stn.aspx?${q({ cmd: 'stns' })}`
  )
  const station = data.root?.stations?.station
  if (!station) return []
  return Array.isArray(station) ? station : [station]
}

async function fetchEtdLive(origin: string): Promise<BartEtdRoot> {
  const orig = String(origin ?? '').trim().toUpperCase()
  return fetchJson<BartEtdRoot>(`${API_BASE}/etd.aspx?${q({ cmd: 'etd', orig })}`)
}

async function fetchScheduleLive(origin: string, destination: string): Promise<BartScheduleRoot> {
  const orig = String(origin ?? '').trim().toUpperCase()
  const dest = String(destination ?? '').trim().toUpperCase()
  return fetchJson<BartScheduleRoot>(
    `${API_BASE}/sched.aspx?${q({ cmd: 'depart', orig, dest, date: 'now', time: 'now', a: '3', b: '0', l: '1' })}`
  )
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[./']/g, '').replace(/\s+/g, ' ').trim()
}

function getEtdList(etdRoot: BartEtdRoot): Array<{ abbr: string; destination: string }> {
  const stationRaw = etdRoot?.root?.station
  const station = stationRaw == null ? null : Array.isArray(stationRaw) ? stationRaw[0] : stationRaw
  const etdRaw = station?.etd
  const list = etdRaw == null ? [] : Array.isArray(etdRaw) ? etdRaw : [etdRaw]
  return list
    .filter((item) => item != null)
    .map((item) => ({
      abbr: String(item.abbreviation ?? '').trim().toUpperCase(),
      destination: String(item.destination ?? '').trim()
    }))
}

function inferHeadCandidateAbbr(
  head: string,
  etdList: Array<{ abbr: string; destination: string }>
): string | null {
  if (!head) return null
  const parts = head
    .split(/[/,|]/g)
    .map((part) => normalize(part))
    .filter((part) => part.length >= 5)
  if (parts.length === 0) return null

  const matchedAbbrs = new Set<string>()
  for (const part of parts) {
    for (const etd of etdList) {
      const dest = normalize(etd.destination)
      if (!dest) continue
      if (dest.includes(part) || part.includes(dest)) matchedAbbrs.add(etd.abbr)
    }
  }

  if (matchedAbbrs.size !== 1) return null
  return [...matchedAbbrs][0]
}

const shouldRun = process.env.LIVE_VALIDATE === '1'
const testFn = shouldRun ? it : it.skip

describe('manual live ETD audit (opt-in)', () => {
  testFn(
    'validates route coverage for one origin',
    { timeout: 120_000 },
    async () => {
      const origin = String(process.env.ORIGIN ?? 'DUBL').trim().toUpperCase()
      const limitRaw = Number.parseInt(String(process.env.LIMIT ?? ''), 10)
      const limit = Number.isFinite(limitRaw) ? Math.max(1, limitRaw) : Number.POSITIVE_INFINITY

      const stations = await fetchStationsLive()
      const destinations = stations
        .map((s) => String(s.abbr ?? '').trim().toUpperCase())
        .filter((abbr) => abbr && abbr !== origin)
        .slice(0, limit)

      const etdRoot = await fetchEtdLive(origin).catch(() => null)
      const etdList = etdRoot ? getEtdList(etdRoot) : []
      const failures: string[] = []

      for (const destination of destinations) {
        const schedRoot = await fetchScheduleLive(origin, destination).catch(() => null)
        const trips = schedRoot ? getTrips(schedRoot).slice(0, 3) : []
        if (trips.length === 0) continue

        const firstTrip = trips[0]
        const firstLeg = Array.isArray(firstTrip.leg) ? firstTrip.leg[0] : firstTrip.leg
        const firstHead = getTrainHeadStation(firstTrip) || destination
        const firstMatch = getBestEtdMatch(etdRoot, destination, firstHead, firstLeg?._destination)

        const inferredHeadAbbr = inferHeadCandidateAbbr(firstHead, etdList)
        if (!firstMatch && inferredHeadAbbr) {
          failures.push(
            `${origin}->${destination}: no ETD match, but head "${firstHead}" suggests ${inferredHeadAbbr}`
          )
          continue
        }

        const etdUsageByAbbr = new Map<string, number>()
        const rows = trips.map((trip) => {
          const head = getTrainHeadStation(trip) || destination
          const leg = Array.isArray(trip.leg) ? trip.leg : [trip.leg]
          const firstLegDest = leg[0]?._destination
          const match = getBestEtdMatch(etdRoot, destination, head, firstLegDest)
          const sequenceIndex = match ? (etdUsageByAbbr.get(match.abbr) ?? 0) : 0
          if (match) etdUsageByAbbr.set(match.abbr, sequenceIndex + 1)

          const selected = selectEstimate(match?.etd ?? null, sequenceIndex)
          return {
            live: selected.minutes != null,
            hasScheduleFallback:
              String(trip._origTimeMin ?? '').trim().length > 0 &&
              String(trip._destTimeMin ?? '').trim().length > 0
          }
        })

        for (const [i, row] of rows.entries()) {
          if (!row.live && !row.hasScheduleFallback) {
            failures.push(`${origin}->${destination}: row ${i + 1} has neither live ETD nor schedule fallback`)
          }
        }

        if (rows.length >= 3) {
          const liveCount = rows.filter((row) => row.live).length
          if (liveCount < 2 && firstMatch) {
            const firstEtdEstimates = Array.isArray(firstMatch.etd.estimate)
              ? firstMatch.etd.estimate
              : [firstMatch.etd.estimate]
            if (firstEtdEstimates.length >= 2) {
              failures.push(
                `${origin}->${destination}: expected at least 2 live rows; got ${liveCount}`
              )
            }
          }
        }
      }

      expect(failures).toEqual([])
    }
  )
})
