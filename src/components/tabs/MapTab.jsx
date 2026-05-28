import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap, CircleMarker, Popup } from 'react-leaflet'
import { SITES_RAW } from "../../data/sites";
import L from 'leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Filter, ChevronDown, ChevronUp, Waves, Mountain, Anchor, Zap 
} from 'lucide-react'
import osmtogeojson from 'osmtogeojson'
import { topWaterbodies } from '../../data/waterbodyLookup'

// Fix for Leaflet default icons in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// --- CONSTANTS ---
const CENTER = [47.5, -120.5]
const INITIAL_ZOOM = 7
const TILE_SIZE = 0.5

const WDFW_WATERWAY_WHITELIST = [
  // RIVERS
  "Columbia River", "Snake River", "Yakima River", "Spokane River", "Wenatchee River", "Methow River", "Okanogan River", "Similkameen River",
  "Skagit River", "Sauk River", "Cascade River", "Stillaguamish River", "Snohomish River", "Skykomish River", "Snoqualmie River", "Cedar River",
  "Green River", "White River", "Puyallup River", "Nisqually River", "Deschutes River", "Chehalis River", "Humptulips River", "Hoh River",
  "Queets River", "Quinault River", "Elwha River", "Dungeness River", "Skokomish River", "Dosewallips River", "Duckabush River",
  "Cowlitz River", "Lewis River", "Kalama River", "Washougal River", "Wind River", "Klickitat River", "Naches River", "Tieton River",
  "Cle Elum River", "Teanaway River", "Entiat River", "Chelan River", "Stehekin River", "Twisp River", "Chewuch River",
  "Sanpoil River", "Kettle River", "Colville River", "Pend Oreille River", "Palouse River", "Tucannon River", "Grande Ronde River", "Asotin Creek",
  "Walla Walla River", "Touchet River",
  // LAKES
  "Lake Washington", "Lake Sammamish", "Lake Chelan", "Lake Stevens", "Lake Tapps", "American Lake", "Silver Lake", "Deep Lake", "Clear Lake",
  "Lake Quinault", "Lake Crescent", "Lake Ozette", "Lake Cushman", "Spectacle Lake", "Rimrock Lake", "Naches River Reservoir",
  "Bumping Lake", "Keechelus Lake", "Kachess Lake", "Cle Elum Lake", "Banks Lake", "Rufus Woods Lake", "Lake Roosevelt",
  "Franklin D Roosevelt Lake", "Omak Lake", "Conconully Reservoir", "Pearrygin Lake", "Blue Lake", "Lenore Lake", "Soap Lake",
  "Moses Lake", "Potholes Reservoir", "O Sullivan Reservoir", "Riffe Lake", "Reardan Lake", "Medical Lake", "Newman Lake",
  "Liberty Lake", "Eloika Lake", "Sacheen Lake", "Twin Lakes", "Jameson Lake", "Lenice Lake", "Nunnally Lake", "Merry Lake",
  "Wenas Lake", "Soda Lake", "Brook Lake", "Amber Lake",
  // MARINE
  "Puget Sound", "Hood Canal", "Strait of Juan de Fuca", "Grays Harbor", "Willapa Bay", "Padilla Bay", "Samish Bay",
  "Bellingham Bay", "Commencement Bay", "Elliott Bay", "Case Inlet", "Henderson Inlet", "Totten Inlet", "Eld Inlet", "Budd Inlet",
  "Oakland Bay", "Hammersley Inlet", "Pickering Passage", "Dana Passage", "Carr Inlet", "Hale Passage", "Dalco Passage",
  "East Passage", "Colvos Passage", "Rich Passage", "Port Orchard", "Liberty Bay", "Port Madison", "Port Gamble", "Port Townsend Bay",
  "Discovery Bay", "Sequim Bay", "Dungeness Bay", "Neah Bay", "La Push", "Westport", "Pacific Ocean Washington Coast"
];

// --- UTILITIES ---

const getTilesInView = (bounds) => {
  const west = bounds.getWest()
  const east = bounds.getEast()
  const south = bounds.getSouth()
  const north = bounds.getNorth()
  const tiles = []
  for (let lat = Math.floor(south / TILE_SIZE) * TILE_SIZE; lat <= north; lat += TILE_SIZE) {
    for (let lon = Math.floor(west / TILE_SIZE) * TILE_SIZE; lon <= east; lon += TILE_SIZE) {
      tiles.push(`${lat.toFixed(1)},${lon.toFixed(1)}`)
    }
  }
  return tiles
}

// --- MAP COMPONENTS ---

const MapClickHandler = ({ onMapClick }) => {
  const map = useMap()
  useEffect(() => {
    map.on('click', onMapClick)
    return () => map.off('click', onMapClick)
  }, [map, onMapClick])
  return null
}

const MapController = ({ onMoveEnd, onReady }) => {
  const map = useMap()
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      onReady(map)
      initialized.current = true
    }
    const handleMoveEnd = () => onMoveEnd(map.getBounds(), map.getZoom())
    map.on('moveend', handleMoveEnd)
    map.on('zoomend', handleMoveEnd)
    return () => {
      map.off('moveend', handleMoveEnd)
      map.off('zoomend', handleMoveEnd)
    }
  }, [map, onMoveEnd, onReady])

  return null
}

export default function MapTab({ onSelect, filteredSites = [] }) {
  const [geoData, setGeoData] = useState({ type: 'FeatureCollection', features: [] })
  const [loading, setLoading] = useState(false)
  const [wdfwWaterNames, setWdfwWaterNames] = useState(new Set())
  const [loadedTiles, setLoadedTiles] = useState(new Set())
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({
    lakes: true,
    rivers: true,
    marine: true,
    hotspots: true,
    selectedSpecies: 'all'
  })

  const [selectedWaterbody, setSelectedWaterbody] = useState(null)

  const mapRef = useRef(null)
  const hotspotLayerRef = useRef(null)
  const debounceTimer = useRef(null)
  const highlightLayerRef = useRef(null)
  const getFeatureStyleRef = useRef(null)
  const currentMonth = new Date().getMonth()

  // Fetch WDFW Access Sites
  useEffect(() => {
    const fetchWDFW = async () => {
      try {
        const cached = sessionStorage.getItem('wdfwWaterNames')
        const cachedTime = sessionStorage.getItem('wdfwWaterNamesTime')
        
        if (cached && cachedTime && Date.now() - parseInt(cachedTime) < 24 * 60 * 60 * 1000) {
          setWdfwWaterNames(new Set(JSON.parse(cached)))
          return
        }

        const res = await fetch('https://data.wa.gov/resource/fgam-kd9h.json?$limit=2000')
        const data = await res.json()
        const names = new Set(data.map(site => site.waterbody_name?.toLowerCase().trim()).filter(Boolean))
        
        setWdfwWaterNames(names)
        sessionStorage.setItem('wdfwWaterNames', JSON.stringify(Array.from(names)))
        sessionStorage.setItem('wdfwWaterNamesTime', Date.now().toString())
      } catch (e) {
        console.error("WDFW API Error, using fallback whitelist")
      }
    }
    fetchWDFW()
  }, [])

  const isWDFWWaterway = useCallback((featureName) => {
    if (!featureName || featureName.trim() === '') return false;
    const name = featureName.toLowerCase().trim();

    const rejectTerms = ['golf','country club','resort','pool','fountain','retention','detention','storm','irrigation','wastewater','drainage','ditch','sewage','canal'];
    if (rejectTerms.some(t => name.includes(t))) return false;

    if (wdfwWaterNames.size > 0) {
      for (const wdfwName of wdfwWaterNames) {
        if (name.includes(wdfwName) || wdfwName.includes(name)) return true;
      }
    }

    for (const allowed of WDFW_WATERWAY_WHITELIST) {
      const lowerAllowed = allowed.toLowerCase();
      if (name.includes(lowerAllowed) || lowerAllowed.includes(name)) return true;
    }

    return false;
  }, [wdfwWaterNames])

  const onMapReady = useCallback((map) => {
    mapRef.current = map;
  }, [])

  const fetchWaterbodies = useCallback(async (bounds) => {
    const tilesInView = getTilesInView(bounds)
    const newTiles = tilesInView.filter(t => !loadedTiles.has(t))
    if (newTiles.length === 0) return

    setLoading(true)
    const updatedTiles = new Set(loadedTiles)
    newTiles.forEach(t => updatedTiles.add(t))
    setLoadedTiles(updatedTiles)

    const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`
    const query = `
      [out:json][timeout:60];
      (
        way["natural"="water"]["name"](${bbox});
        relation["natural"="water"]["name"](${bbox});
        way["waterway"~"river|stream|canal"]["name"](${bbox});
        way["place"~"sea|bay|sound|harbor"]["name"](${bbox});
        relation["place"~"sea|bay|sound|harbor"]["name"](${bbox});
      );
      out body; >; out skel qt;
    `

    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: new URLSearchParams({ data: query })
      })
      const osmData = await response.json()
      const geojson = osmtogeojson(osmData)

      const filteredFeatures = geojson.features.filter(f => {
        const name = f.properties.name || ''
        return isWDFWWaterway(name)
      })

      setGeoData(prev => ({
        type: 'FeatureCollection',
        features: [...prev.features, ...filteredFeatures]
      }))
    } catch (err) {
      console.error('Overpass fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [loadedTiles, isWDFWWaterway])

  const handleMoveEnd = (bounds, zoom) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    if (zoom < 8) return setLoading(false)
    debounceTimer.current = setTimeout(() => fetchWaterbodies(bounds), 600)
  }

  const getFeatureStyle = useCallback((feature) => {
    const p = feature.properties
    const isRiver = p.waterway === 'river' || p.waterway === 'stream' || p.waterway === 'canal'
    const name = (p.name || '').toLowerCase()
    const isMarine = p.place === 'sea' || p.place === 'bay' || p.place === 'sound' || p.place === 'harbor' || 
                     name.includes('sound') || name.includes('harbor') || name.includes('bay') || name.includes('strait') || name.includes('ocean');

    const isSelected = selectedWaterbody && (p.name || '').toLowerCase() === selectedWaterbody.toLowerCase()

    if (isSelected) {
      if (isRiver) return { color: '#ff6b35', weight: 6, fillOpacity: 0, opacity: 1 }
      return { color: '#ff6b35', weight: 3, fillColor: '#ff6b35', fillOpacity: 0.5, opacity: 1 }
    }
    if (isMarine) return { color: '#00b4b4', weight: 2, fillColor: '#00b4b4', fillOpacity: 0.18 }
    if (isRiver) return { color: '#1e78ff', weight: 3, fillOpacity: 0 }
    return { color: '#1e78ff', weight: 2, fillColor: '#1e78ff', fillOpacity: 0.25 }
  }, [selectedWaterbody])

  // Keep ref in sync so onEachFeature closures always call the latest style fn
  getFeatureStyleRef.current = getFeatureStyle

  const filteredGeoData = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: geoData.features.filter(f => {
        const p = f.properties
        const isRiver = p.waterway === 'river' || p.waterway === 'stream' || p.waterway === 'canal'
        const name = (p.name || '').toLowerCase()
        const isMarine = p.place === 'sea' || p.place === 'bay' || p.place === 'sound' || p.place === 'harbor' || 
                         name.includes('sound') || name.includes('harbor') || name.includes('bay') || name.includes('strait') || name.includes('ocean');
        const isLake = !isRiver && !isMarine
        if (isLake && !filters.lakes) return false
        if (isRiver && !filters.rivers) return false
        if (isMarine && !filters.marine) return false
        return true
      })
    }
  }, [geoData, filters, selectedWaterbody])

  return (
    <div className="w-full h-full min-h-[500px] relative bg-[var(--bg-color)] overflow-hidden font-sans">
      <MapContainer 
        key="castwise-map"
        center={CENTER} zoom={INITIAL_ZOOM} 
        style={{ height: '100%', width: '100%' }}
        preferCanvas={true} zoomControl={false}
      >
        <TileLayer
          attribution='&copy; CartoDB'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapController onMoveEnd={handleMoveEnd} onReady={onMapReady} />
        <MapClickHandler onMapClick={() => setSelectedWaterbody(null)} />

        {filteredGeoData && filteredGeoData.features?.length > 0 && (
          <GeoJSON 
            key={`geo-${filteredGeoData.features.length}-${filters.lakes}-${filters.rivers}-${filters.marine}-${selectedWaterbody}`}
            data={filteredGeoData} 
            style={getFeatureStyle} 
            onEachFeature={(f, l) => {
              l.on({
                mouseover: (e) => {
                  const styleFn = getFeatureStyleRef.current
                  const style = styleFn(f)
                  const isSelected = style.opacity === 1 // selected items have opacity:1 set explicitly
                  if (!isSelected) {
                    e.target.setStyle({ fillOpacity: (style.fillOpacity || 0) + 0.2, weight: (style.weight || 2) + 1 });
                  }
                },
                mouseout: (e) => e.target.setStyle(getFeatureStyleRef.current(f)),
                click: (e) => {
                  L.DomEvent.stopPropagation(e);
                  const clickedName = f.properties.name || null
                  setSelectedWaterbody(prev => prev === clickedName ? null : clickedName)
                  if (onSelect) { const found = SITES_RAW.find(s => s.name.toLowerCase() === f.properties.name.toLowerCase()); if (found) onSelect(found); }
                  setSelectedFeature(f);
                }
              })
            }}
          />
        )}

        {/* ACCESS SITES LAYER */}
        {filteredSites.map(site => (
          <CircleMarker
            key={site.id}
            center={[site.lat, site.lng]}
            radius={6}
            pathOptions={{
              fillColor: 'var(--primary-accent)',
              color: 'var(--bg-color)',
              weight: 2,
              fillOpacity: 1
            }}
            eventHandlers={{
              click: () => onSelect && onSelect(site)
            }}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <div className="font-bold text-slate-900 text-sm mb-1">{site.name}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{site.county} Co · {site.manager}</div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* FILTER PANEL */}
      <div className="absolute top-4 right-4 z-[1000] w-64">
        <div className="bg-[var(--surface-color)] shadow-xl border-t-[6px] border-[var(--primary-accent)] rounded-b-xl overflow-hidden">
          <button 
            onClick={() => setFiltersOpen(!filtersOpen)} 
            className="w-full p-4 flex justify-between items-center bg-[var(--surface-color)] text-[var(--text-primary)] uppercase tracking-[0.2em] text-[10px] font-bold"
          >
            <div className="flex items-center gap-3">
              <Filter size={14} className="text-[var(--primary-accent)]" />
              <span>Map Layers</span>
            </div>
            {filtersOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          
          <AnimatePresence>
            {filtersOpen && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-[var(--surface-color)] border-t border-[var(--border-color)]">
                <div className="p-6 space-y-4">
                  {[
                    { key: 'lakes', label: 'Lakes & Ponds', Icon: Mountain },
                    { key: 'rivers', label: 'Rivers & Streams', Icon: Waves },
                    { key: 'marine', label: 'Marine Areas', Icon: Anchor },
                  ].map(({ key, label, Icon }) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <Icon size={12} className={filters[key] ? 'text-[var(--primary-accent)]' : 'text-[var(--text-muted)]'} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)]">{label}</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={filters[key]} 
                        onChange={() => setFilters(f => ({ ...f, [key]: !f[key] }))} 
                        className="w-5 h-5 accent-[var(--primary-accent)] cursor-pointer" 
                      />
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {loading && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
          <div className="bg-[var(--surface-color)] px-8 py-4 shadow-xl flex items-center gap-4 border-l-[6px] border-[var(--primary-accent)] rounded-r-xl animate-bounce">
            <div className="w-2 h-2 bg-[var(--primary-accent)] rounded-full animate-ping" />
            <p className="font-bold text-[10px] tracking-[0.3em] text-[var(--text-primary)] uppercase">Scanning Waterways...</p>
          </div>
        </div>
      )}

      {selectedWaterbody && (
        <div className="absolute bottom-10 left-4 z-[1000]">
          <div className="bg-[var(--surface-color)] px-4 py-3 shadow-xl flex items-center gap-3 border-l-[4px] rounded-r-xl" style={{ borderColor: '#ff6b35' }}>
            <Zap size={12} style={{ color: '#ff6b35' }} />
            <span className="font-bold text-[10px] tracking-[0.2em] text-[var(--text-primary)] uppercase">{selectedWaterbody}</span>
            <button
              onClick={() => setSelectedWaterbody(null)}
              className="ml-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
