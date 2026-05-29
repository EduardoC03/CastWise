import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Thermometer, Wind, Trophy, ChevronRight, Plus, Fish, Loader2 } from 'lucide-react';
import { getRecommendations } from './SiteRanking';
import { SITES } from '../data/sites';

const REGION_COORDS = {
  'Northwest WA': { lat: 48.7519, lng: -122.4787 },
  'Southwest WA': { lat: 46.1400, lng: -122.9390 },
  'Central WA':   { lat: 47.0379, lng: -120.3265 },
  'Eastern WA':   { lat: 47.6588, lng: -117.4260 },
};

const weatherLabel = (code) => {
  if (code === 0) return 'Clear';
  if (code <= 3)  return 'Partly Cloudy';
  if (code <= 48) return 'Fog';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Cloudy';
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const personalizedLine = (profile) => {
  const { region = '', experience = '', styles = [], travel = '' } = profile;
  const style = styles[0] || 'fishing';
  if (experience === 'Beginner')        return `We'll find beginner-friendly spots in ${region} with easy access.`;
  if (travel === 'Anywhere in WA')      return `Ready to explore all of Washington? Here are this week's best ${style} spots.`;
  if (experience === 'Advanced')        return `Top-rated ${style} spots in ${region} matched to your skill level.`;
  return `Finding the best ${style} spots in ${region} for this weekend.`;
};

export default function Sidebar({ profile, onNavigate }) {
  const { top } = getRecommendations(profile, SITES);
  const topSite = top[0]?.site || null;

  const [catchInput, setCatchInput]   = useState('');
  const [catches, setCatches]         = useState([
    { id: 1, species: 'Rainbow Trout',   date: '2 days ago' },
    { id: 2, species: 'Cutthroat Trout', date: 'Last week'  },
  ]);
  const [weather, setWeather]         = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    setWeatherLoading(true);
    const coords = REGION_COORDS[profile?.region] || REGION_COORDS['Northwest WA'];
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}` +
      `&current=temperature_2m,wind_speed_10m,precipitation,weathercode` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph`
    )
      .then(r => r.json())
      .then(d => {
        setWeather({
          temp:    Math.round(d.current.temperature_2m),
          wind:    Math.round(d.current.wind_speed_10m),
          precip:  d.current.precipitation,
          label:   weatherLabel(d.current.weathercode),
        });
      })
      .catch(() => setWeather(null))
      .finally(() => setWeatherLoading(false));
  }, [profile?.region]);

  const addCatch = () => {
    if (!catchInput.trim()) return;
    setCatches(prev => [{ id: Date.now(), species: catchInput.trim(), date: 'Just now' }, ...prev.slice(0, 2)]);
    setCatchInput('');
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <aside className="cw-sidebar">

      {/* ── Welcome ── */}
      <div className="cw-sidebar-card">
        <div className="cw-card-label">
          <span className="cw-card-label-dot" />
          Dashboard
        </div>
        <div className="cw-welcome-name">{greeting()}, {profile?.name}.</div>
        <div className="cw-welcome-date">{today}</div>
        <div className="cw-welcome-tagline">{personalizedLine(profile)}</div>
      </div>

      {/* ── Top Pick ── */}
      <div className="cw-sidebar-card">
        <div className="cw-card-label">
          <Trophy size={10} />
          Top Pick
        </div>
        {topSite ? (
          <>
            <div className="cw-pick-site">{topSite.name}</div>
            <div className="cw-pick-county">{topSite.county} County</div>
            <div className="cw-pick-badge">
              <span>Score based on your profile</span>
            </div>
            <button className="cw-pick-link" onClick={() => onNavigate('rankings')}>
              See all picks <ChevronRight size={11} />
            </button>
          </>
        ) : (
          <p style={{ fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic' }}>
            Complete your profile to see picks.
          </p>
        )}
      </div>

      {/* ── Conditions ── */}
      <div className="cw-sidebar-card">
        <div className="cw-card-label">
          <Cloud size={10} />
          Today's Conditions
        </div>

        {weatherLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
            <Loader2 size={20} className="cw-spin" style={{ color: 'var(--gold)' }} />
          </div>
        ) : weather ? (
          <>
            <div className="cw-cond-grid">
              <div className="cw-cond-item">
                <div className="cw-cond-icon">
                  <Thermometer size={14} style={{ color: '#f97316' }} />
                </div>
                <div>
                  <div className="cw-cond-val">{weather.temp}°F</div>
                  <div className="cw-cond-lbl">Air Temp</div>
                </div>
              </div>
              <div className="cw-cond-item">
                <div className="cw-cond-icon">
                  <Cloud size={14} style={{ color: '#60a5fa' }} />
                </div>
                <div>
                  <div className="cw-cond-val">{weather.label}</div>
                  <div className="cw-cond-lbl">Weather</div>
                </div>
              </div>
              <div className="cw-cond-item">
                <div className="cw-cond-icon">
                  <Droplets size={14} style={{ color: '#22d3ee' }} />
                </div>
                <div>
                  <div className="cw-cond-val">{weather.precip > 0 ? `${weather.precip}mm` : 'Dry'}</div>
                  <div className="cw-cond-lbl">Precip</div>
                </div>
              </div>
              <div className="cw-cond-item">
                <div className="cw-cond-icon">
                  <Wind size={14} style={{ color: '#94a3b8' }} />
                </div>
                <div>
                  <div className="cw-cond-val">{weather.wind} mph</div>
                  <div className="cw-cond-lbl">Wind</div>
                </div>
              </div>
            </div>
            <div className="cw-cond-note">* Air temp only · water temp not available</div>
          </>
        ) : (
          <p style={{ fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic' }}>Conditions unavailable</p>
        )}
      </div>

      {/* ── Catch Log ── */}
      <div className="cw-sidebar-card">
        <div className="cw-card-label">
          <Fish size={10} />
          Catch Log
        </div>
        <div className="cw-catch-input-row">
          <input
            className="cw-catch-input"
            placeholder="What'd you catch?"
            value={catchInput}
            onChange={e => setCatchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCatch()}
          />
          <button className="cw-catch-add-btn" type="button" onClick={addCatch}>
            <Plus size={14} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {catches.map(c => (
            <div key={c.id} className="cw-catch-item">
              <div className="cw-catch-fish-icon">
                <Fish size={13} />
              </div>
              <div>
                <div className="cw-catch-species">{c.species}</div>
                <div className="cw-catch-date">{c.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
}
