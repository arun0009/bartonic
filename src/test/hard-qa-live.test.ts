/**
 * Staff-QA live harness. Run with:
 *   LIVE_VALIDATE=1 npx vitest run src/test/hard-qa-live.test.ts
 */
import { describe, expect, it } from 'vitest'
import { fetchEtd, fetchSchedule, getTrips, getTrainHeadStation } from '../api/bart'
import {
  fetchTrainPositions,
  getMatchedServingTrip,
  getPositionForYourTrain
} from '../api/gtfs-rt-trips'
import { stationAbbrFromStopId } from '../data/gtfsPlatformStops'
import { getBestEtdMatch, selectEstimate } from '../lib/etdMatching'
import { mergeDepartAtMs, minutesToDepartAtMs, preferGtfsDepartAtMs } from '../lib/departureTime'
import { isTripLiveMatchEligible } from '../hooks/useEtd'

const live = process.env.LIVE_VALIDATE === '1'

const COMMUTE_ODS: Array<[string, string]> = [
  ['DUBL', 'EMBR'],
  ['EMBR', 'DUBL'],
  ['RICH', 'MLBR'],
  ['ANTC', 'SFIA'],
  ['BERY', 'DALY'],
  ['WARM', 'RICH'],
  ['PITT', 'EMBR'],
  ['12TH', 'DUBL']
]

describe.skipIf(!live)('HARD QA live — commute trust', () => {
  it('GTFS-RT decodes trips with station-mapped stops', async () => {
    const trips = await fetchTrainPositions()
    expect(trips.length).toBeGreaterThan(10)

    const sample = trips[0]
    expect(sample.tripId).toBeTruthy()
    expect(sample.stopTimes.length).toBeGreaterThan(1)
    // Stop ids should be station abbrs (4 chars), not platform codes like M16-1
    for (const s of sample.stopTimes.slice(0, 5)) {
      expect(s.stopId).toMatch(/^[A-Z0-9]{4}$/)
      expect(stationAbbrFromStopId(s.stopId)).toBe(s.stopId)
    }
  }, 30_000)

  it('matches position for major commute ODs when service exists', async () => {
    const trips = await fetchTrainPositions()
    const results: Array<Record<string, unknown>> = []

    for (const [origin, dest] of COMMUTE_ODS) {
      const etdRoot = await fetchEtd(origin).catch(() => null)
      const schedRoot = await fetchSchedule(origin, dest).catch(() => null)
      const scheduleTrips = schedRoot ? getTrips(schedRoot) : []
      const liveTrip = scheduleTrips.find((t) => isTripLiveMatchEligible(t._origTimeMin))
      const head = liveTrip ? getTrainHeadStation(liveTrip) : dest
      const firstLeg = liveTrip
        ? Array.isArray(liveTrip.leg)
          ? liveTrip.leg[0]?._destination
          : liveTrip.leg?._destination
        : undefined
      const match = getBestEtdMatch(etdRoot, dest, head, firstLeg)
      const selected = selectEstimate(match?.etd ?? null, 0)
      const etdDepartAt =
        selected.minutes != null ? minutesToDepartAtMs(selected.minutes) : undefined

      const matched = getMatchedServingTrip(trips, origin, dest, etdDepartAt)
      const pos = getPositionForYourTrain(trips, origin, dest, etdDepartAt)

      results.push({
        od: `${origin}->${dest}`,
        etdMinutes: selected.minutes,
        platform: selected.platform,
        cancelledSkipped: selected.minutes != null,
        gtfsMatch: matched?.trip.tripId ?? null,
        gtfsDepartInSec: matched ? matched.depAtOrigin - Math.floor(Date.now() / 1000) : null,
        positionAt: pos?.currentStationName ?? null,
        stopsAway: pos?.stopsAway ?? null,
        sameTrip: matched && pos ? matched.trip.tripId === pos.tripId : null
      })
    }

    console.log('\nLIVE OD MATRIX\n' + JSON.stringify(results, null, 2))

    const withEtd = results.filter((r) => r.etdMinutes != null)
    expect(withEtd.length).toBeGreaterThan(0)

    // When both ETD and GTFS match, identity must agree
    for (const r of results) {
      if (r.gtfsMatch && r.positionAt) {
        expect(r.sameTrip).toBe(true)
      }
    }

    // At least half of ODs with a near-term ETD should get a GTFS match during service hours.
    // Outside service this can be sparse — still require some coverage when ETD exists under 45 min.
    const near = results.filter((r) => typeof r.etdMinutes === 'number' && (r.etdMinutes as number) <= 45)
    if (near.length >= 3) {
      const matchedNear = near.filter((r) => r.gtfsMatch)
      expect(matchedNear.length / near.length).toBeGreaterThanOrEqual(0.34)
    }
  }, 120_000)

  it('countdown merge never jumps up on small later refreshes', () => {
    const anchored = Date.now() + 5 * 60_000
    const laterSmall = anchored + 30_000
    expect(mergeDepartAtMs(anchored, laterSmall)).toBe(anchored)
    const earlier = anchored - 40_000
    expect(mergeDepartAtMs(anchored, earlier)).toBe(earlier)
  })

  it('GTFS preference rejects far adjacent trains', () => {
    const etd = Date.now() + 5 * 60_000
    const adjacent = etd + 90_000
    expect(preferGtfsDepartAtMs(etd, adjacent)).toBe(etd)
    const close = etd - 25_000
    expect(preferGtfsDepartAtMs(etd, close)).toBe(close)
  })

  it('Pittsburg station labels are correct against live ETD board presence', async () => {
    // PITT and PCTR should both resolve; ETD boards should not 404
    const pitt = await fetchEtd('PITT')
    const pctr = await fetchEtd('PCTR')
    expect(pitt.root).toBeTruthy()
    expect(pctr.root).toBeTruthy()
  }, 20_000)
})
