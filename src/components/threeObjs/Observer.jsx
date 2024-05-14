import { Point, Points, PointMaterial } from "@react-three/drei";

function calcPosFromLatLonRad(lat,lon,radius){
    //theta is longitude, phi is the latitude
  
    const phi = lat*(Math.PI/180);
    const theta = -lon*(Math.PI/180);
  
    const x = radius * Math.cos(phi) * Math.cos(theta)
    const z = radius * Math.cos(phi) * Math.sin(theta)
    const y = radius * Math.sin(phi)
  
    return [x, y, z]
  }

const Observer = ({lat, lng}) => {
  const pos = calcPosFromLatLonRad(28.615862, -81.215978, 1)

  return (
    <Points>
      <Point/>
      <PointMaterial
        color='blue'
        size={2}
        sizeAttenuation={false}/>
    </Points>
  )
}

export default Observer