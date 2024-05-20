
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei'
import * as THREE from 'three'

import Earth from './threeObjs/Earth'
import Satellite from './threeObjs/Satellite'
import Observer from './threeObjs/Observer'
  

const SatelliteLine = () => {
  const points = []
  points.push(new THREE.Vector3(0, 0, 0))
  points.push(new THREE.Vector3(2, 0, 0))
  points.push(new THREE.Vector3(2, 2, 0))

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color='red'/>
    </line>
  )
}

const AxesZGreen = () => {
  return (
    <group>
      <mesh position={[100, 0, 0]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[1, 1, 200, 32]}/>
        <meshBasicMaterial color='red'/>
      </mesh>
      <mesh position={[0, 100, 0]} rotation={[0, Math.PI/2, 0]}>
        <cylinderGeometry args={[1, 1, 200, 32]}/>
        <meshBasicMaterial color='blue'/>
      </mesh>
      <mesh position={[0, 0, 100]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 200, 32]}/>
        <meshBasicMaterial color='green'/>
      </mesh>
    </group>
  )
}

const ThreeCanvas = (props) => {
    return (
        <div className='bg-stone-950 relative w-full'>
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 100]}/>
            <OrbitControls/>

            <ambientLight intensity={1}/>

            {props.objects.map((object, index) => (
              <Satellite
                key={index}
                ObjID={index}
                object={object}
                simulatedDatestamp={props.simulatedDatestamp}
                selectedState={props.selectedState}
                setSelectedHandler={props.setSelectedHandler}/>
            ))}

            <Observer/>
            <Earth/>

            <Stars depth={400}/>
            
          </Canvas>
        </div>
    )
}

export default ThreeCanvas