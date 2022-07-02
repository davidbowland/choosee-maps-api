import { choice, choiceId } from '../__mocks__'
import { deleteDataById, getDataById, scanData, scanExpiredIds, setDataById } from '@services/dynamodb'

const mockDeleteItem = jest.fn()
const mockGetItem = jest.fn()
const mockPutItem = jest.fn()
const mockScanTable = jest.fn()
jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    deleteItem: (...args) => ({ promise: () => mockDeleteItem(...args) }),
    getItem: (...args) => ({ promise: () => mockGetItem(...args) }),
    putItem: (...args) => ({ promise: () => mockPutItem(...args) }),
    scan: (...args) => ({ promise: () => mockScanTable(...args) }),
  })),
}))
jest.mock('@utils/logging', () => ({
  xrayCapture: jest.fn().mockImplementation((x) => x),
}))

describe('dynamodb', () => {
  describe('deleteDataById', () => {
    test('expect index passed to delete', async () => {
      await deleteDataById(choiceId)
      expect(mockDeleteItem).toHaveBeenCalledWith({
        Key: {
          ChoiceId: {
            S: `${choiceId}`,
          },
        },
        TableName: 'choosee-table',
      })
    })
  })

  describe('getDataById', () => {
    beforeAll(() => {
      mockGetItem.mockResolvedValue({ Item: { Data: { S: JSON.stringify(choice) } } })
    })

    test('expect id passed to get', async () => {
      await getDataById(choiceId)
      expect(mockGetItem).toHaveBeenCalledWith({
        Key: {
          ChoiceId: {
            S: `${choiceId}`,
          },
        },
        TableName: 'choosee-table',
      })
    })

    test('expect data parsed and returned', async () => {
      const result = await getDataById(choiceId)
      expect(result).toEqual(choice)
    })
  })

  describe('scanData', () => {
    beforeAll(() => {
      mockScanTable.mockResolvedValue({
        Items: [{ ChoiceId: { S: `${choiceId}` }, Data: { S: JSON.stringify(choice) } }],
      })
    })

    test('expect data parsed and returned', async () => {
      const result = await scanData()
      expect(result).toEqual([{ data: choice, id: choiceId }])
    })

    test('expect empty object with no data returned', async () => {
      mockScanTable.mockResolvedValueOnce({ Items: [] })
      const result = await scanData()
      expect(result).toEqual([])
    })
  })

  describe('scanExpiredIds', () => {
    beforeAll(() => {
      mockScanTable.mockResolvedValue({
        Items: [{ ChoiceId: { S: `${choiceId}` } }],
      })
    })

    test('expect data parsed and returned', async () => {
      const result = await scanExpiredIds()
      expect(result).toEqual([choiceId])
    })

    test('expect empty object with no data returned', async () => {
      mockScanTable.mockResolvedValueOnce({ Items: [] })
      const result = await scanExpiredIds()
      expect(result).toEqual([])
    })
  })

  describe('setDataById', () => {
    test('expect index and data passed to put', async () => {
      await setDataById(choiceId, choice)
      expect(mockPutItem).toHaveBeenCalledWith({
        Item: {
          ChoiceId: {
            S: `${choiceId}`,
          },
          Data: {
            S: JSON.stringify(choice),
          },
          Expiration: {
            N: '1728547851',
          },
        },
        TableName: 'choosee-table',
      })
    })

    test('expect no expiration when no expiration passed', async () => {
      const choiceNoExpiration = { ...choice, expiration: undefined }
      await setDataById(choiceId, choiceNoExpiration)
      expect(mockPutItem).toHaveBeenCalledWith({
        Item: {
          ChoiceId: {
            S: `${choiceId}`,
          },
          Data: {
            S: JSON.stringify(choiceNoExpiration),
          },
          Expiration: {
            N: '0',
          },
        },
        TableName: 'choosee-table',
      })
    })
  })
})
