export * from 'aws-lambda'
export * from '@googlemaps/google-maps-services-js'
import { LatLng } from '@googlemaps/google-maps-services-js'

export type PlaceType = 'restaurant' | 'meal_delivery' | 'meal_takeaway' | 'bar' | 'cafe' | 'night_club'

export type RankByType = 'distance' | 'prominence'

export interface PlaceDetails {
  formattedAddress?: string
  formattedPhoneNumber?: string
  internationalPhoneNumber?: string
  name: string
  openHours?: string[]
  photos: string[]
  placeId: string
  priceLevel: number
  rating: number
  ratingsTotal?: number
  vicinity: string
  website?: string
}

export interface PlaceResponse {
  data: PlaceDetails[]
  nextPageToken: string
}

export interface Choice {
  address: string
  choices: PlaceDetails[]
  expiration: number
  latLng: LatLng
  nextPageToken: string
  openNow: boolean
  pagesPerRound: number
  radius?: number
  rankBy: RankByType
  type: PlaceType
}

export interface ChoiceBatch {
  data: Choice
  id: string
}

export interface NewChoice {
  address: string
  expiration?: number
  lat?: number
  lng?: number
  openNow?: boolean
  pagesPerRound?: number
  radius?: number
  rankBy?: RankByType
  type: PlaceType
}

export interface StringObject {
  [key: string]: string
}
