import { DynamoDB } from 'aws-sdk'

import { Choice, ChoiceBatch } from '../types'
import { dynamodbTableName } from '../config'

const dynamodb = new DynamoDB({ apiVersion: '2012-08-10' })

/* Delete item */

export const deleteDataById = (choiceId: string): Promise<DynamoDB.Types.DeleteItemOutput> =>
  dynamodb
    .deleteItem({
      Key: {
        ChoiceId: {
          S: `${choiceId}`,
        },
      },
      TableName: dynamodbTableName,
    })
    .promise()

/* Get single item */

export const getDataById = (choiceId: string): Promise<Choice> =>
  dynamodb
    .getItem({
      Key: {
        ChoiceId: {
          S: `${choiceId}`,
        },
      },
      TableName: dynamodbTableName,
    })
    .promise()
    .then((response) => response.Item.Data.S)
    .then(JSON.parse)

/* Scan for all items */

const getItemsFromScan = (response: DynamoDB.Types.ScanOutput): ChoiceBatch[] =>
  response.Items.map((item) => ({ data: JSON.parse(item.Data.S), id: item.ChoiceId.S }))

export const scanData = (): Promise<ChoiceBatch[]> =>
  dynamodb
    .scan({
      AttributesToGet: ['Data', 'ChoiceId', 'Expiration'],
      TableName: dynamodbTableName,
    })
    .promise()
    .then((response) => getItemsFromScan(response))

/* Scan for expired items */

export const scanExpiredIds = (): Promise<any> =>
  dynamodb
    .scan({
      ExpressionAttributeValues: {
        ':v1': {
          N: '1',
        },
        ':v2': {
          N: `${new Date().getTime()}`,
        },
      },
      FilterExpression: 'Expiration BETWEEN :v1 AND :v2',
      IndexName: 'ExpirationIndex',
      TableName: dynamodbTableName,
    })
    .promise()
    .then((response) => response.Items.map((item) => item.ChoiceId.S))

/* Set item */

export const setDataById = (choiceId: string, choice: Choice): Promise<DynamoDB.Types.PutItemOutput> =>
  dynamodb
    .putItem({
      Item: {
        ChoiceId: {
          S: `${choiceId}`,
        },
        Data: {
          S: JSON.stringify(choice),
        },
        Expiration: {
          N: `${choice.expiration ?? 0}`,
        },
      },
      TableName: dynamodbTableName,
    })
    .promise()