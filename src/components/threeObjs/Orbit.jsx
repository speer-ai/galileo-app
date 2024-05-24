import * as utils from '../../utils/utils';
import * as THREE from 'three';
import { Line } from '@react-three/drei';

import { ORBIT_DEFAULT } from '../../constants';

//currently only does circular orbits just to visualize for now
const Orbit = (props) => {
  const orbitPoints = []
  for (let i = 0; i < props.orbitSteps; i++) {
    const curDate = new Date(props.simulatedDatestamp.getTime() + i * props.diffMillis)
    const pos = utils.latLngHtToScreenCoords( utils.getObjLatLngHt( props.object, curDate ));
    orbitPoints.push(new THREE.Vector3(pos[0], pos[1], pos[2]))
  }

  return (
    <Line
      points={orbitPoints}
      color={ORBIT_DEFAULT}
      linewidth={2}
    />
  )
}

export default Orbit