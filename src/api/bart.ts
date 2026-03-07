import { BART_BASE, BART_API_KEY } from './constants'

const q = (params: Record<string, string>) =>
  new URLSearchParams({ ...params, key: BART_API_KEY, json: 'y' }).toString()

// Keep this below UI refresh interval (15s) so countdowns feel live.
const CACHE_MS = 10_000
const cache = new Map<string, { data: unknown; at: number }>()

async function fetchJson<T>(url: string): Promise<T> {
  const hit = cache.get(url)
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.data as T
  const res = await fetch(url)
  if (!res.ok) throw new Error(`BART API: ${res.status}`)
  const data = (await res.json()) as T
  cache.set(url, { data, at: Date.now() })
  return data
}

export interface BartStation {
  abbr: string
  name: string
  gtfs_latitude?: string
  gtfs_longitude?: string
}

export interface BartStationsRoot {
  root: { stations: { station: BartStation | BartStation[] } }
}

export async function fetchStations(): Promise<BartStation[]> {
  const url = `${BART_BASE}/stn.aspx?${q({ cmd: 'stns' })}`
  const data = await fetchJson<BartStationsRoot>(url)
  const station = data.root.stations.station
  return Array.isArray(station) ? station : [station]
}

export interface BartEtdEstimate {
  minutes: string
  platform: string
  direction: string
  length: string
  color: string
  hexcolor: string
  bikeflag: string
  delay?: string
}

export interface BartEtdDestination {
  abbreviation: string
  destination: string
  estimate: BartEtdEstimate | BartEtdEstimate[]
}

interface BartEtdStation {
  name: string
  abbr: string
  etd: BartEtdDestination | BartEtdDestination[]
}

export interface BartEtdRoot {
  root: {
    station: BartEtdStation | BartEtdStation[]
  }
}

export async function fetchEtd(origin: string): Promise<BartEtdRoot> {
  const orig = String(origin ?? '').trim().toUpperCase()
  const url = `${BART_BASE}/etd.aspx?${q({ cmd: 'etd', orig })}`
  return fetchJson<BartEtdRoot>(url)
}

export interface BartScheduleLeg {
  _origin: string
  _destination: string
  _trainHeadStation: string
}

export interface BartScheduleTrip {
  _origTimeMin: string
  _destTimeMin: string
  _fare: string
  leg: BartScheduleLeg | BartScheduleLeg[]
}

export interface BartScheduleRoot {
  root: {
    schedule: {
      request: { trip: BartScheduleTrip | BartScheduleTrip[] }
    }
  }
}

export async function fetchSchedule(
  origin: string,
  destination: string,
  date: string = 'now',
  time: string = 'now',
  cmd: 'depart' | 'arrive' = 'depart'
): Promise<BartScheduleRoot> {
  const b = cmd === 'depart' ? '0' : '3'
  const a = cmd === 'depart' ? '3' : '0'
  const orig = String(origin ?? '').trim().toUpperCase()
  const dest = String(destination ?? '').trim().toUpperCase()
  const url = `${BART_BASE}/sched.aspx?${q({ cmd, orig, dest, date, time, a, b, l: '1' })}`
  return fetchJson<BartScheduleRoot>(url)
}

export interface BartAdvisoryRoot {
  root: {
    bsa?:
      | {
          station?: string
          type?: string
          description?: { __cdata?: string; '#cdata-section'?: string }
        }
      | Array<{
          station?: string
          type?: string
          description?: { __cdata?: string; '#cdata-section'?: string }
        }>
    message?: string
  }
}

export async function fetchAdvisories(): Promise<BartAdvisoryRoot> {
  const url = `${BART_BASE}/bsa.aspx?${q({ cmd: 'bsa', date: 'today' })}`
  return fetchJson<BartAdvisoryRoot>(url)
}

export interface AdvisoryParsed {
  title: string
  description: string
  type?: 'DELAY' | 'EMERGENCY' | 'INFO'
}

function advisoryDescription(
  description: { __cdata?: string; '#cdata-section'?: string } | undefined
): string {
  return String(description?.__cdata ?? description?.['#cdata-section'] ?? '').trim()
}

export function parseAdvisories(root: BartAdvisoryRoot): AdvisoryParsed[] {
  const bsaRaw = root.root?.bsa
  const list = bsaRaw == null ? [] : Array.isArray(bsaRaw) ? bsaRaw : [bsaRaw]

  const advisories: AdvisoryParsed[] = []
  for (const item of list) {
    const type = String(item.type ?? '').trim().toUpperCase()
    const station = String(item.station ?? '').trim()
    const desc = advisoryDescription(item.description)
    if (!desc) continue
    const titleBase = type === 'DELAY' || type === 'EMERGENCY' ? 'Service advisory' : 'Info'
    const title = station && station !== 'BART' ? `${titleBase} · ${station}` : titleBase
    advisories.push({
      title,
      description: desc,
      type: type as 'DELAY' | 'EMERGENCY' | 'INFO'
    })
  }

  if (advisories.length > 0) return advisories

  const fallback = String(root.root?.message ?? '').trim()
  if (fallback) return [{ title: 'Service status', description: fallback }]
  return []
}

export function parseAdvisory(root: BartAdvisoryRoot): AdvisoryParsed | null {
  return parseAdvisories(root)[0] ?? null
}

function normalizeEtd(etd: BartEtdDestination): BartEtdDestination {
  const est = etd?.estimate
  return {
    ...etd,
    estimate: est == null ? [] : Array.isArray(est) ? est : [est]
  }
}

export function getEtdForDestination(root: BartEtdRoot, destinationAbbr: string): BartEtdDestination | null {
  const stationRaw = root?.root?.station
  const station = stationRaw == null ? null : Array.isArray(stationRaw) ? stationRaw[0] : stationRaw
  const raw = station?.etd
  if (raw == null) return null
  const list = Array.isArray(raw) ? raw : [raw]
  const want = String(destinationAbbr ?? '').trim().toUpperCase()
  if (!want) return null
  const match = list.find((e) => {
    if (e == null) return false
    const abbr = (e.abbreviation ?? (e as { abbr?: string }).abbr) ?? ''
    return String(abbr).trim().toUpperCase() === want
  })
  return match ? normalizeEtd(match) : null
}

export function getFirstEstimateMinutes(etd: BartEtdDestination): number | null {
  const est = etd?.estimate
  if (est == null) return null
  const first = Array.isArray(est) ? est[0] : est
  if (!first) return null
  const raw = first.minutes
  if (raw == null) return null
  if (typeof raw === 'number') return Number.isNaN(raw) ? null : Math.max(0, raw)
  const s = String(raw).trim().toLowerCase()
  if (s === 'leaving' || s === '') return 0
  const min = parseInt(String(raw), 10)
  return Number.isNaN(min) ? null : Math.max(0, min)
}

export function getFirstEstimateLength(etd: BartEtdDestination): number | undefined {
  const est = etd.estimate
  const first = Array.isArray(est) ? est[0] : est
  return first ? parseInt(first.length, 10) || undefined : undefined
}

function pickAttr(obj: Record<string, unknown> | null | undefined, key: string): string {
  if (!obj) return ''
  const value = obj[`_${key}`] ?? obj[`@${key}`] ?? obj[key]
  return String(value ?? '').trim()
}

function normalizeLeg(rawLeg: unknown): BartScheduleLeg {
  const source = (rawLeg ?? {}) as Record<string, unknown>
  return {
    _origin: pickAttr(source, 'origin'),
    _destination: pickAttr(source, 'destination'),
    _trainHeadStation: pickAttr(source, 'trainHeadStation')
  }
}

function normalizeTrip(rawTrip: BartScheduleTrip): BartScheduleTrip {
  const source = rawTrip as unknown as Record<string, unknown>
  const rawLeg = source.leg
  const legListRaw = rawLeg == null ? [] : Array.isArray(rawLeg) ? rawLeg : [rawLeg]
  const legList = legListRaw.map(normalizeLeg)

  return {
    _origTimeMin: pickAttr(source, 'origTimeMin'),
    _destTimeMin: pickAttr(source, 'destTimeMin'),
    _fare: pickAttr(source, 'fare'),
    leg: legList
  }
}

export function getTrips(root: BartScheduleRoot): BartScheduleTrip[] {
  const raw = root?.root?.schedule?.request?.trip
  if (raw == null) return []
  const list = Array.isArray(raw) ? raw : [raw]
  return list.filter((t): t is BartScheduleTrip => t != null).map(normalizeTrip)
}

export function getTrainHeadStation(trip: BartScheduleTrip): string {
  const legList = trip?.leg != null ? (Array.isArray(trip.leg) ? trip.leg : [trip.leg]) : []
  const first = legList[0]
  if (!first) return ''
  const firstAny = first as unknown as Record<string, unknown>
  const head = firstAny._trainHeadStation ?? firstAny['@trainHeadStation'] ?? firstAny.trainHeadStation
  return String(head ?? '').trim()
}
