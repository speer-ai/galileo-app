
const SATELLITE_GROUPS = [
  { id: 'stations', name: 'Space Stations', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle' },
  { id: 'visual', name: 'Brightest', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=tle' },
  { id: 'weather', name: 'Weather', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=weather&FORMAT=tle' },
  { id: 'gps-ops', name: 'GPS', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=gps-ops&FORMAT=tle' },
  { id: 'galileo', name: 'Galileo', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=galileo&FORMAT=tle' },
  { id: 'science', name: 'Science', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=science&FORMAT=tle' },
  { id: 'resource', name: 'Earth Resources', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=resource&FORMAT=tle' },
  { id: 'amateur', name: 'Amateur Radio', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=amateur&FORMAT=tle' },
]

async function fetch_group(group) {
  try {
    const response = await fetch(group.url)
    if (!response.ok) throw new Error(`Failed to fetch ${group.name}`)
    const raw = await response.text()
    return { raw, group }
  } catch (error) {
    console.warn(`Failed to fetch ${group.name}:`, error)
    return { raw: null, group }
  }
}

function parse_tle(raw, category) {
  if (!raw) return []
  const entries = []
  const lines = raw.split('\n').filter(l => l.trim().length)
  for (let i = 0; i < lines.length; i += 3) {
    if (lines[i + 1] && lines[i + 2]) {
      const line2 = lines[i + 2].trim()
      const norad = line2.substring(2, 7).trim()
      entries.push({
        name: lines[i].trim(),
        line1: lines[i + 1].trim(),
        line2: line2,
        norad,
        category,
      })
    }
  }
  return entries
}

function deduplicate(entries) {
  const seen = new Map()
  for (const entry of entries) {
    if (!seen.has(entry.norad)) {
      seen.set(entry.norad, entry)
    }
  }
  const deduped = Array.from(seen.values())
  return deduped.map((e, i) => ({ ...e, id: i }))
}

async function load_data() {
  const cacheKey = 'tle_data_v2'
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    try {
      const parsed = JSON.parse(cached)
      if (Date.now() - new Date(parsed.retrieval_date).getTime() < 3600 * 1000) {
        return parsed
      }
    } catch (e) { /* ignore parse errors */ }
  }

  const results = await Promise.all(SATELLITE_GROUPS.map(g => fetch_group(g)))

  let allEntries = []
  const categories = {}
  for (const { raw, group } of results) {
    const entries = parse_tle(raw, group.id)
    allEntries.push(...entries)
    categories[group.id] = { name: group.name, count: entries.length }
  }

  const entries = deduplicate(allEntries)

  const data = {
    retrieval_date: new Date().toISOString(),
    num_entries: entries.length,
    entries,
    categories,
  }

  try {
    localStorage.setItem(cacheKey, JSON.stringify(data))
  } catch (e) {
    console.warn('Failed to cache TLE data:', e)
  }

  return data
}

export { SATELLITE_GROUPS }
export default load_data
