import { CircleGeometry } from "three"
import * as THREE from 'three'
import { degToRad } from "three/src/math/MathUtils.js"

const ISS_Example_Data = {
    "OBJECT_NAME": "ISS (ZARYA)",
    "OBJECT_ID": "1998-067A",
    "EPOCH": "2024-05-08T11:13:13.384992",
    "MEAN_MOTION": 15.5101558,
    "ECCENTRICITY": 0.0003585,
    "INCLINATION": 51.6383,
    "RA_OF_ASC_NODE": 152.3226,
    "ARG_OF_PERICENTER": 147.6032,
    "MEAN_ANOMALY": 356.217,
    "EPHEMERIS_TYPE": 0,
    "CLASSIFICATION_TYPE": "U",
    "NORAD_CAT_ID": 25544,
    "ELEMENT_SET_NO": 999,
    "REV_AT_EPOCH": 45238,
    "BSTAR": 0.00028795,
    "MEAN_MOTION_DOT": 0.00016613,
    "MEAN_MOTION_DDOT": 0
}

//currently only does circular orbits just to visualize for now
const Orbit = ({inclination}) => {
    return (
      <mesh 
        rotation={[Math.PI/2 - degToRad(inclination), 0, 0]}>
        <circleGeometry args={[1.5, 128]}/>
        <meshStandardMaterial color='white' transparent opacity={0.5} side={THREE.DoubleSide}/>
      </mesh>
    )
}

export default Orbit