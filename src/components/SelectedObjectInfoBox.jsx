import { useState, useEffect } from 'react'

import * as utils from '../utils/utils'
import * as satlib from 'satellite.js'
import { NONE_SELECTED } from '../constants'

const SelectedObjectInfoBox = (props) => {
  const satrec = satlib.twoline2satrec(props.object.line1, props.object.line2)
  var positionAndVelocity = satlib.propagate(satrec, props.simulatedDatestamp)
  var posECI = positionAndVelocity.position
  var gmst = satlib.gstime(props.simulatedDatestamp)
  var positionGd = satlib.eciToGeodetic(posECI, gmst)

  const [passList, setPassList] = useState([])

  useEffect(() => {
    const passes = utils.predictPasses(
      props.object,
      props.sessionSettings.general.latitude,
      props.sessionSettings.general.longitude,
      new Date(),
      24,
      1
    )
    setPassList(passes.slice(0, 3))
  }, [props.object, props.sessionSettings])

  function readTLE() {
    var tle1 = props.object.line1.split(/\s+/)
    var tle2 = props.object.line2.split(/\s+/)

    return {
      norad: tle1[1],
      epoch: tle1[3],
      inclination: tle2[2],
      raan: tle2[3],
      eccentricity: tle2[4],
      argOfPerigee: tle2[5],
      meanAnomaly: tle2[6],
      meanMotion: tle2[7]
    }
  }

  function calculateVelocity(velocity) {
    var velocity = Math.sqrt(
      velocity.x * velocity.x +
      velocity.y * velocity.y +
      velocity.z * velocity.z
    )
    return utils.roundToDecimal(velocity * 3600, 2)
  }

  var observerGd = {
    latitude: satlib.degreesToRadians(props.sessionSettings.general.latitude),
    longitude: satlib.degreesToRadians(props.sessionSettings.general.longitude),
    height: 0.37
  }
  var posECF = satlib.eciToEcf(posECI, gmst)
  var lookAngles = satlib.ecfToLookAngles(observerGd, posECF)

  return (
    <div className='absolute text-[14px] text-red-600 bottom-0 left-0 p-2'>
      <button
        className='font-semibold p-2 border rounded-full pl-3 text-red-800 pr-3 inline-block mb-5 border-red-800 border-2 transition ease-in-out hover:bg-red-500 hover:text-white hover:border-white hover:border-red-500 hover:cursor-pointer'
        onClick={() => props.setSelectedIdx(NONE_SELECTED)}>RECENTER EARTH
      </button>
      <p className='font-semibold text-[16px]'>{props.object.name}</p>
      <p>Latitude: {utils.roundToDecimal(satlib.degreesLat(positionGd.latitude), 3) + '\u00B0'}</p>
      <p>Longitude: {utils.roundToDecimal(satlib.degreesLong(positionGd.longitude), 3) + '\u00B0'}</p>
      <p>Height: {utils.roundToDecimal(positionGd.height, 2)}km</p>
      <p>Azimuth: {utils.roundToDecimal(satlib.degreesToRadians(lookAngles.azimuth), 3) + '\u00B0'}</p>
      <p>Elevation: {utils.roundToDecimal(satlib.degreesToRadians(lookAngles.elevation), 3) + '\u00B0'}</p>
      <p>Range: {utils.roundToDecimal(lookAngles.rangeSat, 2)}km</p>
      <p>Velocity: {calculateVelocity(positionAndVelocity.velocity)}km/h</p>
      <p>Epoch: {readTLE().epoch}</p>
      <p>NORAD: {readTLE().norad}</p>
      <p>Inclination: {readTLE().inclination + '\u00B0'}</p>
      <p>RAAN: {readTLE().raan + '\u00B0'}</p>
      <p>Eccentricity: {readTLE().eccentricity}</p>
      <p>Arg of Perigee: {readTLE().argOfPerigee + '\u00B0'}</p>
      <p>Mean Anomaly: {readTLE().meanAnomaly + '\u00B0'}</p>
      <p>Mean Motion: {readTLE().meanMotion}</p>
      {passList.length > 0 &&
        <div className='mt-2'>
          <p className='font-semibold'>Upcoming Passes:</p>
          {passList.map((p, idx) => (
            <div key={idx} className='ml-2'>
              <p>Start: {p.start.toUTCString()}</p>
              <p>End: {p.end.toUTCString()}</p>
              <p>Max Elev: {utils.roundToDecimal(p.maxElevation, 1)}&#176; at {p.maxTime.toUTCString()}</p>
            </div>
          ))}
        </div>}
    </div>
  )
}

export default SelectedObjectInfoBox