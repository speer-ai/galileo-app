import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";

import { earthClouds } from "../../assets";
import { earthMap } from "../../assets";
import { earthNormal } from "../../assets";
import { earthSpec } from "../../assets";
import { earthNight } from "../../assets";

import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const Earth = (props) => {
  const earthRef = useRef();
  const cloudRef = useRef();

  const [colorMap, normalMap, cloudMap, specularMap, nightMap] = useLoader(TextureLoader, [
    earthMap,
    earthNormal,
    earthClouds,
    earthSpec,
    earthNight
  ]);

  useFrame(() => {
    if (props.sessionSettings.scene.animateClouds) {
      cloudRef.current.rotation.y += 0.0001;
      cloudRef.current.rotation.x += 0.00005;
    }
  })

  return (
    <group>
      <mesh ref={cloudRef}>
        <sphereGeometry args={[50.1, 64, 64]} />
        <meshPhongMaterial
          map={cloudMap}
          opacity={props.sessionSettings.scene.cloudOpacity}
          depthWrite={true}
          transparent={true}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
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