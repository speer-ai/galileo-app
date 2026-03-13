
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'

import Earth from './threeObjs/Earth'
import SatelliteCloud from './threeObjs/SatelliteCloud'
import Observer from './threeObjs/Observer'
import Camera from './threeObjs/Camera'
import ViewingLine from './threeObjs/ViewingLine'
import CenterLine from './threeObjs/CenterLine'
import Orbit from './threeObjs/Orbit'
import AxesZGreen from './threeObjs/AxesZGreen'
import HexObj from './threeObjs/HexObj'
import Sun from './threeObjs/Sun'
import WeatherOverlay from './threeObjs/WeatherOverlay'
import { EarthquakeMarkers, NaturalEventMarkers } from './threeObjs/GeoEventMarkers'

import { NONE_SELECTED } from '../constants'

const ThreeCanvas = (props) => {
  return (
    <div className="canvas-container">
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
        {props.sessionSettings.scene.doDayLightCycle && (
          <Sun simulatedDatestamp={props.simulatedDatestamp} />
        )}

        <SatelliteCloud
          objects={props.objects}
          simulatedDatestamp={props.simulatedDatestamp}
          selectedIdx={props.selectedIdx}
          setSelectedHandler={props.setSelectedHandler}
          activeCategories={props.activeCategories}
        />

        {props.selectedIdx !== NONE_SELECTED && (
          <ViewingLine
            object={props.objects[props.selectedIdx]}
            sessionSettings={props.sessionSettings}
            simulatedDatestamp={props.simulatedDatestamp}
          />
        )}

        {props.selectedIdx !== NONE_SELECTED && props.sessionSettings.scene.showCenterLine && (
          <CenterLine
            object={props.objects[props.selectedIdx]}
            simulatedDatestamp={props.simulatedDatestamp}
          />
        )}

        {props.selectedIdx !== NONE_SELECTED && props.sessionSettings.orbit.showOrbits && (
          <Orbit
            object={props.objects[props.selectedIdx]}
            simulatedDatestamp={props.simulatedDatestamp}
            orbitSteps={props.sessionSettings.orbit.orbitSteps}
            diffMillis={props.sessionSettings.orbit.orbitDiffMillis}
          />
        )}

        {/* Geo Event Markers */}
        {props.earthquakes && props.earthquakes.length > 0 && (
          <EarthquakeMarkers earthquakes={props.earthquakes} />
        )}
        {props.naturalEvents && props.naturalEvents.length > 0 && (
          <NaturalEventMarkers events={props.naturalEvents} />
        )}

        <Observer sessionSettings={props.sessionSettings} />
        <Earth sessionSettings={props.sessionSettings} />

        {props.weatherGrid && (
          <WeatherOverlay
            weatherGrid={props.weatherGrid}
            sessionSettings={props.sessionSettings}
          />
        )}

        {props.sessionSettings.hexasphere.showHexasphere && (
          <HexObj
            subdivisions={props.sessionSettings.hexasphere.subdivisions}
            tileSize={props.sessionSettings.hexasphere.tileSize}
          />
        )}

        {props.sessionSettings.renderer.showAxes && <AxesZGreen />}

        {props.sessionSettings.scene.showStars && <Stars depth={400} />}
      </Canvas>
    </div>
  )
}

export default ThreeCanvas
