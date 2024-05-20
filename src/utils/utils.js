import * as satlib from 'satellite.js'

const EARTH_RADIUS_KM = 6371.0;

function normalizePosition(position) {
  return [
    position.x/EARTH_RADIUS_KM*50,
    position.y/EARTH_RADIUS_KM*50,
    position.z/EARTH_RADIUS_KM*50
  ]
}

function roundToDecimal(num, decimalPlaces) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}

function zeroPad(num) {
  return (num < 10 ? '0' : '') + num.toString();
}


function getPosition(object, simulatedDatestamp) {
  const satrec = satlib.twoline2satrec(object.line1, object.line2);
  const positionAndVelocity = satlib.propagate(satrec, simulatedDatestamp);
  return positionAndVelocity.position;
}

export default normalizePosition

export {
  normalizePosition,
  getPosition,
  roundToDecimal,
  zeroPad
}