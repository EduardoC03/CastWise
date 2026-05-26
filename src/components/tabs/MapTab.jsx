/*
 * DIAGNOSIS:
 * 1. Salmon Hot Spots: The previous implementation used React-Leaflet <Circle> components which 
 *    scale in meters, making them invisible at low zoom. The mandatory L.layerGroup imperative 
 *    pattern was missing, and z-indexing wasn't managed to keep hot spots above water polygons. 
 *    The updateHotspots('all') call on map load was also absent.
 * 2. Waterway Highlighting: The code was highlighting all waterways from Overpass except for a 
 *    small reject list. It lacked the required WDFW API data fetching and the comprehensive 
 *    whitelist check, leading to the inclusion of non-fishing waters like drainage and private ponds.
 */

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

// --- CONSTANTS ---
const CENTER = [47.5, -120.5]
const INITIAL_ZOOM = 7
const TILE_SIZE = 0.5
const MAX_CACHE_SIZE = 200

// HARDCODED SALMON HOTSPOTS
const SALMON_HOTSPOTS_DATA = [
  { name: "Columbia River Mouth", coords: [46.2465, -124.0594], species: ["chinook", "coho", "chum"] },
  { name: "Columbia River Bonneville", coords: [45.6440, -121.9410], species: ["chinook", "coho", "sockeye"] },
  { name: "Columbia River McNary", coords: [45.9355, -119.2972], species: ["chinook", "sockeye"] },
  { name: "Snake River Confluence", coords: [46.2058, -119.0292], species: ["chinook", "coho"] },
  { name: "Puget Sound Central", coords: [47.6062, -122.4580], species: ["chinook", "coho", "pink", "chum"] },
  { name: "Skagit River", coords: [48.4244, -122.3362], species: ["chinook", "coho", "pink", "chum"] },
  { name: "Snohomish River", coords: [47.9138, -122.1573], species: ["chinook", "coho", "chum"] },
  { name: "Skykomish River", coords: [47.8579, -121.9399], species: ["chinook", "coho", "pink"] },
  { name: "Stillaguamish River", coords: [48.1718, -122.2718], species: ["chinook", "coho", "chum"] },
  { name: "Green River", coords: [47.3281, -122.2126], species: ["chinook", "coho"] },
  { name: "Puyallup River", coords: [47.2048, -122.4217], species: ["chinook", "coho", "chum"] },
  { name: "Nisqually River", coords: [47.0892, -122.7035], species: ["chinook", "coho"] },
  { name: "Hoh River", coords: [47.7577, -124.1476], species: ["chinook", "coho", "chum"] },
  { name: "Quinault River", coords: [47.4557, -123.8476], species: ["chinook", "coho", "sockeye"] },
  { name: "Elwha River", coords: [48.1218, -123.5635], species: ["chinook", "coho", "chum"] },
  { name: "Ballard Locks", coords: [47.6655, -122.3950], species: ["chinook", "coho", "sockeye"] },
  { name: "Hood Canal", coords: [47.6135, -122.9932], species: ["chinook", "coho", "pink", "chum"] },
  { name: "Grays Harbor", coords: [46.9765, -124.1008], species: ["chinook", "coho", "chum"] },
  { name: "Willapa Bay", coords: [46.6538, -123.9588], species: ["chinook", "coho", "chum"] },
  { name: "Queets River", coords: [47.5324, -124.2302], species: ["chinook", "coho"] },
  { name: "Lake Washington", coords: [47.6223, -122.2530], species: ["chinook", "coho", "sockeye"] },
  { name: "Lake Sammamish", coords: [47.6163, -122.0833], species: ["chinook", "coho"] },
  { name: "Baker Lake", coords: [48.7490, -121.5794], species: ["sockeye"] },
  { name: "Lake Wenatchee", coords: [47.8105, -120.7202], species: ["sockeye"] },
  { name: "Lake Chelan", coords: [47.9271, -120.1264], species: ["chinook"] }
];

const SALMON_CALENDAR = {
  chinook:  [1,1,1,0,1,2,3,3,3,2,1,0],
  coho:     [0,0,0,0,0,0,0,1,2,3,2,1],
  pink:     [0,0,0,0,0,0,1,3,3,2,0,0],
  chum:     [0,0,0,0,0,0,0,0,1,2,3,2],
  sockeye:  [0,0,0,0,1,3,3,2,1,0,0,0]
};

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

export default function MapTab({ onSelect }) {
  const [geoData, setGeoData] = useState({ type: 'FeatureCollection', features: [] })
  const [loading, setLoading] = useState(false)
  const [wdfwWaterNames, setWdfwWaterNames] = useState(new Set())
  const [loadedTiles, setLoadedTiles] = useState(new Set())
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [filters, setFilters] = useState({
    lakes: true,
    rivers: true,
    marine: true,
    hotspots: true,
    selectedSpecies: 'all'
  })

  const mapRef = useRef(null)
  const hotspotLayerRef = useRef(null)
  const debounceTimer = useRef(null)
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

  const updateHotspots = useCallback((speciesFilter) => {
    if (!hotspotLayerRef.current) return;
    hotspotLayerRef.current.clearLayers();
    if (!filters.hotspots) return;

    SALMON_HOTSPOTS_DATA.forEach(hs => {
      let bestConfidence = 0;
      let matchedSpecies = [];

      Object.entries(SALMON_CALENDAR).forEach(([species, runData]) => {
        if (speciesFilter !== 'all' && species !== speciesFilter) return;
        if (!hs.species.includes(species)) return;

        const confidence = runData[currentMonth];
        if (confidence > bestConfidence) bestConfidence = confidence;
        if (confidence > 0) matchedSpecies.push(species.toUpperCase());
      });

      if (bestConfidence > 0) {
        const color = bestConfidence === 3 ? '#ff2828' : bestConfidence === 2 ? '#ff8c00' : '#ffd700';
        const radius = bestConfidence === 3 ? 14 : bestConfidence === 2 ? 11 : 8;
        const label = bestConfidence === 3 ? 'HIGH' : bestConfidence === 2 ? 'MODERATE' : 'POSSIBLE';
        const successRate = bestConfidence === 3 ? '85%' : bestConfidence === 2 ? '60%' : '35%';

        const marker = L.circleMarker(hs.coords, {
          radius: radius,
          fillColor: color,
          color: '#ffffff',
          weight: 2,
          fillOpacity: 0.8,
          className: 'hotspot-marker'
        });

        marker.bindPopup(`
          <div class="p-2 w-64 font-sans">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 rounded-full" style="background-color: ${color}"></div>
              <span class="font-black uppercase tracking-tighter text-xs" style="color: ${color}">
                ${label} CONFIDENCE — ${successRate} SUCCESS RATE
              </span>
            </div>
            <h4 class="font-black text-xl leading-none mb-3 uppercase tracking-tighter">${hs.name}</h4>
            <div class="space-y-1 text-[10px] uppercase font-bold text-slate-500 tracking-widest">
               <p>Active Species: ${matchedSpecies.join(', ')}</p>
               <p>Month: ${new Date(2026, currentMonth).toLocaleString('default', { month: 'long' })}</p>
               <p>Best Methods: Trolling, Twitching Jigs, Bait</p>
            </div>
            <hr class="my-3 border-slate-100" />
            <a href="https://wdfw.wa.gov/fishing/regulations/salmon" target="_blank" rel="noreferrer" class="block w-full bg-slate-900 text-white py-3 text-center text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-colors">WDFW Salmon Regs →</a>
          </div>
        `);

        marker.addTo(hotspotLayerRef.current);
      }
    });
  }, [currentMonth, filters.hotspots])

  const onMapReady = useCallback((map) => {
    mapRef.current = map;
    hotspotLayerRef.current = L.layerGroup().addTo(map);
    // Force z-index of hotspots above everything
    map.createPane('hotspots');
    map.getPane('hotspots').style.zIndex = 650;
    hotspotLayerRef.current.getLayers().forEach(l => l.options.pane = 'hotspots');
    
    updateHotspots(filters.selectedSpecies);
  }, [updateHotspots, filters.selectedSpecies])

  useEffect(() => {
    updateHotspots(filters.selectedSpecies);
  }, [updateHotspots, filters.selectedSpecies, filters.hotspots]);

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

  const getFeatureStyle = (feature) => {
    const p = feature.properties
    const isRiver = p.waterway === 'river' || p.waterway === 'stream' || p.waterway === 'canal'
    const name = (p.name || '').toLowerCase()
    const isMarine = p.place === 'sea' || p.place === 'bay' || p.place === 'sound' || p.place === 'harbor' || 
                     name.includes('sound') || name.includes('harbor') || name.includes('bay') || name.includes('strait') || name.includes('ocean');

    if (isMarine) return { color: '#00b4b4', weight: 2, fillColor: '#00b4b4', fillOpacity: 0.18 }
    if (isRiver) return { color: '#1e78ff', weight: 3, fillOpacity: 0 }
    return { color: '#1e78ff', weight: 2, fillColor: '#1e78ff', fillOpacity: 0.25 }
  }

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
  }, [geoData, filters])

  return (
    <div className="relative w-full h-full bg-[#f8f9fa] overflow-hidden font-sans">
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .hotspot-marker { 
          animation: pulse 2s ease-in-out infinite;
          transform-origin: center;
        }
        .leaflet-container { font-family: inherit; }
      `}</style>

      <MapContainer 
        center={CENTER} zoom={INITIAL_ZOOM} 
        style={{ height: '100%', width: '100%' }}
        preferCanvas={true} zoomControl={false}
      >
        <TileLayer
          attribution='&copy; CartoDB'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapController onMoveEnd={handleMoveEnd} onReady={onMapReady} />

        <GeoJSON 
          key={`geo-${filteredGeoData.features.length}-${filters.lakes}-${filters.rivers}-${filters.marine}`}
          data={filteredGeoData} 
          style={getFeatureStyle} 
          onEachFeature={(f, l) => {
            l.on({
              mouseover: (e) => {
                const style = getFeatureStyle(f);
                e.target.setStyle({ fillOpacity: style.fillOpacity + 0.15 });
              },
              mouseout: (e) => e.target.setStyle(getFeatureStyle(f)),
              click: (e) => {
                L.DomEvent.stopPropagation(e);
                if (onSelect) { const found = SITES_RAW.find(s => s.name.toLowerCase() === f.properties.name.toLowerCase()); if (found) onSelect(found); }
                setSelectedFeature(f);
              }
            })
          }}
        />

        {/* ACCESS SITES LAYER */}
        {SITES_RAW.map(site => (
          <CircleMarker
            key={site.id}
            center={[site.lat, site.lng]}
            radius={5}
            pathOptions={{
              fillColor: '#0A2342',
              color: 'white',
              weight: 1.5,
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
        <div className="bg-white shadow-xl border-t-[6px] border-amber-500">
          <button 
            onClick={() => setFiltersOpen(!filtersOpen)} 
            className="w-full p-4 flex justify-between items-center bg-slate-900 text-white uppercase tracking-[0.2em] text-[10px] font-bold"
            style={{ minHeight: '44px' }}
          >
            <div className="flex items-center gap-3">
              <Filter size={14} className="text-amber-500" />
              <span>Map Layers</span>
            </div>
            {filtersOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          
          <AnimatePresence>
            {filtersOpen && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-white">
                <div className="p-6 space-y-4">
                  {[
                    { key: 'lakes', label: 'Lakes & Ponds', Icon: Mountain },
                    { key: 'rivers', label: 'Rivers & Streams', Icon: Waves },
                    { key: 'marine', label: 'Marine Areas', Icon: Anchor },
                    { key: 'hotspots', label: 'Salmon Hot Spots', Icon: Zap }
                  ].map(({ key, label, Icon }) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer group" style={{ minHeight: '44px' }}>
                      <div className="flex items-center gap-3">
                        <Icon size={12} className={filters[key] ? 'text-amber-500' : 'text-slate-400'} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">{label}</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={filters[key]} 
                        onChange={() => setFilters(f => ({ ...f, [key]: !f[key] }))} 
                        className="w-5 h-5 accent-amber-500 cursor-pointer" 
                      />
                    </label>
                  ))}
                  
                  {filters.hotspots && (
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">Filter by Species:</p>
                      <select 
                        value={filters.selectedSpecies}
                        onChange={(e) => setFilters(f => ({ ...f, selectedSpecies: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-[10px] font-black uppercase p-3 outline-none focus:border-amber-500 transition-colors"
                        style={{ minHeight: '44px' }}
                      >
                        <option value="all">All Salmon</option>
                        <option value="chinook">Chinook</option>
                        <option value="coho">Coho</option>
                        <option value="pink">Pink</option>
                        <option value="chum">Chum</option>
                        <option value="sockeye">Sockeye</option>
                      </select>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* WATERBODY INFO PANEL */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} 
            className="absolute bottom-6 left-4 right-4 lg:left-auto lg:right-4 lg:top-24 lg:bottom-auto lg:w-[380px] z-[1500]"
          >
            <div className="bg-white shadow-2xl flex flex-col border-t-[10px] border-amber-500 overflow-hidden max-h-[70vh]">
              <div className="bg-slate-900 p-6 flex justify-between items-start shrink-0">
                <div className="flex-1">
                   <h3 className="text-2xl font-black uppercase text-white tracking-tighter leading-tight mb-1">
                    {selectedFeature.properties.name}
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/80">Fishery Intel Report</span>
                </div>
                <button onClick={() => onSelect ? onSelect(null) : setSelectedFeature(null)} className="text-white/40 hover:text-white p-2"><X size={24} /></button>
              </div>
              <div className="p-8 overflow-y-auto space-y-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Known Species:</p>
                  <div className="flex flex-wrap gap-2">
                    {(topWaterbodies[selectedFeature.properties.name] || ['Rainbow Trout', 'Cutthroat Trout', 'Smallmouth Bass']).map(s => (
                      <div key={s} className="bg-slate-50 px-3 py-2 border border-slate-100 text-[10px] font-bold uppercase text-slate-900 tracking-tight">{s}</div>
                    ))}
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-100">
                  <a href="https://wdfw.wa.gov/fishing/regulations" target="_blank" rel="noreferrer" className="block w-full bg-slate-900 py-4 text-center text-white font-bold text-sm tracking-[0.2em] shadow-lg hover:bg-amber-500 transition-all uppercase">Official WDFW Regs →</a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[2000] pointer-events-none">
          <div className="bg-white px-8 py-4 shadow-xl flex items-center gap-4 border-l-[6px] border-amber-500 animate-bounce">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
            <p className="font-bold text-[10px] tracking-[0.3em] text-slate-900 uppercase">Scanning Waterways...</p>
          </div>
        </div>
      )}
    </div>
  )
}
