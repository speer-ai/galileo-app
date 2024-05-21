
import { Canvas, useFrame } from '@react-three/fiber'
import { Line, Stars } from '@react-three/drei'
import * as THREE from 'three'

import Earth from './threeObjs/Earth'
import Satellite from './threeObjs/Satellite'
import Observer from './threeObjs/Observer'
import Camera from './threeObjs/Camera'
import ViewingLine from './threeObjs/ViewingLine'
import CenterLine from './threeObjs/CenterLine'

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
        <Camera
          objects={props.objects}
          selectedIdx={props.selectedIdx}
          simulatedDatestamp={props.simulatedDatestamp}
          sessionSettings={props.sessionSettings}
        />

        <ambientLight intensity={1}/>

        {props.objects.map((object, index) => (
          <Satellite
            selectedIdx={props.selectedIdx}
            key={index}
            ObjID={index}
            object={object}
            simulatedDatestamp={props.simulatedDatestamp}
            setSelectedHandler={props.setSelectedHandler}/>
        ))}

        {props.selectedIdx !== -1 &&
        <ViewingLine
          object={props.objects[props.selectedIdx]}
          sessionSettings={props.sessionSettings}
          simulatedDatestamp={props.simulatedDatestamp}
        />}

        {props.selectedIdx !== -1 && props.sessionSettings.renderer.showCenterLine &&
        <CenterLine
          object={props.objects[props.selectedIdx]}
          simulatedDatestamp={props.simulatedDatestamp}
        />}

        <Observer
          sessionSettings={props.sessionSettings}
        />
        <Earth/>

        {props.sessionSettings.renderer.showAxes &&
        <AxesZGreen/>}
        
        {props.sessionSettings.renderer.showStars &&
        <Stars depth={400}/>}
        
      </Canvas>
    </div>
  )
}

export default ThreeCanvas