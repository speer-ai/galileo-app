import { useState, useEffect } from 'react'
import * as utils from '../utils/utils'
import * as satlib from 'satellite.js'
import { NONE_SELECTED, CATEGORY_COLORS } from '../constants'

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
      new Date(), 24, 1
    )
    setPassList(passes.slice(0, 3))
  }, [props.object, props.sessionSettings])

  function readTLE() {
    var tle1 = props.object.line1.split(/\s+/)
    var tle2 = props.object.line2.split(/\s+/)
    return {
      norad: tle1[1], epoch: tle1[3],
      inclination: tle2[2], raan: tle2[3], eccentricity: tle2[4],
      argOfPerigee: tle2[5], meanAnomaly: tle2[6], meanMotion: tle2[7]
    }
  }

  function calculateVelocity(velocity) {
    var v = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z)
    return utils.roundToDecimal(v * 3600, 2)
  }

  var observerGd = {
    latitude: satlib.degreesToRadians(props.sessionSettings.general.latitude),
    longitude: satlib.degreesToRadians(props.sessionSettings.general.longitude),
    height: 0.37
  }
  var posECF = satlib.eciToEcf(posECI, gmst)
  var lookAngles = satlib.ecfToLookAngles(observerGd, posECF)
  const tle = readTLE()
  const catColor = CATEGORY_COLORS[props.object.category] || '#fff'

  return (
    <div className="sat-info-panel">
      <button className="sat-info-close" onClick={() => props.setSelectedIdx(NONE_SELECTED)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="sat-info-header">
        <span className="sat-info-dot" style={{ backgroundColor: catColor }} />
        <h3 className="sat-info-name">{props.object.name}</h3>
        <span className="sat-info-cat">{props.object.category}</span>
      </div>

      <div className="sat-info-grid">
        <div className="sat-info-item">
          <span className="sat-info-label">Latitude</span>
          <span className="sat-info-value">{utils.roundToDecimal(satlib.degreesLat(positionGd.latitude), 3)}&deg;</span>
        </div>
        <div className="sat-info-item">
          <span className="sat-info-label">Longitude</span>
          <span className="sat-info-value">{utils.roundToDecimal(satlib.degreesLong(positionGd.longitude), 3)}&deg;</span>
        </div>
        <div className="sat-info-item">
          <span className="sat-info-label">Altitude</span>
          <span className="sat-info-value">{utils.roundToDecimal(positionGd.height, 1)} km</span>
        </div>
        <div className="sat-info-item">
          <span className="sat-info-label">Velocity</span>
          <span className="sat-info-value">{calculateVelocity(positionAndVelocity.velocity)} km/h</span>
        </div>
      </div>

      <div className="sat-info-section">
        <h4 className="sat-info-section-title">Look Angles</h4>
        <div className="sat-info-grid">
          <div className="sat-info-item">
            <span className="sat-info-label">Azimuth</span>
            <span className="sat-info-value">{utils.roundToDecimal(satlib.degreesToRadians(lookAngles.azimuth), 3)}&deg;</span>
          </div>
          <div className="sat-info-item">
            <span className="sat-info-label">Elevation</span>
            <span className="sat-info-value">{utils.roundToDecimal(satlib.degreesToRadians(lookAngles.elevation), 3)}&deg;</span>
          </div>
          <div className="sat-info-item">
            <span className="sat-info-label">Range</span>
            <span className="sat-info-value">{utils.roundToDecimal(lookAngles.rangeSat, 1)} km</span>
          </div>
        </div>
      </div>

      <div className="sat-info-section">
        <h4 className="sat-info-section-title">Orbital Elements</h4>
        <div className="sat-info-grid compact">
          <div className="sat-info-item">
            <span className="sat-info-label">NORAD</span>
            <span className="sat-info-value">{tle.norad}</span>
          </div>
          <div className="sat-info-item">
            <span className="sat-info-label">Epoch</span>
            <span className="sat-info-value">{tle.epoch}</span>
          </div>
          <div className="sat-info-item">
            <span className="sat-info-label">Inclination</span>
            <span className="sat-info-value">{tle.inclination}&deg;</span>
          </div>
          <div className="sat-info-item">
            <span className="sat-info-label">RAAN</span>
            <span className="sat-info-value">{tle.raan}&deg;</span>
          </div>
          <div className="sat-info-item">
            <span className="sat-info-label">Eccentricity</span>
            <span className="sat-info-value">{tle.eccentricity}</span>
          </div>
          <div className="sat-info-item">
            <span className="sat-info-label">Mean Motion</span>
            <span className="sat-info-value">{tle.meanMotion}</span>
          </div>
        </div>
      </div>

      {passList.length > 0 && (
        <div className="sat-info-section">
          <h4 className="sat-info-section-title">Upcoming Passes</h4>
          {passList.map((p, idx) => (
            <div key={idx} className="pass-item">
              <div className="pass-time">
                <span className="pass-label">Start</span>
                <span>{p.start.toUTCString().slice(0, -4)}</span>
              </div>
              <div className="pass-time">
                <span className="pass-label">Peak</span>
                <span>{utils.roundToDecimal(p.maxElevation, 1)}&deg; el</span>
              </div>
              <div className="pass-time">
                <span className="pass-label">End</span>
                <span>{p.end.toUTCString().slice(0, -4)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SelectedObjectInfoBox
