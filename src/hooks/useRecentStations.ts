import { useCallback, useMemo, useState } from 'react'
import type { Station } from '../types'

const ORIGIN_KEY = 'bartonic.recent.origins.v1'
const DEST_KEY = 'bartonic.recent.destinations.v1'
const MAX_RECENT = 6

function readRecents(key: string): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((abbr) => String(abbr ?? '').trim().toUpperCase())
      .filter((abbr, i, list) => abbr.length > 0 && list.indexOf(abbr) === i)
      .slice(0, MAX_RECENT)
  } catch {
    return []
  }
}

function writeRecents(key: string, values: string[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(values.slice(0, MAX_RECENT)))
  } catch {
    // Ignore storage write failures (e.g. private mode / quota limits).
  }
}

function bumpRecent(current: string[], abbr: string): string[] {
  const normalized = String(abbr ?? '').trim().toUpperCase()
  if (!normalized) return current
  return [normalized, ...current.filter((item) => item !== normalized)].slice(0, MAX_RECENT)
}

function rankStationsByRecents(stations: Station[], recentAbbrs: string[]): Station[] {
  if (recentAbbrs.length === 0) return stations
  const rank = new Map(recentAbbrs.map((abbr, i) => [abbr, i]))
  return [...stations].sort((a, b) => {
    const ai = rank.get(a.abbr.toUpperCase())
    const bi = rank.get(b.abbr.toUpperCase())
    if (ai == null && bi == null) return 0
    if (ai == null) return 1
    if (bi == null) return -1
    return ai - bi
  })
}

export function useRecentStations() {
  const [recentOrigins, setRecentOrigins] = useState<string[]>(() => readRecents(ORIGIN_KEY))
  const [recentDestinations, setRecentDestinations] = useState<string[]>(() => readRecents(DEST_KEY))

  const markOrigin = useCallback((abbr: string) => {
    setRecentOrigins((current) => {
      const next = bumpRecent(current, abbr)
      writeRecents(ORIGIN_KEY, next)
      return next
    })
  }, [])

  const markDestination = useCallback((abbr: string) => {
    setRecentDestinations((current) => {
      const next = bumpRecent(current, abbr)
      writeRecents(DEST_KEY, next)
      return next
    })
  }, [])

  return useMemo(
    () => ({
      recentOrigins,
      recentDestinations,
      markOrigin,
      markDestination,
      rankStationsByRecents
    }),
    [recentOrigins, recentDestinations, markOrigin, markDestination]
  )
}
