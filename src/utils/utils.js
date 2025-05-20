import * as satlib from 'satellite.js'
import { radToDeg } from 'three/src/math/MathUtils.js';

const EARTH_RADIUS_KM = 6371.0;
const EARTH_RADIUS_SIM = 50;

//============================= SATELLITE UTILS ========================================//

//lat lng degrees, ht km
function getObjLatLngHt(object, simulatedDatestamp) {
  const satrec = satlib.twoline2satrec(object.line1, object.line2);
  const positionAndVelocity = satlib.propagate(satrec, simulatedDatestamp);
  const posECI = positionAndVelocity.position;

  const gmst = satlib.gstime(simulatedDatestamp);
  const positionGd = satlib.eciToGeodetic(posECI, gmst);

  return {
    latitude: satlib.degreesLat(positionGd.latitude),
    longitude: satlib.degreesLong(positionGd.longitude),
    height: positionGd.height
  };
}

//this function is necessary since the globe is scaled up
//and the z axis is not 'up' the y axis is
//takes in degrees, ht is km
function latLngHtToScreenCoords( latLngHt ) {
  const r = EARTH_RADIUS_SIM * (1 + latLngHt.height / EARTH_RADIUS_KM);
  const latRad = latLngHt.latitude * Math.PI / 180;
  const lonRad = latLngHt.longitude * Math.PI / 180;


  const x = r * Math.cos(latRad) * Math.cos(lonRad);
  const y = r * Math.cos(latRad) * Math.sin(lonRad);
  const z = r * Math.sin(latRad);

  return [x, z, -y];
}

function screenCoordsToLatLngHt( screenCoords ) {
  const x = screenCoords[0];
  const y = -screenCoords[2];
  const z = screenCoords[1];

  const r = Math.sqrt(x * x + y * y + z * z);
  const latRad = Math.asin(z / r);
  const lonRad = Math.atan2(y, x);

  const lat = latRad * 180 / Math.PI;
  const lon = lonRad * 180 / Math.PI;

  return {
    latitude: lat,
    longitude: lon,
    height: r - EARTH_RADIUS_SIM
  };
}

//calculate satellite passes over a location
function predictPasses(object, latitude, longitude, startDate, durationHours = 24, stepMinutes = 1) {
  const satrec = satlib.twoline2satrec(object.line1, object.line2);
  const observerGd = {
    latitude: satlib.degreesToRadians(latitude),
    longitude: satlib.degreesToRadians(longitude),
    height: 0,
  };
  const step = stepMinutes * 60 * 1000;
  const end = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);
  const passes = [];
  let inPass = false;
  let passStart = null;
  let maxEl = -90;
  let maxTime = null;

  for (let t = new Date(startDate.getTime()); t <= end; t = new Date(t.getTime() + step)) {
    const pv = satlib.propagate(satrec, t);
    if (!pv.position) continue;
    const gmst = satlib.gstime(t);
    const ecf = satlib.eciToEcf(pv.position, gmst);
    const look = satlib.ecfToLookAngles(observerGd, ecf);
    const elev = radToDeg(look.elevation);

    if (elev > 0) {
      if (!inPass) {
        inPass = true;
        passStart = new Date(t);
        maxEl = elev;
        maxTime = new Date(t);
      } else if (elev > maxEl) {
        maxEl = elev;
        maxTime = new Date(t);
      }
    } else if (inPass) {
      passes.push({ start: passStart, end: new Date(t), maxElevation: maxEl, maxTime });
      inPass = false;
    }
  }

  if (inPass) {
    passes.push({ start: passStart, end, maxElevation: maxEl, maxTime });
  }

  return passes;
}

//============================== SUN UTILS =========================================//

function fractionOfYearCompleted(datestamp) {
  const year = datestamp.getUTCFullYear();
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const endOfYear = new Date(Date.UTC(year + 1, 0, 1));

  return (datestamp - startOfYear) / (endOfYear - startOfYear);
}

function fractionOfDayCompleted(datestamp) {
  const dayStart = new Date(datestamp);
  dayStart.setUTCHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

  return (datestamp - dayStart) / (dayEnd - dayStart);
}

//============================= OTHER UTILS ========================================//

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

function randomFromArr(arr, num) {
  const result = new Array(num);
  let len = arr.length;
  const taken = new Array(len);
  if (num > len) return arr;
  while (num--) {
    const x = Math.floor(Math.random() * len);
    result[num] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

export default zeroPad;

export {
  getObjLatLngHt,
  latLngHtToScreenCoords,
  roundToDecimal,
  zeroPad,
  capitalizeFirstLetter,
  fractionOfYearCompleted,
  fractionOfDayCompleted,
  screenCoordsToLatLngHt,
  randomFromArr,
  predictPasses
}