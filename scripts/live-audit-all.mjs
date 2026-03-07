import { spawnSync } from 'node:child_process'

const API_BASE = 'https://api.bart.gov/api'
const API_KEY = 'MW9S-E7SL-26DU-VV8V'

const q = (params) =>
  new URLSearchParams({ ...params, key: API_KEY, json: 'y' }).toString()

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`BART API: ${res.status} for ${url}`)
  return await res.json()
}

async function fetchStations() {
  const data = await fetchJson(`${API_BASE}/stn.aspx?${q({ cmd: 'stns' })}`)
  const station = data?.root?.stations?.station
  if (!station) return []
  const list = Array.isArray(station) ? station : [station]
  return list
    .map((s) => String(s?.abbr ?? '').trim().toUpperCase())
    .filter(Boolean)
}

function runOriginAudit(origin, limit) {
  const env = {
    ...process.env,
    ORIGIN: origin
  }
  if (Number.isFinite(limit) && limit > 0) env.LIMIT = String(limit)

  const result = spawnSync('npm', ['run', '--silent', 'test:live'], {
    env,
    encoding: 'utf8'
  })

  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`.trim()
  return {
    ok: result.status === 0,
    output
  }
}

function summarizeFailure(output) {
  const lines = output
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  const failureLine =
    lines.find((l) => l.includes('expected at least 2 live rows')) ||
    lines.find((l) => l.includes('has neither live ETD nor schedule fallback')) ||
    lines.find((l) => l.includes('no ETD match, but head')) ||
    lines.find((l) => l.startsWith('Error:')) ||
    lines.find((l) => l.includes('FAIL')) ||
    lines[lines.length - 1] ||
    'Unknown failure'
  return failureLine
}

async function main() {
  const limitOriginsRaw = Number.parseInt(String(process.env.LIMIT_ORIGINS ?? ''), 10)
  const limitOrigins = Number.isFinite(limitOriginsRaw) ? Math.max(1, limitOriginsRaw) : Number.POSITIVE_INFINITY
  const limitDestRaw = Number.parseInt(String(process.env.LIMIT_DEST ?? ''), 10)
  const limitDest = Number.isFinite(limitDestRaw) ? Math.max(1, limitDestRaw) : Number.POSITIVE_INFINITY

  const allOrigins = await fetchStations()
  const origins = allOrigins.slice(0, limitOrigins)

  if (origins.length === 0) {
    console.error('No origins found from BART stations API.')
    process.exit(1)
  }

  const started = Date.now()
  console.log(`Running live audit for ${origins.length} origins...`)
  if (Number.isFinite(limitDest)) console.log(`Destination limit per origin: ${limitDest}`)

  const failures = []
  let passed = 0

  for (const origin of origins) {
    const t0 = Date.now()
    const { ok, output } = runOriginAudit(origin, limitDest)
    const ms = Date.now() - t0
    if (ok) {
      passed += 1
      console.log(`PASS ${origin} (${ms}ms)`)
    } else {
      const reason = summarizeFailure(output)
      failures.push({ origin, reason, ms })
      console.log(`FAIL ${origin} (${ms}ms)`)
      console.log(`  -> ${reason}`)
    }
  }

  const elapsed = Date.now() - started
  console.log('\nLive audit summary')
  console.log(`  Origins checked: ${origins.length}`)
  console.log(`  Passed: ${passed}`)
  console.log(`  Failed: ${failures.length}`)
  console.log(`  Duration: ${elapsed}ms`)

  if (failures.length > 0) {
    console.log('\nFailed origins:')
    for (const f of failures) {
      console.log(`  - ${f.origin}: ${f.reason}`)
    }
    console.log('\nRerun one origin example:')
    console.log(`  ORIGIN=${failures[0].origin} npm run test:live`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
