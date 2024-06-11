import { Point, Points, PointMaterial } from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { useLoader } from '@react-three/fiber'
import { hex } from '../../assets'

import * as utils from '../../utils/utils'

import { OBSERVER_DEFAULT } from "../../constants";


const Observer = (props) => {
  const [pointMap] = useLoader(TextureLoader, [hex])
  const posViewer = utils.latLngHtToScreenCoords({
		latitude: props.sessionSettings.general.latitude,
		longitude: props.sessionSettings.general.longitude,
		height: 50
  })

  return (
    //make point on the surface to represent the observer
    <Points>
      <Point position={posViewer}/>
      <PointMaterial
        transparent
        map={pointMap}
        color={OBSERVER_DEFAULT}
        size={20}
        sizeAttenuation={false}
      />
    </Points>
  )
}

export default Observer