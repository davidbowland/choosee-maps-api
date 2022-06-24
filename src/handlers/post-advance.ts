import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from '../types'
import { getDataById, setDataById } from '../services/dynamodb'
import { log, logError } from '../utils/logging'
import { fetchPlaceResults } from '../services/google-maps'
import status from '../utils/status'

export const postAdvanceHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  try {
    const choiceId = event.pathParameters.choiceId
    const choice = await getDataById(choiceId)

    if (!choice.nextPageToken) {
      return status.BAD_REQUEST
    }

    const places = await fetchPlaceResults(
      choice.latLng,
      choice.type,
      choice.openNow,
      choice.pagesPerRound,
      choice.rankBy,
      choice.radius,
      choice.nextPageToken
    )
    const updatedChoice = { ...choice, choices: places.data, nextPageToken: places.nextPageToken }
    log('Updating choice', { choiceId, updatedChoice })
    await setDataById(choiceId, updatedChoice)

    return {
      ...status.OK,
      body: JSON.stringify({ ...updatedChoice, choiceId }),
    }
  } catch (error) {
    logError(error)
    return { ...status.INTERNAL_SERVER_ERROR }
  }
}
