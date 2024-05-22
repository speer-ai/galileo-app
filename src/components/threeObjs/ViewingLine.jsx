import * as utils from '../../utils/utils';
import { Line } from '@react-three/drei';

import * as satlib from 'satellite.js';

const ViewingLine = (props) => {
	const posViewer = utils.latLngHtToScreenCoords({
		latitude: props.sessionSettings.general.latitude,
		longitude: props.sessionSettings.general.longitude,
		height: 0
  })
  var posSat = utils.latLngHtToScreenCoords( utils.getObjLatLngHt( props.object, props.simulatedDatestamp ));

  return (
    <Line
      points={[posViewer, posSat]}
      color='limegreen'
      linewidth={1}
    />
  )
}

export default ViewingLine;