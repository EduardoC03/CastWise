import React, { useState, useMemo } from 'react';
import { MapPin, Bell, Search, ChevronRight, Settings, Calendar, Droplets, Sparkles, Sun } from 'lucide-react';
import MapTab from './tabs/MapTab';
import { SITES, STOCKING_UPDATES } from '../data/sites';

export default function MapView({ profile, trip, onSelect, onViewTrip, onReset, highlightedIds, recommendations }) {
  const [search, setSearch] = useState('');
  const [tab, setTab]       = useState('map');

  const filtered = useMemo(() => SITES.filter(s => {
    if (profile.travel === 'local' && s.region !== profile.location) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.county.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [profile, search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Sub-tab bar (Map / Updates) ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
        height: 44,
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--surface-color)',
        flexShrink: 0,
        zIndex: 10,
      }}>
        {/* Left: tabs + site count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {[
            { id: 'map',     Icon: MapPin, label: 'Map'     },
            { id: 'updates', Icon: Bell,   label: 'Updates' },
          ].map(({ id, Icon, label }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 2px',
              color: tab === id ? 'var(--primary-accent)' : 'var(--text-muted)',
              borderBottom: tab === id ? '2px solid var(--primary-accent)' : '2px solid transparent',
              fontFamily: 'var(--font-sans)',
              transition: 'color 150ms',
            }}>
              <Icon size={11} /> {label}
              {id === 'updates' && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--primary-accent)', marginLeft: 2 }} />}
            </button>
          ))}
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>
            {filtered.length} matched sites
          </span>
        </div>

        {/* Right: trip pill + reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {trip && (
            <button onClick={onViewTrip} title="View trip" style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px',
              background: 'var(--primary-accent)', border: 'none', borderRadius: 20,
              color: 'var(--bg-color)', fontSize: 10, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'var(--font-sans)', letterSpacing: '0.08em',
            }}>
              <Calendar size={10} /> Trip
            </button>
          )}
          <button onClick={onReset} title="Reset profile" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border-color)',
            background: 'none', color: 'var(--text-muted)', cursor: 'pointer',
          }}>
            <Settings size={13} />
          </button>
        </div>
      </div>

      {/* ── Map tab ── */}
      {tab === 'map' && (
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

          {/* Map canvas */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <MapTab
              onSelect={onSelect}
              filteredSites={filtered}
              highlightedIds={highlightedIds}
              recommendations={recommendations}
            />

            {/* Search bar floating top-right over the map — matches reference */}
            <div style={{
              position: 'absolute', top: 16, right: 16, zIndex: 900,
              display: 'flex', alignItems: 'center', gap: 0,
              background: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search location or species…"
                style={{
                  width: 240, padding: '9px 14px',
                  background: 'transparent', border: 'none', outline: 'none',
                  fontSize: 12, color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                }}
              />
              <div style={{
                padding: '0 12px', height: '100%', display: 'flex', alignItems: 'center',
                background: 'var(--primary-accent)', cursor: 'pointer',
              }}>
                <Search size={13} style={{ color: 'var(--bg-color)' }} />
              </div>
            </div>
          </div>

          {/* Site list panel */}
          <div style={{
            width: 240, flexShrink: 0, borderLeft: '1px solid var(--border-color)',
            background: 'var(--surface-color)', overflowY: 'auto', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ padding: '10px 14px 6px', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
              Sites
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filtered.slice(0, 50).map(s => (
                <button key={s.id} onClick={() => onSelect(s)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '9px 14px', background: 'none', border: 'none',
                  borderBottom: '1px solid var(--border-color)', cursor: 'pointer', textAlign: 'left',
                  transition: 'background 150ms',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-color)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.name}
                      </span>
                      {s.stocked && <Droplets size={9} style={{ color: 'var(--primary-accent)', flexShrink: 0 }} />}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {s.county} Co · {s.species.slice(0,2).join(', ')}
                    </div>
                  </div>
                  <ChevronRight size={12} style={{ color: 'var(--text-muted)', flexShrink: 0, marginLeft: 6 }} />
                </button>
              ))}
              {filtered.length > 50 && (
                <div style={{ padding: '10px 14px', fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Showing 50 of {filtered.length}
                </div>
              )}
              {filtered.length === 0 && (
                <div style={{ padding: '20px 14px', fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No sites match your search.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Updates tab ── */}
      {tab === 'updates' && (
        <UpdatesFeed onSelectSite={(name) => {
          const found = SITES.find(s => s.name === name);
          if (found) onSelect(found);
        }} />
      )}
    </div>
  );
}

function UpdatesFeed({ onSelectSite }) {
  return (
    <div className="cw-updates">
      <div className="cw-updates-intro">
        <Sparkles size={12} /> Pulled from WDFW weekly stocking reports
      </div>
      {STOCKING_UPDATES.map((u, i) => (
        <button key={i} className={`cw-update cw-update-${u.tag}`} onClick={() => u.tag === 'stocked' && onSelectSite(u.site)}>
          <div className="cw-update-date">{u.date}</div>
          <div className="cw-update-body">
            <div className="cw-update-site">
              {u.tag === 'stocked' ? <Droplets size={11} /> : <Sun size={11} />}
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
