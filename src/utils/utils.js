import * as satlib from 'satellite.js'

const EARTH_RADIUS_KM = 6371.0;

function provideExample() {
  const example = 'ISS (ZARYA)             \n1 25544U 98067A   24135.45777498  .00019558  00000+0  33405-3 0  9991\n2 25544  51.6380 122.5937 0003304 165.6753 330.8797 15.51306217453311'
  const tle_lines = example.split(/\s*\n/gm);
  
  const object = {
    'id': 0,
    'name': tle_lines[0],
    'tle': {
      'line1': tle_lines[1],
      'line2': tle_lines[2]
    }
  }
  console.log(object);
  return object;
}

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
  const satrec = satlib.twoline2satrec(object.tle.line1, object.tle.line2);
  const positionAndVelocity = satlib.propagate(satrec, simulatedDatestamp);
  return positionAndVelocity.position;
}

export default provideExample;

export {
  provideExample,
  normalizePosition,
  getPosition,
  roundToDecimal,
  zeroPad
}