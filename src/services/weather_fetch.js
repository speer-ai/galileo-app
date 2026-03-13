
const GRID_CACHE_KEY = 'weather_grid_v1'
const LOCATION_CACHE_KEY = 'weather_location_v1'
const GRID_CACHE_DURATION = 30 * 60 * 1000
const LOCATION_CACHE_DURATION = 15 * 60 * 1000

async function fetchLocationWeather(lat, lon) {
  const cacheKey = `${LOCATION_CACHE_KEY}_${Math.round(lat)}_${Math.round(lon)}`
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    try {
      const parsed = JSON.parse(cached)
      if (Date.now() - parsed.timestamp < LOCATION_CACHE_DURATION) return parsed.data
    } catch (e) { /* ignore */ }
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m,pressure_msl,uv_index,weather_code&hourly=temperature_2m,precipitation_probability,cloud_cover,wind_speed_10m,weather_code&forecast_days=1&timezone=auto`

  const response = await fetch(url)
  if (!response.ok) throw new Error('Weather fetch failed')
  const data = await response.json()

  try {
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }))
  } catch (e) { /* ignore */ }

  return data
}

function buildGrid() {
  const lats = []
  const lons = []
  for (let lat = -80; lat <= 80; lat += 10) {
    for (let lon = -180; lon < 180; lon += 10) {
      lats.push(lat)
      lons.push(lon)
    }
  }
  return { lats, lons }
}

async function fetchWeatherGrid() {
  const cached = localStorage.getItem(GRID_CACHE_KEY)
  if (cached) {
    try {
      const parsed = JSON.parse(cached)
      if (Date.now() - parsed.timestamp < GRID_CACHE_DURATION) return parsed.data
    } catch (e) { /* ignore */ }
  }

  const { lats, lons } = buildGrid()
  const batchSize = 40
  const allResults = []

  for (let i = 0; i < lats.length; i += batchSize) {
    const batchLats = lats.slice(i, i + batchSize).join(',')
    const batchLons = lons.slice(i, i + batchSize).join(',')
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${batchLats}&longitude=${batchLons}&current=temperature_2m,cloud_cover,precipitation,wind_speed_10m,wind_direction_10m`

    try {
      const response = await fetch(url)
      if (!response.ok) continue
      const data = await response.json()
      if (Array.isArray(data)) {
        allResults.push(...data)
      } else {
        allResults.push(data)
      }
    } catch (e) {
      console.warn('Weather grid batch failed:', e)
    }
  }

  const grid = allResults.map(r => ({
    lat: r.latitude,
    lon: r.longitude,
    temperature: r.current?.temperature_2m ?? null,
    cloudCover: r.current?.cloud_cover ?? null,
    precipitation: r.current?.precipitation ?? null,
    windSpeed: r.current?.wind_speed_10m ?? null,
    windDirection: r.current?.wind_direction_10m ?? null,
  })).filter(g => g.temperature !== null)

  try {
    localStorage.setItem(GRID_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: grid }))
  } catch (e) { /* ignore */ }

  return grid
}

function getWeatherDescription(code) {
  const descriptions = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Drizzle',
    55: 'Dense drizzle', 56: 'Freezing drizzle', 57: 'Dense freezing drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    66: 'Freezing rain', 67: 'Heavy freezing rain',
    71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow', 77: 'Snow grains',
    80: 'Slight showers', 81: 'Moderate showers', 82: 'Violent showers',
    85: 'Slight snow showers', 86: 'Heavy snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Severe thunderstorm',
  }
  return descriptions[code] || 'Unknown'
}

function getWeatherIcon(code) {
  if (code === 0) return 'sun'
  if (code <= 3) return 'cloud-sun'
  if (code <= 48) return 'fog'
  if (code <= 57) return 'drizzle'
  if (code <= 67) return 'rain'
  if (code <= 77) return 'snow'
  if (code <= 82) return 'showers'
  if (code <= 86) return 'snow'
  return 'storm'
}

// Generate a canvas-based weather texture for globe overlay
function generateWeatherTexture(grid, layer, width = 360, height = 180) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, width, height)

  if (!grid || grid.length === 0) return canvas

  // Build a lookup for fast grid access
  const gridMap = new Map()
  for (const point of grid) {
    const key = `${Math.round(point.lat)}_${Math.round(point.lon)}`
    gridMap.set(key, point)
  }

  const imageData = ctx.createImageData(width, height)
  const data = imageData.data

  for (let py = 0; py < height; py++) {
    const lat = 90 - (py / height) * 180
    for (let px = 0; px < width; px++) {
      const lon = (px / width) * 360 - 180

      // Find surrounding grid points and interpolate (IDW)
      let weightSum = 0
      let valueSum = 0
      let count = 0

      for (const point of grid) {
        const dlat = lat - point.lat
        const dlon = lon - point.lon
        const dist = Math.sqrt(dlat * dlat + dlon * dlon)
        if (dist < 0.1) {
          valueSum = getValue(point, layer)
          weightSum = 1
          count = 1
          break
        }
        if (dist < 25) {
          const w = 1 / (dist * dist)
          valueSum += getValue(point, layer) * w
          weightSum += w
          count++
        }
      }

      if (count === 0 || weightSum === 0) continue
      const value = valueSum / weightSum

      const idx = (py * width + px) * 4
      const color = getLayerColor(value, layer)
      data[idx] = color[0]
      data[idx + 1] = color[1]
      data[idx + 2] = color[2]
      data[idx + 3] = color[3]
    }
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas
}

function getValue(point, layer) {
  switch (layer) {
    case 'temperature': return point.temperature
    case 'clouds': return point.cloudCover
    case 'precipitation': return point.precipitation
    case 'wind': return point.windSpeed
    default: return 0
  }
}

function getLayerColor(value, layer) {
  switch (layer) {
    case 'temperature': {
      const t = Math.max(-40, Math.min(45, value))
      const norm = (t + 40) / 85
      if (norm < 0.25) return [0, 0, Math.round(100 + norm * 4 * 155), Math.round(120 * (0.3 + norm))]
      if (norm < 0.5) return [0, Math.round((norm - 0.25) * 4 * 200), 255, Math.round(100 * (0.4 + norm))]
      if (norm < 0.75) return [Math.round((norm - 0.5) * 4 * 255), 200, Math.round(255 - (norm - 0.5) * 4 * 200), Math.round(100 * (0.4 + norm * 0.5))]
      return [255, Math.round(200 - (norm - 0.75) * 4 * 200), 0, Math.round(80 + norm * 40)]
    }
    case 'clouds': {
      const alpha = Math.round((value / 100) * 160)
      return [255, 255, 255, alpha]
    }
    case 'precipitation': {
      if (value < 0.1) return [0, 0, 0, 0]
      const intensity = Math.min(1, value / 10)
      return [0, 80, Math.round(180 + intensity * 75), Math.round(40 + intensity * 140)]
    }
    case 'wind': {
      const speed = Math.min(100, value)
      const norm = speed / 100
      if (norm < 0.3) return [100, 200, 100, Math.round(norm * 3 * 80)]
      if (norm < 0.6) return [200, 200, 0, Math.round(40 + norm * 120)]
      return [200, 50, 50, Math.round(60 + norm * 120)]
    }
    default: return [0, 0, 0, 0]
  }
}

export {
  fetchLocationWeather,
  fetchWeatherGrid,
  generateWeatherTexture,
  getWeatherDescription,
  getWeatherIcon,
}
