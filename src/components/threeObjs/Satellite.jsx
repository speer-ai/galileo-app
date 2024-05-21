import * as THREE from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useLoader } from '@react-three/fiber'

import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { circle } from '../../assets'
import { Point, PointMaterial } from '@react-three/drei'
import { Points } from '@react-three/drei'

import * as utils from '../../utils/utils'

const SATELLITE_DEFAULT = 'white'
const SATELLITE_SELECTED = 'red'

const Satellite = (props) => {
  const ptRef = useRef()
  const [hovered, setHovered] = useState(false)


  const [pointMap] = useLoader(TextureLoader, [circle])

  useFrame(() => {
    //update position of satellite
    var [x, y, z] = utils.normalizePositionXYZ(utils.positionXYZFromObject(props.object, props.simulatedDatestamp));
    ptRef.current.position.set(x, z, -y)
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
        color={props.ObjID === props.selectedIdx ? SATELLITE_SELECTED : SATELLITE_DEFAULT}
        size={(props.ObjID === props.selectedIdx || hovered) ? 20 : 10}
        sizeAttenuation={false}
      />
    </Points>
  )
}

export default Satellite