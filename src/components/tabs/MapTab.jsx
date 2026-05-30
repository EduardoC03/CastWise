import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Filter, ChevronDown, ChevronUp, Trophy, Compass, MapPin } from 'lucide-react';
import { SITES } from '../../data/sites';

// Static water-body polygons, generated once by scripts/build-waterbodies.mjs.
// Keyed by site ID; value is { matchName, matchScore, type, geometry } or null.
// If the file hasn't been generated yet, the import will fail at build time —
// that's an explicit error the team should see, not a silent fallback.
import WATERBODIES from '../../data/waterbodies.json';

// Fix Leaflet's default marker icons for Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ----------------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------------
const CENTER = [47.5, -120.5];
const INITIAL_ZOOM = 7;

// Visual styles for highlighted water bodies (top 3 + explore + trip site).
// Orange (#ff6b35) is the established highlight color from the previous map.
const POLYGON_STYLE_LAKE = {
  color: '#ff6b35', weight: 2.5, fillColor: '#ff6b35',
  fillOpacity: 0.35, opacity: 0.9,
};
const POLYGON_STYLE_RIVER = {
  color: '#ff6b35', weight: 5, fillOpacity: 0, opacity: 0.85,
};

// ----------------------------------------------------------------------------
// MapController — only emits onReady so the parent can hold a map ref.
// We removed the per-pan onMoveEnd handler that drove the old Overpass fetches.
// ----------------------------------------------------------------------------
function MapController({ onReady }) {
  const map = useMap();
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      onReady?.(map);
      initialized.current = true;
    }
  }, [map, onReady]);
  return null;
}

// ----------------------------------------------------------------------------
// MapTab
//
// Props:
//   onSelect          — callback when the user clicks any site (opens detail)
//   highlightedIds    — Set<string> of site IDs to highlight (top 3 + explore + trip)
//   recommendations   — { top: RankedResult[], explore: RankedResult|null }
//                       used to label highlighted markers with rank/score
// ----------------------------------------------------------------------------
export default function MapTab({
  onSelect,
  highlightedIds = new Set(),
  recommendations = null,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  // markerMode: 'all' | 'recommended' | 'none'
  const [markerMode, setMarkerMode] = useState('all');
  const mapRef = useRef(null);

  // Look up display labels (rank, score) for highlighted sites
  const labelForSite = useMemo(() => {
    const map = new Map();
    if (recommendations?.top) {
      recommendations.top.forEach((r, idx) => {
        map.set(r.site.id, { kind: 'top', rank: idx + 1, score: r.score });
      });
    }
    if (recommendations?.explore?.site) {
      const r = recommendations.explore;
      map.set(r.site.id, { kind: 'explore', score: r.score });
    }
    return map;
  }, [recommendations]);

  // Visible markers depend on the mode chosen by the user
  const visibleSites = useMemo(() => {
    if (markerMode === 'none') return [];
    if (markerMode === 'recommended') return SITES.filter(s => highlightedIds.has(s.id));
    return SITES;
  }, [markerMode, highlightedIds]);

  // The GeoJSON FeatureCollection to render — only highlighted sites' polygons,
  // filtered to those that have an entry in the static file.
  const polygonFeatures = useMemo(() => {
    const features = [];
    for (const siteId of highlightedIds) {
      const wb = WATERBODIES[siteId];
      if (!wb || !wb.geometry) continue;
      const site = SITES.find(s => s.id === siteId);
      features.push({
        type: 'Feature',
        properties: {
          siteId,
          siteName: site?.name || wb.matchName,
          waterName: wb.matchName,
          type: wb.type,
        },
        geometry: wb.geometry,
      });
    }
    return { type: 'FeatureCollection', features };
  }, [highlightedIds]);

  const polygonStyle = useCallback((feature) => {
    return feature?.properties?.type === 'river' ? POLYGON_STYLE_RIVER : POLYGON_STYLE_LAKE;
  }, []);

  const handlePolygonClick = useCallback((feature) => {
    const siteId = feature?.properties?.siteId;
    if (!siteId) return;
    const site = SITES.find(s => s.id === siteId);
    if (site && onSelect) onSelect(site);
  }, [onSelect]);

  return (
    <div className="w-full h-full min-h-[500px] relative bg-[var(--bg-color)] overflow-hidden">
      <MapContainer
        key="castwise-map"
        center={CENTER}
        zoom={INITIAL_ZOOM}
        style={{ height: '100%', width: '100%' }}
        preferCanvas={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; CartoDB'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapController onReady={(m) => { mapRef.current = m; }} />

        {/* WATER-BODY POLYGONS — only highlighted sites' water bodies */}
        {polygonFeatures.features.length > 0 && (
          <GeoJSON
            // Re-key when the highlighted set changes so the layer remounts cleanly
            key={`polys-${[...highlightedIds].sort().join(',')}`}
            data={polygonFeatures}
            style={polygonStyle}
            onEachFeature={(feature, layer) => {
              layer.on('click', () => handlePolygonClick(feature));
            }}
          />
        )}

        {/* SITE MARKERS — visibility controlled by the filter panel */}
        {visibleSites.map(site => {
          const label = labelForSite.get(site.id);
          const isHighlighted = highlightedIds.has(site.id);
          const isTop = label?.kind === 'top';
          const isExplore = label?.kind === 'explore';

          // Visual hierarchy: top picks > explore > all others
          const radius = isTop ? 9 : isExplore ? 7 : 4;
          const fillColor = isTop
            ? 'var(--primary-accent)'
            : isExplore
              ? 'var(--secondary-accent)'
              : 'var(--text-muted)';
          const fillOpacity = isHighlighted ? 1 : 0.55;
          const weight = isHighlighted ? 2 : 1;

          return (
            <CircleMarker
              key={site.id}
              center={[site.lat, site.lng]}
              radius={radius}
              pathOptions={{
                fillColor, fillOpacity, weight,
                color: isHighlighted ? 'var(--bg-color)' : 'transparent',
              }}
              eventHandlers={{
                click: () => onSelect && onSelect(site),
              }}
            >
              {/* Permanent tooltip on top picks: visible label "#1 · 92" */}
              {isTop && (
                <Tooltip
                  permanent
                  direction="top"
                  offset={[0, -8]}
                  className="castwise-rank-tooltip"
                >
                  <span style={{ fontWeight: 700 }}>#{label.rank}</span>
                  <span style={{ opacity: 0.6, marginLeft: 4 }}>· {label.score}</span>
                </Tooltip>
              )}

              <Popup>
                <div style={{ padding: '4px', minWidth: 160 }}>
                  {label && (
                    <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#ff6b35', fontWeight: 700, marginBottom: 4 }}>
                      {label.kind === 'top' ? `Pick #${label.rank} · score ${label.score}` : `Explore pick · ${label.score}`}
                    </div>
                  )}
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 2 }}>
                    {site.name}
                  </div>
                  <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                    {site.county} County · {site.manager}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* FILTER PANEL — repurposed: toggle marker visibility */}
      <div className="absolute top-4 right-4 z-[1000] w-60">
        <div className="bg-[var(--surface-color)] shadow-xl border-t-[6px] border-[var(--primary-accent)] rounded-b-xl overflow-hidden">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="w-full p-3 flex justify-between items-center bg-[var(--surface-color)] text-[var(--text-primary)] uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-[var(--bg-color)] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Filter size={12} className="text-[var(--primary-accent)]" />
              <span>Map Layers</span>
            </div>
            {filtersOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {filtersOpen && (
            <div className="p-3 border-t border-[var(--border-color)] space-y-1">
              <div className="text-[9px] font-mono uppercase tracking-widest text-[var(--text-muted)] mb-1.5">
                Access sites
              </div>
              <MarkerModeOption
                value="all"
                current={markerMode}
                onSelect={setMarkerMode}
                Icon={MapPin}
                label="All sites"
                hint={`${SITES.length} WDFW access points`}
              />
              <MarkerModeOption
                value="recommended"
                current={markerMode}
                onSelect={setMarkerMode}
                Icon={Trophy}
                label="Recommended only"
                hint={`${highlightedIds.size} site${highlightedIds.size !== 1 ? 's' : ''} highlighted`}
              />
              <MarkerModeOption
                value="none"
                current={markerMode}
                onSelect={setMarkerMode}
                Icon={Compass}
                label="Hide markers"
                hint="Water bodies only"
              />
              <div className="text-[9px] font-serif italic text-[var(--text-muted)] pt-2 mt-2 border-t border-[var(--border-color)] leading-snug">
                Highlighted water bodies show your top recommendations.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tooltip styling (Leaflet's default is harsh against the dark theme) */}
      <style>{`
        .castwise-rank-tooltip {
          background: var(--primary-accent) !important;
          color: var(--text-primary) !important;
          border: none !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          padding: 2px 8px !important;
          border-radius: 4px !important;
        }
        .castwise-rank-tooltip::before {
          border-top-color: var(--primary-accent) !important;
        }
      `}</style>
    </div>
  );
}

function MarkerModeOption({ value, current, onSelect, Icon, label, hint }) {
  const selected = current === value;
  return (
    <button
      onClick={() => onSelect(value)}
      className={`w-full text-left p-2 rounded flex items-start gap-2 transition-colors ${
        selected
          ? 'bg-[var(--primary-accent)]/15 border border-[var(--primary-accent)]/40'
          : 'border border-transparent hover:bg-[var(--bg-color)]'
      }`}
    >
      <Icon
        size={14}
        className={selected ? 'text-[var(--primary-accent)] mt-0.5' : 'text-[var(--text-muted)] mt-0.5'}
      />
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-semibold ${selected ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'}`}>
          {label}
        </div>
        <div className="text-[9px] text-[var(--text-muted)] leading-tight">{hint}</div>
      </div>
    </button>
  );
}
