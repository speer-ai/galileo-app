import Hexasphere from "../../utils/hexasphere/hexasphere";
import { Line } from "@react-three/drei";
import { memo } from "react";

import * as THREE from "three";
import * as utils from "../../utils/utils.js";

import { HEXASPHERE_DEFAULT } from "../../constants.js";

//generously provided by https://www.robscanlon.com/hexasphere/

//using memo to prevent re-rendering
const HexObj = memo((props) => {
  const hexasphere = new Hexasphere(50.6, props.subdivisions, props.tileSize)

  //complete the boundary
  function getBoundary(tile) {
    var boundaryPoints = tile.boundary.map((pt) => {
      return [pt.x, pt.y, pt.z]
    })
    boundaryPoints.push(boundaryPoints[0])
    return boundaryPoints
  }

  //make the object
  return (
    <group>
      {hexasphere.tiles.map((tile, index) => (
        <Line
          key={index}
          points={getBoundary(tile)}
          color={HEXASPHERE_DEFAULT}
          linewidth={1}
        />
      ))}
    </group>
  )
});

export default HexObj