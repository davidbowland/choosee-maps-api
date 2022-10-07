import { APIGatewayProxyEventV2, NewChoice } from '../types'
import { choiceExpireHours } from '../config'

// 60 minutes * 60 seconds * 1000 milliseconds = 3_600_000
const EXPIRATION_DURATION = choiceExpireHours * 3_600_000

/* Choosee */

export const formatChoice = (choice: NewChoice): NewChoice => {
  if (!choice.address) {
    throw new Error('address missing from request')
  }
  const lastExpiration = new Date().getTime() + EXPIRATION_DURATION
  if (choice.expiration !== undefined && choice.expiration > lastExpiration) {
    throw new Error('expiration is outside acceptable range')
  }
  if (choice.maxPrice !== undefined && (choice.maxPrice < 0 || choice.maxPrice > 4)) {
    throw new Error('maxPrice must be 0 thru 4')
  }
  if (choice.minPrice !== undefined && (choice.minPrice < 0 || choice.minPrice > 4)) {
    throw new Error('minPrice must be 0 thru 4')
  }
  if (choice.maxPrice !== undefined && choice.minPrice !== undefined && choice.maxPrice < choice.minPrice) {
    throw new Error('minPrice must be less or equal to than maxPrice')
  }
  if (choice.pagesPerRound !== undefined && (choice.pagesPerRound < 1 || choice.pagesPerRound > 2)) {
    throw new Error('pagesPerRound must be 1 thru 2')
  }
  if (choice.rankBy !== 'distance' && choice.rankBy !== 'prominence') {
    throw new Error('rankBy must be "distance" or "prominence"')
  }
  if (choice.rankBy === 'prominence' && (choice.radius === undefined || choice.radius < 1 || choice.radius > 50_000)) {
    throw new Error('radius must be 1 thru 50,000 when rankBy is "prominence"')
  }
  if (['restaurant', 'meal_delivery', 'meal_takeaway', 'bar', 'cafe', 'night_club'].indexOf(choice.type) < 0) {
    throw new Error('type must be one of "restaurant", "meal_delivery", "meal_takeaway", "bar", "cafe", "night_club"')
  }
  return {
    address: choice.address,
    expiration: choice.expiration ?? lastExpiration,
    lat: choice.lat,
    lng: choice.lng,
    maxPrice: choice.maxPrice,
    minPrice: choice.minPrice,
    openNow: choice.openNow ?? false,
    pagesPerRound: choice.pagesPerRound ?? 1,
    radius: choice.radius,
    rankBy: choice.rankBy,
    type: choice.type,
  }
}

/* Event */

const parseEventBody = (event: APIGatewayProxyEventV2): unknown =>
  JSON.parse(
    event.isBase64Encoded && event.body ? Buffer.from(event.body, 'base64').toString('utf8') : (event.body as string)
  )

export const extractNewChoiceFromEvent = (event: APIGatewayProxyEventV2): NewChoice =>
  formatChoice(parseEventBody(event) as NewChoice)

export const extractTokenFromEvent = (event: APIGatewayProxyEventV2): string => event.headers['x-recaptcha-token']
