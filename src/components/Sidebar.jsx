import React, { useState } from 'react';
import { Cloud, Droplets, Thermometer, Wind, Trophy, ChevronRight, Plus, Fish } from 'lucide-react';

export default function Sidebar({ profile, topSite, onNavigate }) {
  const [catchInput, setCatchInput] = useState('');
  const [recentCatches, setRecentCatches] = useState([
    { id: 1, species: 'Rainbow Trout', date: '2 days ago' },
    { id: 2, species: 'Cutthroat Trout', date: 'Last week' },
  ]);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getPersonalizedLine = () => {
    if (profile.region.includes('Northwest') && profile.experience === 'Beginner') {
      return 'Here are the best spots near Bellingham for a beginner this weekend.';
    }
    return `Finding the best ${profile.styles[0] || 'fishing'} spots in ${profile.region} for you.`;
  };

  const handleAddCatch = (e) => {
    e.preventDefault();
    if (!catchInput.trim()) return;
    const newCatch = {
      id: Date.now(),
      species: catchInput,
      date: 'Just now'
    };
    setRecentCatches([newCatch, ...recentCatches.slice(0, 2)]);
    setCatchInput('');
  };

  return (
    <aside className="w-[280px] flex-shrink-0 border-r border-[var(--border-color)] bg-[var(--bg-color)] p-6 flex flex-col gap-6 overflow-y-auto hidden lg:flex h-full">
      {/* Welcome Card */}
      <div className="p-5 bg-[var(--surface-color)] rounded-2xl border border-[var(--border-color)] shadow-sm animate-in fade-in slide-in-from-left duration-500">
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">
          {getTimeGreeting()}, {profile.name}!
        </h3>
        <p className="text-xs text-[var(--text-muted)] mb-3">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          {getPersonalizedLine()}
        </p>
      </div>

      {/* Top Pick Card */}
      {topSite && (
        <div className="p-5 bg-[var(--surface-color)] rounded-2xl border border-[var(--border-color)] shadow-sm animate-in fade-in slide-in-from-left duration-500 delay-100">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={16} className="text-[var(--primary-accent)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary-accent)]">Top Pick</span>
          </div>
          <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2 leading-tight">{topSite.name}</h4>
          <div className="inline-block px-2 py-1 bg-[var(--primary-accent)]/10 text-[var(--primary-accent)] text-xs font-black rounded mb-4">
            94 MATCH SCORE
          </div>
          <ul className="space-y-2 mb-4">
            {['Perfect for wading', 'High stocking volume'].map(reason => (
              <li key={reason} className="text-xs text-[var(--text-muted)] flex items-center gap-2">
                <div className="w-1 h-1 bg-[var(--primary-accent)] rounded-full" />
                {reason}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => onNavigate('rankings')}
            className="text-xs font-bold text-[var(--primary-accent)] hover:underline flex items-center gap-1"
          >
            See all picks <ChevronRight size={12} />
          </button>
        </div>
      )}

      {/* Conditions Widget */}
      <div className="p-5 bg-[var(--surface-color)] rounded-2xl border border-[var(--border-color)] shadow-sm animate-in fade-in slide-in-from-left duration-500 delay-200">
        <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-4">Today's Conditions</h4>
        {/* TODO: wire up NOAA/USGS API */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Thermometer size={16} className="text-orange-400" />
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase">Water</p>
              <p className="text-sm font-bold text-[var(--text-primary)]">54°F</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Cloud size={16} className="text-blue-400" />
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase">Weather</p>
              <p className="text-sm font-bold text-[var(--text-primary)]">Partly Cloudy</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets size={16} className="text-cyan-400" />
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase">Flow</p>
              <p className="text-sm font-bold text-[var(--text-primary)]">420 cfs</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind size={16} className="text-slate-400" />
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase">Wind</p>
              <p className="text-sm font-bold text-[var(--text-primary)]">8 mph</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--border-color)] text-[9px] italic text-[var(--text-muted)]">
          * Conditions are placeholder data
        </div>
      </div>

      {/* Catch Log Quick-Entry */}
      <div className="p-5 bg-[var(--surface-color)] rounded-2xl border border-[var(--border-color)] shadow-sm animate-in fade-in slide-in-from-left duration-500 delay-300">
        <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-4">Catch Log</h4>
        <form onSubmit={handleAddCatch} className="flex gap-2 mb-4">
          <input 
            type="text" 
            placeholder="What'd you catch?"
            value={catchInput}
            onChange={(e) => setCatchInput(e.target.value)}
            className="flex-1 min-w-0 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--primary-accent)] outline-none"
          />
          <button type="submit" className="p-2 bg-[var(--primary-accent)] text-[var(--bg-color)] rounded-lg hover:opacity-90 transition-opacity">
            <Plus size={16} />
          </button>
        </form>
        <div className="space-y-3">
          {recentCatches.map(c => (
            <div key={c.id} className="flex items-center gap-3">
              <div className="p-2 bg-[var(--bg-color)] rounded-lg text-[var(--primary-accent)]">
                <Fish size={14} />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)]">{c.species}</p>
                <p className="text-[10px] text-[var(--text-muted)]">{c.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
