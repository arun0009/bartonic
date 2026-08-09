/**
 * Cloudflare Worker: same-origin proxy for BART JSON + GTFS-RT.
 * /api/bart/* → https://api.bart.gov/*
 * Static SPA assets are served via the ASSETS binding (see wrangler.toml).
 */
export default {
  async fetch(request) {
    const incoming = new URL(request.url)
    if (!incoming.pathname.startsWith('/api/bart')) {
      return new Response('Not found', { status: 404 })
    }

    const upstreamPath = incoming.pathname.replace(/^\/api\/bart/, '') || '/'
    const target = new URL(upstreamPath + incoming.search, 'https://api.bart.gov')

    const headers = new Headers(request.headers)
    headers.delete('host')
    headers.set('User-Agent', 'BARTonic/2.0 (+https://bartonic.arun0009.workers.dev)')

    let upstream
    try {
      upstream = await fetch(target.toString(), {
        method: request.method,
        headers,
        body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
        redirect: 'follow'
      })
    } catch {
      return new Response('Upstream BART fetch failed', { status: 502 })
    }

    const out = new Headers(upstream.headers)
    out.set('Access-Control-Allow-Origin', '*')
    out.set(
      'Cache-Control',
      upstreamPath.startsWith('/gtfsrt') ? 'public, max-age=10' : 'public, max-age=15'
    )

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: out
    })
  }
}
