import * as satlib from 'satellite.js'

const EARTH_RADIUS_KM = 6371.0;
const THREE_ADJ_FACTOR = 50;


//returns dict
function getPositionECI(object, simulatedDatestamp) {
  const satrec = satlib.twoline2satrec(object.line1, object.line2);
  const positionAndVelocity = satlib.propagate(satrec, simulatedDatestamp);
  return positionAndVelocity.position;
}

//returns dict
function lngLatHeightToXYZ(longitude, latitude, height) {
  const r = EARTH_RADIUS_KM + height;
  const x = r * Math.cos(latitude) * Math.cos(longitude);
  const y = r * Math.cos(latitude) * Math.sin(longitude);
  const z = r * Math.sin(latitude);
  return {
    x: x,
    y: y,
    z: z
  };
}

//returns dict
function positionXYZFromObject(object, simulatedDatestamp) {
  const positionECI = getPositionECI(object, simulatedDatestamp);
  const gmst = satlib.gstime(simulatedDatestamp);
  const positionGd = satlib.eciToGeodetic(positionECI, gmst)
  return lngLatHeightToXYZ(positionGd.longitude, positionGd.latitude, positionGd.height)
}

//returns list
function normalizePositionXYZ(position) {
  return [
    position.x / EARTH_RADIUS_KM * THREE_ADJ_FACTOR,
    position.y / EARTH_RADIUS_KM * THREE_ADJ_FACTOR,
    position.z / EARTH_RADIUS_KM * THREE_ADJ_FACTOR
  ];
}

function XYZtoScreenCoords(pos) {
  return [pos[0], pos[2], -pos[1]];
}

function positionECItoLatLonHeight(positionECI, gmst) {
  const positionGd = satlib.eciToGeodetic(positionECI, gmst);
  return {
    longitude: satlib.degreesLong(positionGd.longitude),
    latitude: satlib.degreesLat(positionGd.latitude),
    height: positionGd.height
  }
}

// =====================================================================================

function calcPosFromLatLonRad(lat,lon,radius){
  //theta is longitude, phi is the latitude

  const phi = lat*(Math.PI/180);
  const theta = -lon*(Math.PI/180);

  const x = radius * Math.cos(phi) * Math.cos(theta)
  const z = radius * Math.cos(phi) * Math.sin(theta)
  const y = radius * Math.sin(phi)

  return [x, y, z]
}

function roundToDecimal(num, decimalPlaces) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}

function zeroPad(num) {
  return (num < 10 ? '0' : '') + num.toString();
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default roundToDecimal;

export {
  getPositionECI,
  lngLatHeightToXYZ,
  positionXYZFromObject,
  normalizePositionXYZ,
  positionECItoLatLonHeight,
  XYZtoScreenCoords,
  roundToDecimal,
  zeroPad,
  capitalizeFirstLetter,
  calcPosFromLatLonRad
}