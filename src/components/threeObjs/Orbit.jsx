import * as utils from '../../utils/utils';
import * as THREE from 'three';
import { Line } from '@react-three/drei';

//currently only does circular orbits just to visualize for now
const Orbit = (props) => {
  const orbPropSteps = 200
  const orbPropDifMillis = 1000 * 30

  const orbitPoints = []
  for (let i = 0; i < orbPropSteps; i++) {
    const curDate = new Date(props.simulatedDatestamp.getTime() + i * orbPropDifMillis)
    const pos = utils.latLngHtToScreenCoords( utils.getObjLatLngHt( props.object, curDate ));
    orbitPoints.push(new THREE.Vector3(pos[0], pos[1], pos[2]))
  }

  return (
    <Line
      points={orbitPoints}
      color='green'
      linewidth={2}
    />
  )
}

export default Orbit