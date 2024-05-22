import * as THREE from 'three'

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

export default AxesZGreen