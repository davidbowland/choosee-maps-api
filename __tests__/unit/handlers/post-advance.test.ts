import { mocked } from 'jest-mock'

import * as dynamodb from '@services/dynamodb'
import * as googleMaps from '@services/google-maps'
import { choice, choiceId, placeResult } from '../__mocks__'
import { APIGatewayProxyEventV2 } from '@types'
import eventJson from '@events/post-advance.json'
import { postAdvanceHandler } from '@handlers/post-advance'
import status from '@utils/status'

jest.mock('@services/dynamodb')
jest.mock('@services/google-maps')
jest.mock('@utils/logging')

describe('post-advance', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2

  beforeAll(() => {
    mocked(dynamodb).getDataById.mockResolvedValue(choice)
    mocked(dynamodb).setDataById.mockResolvedValue(undefined)
    mocked(googleMaps).fetchPlaceResults.mockResolvedValue(placeResult)
  })

  describe('postAdvanceHandler', () => {
    test('expect INTERNAL_SERVER_ERROR on getDataById reject', async () => {
      mocked(dynamodb).getDataById.mockRejectedValueOnce(undefined)
      const result = await postAdvanceHandler(event)
      expect(result).toEqual(expect.objectContaining(status.INTERNAL_SERVER_ERROR))
    })

    test('expect BAD_REQUEST when nextPageToken is undefined', async () => {
      mocked(dynamodb).getDataById.mockResolvedValueOnce({ ...choice, nextPageToken: undefined })
      const result = await postAdvanceHandler(event)
      expect(result).toEqual(status.BAD_REQUEST)
    })

    test('expect fetchPlaceResults invoked', async () => {
      await postAdvanceHandler(event)
      expect(mocked(googleMaps).fetchPlaceResults).toHaveBeenCalledWith(
        { lat: 39.0013395, lng: -92.3128326 },
        'restaurant',
        true,
        2,
        'prominence',
        50_000,
        choice.nextPageToken
      )
    })

    test('expect fetchPlaceResults results to be passed to setDataById', async () => {
      await postAdvanceHandler(event)
      expect(mocked(dynamodb).setDataById).toHaveBeenCalledWith(choiceId, choice)
    })

    test('expect INTERNAL_SERVER_ERROR on setDataById reject', async () => {
      mocked(dynamodb).setDataById.mockRejectedValueOnce(undefined)
      const result = await postAdvanceHandler(event)
      expect(result).toEqual(expect.objectContaining(status.INTERNAL_SERVER_ERROR))
    })

    test('expect OK and body', async () => {
      const result = await postAdvanceHandler(event)
      expect(result).toEqual(expect.objectContaining(status.OK))
      expect(JSON.parse(result.body)).toEqual({
        ...choice,
        choiceId: 'abc123',
      })
    })
  })
})
