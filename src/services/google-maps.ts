import {
  AddressType,
  Client,
  Place,
  PlacesNearbyRanking,
  PlaceType1,
  ReverseGeocodeResponse,
} from '@googlemaps/google-maps-services-js'

import { GeocodeResponse, LatLng, PlaceDetails, PlaceDetailsResponse, PlaceResponse } from '../types'
import { googleApiKey, googleImageCount, googleImageMaxHeight, googleImageMaxWidth, googleTimeoutMs } from '../config'
import { xrayCaptureHttps } from '../utils/logging'

const HIDDEN_TYPES = [
  PlaceType1.airport,
  PlaceType1.bowling_alley,
  PlaceType1.casino,
  PlaceType1.convenience_store,
  PlaceType1.funeral_home,
  PlaceType1.gas_station,
  PlaceType1.gym,
  PlaceType1.zoo,
]

xrayCaptureHttps()
const client = new Client()

/* Geocoding */

export const fetchAddressFromGeocode = (lat: number, lng: number): Promise<ReverseGeocodeResponse> =>
  client.reverseGeocode({
    params: {
      key: googleApiKey,
      latlng: {
        lat,
        lng,
      },
      result_type: [AddressType.street_address, AddressType.postal_code],
    },
    timeout: googleTimeoutMs,
  })

export const fetchGeocodeResults = (address: string): Promise<GeocodeResponse> =>
  client.geocode({
    params: {
      address,
      key: googleApiKey,
    },
    timeout: googleTimeoutMs,
  })

/* Place photos */

export const fetchPicture = (photoreference: string): Promise<string> =>
  client
    .placePhoto({
      params: {
        key: googleApiKey,
        maxheight: googleImageMaxHeight,
        maxwidth: googleImageMaxWidth,
        photoreference,
      },
      responseType: 'stream',
      timeout: googleTimeoutMs,
    })
    .then((response) => response.data.responseUrl)

/* Place details */

export const fetchPlaceDetails = (placeId: string): Promise<PlaceDetailsResponse> =>
  client.placeDetails({
    params: {
      fields: [
        'formatted_address',
        'formatted_phone_number',
        'international_phone_number',
        'name',
        'photos',
        'opening_hours',
        'website',
      ],
      key: googleApiKey,
      place_id: placeId,
    },
    timeout: googleTimeoutMs,
  })

/* Nearby search */

const fetchPhotosFromDetails = (details: PlaceDetailsResponse): Promise<string[]> =>
  Promise.all(
    details.data.result.photos?.slice(0, googleImageCount).map((value) => fetchPicture(value.photo_reference)) ?? [],
  )

const compilePlaceResult = async (place: Place): Promise<PlaceDetails> => {
  const details = await fetchPlaceDetails(place.place_id as string)

  return {
    formattedAddress: details.data.result.formatted_address,
    formattedPhoneNumber: details.data.result.formatted_phone_number,
    internationalPhoneNumber: details.data.result.international_phone_number,
    name: place.name,
    openHours: details.data.result.opening_hours?.weekday_text,
    photos: await fetchPhotosFromDetails(details),
    placeId: place.place_id as string,
    priceLevel: place.price_level,
    rating: place.rating,
    ratingsTotal: place.user_ratings_total,
    vicinity: place.vicinity,
    website: details.data.result.website,
  }
}

const processPlaceResults = async (places: Place[]): Promise<PlaceDetails[]> => {
  const [current, ...next] = places
  if (HIDDEN_TYPES.every((badType) => current.types?.indexOf(badType) === -1)) {
    const result = await compilePlaceResult(current)
    return next.length === 0 ? [result] : [result, ...(await processPlaceResults(next))]
  }
  return next.length === 0 ? [] : await processPlaceResults(next)
}

export const fetchPlaceResults = async (
  location: LatLng,
  type: string,
  openNow: boolean,
  pages: number,
  rankBy: string,
  radius?: number,
  maxPrice?: number,
  minPrice?: number,
  nextPageToken?: string,
): Promise<PlaceResponse> => {
  const response = await client.placesNearby({
    params: {
      key: googleApiKey,
      location,
      maxprice: maxPrice,
      minprice: minPrice,
      opennow: openNow || undefined,
      pagetoken: nextPageToken,
      radius,
      rankby: rankBy === 'distance' ? PlacesNearbyRanking.distance : PlacesNearbyRanking.prominence,
      type,
    },
    timeout: googleTimeoutMs,
  })
  const result = {
    data: await processPlaceResults(response.data.results),
    nextPageToken: response.data.next_page_token,
  }
  if (pages < 2 || !result.nextPageToken) {
    return result
  }

  await new Promise((resolve) => setTimeout(resolve, 1000))
  const otherPages = await fetchPlaceResults(
    location,
    type,
    openNow,
    pages - 1,
    rankBy,
    radius,
    maxPrice,
    minPrice,
    result.nextPageToken,
  )
  return { data: [...result.data, ...otherPages.data], nextPageToken: otherPages.nextPageToken }
}
