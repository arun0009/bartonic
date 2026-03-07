/** In dev we proxy through Vite to avoid CORS; in prod use BART directly */
const BART_ORIGIN = import.meta.env.DEV ? '/api/bart' : 'https://api.bart.gov'
export const BART_BASE = `${BART_ORIGIN}/api`
export const BART_GTFS_RT = `${BART_ORIGIN}/gtfsrt`

/** Use BART's public key or register at api.bart.gov for your own */
export const BART_API_KEY = 'MW9S-E7SL-26DU-VV8V'

export const TRIP_UPDATE_URL = `${BART_GTFS_RT}/tripupdate.aspx`
