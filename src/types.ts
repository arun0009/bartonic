export interface Station {
  abbr: string
  name: string
  lat: number
  lng: number
}

export interface FavoriteRoute {
  id: string
  index: number
  originAbbr: string
  originName: string
  destinationAbbr: string
  destinationName: string
}

export interface DepartureInfo {
  index?: number
  originAbbr?: string
  destinationAbbr?: string
  originName: string
  destinationName: string
  estDepartureSeconds: number | 'LEAVING_NOW' | null
  /** Absolute epoch ms for countdown anchoring (set at fetch). */
  departAtMs?: number | null
  /** Stable id so countdown does not reuse another train's deadline. */
  tripKey?: string
  /** true when there is a scheduled trip but real-time ETD could not be matched */
  noEtd?: boolean
  carLength?: number
  platform?: string
  delaySeconds?: number
  hexcolor?: string
  direction?: string
  routeFare?: string
  origTimeMin?: string
  destTimeMin?: string
  hasLink?: boolean
  trainHeadStation?: string
}

export interface QuickLookupTrip {
  destination: string
  estDepartureSeconds: number | 'LEAVING_NOW'
  /** Absolute epoch ms for countdown anchoring (set at fetch). */
  departAtMs?: number | null
  /** Stable id so countdown does not reuse another train's deadline. */
  tripKey?: string
  /** true when schedule has a trip but real-time ETD could not be matched */
  noEtd?: boolean
  carLength?: number
  platform?: string
  delaySeconds?: number
  hexcolor?: string
  direction?: string
  routeFare?: string
  destTimeMin?: string
  origTimeMin?: string
  hasLink?: boolean
  firstStationName?: string
  connectingStationName?: string
  destinationStationName?: string
  trainHeadStation?: string
}

export interface Advisory {
  title: string
  description: string
  type?: 'DELAY' | 'EMERGENCY' | 'INFO'
}
