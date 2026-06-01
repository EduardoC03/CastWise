import React, { useState, useEffect, useMemo } from 'react';
import { Fish, Trophy, ChevronRight, Plus, Loader2, MapPin } from 'lucide-react';
import { getRecommendations } from './SiteRanking';
import { SITES } from '../data/sites';

// ── Helpers ────────────────────────────────────────────────────────────────

const REGION_COORDS = {
  'Northwest WA': { lat: 48.7519, lng: -122.4787 },
  'Southwest WA': { lat: 46.1400, lng: -122.9390 },
  'Central WA':   { lat: 47.0379, lng: -120.3265 },
  'Eastern WA':   { lat: 47.6588, lng: -117.4260 },
};

const weatherLabel = (code) => {
  if (code === 0)  return 'Clear';
  if (code <= 3)   return 'Partly Cloudy';
  if (code <= 48)  return 'Fog';
  if (code <= 67)  return 'Rain';
  if (code <= 77)  return 'Snow';
  if (code <= 82)  return 'Showers';
  if (code <= 99)  return 'Thunderstorm';
  return 'Cloudy';
};

const moonPhaseLabel = (phase) => {
  // phase is 0–1 from open-meteo daily moon_phase
  if (phase < 0.0625 || phase >= 0.9375) return 'New Moon';
  if (phase < 0.1875) return 'Waxing Crescent';
  if (phase < 0.3125) return 'First Quarter';
  if (phase < 0.4375) return 'Waxing Gibbous';
  if (phase < 0.5625) return 'Full Moon';
  if (phase < 0.6875) return 'Waning Gibbous';
  if (phase < 0.8125) return 'Last Quarter';
  return 'Waning Crescent';
};

const formatTime = (isoString) => {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

// Haversine distance in miles between two lat/lng points
const distanceMiles = (lat1, lng1, lat2, lng2) => {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

// ── Style tokens — dark green sidebar matching reference ───────────────────
const S = {
  sidebar:   { background: '#0c1f0e', color: '#e8e4d8', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', overflowX: 'hidden' },
  header:    { padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  name:      { fontSize: 22, fontWeight: 700, color: '#f5f0e6', fontFamily: 'var(--font-display)', lineHeight: 1.2, marginBottom: 2 },
  date:      { fontSize: 13, color: '#d4a017', fontWeight: 600, marginBottom: 0 },
  section:   { padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  secLabel:  { fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#d4a017', marginBottom: 12 },
  row:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' },
  rowLabel:  { fontSize: 12, color: 'rgba(232,228,216,0.7)', display: 'flex', alignItems: 'center', gap: 7 },
  rowVal:    { fontSize: 12, fontWeight: 600, color: '#f5f0e6', textAlign: 'right' },
  divider:   { height: 1, background: 'rgba(255,255,255,0.07)', margin: '0' },
  pickName:  { fontSize: 15, fontWeight: 700, color: '#f5f0e6', marginBottom: 2 },
  pickSub:   { fontSize: 11, color: 'rgba(232,228,216,0.55)', marginBottom: 8 },
  pickLink:  { display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#d4a017', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-sans)', fontWeight: 600 },
  catchRow:  { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', cursor: 'pointer' },
  catchName: { fontSize: 13, color: '#f5f0e6', fontWeight: 500 },
  catchTime: { fontSize: 11, color: 'rgba(232,228,216,0.45)' },
  lakeRow:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', cursor: 'pointer' },
  lakeName:  { fontSize: 13, color: '#f5f0e6' },
  lakeDist:  { fontSize: 11, color: 'rgba(232,228,216,0.45)' },
  addBtn:    { display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '7px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: 'rgba(232,228,216,0.7)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)', marginBottom: 8 },
  input:     { width: '100%', padding: '7px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: '#f5f0e6', fontSize: 12, fontFamily: 'var(--font-sans)', outline: 'none', marginBottom: 5, boxSizing: 'border-box' },
};

// Weather row icons (emoji — no external deps)
const W_ICONS = {
  forecast: '⛅', temp: '🌡', wind: '💨', humidity: '💧',
  pressure: '🔵', sunrise: '🌅', sunset: '🌇', moon: '🌙',
};

export default function Sidebar({ profile, onNavigate }) {
  const { top } = getRecommendations(profile, SITES);
  const topSite = top[0]?.site || null;

  const EMPTY_FORM = { species: '', weight: '', size: '', location: '', date: '', gear: '' };
  const [showCatchForm, setShowCatchForm] = useState(false);
  const [catchForm,     setCatchForm]     = useState(EMPTY_FORM);
  const [catches,       setCatches]       = useState([]);
  const [editingId,     setEditingId]     = useState(null);
  const [weather,       setWeather]       = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // ── Expanded weather fetch (adds humidity, pressure, sunrise, sunset, moon) ─
  useEffect(() => {
    setWeatherLoading(true);
    const coords = REGION_COORDS[profile?.region] || REGION_COORDS['Northwest WA'];
    const today  = new Date().toISOString().split('T')[0];
    fetch(
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${coords.lat}&longitude=${coords.lng}` +
      `&current=temperature_2m,wind_speed_10m,wind_direction_10m,precipitation,weathercode,relative_humidity_2m,surface_pressure` +
      `&daily=sunrise,sunset,moon_phase` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph` +
      `&timezone=auto&start_date=${today}&end_date=${today}`
    )
      .then(r => r.json())
      .then(d => {
        const c = d.current;
        const dl = d.daily;
        // Wind direction compass
        const dirs = ['N','NE','E','SE','S','SW','W','NW'];
        const compassDir = dirs[Math.round(c.wind_direction_10m / 45) % 8];
        setWeather({
          label:     weatherLabel(c.weathercode),
          temp:      Math.round(c.temperature_2m),
          wind:      `${Math.round(c.wind_speed_10m)} mph ${compassDir}`,
          humidity:  `${Math.round(c.relative_humidity_2m)}%`,
          pressure:  `${(c.surface_pressure * 0.02953).toFixed(2)} in`,
          precip:    c.precipitation,
          sunrise:   formatTime(dl?.sunrise?.[0]),
          sunset:    formatTime(dl?.sunset?.[0]),
          moon:      moonPhaseLabel(dl?.moon_phase?.[0] ?? 0),
        });
      })
      .catch(() => setWeather(null))
      .finally(() => setWeatherLoading(false));
  }, [profile?.region]);

  // ── Nearby lakes: SITES sorted by distance from region center ─────────────
  const nearbyLakes = useMemo(() => {
    const coords = REGION_COORDS[profile?.region] || REGION_COORDS['Northwest WA'];
    return SITES
      .filter(s => s.lat && s.lng)
      .map(s => ({ ...s, miles: Math.round(distanceMiles(coords.lat, coords.lng, s.lat, s.lng)) }))
      .sort((a, b) => a.miles - b.miles)
      .slice(0, 4);
  }, [profile?.region]);

  const openNewForm  = () => { setCatchForm(EMPTY_FORM); setEditingId(null); setShowCatchForm(true); };
  const openEditForm = (c) => { setCatchForm({ species: c.species, weight: c.weight, size: c.size, location: c.location, date: c.date, gear: c.gear }); setEditingId(c.id); setShowCatchForm(true); };
  const cancelForm   = () => { setShowCatchForm(false); setEditingId(null); setCatchForm(EMPTY_FORM); };

  const saveCatch = () => {
    if (!catchForm.species.trim()) return;
    if (editingId !== null) {
      setCatches(prev => prev.map(c => c.id === editingId ? { ...c, ...catchForm, species: catchForm.species.trim() } : c));
    } else {
      setCatches(prev => [{ id: Date.now(), ...catchForm, species: catchForm.species.trim(), loggedAt: 'Just now' }, ...prev]);
    }
    cancelForm();
  };

  const deleteCatch = (id) => setCatches(prev => prev.filter(c => c.id !== id));
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <aside style={S.sidebar} className="cw-sidebar">

      {/* ── Header: greeting + date ── */}
      <div style={S.header}>
        <div style={S.name}>{greeting()}, {profile?.name}.</div>
        <div style={S.date}>{today}</div>
      </div>

      {/* ── Top Pick ── */}
      <div style={S.section}>
        <div style={S.secLabel}>⭐ Top Pick</div>
        {topSite ? (
          <>
            <div style={S.pickName}>{topSite.name}</div>
            <div style={S.pickSub}>{topSite.county} County · Score based on your profile</div>
            <button style={S.pickLink} onClick={() => onNavigate('rankings')}>
              See all picks <ChevronRight size={11} />
            </button>
          </>
        ) : (
          <div style={{ fontSize: 12, color: 'rgba(232,228,216,0.45)', fontStyle: 'italic' }}>
            Complete your profile to see picks.
          </div>
        )}
      </div>

      {/* ── Expanded Weather ── */}
      <div style={S.section}>
        <div style={S.secLabel}>Expanded Weather Details</div>
        {weatherLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
            <Loader2 size={16} className="cw-spin" style={{ color: '#d4a017' }} />
          </div>
        ) : weather ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              { icon: W_ICONS.forecast, label: "Today's Forecast", val: weather.label   },
              { icon: W_ICONS.temp,     label: 'Air Temp',          val: `${weather.temp}°F` },
              { icon: W_ICONS.wind,     label: 'Wind',              val: weather.wind    },
              { icon: W_ICONS.humidity, label: 'Humidity',          val: weather.humidity },
              { icon: W_ICONS.pressure, label: 'Pressure',          val: weather.pressure },
              { icon: W_ICONS.sunrise,  label: 'Sunrise',           val: weather.sunrise },
              { icon: W_ICONS.sunset,   label: 'Sunset',            val: weather.sunset  },
              { icon: W_ICONS.moon,     label: 'Moon Phase',        val: weather.moon    },
            ].map(({ icon, label, val }) => (
              <div key={label} style={S.row}>
                <span style={S.rowLabel}><span style={{ fontSize: 13 }}>{icon}</span>{label}:</span>
                <span style={S.rowVal}>{val}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 12, color: 'rgba(232,228,216,0.45)', fontStyle: 'italic' }}>Conditions unavailable</div>
        )}
      </div>

      {/* ── Catch Log ── */}
      <div style={S.section}>
        <div style={S.secLabel}><Fish size={10} style={{ display: 'inline', marginRight: 4 }} />Catch Log</div>

        {!showCatchForm ? (
          <button style={S.addBtn} onClick={openNewForm}>
            <Plus size={12} /> Log a catch
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 8 }}>
            {[
              { key: 'species',  placeholder: 'Fish name *'           },
              { key: 'weight',   placeholder: 'Weight (e.g. 2.4 lbs)' },
              { key: 'size',     placeholder: 'Size (e.g. 14 in)'     },
              { key: 'location', placeholder: 'Where it was caught'   },
              { key: 'date',     placeholder: 'Date caught'           },
              { key: 'gear',     placeholder: 'Gear used'             },
            ].map(({ key, placeholder }) => (
              <input
                key={key}
                style={S.input}
                placeholder={placeholder}
                value={catchForm[key]}
                onChange={e => setCatchForm(f => ({ ...f, [key]: e.target.value }))}
              />
            ))}
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              <button
                onClick={saveCatch}
                disabled={!catchForm.species.trim()}
                style={{ flex: 1, padding: '6px 0', background: '#d4a017', border: 'none', borderRadius: 6, color: '#0c1f0e', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
              >
                {editingId !== null ? 'Update' : 'Save'}
              </button>
              <button
                onClick={cancelForm}
                style={{ flex: 1, padding: '6px 0', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 6, color: 'rgba(232,228,216,0.7)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {catches.length === 0 && !showCatchForm && (
            <div style={{ fontSize: 12, color: 'rgba(232,228,216,0.35)', fontStyle: 'italic', paddingTop: 2 }}>No catches logged yet.</div>
          )}
          {catches.map(c => (
            <div key={c.id} style={S.catchRow}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <Fish size={13} style={{ color: '#d4a017', flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={S.catchName}>{c.species}</div>
                  {(c.weight || c.location) && (
                    <div style={{ fontSize: 10, color: 'rgba(232,228,216,0.4)' }}>
                      {[c.weight, c.location].filter(Boolean).join(' · ')}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={S.catchTime}>{c.date || c.loggedAt}</span>
                <button onClick={() => openEditForm(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(232,228,216,0.35)', fontSize: 10, padding: '1px 3px', fontFamily: 'var(--font-sans)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#d4a017'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(232,228,216,0.35)'}
                >Edit</button>
                <button onClick={() => deleteCatch(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(232,228,216,0.35)', fontSize: 10, padding: '1px 3px', fontFamily: 'var(--font-sans)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(232,228,216,0.35)'}
                >Del</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Discover Nearby Lakes ── */}
      <div style={{ ...S.section, borderBottom: 'none', paddingBottom: 28 }}>
        <div style={S.secLabel}><MapPin size={10} style={{ display: 'inline', marginRight: 4 }} />Discover Nearby Lakes</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {nearbyLakes.length === 0 ? (
            <div style={{ fontSize: 12, color: 'rgba(232,228,216,0.35)', fontStyle: 'italic' }}>No sites found for your region.</div>
          ) : nearbyLakes.map(s => (
            <div key={s.id} style={S.lakeRow}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <span style={S.lakeName}>{s.name}</span>
              <span style={S.lakeDist}>{s.miles} mi away</span>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
}
