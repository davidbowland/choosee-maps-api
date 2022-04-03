import {
  fetchAddressFromGeocode,
  fetchGeocodeResults,
  fetchPicture,
  fetchPlaceDetails,
  fetchPlaceResults,
} from '@services/google-maps'
import {
  geocodeResult,
  placeDetailsResponse,
  placeId,
  placeResponse,
  placeResult,
  reverseGeocodeResult,
} from '../__mocks__'

const mockGeocode = jest.fn()
const mockPlaceDetails = jest.fn()
const mockPlacePhoto = jest.fn()
const mockPlacesNearby = jest.fn()
const mockReverseGeocode = jest.fn()
jest.mock('@googlemaps/google-maps-services-js', () => ({
  AddressType: {
    postal_code: 'postal_code',
    street_address: 'street_address',
  },
  Client: jest.fn().mockReturnValue({
    geocode: (...args) => mockGeocode(...args),
    placeDetails: (...args) => mockPlaceDetails(...args),
    placePhoto: (...args) => mockPlacePhoto(...args),
    placesNearby: (...args) => mockPlacesNearby(...args),
    reverseGeocode: (...args) => mockReverseGeocode(...args),
  }),
  PlacesNearbyRanking: {
    distance: 'distance',
  },
}))

describe('queue', () => {
  describe('fetchAddressFromGeocode', () => {
    const lat = 38.897957
    const lng = -77.03656

    beforeAll(() => {
      mockReverseGeocode.mockResolvedValue(reverseGeocodeResult)
    })

    test('expect address passed to geocode', async () => {
      await fetchAddressFromGeocode(lat, lng)
      expect(mockReverseGeocode).toHaveBeenCalledWith({
        params: {
          key: '98uhjgr4rgh0ijhgthjk',
          latlng: {
            lat,
            lng,
          },
          result_type: ['street_address', 'postal_code'],
        },
        timeout: 2500,
      })
    })

    test('expect results returned', async () => {
      const result = await fetchAddressFromGeocode(lat, lng)
      expect(result).toEqual(reverseGeocodeResult)
    })
  })

  describe('fetchGeocodeResults', () => {
    const address = '90210'

    beforeAll(() => {
      mockGeocode.mockResolvedValue(geocodeResult)
    })

    test('expect address passed to geocode', async () => {
      await fetchGeocodeResults(address)
      expect(mockGeocode).toHaveBeenCalledWith({
        params: {
          address,
          key: '98uhjgr4rgh0ijhgthjk',
        },
        timeout: 2500,
      })
    })

    test('expect results returned', async () => {
      const result = await fetchGeocodeResults(address)
      expect(result).toEqual(geocodeResult)
    })
  })

  describe('fetchPicture', () => {
    const picture = 'a-picture-stream'
    const photoreference = '76tghbde56yuju'

    beforeAll(() => {
      mockPlacePhoto.mockResolvedValue({ data: { responseUrl: picture } })
    })

    test('expect photoreference passed to placePhoto', async () => {
      await fetchPicture(photoreference)
      expect(mockPlacePhoto).toHaveBeenCalledWith({
        params: {
          key: '98uhjgr4rgh0ijhgthjk',
          maxheight: 300,
          maxwidth: 400,
          photoreference: '76tghbde56yuju',
        },
        responseType: 'stream',
        timeout: 2500,
      })
    })

    test('expect results returned', async () => {
      const result = await fetchPicture(photoreference)
      expect(result).toEqual(picture)
    })
  })

  describe('fetchPlaceDetails', () => {
    beforeAll(() => {
      mockPlaceDetails.mockResolvedValue(placeDetailsResponse)
    })

    test('expect parameters passed to placesNearby', async () => {
      await fetchPlaceDetails(placeId)
      expect(mockPlaceDetails).toHaveBeenCalledWith({
        params: {
          fields: [
            'formatted_address',
            'formatted_phone_number',
            'international_phone_number',
            'name',
            'opening_hours',
            'website',
          ],
          key: '98uhjgr4rgh0ijhgthjk',
          place_id: 'ChIJk8cmpsa33IcRbKLpDn3le4g',
        },
        timeout: 2500,
      })
    })

    test('expect results returned', async () => {
      const result = await fetchPlaceDetails(placeId)
      expect(result).toEqual(placeDetailsResponse)
    })
  })

  describe('fetchPlaceResults', () => {
    const location = { lat: 39, lng: -92 }
    const openNow = true
    const pages = 1
    const type = 'restaurant'

    beforeAll(() => {
      mockPlacesNearby.mockResolvedValue(placeResponse)
    })

    test('expect parameters passed to placesNearby', async () => {
      await fetchPlaceResults(location, type, openNow, pages)
      expect(mockPlacesNearby).toHaveBeenCalledWith({
        params: {
          key: '98uhjgr4rgh0ijhgthjk',
          location,
          opennow: true,
          rankby: 'distance',
          type,
        },
        timeout: 2500,
      })
    })

    test('expect undefined used instead of false for opennow', async () => {
      await fetchPlaceResults(location, type, false, pages)
      expect(mockPlacesNearby).toHaveBeenCalledWith({
        params: {
          key: '98uhjgr4rgh0ijhgthjk',
          location,
          opennow: undefined,
          rankby: 'distance',
          type,
        },
        timeout: 2500,
      })
    })

    test('expect results returned', async () => {
      const result = await fetchPlaceResults(location, type, openNow, pages)
      expect(result).toEqual(placeResult)
    })

    test('expect multiple pages of results returned', async () => {
      const result = await fetchPlaceResults(location, type, openNow, 2)
      expect(result).toEqual({
        data: [...placeResult.data, ...placeResult.data],
        nextPageToken: placeResult.nextPageToken,
      })
    })

    test('expect max pages when multiple pages requested', async () => {
      mockPlacesNearby.mockResolvedValueOnce({ data: { ...placeResponse.data, next_page_token: undefined } })
      const result = await fetchPlaceResults(location, type, openNow, 2)
      expect(result).toEqual({ data: placeResult.data, nextPageToken: undefined })
    })

    test('expect undefined for missing values', async () => {
      const place = { ...placeResponse.data.results[0], opening_hours: undefined, photos: undefined }
      mockPlacesNearby.mockResolvedValueOnce({ ...placeResponse, data: { results: [place] } })
      const result = await fetchPlaceResults(location, type, openNow, pages)
      expect(result).toEqual({ data: [{ ...placeResult.data[0], pic: undefined }] })
    })
  })
})
