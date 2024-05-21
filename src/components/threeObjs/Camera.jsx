import * as THREE from 'three'
import * as utils from '../../utils/utils'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

import { useFrame } from '@react-three/fiber';
import { useState, useRef } from 'react';
import { update } from 'three/examples/jsm/libs/tween.module.js';

const Camera = (props) => {
  const ref = useRef()
  const [fov, setFov] = useState(45)
  var target = new THREE.Vector3()

  useFrame(() => {
    //handle focus on selection
    if (props.selectedIdx !== -1) {
      const obj = props.objects[props.selectedIdx]
      var pos = utils.positionXYZFromObject(obj, props.simulatedDatestamp)
      pos = utils.XYZtoScreenCoords(utils.normalizePositionXYZ(pos))
      
      target.set(pos[0], pos[1], pos[2])
    }
    else
      target.set(0, 0, 0)
    ref.current.target = target

    //handle fov update
    if (props.sessionSettings.renderer.cameraFOV !== fov)
      setFov(props.sessionSettings.renderer.cameraFOV);
  })

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[100, 0, 0]}
        aspect={1}
        fov={fov}
        onUpdate={(cam) => cam.updateProjectionMatrix()}
      />
      <OrbitControls
        ref={ref}
      />
    </>
  )
}

export default Camera