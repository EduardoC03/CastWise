import React, { useMemo } from 'react';
import {
  ArrowLeft, Droplets, Sun, Fish, Anchor, Accessibility, Tent,
  BookOpen, Plus, Check, Trophy, Compass, ChevronRight
} from 'lucide-react';
import { SITES } from '../data/sites';

// ── Simple scoring until utils/ranking.js exists ──────────────────────────────
function scoreSite(site, profile) {
  let score = 60;
  if (!profile) return score;

  const access = profile.access || '';
  if (access === 'Boat / kayak'  && site.boatRamps > 0)    score += 12;
  if (access === 'Bank fishing'  && site.handLaunches >= 0) score += 8;
  if (access === 'Wade fishing'  && site.type === 'River')  score += 10;
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
    .sort((a, b) => b.score - a.score);

  const top     = scored.slice(0, 3);
  const explore = scored.slice(3).find(r =>
    r.site.region !== top[0]?.site.region || r.site.type !== top[0]?.site.type
  ) || scored[3] || null;

  return { top, explore, totalScored: scored.length };
}
// ─────────────────────────────────────────────────────────────────────────────

export default function SiteRanking({ profile, trip, onSelect, onAddToTrip }) {
  const { top, explore, totalScored } = useMemo(
    () => getRecommendations(profile, SITES),
    [profile]
  );

  if (!profile) {
    return (
      <div className="cw-empty" style={{ height: '100%' }}>
        <Trophy size={40} className="cw-empty-icon" />
        <h2>No profile yet</h2>
        <p>Complete your angler profile to see personalized site recommendations.</p>
      </div>
    );
  }

  return (
    <div className="cw-screen" style={{ maxWidth: 780 }}>
      <div className="cw-page-eyebrow">
        <Trophy size={11} /> Your top picks · {totalScored} sites scored
      </div>
      <h1 className="cw-page-title">For {profile.name}, this week</h1>
      <p className="cw-page-sub">
        Ranked by your profile · {profile.region} · {(profile.travel || '').toLowerCase()}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
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

      {explore && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--text-3)',
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10,
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

      <p style={{
        fontSize: 11, fontFamily: 'var(--font-display)', fontStyle: 'italic',
        color: 'var(--text-3)', textAlign: 'center',
        paddingTop: 16, borderTop: '1px solid var(--border)', marginTop: 8,
      }}>
        Scores reflect your profile, site access, species, and current season status.
      </p>
    </div>
  );
}

function RankedSiteCard({ rank, result, inTrip, onSelect, onAddToTrip }) {
  const { site, score, drivingFeatures } = result;
  return (
    <article className="cw-block" style={{ display: 'flex', gap: 20, marginBottom: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: rank === 1 ? 'var(--gold)' : 'var(--surface-2)',
          border: rank === 1 ? 'none' : '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
          color: rank === 1 ? 'var(--bg)' : 'var(--text)',
        }}>
          {score}
        </div>
        <div style={{
          marginTop: 5, fontFamily: 'var(--font-mono)', fontSize: 9,
          letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-3)',
        }}>
          #{rank}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>
          {site.county} County · {site.region} WA
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text)', lineHeight: 1.1, marginBottom: 3 }}>
          {site.name}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 12, color: 'var(--text-3)', marginBottom: 12 }}>
          {site.type} · Managed by {site.manager}
        </div>

        {site.species?.length > 0 && (
          <div className="cw-chips" style={{ marginBottom: 12 }}>
            {site.species.slice(0, 3).map(sp => (
              <span key={sp} className="cw-chip" style={{ fontSize: 11 }}>{sp}</span>
            ))}
            {!site.isCurated && (
              <span style={{ fontSize: 10, fontStyle: 'italic', color: 'var(--text-3)', alignSelf: 'center' }}>inferred</span>
            )}
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 7 }}>
            Why this site
          </div>
          {drivingFeatures.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 5, fontSize: 13 }}>
              <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }}>▸</span>
              <span style={{ color: 'var(--text)' }}>
                <strong>{f.label}:</strong>{' '}
                <span style={{ color: 'var(--text-2)' }}>{f.detail}</span>
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => onSelect && onSelect(site)} className="cw-btn cw-btn-ghost" style={{ padding: '8px 14px', fontSize: 12 }}>
            View details <ChevronRight size={12} />
          </button>
          {inTrip ? (
            <button disabled className="cw-btn" style={{ padding: '8px 14px', fontSize: 12, background: 'rgba(90,173,102,0.12)', color: 'var(--green-bright)', cursor: 'default' }}>
              <Check size={12} /> Added to trip
            </button>
          ) : (
            <button onClick={() => onAddToTrip && onAddToTrip(site)} className="cw-btn cw-btn-primary" style={{ padding: '8px 14px', fontSize: 12 }}>
              <Plus size={12} /> Add to trip
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function ExploreCard({ result, inTrip, onSelect, onAddToTrip }) {
  const { site, score, drivingFeatures } = result;
  return (
    <article className="cw-block" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 0, cursor: 'pointer' }} onClick={() => onSelect && onSelect(site)}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 4 }}>
          {site.county} County · {site.region} WA
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>
          {site.name}
        </div>
        {drivingFeatures[0] && (
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
            {drivingFeatures[0].label}: <span style={{ color: 'var(--text-2)' }}>{drivingFeatures[0].detail}</span>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text-3)' }}>{score}</div>
        {!inTrip && (
          <button onClick={e => { e.stopPropagation(); onAddToTrip && onAddToTrip(site); }} className="cw-btn cw-btn-ghost" style={{ padding: '6px 12px', fontSize: 11 }}>
            <Plus size={11} /> Add
          </button>
        )}
      </div>
    </article>
  );
}

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
