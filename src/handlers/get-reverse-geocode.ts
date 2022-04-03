import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from '../types'
import { log, logError } from '../utils/logging'
import { fetchAddressFromGeocode } from '../services/google-maps'
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
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  const lat = parseFloat(event.queryStringParameters?.lat)
  const lng = parseFloat(event.queryStringParameters?.lng)
  if (isNaN(lat) || isNaN(lng)) {
    return { ...status.BAD_REQUEST, body: JSON.stringify({ message: 'lat and lng query parameters must be provided' }) }
  }
  const result = await fetchLatLng(lat, lng)
  return result
}
