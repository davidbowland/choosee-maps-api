import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from '../types'
import { log, logError } from '../utils/logging'
import { fetchPlaceDetails } from '../services/google-maps'
import status from '../utils/status'

const fetchDetailsById = async (placeId: string): Promise<APIGatewayProxyResultV2<any>> => {
  try {
    const result = await fetchPlaceDetails(placeId)
    return { ...status.OK, body: JSON.stringify(result.data.result) }
  } catch (error) {
    logError(error)
    return status.INTERNAL_SERVER_ERROR
  }
}

export const getDetailsByIdHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  const placeId = event.pathParameters.placeId
  const result = await fetchDetailsById(placeId)
  return result
}
