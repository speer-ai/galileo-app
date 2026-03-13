import DatePanel from './components/DatePanel'
import SelectedObjectInfoBox from './components/SelectedObjectInfoBox'
import ThreeCanvas from './components/ThreeCanvas'
import FPSMeter from './utils/fpsMeter'
import ControlPanel from './components/ControlPanel'
import SpeedIndicator from './components/SpeedIndicator'
import SearchBar from './components/SearchBar'
import MapView from './components/MapView'
import Load from './components/Load'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'

import load_data from './services/tle_fetch'
import { fetchWeatherGrid } from './services/weather_fetch'
import { fetchEarthquakes, fetchNaturalEvents } from './services/geo_events'
import load_settings from './settings/settings'

import { NONE_SELECTED, CATEGORY_LABELS } from './constants'

const App = () => {
  const [objects, setObjects] = useState()
  const [categories, setCategories] = useState({})
  const [sessionSettings, setSessionSettings] = useState(null)
  const [selectedIdx, setSelectedIdx] = useState(NONE_SELECTED)
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelTab, setPanelTab] = useState('satellites')
  const [simulatedDatestamp, setSimulatedDatestamp] = useState(null)
  const [speed, setSpeed] = useState(1)
  const [paused, setPaused] = useState(false)
  const [activeCategories, setActiveCategories] = useState(new Set(Object.keys(CATEGORY_LABELS)))
  const [weatherGrid, setWeatherGrid] = useState(null)
  const [earthquakes, setEarthquakes] = useState([])
  const [naturalEvents, setNaturalEvents] = useState([])
  const [mapViewOpen, setMapViewOpen] = useState(false)
  const [showGeoEvents, setShowGeoEvents] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const data = await load_data()
      console.log('Loaded', data.num_entries, 'satellites from', Object.keys(data.categories || {}).length, 'groups')
      setObjects(data.entries)
      setCategories(data.categories || {})
    }
    fetchData()
    setSimulatedDatestamp(new Date())
    setSessionSettings(load_settings())
  }, [])

  // Fetch weather grid
  useEffect(() => {
    fetchWeatherGrid()
      .then(grid => setWeatherGrid(grid))
      .catch(err => console.warn('Weather grid fetch failed:', err))
  }, [])

  // Fetch geo events
  useEffect(() => {
    fetchEarthquakes().then(setEarthquakes)
    fetchNaturalEvents().then(setNaturalEvents)
  }, [])

  const keyboardEventListener = (e) => {
    if (e.target.tagName === 'INPUT') return
    switch (e.key) {
      case 'ArrowUp':
        if (objects && selectedIdx < objects.length - 1)
          setSelectedIdx(selectedIdx + 1)
        break
      case 'ArrowDown':
        if (selectedIdx > 0)
          setSelectedIdx(selectedIdx - 1)
        break
      case 'Escape':
        if (mapViewOpen) setMapViewOpen(false)
        else if (panelOpen) setPanelOpen(false)
        else setSelectedIdx(NONE_SELECTED)
        break
      case ' ':
        setPaused(!paused)
        break
      case 'm':
        setMapViewOpen(!mapViewOpen)
        break
      default:
        break
    }
  }

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(sessionSettings))
  }, [sessionSettings])

  useEffect(() => {
    document.body.addEventListener('keydown', keyboardEventListener)
    return () => document.body.removeEventListener('keydown', keyboardEventListener)
  })

  function openPanel(tab) {
    setPanelTab(tab)
    setPanelOpen(true)
  }

  return (
    <div className="app-container">
      <Suspense fallback={<Load />}>
        {objects && sessionSettings && simulatedDatestamp && (
          <ThreeCanvas
            objects={objects}
            simulatedDatestamp={simulatedDatestamp}
            selectedIdx={selectedIdx}
            setSelectedHandler={setSelectedIdx}
            sessionSettings={sessionSettings}
            activeCategories={activeCategories}
            weatherGrid={weatherGrid}
            earthquakes={showGeoEvents ? earthquakes : []}
            naturalEvents={showGeoEvents ? naturalEvents : []}
          />
        )}
      </Suspense>

      {/* Top bar */}
      <div className="top-bar">
        <div className="top-bar-left">
          <h1 className="galileoFont app-title">SPEER SPACE</h1>
          {objects && (
            <SearchBar objects={objects} setSelectedIdx={setSelectedIdx} activeCategories={activeCategories} />
          )}
          {objects && (
            <div className="sat-count-badge">
              {objects.filter(o => activeCategories.has(o.category)).length} satellites
            </div>
          )}
          {earthquakes.length > 0 && (
            <div className="sat-count-badge eq-badge">
              {earthquakes.length} earthquakes
            </div>
          )}
        </div>
        <div className="top-bar-right">
          <button className={`nav-btn ${mapViewOpen ? 'active' : ''}`} onClick={() => setMapViewOpen(!mapViewOpen)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16"/></svg>
            <span>Map</span>
          </button>
          <button className={`nav-btn ${showGeoEvents ? 'active' : ''}`} onClick={() => setShowGeoEvents(!showGeoEvents)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>Events</span>
          </button>
          <button className={`nav-btn ${panelOpen && panelTab === 'satellites' ? 'active' : ''}`} onClick={() => openPanel('satellites')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
            <span>Satellites</span>
          </button>
          <button className={`nav-btn ${panelOpen && panelTab === 'weather' ? 'active' : ''}`} onClick={() => openPanel('weather')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
            <span>Weather</span>
          </button>
          <button className={`nav-btn ${panelOpen && panelTab === 'settings' ? 'active' : ''}`} onClick={() => openPanel('settings')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span>Settings</span>
          </button>
          <button className={`nav-btn ${panelOpen && panelTab === 'about' ? 'active' : ''}`} onClick={() => openPanel('about')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            <span>About</span>
          </button>
        </div>
      </div>

      {/* Speed indicator */}
      {sessionSettings && (
        <SpeedIndicator speed={speed} paused={paused} sessionSettings={sessionSettings} />
      )}

      {/* Selected satellite info */}
      {selectedIdx !== NONE_SELECTED && objects && (
        <SelectedObjectInfoBox
          setSelectedIdx={setSelectedIdx}
          object={objects[selectedIdx]}
          simulatedDatestamp={simulatedDatestamp}
          sessionSettings={sessionSettings}
        />
      )}

      {/* Time controls */}
      {simulatedDatestamp && sessionSettings && (
        <DatePanel
          simulatedDatestamp={simulatedDatestamp}
          setSimulatedDatestamp={setSimulatedDatestamp}
          speed={speed}
          setSpeed={setSpeed}
          paused={paused}
          setPaused={setPaused}
          sessionSettings={sessionSettings}
        />
      )}

      {/* Control panel */}
      <ControlPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        initialTab={panelTab}
        sessionSettings={sessionSettings}
        setSessionSettings={setSessionSettings}
        activeCategories={activeCategories}
        setActiveCategories={setActiveCategories}
        categories={categories}
        objectCount={objects?.length || 0}
        weatherGrid={weatherGrid}
      />

      {/* Map View */}
      <MapView
        isOpen={mapViewOpen}
        onClose={() => setMapViewOpen(false)}
        objects={objects}
        activeCategories={activeCategories}
        simulatedDatestamp={simulatedDatestamp}
        selectedIdx={selectedIdx}
        setSelectedIdx={setSelectedIdx}
        sessionSettings={sessionSettings}
        earthquakes={earthquakes}
        naturalEvents={naturalEvents}
      />

      {/* FPS meter */}
      {sessionSettings && sessionSettings.overlay.showFPSGraph && (
        <div className="absolute left-0 top-0">
          <FPSMeter />
        </div>
      )}
    </div>
  )
}

export default App
