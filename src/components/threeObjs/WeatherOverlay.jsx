import { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { generateWeatherTexture } from '../../services/weather_fetch'

const WeatherOverlay = ({ weatherGrid, sessionSettings }) => {
  const meshRefs = {
    temperature: useRef(),
    clouds: useRef(),
    precipitation: useRef(),
    wind: useRef(),
  }

  const textures = useMemo(() => {
    if (!weatherGrid || weatherGrid.length === 0) return {}
    const result = {}
    const layers = ['temperature', 'clouds', 'precipitation', 'wind']
    for (const layer of layers) {
      const canvas = generateWeatherTexture(weatherGrid, layer, 360, 180)
      const tex = new THREE.CanvasTexture(canvas)
      tex.needsUpdate = true
      result[layer] = tex
    }
    return result
  }, [weatherGrid])

  const opacity = sessionSettings.weather?.overlayOpacity ?? 0.6

  return (
    <group>
      {sessionSettings.weather?.showTemperature && textures.temperature && (
        <mesh ref={meshRefs.temperature}>
          <sphereGeometry args={[50.35, 64, 64]} />
          <meshBasicMaterial
            map={textures.temperature}
            transparent
            opacity={opacity}
            side={THREE.FrontSide}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </mesh>
      )}

      {sessionSettings.weather?.showClouds && textures.clouds && (
        <mesh ref={meshRefs.clouds}>
          <sphereGeometry args={[50.4, 64, 64]} />
          <meshBasicMaterial
            map={textures.clouds}
            transparent
            opacity={opacity * 0.8}
            side={THREE.FrontSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {sessionSettings.weather?.showPrecipitation && textures.precipitation && (
        <mesh ref={meshRefs.precipitation}>
          <sphereGeometry args={[50.45, 64, 64]} />
          <meshBasicMaterial
            map={textures.precipitation}
            transparent
            opacity={opacity}
            side={THREE.FrontSide}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </mesh>
      )}

      {sessionSettings.weather?.showWind && textures.wind && (
        <mesh ref={meshRefs.wind}>
          <sphereGeometry args={[50.5, 64, 64]} />
          <meshBasicMaterial
            map={textures.wind}
            transparent
            opacity={opacity * 0.7}
            side={THREE.FrontSide}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </mesh>
      )}
    </group>
  )
}

export default WeatherOverlay
