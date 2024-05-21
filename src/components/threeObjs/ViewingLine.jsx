import * as utils from '../../utils/utils';
import { Line } from '@react-three/drei';

const ViewingLine = (props) => {
	const posViewer = utils.calcPosFromLatLonRad(
		props.sessionSettings.general.latitude,
		props.sessionSettings.general.longitude,
		50
  )
  var posSat = utils.normalizePositionXYZ(utils.positionXYZFromObject(props.object, props.simulatedDatestamp));

  return (
    <Line
      points={[posViewer, utils.XYZtoScreenCoords(posSat)]}
      color='limegreen'
      linewidth={1}
    />
  )
}

export default ViewingLine;