import { describe, expect, it } from 'vitest'
import {
  buildTripKey,
  mergeDepartAtMs,
  minutesToDepartAtMs,
  preferGtfsDepartAtMs,
  scheduledDepartureMs,
  secondsUntil
} from '../lib/departureTime'
import { getDepartureEpochAtOrigin, type TripPosition } from '../api/gtfs-rt-trips'

describe('departure time anchoring', () => {
  it('converts minute buckets into an absolute deadline', () => {
    const now = Date.parse('2026-08-09T12:00:00.000Z')
    expect(minutesToDepartAtMs(5, now)).toBe(now + 5 * 60_000)
    expect(minutesToDepartAtMs(0, now)).toBe(now)
  })

  it('parses scheduled BART clock times to absolute ms', () => {
    // Use local wall-clock components so this matches scheduledDepartureMs (setHours),
    // which is timezone-local — CI runners are UTC, not America/Los_Angeles.
    const nowDate = new Date(2026, 7, 9, 15, 10, 0, 0) // Aug 9, 3:10 PM local
    const now = nowDate.getTime()
    const depart = scheduledDepartureMs('3:25 PM', now)
    expect(depart).not.toBeNull()
    expect(secondsUntil(depart!, now)).toBe(15 * 60)
  })

  it('never jumps upward on small later refreshes for the same trip', () => {
    const anchored = 1_000_000
    expect(mergeDepartAtMs(anchored, anchored + 30_000)).toBe(anchored)
    expect(mergeDepartAtMs(anchored, anchored + 74_000)).toBe(anchored)
  })

  it('accepts earlier estimates and real delays', () => {
    const anchored = 1_000_000
    expect(mergeDepartAtMs(anchored, anchored - 45_000)).toBe(anchored - 45_000)
    expect(mergeDepartAtMs(anchored, anchored + 80_000)).toBe(anchored + 80_000)
  })

  it('prefers GTFS seconds when close to the ETD anchor', () => {
    const etd = 1_000_000
    const gtfs = 1_000_000 - 28_000
    expect(preferGtfsDepartAtMs(etd, gtfs)).toBe(gtfs)
    // Outside 60s tolerance — keep ETD, do not steal an adjacent train.
    expect(preferGtfsDepartAtMs(etd, etd + 90_000)).toBe(etd)
  })

  it('builds stable trip keys without list index', () => {
    expect(
      buildTripKey({
        originAbbr: 'dubl',
        destinationAbbr: 'embr',
        origTimeMin: '08:55 AM',
        trainHeadStation: 'DALY'
      })
    ).toBe('DUBL|EMBR|08:55 AM|DALY')
  })
})

describe('GTFS departure epoch matching', () => {
  it('picks the trip nearest the ETD anchor', () => {
    const now = Math.floor(Date.now() / 1000)
    const trips: TripPosition[] = [
      {
        tripId: 't0',
        destinationAbbr: 'DALY',
        destinationName: 'Daly City',
        currentStopId: 'WOAK',
        currentStationName: 'West Oakland',
        stopTimes: [
          { stopId: 'WOAK', departureTime: now + 60 },
          { stopId: 'EMBR', departureTime: now + 600 },
          { stopId: 'DALY', departureTime: now + 1800 }
        ]
      },
      {
        tripId: 't1',
        destinationAbbr: 'DALY',
        destinationName: 'Daly City',
        currentStopId: 'LAKE',
        currentStationName: 'Lake Merritt',
        stopTimes: [
          { stopId: 'LAKE', departureTime: now + 100 },
          { stopId: 'EMBR', departureTime: now + 1200 },
          { stopId: 'DALY', departureTime: now + 2400 }
        ]
      }
    ]

    const nearMs = (now + 600) * 1000
    expect(getDepartureEpochAtOrigin(trips, 'EMBR', 'DALY', nearMs)).toBe(now + 600)
  })
})
