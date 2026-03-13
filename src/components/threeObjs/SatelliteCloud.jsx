import { useRef, useMemo, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import * as utils from '../../utils/utils'
import { CATEGORY_COLORS, SATELLITE_SELECTED } from '../../constants'

const tempColor = new THREE.Color()

const SatelliteCloud = ({ objects, simulatedDatestamp, selectedIdx, setSelectedHandler, activeCategories }) => {
  const pointsRef = useRef()
  const frameCount = useRef(0)
  const [hoveredIdx, setHoveredIdx] = useState(-1)
  const { raycaster } = useThree()

  const count = objects.length

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    arr.fill(0)
    return arr
  }, [count])

  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3)
    arr.fill(1)
    return arr
  }, [count])

  useFrame(() => {
    if (!pointsRef.current) return
    frameCount.current++
    // Update every 2nd frame for performance
    if (frameCount.current % 2 !== 0) return

    const posAttr = pointsRef.current.geometry.attributes.position
    const colAttr = pointsRef.current.geometry.attributes.color

    for (let i = 0; i < count; i++) {
      const obj = objects[i]

      // Hide satellites not in active categories
      if (activeCategories && !activeCategories.has(obj.category)) {
        posAttr.array[i * 3] = 0
        posAttr.array[i * 3 + 1] = 99999
        posAttr.array[i * 3 + 2] = 0
        continue
      }

      try {
        const pos = utils.getObjLatLngHt(obj, simulatedDatestamp)
        const [x, y, z] = utils.latLngHtToScreenCoords(pos)
        posAttr.array[i * 3] = x
        posAttr.array[i * 3 + 1] = y
        posAttr.array[i * 3 + 2] = z

        // Color by category
        const catColor = CATEGORY_COLORS[obj.category] || '#ffffff'

        if (i === selectedIdx) {
          tempColor.set(SATELLITE_SELECTED)
        } else if (i === hoveredIdx) {
          tempColor.set('#ffffff')
        } else {
          tempColor.set(catColor)
        }

        colAttr.array[i * 3] = tempColor.r
        colAttr.array[i * 3 + 1] = tempColor.g
        colAttr.array[i * 3 + 2] = tempColor.b
      } catch (e) {
        posAttr.array[i * 3] = 0
        posAttr.array[i * 3 + 1] = 99999
        posAttr.array[i * 3 + 2] = 0
      }
    }

    posAttr.needsUpdate = true
    colAttr.needsUpdate = true
  })

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    if (e.intersections && e.intersections.length > 0) {
      const idx = e.intersections[0].index
      if (idx !== undefined && idx < count) {
        const obj = objects[idx]
        if (activeCategories && !activeCategories.has(obj.category)) return
        setSelectedHandler(idx)
      }
    }
  }, [setSelectedHandler, count, objects, activeCategories])

  const handlePointerOver = useCallback((e) => {
    if (e.intersections && e.intersections.length > 0) {
      const idx = e.intersections[0].index
      if (idx !== undefined) {
        setHoveredIdx(idx)
        document.body.style.cursor = 'pointer'
      }
    }
  }, [])

  const handlePointerOut = useCallback(() => {
    setHoveredIdx(-1)
    document.body.style.cursor = 'auto'
  }, [])

  // Calculate label position for selected/hovered satellite
  const labelIdx = selectedIdx >= 0 ? selectedIdx : hoveredIdx
  const labelPos = useMemo(() => {
    if (labelIdx < 0 || labelIdx >= count) return null
    try {
      const pos = utils.getObjLatLngHt(objects[labelIdx], simulatedDatestamp)
      return utils.latLngHtToScreenCoords(pos)
    } catch { return null }
  }, [labelIdx, simulatedDatestamp, objects, count])

  return (
    <group>
      <points
        ref={pointsRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        frustumCulled={false}
      >
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={selectedIdx >= 0 ? 6 : 5}
          sizeAttenuation={false}
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </points>

      {/* Selected satellite highlight */}
      {selectedIdx >= 0 && labelPos && (
        <mesh position={labelPos}>
          <sphereGeometry args={[0.6, 8, 8]} />
          <meshBasicMaterial color={SATELLITE_SELECTED} transparent opacity={0.8} />
        </mesh>
      )}

      {/* Hover/selected label */}
      {labelPos && labelIdx >= 0 && labelIdx < count && (
        <group position={labelPos}>
          <Html distanceFactor={200} style={{ pointerEvents: 'none' }}>
            <div className="sat-label">
              <span className="sat-label-dot" style={{ background: CATEGORY_COLORS[objects[labelIdx].category] || '#fff' }} />
              {objects[labelIdx].name}
            </div>
          </Html>
        </group>
      )}
    </group>
  )
}

export default SatelliteCloud
