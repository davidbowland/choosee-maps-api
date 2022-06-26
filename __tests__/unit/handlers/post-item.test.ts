import { mocked } from 'jest-mock'

import * as dynamodb from '@services/dynamodb'
import * as events from '@utils/events'
import * as googleMaps from '@services/google-maps'
import * as idGenerator from '@utils/id-generator'
import { APIGatewayProxyEventV2, GeocodeResponse } from '@types'
import { choice, choiceId, geocodeResult, newChoice, placeResult } from '../__mocks__'
import eventJson from '@events/post-item.json'
import { postItemHandler } from '@handlers/post-item'
import status from '@utils/status'

jest.mock('@services/dynamodb')
jest.mock('@services/google-maps')
jest.mock('@utils/events')
jest.mock('@utils/id-generator')
jest.mock('@utils/logging')

describe('post-item', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2

  beforeAll(() => {
    mocked(dynamodb).getDataById.mockRejectedValue(undefined)
    mocked(dynamodb).setDataById.mockResolvedValue(undefined)
    mocked(events).extractNewChoiceFromEvent.mockReturnValue({
      ...newChoice,
      expiration: 1728547851,
      openNow: true,
      pagesPerRound: 2,
      radius: 50_000,
      rankBy: 'prominence',
      type: 'restaurant',
    })
    mocked(googleMaps).fetchGeocodeResults.mockResolvedValue(geocodeResult as unknown as GeocodeResponse)
    mocked(googleMaps).fetchPlaceResults.mockResolvedValue(placeResult)
    mocked(idGenerator).getNextId.mockResolvedValue(choiceId)
  })

  describe('postItemHandler', () => {
    test('expect BAD_REQUEST when new choice is invalid', async () => {
      mocked(events).extractNewChoiceFromEvent.mockImplementationOnce(() => {
        throw new Error('Bad request')
      })
      const result = await postItemHandler(event)
      expect(result).toEqual(expect.objectContaining(status.BAD_REQUEST))
    })

    test('expect geocode not called when lat and lng provided', async () => {
      mocked(events).extractNewChoiceFromEvent.mockReturnValueOnce({
        ...newChoice,
        expiration: 1728547851,
        lat: 39.1343699,
        lng: -92.0693709,
      })
      await postItemHandler(event)

      expect(mocked(googleMaps).fetchGeocodeResults).toHaveBeenCalledTimes(0)
      expect(mocked(googleMaps).fetchPlaceResults).toHaveBeenCalledWith(
        { lat: 39.1343699, lng: -92.0693709 },
        'restaurant',
        undefined,
        undefined,
        'distance',
        undefined,
        4,
        2
      )
    })

    test('expect BAD_REQUEST when no results from geocode', async () => {
      mocked(googleMaps).fetchGeocodeResults.mockResolvedValueOnce({
        data: {
          html_attributions: [],
          next_page_token:
            'Aap_uED5ulA1bsoLWnkyaDlG1aoxuxgcx8pxnXBzkdbURX3PZwuzXgFtdbkLlJxjvqqCRa1iug_VSAiISjiApmg9yLOXQgWjMDbXuAGnVZaFARBlnfsRe5tjjVx_PKYEZv7iHNYwcvXR9eWvp8k1XMDBkj7Ja-YpLe9r8eAy1nZC-O9-1_M-lRNMNBr3YxCvWY57VXcP5F6-EPpj5vMAoHQ2e65TBGofxvsAkUX8HSvbHTKDCcYoQJUmwJQfeamM9H5stiJ137Ip98aMrEASSqCYCf9osGhRx7lbjZl4jUYKS-Y-8BejokmFWLtldff0SKuKQQrlef4E0xrdXr1jUh-uRVZTJoCq6Ki1AhiSM9qEvl0_EHYzAMbeQ9bCn0O_AlO6xstNfozKpz8SXXEiqpWaGXyaUqz-NU2facRhhZqPROSb',
          results: [],
          status: 'OK',
        },
      } as unknown as GeocodeResponse)
      const result = await postItemHandler(event)
      expect(result).toEqual(
        expect.objectContaining({ ...status.BAD_REQUEST, body: JSON.stringify({ message: 'Invalid address' }) })
      )
    })

    test('expect sessionId passed to setDataById', async () => {
      await postItemHandler(event)
      expect(mocked(dynamodb).setDataById).toHaveBeenCalledWith('abc123', expect.objectContaining(choice))
    })

    test('expect INTERNAL_SERVER_ERROR on setDataByIndex reject', async () => {
      mocked(dynamodb).setDataById.mockRejectedValueOnce(undefined)
      const result = await postItemHandler(event)
      expect(result).toEqual(expect.objectContaining(status.INTERNAL_SERVER_ERROR))
    })

    test('expect CREATED and body', async () => {
      const result = await postItemHandler(event)
      expect(result).toEqual(expect.objectContaining(status.CREATED))
      expect(mocked(googleMaps).fetchPlaceResults).toHaveBeenCalledWith(
        { lat: 39.0013395, lng: -92.3128326 },
        'restaurant',
        true,
        2,
        'prominence',
        50_000,
        4,
        2
      )
      expect(JSON.parse(result.body)).toEqual({
        ...choice,
        choiceId: 'abc123',
      })
    })
  })
})
