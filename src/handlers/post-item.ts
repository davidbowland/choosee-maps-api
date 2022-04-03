import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Choice, LatLng, NewChoice } from '../types'
import { fetchGeocodeResults, fetchPlaceResults } from '../services/google-maps'
import { log, logError } from '../utils/logging'
import { extractNewChoiceFromEvent } from '../utils/events'
import { getNextId } from '../utils/id-generator'
import { setDataById } from '../services/dynamodb'
import status from '../utils/status'

interface GeocodedAddress {
  address: string
  latLng: LatLng
}

const getGeocodedAddress = async (newChoice: NewChoice): Promise<GeocodedAddress | undefined> => {
  if (newChoice.lat !== undefined && newChoice.lng !== undefined) {
    return { address: newChoice.address, latLng: { lat: newChoice.lat, lng: newChoice.lng } }
  }
  const geocoded = await fetchGeocodeResults(newChoice.address)
  if (geocoded.data.results.length === 0) {
    return undefined
  }
  return { address: geocoded.data.results[0].formatted_address, latLng: geocoded.data.results[0].geometry.location }
}

const createNewChoice = async (newChoice: NewChoice): Promise<APIGatewayProxyResultV2<any>> => {
  try {
    const geocodedAddress = await getGeocodedAddress(newChoice)
    if (geocodedAddress === undefined) {
      return { ...status.BAD_REQUEST, body: JSON.stringify({ message: 'Invalid address' }) }
    }

    const places = await fetchPlaceResults(
      geocodedAddress.latLng,
      newChoice.type,
      newChoice.openNow,
      newChoice.pagesPerRound
    )
    log('Google API results', { geocodedAddress, places })

    const choiceId = await getNextId()
    const choice: Choice = {
      address: geocodedAddress.address,
      choices: places.data,
      expiration: newChoice.expiration,
      latLng: geocodedAddress.latLng,
      nextPageToken: places.nextPageToken,
      openNow: newChoice.openNow,
      pagesPerRound: newChoice.pagesPerRound,
      type: newChoice.type,
    }
    log('Creating choices', { choice, choiceId })
    await setDataById(choiceId, choice)
    return {
      ...status.CREATED,
      body: JSON.stringify({ ...choice, choiceId }),
    }
  } catch (error) {
    logError(error)
    return status.INTERNAL_SERVER_ERROR
  }
}

export const postItemHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  try {
    const newChoice = extractNewChoiceFromEvent(event)
    return await createNewChoice(newChoice)
  } catch (error) {
    return { ...status.BAD_REQUEST, body: JSON.stringify({ message: error.message }) }
  }
}
