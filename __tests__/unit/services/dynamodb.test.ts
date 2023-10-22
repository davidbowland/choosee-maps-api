import { choice, choiceId } from '../__mocks__'
import { deleteDataById, getDataById, scanData, scanExpiredIds, setDataById } from '@services/dynamodb'

const mockSend = jest.fn()
jest.mock('@aws-sdk/client-dynamodb', () => ({
  DeleteItemCommand: jest.fn().mockImplementation((x) => x),
  DynamoDB: jest.fn(() => ({
    send: (...args) => mockSend(...args),
  })),
  GetItemCommand: jest.fn().mockImplementation((x) => x),
  PutItemCommand: jest.fn().mockImplementation((x) => x),
  ScanCommand: jest.fn().mockImplementation((x) => x),
}))
jest.mock('@utils/logging', () => ({
  xrayCapture: jest.fn().mockImplementation((x) => x),
}))

describe('dynamodb', () => {
  const epochTime = 1678432576539

  beforeAll(() => {
    jest.spyOn(Date.prototype, 'getTime').mockReturnValue(epochTime)
  })

  describe('deleteDataById', () => {
    test('should call DynamoDB with the correct arguments', async () => {
      await deleteDataById(choiceId)

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          Key: {
            ChoiceId: {
              S: choiceId,
            },
          },
          TableName: 'choosee-table',
        }),
      )
    })
  })

  describe('getDataById', () => {
    test('should call DynamoDB with the correct arguments', async () => {
      mockSend.mockResolvedValueOnce({
        Item: { Data: { S: JSON.stringify(choice) } },
      })

      const result = await getDataById(choiceId)

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          Key: {
            ChoiceId: {
              S: choiceId,
            },
          },
          TableName: 'choosee-table',
        }),
      )
      expect(result).toEqual(choice)
    })
  })

  describe('scanData', () => {
    test('should call DynamoDB with the correct arguments', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [{ ChoiceId: { S: choiceId }, Data: { S: JSON.stringify(choice) } }],
      })

      const result = await scanData()

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          AttributesToGet: ['Data', 'ChoiceId', 'Expiration'],
          TableName: 'choosee-table',
        }),
      )
      expect(result).toEqual([{ data: choice, id: choiceId }])
    })
  })

  describe('scanExpiredIds', () => {
    test('should call DynamoDB with the correct arguments', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [{ ChoiceId: { S: choiceId }, Data: { S: JSON.stringify(choice) } }],
      })

      const result = await scanExpiredIds()

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          ExpressionAttributeValues: {
            ':v1': {
              N: '1',
            },
            ':v2': {
              N: `${epochTime}`,
            },
          },
          FilterExpression: 'Expiration BETWEEN :v1 AND :v2',
          IndexName: 'ExpirationIndex',
          TableName: 'choosee-table',
        }),
      )
      expect(result).toEqual([choiceId])
    })
  })

  describe('setDataById', () => {
    test('should call DynamoDB with the correct arguments', async () => {
      await setDataById(choiceId, choice)

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          Item: {
            ChoiceId: {
              S: choiceId,
            },
            Data: {
              S: JSON.stringify(choice),
            },
            Expiration: {
              N: '1728547851',
            },
          },
          TableName: 'choosee-table',
        }),
      )
    })

    test('should call DynamoDB with the correct arguments when no expiration', async () => {
      const choiceNoExpiration = { ...choice, expiration: undefined }
      await setDataById(choiceId, choiceNoExpiration)

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          Item: {
            ChoiceId: {
              S: choiceId,
            },
            Data: {
              S: JSON.stringify(choiceNoExpiration),
            },
            Expiration: {
              N: '0',
            },
          },
          TableName: 'choosee-table',
        }),
      )
    })
  })
})
