import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Filter, ChevronDown, ChevronUp, Trophy, Compass, MapPin } from 'lucide-react';
import { SITES } from '../../data/sites';

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

const CENTER = [47.5, -120.5];
const INITIAL_ZOOM = 7;

const POLYGON_STYLE_LAKE = {
  color: '#ff6b35', weight: 2.5, fillColor: '#ff6b35',
  fillOpacity: 0.35, opacity: 0.9,
};
const POLYGON_STYLE_RIVER = {
  color: '#ff6b35', weight: 5, fillOpacity: 0, opacity: 0.85,
};

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

export default function MapTab({
  onSelect,
  highlightedIds = new Set(),
  recommendations = null,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [markerMode, setMarkerMode] = useState('recommended');
  const mapRef = useRef(null);

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

  // ── FIX: visibleSites relies entirely on highlightedIds from App.jsx
  const visibleSites = useMemo(() => {
    if (markerMode === 'none') return [];
    if (markerMode === 'recommended') {
      return SITES.filter(s => highlightedIds.has(s.id) && s.lat != null && s.lng != null);
    }
    return SITES.filter(s => s.lat != null && s.lng != null);
  }, [markerMode, highlightedIds]);

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

  const createCustomIcon = useCallback((label) => {
    const isTop = label?.kind === 'top';
    const isExplore = label?.kind === 'explore';

    let htmlContent = '';
    let innerClass = 'castwise-pin-inner ';
    let size = 20;

    if (isTop) {
      innerClass += 'castwise-pin-top';
      htmlContent = `<span>${label.rank}</span>`;
      size = 36;
    } else if (isExplore) {
      innerClass += 'castwise-pin-explore';
      htmlContent = `<span>E</span>`;
      size = 28;
    } else {
      innerClass += 'castwise-pin-default';
      size = 16;
    }

    return L.divIcon({
      html: `<div class="${innerClass}">${htmlContent}</div>`,
      className: 'castwise-pin-wrapper',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -(size / 2)]
    });
  }, []);

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

        {polygonFeatures.features.length > 0 && (
          <GeoJSON
            key={`polys-${[...highlightedIds].sort().join(',')}`}
            data={polygonFeatures}
            style={polygonStyle}
            onEachFeature={(feature, layer) => {
              layer.on('click', () => handlePolygonClick(feature));
            }}
          />
        )}

        {visibleSites.map(site => {
          const label = labelForSite.get(site.id);
          const isTop = label?.kind === 'top';

          return (
            <Marker
              key={site.id}
              position={[site.lat, site.lng]}
              icon={createCustomIcon(label)}
              eventHandlers={{
                click: () => onSelect && onSelect(site),
              }}
            >
              {isTop && (
                <Tooltip
                  permanent
                  direction="top"
                  offset={[0, -22]}
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
            </Marker>
          );
        })}
      </MapContainer>

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

      <style>{`
        .castwise-pin-wrapper {
          background: transparent !important;
          border: none !important;
        }

        .castwise-pin-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display), sans-serif;
          font-weight: 800;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          border: 2.5px solid #ffffff;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .castwise-pin-inner:hover {
          transform: scale(1.15);
          box-shadow: 0 6px 16px rgba(0,0,0,0.6);
        }

        .castwise-pin-top {
          background: linear-gradient(135deg, #f7ce65 0%, #d4a017 100%);
          color: #1a1a1a;
          font-size: 16px;
        }

        .castwise-pin-explore {
          background: linear-gradient(135deg, #5aad66 0%, #2f6936 100%);
          color: #ffffff;
          font-size: 14px;
        }

        .castwise-pin-default {
          background: #888888;
          border-width: 1.5px;
          opacity: 0.7;
        }
        
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
