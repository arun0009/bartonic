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
  originName: string
  destinationName: string
  estDepartureSeconds: number | 'LEAVING_NOW' | null
  /** true when there is a scheduled trip but real-time ETD could not be matched */
  noEtd?: boolean
  carLength?: number
  routeFare?: string
  origTimeMin?: string
  destTimeMin?: string
  hasLink?: boolean
  trainHeadStation?: string
}

export interface QuickLookupTrip {
  destination: string
  estDepartureSeconds: number | 'LEAVING_NOW'
  /** true when schedule has a trip but real-time ETD could not be matched */
  noEtd?: boolean
  carLength?: number
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
