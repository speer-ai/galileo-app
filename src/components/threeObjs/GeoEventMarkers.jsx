import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { latLngHtToScreenCoords } from '../../utils/utils'
import { getMagnitudeColor, getMagnitudeSize, getEventColor } from '../../services/geo_events'

const EarthquakeMarkers = ({ earthquakes, onSelect }) => {
  const groupRef = useRef()
  const pulseRef = useRef(0)

  useFrame((state) => {
    pulseRef.current = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7
  })

  const markers = useMemo(() => {
    if (!earthquakes) return []
    return earthquakes.slice(0, 100).map(eq => {
      const pos = latLngHtToScreenCoords({ latitude: eq.lat, longitude: eq.lon, height: 5 })
      const size = getMagnitudeSize(eq.magnitude)
      const color = getMagnitudeColor(eq.magnitude)
      return { ...eq, pos, size, color }
    })
  }, [earthquakes])

  return (
    <group ref={groupRef}>
      {markers.map(eq => (
        <group key={eq.id} position={eq.pos}>
          {/* Glow ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[eq.size * 0.8, eq.size * 1.2, 16]} />
            <meshBasicMaterial
              color={eq.color}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          {/* Core dot */}
          <mesh>
            <sphereGeometry args={[eq.size * 0.3, 8, 8]} />
            <meshBasicMaterial color={eq.color} transparent opacity={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

const NaturalEventMarkers = ({ events }) => {
  const markers = useMemo(() => {
    if (!events) return []
    return events.slice(0, 50).map(ev => {
      const pos = latLngHtToScreenCoords({ latitude: ev.lat, longitude: ev.lon, height: 8 })
      const color = getEventColor(ev.categoryId)
      return { ...ev, pos, color }
    })
  }, [events])

  return (
    <group>
      {markers.map(ev => (
        <group key={ev.id} position={ev.pos}>
          {/* Diamond marker */}
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshBasicMaterial color={ev.color} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export { EarthquakeMarkers, NaturalEventMarkers }
