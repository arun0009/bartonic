import { useEffect, useRef, useState } from 'react'
import { fetchAdvisories, parseAdvisories } from '../api/bart'
import { isDocumentVisible, subscribeVisibility } from '../lib/visibility'
import type { Advisory } from '../types'

const REFRESH_MS = 60_000

export function useAdvisories() {
  const [advisories, setAdvisories] = useState<Advisory[]>([])
  const [loading, setLoading] = useState(true)
  const lastGoodRef = useRef<Advisory[]>([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!isDocumentVisible() && lastGoodRef.current.length > 0) return
      try {
        const root = await fetchAdvisories().catch(() => null)
        if (cancelled) return
        if (root) {
          const parsed = parseAdvisories(root)
          setAdvisories(parsed)
          lastGoodRef.current = parsed
        }
        // On failure keep last good silently.
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    const timer = window.setInterval(load, REFRESH_MS)
    const unsub = subscribeVisibility((visible) => {
      if (visible) load()
    })
    return () => {
      cancelled = true
      window.clearInterval(timer)
      unsub()
    }
  }, [])

  return { advisories, loading, error: null as string | null }
}
