import { mocked } from 'jest-mock'

import * as googleMaps from '@services/google-maps'
import { APIGatewayProxyEventV2 } from '@types'
import eventJson from '@events/get-details-by-id.json'
import { getDetailsByIdHandler } from '@handlers/get-details-by-id'
import { placeDetailsResponse } from '../__mocks__'
import status from '@utils/status'

jest.mock('@services/google-maps')
jest.mock('@utils/logging')

describe('get-details-by-id', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2

  beforeAll(() => {
    mocked(googleMaps).fetchPlaceDetails.mockResolvedValue(placeDetailsResponse)
  })

  describe('getDetailsByIdHandler', () => {
    test('expect INTERNAL_SERVER_ERROR on fetchPlaceDetails reject', async () => {
      mocked(googleMaps).fetchPlaceDetails.mockRejectedValueOnce(undefined)
      const result = await getDetailsByIdHandler(event)
      expect(result).toEqual(expect.objectContaining(status.INTERNAL_SERVER_ERROR))
    })

    test('expect OK when id exists', async () => {
      const result = await getDetailsByIdHandler(event)
      expect(result).toEqual({
        ...status.OK,
        body: JSON.stringify(placeDetailsResponse.data.result),
      })
    })
  })
})
