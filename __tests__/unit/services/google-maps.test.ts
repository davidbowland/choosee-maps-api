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
import { PlaceType1 } from '@googlemaps/google-maps-services-js'

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
  PlaceType1: {
    convenience_store: 'convenience_store',
    gas_station: 'gas_station',
  },
  PlacesNearbyRanking: {
    distance: 'distance',
    prominence: 'prominence',
  },
}))

describe('queue', () => {
  const picture = 'a-picture-stream'

  beforeAll(() => {
    mockPlaceDetails.mockResolvedValue(placeDetailsResponse)
    mockPlacePhoto.mockResolvedValue({ data: { responseUrl: picture } })
  })

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
    const photoreference = '76tghbde56yuju'

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
    test('expect parameters passed to placesNearby', async () => {
      await fetchPlaceDetails(placeId)
      expect(mockPlaceDetails).toHaveBeenCalledWith({
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
    const radius = 45_000
    const rankBy = 'distance'
    const type = 'restaurant'

    beforeAll(() => {
      mockPlacesNearby.mockResolvedValue(placeResponse)
    })

    test('expect parameters passed to placesNearby', async () => {
      await fetchPlaceResults(location, type, openNow, pages, rankBy)
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
      await fetchPlaceResults(location, type, false, pages, rankBy)
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

    test('expect radius passed when rank by prominence', async () => {
      await fetchPlaceResults(location, type, false, pages, 'prominence', radius)
      expect(mockPlacesNearby).toHaveBeenCalledWith({
        params: {
          key: '98uhjgr4rgh0ijhgthjk',
          location,
          opennow: undefined,
          radius,
          rankby: 'prominence',
          type,
        },
        timeout: 2500,
      })
    })

    test('expect results returned', async () => {
      const result = await fetchPlaceResults(location, type, openNow, pages, rankBy)
      expect(result).toEqual(placeResult)
    })

    test.each([
      PlaceType1.airport,
      PlaceType1.bowling_alley,
      PlaceType1.casino,
      PlaceType1.convenience_store,
      PlaceType1.funeral_home,
      PlaceType1.gas_station,
      PlaceType1.gym,
      PlaceType1.zoo,
    ])('expect %s filtered from results', async (badType) => {
      const badPlace = { ...placeResponse.data.results[0], types: [badType] }
      mockPlacesNearby.mockResolvedValueOnce({
        ...placeResponse,
        data: { results: [badPlace, placeResponse.data.results[1]] },
      })
      const result = await fetchPlaceResults(location, type, openNow, pages, rankBy)
      expect(result.data).toEqual([
        {
          formattedAddress: '225 S 9th St, Columbia, MO 65201, USA',
          formattedPhoneNumber: '(573) 449-2454',
          internationalPhoneNumber: '+1 573-449-2454',
          name: 'China Moon Restaurant',
          openHours: [
            'Monday: 11:00 AM – 10:00 PM',
            'Tuesday: 11:00 AM – 10:00 PM',
            'Wednesday: 11:00 AM – 10:00 PM',
            'Thursday: 11:00 AM – 10:00 PM',
            'Friday: 11:00 AM – 11:00 PM',
            'Saturday: 11:00 AM – 11:00 PM',
            'Sunday: 11:00 AM – 10:00 PM',
          ],
          photos: ['a-picture-stream'],
          placeId: 'ChIJiTfsP_vJ3IcRs74EWg563vY',
          priceLevel: 1,
          rating: 4.2,
          ratingsTotal: 296,
          vicinity: '3890 Rangeline Street, Columbia',
          website: 'http://www.shakespeares.com/',
        },
      ])
    })

    test('expect last gas_station filtered from results', async () => {
      const badPlace = { ...placeResponse.data.results[1], types: ['gas_station'] }
      mockPlacesNearby.mockResolvedValueOnce({
        ...placeResponse,
        data: { results: [placeResponse.data.results[0], badPlace] },
      })
      const result = await fetchPlaceResults(location, type, openNow, pages, rankBy)
      expect(result.data).toEqual([
        {
          formattedAddress: '225 S 9th St, Columbia, MO 65201, USA',
          formattedPhoneNumber: '(573) 449-2454',
          internationalPhoneNumber: '+1 573-449-2454',
          name: "Shakespeare's Pizza - Downtown",
          openHours: [
            'Monday: 11:00 AM – 10:00 PM',
            'Tuesday: 11:00 AM – 10:00 PM',
            'Wednesday: 11:00 AM – 10:00 PM',
            'Thursday: 11:00 AM – 10:00 PM',
            'Friday: 11:00 AM – 11:00 PM',
            'Saturday: 11:00 AM – 11:00 PM',
            'Sunday: 11:00 AM – 10:00 PM',
          ],
          photos: ['a-picture-stream'],
          placeId: 'ChIJk8cmpsa33IcRbKLpDn3le4g',
          priceLevel: 2,
          rating: 4.6,
          ratingsTotal: 2060,
          vicinity: '225 South 9th Street, Columbia',
          website: 'http://www.shakespeares.com/',
        },
      ])
    })

    test('expect multiple pages of results returned', async () => {
      const result = await fetchPlaceResults(location, type, openNow, 2, rankBy)
      expect(result).toEqual({
        data: [...placeResult.data, ...placeResult.data],
        nextPageToken: placeResult.nextPageToken,
      })
    })

    test('expect max pages when multiple pages requested', async () => {
      mockPlacesNearby.mockResolvedValueOnce({ data: { ...placeResponse.data, next_page_token: undefined } })
      const result = await fetchPlaceResults(location, type, openNow, 2, rankBy)
      expect(result).toEqual({ data: placeResult.data, nextPageToken: undefined })
    })

    test('expect undefined for missing values', async () => {
      const placeDetailsMissingValues = {
        data: { result: { ...placeDetailsResponse.data.result, opening_hours: undefined, photos: undefined } },
      }
      mockPlaceDetails.mockResolvedValueOnce(placeDetailsMissingValues)
      const placeResponseMissingValues = { ...placeResponse, data: { results: [placeResponse.data.results[0]] } }
      mockPlacesNearby.mockResolvedValueOnce(placeResponseMissingValues)
      const result = await fetchPlaceResults(location, type, openNow, pages, rankBy)
      expect(result).toEqual({ data: [{ ...placeResult.data[0], openHours: undefined, photos: [] }] })
    })
  })
})
