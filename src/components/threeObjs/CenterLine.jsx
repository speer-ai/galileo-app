import * as utils from '../../utils/utils';
import { Line } from '@react-three/drei';

const CenterLine = (props) => {
  var posSat = utils.latLngHtToScreenCoords( utils.getObjLatLngHt( props.object, props.simulatedDatestamp ));

  return (
    <Line
      points={[[0, 0, 0], posSat]}
      color='limegreen'
      linewidth={1}
    />
  )
}

export default CenterLine;