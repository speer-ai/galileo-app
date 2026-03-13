import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";

import { earthMap } from "../../assets";
import { earthNormal } from "../../assets";
import { earthSpec } from "../../assets";
import { earthNight } from "../../assets";

import * as THREE from "three";
import { useRef } from "react";

const Earth = (props) => {
  const earthRef = useRef();

  const [colorMap, normalMap, specularMap, nightMap] = useLoader(TextureLoader, [
    earthMap,
    earthNormal,
    earthSpec,
    earthNight
  ]);

  return (
    <group>
      <mesh ref={earthRef} receiveShadow={true}>
        <sphereGeometry args={[50, 64, 64]} />
        <meshPhongMaterial specularMap={specularMap}/>
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          metalness={0.4}
          roughness={0.7}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[50.2, 64, 64]} />
        <meshPhongMaterial
          map={nightMap}
          blending={THREE.AdditiveBlending}
          transparent={true}
          opacity={0.2}
        />
      </mesh>
    </group>
  )
}

export default Earth;
