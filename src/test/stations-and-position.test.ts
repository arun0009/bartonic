import { describe, expect, it } from 'vitest'
import { getMatchedServingTrip, getPositionForYourTrain, type TripPosition } from '../api/gtfs-rt-trips'
import { stationAbbrFromStopId } from '../data/gtfsPlatformStops'
import { getStation } from '../data/stations'
import { selectEstimate } from '../lib/etdMatching'
import type { BartEtdDestination } from '../api/bart'

describe('station data', () => {
  it('labels Pittsburg stations correctly', () => {
    expect(getStation('PITT')?.name).toBe('Pittsburg/Bay Point')
    expect(getStation('PCTR')?.name).toBe('Pittsburg Center')
    expect(getStation('PITT')?.lng).toBeCloseTo(-121.945154, 5)
    expect(getStation('PCTR')?.lng).toBeCloseTo(-121.889457, 5)
  })

  it('uses full El Cerrito Plaza name', () => {
    expect(getStation('PLZA')?.name).toBe('El Cerrito Plaza')
  })
})

describe('GTFS platform stop mapping', () => {
  it('maps platform stop ids to station abbreviations', () => {
    expect(stationAbbrFromStopId('M16-1')).toBe('EMBR')
    expect(stationAbbrFromStopId('A10-2')).toBe('LAKE')
    expect(stationAbbrFromStopId('EMBR')).toBe('EMBR')
  })
})

describe('selectEstimate extras', () => {
  it('returns platform, delay, and line color', () => {
    const etd: BartEtdDestination = {
      abbreviation: 'DALY',
      destination: 'Daly City',
      estimate: [
        {
          minutes: '8',
          platform: '2',
          direction: 'South',
          length: '10',
          color: 'BLUE',
          hexcolor: '#0099cc',
          bikeflag: '1',
          delay: '120'
        }
      ]
    }
    const selected = selectEstimate(etd, 0)
    expect(selected.minutes).toBe(8)
    expect(selected.platform).toBe('2')
    expect(selected.delaySeconds).toBe(120)
    expect(selected.hexcolor).toBe('#0099cc')
    expect(selected.carLength).toBe(10)
  })

  it('skips cancelled estimates', () => {
    const etd: BartEtdDestination = {
      abbreviation: 'DALY',
      destination: 'Daly City',
      estimate: [
        {
          minutes: '2',
          platform: '1',
          direction: 'South',
          length: '10',
          color: 'BLUE',
          hexcolor: '#0099cc',
          bikeflag: '1',
          cancelflag: '1'
        },
        {
          minutes: '12',
          platform: '1',
          direction: 'South',
          length: '8',
          color: 'BLUE',
          hexcolor: '#0099cc',
          bikeflag: '1',
          cancelflag: '0'
        }
      ]
    }
    expect(selectEstimate(etd, 0).minutes).toBe(12)
  })
})

describe('train position matching', () => {
  const now = Math.floor(Date.now() / 1000)

  it('matches by origin→destination stop sequence, not terminus alone', () => {
    const trips: TripPosition[] = [
      {
        tripId: 't1',
        destinationAbbr: 'DALY',
        destinationName: 'Daly City',
        currentStopId: 'WOAK',
        currentStationName: 'West Oakland',
        stopTimes: [
          { stopId: 'WOAK', departureTime: now + 60 },
          { stopId: 'EMBR', departureTime: now + 600 },
          { stopId: 'MONT', departureTime: now + 720 },
          { stopId: 'DALY', departureTime: now + 1800 }
        ]
      },
      {
        tripId: 't2',
        destinationAbbr: 'DALY',
        destinationName: 'Daly City',
        currentStopId: 'RICH',
        currentStationName: 'Richmond',
        stopTimes: [
          { stopId: 'RICH', departureTime: now + 120 },
          { stopId: 'DBRK', departureTime: now + 480 },
          { stopId: 'DALY', departureTime: now + 2400 }
        ]
      }
    ]

    const pos = getPositionForYourTrain(trips, 'EMBR', 'DALY')
    expect(pos?.currentStationName).toBe('West Oakland')
    expect(pos?.stopsAway).toBe(1)
    expect(pos?.tripId).toBe('t1')
  })

  it('does not invent a position for an unrelated destination train', () => {
    const trips: TripPosition[] = [
      {
        tripId: 't3',
        destinationAbbr: 'DALY',
        destinationName: 'Daly City',
        currentStopId: 'RICH',
        currentStationName: 'Richmond',
        stopTimes: [
          { stopId: 'RICH', departureTime: now + 120 },
          { stopId: 'DALY', departureTime: now + 2400 }
        ]
      }
    ]
    expect(getPositionForYourTrain(trips, 'EMBR', 'DALY')).toBeUndefined()
  })

  it('treats ANTC and PITT as related yellow-line termini', () => {
    const trips: TripPosition[] = [
      {
        tripId: 't4',
        destinationAbbr: 'ANTC',
        destinationName: 'Antioch',
        currentStopId: 'CONC',
        currentStationName: 'Concord',
        stopTimes: [
          { stopId: 'CONC', departureTime: now + 60 },
          { stopId: 'PITT', departureTime: now + 900 },
          { stopId: 'ANTC', departureTime: now + 1500 }
        ]
      }
    ]
    const pos = getPositionForYourTrain(trips, 'PITT', 'ANTC')
    expect(pos?.currentStationName).toBe('Concord')
  })

  it('matches Dublin-line ETD dest to WDUB short-turn terminus in GTFS', () => {
    const trips: TripPosition[] = [
      {
        tripId: 'blue',
        destinationAbbr: 'WDUB',
        destinationName: 'West Dublin/Pleasanton',
        currentStopId: 'EMBR',
        currentStationName: 'Embarcadero',
        stopTimes: [
          { stopId: 'EMBR', departureTime: now + 90 },
          { stopId: 'WOAK', departureTime: now + 500 },
          { stopId: 'WDUB', departureTime: now + 2400 }
        ]
      }
    ]
    const pos = getPositionForYourTrain(trips, 'EMBR', 'DUBL')
    expect(pos?.tripId).toBe('blue')
    expect(pos?.currentStationName).toBe('Embarcadero')
  })

  it('matches Daly City ETD dest to BALB terminus in GTFS', () => {
    const trips: TripPosition[] = [
      {
        tripId: 'blue-out',
        destinationAbbr: 'BALB',
        destinationName: 'Balboa Park',
        currentStopId: 'DUBL',
        currentStationName: 'Dublin/Pleasanton',
        stopTimes: [
          { stopId: 'DUBL', departureTime: now + 120 },
          { stopId: 'EMBR', departureTime: now + 900 },
          { stopId: 'BALB', departureTime: now + 2400 }
        ]
      }
    ]
    const pos = getPositionForYourTrain(trips, 'DUBL', 'DALY')
    expect(pos?.tripId).toBe('blue-out')
  })

  it('rejects GTFS candidates far from the ETD anchor instead of falling back to soonest', () => {
    const trips: TripPosition[] = [
      {
        tripId: 'soon',
        destinationAbbr: 'BALB',
        destinationName: 'Balboa Park',
        currentStopId: 'WOAK',
        currentStationName: 'West Oakland',
        stopTimes: [
          { stopId: 'DUBL', departureTime: now + 60 },
          { stopId: 'EMBR', departureTime: now + 900 },
          { stopId: 'BALB', departureTime: now + 1800 }
        ]
      },
      {
        tripId: 'later',
        destinationAbbr: 'BALB',
        destinationName: 'Balboa Park',
        currentStopId: 'CAST',
        currentStationName: 'Castro Valley',
        stopTimes: [
          { stopId: 'DUBL', departureTime: now + 1200 },
          { stopId: 'EMBR', departureTime: now + 2100 },
          { stopId: 'BALB', departureTime: now + 3000 }
        ]
      }
    ]
    // ETD says ~20 min; soonest GTFS is ~1 min — must not steal that train.
    const nearMs = (now + 1200) * 1000
    expect(getMatchedServingTrip(trips, 'DUBL', 'EMBR', nearMs)?.trip.tripId).toBe('later')
    expect(getMatchedServingTrip(trips, 'DUBL', 'EMBR', (now + 60) * 1000)?.trip.tripId).toBe('soon')
    expect(getMatchedServingTrip(trips, 'DUBL', 'EMBR', (now + 600) * 1000)).toBeUndefined()
  })

  it('binds countdown and position to the same trip near an ETD anchor', () => {
    const trips: TripPosition[] = [
      {
        tripId: 'soon',
        destinationAbbr: 'DALY',
        destinationName: 'Daly City',
        currentStopId: 'WOAK',
        currentStationName: 'West Oakland',
        stopTimes: [
          { stopId: 'WOAK', departureTime: now + 60 },
          { stopId: 'EMBR', departureTime: now + 400 },
          { stopId: 'DALY', departureTime: now + 1800 }
        ]
      },
      {
        tripId: 'later',
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
    const nearMs = (now + 1200) * 1000
    const matched = getMatchedServingTrip(trips, 'EMBR', 'DALY', nearMs)
    expect(matched?.trip.tripId).toBe('later')
    const pos = getPositionForYourTrain(trips, 'EMBR', 'DALY', nearMs)
    expect(pos?.tripId).toBe('later')
  })
})
