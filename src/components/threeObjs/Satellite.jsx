import * as THREE from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useLoader } from '@react-three/fiber'

import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { getPosition, normalizePosition } from '../../utils/utils'
import { circle } from '../../assets'
import { Point, PointMaterial } from '@react-three/drei'
import { Points } from '@react-three/drei'

const SATELLITE_DEFAULT = 'white'
const SATELLITE_HOVERED = 'red'

const Satellite = (props) => {
  const ptRef = useRef()
  const [hovered, setHovered] = useState(false)
  var position = [0, 0, 0]

  const [pointMap] = useLoader(TextureLoader, [circle])

  useFrame(() => {
    position = normalizePosition(getPosition(props.object, props.simulatedDatestamp))
    const [x, y, z] = position
    ptRef.current.position.set(-x, z, y)
  });

  const handleClick = (e) => {
    props.setSelectedHandler(props.ObjID);
  }

  return (
    //make point for satellite
    <Points>
      <Point ref={ptRef}
        onClick={handleClick}
        onPointerOver={(e) => setHovered(true)}
        onPointerOut={(e) => setHovered(false)}/>
      <PointMaterial
        transparent
        map={pointMap}
        color={hovered ? SATELLITE_HOVERED : SATELLITE_DEFAULT}
        size={hovered ? 20 : 10}
        sizeAttenuation={false}/>
    </Points>
  )
}

export default Satellite