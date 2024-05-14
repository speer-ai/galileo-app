
import * as THREE from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useLoader } from '@react-three/fiber'

import { earthMap, earthNight, earthNormal, earthSpec, earthClouds, earthMapSimple } from '../../assets'

const Earth = () => {
  const [map, normal, specular, clouds, night] = useLoader(TextureLoader, [earthMap, earthNormal, earthSpec, earthClouds, earthNight])
  const [simpleMap] = useLoader(TextureLoader, [earthMapSimple])

  return (    
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[50, 64, 64]}/>
      <meshStandardMaterial map={simpleMap}/>
    </mesh>
  )
}

export default Earth