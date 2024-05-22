import * as THREE from 'three'
import * as utils from '../../utils/utils.js'

//moves with axial tilt and with day rotation
//slightly off but good enough for now
//the cost to get exact would be insane
const Sun = (props) => {
  var latitude = - 23.5 * Math.cos(2 * Math.PI * utils.fractionOfYearCompleted(props.simulatedDatestamp));
  var longitude = 180 * (-1 + 2 * utils.fractionOfDayCompleted(props.simulatedDatestamp));

  return (
    <directionalLight
      position={utils.latLngHtToScreenCoords({
        latitude: latitude,
        longitude: longitude,
        height: 1
      })}
      intensity={1.5}
    />
  )
}

export default Sun