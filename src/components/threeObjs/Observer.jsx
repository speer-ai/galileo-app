import { Point, Points, PointMaterial } from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { useLoader } from '@react-three/fiber'
import { circle } from '../../assets'

import { calcPosFromLatLonRad } from "../../utils/utils";


const Observer = (props) => {
  const [pointMap] = useLoader(TextureLoader, [circle])
  const pos = calcPosFromLatLonRad(
    props.sessionSettings.general.latitude,
    props.sessionSettings.general.longitude,
    50
  )

  return (
    //make point on the surface to represent the observer
    <Points>
      <Point position={pos}/>
      <PointMaterial
        transparent
        map={pointMap}
        color='purple'
        size={20}
        sizeAttenuation={false}
      />
    </Points>
  )
}

export default Observer