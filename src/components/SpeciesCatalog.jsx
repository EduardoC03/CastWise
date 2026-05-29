import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

// Dynamically import all images from the assets folder
const images = import.meta.glob('../assets/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' });

// Helper to get the correct asset URL
const getPhoto = (path) => images[path] || images['../assets/welcome-bg.jpg'];

// ── Species data — your original list + photos + stats ───────────────────────
const SPECIES = [
  { name: 'Rainbow Trout',   latin: 'Oncorhynchus mykiss',          type: 'Trout',  habitat: 'Lakes & Rivers', season: 'Year-round',        weight: '2–8 lbs',    bait: 'Flies / Lures',  notes: 'Most stocked species in WA. Hatchery fish in most public lakes.',                           photo: getPhoto('../assets/rainbow_trout.png') },
  { name: 'Cutthroat Trout', latin: 'Oncorhynchus clarkii',         type: 'Trout',  habitat: 'Rivers',         season: 'Year-round',        weight: '1–5 lbs',    bait: 'Small Flies',    notes: 'Native to WA. Found in high-elevation streams and coastal rivers.',                         photo: getPhoto('../assets/Cutthroat trout.png') },
  { name: 'Brown Trout',     latin: 'Salmo trutta',                  type: 'Trout',  habitat: 'Rivers',         season: 'Year-round',        weight: '1–5 lbs',    bait: 'Spinners',       notes: 'Introduced species. Prefers cold, clear rivers.',                                           photo: getPhoto('../assets/brown trout.png') },
  { name: 'Brook Trout',     latin: 'Salvelinus fontinalis',         type: 'Trout',  habitat: 'Mountain Lakes', season: 'Year-round',        weight: '0.5–2 lbs',  bait: 'Dry Flies',      notes: 'Common in high-elevation alpine lakes. Small but feisty.',                                 photo: getPhoto('../assets/brook trout.png') },
  { name: 'Lake Trout',      latin: 'Salvelinus namaycush',          type: 'Trout',  habitat: 'Deep Lakes',     season: 'Year-round',        weight: '5–20 lbs',   bait: 'Deep Jigs',      notes: 'Found in large, deep cold-water lakes. Requires downrigger trolling.',                      photo: getPhoto('../assets/Lake trout.png') },
  { name: 'Steelhead',       latin: 'Oncorhynchus mykiss irideus',   type: 'Trout',  habitat: 'Rivers',         season: 'Winter & Summer',   weight: '8–20 lbs',   bait: 'Jigs / Flies',   notes: 'Sea-run rainbow trout. Premier game fish. Selective gear rules common.',                    photo: getPhoto('../assets/Steelhead.png') },
  { name: 'Chinook Salmon',  latin: 'Oncorhynchus tshawytscha',      type: 'Salmon', habitat: 'Rivers & Marine',season: 'Spring–Fall',       weight: '15–40 lbs',  bait: 'Roe Bags',       notes: 'Largest Pacific salmon. Major runs in Columbia and Puget Sound rivers.',                    photo: getPhoto('../assets/chinook salmon.png') },
  { name: 'Coho Salmon',     latin: 'Oncorhynchus kisutch',          type: 'Salmon', habitat: 'Rivers & Marine',season: 'Fall',              weight: '8–12 lbs',   bait: 'Spoons',         notes: 'Strong fighters. Fall runs in coastal rivers.',                                             photo: getPhoto('../assets/Coho Salmon.png') },
  { name: 'Sockeye Salmon',  latin: 'Oncorhynchus nerka',            type: 'Salmon', habitat: 'Rivers & Lakes', season: 'Summer',            weight: '5–8 lbs',    bait: 'Flies',          notes: 'Lake Wenatchee and Okanogan systems. Difficult to catch on hook-and-line.',                 photo: getPhoto('../assets/Sockeye Salmon.png') },
  { name: 'Pink Salmon',     latin: 'Oncorhynchus gorbuscha',        type: 'Salmon', habitat: 'Rivers',         season: 'Odd years Aug–Sep', weight: '3–5 lbs',    bait: 'Small Spoons',   notes: 'Smallest Pacific salmon. Huge runs in odd-numbered years.',                                 photo: getPhoto('../assets/Pink Salmon.png') },
  { name: 'Chum Salmon',     latin: 'Oncorhynchus keta',             type: 'Salmon', habitat: 'Rivers',         season: 'Fall',              weight: '8–15 lbs',   bait: 'Flies / Spoons', notes: 'Hood Canal and Puget Sound rivers. Underrated fighter.',                                    photo: getPhoto('../assets/Chum salmon.png') },
  { name: 'Largemouth Bass', latin: 'Micropterus salmoides',         type: 'Bass',   habitat: 'Warm Lakes',     season: 'Spring–Fall',       weight: '3–10 lbs',   bait: 'Frogs / Jigs',   notes: 'Eastern WA reservoirs and western lowland lakes. Warm water species.',                      photo: getPhoto('../assets/largemouth bass.png') },
  { name: 'Smallmouth Bass', latin: 'Micropterus dolomieu',          type: 'Bass',   habitat: 'Rivers & Lakes', season: 'Spring–Fall',       weight: '1–5 lbs',    bait: 'Crayfish',       notes: 'Columbia River system. Likes rocky structure and current.',                                 photo: getPhoto('../assets/Smallmouth bass.png') },
  { name: 'Walleye',         latin: 'Sander vitreus',                type: 'Other',  habitat: 'Eastern WA Lakes',season: 'Year-round',       weight: '2–8 lbs',    bait: 'Jigs / Minnows', notes: 'Banks Lake and Columbia River system. Best at dawn/dusk.',                                  photo: getPhoto('../assets/Walleye.png') },
  { name: 'Yellow Perch',    latin: 'Perca flavescens',              type: 'Other',  habitat: 'Lakes',          season: 'Year-round',        weight: '0.5–1 lb',   bait: 'Small Jigs',     notes: 'Easy to catch. Great table fare. Common in eastern WA.',                                    photo: getPhoto('../assets/yellowperch.png') },
  { name: 'Channel Catfish', latin: 'Ictalurus punctatus',           type: 'Other',  habitat: 'Warm Rivers',    season: 'Summer',            weight: '2–10 lbs',   bait: 'Stink Bait',     notes: 'Columbia River and lower Snake River. Night fishing is productive.',                        photo: getPhoto('../assets/Channel catfish.png') },
  { name: 'Sturgeon',        latin: 'Acipenser transmontanus',       type: 'Other',  habitat: 'Columbia River', season: 'Year-round',        weight: '20–100+ lbs',bait: 'Shrimp / Smelt', notes: 'White sturgeon. Strict size and bag limits. Catch-and-release only in some areas.',         photo: getPhoto('../assets/Sturgeon.png') },
  { name: 'Halibut',         latin: 'Hippoglossus stenolepis',       type: 'Marine', habitat: 'Strait / Coast', season: 'Spring–Summer',     weight: '20–100 lbs', bait: 'Herring / Jigs', notes: 'Marine season set annually by WDFW. Very popular in Strait of Juan de Fuca.',               photo: getPhoto('../assets/Halibut.png') },
  { name: 'Lingcod',         latin: 'Ophiodon elongatus',            type: 'Marine', habitat: 'Marine',         season: 'Spring–Summer',     weight: '5–30 lbs',   bait: 'Live Bait',      notes: 'Rocky reefs and wrecks. Great eating. Aggressive predator.',                               photo: getPhoto('../assets/Lingcod.png') },
  { name: 'Rockfish',        latin: 'Sebastes spp.',                 type: 'Marine', habitat: 'Marine',         season: 'Year-round',        weight: '1–5 lbs',    bait: 'Jigs / Shrimp',  notes: 'Multiple species. Puget Sound and Strait. Bag limit and depth restrictions apply.',         photo: getPhoto('../assets/Rock fish.png') },
];

const TYPES = ['All', 'Trout', 'Salmon', 'Bass', 'Marine', 'Other'];

const FALLBACK = { Trout: '#1a3020', Salmon: '#2a1a10', Bass: '#1a2a10', Marine: '#0a1a2a', Other: '#1a1a2a' };

export default function SpeciesCatalog() {
  const [query,       setQuery]       = useState('');
  const [filter,      setFilter]      = useState('All');
  const [suggest,     setSuggest]     = useState(false);
  const [suggestText, setSuggestText] = useState('');

  const filtered = SPECIES.filter(s => {
    const matchType  = filter === 'All' || s.type === filter;
    const matchQuery = s.name.toLowerCase().includes(query.toLowerCase());
    return matchType && matchQuery;
  });

  return (
    <div style={{ padding: '28px 32px', minHeight: '100%', background: 'var(--bg)' }}>

      {/* ── Header row: title left, search right ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6,
          }}>
            Species Catalog
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700,
            color: 'var(--text)', letterSpacing: '-0.02em', margin: 0,
          }}>
            Washington Fish Species
          </h2>
        </div>

        {/* Search — top right per mockup */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 99, padding: '8px 16px',
          minWidth: 220, alignSelf: 'center',
          transition: 'border-color 180ms',
        }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--gold)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <Search size={14} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search species…"
            style={{
              background: 'none', border: 'none', outline: 'none',
              fontFamily: 'var(--font-sans)', fontSize: 13,
              color: 'var(--text)', width: '100%',
            }}
          />
        </div>
      </div>

      {/* ── Type filter pills ── */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        {TYPES.map(t => (
          <button key={t} type="button" onClick={() => setFilter(t)} style={{
            padding: '6px 14px', borderRadius: 99,
            fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'all 160ms', border: '1px solid',
            background:  filter === t ? 'var(--gold)'  : 'var(--surface)',
            borderColor: filter === t ? 'var(--gold)'  : 'var(--border)',
            color:       filter === t ? 'var(--bg)'    : 'var(--text-3)',
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Grid — all species, no pagination ── */}
      {filtered.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '60px 32px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.15 }}>🐟</div>
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--text-3)', fontSize: 14 }}>
            No species match your search.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 18,
        }}>
          {filtered.map(s => <SpeciesCard key={s.name} species={s} />)}

          {/* Suggest species slot */}
          <div
            onClick={() => setSuggest(true)}
            style={{
              aspectRatio: '1 / 1', borderRadius: 12,
              border: '2px dashed var(--border)', background: 'var(--surface)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', gap: 10, padding: 24, textAlign: 'center',
              transition: 'border-color 200ms, background 200ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'var(--gold-dim)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}
          >
            {suggest ? (
              <div style={{ width: '100%' }} onClick={e => e.stopPropagation()}>
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em',
                  textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10,
                }}>
                  Suggest a species
                </p>
                <input
                  autoFocus
                  value={suggestText}
                  onChange={e => setSuggestText(e.target.value)}
                  placeholder="e.g. Tiger Muskie"
                  style={{
                    width: '100%', background: 'var(--bg-raised)',
                    border: '1px solid var(--gold)', borderRadius: 6,
                    padding: '8px 10px', fontSize: 13, color: 'var(--text)',
                    fontFamily: 'var(--font-sans)', outline: 'none', marginBottom: 10,
                  }}
                />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => { alert(`Thanks! "${suggestText}" noted.`); setSuggest(false); setSuggestText(''); }}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 6,
                      background: 'var(--gold)', color: 'var(--bg)',
                      border: 'none', fontFamily: 'var(--font-sans)',
                      fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => { setSuggest(false); setSuggestText(''); }}
                    style={{
                      padding: '8px 12px', borderRadius: 6,
                      background: 'transparent', color: 'var(--text-3)',
                      border: '1px solid var(--border)', fontFamily: 'var(--font-sans)',
                      fontSize: 12, cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  border: '1.5px dashed var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-3)',
                }}>
                  <Plus size={20} />
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                  Suggest a Species
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-3)', margin: 0, lineHeight: 1.5 }}>
                  Help us expand the catalog by suggesting a missing species.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Individual species card ───────────────────────────────────────────────────
function SpeciesCard({ species: s }) {
  const [imgError, setImgError] = useState(false);
  const [hovered,  setHovered]  = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', aspectRatio: '1 / 1',
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
        cursor: 'pointer',
        background: FALLBACK[s.type] || '#1a2a1a',
      }}
    >
      {/* Photo */}
      {!imgError && (
        <img
          src={s.photo}
          alt={s.name}
          onError={() => setImgError(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 700ms cubic-bezier(0.165,0.84,0.44,1)',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
          }}
        />
      )}

      {/* Bottom gradient — always on */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 55%)',
        pointerEvents: 'none',
      }} />

      {/* Name + latin — fades out on hover */}
      <div style={{
        position: 'absolute', bottom: 20, left: 20, right: 20,
        transition: 'opacity 300ms', opacity: hovered ? 0 : 1,
        pointerEvents: 'none',
      }}>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600,
          color: '#ffffff', marginBottom: 4, lineHeight: 1.1,
        }}>
          {s.name}
        </h3>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 9,
          letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)',
        }}>
          {s.latin}
        </p>
      </div>

      {/* Stats overlay — slides up on hover */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: 24,
        background: 'linear-gradient(to top, rgba(116,91,16,0.97), rgba(116,91,16,0.82))',
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 380ms cubic-bezier(0.165,0.84,0.44,1)',
        pointerEvents: hovered ? 'auto' : 'none',
      }}>
        <h4 style={{
          fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700,
          color: '#d4a017', marginBottom: 16, letterSpacing: '-0.01em',
        }}>
          Quick Stats
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', width: '100%', marginBottom: 18 }}>
          {[
            { label: 'Best Season', value: s.season  },
            { label: 'Avg Weight',  value: s.weight  },
            { label: 'Habitat',     value: s.habitat },
            { label: 'Bait Pref',   value: s.bait    },
          ].map(({ label, value }, i) => (
            <div key={label} style={{
              borderBottom: i < 2 ? '1px solid rgba(212,160,23,0.25)' : 'none',
              paddingBottom: i < 2 ? 8 : 0,
              paddingTop: i >= 2 ? 4 : 0,
            }}>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: 8,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)', marginBottom: 3,
              }}>
                {label}
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: '#ffffff' }}>
                {value}
              </p>
            </div>
          ))}
        </div>
        <button style={{
          padding: '7px 20px', borderRadius: 99,
          background: '#d4a017', color: '#0d1a10',
          border: 'none', fontFamily: 'var(--font-mono)',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', cursor: 'pointer', transition: 'background 160ms',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#ffffff'}
          onMouseLeave={e => e.currentTarget.style.background = '#d4a017'}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
