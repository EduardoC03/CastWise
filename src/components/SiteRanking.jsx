import React, { useMemo, useState } from 'react';
import {
  ArrowLeft, Droplets, Sun, Fish, Anchor, Accessibility, Tent,
  BookOpen, Plus, Check, Trophy, Compass, ChevronRight
} from 'lucide-react';
import { SITES } from '../data/sites';
import useWikiPhoto from '../utils/useWikiPhoto';

// ── Scoring ───────────────────────────────────────────────────────────────────
function scoreSite(site, profile) {
  let score = 60;
  if (!profile) return score;
  const access = profile.access || '';
  if (access === 'Boat / kayak' && site.boatRamps > 0)    score += 12;
  if (access === 'Bank fishing' && site.handLaunches >= 0) score += 8;
  if (access === 'Wade fishing' && site.type === 'River')  score += 10;
  if (site.stocked)  score += 10;
  if (site.opening)  score += 6;
  if (profile.region && site.region &&
      profile.region.toLowerCase().includes(site.region.toLowerCase().split(' ')[0])) {
    score += 8;
  }
  if (profile.experience === 'Beginner' && site.ada_parking > 0) score += 4;
  return Math.min(score, 99);
}

export function getRecommendations(profile, sites) {
  if (!sites || sites.length === 0) return { top: [], explore: null, totalScored: 0 };
  const scored = sites
    .filter(s => s.closure !== 'Closed')
    .map(site => {
      const score = scoreSite(site, profile);
      const drivingFeatures = [];
      if (site.stocked)         drivingFeatures.push({ label: 'Recently stocked', detail: site.stocked });
      if (site.opening)         drivingFeatures.push({ label: 'Season opening',   detail: site.opening });
      if (site.boatRamps > 0)   drivingFeatures.push({ label: 'Boat access',      detail: `${site.boatRamps} ramp${site.boatRamps > 1 ? 's' : ''}` });
      if (site.ada_parking > 0) drivingFeatures.push({ label: 'ADA accessible',   detail: `${site.ada_parking} stall${site.ada_parking > 1 ? 's' : ''}` });
      if (site.species?.length) drivingFeatures.push({ label: 'Species present',  detail: site.species.slice(0, 3).join(', ') });
      return { site, score, drivingFeatures: drivingFeatures.slice(0, 3) };
    })
    // ── FIX: Added deterministic tie-breaker to prevent sites jumping around on refresh
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.site.name.localeCompare(b.site.name);
    });

  const top     = scored.slice(0, 2); // mockup shows top 2
  const explore = scored.slice(2).find(r =>
    r.site.region !== top[0]?.site.region || r.site.type !== top[0]?.site.type
  ) || scored[2] || null;

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
      <header style={{ marginBottom: 48 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'var(--gold)', marginBottom: 14,
        }}>
          <Trophy size={13} /> Your top picks · {totalScored} sites scored
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 700,
          color: 'var(--text)', letterSpacing: '-0.03em',
          lineHeight: 1.05, marginBottom: 10,
        }}>
          For {profile.name}, this week
        </h2>
        <p style={{
          fontFamily: 'var(--font-display)', fontStyle: 'italic',
          fontSize: 17, color: 'var(--text-3)',
        }}>
          Ranked by your profile · {profile.region} · {(profile.travel || '').toLowerCase()}
        </p>
      </header>

      {/* ── Cards ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, marginBottom: 48 }}>
        {top.map((result, idx) => (
          <RankedSiteCard
            key={result.site.id}
            rank={idx + 1}
            result={result}
            inTrip={trip?.site?.id === result.site.id}
            onSelect={onSelect}
            onAddToTrip={onAddToTrip}
          />
        ))}
      </div>

      {/* ── Explore card ── */}
      {explore && (
        <div style={{ marginBottom: 40 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12,
          }}>
            <Compass size={11} /> Try something new
          </div>
          <ExploreCard
            result={explore}
              inTrip={trip?.site?.id === explore.site.id}
            onSelect={onSelect}
            onAddToTrip={onAddToTrip}
          />
        </div>
      )}

      {/* ── Footer ── */}
      <footer style={{
        marginTop: 60, paddingTop: 28,
        borderTop: '1px solid',
        borderColor: 'rgba(212,160,23,0.12)',
        textAlign: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 9,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'var(--text-3)',
      }}>
        © 2026 CastWise Forecasting · Professional Fishing Intelligence
      </footer>
    </div>
  );
}

// ── Ranked card — two column, photo left with score overlay, content right ────
function RankedSiteCard({ rank, result, inTrip, onSelect, onAddToTrip }) {
  const { site, score, drivingFeatures } = result;
  const isTop = rank === 1;
  const [hovered, setHovered] = useState(false);
  const { photoUrl, loading } = useWikiPhoto(site.name);
  const photo = photoUrl;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 8, overflow: 'hidden',
        border: '1px solid',
        borderColor: isTop ? 'rgba(212,160,23,0.25)' : 'rgba(212,160,23,0.12)',
        background: 'var(--surface)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
        transition: 'transform 300ms ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
      }}
    >
      {/* ── Photo panel ── */}
      <div style={{ position: 'relative', minHeight: 400, overflow: 'hidden' }}>
        {/* Loading shimmer */}
        {loading && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface-2) 50%, var(--surface) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite',
          }} />
        )}
        {/* Real Wikipedia photo or dark fallback */}
        {photo ? (
          <img
            src={photo}
            alt={site.name}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.75)',
              transition: 'transform 700ms cubic-bezier(0.165,0.84,0.44,1)',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        ) : !loading && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #0d1a10 0%, #1a2e1f 50%, #0a1a0d 100%)',
          }} />
        )}
        {/* Right-to-left gradient so photo fades into content panel */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Score circle + rank label */}
        <div style={{
          position: 'absolute', top: 28, left: 28,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            border: isTop ? '4px solid var(--gold)' : '4px solid rgba(200,200,200,0.6)',
            background: 'rgba(10,18,13,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
            color: isTop ? 'var(--gold)' : '#f0ede4',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}>
            {score}
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700,
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: '#ffffff',
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(4px)',
            padding: '3px 8px',
          }}>
            RANK #{rank}
          </span>
        </div>
      </div>

      {/* ── Content panel ── */}
      <div style={{
        padding: '36px 48px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        {/* County / region */}
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 9,
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: 'var(--gold)', fontWeight: 700, marginBottom: 8,
        }}>
          {site.county} County · {site.region} WA
        </p>

        {/* Site name */}
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700,
          color: 'var(--text)', lineHeight: 1.05,
          letterSpacing: '-0.02em', marginBottom: 6,
        }}>
          {site.name}
        </h3>

        {/* Type + manager */}
        <p style={{
          fontFamily: 'var(--font-display)', fontStyle: 'italic',
          fontSize: 13, color: 'var(--text-3)', marginBottom: 22,
        }}>
          {site.type} · Managed by {site.manager}
        </p>

        {/* Species chips — outlined style matching mockup */}
        {site.species?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 26 }}>
            {site.species.slice(0, 3).map(sp => (
              <span key={sp} style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                border: '1px solid',
                borderColor: 'rgba(212,160,23,0.35)',
                color: 'var(--gold)',
                padding: '4px 10px',
              }}>
                {sp}
              </span>
            ))}
          </div>
        )}

        {/* Why this site */}
        <div style={{ marginBottom: 32 }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 9,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--text-3)', fontWeight: 700, marginBottom: 12,
          }}>
            Why this site
          </p>
          {drivingFeatures.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start',
              gap: 8, marginBottom: 10, fontSize: 13,
            }}>
              <span style={{
                color: 'var(--gold)', flexShrink: 0,
                fontSize: 9, marginTop: 3, lineHeight: 1,
              }}>
                ▶
              </span>
              <p style={{ margin: 0, color: 'var(--text)', lineHeight: 1.5 }}>
                <strong style={{ fontWeight: 600 }}>{f.label}:</strong>{' '}
                <span style={{ color: 'var(--text-3)', fontStyle: 'italic' }}>{f.detail}</span>
              </p>
            </div>
          ))}
        </div>

        {/* CTAs — plain text per mockup */}
        <div style={{
          display: 'flex', gap: 32, alignItems: 'center',
          paddingTop: 20,
          borderTop: '1px solid rgba(212,160,23,0.12)',
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
              background: 'none', border: 'none', cursor: 'default', padding: 0,
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
function ExploreCard({ result, inTrip, onSelect, onAddToTrip }) {
  const { site, score, drivingFeatures } = result;
  const [hovered, setHovered] = useState(false);
  const { photoUrl, loading } = useWikiPhoto(site.name);
  const photo = photoUrl;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect && onSelect(site)}
      style={{
        position: 'relative', borderRadius: 8, overflow: 'hidden',
        border: '1px solid var(--border)', background: 'var(--surface)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        display: 'grid', gridTemplateColumns: '0.6fr 1fr',
        cursor: 'pointer',
        transition: 'border-color 200ms, transform 300ms',
        borderColor: hovered ? 'rgba(212,160,23,0.4)' : 'var(--border)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <div style={{ position: 'relative', minHeight: 200, overflow: 'hidden' }}>
        {loading && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface-2) 50%, var(--surface) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite',
          }} />
        )}
        {photo ? (
          <img src={photo} alt={site.name} style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', filter: 'brightness(0.7)',
            transition: 'transform 700ms cubic-bezier(0.165,0.84,0.44,1)',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }} />
        ) : !loading && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #0d1a10 0%, #1a2e1f 50%, #0a1a0d 100%)',
          }} />
        )}
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
      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 6 }}>
          {site.county} County · {site.region} WA
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
          {site.name}
        </div>
        {drivingFeatures[0] && (
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16, fontStyle: 'italic' }}>
            {drivingFeatures[0].label}: <span style={{ color: 'var(--text-2)' }}>{drivingFeatures[0].detail}</span>
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
