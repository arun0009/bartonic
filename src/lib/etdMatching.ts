import {
  getEtdForDestination,
  getFirstEstimateLength,
  getFirstEstimateMinutes,
  type BartEtdDestination,
  type BartEtdRoot
} from '../api/bart'
import { BART_STATIONS, getStation } from '../data/stations'

const STATION_ALIASES: Record<string, string> = {
  'oak airport': 'OAKL',
  oakl: 'OAKL',
  dublin: 'DUBL',
  pleasanton: 'DUBL',
  dublinpleasanton: 'DUBL',
  'west dublin': 'WDUB',
  'west dublinpleasanton': 'WDUB',
  berryessa: 'BERY',
  'north san jose': 'BERY',
  'berryessa north san jose': 'BERY',
  sfo: 'SFIA',
  'sf airport': 'SFIA',
  'daly city': 'DALY',
  millbrae: 'MLBR'
}

export function toSeconds(minutes: number | null): number | 'LEAVING_NOW' | null {
  if (minutes == null) return null
  if (minutes <= 0) return 'LEAVING_NOW'
  return minutes * 60
}

function getEstimateList(etd: BartEtdDestination | null): BartEtdDestination['estimate'][] {
  if (!etd) return []
  const list = Array.isArray(etd.estimate) ? etd.estimate : [etd.estimate]
  return list.filter((item) => item != null)
}

function normalizeStationName(value: string): string {
  return value.toLowerCase().replace(/[./']/g, '').replace(/\s+/g, ' ').trim()
}

function resolveToAbbr(value: string | undefined): string | null {
  const raw = String(value ?? '').trim()
  if (!raw) return null

  const alias = STATION_ALIASES[normalizeStationName(raw)]
  if (alias) return alias

  const byAbbr = getStation(raw)
  if (byAbbr) return byAbbr.abbr

  const target = normalizeStationName(raw)
  const byName = BART_STATIONS.find((s) => normalizeStationName(s.name) === target)
  if (byName) return byName.abbr

  const looksLikeAbbr = /^[A-Za-z0-9]{4}$/.test(raw)
  return looksLikeAbbr ? raw.toUpperCase() : null
}

function getHeadStationCandidates(trainHeadStation?: string): string[] {
  const raw = String(trainHeadStation ?? '').trim()
  if (!raw) return []
  return raw
    .split(/[/,|]/g)
    .map((p) => p.trim())
    .filter(Boolean)
}

function expandEtdAbbrCandidates(abbr: string): string[] {
  const normalized = String(abbr ?? '').trim().toUpperCase()
  if (!normalized) return []
  if (normalized === 'SFIA') return ['SFIA', 'MLBR']
  if (normalized === 'MLBR') return ['MLBR', 'SFIA']
  return [normalized]
}

export type EtdMatch = { etd: BartEtdDestination; abbr: string }

export function getBestEtdMatch(
  etdRoot: BartEtdRoot | null,
  destinationAbbr: string,
  trainHeadStation?: string,
  firstLegDestinationAbbr?: string
): EtdMatch | null {
  if (!etdRoot) return null
  const baseCandidates = [
    resolveToAbbr(firstLegDestinationAbbr),
    resolveToAbbr(destinationAbbr),
    resolveToAbbr(trainHeadStation),
    ...getHeadStationCandidates(trainHeadStation).map(resolveToAbbr)
  ]
    .map((abbr) => String(abbr ?? '').trim().toUpperCase())
    .filter((abbr, index, list) => abbr.length > 0 && list.indexOf(abbr) === index)
  const candidateAbbrs = baseCandidates
    .flatMap(expandEtdAbbrCandidates)
    .filter((abbr, index, list) => abbr.length > 0 && list.indexOf(abbr) === index)

  for (const abbr of candidateAbbrs) {
    const etd = getEtdForDestination(etdRoot, abbr)
    if (!etd) continue
    return { etd, abbr }
  }

  return null
}

export function getBestEtdForRoute(
  etdRoot: BartEtdRoot | null,
  destinationAbbr: string,
  trainHeadStation?: string,
  firstLegDestinationAbbr?: string
): BartEtdDestination | null {
  return getBestEtdMatch(etdRoot, destinationAbbr, trainHeadStation, firstLegDestinationAbbr)?.etd ?? null
}

export function selectEstimate(
  etd: BartEtdDestination | null,
  sequenceIndex: number
): { minutes: number | null; carLength?: number } {
  if (!etd) return { minutes: null }
  const estimateList = getEstimateList(etd)
  const selectedEstimate = estimateList[sequenceIndex] ?? null
  if (!selectedEstimate) return { minutes: null }

  const minutes = getFirstEstimateMinutes({ ...etd, estimate: selectedEstimate })
  const carLength =
    parseInt(String(selectedEstimate.length ?? ''), 10) ||
    getFirstEstimateLength({ ...etd, estimate: selectedEstimate })
  return { minutes, carLength }
}
