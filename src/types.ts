export * from 'aws-lambda'
export * from '@googlemaps/google-maps-services-js'
import { LatLng } from '@googlemaps/google-maps-services-js'

export type PlaceType = 'restaurant' | 'meal_delivery' | 'meal_takeaway' | 'bar' | 'cafe' | 'night_club'

export interface Place {
  name: string
  openHours?: string[]
  pic?: string
  placeId: string
  priceLevel: number
  rating: number
  vicinity: string
}

export interface PlaceDetails extends Place {
  formattedAddress?: string
  formattedPhoneNumber?: string
  internationalPhoneNumber?: string
  website?: string
}

export interface PlaceResponse {
  data: Place[]
  nextPageToken: string
}

export interface Choice {
  address: string
  choices: Place[]
  expiration: number
  latLng: LatLng
  nextPageToken: string
  openNow: boolean
  pagesPerRound: number
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
  type: PlaceType
}

export interface StringObject {
  [key: string]: string
}
