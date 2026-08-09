import { useMemo, useSyncExternalStore } from 'react'
import {
  fetchTrainPositions,
  getMatchedServingTrip,
  getPositionForYourTrain as getPositionForYourTrainFromApi,
  getTrainPositionError,
  getTrainPositionsUpdatedAt,
  type TrainPosition,
  type TripPosition
} from '../api/gtfs-rt-trips'
import { isDocumentVisible, subscribeVisibility } from '../lib/visibility'

const REFRESH_MS = 20_000

type Snapshot = {
  trips: TripPosition[]
  error: string | null
  updatedAt: number | null
}

let snapshot: Snapshot = { trips: [], error: null, updatedAt: null }
const listeners = new Set<() => void>()
let pollTimer: number | null = null
let inFlight = false
let seq = 0
let visibilityUnsub: (() => void) | null = null

function emit() {
  for (const listener of listeners) listener()
}

async function load() {
  if (inFlight) return
  if (!isDocumentVisible()) return
  inFlight = true
  const my = ++seq
  try {
    const next = await fetchTrainPositions()
    if (my !== seq) return
    snapshot = {
      trips: next,
      error: next.length === 0 ? getTrainPositionError() : null,
      updatedAt: getTrainPositionsUpdatedAt()
    }
    emit()
  } finally {
    inFlight = false
  }
}

function ensurePolling() {
  if (typeof window === 'undefined') return
  if (visibilityUnsub == null) {
    visibilityUnsub = subscribeVisibility((visible) => {
      if (visible) void load()
    })
  }
  if (pollTimer != null) return
  void load()
  pollTimer = window.setInterval(() => {
    if (isDocumentVisible()) void load()
  }, REFRESH_MS)
}

function stopPollingIfIdle() {
  if (listeners.size > 0 || typeof window === 'undefined') return
  if (pollTimer != null) {
    window.clearInterval(pollTimer)
    pollTimer = null
  }
  if (visibilityUnsub) {
    visibilityUnsub()
    visibilityUnsub = null
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  ensurePolling()
  return () => {
    listeners.delete(listener)
    stopPollingIfIdle()
  }
}

function getSnapshot(): Snapshot {
  return snapshot
}

function getServerSnapshot(): Snapshot {
  return snapshot
}

export function useTrainPositions() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function useTrainPosition(
  originAbbr: string,
  destinationAbbr: string,
  nearEpochMs?: number | null
): { position: TrainPosition | undefined; error: string | null } {
  const { trips, error } = useTrainPositions()
  const position = useMemo(() => {
    if (!originAbbr || !destinationAbbr) return undefined
    return getPositionForYourTrainFromApi(
      trips,
      originAbbr,
      destinationAbbr,
      nearEpochMs ?? undefined
    )
  }, [trips, originAbbr, destinationAbbr, nearEpochMs])

  return { position, error: position ? null : error }
}

/** Second-precision departure at origin, matched near an ETD anchor when provided. */
export function useGtfsDepartAtMs(
  originAbbr: string | undefined,
  destinationAbbr: string | undefined,
  nearEpochMs: number | null | undefined
): number | null {
  const { trips } = useTrainPositions()
  return useMemo(() => {
    if (!originAbbr || !destinationAbbr || nearEpochMs == null) return null
    const matched = getMatchedServingTrip(trips, originAbbr, destinationAbbr, nearEpochMs)
    return matched != null ? matched.depAtOrigin * 1000 : null
  }, [trips, originAbbr, destinationAbbr, nearEpochMs])
}

export const getPositionForYourTrain = getPositionForYourTrainFromApi
