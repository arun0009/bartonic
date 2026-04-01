import { describe, expect, it } from 'vitest'
import {
  getTrips,
  getTrainHeadStation,
  type BartEtdRoot,
  type BartScheduleRoot
} from '../api/bart'
import { isTripLiveMatchEligible, minutesUntilScheduledDeparture } from '../hooks/useEtd'
import { getBestEtdMatch, selectEstimate, toSeconds } from '../lib/etdMatching'
import {
  antcEtdFixture,
  antcTo24thScheduleFixture,
  dublEtdFixture,
  dublToEmbrScheduleFixture,
  twelfthEtdFixture,
  twelfthToDublScheduleFixture
} from './fixtures/bart-fixtures'

describe('BART data validation', () => {
  it('normalizes schedule @ attributes into trip fields', () => {
    const trips = getTrips(dublToEmbrScheduleFixture as unknown as BartScheduleRoot)
    expect(trips).toHaveLength(1)
    expect(trips[0]._fare).toBe('8.10')
    expect(trips[0]._origTimeMin).toBe('08:55 AM')
    expect(trips[0]._destTimeMin).toBe('09:41 AM')
    expect(getTrainHeadStation(trips[0])).toBe('OAK Airport / SF / Daly City')
  })

  it('matches DUBL->EMBR against DALY ETD via composite headstation text', () => {
    const trips = getTrips(dublToEmbrScheduleFixture as unknown as BartScheduleRoot)
    const firstLeg = Array.isArray(trips[0].leg) ? trips[0].leg[0] : trips[0].leg
    const match = getBestEtdMatch(
      dublEtdFixture as unknown as BartEtdRoot,
      'EMBR',
      getTrainHeadStation(trips[0]),
      firstLeg?._destination
    )
    expect(match?.abbr).toBe('DALY')
    const first = selectEstimate(match?.etd ?? null, 0)
    const second = selectEstimate(match?.etd ?? null, 1)
    expect(first.minutes).toBe(11)
    expect(second.minutes).toBe(31)
  })

  it('maps SFIA headstation to MLBR ETD corridor alias', () => {
    const trips = getTrips(antcTo24thScheduleFixture as unknown as BartScheduleRoot)
    const firstLeg = Array.isArray(trips[0].leg) ? trips[0].leg[0] : trips[0].leg
    const match = getBestEtdMatch(
      antcEtdFixture as unknown as BartEtdRoot,
      '24TH',
      getTrainHeadStation(trips[0]),
      firstLeg?._destination
    )
    expect(match?.abbr).toBe('MLBR')
    const first = selectEstimate(match?.etd ?? null, 0)
    const second = selectEstimate(match?.etd ?? null, 1)
    expect(first.minutes).toBe(0)
    expect(toSeconds(first.minutes)).toBe('LEAVING_NOW')
    expect(second.minutes).toBe(21)
  })

  it('maps Berryessa/North San Jose headstation to BERY ETD', () => {
    const match = getBestEtdMatch(
      twelfthEtdFixture as unknown as BartEtdRoot,
      'DUBL',
      'OAK Airport / Berryessa/North San Jose',
      'BAYF'
    )

    expect(match?.abbr).toBe('BERY')
    expect(selectEstimate(match?.etd ?? null, 0).minutes).toBe(7)
  })

  it('consumes sequential BERY estimates for transfer route schedule', () => {
    const trips = getTrips(twelfthToDublScheduleFixture as unknown as BartScheduleRoot)
    const firstLeg = Array.isArray(trips[0].leg) ? trips[0].leg[0] : trips[0].leg
    const match = getBestEtdMatch(
      twelfthEtdFixture as unknown as BartEtdRoot,
      'DUBL',
      getTrainHeadStation(trips[0]),
      firstLeg?._destination
    )

    const first = selectEstimate(match?.etd ?? null, 0)
    const second = selectEstimate(match?.etd ?? null, 1)
    const third = selectEstimate(match?.etd ?? null, 2)

    expect(match?.abbr).toBe('BERY')
    expect(first.minutes).toBe(7)
    expect(second.minutes).toBe(27)
    expect(third.minutes).toBe(47)
  })

  it('matches North San Jose token after headstation split', () => {
    const match = getBestEtdMatch(
      twelfthEtdFixture as unknown as BartEtdRoot,
      'DUBL',
      'OAK Airport / Berryessa / North San Jose',
      'BAYF'
    )

    expect(match?.abbr).toBe('BERY')
    expect(selectEstimate(match?.etd ?? null, 0).minutes).toBe(7)
  })

  it('maps Dublin/Pleasanton token in composite headstation to DUBL', () => {
    const etdRoot = {
      root: {
        station: {
          name: 'West Oakland',
          abbr: 'WOAK',
          etd: [
            {
              abbreviation: 'DUBL',
              destination: 'Dublin/Pleasanton',
              estimate: [{ minutes: '6', length: '10' }]
            }
          ]
        }
      }
    } as unknown as BartEtdRoot

    const match = getBestEtdMatch(etdRoot, 'CAST', 'OAK Airport / Dublin/Pleasanton', 'BAYF')
    expect(match?.abbr).toBe('DUBL')
    expect(selectEstimate(match?.etd ?? null, 0).minutes).toBe(6)
  })

  it('prefers destination candidate order over faster unrelated ETD', () => {
    const etdRoot = {
      root: {
        station: {
          name: '16th St. Mission',
          abbr: '16TH',
          etd: [
            {
              abbreviation: 'DUBL',
              destination: 'Dublin/Pleasanton',
              estimate: [{ minutes: '11', length: '6' }]
            },
            {
              abbreviation: 'OAKL',
              destination: 'Oakland International Airport',
              estimate: [{ minutes: '1', length: '3' }]
            }
          ]
        }
      }
    } as unknown as BartEtdRoot

    const match = getBestEtdMatch(
      etdRoot,
      'DUBL',
      'SF / OAK Airport / Dublin/Pleasanton',
      'DUBL'
    )

    expect(match?.abbr).toBe('DUBL')
    expect(selectEstimate(match?.etd ?? null, 0).minutes).toBe(11)
  })

  it('does not duplicate ETD when sequence overflows', () => {
    const trips = getTrips(dublToEmbrScheduleFixture as unknown as BartScheduleRoot)
    const firstLeg = Array.isArray(trips[0].leg) ? trips[0].leg[0] : trips[0].leg
    const match = getBestEtdMatch(
      dublEtdFixture as unknown as BartEtdRoot,
      'EMBR',
      getTrainHeadStation(trips[0]),
      firstLeg?._destination
    )
    const third = selectEstimate(match?.etd ?? null, 2)
    expect(third.minutes).toBeNull()
  })

  it('treats far-future morning schedule as not live-match eligible at midnight', () => {
    const now = new Date('2026-03-08T00:10:00')
    const delta = minutesUntilScheduledDeparture('06:11 AM', now)
    expect(delta).not.toBeNull()
    expect(delta!).toBeGreaterThan(300)
    expect(isTripLiveMatchEligible('06:11 AM', now)).toBe(false)
  })

  it('supports next-day rollover around midnight for live matching', () => {
    const now = new Date('2026-03-08T23:55:00')
    const delta = minutesUntilScheduledDeparture('12:10 AM', now)
    expect(delta).toBe(15)
  })
})
