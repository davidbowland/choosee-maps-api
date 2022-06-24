import { APIGatewayProxyEventV2, NewChoice } from '@types'
import { extractNewChoiceFromEvent, formatChoice } from '@utils/events'
import { newChoice } from '../__mocks__'
import postEventJson from '@events/post-item.json'

describe('events', () => {
  describe('formatChoice', () => {
    test('expect error on missing address', () => {
      const invalidSession = { ...newChoice, address: undefined }
      expect(() => formatChoice(invalidSession)).toThrow()
    })

    test('expect error when expiration too late session', () => {
      const tooLateExpirationChoice = { ...newChoice, expiration: new Date().getTime() + 100_000_000_000 }
      expect(() => formatChoice(tooLateExpirationChoice)).toThrow()
    })

    test.each([0, 4])('expect error on invalid pagesPerRound (%s)', (pagesPerRound) => {
      const invalidSession = { ...newChoice, pagesPerRound } as NewChoice
      expect(() => formatChoice(invalidSession)).toThrow()
    })

    test.each([undefined, 'fnord'])('expect error on invalid rankBy (%s)', (rankBy) => {
      const invalidSession = { ...newChoice, rankBy } as NewChoice
      expect(() => formatChoice(invalidSession)).toThrow()
    })

    test.each([undefined, 0, 50_001])('expect error when ranked by prominence and bad radius', (radius) => {
      const invalidSession = { ...newChoice, radius, rankBy: 'prominence' } as NewChoice
      expect(() => formatChoice(invalidSession)).toThrow()
    })

    test.each([undefined, 'fnord'])('expect error on invalid type (%s)', (type) => {
      const invalidSession = { ...newChoice, type } as NewChoice
      expect(() => formatChoice(invalidSession)).toThrow()
    })

    test('expect formatted session returned', () => {
      const result = formatChoice(newChoice)
      expect(result).toEqual(expect.objectContaining(newChoice))
      expect(result.expiration).toBeGreaterThan(new Date().getTime())
    })
  })

  describe('extractNewChoiceFromEvent', () => {
    const event = postEventJson as unknown as APIGatewayProxyEventV2

    test('expect session from event', async () => {
      const result = await extractNewChoiceFromEvent(event)
      expect(result).toEqual(expect.objectContaining(newChoice))
    })

    test('expect session from event in base64', async () => {
      const tempEvent = {
        ...event,
        body: Buffer.from(event.body).toString('base64'),
        isBase64Encoded: true,
      } as unknown as APIGatewayProxyEventV2
      const result = await extractNewChoiceFromEvent(tempEvent)
      expect(result).toEqual(expect.objectContaining(newChoice))
    })

    test('expect reject on invalid event', async () => {
      const tempEvent = { ...event, body: JSON.stringify({}) } as unknown as APIGatewayProxyEventV2
      expect(() => extractNewChoiceFromEvent(tempEvent)).toThrow()
    })

    test('expect session to be formatted', async () => {
      const tempChoice = {
        ...newChoice,
        foo: 'bar',
      }
      const tempEvent = { ...event, body: JSON.stringify(tempChoice) } as unknown as APIGatewayProxyEventV2
      const result = await extractNewChoiceFromEvent(tempEvent)
      expect(result).toEqual(expect.objectContaining(newChoice))
    })
  })
})
