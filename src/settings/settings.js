import defaultSettings from "./defaults";

function load_settings() {
  const stored = localStorage.getItem('settings')
  if (!stored || stored === 'null' || stored === 'undefined') {
    localStorage.setItem('settings', JSON.stringify(defaultSettings))
    return { ...defaultSettings }
  }

  try {
    const parsed = JSON.parse(stored)
    // Merge with defaults to pick up new settings
    const merged = { ...defaultSettings }
    for (const category of Object.keys(defaultSettings)) {
      merged[category] = { ...defaultSettings[category], ...(parsed[category] || {}) }
    }
    return merged
  } catch (e) {
    localStorage.setItem('settings', JSON.stringify(defaultSettings))
    return { ...defaultSettings }
  }
}

export default load_settings
