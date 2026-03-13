import { useState, useEffect, useRef, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import * as utils from '../utils/utils'
import { CATEGORY_COLORS } from '../constants'
import { getMagnitudeColor } from '../services/geo_events'

const MapView = ({
  isOpen,
  onClose,
  objects,
  activeCategories,
  simulatedDatestamp,
  selectedIdx,
  setSelectedIdx,
  sessionSettings,
  earthquakes,
  naturalEvents,
}) => {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const satLayerRef = useRef(null)
  const eqLayerRef = useRef(null)
  const eventLayerRef = useRef(null)
  const observerMarkerRef = useRef(null)
  const updateIntervalRef = useRef(null)

  const [showSatellites, setShowSatellites] = useState(true)
  const [showEarthquakes, setShowEarthquakes] = useState(true)
  const [showEvents, setShowEvents] = useState(true)

  // Initialize map
  useEffect(() => {
    if (!isOpen || !mapRef.current || mapInstance.current) return

    const lat = sessionSettings?.general?.latitude || 0
    const lon = sessionSettings?.general?.longitude || 0

    const map = L.map(mapRef.current, {
      center: [lat, lon],
      zoom: 3,
      zoomControl: true,
    })

    // Dark tile layer
    const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO',
      maxZoom: 19,
    })

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri',
      maxZoom: 18,
    })

    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    })

    const terrainLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; Stamen',
      maxZoom: 18,
    })

    darkLayer.addTo(map)

    L.control.layers({
      'Dark': darkLayer,
      'Satellite': satelliteLayer,
      'Street': streetLayer,
      'Terrain': terrainLayer,
    }, {}, { position: 'topright' }).addTo(map)

    // Create layer groups
    satLayerRef.current = L.layerGroup().addTo(map)
    eqLayerRef.current = L.layerGroup().addTo(map)
    eventLayerRef.current = L.layerGroup().addTo(map)

    // Observer marker
    if (lat !== 0 || lon !== 0) {
      observerMarkerRef.current = L.circleMarker([lat, lon], {
        radius: 8,
        color: '#ff00ff',
        fillColor: '#ff00ff',
        fillOpacity: 0.6,
        weight: 2,
      }).addTo(map).bindPopup(`<strong>Observer</strong><br/>${lat.toFixed(3)}, ${lon.toFixed(3)}`)
    }

    mapInstance.current = map

    // Center on selected satellite if any
    if (selectedIdx >= 0 && objects?.[selectedIdx]) {
      try {
        const pos = utils.getObjLatLngHt(objects[selectedIdx], simulatedDatestamp)
        if (pos) map.setView([pos.latitude, pos.longitude], 5)
      } catch (e) { /* ignore */ }
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [isOpen])

  // Update earthquake markers
  useEffect(() => {
    if (!mapInstance.current || !eqLayerRef.current) return
    eqLayerRef.current.clearLayers()

    if (!showEarthquakes || !earthquakes) return

    earthquakes.forEach(eq => {
      const color = getMagnitudeColor(eq.magnitude)
      const radius = Math.pow(2, eq.magnitude) * 500
      L.circle([eq.lat, eq.lon], {
        radius,
        color,
        fillColor: color,
        fillOpacity: 0.35,
        weight: 1,
      }).addTo(eqLayerRef.current).bindPopup(
        `<strong>M${eq.magnitude} Earthquake</strong><br/>${eq.place}<br/>Depth: ${utils.roundToDecimal(eq.depth, 1)} km<br/>${new Date(eq.time).toUTCString()}${eq.tsunami ? '<br/><span style="color:red">Tsunami warning</span>' : ''}`
      )
    })
  }, [earthquakes, showEarthquakes, isOpen])

  // Update natural event markers
  useEffect(() => {
    if (!mapInstance.current || !eventLayerRef.current) return
    eventLayerRef.current.clearLayers()

    if (!showEvents || !naturalEvents) return

    naturalEvents.forEach(ev => {
      L.circleMarker([ev.lat, ev.lon], {
        radius: 6,
        color: '#ffaa00',
        fillColor: '#ffaa00',
        fillOpacity: 0.7,
        weight: 2,
      }).addTo(eventLayerRef.current).bindPopup(
        `<strong>${ev.title}</strong><br/>Category: ${ev.category}${ev.date ? '<br/>' + new Date(ev.date).toLocaleDateString() : ''}`
      )
    })
  }, [naturalEvents, showEvents, isOpen])

  // Update satellite positions periodically
  useEffect(() => {
    if (!mapInstance.current || !satLayerRef.current) return
    if (updateIntervalRef.current) clearInterval(updateIntervalRef.current)

    const updateSatellites = () => {
      if (!satLayerRef.current || !showSatellites) return
      satLayerRef.current.clearLayers()

      if (!objects || !activeCategories) return

      const bounds = mapInstance.current.getBounds()
      let count = 0

      for (let i = 0; i < objects.length && count < 300; i++) {
        const obj = objects[i]
        if (!activeCategories.has(obj.category)) continue

        try {
          const pos = utils.getObjLatLngHt(obj, new Date())
          if (!pos || !pos.latitude || !pos.longitude) continue

          // Only show satellites in the current view bounds (with some padding)
          const inView = bounds.contains([pos.latitude, pos.longitude])
          if (!inView && count > 50) continue

          const isSelected = i === selectedIdx
          const color = isSelected ? '#ff0040' : (CATEGORY_COLORS[obj.category] || '#ffffff')

          L.circleMarker([pos.latitude, pos.longitude], {
            radius: isSelected ? 7 : 4,
            color,
            fillColor: color,
            fillOpacity: isSelected ? 0.9 : 0.6,
            weight: isSelected ? 3 : 1,
          }).addTo(satLayerRef.current)
            .bindPopup(`<strong>${obj.name}</strong><br/>Category: ${obj.category}<br/>Alt: ${utils.roundToDecimal(pos.height, 1)} km`)
            .on('click', () => setSelectedIdx(i))

          count++
        } catch (e) { /* skip */ }
      }
    }

    updateSatellites()
    updateIntervalRef.current = setInterval(updateSatellites, 3000)

    return () => {
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current)
    }
  }, [objects, activeCategories, selectedIdx, showSatellites, isOpen])

  if (!isOpen) return null

  return (
    <div className="map-view-overlay">
      <div className="map-view-container">
        <div className="map-view-header">
          <h2 className="map-view-title">MAP VIEW</h2>
          <div className="map-view-toggles">
            <label className="map-toggle">
              <input type="checkbox" checked={showSatellites} onChange={e => setShowSatellites(e.target.checked)} />
              <span>Satellites</span>
            </label>
            <label className="map-toggle">
              <input type="checkbox" checked={showEarthquakes} onChange={e => setShowEarthquakes(e.target.checked)} />
              <span>Earthquakes</span>
            </label>
            <label className="map-toggle">
              <input type="checkbox" checked={showEvents} onChange={e => setShowEvents(e.target.checked)} />
              <span>Events</span>
            </label>
          </div>
          <button className="map-view-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="map-view-body">
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  )
}

export default MapView
