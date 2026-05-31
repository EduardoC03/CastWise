import React, { useMemo } from 'react';
import {
  ArrowLeft, Droplets, Sun, Fish, Anchor, Accessibility, Tent,
  BookOpen, Plus, Check, Trophy, Compass, ChevronRight
} from 'lucide-react';
import { SITES } from '../data/sites';

// ── Lake photos — Unsplash, one per rank position ─────────────────────────────
const SITE_PHOTOS = [
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80&fit=crop', // rank 1
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80&fit=crop', // rank 2
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80&fit=crop', // rank 3
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=900&q=80&fit=crop', // explore
];

// ── Knowledge-graph scoring ───────────────────────────────────────────────────
//
// Each onboarding answer is a NODE. Each site attribute is a NODE.
// An EDGE connects them when there is a meaningful relationship.
// Every edge has a BASE weight. If the user listed that factor in their
// top-3 priorities, its weight is multiplied by PRIORITY_MULTIPLIER,
// making their stated priorities directly amplify the relevant edges.
//
// Node categories and their edges:
//   PROFILE nodes   → experience, frequency, gear, styles, region, travel, access
//   SITE nodes      → type, boatRamps, handLaunches, stocked, opening, species,
//                     ada_parking, region, closure, camping
//
const PRIORITY_MULTIPLIER = 1.8; // how much a top-3 priority boosts that edge

function priorityBoost(profile, factor) {
  const p = profile.priorities || [];
  return p.includes(factor) ? PRIORITY_MULTIPLIER : 1;
}

function scoreSite(site, profile) {
  if (!profile) return 60;
  let score = 40; // baseline
  const edges = []; // { label, points } — used to build drivingFeatures

  // ── EDGE: region match ────────────────────────────────────────────────────
  // Profile node: region  ↔  Site node: region
  if (profile.region && site.region) {
    const profileRegion = profile.region.toLowerCase().replace(' wa', '').trim();
    const siteRegion    = site.region.toLowerCase().trim();
    if (profileRegion === siteRegion || profile.region.toLowerCase().includes(siteRegion)) {
      const pts = Math.round(12 * priorityBoost(profile, 'region'));
      score += pts;
      edges.push({ label: 'In your region', detail: `${site.region} WA`, pts });
    }
  }

  // ── EDGE: travel distance ─────────────────────────────────────────────────
  // Profile node: travel  ↔  Site node: region (as proxy for distance)
  const travel = profile.travel || '';
  if (travel === 'Anywhere in WA') {
    const pts = Math.round(6 * priorityBoost(profile, 'travel'));
    score += pts;
    edges.push({ label: 'Within travel range', detail: 'Anywhere in WA', pts });
  } else if (travel.includes('2 hour') && site.region) {
    const pts = Math.round(5 * priorityBoost(profile, 'travel'));
    score += pts;
    edges.push({ label: 'Within travel range', detail: 'Up to 2 hours', pts });
  } else if (travel.includes('1 hour')) {
    const pts = Math.round(4 * priorityBoost(profile, 'travel'));
    score += pts;
    edges.push({ label: 'Within travel range', detail: 'Up to 1 hour', pts });
  }

  // ── EDGE: access type ─────────────────────────────────────────────────────
  // Profile node: access  ↔  Site nodes: boatRamps, handLaunches, type
  const access = profile.access || '';
  if (access === 'Boat / kayak' && site.boatRamps > 0) {
    const pts = Math.round(14 * priorityBoost(profile, 'access'));
    score += pts;
    edges.push({ label: 'Boat access', detail: `${site.boatRamps} ramp${site.boatRamps > 1 ? 's' : ''}`, pts });
  }
  if (access === 'Wade fishing' && site.type === 'River') {
    const pts = Math.round(12 * priorityBoost(profile, 'access'));
    score += pts;
    edges.push({ label: 'Wadeable river', detail: site.type, pts });
  }
  if (access === 'Bank fishing') {
    const bankPts = Math.round(8 * priorityBoost(profile, 'access'));
    score += bankPts;
    edges.push({ label: 'Bank accessible', detail: 'Shore fishing available', pts: bankPts });
  }

  // ── EDGE: fishing styles ──────────────────────────────────────────────────
  // Profile node: styles  ↔  Site nodes: type, boatRamps, species
  const styles = profile.styles || [];
  if (styles.includes('Fly fishing') && site.type === 'River') {
    const pts = Math.round(10 * priorityBoost(profile, 'styles'));
    score += pts;
    edges.push({ label: 'Good for fly fishing', detail: 'River habitat', pts });
  }
  if (styles.includes('Trolling') && site.boatRamps > 0) {
    const pts = Math.round(8 * priorityBoost(profile, 'styles'));
    score += pts;
    edges.push({ label: 'Trolling viable', detail: 'Boat ramps available', pts });
  }
  if (styles.includes('Bait fishing') && (site.type === 'Lake' || site.type === 'Pond')) {
    const pts = Math.round(6 * priorityBoost(profile, 'styles'));
    score += pts;
    edges.push({ label: 'Bait fishing spot', detail: site.type, pts });
  }
  if (styles.includes('Ice fishing') && (site.type === 'Lake' || site.type === 'Pond')) {
    const pts = Math.round(5 * priorityBoost(profile, 'styles'));
    score += pts;
    edges.push({ label: 'Ice fishing potential', detail: site.type, pts });
  }

  // ── EDGE: gear match ──────────────────────────────────────────────────────
  // Profile node: gear  ↔  Site nodes: boatRamps, type
  const gear = profile.gear || [];
  if ((gear.includes('Boat') || gear.includes('Kayak / float tube')) && site.boatRamps > 0) {
    const pts = Math.round(8 * priorityBoost(profile, 'gear'));
    score += pts;
    edges.push({ label: 'Matches your gear', detail: 'Boat launch available', pts });
  }
  if (gear.includes('Waders') && site.type === 'River') {
    const pts = Math.round(7 * priorityBoost(profile, 'gear'));
    score += pts;
    edges.push({ label: 'Waders useful here', detail: 'River site', pts });
  }
  if (gear.includes('Electronics') && site.boatRamps > 0) {
    const pts = Math.round(4 * priorityBoost(profile, 'gear'));
    score += pts;
    edges.push({ label: 'Fish finder viable', detail: 'Open water access', pts });
  }

  // ── EDGE: experience ──────────────────────────────────────────────────────
  // Profile node: experience  ↔  Site nodes: ada_parking, type, stocked
  const experience = profile.experience || '';
  if (experience === 'Beginner') {
    if (site.ada_parking > 0) {
      const pts = Math.round(8 * priorityBoost(profile, 'experience'));
      score += pts;
      edges.push({ label: 'Beginner friendly', detail: 'Easy access parking', pts });
    }
    if (site.stocked) {
      const pts = Math.round(6 * priorityBoost(profile, 'experience'));
      score += pts;
      edges.push({ label: 'Good for beginners', detail: 'Stocked water', pts });
    }
    if (site.type === 'Lake' || site.type === 'Pond') {
      const pts = Math.round(4 * priorityBoost(profile, 'experience'));
      score += pts;
      edges.push({ label: 'Calm water', detail: 'Good for learning', pts });
    }
  }
  if (experience === 'Advanced') {
    if (site.type === 'River') {
      const pts = Math.round(6 * priorityBoost(profile, 'experience'));
      score += pts;
      edges.push({ label: 'Technical fishing', detail: 'River challenge', pts });
    }
  }

  // ── EDGE: stocked / season ────────────────────────────────────────────────
  // Site nodes: stocked, opening  (always relevant, no profile node needed)
  if (site.stocked) {
    const pts = Math.round(10 * priorityBoost(profile, 'frequency'));
    score += pts;
    edges.push({ label: 'Recently stocked', detail: site.stocked, pts });
  }
  if (site.opening) {
    const pts = Math.round(6 * priorityBoost(profile, 'frequency'));
    score += pts;
    edges.push({ label: 'Season opening', detail: site.opening, pts });
  }

  // ── EDGE: ADA / accessibility ─────────────────────────────────────────────
  if (site.ada_parking > 0 && experience !== 'Beginner') {
    // already counted above for beginners; still a small bonus for everyone
    score += 2;
    edges.push({ label: 'ADA accessible', detail: `${site.ada_parking} stall${site.ada_parking > 1 ? 's' : ''}`, pts: 2 });
  }

  // Sort edges by points descending so top reasons surface first
  edges.sort((a, b) => b.pts - a.pts);

  return { score: Math.min(Math.round(score), 99), edges };
}

export function getRecommendations(profile, sites) {
  if (!sites || sites.length === 0) return { top: [], explore: null, totalScored: 0 };

  const scored = sites
    .filter(s => s.closure !== 'Closed')
    .map(site => {
      const { score, edges } = scoreSite(site, profile);
      // Top 3 edges become the "why this site" driving features
      const drivingFeatures = edges.slice(0, 3).map(e => ({ label: e.label, detail: e.detail }));
      // Fallback if no edges fired
      if (drivingFeatures.length === 0 && site.species?.length) {
        drivingFeatures.push({ label: 'Species present', detail: site.species.slice(0, 3).join(', ') });
      }
      return { site, score, drivingFeatures };
    })
    .sort((a, b) => b.score - a.score);

  const top     = scored.slice(0, 3);
  const explore = scored.slice(3).find(r =>
    r.site.region !== top[0]?.site.region || r.site.type !== top[0]?.site.type
  ) || scored[3] || null;

  return { top, explore, totalScored: scored.length };
}

// ── Main component ────────────────────────────────────────────────────────────
export default function SiteRanking({ profile, trip, onSelect, onAddToTrip }) {
  const { top, explore, totalScored } = useMemo(
    () => getRecommendations(profile, SITES),
    [profile]
  );

  if (!profile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: 48 }}>
        <Trophy size={40} style={{ opacity: 0.15, marginBottom: 16 }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--text)', marginBottom: 8 }}>No profile yet</h2>
        <p style={{ color: 'var(--text-3)', fontSize: 13 }}>Complete your angler profile to see personalized site recommendations.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1100, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-mono)', fontSize: 10,
          fontWeight: 700, letterSpacing: '0.3em',
          textTransform: 'uppercase', color: 'var(--gold)',
          marginBottom: 12,
        }}>
          <Trophy size={13} /> Your top picks · {totalScored} sites scored
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 48,
          fontWeight: 700, color: 'var(--text)',
          letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 10,
        }}>
          For {profile.name}, this week
        </h2>
        <p style={{
          fontFamily: 'var(--font-display)', fontStyle: 'italic',
          fontSize: 16, color: 'var(--text-3)',
        }}>
          Ranked by your profile · {profile.region} · {(profile.travel || '').toLowerCase()}
        </p>
      </div>

      {/* ── Top 3 cards ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginBottom: 48 }}>
        {top.map((result, idx) => (
          <RankedSiteCard
            key={result.site.id}
            rank={idx + 1}
            result={result}
            photo={SITE_PHOTOS[idx]}
            inTrip={trip?.site?.id === result.site.id}
            onSelect={onSelect}
            onAddToTrip={onAddToTrip}
          />
        ))}
      </div>

      {/* ── Explore card ── */}
      {explore && (
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-mono)', fontSize: 9,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--text-3)', marginBottom: 12,
          }}>
            <Compass size={11} /> Try something new
          </div>
          <ExploreCard
            result={explore}
            photo={SITE_PHOTOS[3]}
            inTrip={trip?.site?.id === explore.site.id}
            onSelect={onSelect}
            onAddToTrip={onAddToTrip}
          />
        </div>
      )}

      {/* ── How ranking works ── */}
      <div style={{
        marginTop: 48, paddingTop: 32,
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.25em',
          textTransform: 'uppercase', color: 'var(--gold)',
          marginBottom: 14,
        }}>
          How your picks are ranked
        </div>
        <p style={{
          fontFamily: 'var(--font-display)', fontStyle: 'italic',
          fontSize: 14, color: 'var(--text-3)', lineHeight: 1.7,
          maxWidth: 680, marginBottom: 20,
        }}>
          Every site is scored using a knowledge graph — a network of connections between
          your angler profile and each site's real attributes. Your answers from onboarding
          (experience, gear, fishing styles, preferred access, region, and travel distance)
          each become nodes in the graph. Sites earn points when their attributes — like
          boat ramps, river type, or stocking status — connect to your profile nodes.
          The factors you ranked as your top&nbsp;3 priorities receive a{' '}
          <strong style={{ color: 'var(--text-2)' }}>1.8× boost</strong> on every
          matching edge, so the things you care most about carry the most weight.
          The "Why this site" reasons shown on each card are the highest-scoring
          edges for that specific match.
        </p>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 10,
        }}>
          {[
            { label: 'Region match',      desc: 'Sites in or near your home region score higher' },
            { label: 'Access type',       desc: 'Bank, wade, or boat — matched to how you fish' },
            { label: 'Gear compatibility',desc: 'Boat ramps, rivers, and open water match your gear' },
            { label: 'Fishing styles',    desc: 'Fly, spin, bait, trolling, ice — matched to site habitat' },
            { label: 'Experience level',  desc: 'Beginner-friendly features and calm water get a boost' },
            { label: 'Stocking & season', desc: 'Recently stocked and newly opening sites rank higher' },
            { label: 'Your priorities',   desc: 'Your top 3 factors amplify all matching edges by 1.8×' },
          ].map(item => (
            <div key={item.label} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '10px 14px', flex: '1 1 200px',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 20,
          fontFamily: 'var(--font-mono)', fontSize: 9,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--text-3)', textAlign: 'center',
        }}>
          © 2026 CastWise · Professional Fishing Intelligence
        </div>
      </div>
    </div>
  );
}

// ── Ranked site card — two-column: photo left, content right ─────────────────
function RankedSiteCard({ rank, result, photo, inTrip, onSelect, onAddToTrip }) {
  const { site, score, drivingFeatures } = result;
  const isTop = rank === 1;

  return (
    <article style={{
      position: 'relative',
      borderRadius: 8,
      overflow: 'hidden',
      border: '1px solid',
      borderColor: isTop ? 'rgba(212,160,23,0.35)' : 'var(--border)',
      background: 'var(--surface)',
      boxShadow: isTop
        ? '0 8px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(212,160,23,0.15)'
        : '0 4px 24px rgba(0,0,0,0.2)',
      transition: 'transform 300ms',
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* ── Left: photo panel ── */}
      <div style={{ position: 'relative', minHeight: 380 }}>
        <img
          src={photo}
          alt={site.name}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.75)',
            transition: 'transform 700ms cubic-bezier(0.165,0.84,0.44,1)',
          }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
        {/* gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Score circle + rank badge */}
        <div style={{
          position: 'absolute', top: 28, left: 28,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            border: isTop ? '3px solid var(--gold)' : '3px solid rgba(255,255,255,0.5)',
            background: 'rgba(10,18,13,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
            color: isTop ? 'var(--gold)' : '#f0ede4',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}>
            {score}
          </div>
          <span style={{
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            color: '#ffffff',
            fontFamily: 'var(--font-mono)',
            fontSize: 8, fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            padding: '3px 8px',
          }}>
            RANK #{rank}
          </span>
        </div>
      </div>

      {/* ── Right: content panel ── */}
      <div style={{
        padding: '36px 40px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        {/* County / region */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9,
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: 'var(--gold)', fontWeight: 700, marginBottom: 8,
        }}>
          {site.county} County · {site.region} WA
        </div>

        {/* Site name */}
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 36,
          fontWeight: 700, color: 'var(--text)',
          lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 6,
        }}>
          {site.name}
        </h3>

        {/* Type + manager */}
        <p style={{
          fontFamily: 'var(--font-display)', fontStyle: 'italic',
          fontSize: 13, color: 'var(--text-3)', marginBottom: 18,
        }}>
          {site.type} · Managed by {site.manager}
        </p>

        {/* Species chips */}
        {site.species?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
            {site.species.slice(0, 3).map(sp => (
              <span key={sp} style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                border: '1px solid',
                borderColor: 'rgba(212,160,23,0.3)',
                color: 'var(--gold)',
                padding: '3px 10px',
              }}>
                {sp}
              </span>
            ))}
          </div>
        )}

        {/* Why this site */}
        <div style={{ marginBottom: 28 }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 9,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--text-3)', fontWeight: 700, marginBottom: 10,
          }}>
            Why this site
          </p>
          {drivingFeatures.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start',
              gap: 8, marginBottom: 8, fontSize: 13,
            }}>
              <span style={{ color: 'var(--gold)', flexShrink: 0, fontSize: 10, marginTop: 2 }}>▶</span>
              <span style={{ color: 'var(--text)' }}>
                <strong style={{ fontWeight: 600 }}>{f.label}:</strong>{' '}
                <span style={{ color: 'var(--text-3)', fontStyle: 'italic' }}>{f.detail}</span>
              </span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: 24, alignItems: 'center',
          paddingTop: 20,
          borderTop: '1px solid',
          borderColor: 'rgba(212,160,23,0.12)',
        }}>
          <button
            onClick={() => onSelect && onSelect(site)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              fontWeight: 700, color: 'var(--text)',
              display: 'flex', alignItems: 'center', gap: 4,
              transition: 'color 160ms',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}
          >
            View Details <ChevronRight size={12} />
          </button>

          {inTrip ? (
            <button disabled style={{
              background: 'none', border: 'none', cursor: 'default',
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              fontWeight: 700, color: 'var(--green-bright)',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <Check size={11} /> Added to trip
            </button>
          ) : (
            <button
              onClick={() => onAddToTrip && onAddToTrip(site)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontFamily: 'var(--font-mono)', fontSize: 10,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                fontWeight: 700, color: 'var(--gold)',
                display: 'flex', alignItems: 'center', gap: 4,
                transition: 'opacity 160ms',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <Plus size={11} /> Add to trip
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// ── Explore card ──────────────────────────────────────────────────────────────
function ExploreCard({ result, photo, inTrip, onSelect, onAddToTrip }) {
  const { site, score, drivingFeatures } = result;
  return (
    <article
      onClick={() => onSelect && onSelect(site)}
      style={{
        position: 'relative', borderRadius: 8, overflow: 'hidden',
        border: '1px solid var(--border)', background: 'var(--surface)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        display: 'grid', gridTemplateColumns: '0.6fr 1fr',
        cursor: 'pointer', transition: 'border-color 200ms',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,160,23,0.4)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* Photo */}
      <div style={{ position: 'relative', minHeight: 200 }}>
        <img src={photo} alt={site.name} style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', filter: 'brightness(0.7)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.3), transparent)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 20, left: 20,
          fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700,
          color: 'var(--text-3)',
        }}>
          {score}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 6 }}>
          {site.county} County · {site.region} WA
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
          {site.name}
        </div>
        {drivingFeatures[0] && (
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
            {drivingFeatures[0].label}: <span style={{ color: 'var(--text-2)', fontStyle: 'italic' }}>{drivingFeatures[0].detail}</span>
          </div>
        )}
        {!inTrip && (
          <button
            onClick={e => { e.stopPropagation(); onAddToTrip && onAddToTrip(site); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              fontWeight: 700, color: 'var(--gold)',
              display: 'inline-flex', alignItems: 'center', gap: 4,
              alignSelf: 'flex-start',
            }}
          >
            <Plus size={11} /> Add to trip
          </button>
        )}
      </div>
    </article>
  );
}

// ── Site detail view ──────────────────────────────────────────────────────────
export function SiteProfile({ site, inTrip, onBack, onAdd }) {
  return (
    <div className="cw-screen" style={{ maxWidth: 700 }}>
      <button className="cw-back" onClick={onBack}><ArrowLeft size={12} /> Back</button>
      <div style={{ marginBottom: 24 }}>
        <div className="cw-site-county">{site.county} County · {site.region} WA · {site.type}</div>
        <h1 className="cw-site-name">{site.name}</h1>
        <div className="cw-site-mgr">Managed by {site.manager}</div>
      </div>
      {(site.stocked || site.opening) && (
        <div className="cw-alerts">
          {site.stocked && (
            <div className="cw-alert cw-alert-stock">
              <Droplets size={14} />
              <div><strong>Recently stocked</strong><span>{site.stocked}</span></div>
            </div>
          )}
          {site.opening && (
            <div className="cw-alert cw-alert-open">
              <Sun size={14} />
              <div><strong>Season opening</strong><span>{site.opening}</span></div>
            </div>
          )}
        </div>
      )}
      <div className="cw-block cw-block-accent-green">
        <div className="cw-block-title"><Fish size={11} /> Likely Species</div>
        <div className="cw-chips">
          {(site.species || []).map(sp => <span key={sp} className="cw-chip">{sp}</span>)}
        </div>
        {!site.isCurated && <div className="cw-disclaim">Species inferred from waterbody type. Verify locally before fishing.</div>}
      </div>
      <div className="cw-block cw-block-accent-green">
        <div className="cw-block-title"><Anchor size={11} /> Access &amp; Infrastructure</div>
        <div className="cw-facts">
          <div className="cw-fact"><div className="cw-fact-n">{site.boatRamps ?? 0}</div><div className="cw-fact-l">Boat ramps</div></div>
          <div className="cw-fact"><div className="cw-fact-n">{site.handLaunches ?? 0}</div><div className="cw-fact-l">Hand launches</div></div>
          <div className="cw-fact"><div className="cw-fact-n">{site.fishingPlatforms ?? 0}</div><div className="cw-fact-l">Platforms</div></div>
          <div className="cw-fact"><div className="cw-fact-n">{site.restrooms ?? 0}</div><div className="cw-fact-l">Restrooms</div></div>
        </div>
        {(site.ada_parking > 0 || site.ada_loading || site.ada_restrooms > 0) && (
          <div className="cw-detail">
            <Accessibility size={11} />
            ADA: {[
              site.ada_parking > 0 && `${site.ada_parking} parking stall${site.ada_parking > 1 ? 's' : ''}`,
              site.ada_loading && 'loading platform',
              site.ada_restrooms > 0 && `${site.ada_restrooms} restroom${site.ada_restrooms > 1 ? 's' : ''}`,
            ].filter(Boolean).join(', ')}
          </div>
        )}
        {site.ramp_surface && <div className="cw-detail">Ramp surface: {site.ramp_surface}</div>}
        {site.camping && <div className="cw-detail"><Tent size={11} /> Camping allowed</div>}
      </div>
      <div className="cw-block cw-block-accent-gold">
        <div className="cw-block-title"><BookOpen size={11} /> Access Regulations</div>
        <div className="cw-detail-block"><strong>Closure status:</strong> {site.closure}</div>
        {site.openDates && <div className="cw-detail-block">{site.openDates}</div>}
        {site.notes && <div className="cw-detail-block" style={{ fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>{site.notes}</div>}
        <div className="cw-disclaim">Always verify current rules at wdfw.wa.gov before fishing.</div>
      </div>
      <div style={{ marginTop: 8 }}>
        {inTrip ? (
          <button className="cw-btn" disabled style={{ background: 'rgba(90,173,102,0.12)', color: 'var(--green-bright)' }}>
            <Check size={14} /> Added to trip
          </button>
        ) : (
          <button className="cw-btn cw-btn-primary cw-btn-full" onClick={onAdd}>
            <Plus size={14} /> Add to next trip
          </button>
        )}
      </div>
    </div>
  );
}
