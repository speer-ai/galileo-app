import { useState, useEffect } from 'react'
import { capitalizeFirstLetter } from '../utils/utils'
import { CATEGORY_COLORS, CATEGORY_LABELS, WEATHER_LAYERS } from '../constants'
import { fetchLocationWeather, getWeatherDescription } from '../services/weather_fetch'

function getBrowserLocation(cb) {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(
    (pos) => cb({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
    () => {}
  )
}

const tabs = [
  { id: 'satellites', label: 'Satellites' },
  { id: 'weather', label: 'Weather' },
  { id: 'settings', label: 'Settings' },
  { id: 'about', label: 'About' },
]

const ControlPanel = ({
  isOpen,
  onClose,
  initialTab,
  sessionSettings,
  setSessionSettings,
  activeCategories,
  setActiveCategories,
  categories,
  objectCount,
  weatherGrid,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'satellites')
  const [locationWeather, setLocationWeather] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    if (activeTab === 'weather' && !locationWeather && sessionSettings?.general) {
      setWeatherLoading(true)
      fetchLocationWeather(sessionSettings.general.latitude, sessionSettings.general.longitude)
        .then(data => setLocationWeather(data))
        .catch(() => {})
        .finally(() => setWeatherLoading(false))
    }
  }, [activeTab, sessionSettings?.general?.latitude, sessionSettings?.general?.longitude])

  if (!isOpen) return null

  function handleCategoryToggle(catId) {
    const next = new Set(activeCategories)
    if (next.has(catId)) next.delete(catId)
    else next.add(catId)
    setActiveCategories(next)
  }

  function handleWeatherLayerToggle(layer) {
    const newSettings = { ...sessionSettings }
    newSettings.weather = { ...newSettings.weather }
    const key = `show${capitalizeFirstLetter(layer)}`
    newSettings.weather[key] = !newSettings.weather[key]
    setSessionSettings(newSettings)
  }

  function handleUseBrowserLocation() {
    getBrowserLocation(({ latitude, longitude }) => {
      const newSettings = { ...sessionSettings }
      newSettings.general = { ...newSettings.general, latitude, longitude }
      setSessionSettings(newSettings)
      setLocationWeather(null)
    })
  }

  // Count visible satellites from actual objects to account for deduplication
  const visibleCount = activeCategories && categories ?
    objectCount - Array.from(Object.keys(categories)).filter(cat => !activeCategories.has(cat)).reduce((sum, cat) => sum + (categories[cat]?.count || 0), 0) :
    objectCount

  return (
    <div className="panel-overlay">
      <div className="panel-container">
        {/* Close button */}
        <button className="panel-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Tabs */}
        <div className="panel-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`panel-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="panel-content">
          {/* SATELLITES TAB */}
          {activeTab === 'satellites' && (
            <div>
              <div className="panel-section">
                <h3 className="panel-section-title">Satellite Categories</h3>
                <p className="panel-subtitle">{visibleCount} of {objectCount} satellites visible</p>
                <div className="category-grid">
                  {Object.keys(CATEGORY_LABELS).map(catId => {
                    const isActive = activeCategories?.has(catId)
                    const count = categories?.[catId]?.count || 0
                    if (count === 0) return null
                    return (
                      <button
                        key={catId}
                        className={`category-chip ${isActive ? 'active' : ''}`}
                        style={{
                          borderColor: CATEGORY_COLORS[catId],
                          backgroundColor: isActive ? CATEGORY_COLORS[catId] + '25' : 'transparent',
                        }}
                        onClick={() => handleCategoryToggle(catId)}
                      >
                        <span className="category-dot" style={{ backgroundColor: CATEGORY_COLORS[catId] }} />
                        <span className="category-name">{CATEGORY_LABELS[catId]}</span>
                        <span className="category-count">{count}</span>
                      </button>
                    )
                  })}
                </div>
                <div className="category-actions">
                  <button className="btn-small" onClick={() => setActiveCategories(new Set(Object.keys(CATEGORY_LABELS)))}>
                    Select All
                  </button>
                  <button className="btn-small" onClick={() => setActiveCategories(new Set())}>
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* WEATHER TAB */}
          {activeTab === 'weather' && (
            <div>
              <div className="panel-section">
                <h3 className="panel-section-title">Globe Layers</h3>
                <div className="weather-layers">
                  {Object.entries(WEATHER_LAYERS).map(([key, info]) => {
                    const settingKey = `show${capitalizeFirstLetter(key)}`
                    const isActive = sessionSettings.weather?.[settingKey]
                    return (
                      <button
                        key={key}
                        className={`weather-layer-btn ${isActive ? 'active' : ''}`}
                        onClick={() => handleWeatherLayerToggle(key)}
                      >
                        <span className="weather-layer-name">{info.name}</span>
                        <span className="weather-layer-unit">{info.unit}</span>
                      </button>
                    )
                  })}
                </div>
                <div className="setting-row">
                  <label className="setting-label">Overlay Opacity</label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={sessionSettings.weather?.overlayOpacity ?? 0.6}
                    onChange={(e) => {
                      const newSettings = { ...sessionSettings }
                      newSettings.weather = { ...newSettings.weather, overlayOpacity: parseFloat(e.target.value) }
                      setSessionSettings(newSettings)
                    }}
                    className="setting-range"
                  />
                  <span className="setting-value">{((sessionSettings.weather?.overlayOpacity ?? 0.6) * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="panel-section">
                <h3 className="panel-section-title">
                  Observer Weather
                  <span className="panel-subtitle-inline">
                    {sessionSettings.general.latitude.toFixed(1)}, {sessionSettings.general.longitude.toFixed(1)}
                  </span>
                </h3>
                {weatherLoading && <p className="text-slate-400 text-sm">Loading weather data...</p>}
                {locationWeather && locationWeather.current && (
                  <div className="weather-current">
                    <div className="weather-main">
                      <span className="weather-temp">{locationWeather.current.temperature_2m}°C</span>
                      <span className="weather-desc">{getWeatherDescription(locationWeather.current.weather_code)}</span>
                    </div>
                    <div className="weather-details">
                      <div className="weather-detail">
                        <span className="weather-detail-label">Feels Like</span>
                        <span className="weather-detail-value">{locationWeather.current.apparent_temperature}°C</span>
                      </div>
                      <div className="weather-detail">
                        <span className="weather-detail-label">Humidity</span>
                        <span className="weather-detail-value">{locationWeather.current.relative_humidity_2m}%</span>
                      </div>
                      <div className="weather-detail">
                        <span className="weather-detail-label">Wind</span>
                        <span className="weather-detail-value">{locationWeather.current.wind_speed_10m} km/h</span>
                      </div>
                      <div className="weather-detail">
                        <span className="weather-detail-label">Cloud Cover</span>
                        <span className="weather-detail-value">{locationWeather.current.cloud_cover}%</span>
                      </div>
                      <div className="weather-detail">
                        <span className="weather-detail-label">Precipitation</span>
                        <span className="weather-detail-value">{locationWeather.current.precipitation} mm</span>
                      </div>
                      <div className="weather-detail">
                        <span className="weather-detail-label">Pressure</span>
                        <span className="weather-detail-value">{locationWeather.current.pressure_msl} hPa</span>
                      </div>
                      <div className="weather-detail">
                        <span className="weather-detail-label">UV Index</span>
                        <span className="weather-detail-value">{locationWeather.current.uv_index}</span>
                      </div>
                      <div className="weather-detail">
                        <span className="weather-detail-label">Wind Dir</span>
                        <span className="weather-detail-value">{locationWeather.current.wind_direction_10m}°</span>
                      </div>
                    </div>

                    {locationWeather.hourly && (
                      <div className="weather-forecast">
                        <h4 className="weather-forecast-title">Next 12 Hours</h4>
                        <div className="weather-forecast-scroll">
                          {locationWeather.hourly.time.slice(0, 12).map((time, i) => (
                            <div key={i} className="weather-forecast-item">
                              <span className="forecast-time">{new Date(time).getHours()}:00</span>
                              <span className="forecast-temp">{locationWeather.hourly.temperature_2m[i]}°</span>
                              <span className="forecast-cloud">{locationWeather.hourly.cloud_cover[i]}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <button className="btn-small mt-2" onClick={handleUseBrowserLocation}>
                  Use My Location
                </button>
                <button className="btn-small mt-2" onClick={() => {
                  setLocationWeather(null)
                  setWeatherLoading(true)
                  fetchLocationWeather(sessionSettings.general.latitude, sessionSettings.general.longitude)
                    .then(data => setLocationWeather(data))
                    .catch(() => {})
                    .finally(() => setWeatherLoading(false))
                }}>
                  Refresh
                </button>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div>
              {Object.keys(sessionSettings).filter(cat => cat !== 'weather').map((category, idx) => (
                <div key={idx} className="panel-section">
                  <h3 className="panel-section-title">{capitalizeFirstLetter(category)}</h3>
                  {Object.keys(sessionSettings[category]).map((setting) => (
                    <div key={setting} className="setting-row">
                      <label htmlFor={setting} className="setting-label">{setting}</label>
                      {typeof sessionSettings[category][setting] === 'boolean' && (
                        <label className="toggle-switch">
                          <input
                            id={setting}
                            type="checkbox"
                            checked={sessionSettings[category][setting]}
                            onChange={(e) => {
                              let newSettings = { ...sessionSettings }
                              newSettings[category] = { ...newSettings[category], [setting]: e.target.checked }
                              setSessionSettings(newSettings)
                            }}
                          />
                          <span className="toggle-slider" />
                        </label>
                      )}
                      {typeof sessionSettings[category][setting] === 'number' && (
                        <input
                          id={setting}
                          type="number"
                          value={sessionSettings[category][setting]}
                          onChange={(e) => {
                            let newSettings = { ...sessionSettings }
                            newSettings[category] = { ...newSettings[category], [setting]: parseFloat(e.target.value) }
                            setSessionSettings(newSettings)
                          }}
                          className="setting-number"
                        />
                      )}
                    </div>
                  ))}
                  {category === 'general' && (
                    <button className="btn-small" onClick={handleUseBrowserLocation}>
                      Use Browser Location
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <div>
              <div className="panel-section">
                <h2 className="galileoFont text-4xl text-white text-center mb-4">SPEER SPACE</h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">
                  Speer Space is a real-time satellite tracker displaying live orbital data from CelesTrak
                  with SGP4 propagation via <a className="text-blue-400 hover:text-blue-300" href="https://github.com/shashwatak/satellite-js">satellite.js</a>.
                </p>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">
                  Built with <a className="text-blue-400 hover:text-blue-300" href="https://github.com/pmndrs/react-three-fiber">React Three Fiber</a> for
                  3D rendering and real-time weather data from <a className="text-blue-400 hover:text-blue-300" href="https://open-meteo.com/">Open-Meteo</a>.
                </p>
              </div>
              <div className="panel-section">
                <h3 className="panel-section-title">Keyboard Shortcuts</h3>
                <div className="shortcuts-grid">
                  {[
                    ['Space', 'Play / Pause'],
                    ['R', 'Reset to Now'],
                    ['\u2190', 'Slower'],
                    ['\u2192', 'Faster'],
                    ['\u2191', 'Next Satellite'],
                    ['\u2193', 'Prev Satellite'],
                    ['Esc', 'Deselect'],
                  ].map(([key, desc]) => (
                    <div key={key} className="shortcut-row">
                      <kbd className="shortcut-key">{key}</kbd>
                      <span className="shortcut-desc">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ControlPanel
