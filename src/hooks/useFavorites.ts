import { useCallback, useMemo, useSyncExternalStore } from 'react'
import type { FavoriteRoute } from '../types'

const STORAGE_KEY = 'bartonic.favorites.v1'
const STORAGE_EVENT = 'bartonic:favorites:changed'
const EMPTY_FAVORITES: FavoriteRoute[] = []

let cachedRaw: string | null = null
let cachedSnapshot: FavoriteRoute[] = EMPTY_FAVORITES

function readFavorites(): FavoriteRoute[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === cachedRaw) return cachedSnapshot
    if (!raw) {
      cachedRaw = raw
      cachedSnapshot = EMPTY_FAVORITES
      return cachedSnapshot
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      cachedRaw = raw
      cachedSnapshot = EMPTY_FAVORITES
      return cachedSnapshot
    }
    const normalized = parsed
      .filter((item): item is FavoriteRoute => {
        return (
          item != null &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.originAbbr === 'string' &&
          typeof item.destinationAbbr === 'string' &&
          typeof item.originName === 'string' &&
          typeof item.destinationName === 'string'
        )
      })
      .map((item, i) => ({
        ...item,
        index: Number.isFinite(item.index) ? Number(item.index) : i,
        originAbbr: item.originAbbr.toUpperCase(),
        destinationAbbr: item.destinationAbbr.toUpperCase()
      }))
      .sort((a, b) => a.index - b.index)
      .map((item, i) => ({ ...item, index: i }))
    cachedRaw = raw
    cachedSnapshot = normalized.length === 0 ? EMPTY_FAVORITES : normalized
    return cachedSnapshot
  } catch {
    cachedRaw = null
    cachedSnapshot = EMPTY_FAVORITES
    return cachedSnapshot
  }
}

function writeFavorites(next: FavoriteRoute[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(STORAGE_EVENT))
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  const onStorage = (event: StorageEvent) => {
    if (!event.key || event.key === STORAGE_KEY) callback()
  }
  const onCustom = () => callback()
  window.addEventListener('storage', onStorage)
  window.addEventListener(STORAGE_EVENT, onCustom)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(STORAGE_EVENT, onCustom)
  }
}

export function useFavorites(): FavoriteRoute[] {
  return useSyncExternalStore(subscribe, readFavorites, () => EMPTY_FAVORITES)
}

export function useFavoritesActions() {
  const add = useCallback(
    (route: Omit<FavoriteRoute, 'id' | 'index'>) => {
      const current = readFavorites()
      const originAbbr = route.originAbbr.toUpperCase()
      const destinationAbbr = route.destinationAbbr.toUpperCase()
      const duplicate = current.some(
        (f) =>
          f.originAbbr === originAbbr &&
          f.destinationAbbr === destinationAbbr &&
          f.originName === route.originName &&
          f.destinationName === route.destinationName
      )
      if (duplicate) return

      const newItem: FavoriteRoute = {
        id: `${originAbbr}-${destinationAbbr}-${Date.now()}`,
        index: current.length,
        originAbbr,
        originName: route.originName,
        destinationAbbr,
        destinationName: route.destinationName
      }
      writeFavorites([...current, newItem])
    },
    []
  )

  const remove = useCallback(
    (id: string) => {
      const current = readFavorites()
      const next = current
        .filter((f) => f.id !== id)
        .map((f, i) => ({ ...f, index: i }))
      writeFavorites(next)
    },
    []
  )

  const clear = useCallback(() => {
    writeFavorites([])
  }, [])

  return useMemo(() => ({ add, remove, clear }), [add, remove, clear])
}
