import React, { useState, useMemo } from 'react';
import { MapPin, Bell, Search, ChevronRight, Settings, Calendar, Droplets, Sparkles, Sun } from 'lucide-react';
import MapTab from './tabs/MapTab';
import { SITES, STOCKING_UPDATES } from '../data/sites';

// ── FIX: MapView now correctly accepts highlightedIds and recommendations from App.jsx
export default function MapView({ profile, trip, onSelect, onViewTrip, onReset, highlightedIds, recommendations }) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('map');

  const filtered = useMemo(() => SITES.filter(s => {
    if (profile.travel === 'local' && s.region !== profile.location) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.county.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [profile, search]);

  return (
    <div className={`cw-screen ${tab === 'map' ? 'cw-screen-map' : ''}`}>
      <div className="cw-map-top">
        <div>
          <div className="cw-map-h">Field map</div>
          <div className="cw-map-sub">{filtered.length} matched sites</div>
        </div>
        <div className="cw-map-top-actions">
          {trip && (
            <button className="cw-trip-pill" onClick={onViewTrip} title="View trip">
              <Calendar size={11}/>
            </button>
          )}
          <button className="cw-icon-btn" onClick={onReset} title="Reset">
            <Settings size={13}/>
          </button>
        </div>
      </div>

      <div className="cw-map-tabs">
        <button className={`cw-tab ${tab === 'map' ? 'active' : ''}`} onClick={() => setTab('map')}>
          <MapPin size={12}/> Map
        </button>
        <button className={`cw-tab ${tab === 'updates' ? 'active' : ''}`} onClick={() => setTab('updates')}>
          <Bell size={12}/> Updates
          <span className="cw-tab-dot"/>
        </button>
      </div>

      {tab === 'map' && (
        <div className="cw-map-layout" style={{ position: 'relative', zIndex: 0 }}>
          <div className="cw-map-atlas-container">
            <MapTab 
              onSelect={onSelect} 
              highlightedIds={highlightedIds} 
              recommendations={recommendations} 
            />
          </div>

          <div className="cw-map-list-section">
             <div className="cw-search mb-4">
               <Search size={13}/>
               <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sites…"/>
             </div>
             <div className="cw-list">
               {filtered.slice(0, 50).map(s => (
                 <button key={s.id} className="cw-list-item" onClick={() => onSelect(s)}>
                   <div className="cw-list-item-main">
                     <div className="cw-list-item-name">
                       {s.name}
                       {s.stocked && <span className="cw-list-flag"><Droplets size={9}/></span>}
                     </div>
                     <div className="cw-list-item-meta">{s.county} Co · {s.species.slice(0,2).join(', ')}</div>
                   </div>
                   <ChevronRight size={14}/>
                 </button>
               ))}
               {filtered.length > 50 && (
                 <div className="cw-list-more">Showing 50 of {filtered.length}.</div>
               )}
             </div>
          </div>
        </div>
      )}

      {tab === 'updates' && <UpdatesFeed onSelectSite={(name) => {
        const found = SITES.find(s => s.name === name);
        if (found) onSelect(found);
      }}/>}
    </div>
  );
}

function UpdatesFeed({ onSelectSite }) {
  return (
    <div className="cw-updates">
      <div className="cw-updates-intro">
        <Sparkles size={12}/> Pulled from WDFW weekly stocking reports
      </div>
      {STOCKING_UPDATES.map((u, i) => (
        <button key={i} className={`cw-update cw-update-${u.tag}`} onClick={() => u.tag === 'stocked' && onSelectSite(u.site)}>
          <div className="cw-update-date">{u.date}</div>
          <div className="cw-update-body">
            <div className="cw-update-site">
              {u.tag === 'stocked' ? <Droplets size={11}/> : <Sun size={11}/>}
              {u.site}
            </div>
            <div className="cw-update-detail">{u.detail}</div>
          </div>
          <div className={`cw-update-tag cw-update-tag-${u.tag}`}>
            {u.tag === 'stocked' ? 'Stocked' : 'Opening'}
          </div>
        </button>
      ))}
      <div className="cw-updates-foot">
        Stocking schedule subject to change. Verify at wdfw.wa.gov/fishing/reports
      </div>
    </div>
  );
}
