import { useEffect, useMemo, useState } from 'react'
import {
  fetchTrainPositions,
  getPositionForDestination as getPositionForDestinationFromApi,
  getPositionForYourTrain as getPositionForYourTrainFromApi,
  type TrainPosition,
  type TripPosition
} from '../api/gtfs-rt-trips'

const REFRESH_MS = 20_000

export function useTrainPositions() {
  const [trips, setTrips] = useState<TripPosition[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      const next = await fetchTrainPositions()
      if (!cancelled) setTrips(next)
    }
    load()
    const timer = window.setInterval(load, REFRESH_MS)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [])

  return trips
}

export function useTrainPosition(originAbbr: string, destinationAbbr: string): TrainPosition | undefined {
  const trips = useTrainPositions()
  return useMemo(() => {
    if (!originAbbr || !destinationAbbr) return undefined
    return (
      getPositionForYourTrainFromApi(trips, originAbbr, destinationAbbr) ??
      getPositionForDestinationFromApi(trips, destinationAbbr)
    )
  }, [trips, originAbbr, destinationAbbr])
}

export const getPositionForYourTrain = getPositionForYourTrainFromApi
