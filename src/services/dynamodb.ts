import {
  DeleteItemCommand,
  DeleteItemOutput,
  DynamoDB,
  GetItemCommand,
  PutItemCommand,
  PutItemOutput,
  ScanCommand,
  ScanOutput,
} from '@aws-sdk/client-dynamodb'

import { Choice, ChoiceBatch } from '../types'
import { dynamodbTableName } from '../config'
import { xrayCapture } from '../utils/logging'

const dynamodb = xrayCapture(new DynamoDB({ apiVersion: '2012-08-10' }))

/* Delete item */

export const deleteDataById = async (choiceId: string): Promise<DeleteItemOutput> => {
  const command = new DeleteItemCommand({
    Key: {
      ChoiceId: {
        S: `${choiceId}`,
      },
    },
    TableName: dynamodbTableName,
  })
  return dynamodb.send(command)
}

/* Get single item */

export const getDataById = async (choiceId: string): Promise<Choice> => {
  const command = new GetItemCommand({
    Key: {
      ChoiceId: {
        S: `${choiceId}`,
      },
    },
    TableName: dynamodbTableName,
  })
  const response = await dynamodb.send(command)
  return JSON.parse(response.Item.Data.S)
}

/* Scan for all items */

const getItemsFromScan = (response: ScanOutput): ChoiceBatch[] =>
  response.Items?.map((item) => ({
    data: JSON.parse(item.Data.S as string),
    id: item.ChoiceId.S as string,
  })) as ChoiceBatch[]

export const scanData = async (): Promise<ChoiceBatch[]> => {
  const command = new ScanCommand({
    AttributesToGet: ['Data', 'ChoiceId', 'Expiration'],
    TableName: dynamodbTableName,
  })
  const response = await dynamodb.send(command)
  return getItemsFromScan(response)
}

/* Scan for expired items */

export const scanExpiredIds = async (): Promise<any> => {
  const command = new ScanCommand({
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
  const response = await dynamodb.send(command)
  return response.Items.map((item: any) => item.ChoiceId.S)
}

/* Set item */

export const setDataById = async (choiceId: string, choice: Choice): Promise<PutItemOutput> => {
  const command = new PutItemCommand({
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
  return dynamodb.send(command)
}
