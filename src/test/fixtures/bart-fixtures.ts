export const dublEtdFixture = {
  root: {
    station: [
      {
        name: 'Dublin/Pleasanton',
        abbr: 'DUBL',
        etd: [
          {
            destination: 'Daly City',
            abbreviation: 'DALY',
            estimate: [
              { minutes: '11', length: '6' },
              { minutes: '31', length: '6' }
            ]
          }
        ]
      }
    ]
  }
}

export const dublToEmbrScheduleFixture = {
  root: {
    schedule: {
      request: {
        trip: [
          {
            '@fare': '8.10',
            '@origTimeMin': '08:55 AM',
            '@destTimeMin': '09:41 AM',
            leg: [
              {
                '@origin': 'DUBL',
                '@destination': 'EMBR',
                '@trainHeadStation': 'OAK Airport / SF / Daly City'
              }
            ]
          }
        ]
      }
    }
  }
}

export const antcEtdFixture = {
  root: {
    station: [
      {
        name: 'Antioch',
        abbr: 'ANTC',
        etd: [
          {
            destination: 'SFO/Millbrae',
            abbreviation: 'MLBR',
            estimate: [
              { minutes: 'Leaving', length: '1' },
              { minutes: '21', length: '1' },
              { minutes: '41', length: '1' }
            ]
          }
        ]
      }
    ]
  }
}

export const antcTo24thScheduleFixture = {
  root: {
    schedule: {
      request: {
        trip: [
          {
            '@fare': '9.85',
            '@origTimeMin': '08:48 AM',
            '@destTimeMin': '10:08 AM',
            leg: [
              {
                '@origin': 'ANTC',
                '@destination': '24TH',
                '@trainHeadStation': 'San Francisco International Airport'
              }
            ]
          }
        ]
      }
    }
  }
}

export const twelfthEtdFixture = {
  root: {
    station: [
      {
        name: '12th St. Oakland City Center',
        abbr: '12TH',
        etd: [
          {
            destination: 'Berryessa/North San Jose',
            abbreviation: 'BERY',
            estimate: [
              { minutes: '7', length: '10' },
              { minutes: '27', length: '10' },
              { minutes: '47', length: '10' }
            ]
          }
        ]
      }
    ]
  }
}

export const twelfthToDublScheduleFixture = {
  root: {
    schedule: {
      request: {
        trip: [
          {
            '@fare': '5.80',
            '@origTimeMin': '11:50 AM',
            '@destTimeMin': '12:31 PM',
            leg: [
              {
                '@origin': '12TH',
                '@destination': 'BAYF',
                '@trainHeadStation': 'OAK Airport / Berryessa/North San Jose'
              },
              {
                '@origin': 'BAYF',
                '@destination': 'DUBL',
                '@trainHeadStation': 'Dublin/Pleasanton'
              }
            ]
          }
        ]
      }
    }
  }
}
