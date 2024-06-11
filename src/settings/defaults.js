const defaultSettings = {
    'general': {
        'latitude': 0,
        'longitude': 0,
    },
    'overlay': {
        'showFPSGraph': false,
        'alwaysShowSpeed': false,
    },
    'renderer': {
        'cameraFOV': 45,
        'showAxes': false,
        'updatesPerSecond': 100,
    },
    'scene': {
        'showStars': true,
        'animateClouds': true,
        'showCenterLine': true,
        'showOrbits': true,
        'animateClouds': true,
        'cloudOpacity': 0.6,
        'doDayLightCycle': true,
    },
    'orbit': {
        'showOrbits': true,
        'orbitSteps': 200,
        'orbitDiffMillis': 1000 * 30,
    },
    'hexasphere': {
        'showHexasphere': false,
        'subdivisions': 10,
        'tileSize': 0.95,
    }
}

export default defaultSettings;