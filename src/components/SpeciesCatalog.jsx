import React, { useState } from 'react';
import { Fish, Search } from 'lucide-react';

const SPECIES = [
  { name: 'Rainbow Trout',    type: 'Trout',   habitat: 'Lakes & Rivers', season: 'Year-round',    notes: 'Most stocked species in WA. Hatchery fish in most public lakes.' },
  { name: 'Cutthroat Trout',  type: 'Trout',   habitat: 'Rivers',         season: 'Year-round',    notes: 'Native to WA. Found in high-elevation streams and coastal rivers.' },
  { name: 'Brown Trout',      type: 'Trout',   habitat: 'Rivers',         season: 'Year-round',    notes: 'Introduced species. Prefers cold, clear rivers.' },
  { name: 'Brook Trout',      type: 'Trout',   habitat: 'Mountain Lakes', season: 'Year-round',    notes: 'Common in high-elevation alpine lakes. Small but feisty.' },
  { name: 'Lake Trout',       type: 'Trout',   habitat: 'Deep Lakes',     season: 'Year-round',    notes: 'Found in large, deep cold-water lakes. Requires downrigger trolling.' },
  { name: 'Chinook Salmon',   type: 'Salmon',  habitat: 'Rivers & Marine',season: 'Spring–Fall',   notes: 'Largest Pacific salmon. Major runs in Columbia and Puget Sound rivers.' },
  { name: 'Coho Salmon',      type: 'Salmon',  habitat: 'Rivers & Marine',season: 'Fall',          notes: 'Strong fighters. Fall runs in coastal rivers.' },
  { name: 'Sockeye Salmon',   type: 'Salmon',  habitat: 'Rivers & Lakes', season: 'Summer',        notes: 'Lake Wenatchee and Okanogan systems. Difficult to catch on hook-and-line.' },
  { name: 'Pink Salmon',      type: 'Salmon',  habitat: 'Rivers',         season: 'Odd years Aug–Sep', notes: 'Smallest Pacific salmon. Huge runs in odd-numbered years.' },
  { name: 'Chum Salmon',      type: 'Salmon',  habitat: 'Rivers',         season: 'Fall',          notes: 'Hood Canal and Puget Sound rivers. Underrated fighter.' },
  { name: 'Steelhead',        type: 'Trout',   habitat: 'Rivers',         season: 'Winter & Summer', notes: 'Sea-run rainbow trout. Premier game fish. Selective gear rules common.' },
  { name: 'Largemouth Bass',  type: 'Bass',    habitat: 'Warm Lakes',     season: 'Spring–Fall',   notes: 'Eastern WA reservoirs and western lowland lakes. Warm water species.' },
  { name: 'Smallmouth Bass',  type: 'Bass',    habitat: 'Rivers & Lakes', season: 'Spring–Fall',   notes: 'Columbia River system. Likes rocky structure and current.' },
  { name: 'Walleye',          type: 'Other',   habitat: 'Eastern WA Lakes',season: 'Year-round',   notes: 'Banks Lake and Columbia River system. Best at dawn/dusk.' },
  { name: 'Yellow Perch',     type: 'Other',   habitat: 'Lakes',          season: 'Year-round',    notes: 'Easy to catch. Great table fare. Common in eastern WA.' },
  { name: 'Channel Catfish',  type: 'Other',   habitat: 'Warm Rivers',    season: 'Summer',        notes: 'Columbia River and lower Snake River. Night fishing is productive.' },
  { name: 'Sturgeon',         type: 'Other',   habitat: 'Columbia River', season: 'Year-round',    notes: 'White sturgeon. Strict size and bag limits. Catch-and-release only in some areas.' },
  { name: 'Halibut',          type: 'Marine',  habitat: 'Strait / Coast', season: 'Spring–Summer', notes: 'Marine season set annually by WDFW. Very popular in Strait of Juan de Fuca.' },
  { name: 'Lingcod',          type: 'Marine',  habitat: 'Marine',         season: 'Spring–Summer', notes: 'Rocky reefs and wrecks. Great eating. Aggressive predator.' },
  { name: 'Rockfish',         type: 'Marine',  habitat: 'Marine',         season: 'Year-round',    notes: 'Multiple species. Puget Sound and Strait. Bag limit and depth restrictions apply.' },
];

const TYPES = ['All', 'Trout', 'Salmon', 'Bass', 'Marine', 'Other'];

export default function SpeciesCatalog() {
  const [query,  setQuery]  = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = SPECIES.filter(s => {
    const matchType  = filter === 'All' || s.type === filter;
    const matchQuery = s.name.toLowerCase().includes(query.toLowerCase());
    return matchType && matchQuery;
  });

  return (
    <div className="cw-screen">
      <div className="cw-page-eyebrow">
        <Fish size={11} /> Species Catalog
      </div>
      <h1 className="cw-page-title">Washington Fish Species</h1>
      <p className="cw-page-sub">Common sport fish found in WA waters — seasons and habitat at a glance.</p>

      {/* Search */}
      <div className="cw-search">
        <Search size={14} />
        <input
          placeholder="Search species…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* Type filter pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {TYPES.map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter(t)}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              border: '1px solid',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 160ms',
              background:     filter === t ? 'var(--gold)'        : 'var(--surface)',
              borderColor:    filter === t ? 'var(--gold)'        : 'var(--border)',
              color:          filter === t ? 'var(--bg)'          : 'var(--text-3)',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Species list */}
      {filtered.length === 0 ? (
        <div className="cw-empty">
          <Fish size={40} className="cw-empty-icon" />
          <p>No species match your search.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(s => (
            <div key={s.name} className="cw-block" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 17,
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: 3,
                  }}>
                    {s.name}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span className="cw-chip" style={{ fontSize: 10 }}>{s.habitat}</span>
                    <span className="cw-chip" style={{ fontSize: 10, color: 'var(--gold-soft)', borderColor: 'rgba(212,160,23,0.3)', background: 'var(--gold-dim)' }}>
                      {s.season}
                    </span>
                  </div>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--text-3)',
                  flexShrink: 0,
                  paddingTop: 3,
                }}>
                  {s.type}
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-3)', margin: 0, lineHeight: 1.5 }}>{s.notes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
