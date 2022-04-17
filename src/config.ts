import axios from 'axios'
import axiosRetry from 'axios-retry'

// Axios

axiosRetry(axios, { retries: 3 })

// Cognito

export const userPoolId = process.env.USER_POOL_ID as string

// DynamoDB

export const dynamodbTableName = process.env.DYNAMODB_TABLE_NAME as string

// Google

export const googleApiKey = process.env.GOOGLE_API_KEY as string
export const googleImageCount = parseInt(process.env.GOOGLE_IMAGE_COUNT as string, 10)
export const googleImageMaxHeight = parseInt(process.env.GOOGLE_IMAGE_MAX_HEIGHT as string, 10)
export const googleImageMaxWidth = parseInt(process.env.GOOGLE_IMAGE_MAX_WIDTH as string, 10)
export const googleTimeoutMs = 2500

// Choices

export const choiceExpireHours = parseInt(process.env.CHOICE_EXPIRE_HOURS as string, 10)
export const idMinLength = parseInt(process.env.ID_MIN_LENGTH as string, 10)
export const idMaxLength = parseInt(process.env.ID_MAX_LENGTH as string, 10)
