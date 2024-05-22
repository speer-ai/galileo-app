
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

import Earth from './threeObjs/Earth'
import Satellite from './threeObjs/Satellite'
import Observer from './threeObjs/Observer'
import Camera from './threeObjs/Camera'
import ViewingLine from './threeObjs/ViewingLine'
import CenterLine from './threeObjs/CenterLine'
import Orbit from './threeObjs/Orbit'
import AxesZGreen from './threeObjs/AxesZGreen'
import HexObj from './threeObjs/HexObj'
import Sun from './threeObjs/Sun'

import { Suspense } from 'react'

const NONE_SELECTED = -1

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

        <ambientLight
          intensity={props.sessionSettings.scene.doDayLightCycle ? 0.3 : 1.2}
        />
        {props.sessionSettings.scene.doDayLightCycle &&
        <Sun
          simulatedDatestamp={props.simulatedDatestamp}
        />}

        {props.objects.map((object, index) => (
          <Satellite
            selectedIdx={props.selectedIdx}
            key={index}
            ObjID={index}
            object={object}
            simulatedDatestamp={props.simulatedDatestamp}
            setSelectedHandler={props.setSelectedHandler}/>
        ))}

        {props.selectedIdx !== NONE_SELECTED &&
        <ViewingLine
          object={props.objects[props.selectedIdx]}
          sessionSettings={props.sessionSettings}
          simulatedDatestamp={props.simulatedDatestamp}
        />}

        {props.selectedIdx !== NONE_SELECTED && props.sessionSettings.scene.showCenterLine &&
        <CenterLine
          object={props.objects[props.selectedIdx]}
          simulatedDatestamp={props.simulatedDatestamp}
        />}

        {props.selectedIdx !== NONE_SELECTED && props.sessionSettings.scene.showOrbits &&
        <Orbit
          object={props.objects[props.selectedIdx]}
          simulatedDatestamp={props.simulatedDatestamp}
          sessionSettings={props.sessionSettings}
        />}

        <Observer
          sessionSettings={props.sessionSettings}
        />
        <Earth
          sessionSettings={props.sessionSettings}
        />
        {props.sessionSettings.hexasphere.showHexasphere &&
        <HexObj
          subdivisions={props.sessionSettings.hexasphere.subdivisions}
          tileSize={props.sessionSettings.hexasphere.tileSize}
        />}

        {props.sessionSettings.renderer.showAxes &&
        <AxesZGreen/>}
        
        {props.sessionSettings.scene.showStars &&
        <Stars depth={400}/>}
        
      </Canvas>
    </div>
  )
}

export default ThreeCanvas