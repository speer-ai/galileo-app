
const EARTHQUAKE_CACHE_KEY = 'earthquake_data_v1'
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes

// USGS Earthquake API - significant earthquakes in the past week
async function fetchEarthquakes() {
  const cached = localStorage.getItem(EARTHQUAKE_CACHE_KEY)
  if (cached) {
    try {
      const parsed = JSON.parse(cached)
      if (Date.now() - parsed.timestamp < CACHE_DURATION) return parsed.data
    } catch (e) { /* ignore */ }
  }

  try {
    // Fetch M2.5+ earthquakes from the last 7 days
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson')
    if (!response.ok) throw new Error('USGS fetch failed')
    const geojson = await response.json()

    const earthquakes = geojson.features.map(f => ({
      id: f.id,
      magnitude: f.properties.mag,
      place: f.properties.place,
      time: f.properties.time,
      lat: f.geometry.coordinates[1],
      lon: f.geometry.coordinates[0],
      depth: f.geometry.coordinates[2],
      type: f.properties.type,
      tsunami: f.properties.tsunami,
      alert: f.properties.alert,
      url: f.properties.url,
    }))

    localStorage.setItem(EARTHQUAKE_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: earthquakes }))
    return earthquakes
  } catch (e) {
    console.warn('Earthquake fetch failed:', e)
    return []
  }
}

// EONET - NASA Earth Observatory Natural Events
async function fetchNaturalEvents() {
  try {
    const response = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=50')
    if (!response.ok) throw new Error('EONET fetch failed')
    const data = await response.json()

    return data.events.map(e => ({
      id: e.id,
      title: e.title,
      category: e.categories?.[0]?.title || 'Unknown',
      categoryId: e.categories?.[0]?.id || '',
      lat: e.geometry?.[0]?.coordinates?.[1],
      lon: e.geometry?.[0]?.coordinates?.[0],
      date: e.geometry?.[0]?.date,
      source: e.sources?.[0]?.url,
    })).filter(e => e.lat != null && e.lon != null)
  } catch (e) {
    console.warn('Natural events fetch failed:', e)
    return []
  }
}

function getMagnitudeColor(mag) {
  if (mag >= 7) return '#ff0000'
  if (mag >= 6) return '#ff4400'
  if (mag >= 5) return '#ff8800'
  if (mag >= 4) return '#ffcc00'
  if (mag >= 3) return '#ffee00'
  return '#88ff00'
}

function getMagnitudeSize(mag) {
  return Math.max(0.3, Math.min(3, (mag - 2) * 0.5))
}

function getEventColor(categoryId) {
  const colors = {
    'wildfires': '#ff6600',
    'volcanoes': '#ff0000',
    'severeStorms': '#9933ff',
    'seaLakeIce': '#00ccff',
    'floods': '#0066ff',
    'drought': '#cc6600',
    'dustHaze': '#999966',
    'landslides': '#996633',
    'snow': '#ccccff',
    'tempExtremes': '#ff3366',
    'waterColor': '#00cc99',
  }
  return colors[categoryId] || '#ffaa00'
}

export {
  fetchEarthquakes,
  fetchNaturalEvents,
  getMagnitudeColor,
  getMagnitudeSize,
  getEventColor,
}
