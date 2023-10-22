import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from '../types'
import { log, logError } from '../utils/logging'
import { fetchAddressFromGeocode } from '../services/google-maps'
import { getScoreFromEvent } from '../services/recaptcha'
import status from '../utils/status'

const fetchLatLng = async (lat: number, lng: number): Promise<APIGatewayProxyResultV2<any>> => {
  try {
    const result = await fetchAddressFromGeocode(lat, lng)
    const address = result.data.results[0]?.formatted_address
    if (address === undefined) {
      return status.NOT_FOUND
    }
    return { ...status.OK, body: JSON.stringify({ address }) }
  } catch (error) {
    logError(error)
    return status.INTERNAL_SERVER_ERROR
  }
}

export const getReverseGeocodeHandler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2<any>> => {
  const lat = parseFloat(event.queryStringParameters?.lat as string)
  const lng = parseFloat(event.queryStringParameters?.lng as string)
  if (isNaN(lat) || isNaN(lng)) {
    return { ...status.BAD_REQUEST, body: JSON.stringify({ message: 'lat and lng query parameters must be provided' }) }
  }
  const result = await fetchLatLng(lat, lng)
  return result
}

export const getReverseGeocodeHandlerAuthenticated = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })

  return await getReverseGeocodeHandler(event)
}

export const getReverseGeocodeHandlerUnauthenticated = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })

  try {
    const score = await getScoreFromEvent(event)
    log('reCAPTCHA result', { score })
    if (score < 0.7) {
      return status.FORBIDDEN
    }
  } catch (error) {
    return status.INTERNAL_SERVER_ERROR
  }

  return await getReverseGeocodeHandler(event)
}
