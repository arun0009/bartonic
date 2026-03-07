import { useEffect, useState } from 'react'
import { fetchAdvisories, parseAdvisories } from '../api/bart'
import type { Advisory } from '../types'

const REFRESH_MS = 60_000

export function useAdvisories() {
  const [advisories, setAdvisories] = useState<Advisory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const root = await fetchAdvisories().catch(() => null)
        if (cancelled) return
        const parsed = root ? parseAdvisories(root) : []
        setAdvisories(parsed)
        setError(null)
      } catch {
        if (!cancelled) {
          setAdvisories([])
          setError('Unable to load advisories.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    const timer = window.setInterval(load, REFRESH_MS)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [])

  return { advisories, loading, error }
}
