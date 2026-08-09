/**
 * Browser always uses a same-origin proxy (Vite in local, Cloudflare Pages in prod)
 * so GTFS-RT works despite missing CORS on api.bart.gov/gtfsrt.
 * Node / Vitest hit BART directly.
 */
const useSameOriginProxy =
  typeof window !== 'undefined' && import.meta.env.MODE !== 'test'

const BART_ORIGIN = useSameOriginProxy ? '/api/bart' : 'https://api.bart.gov'

export const BART_BASE = `${BART_ORIGIN}/api`
export const BART_GTFS_RT = `${BART_ORIGIN}/gtfsrt`

/** Use BART's public key or register at api.bart.gov for your own */
export const BART_API_KEY = 'MW9S-E7SL-26DU-VV8V'

export const TRIP_UPDATE_URL = `${BART_GTFS_RT}/tripupdate.aspx`
