import { useState, useEffect } from 'react'

import * as utils from '../utils/utils'
import * as satlib from 'satellite.js'

const SelectedObjectInfoBox = (props) => {
  var positionEci = utils.getPosition(props.object, props.simulatedDatestamp)
  var gmst = satlib.gstime(props.simulatedDatestamp)
  var positionGd = satlib.eciToGeodetic(positionEci, gmst)

  var name = props.object.name
  var longitude = utils.roundToDecimal(satlib.degreesLong(positionGd.longitude), 3)
  var latitude = utils.roundToDecimal(satlib.degreesLat(positionGd.latitude), 3)
  var height = utils.roundToDecimal(positionGd.height, 2)

  return (
    <div className='absolute text-[16px] text-red-600 bottom-0 left-0 p-2'>
      <p>{name}</p>
      <p>Longitude: {longitude + '\u00B0'}</p>
      <p>Latitude: {latitude + '\u00B0'}</p>
      <p>Height: {height}km</p>
    </div>
  )
}

export default SelectedObjectInfoBox