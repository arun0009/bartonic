import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Station } from '../types'

type Coords = { lat: number; lng: number }

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180
}

function distanceMeters(a: Coords, b: Coords): number {
  const R = 6_371_000
  const dLat = toRadians(b.lat - a.lat)
  const dLng = toRadians(b.lng - a.lng)
  const lat1 = toRadians(a.lat)
  const lat2 = toRadians(b.lat)
  const sinLat = Math.sin(dLat / 2)
  const sinLng = Math.sin(dLng / 2)
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

export function useNearestStations(stations: Station[]) {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  const requestLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationError('Location is not available on this device.')
      return
    }
    setLocating(true)
    setLocationError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError('Location permission denied.')
        } else {
          setLocationError('Unable to detect your location right now.')
        }
        setLocating(false)
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 120000 }
    )
  }, [])

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('permissions' in navigator)) return
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((status) => {
        if (status.state === 'granted') requestLocation()
      })
      .catch(() => {
        // No-op: some browsers do not support permissions query for geolocation.
      })
  }, [requestLocation])

  const nearestStations = useMemo(() => {
    if (!coords) return stations
    return [...stations].sort((a, b) => {
      const da = distanceMeters(coords, { lat: a.lat, lng: a.lng })
      const db = distanceMeters(coords, { lat: b.lat, lng: b.lng })
      return da - db
    })
  }, [coords, stations])

  return {
    nearestStations,
    hasLocation: coords != null,
    locating,
    locationError,
    requestLocation
  }
}
