import { mocked } from 'jest-mock'

import * as googleMaps from '@services/google-maps'
import { APIGatewayProxyEventV2 } from '@types'
import eventJson from '@events/get-reverse-geocode.json'
import { getReverseGeocodeHandler } from '@handlers/get-reverse-geocode'
import { reverseGeocodeResult } from '../__mocks__'
import status from '@utils/status'

jest.mock('@services/google-maps')
jest.mock('@utils/logging')

describe('get-reverse-geocode', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2

  beforeAll(() => {
    mocked(googleMaps).fetchAddressFromGeocode.mockResolvedValue({ data: reverseGeocodeResult } as any)
  })

  describe('getReverseGeocodeHandler', () => {
    test('expect INTERNAL_SERVER_ERROR on fetchAddressFromGeocode reject', async () => {
      mocked(googleMaps).fetchAddressFromGeocode.mockRejectedValueOnce(undefined)
      const result = await getReverseGeocodeHandler(event)
      expect(result).toEqual(expect.objectContaining(status.INTERNAL_SERVER_ERROR))
    })

    test('expect NOT_FOUND on getDataById reject', async () => {
      mocked(googleMaps).fetchAddressFromGeocode.mockResolvedValueOnce({ data: { results: [] } } as any)
      const result = await getReverseGeocodeHandler(event)
      expect(result).toEqual(expect.objectContaining(status.NOT_FOUND))
    })

    test('expect BAD_REQUEST when query parameters missing', async () => {
      const tempEvent = { ...event, queryStringParameters: undefined }
      const result = await getReverseGeocodeHandler(tempEvent)
      expect(result).toEqual({
        ...status.BAD_REQUEST,
        body: '{"message":"lat and lng query parameters must be provided"}',
      })
    })

    test('expect OK when id exists', async () => {
      const result = await getReverseGeocodeHandler(event)
      expect(result).toEqual({
        ...status.OK,
        body: JSON.stringify({ address: '1600 Pennsylvania Avenue NW, Washington, DC 20500, USA' }),
      })
    })
  })
})
