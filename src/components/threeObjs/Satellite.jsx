import * as THREE from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useLoader } from '@react-three/fiber'

import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { hex } from '../../assets'
import { Point, PointMaterial, Html } from '@react-three/drei'
import { Points } from '@react-three/drei'

import * as utils from '../../utils/utils'

import { SATELLITE_DEFAULT } from '../../constants'
import { SATELLITE_SELECTED } from '../../constants'

const Satellite = (props) => {
  const ptRef = useRef()
  const [hovered, setHovered] = useState(false)


  const [pointMap] = useLoader(TextureLoader, [hex])

  const altColor = (height) => {
    const clamped = Math.max(0, Math.min(2000, height))
    const hue = 240 - (clamped / 2000) * 240
    return `hsl(${hue}, 100%, 50%)`
  }

  useFrame(() => {
    //update position of satellite
    var [x, y, z] = utils.latLngHtToScreenCoords( utils.getObjLatLngHt( props.object, props.simulatedDatestamp ));
    ptRef.current.position.set(x, y, z)
  });

  const handleClick = (e) => {
    props.setSelectedHandler(props.ObjID);
  }

  const currentPos = utils.getObjLatLngHt(props.object, props.simulatedDatestamp)
  const color = props.ObjID === props.selectedIdx
    ? SATELLITE_SELECTED
    : altColor(currentPos.height)

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
        color={color}
        size={(props.ObjID === props.selectedIdx || hovered) ? 20 : 10}
        sizeAttenuation={false}
      />
      {(hovered || props.ObjID === props.selectedIdx) && (
        <Html distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div className="text-white text-xs bg-black bg-opacity-70 px-1 rounded">
            {props.object.name}
          </div>
        </Html>
      )}
    </Points>
  )
}

export default Satellite
