/**
 * Absolute departure timestamps + merge rules for smooth, accurate countdowns.
 * BART ETD is minute-bucketed; we anchor once and only move the deadline when
 * the estimate clearly changed (sooner, big delay, or a different trip).
 */

/** Accept a later estimate only if it moved by more than this (real delay). */
export const DEPART_LATER_RESYNC_MS = 75_000
/** Tiny clock / rounding slack when comparing "same" deadline. */
export const DEPART_EQUAL_SLACK_MS = 2_000
/** GTFS-RT time must be within this of the ETD anchor to count as the same train. */
export const GTFS_MATCH_TOLERANCE_MS = 60_000

export function minutesToDepartAtMs(minutes: number, nowMs: number = Date.now()): number {
  if (minutes <= 0) return nowMs
  return nowMs + minutes * 60_000
}

/** Parse BART "h:mm AM/PM" into an absolute epoch ms (rolls to next day near midnight). */
export function scheduledDepartureMs(
  timeMin: string | undefined,
  nowMs: number = Date.now()
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

  const now = new Date(nowMs)
  const depart = new Date(nowMs)
  depart.setHours(hour24, minute, 0, 0)

  const delta = depart.getTime() - now.getTime()
  // Around midnight BART can return next-day departures.
  if (delta < -3 * 60 * 60 * 1000) {
    depart.setDate(depart.getDate() + 1)
  }
  return depart.getTime()
}

export function buildTripKey(parts: {
  originAbbr?: string
  destinationAbbr?: string
  origTimeMin?: string
  trainHeadStation?: string
}): string {
  // Do not include list index — when a train leaves, remaining rows shift and
  // an index-based key would reset countdowns.
  return [
    String(parts.originAbbr ?? '').toUpperCase(),
    String(parts.destinationAbbr ?? '').toUpperCase(),
    String(parts.origTimeMin ?? ''),
    String(parts.trainHeadStation ?? '')
  ].join('|')
}

/**
 * Merge a newly observed departure time into the anchored one for the same trip.
 * - Earlier / equal → accept (train advanced or same bucket)
 * - Slightly later → ignore (minute-bucket refresh noise)
 * - Much later → accept (delay)
 */
export function mergeDepartAtMs(anchoredMs: number, incomingMs: number): number {
  if (incomingMs <= anchoredMs + DEPART_EQUAL_SLACK_MS) return incomingMs
  if (incomingMs >= anchoredMs + DEPART_LATER_RESYNC_MS) return incomingMs
  return anchoredMs
}

/** Prefer GTFS second-precision time when it clearly refers to the same departure. */
export function preferGtfsDepartAtMs(
  etdDepartAtMs: number | null | undefined,
  gtfsDepartAtMs: number | null | undefined
): number | null {
  if (gtfsDepartAtMs == null && etdDepartAtMs == null) return null
  if (gtfsDepartAtMs == null) return etdDepartAtMs ?? null
  if (etdDepartAtMs == null) return gtfsDepartAtMs
  if (Math.abs(gtfsDepartAtMs - etdDepartAtMs) <= GTFS_MATCH_TOLERANCE_MS) return gtfsDepartAtMs
  return etdDepartAtMs
}

export function secondsUntil(departAtMs: number, nowMs: number = Date.now()): number {
  return Math.max(0, Math.ceil((departAtMs - nowMs) / 1000))
}
