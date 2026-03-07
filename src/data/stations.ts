import type { Station } from '../types'

/**
 * BART stations with coordinates for map display.
 * stop_id in BART GTFS-RT matches abbr for most stations.
 */
export const BART_STATIONS: Station[] = [
  { abbr: '12th', name: '12th St. Oakland City Center', lat: 37.803664, lng: -122.271604 },
  { abbr: '16th', name: '16th St. Mission', lat: 37.765062, lng: -122.419694 },
  { abbr: '19th', name: '19th St. Oakland', lat: 37.80787, lng: -122.269029 },
  { abbr: '24th', name: '24th St. Mission', lat: 37.752254, lng: -122.418466 },
  { abbr: 'ANTC', name: 'Antioch', lat: 37.995389, lng: -121.780333 },
  { abbr: 'ASHB', name: 'Ashby', lat: 37.852803, lng: -122.270063 },
  { abbr: 'BALB', name: 'Balboa Park', lat: 37.721981, lng: -122.447414 },
  { abbr: 'BAYF', name: 'Bay Fair', lat: 37.697185, lng: -122.126801 },
  { abbr: 'CAST', name: 'Castro Valley', lat: 37.690746, lng: -122.075567 },
  { abbr: 'CIVC', name: 'Civic Center/UN Plaza', lat: 37.779528, lng: -122.413756 },
  { abbr: 'COLS', name: 'Coliseum', lat: 37.753661, lng: -122.196869 },
  { abbr: 'COLM', name: 'Colma', lat: 37.684638, lng: -122.466233 },
  { abbr: 'CONC', name: 'Concord', lat: 37.973737, lng: -122.029095 },
  { abbr: 'DALY', name: 'Daly City', lat: 37.706121, lng: -122.469081 },
  { abbr: 'DBRK', name: 'Downtown Berkeley', lat: 37.870104, lng: -122.268133 },
  { abbr: 'DELN', name: 'El Cerrito del Norte', lat: 37.925086, lng: -122.317269 },
  { abbr: 'DUBL', name: 'Dublin/Pleasanton', lat: 37.701687, lng: -121.899179 },
  { abbr: 'EMBR', name: 'Embarcadero', lat: 37.792976, lng: -122.397276 },
  { abbr: 'FRMT', name: 'Fremont', lat: 37.557465, lng: -121.976608 },
  { abbr: 'FTVL', name: 'Fruitvale', lat: 37.774836, lng: -122.224274 },
  { abbr: 'GLEN', name: 'Glen Park', lat: 37.733064, lng: -122.433817 },
  { abbr: 'HAYW', name: 'Hayward', lat: 37.669723, lng: -122.087018 },
  { abbr: 'LAFY', name: 'Lafayette', lat: 37.893176, lng: -122.124127 },
  { abbr: 'LAKE', name: 'Lake Merritt', lat: 37.797027, lng: -122.26518 },
  { abbr: 'MCAR', name: 'MacArthur', lat: 37.829065, lng: -122.26704 },
  { abbr: 'MLBR', name: 'Millbrae', lat: 37.599787, lng: -122.386669 },
  { abbr: 'MONT', name: 'Montgomery St.', lat: 37.789256, lng: -122.401407 },
  { abbr: 'NBRK', name: 'North Berkeley', lat: 37.873967, lng: -122.28344 },
  { abbr: 'NCON', name: 'North Concord/Martinez', lat: 38.003193, lng: -122.024653 },
  { abbr: 'OAKL', name: 'Oakland International Airport', lat: 37.713238, lng: -122.212756 },
  { abbr: 'ORIN', name: 'Orinda', lat: 37.878361, lng: -122.183791 },
  { abbr: 'PITT', name: 'Pittsburg Center', lat: 38.018914, lng: -121.889313 },
  { abbr: 'PCTR', name: 'Pittsburg/Bay Point', lat: 38.018914, lng: -121.945154 },
  { abbr: 'PLZA', name: 'Plaza', lat: 37.902632, lng: -122.298904 },
  { abbr: 'POWL', name: 'Powell St.', lat: 37.784991, lng: -122.406857 },
  { abbr: 'RICH', name: 'Richmond', lat: 37.936887, lng: -122.353165 },
  { abbr: 'ROCK', name: 'Rockridge', lat: 37.844602, lng: -122.251371 },
  { abbr: 'SBRN', name: 'San Bruno', lat: 37.637761, lng: -122.416287 },
  { abbr: 'SFIA', name: 'San Francisco International Airport', lat: 37.616035, lng: -122.392612 },
  { abbr: 'SHAY', name: 'South Hayward', lat: 37.634799, lng: -122.057549 },
  { abbr: 'SSAN', name: 'South San Francisco', lat: 37.664245, lng: -122.44396 },
  { abbr: 'WCRK', name: 'Walnut Creek', lat: 37.905522, lng: -122.067423 },
  { abbr: 'WDUB', name: 'West Dublin/Pleasanton', lat: 37.699756, lng: -121.928099 },
  { abbr: 'WOAK', name: 'West Oakland', lat: 37.804872, lng: -122.295063 },
  { abbr: 'WARM', name: 'Warm Springs/South Fremont', lat: 37.502171, lng: -121.939314 },
  { abbr: 'BERY', name: 'Berryessa/North San Jose', lat: 37.368723, lng: -121.874513 },
  { abbr: 'MLPT', name: 'Milpitas', lat: 37.410277, lng: -121.899681 },
  { abbr: 'UCTY', name: 'Union City', lat: 37.590630, lng: -122.017388 },
  { abbr: 'SANL', name: 'San Leandro', lat: 37.721947, lng: -122.160844 },
  { abbr: 'PHIL', name: 'Pleasant Hill', lat: 37.928403, lng: -122.060006 }
]

export const STATIONS_BY_ABBR = new Map(BART_STATIONS.map(s => [s.abbr, s]))
const STATIONS_BY_ABBR_UPPER = new Map(BART_STATIONS.map(s => [s.abbr.toUpperCase(), s]))

export function getStation(abbr: string): Station | undefined {
  if (!abbr) return undefined
  return STATIONS_BY_ABBR.get(abbr) ?? STATIONS_BY_ABBR_UPPER.get(abbr.toUpperCase())
}
