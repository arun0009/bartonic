import type { Station } from '../types'

const POPULAR_DESTINATION_ABBRS = [
  'EMBR',
  'MONT',
  'POWL',
  'CIVC',
  '16TH',
  '24TH',
  'DALY',
  'MLBR',
  'SFIA'
]

export function getPopularFirstDestinations(stations: Station[]): Station[] {
  const byAbbr = new Map(stations.map((s) => [s.abbr.toUpperCase(), s]))
  const popular = POPULAR_DESTINATION_ABBRS.map((abbr) => byAbbr.get(abbr)).filter(
    (s): s is Station => s != null
  )
  const used = new Set(popular.map((s) => s.abbr.toUpperCase()))
  const rest = stations.filter((s) => !used.has(s.abbr.toUpperCase()))
  return [...popular, ...rest]
}
