import { AddressType, Client, PlacesNearbyRanking, ReverseGeocodeResponse } from '@googlemaps/google-maps-services-js'

import { GeocodeResponse, LatLng, PlaceDetailsResponse, PlaceResponse } from '../types'
import { googleApiKey, googleImageMaxHeight, googleImageMaxWidth, googleTimeoutMs } from '../config'

const client = new Client()

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

export const fetchPlaceDetails = (placeId: string): Promise<PlaceDetailsResponse> =>
  client.placeDetails({
    params: {
      fields: [
        'formatted_address',
        'formatted_phone_number',
        'international_phone_number',
        'name',
        'opening_hours',
        'website',
      ],
      key: googleApiKey,
      place_id: placeId,
    },
    timeout: googleTimeoutMs,
  })

export const fetchPlaceResults = async (
  location: LatLng,
  type: string,
  openNow: boolean,
  pages: number,
  nextPageToken?: string
): Promise<PlaceResponse> => {
  const response = await client.placesNearby({
    params: {
      key: googleApiKey,
      location,
      opennow: openNow || undefined,
      pagetoken: nextPageToken,
      rankby: PlacesNearbyRanking.distance,
      type,
    },
    timeout: googleTimeoutMs,
  })
  const result = {
    data: await Promise.all(
      response.data.results.map(async (place) => ({
        name: place.name,
        openHours: place.opening_hours?.weekday_text,
        pic: place.photos?.[0] && (await fetchPicture(place.photos[0].photo_reference)),
        placeId: place.place_id,
        priceLevel: place.price_level,
        rating: place.rating,
        vicinity: place.vicinity,
      }))
    ),
    nextPageToken: response.data.next_page_token,
  }
  if (pages < 2 || !result.nextPageToken) {
    return result
  }

  await new Promise((resolve) => setTimeout(resolve, 1000))
  const otherPages = await fetchPlaceResults(location, type, openNow, pages - 1, result.nextPageToken)
  return { data: [...result.data, ...otherPages.data], nextPageToken: otherPages.nextPageToken }
}
