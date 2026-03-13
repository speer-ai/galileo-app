const NONE_SELECTED = -1
const SATELLITE_DEFAULT = 'white'
const SATELLITE_SELECTED = '#ff0040'
const ORBIT_DEFAULT = 'green'
const HEXASPHERE_DEFAULT = 'skyblue'
const OBSERVER_DEFAULT = 'magenta'

const CATEGORY_COLORS = {
  'stations': '#ff6b6b',
  'visual': '#ffd93d',
  'weather': '#6bcb77',
  'gps-ops': '#4d96ff',
  'galileo': '#9b59b6',
  'science': '#e67e22',
  'resource': '#1abc9c',
  'amateur': '#e74c3c',
  'starlink': '#95a5a6',
}

const CATEGORY_LABELS = {
  'stations': 'Space Stations',
  'visual': 'Brightest',
  'weather': 'Weather',
  'gps-ops': 'GPS',
  'galileo': 'Galileo',
  'science': 'Science',
  'resource': 'Earth Resources',
  'amateur': 'Amateur Radio',
  'starlink': 'Starlink',
}

const WEATHER_LAYERS = {
  temperature: { name: 'Temperature', unit: '°C' },
  clouds: { name: 'Cloud Cover', unit: '%' },
  precipitation: { name: 'Precipitation', unit: 'mm' },
  wind: { name: 'Wind Speed', unit: 'km/h' },
}

export {
  NONE_SELECTED,
  SATELLITE_DEFAULT,
  SATELLITE_SELECTED,
  ORBIT_DEFAULT,
  HEXASPHERE_DEFAULT,
  OBSERVER_DEFAULT,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  WEATHER_LAYERS,
}
