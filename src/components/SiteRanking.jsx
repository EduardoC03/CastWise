import React, { useMemo } from 'react';
import {
  ArrowLeft, Droplets, Sun, Fish, Anchor, Accessibility, Tent,
  BookOpen, Plus, Check, Trophy, Compass, MapPin, ChevronRight
} from 'lucide-react';
import { SITES } from '../data/sites';
import { getRecommendations } from '../utils/ranking';

/**
 * SiteRanking — the top-3 recommendations view.
 *
 * Props:
 *   profile     — angler profile from App state
 *   trip        — current trip (so we can show "Added" if user already picked)
 *   onSelect    — open the SiteProfile detail view
 *   onAddToTrip — add a site to the next trip
 */
export default function SiteRanking({ profile, trip, onSelect, onAddToTrip }) {
  const { top, explore, totalScored } = useMemo(
    () => getRecommendations(profile, SITES),
    [profile]
  );

  if (!profile) {
    return (
      <div className="p-6 text-center text-[var(--text-muted)] italic">
        Complete your angler profile to see recommendations.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary-accent)] mb-2">
          <Trophy size={12} />
          <span>Your top picks · {totalScored} sites scored</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--secondary-accent)] tracking-tight leading-tight mb-1">
          For {profile.name}, this week
        </h1>
        <p className="font-serif italic text-[var(--text-muted)] text-sm">
          Ranked by your profile · {profile.region} · {profile.travel.toLowerCase()}
        </p>
      </header>

      {/* Top 3 */}
      <section className="space-y-4 mb-10">
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
      </section>

      {/* Explore pick */}
      {explore && (
        <section className="mb-6">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-3">
            <Compass size={12} />
            <span>Try something new</span>
          </div>
          <ExploreCard
            result={explore}
            inTrip={trip?.site?.id === explore.site.id}
            onSelect={onSelect}
            onAddToTrip={onAddToTrip}
          />
        </section>
      )}

      {/* Footer note */}
      <p className="text-xs font-serif italic text-[var(--text-muted)] text-center mt-8 pt-4 border-t border-[var(--border-color)]">
        Scores reflect your profile, the site's access and species, and current season status.
        The model never picks for you — it shows the reasoning so you can.
      </p>
    </div>
  );
}

// =========================================================================
// Top-3 ranked card — large, with score badge and driving features
// =========================================================================
function RankedSiteCard({ rank, result, inTrip, onSelect, onAddToTrip }) {
  const { site, score, drivingFeatures } = result;

  return (
    <article className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-5 sm:p-6 shadow-sm hover:border-[var(--primary-accent)] transition-colors">
      <div className="flex gap-4 sm:gap-6">
        {/* Score badge + rank */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--primary-accent)] text-[var(--text-primary)] font-serif text-xl sm:text-2xl font-bold">
            {score}
          </div>
          <div className="mt-2 text-[9px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
            #{rank}
          </div>
        </div>

        {/* Site info */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--primary-accent)] mb-1">
            {site.county} County · {site.region} WA
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--text-primary)] leading-tight mb-1">
            {site.name}
          </h3>
          <div className="font-serif italic text-xs text-[var(--text-muted)] mb-3">
            {site.type} · Managed by {site.manager}
          </div>

          {/* Species chips */}
          {site.species && site.species.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {site.species.slice(0, 3).map(sp => (
                <span
                  key={sp}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--bg-color)] border border-[var(--border-color)] text-[10px] font-medium text-[var(--text-primary)]"
                >
                  {sp}
                </span>
              ))}
              {!site.isCurated && (
                <span className="text-[9px] italic text-[var(--text-muted)] self-center">
                  inferred
                </span>
              )}
            </div>
          )}

          {/* Driving features — the "why" */}
          <div className="space-y-1.5 mb-4">
            <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-[var(--text-muted)] mb-1.5">
              Why this site
            </div>
            {drivingFeatures.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-[13px] leading-snug">
                <span className="text-[var(--primary-accent)] mt-0.5 flex-shrink-0">▸</span>
                <span className="text-[var(--text-primary)]">
                  <span className="font-semibold">{f.label}:</span>{' '}
                  <span className="text-[var(--text-muted)]">{f.detail}</span>
                </span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSelect(site)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-semibold hover:border-[var(--primary-accent)] hover:bg-[var(--bg-color)] transition"
            >
              View details <ChevronRight size={12} />
            </button>
            {inTrip ? (
              <button
                disabled
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[var(--success)]/15 text-[var(--success)] text-xs font-semibold cursor-default"
              >
                <Check size={12} /> Added to trip
              </button>
            ) : (
              <button
                onClick={() => onAddToTrip(site)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[var(--primary-accent)] text-[var(--text-primary)] text-xs font-semibold hover:brightness-95 transition"
              >
                <Plus size={12} /> Add to next trip
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

// =========================================================================
// Explore card — smaller, visually distinct (green accent vs gold)
// =========================================================================
function ExploreCard({ result, inTrip, onSelect, onAddToTrip }) {
  const { site, score, drivingFeatures } = result;
  return (
    <article className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-5 shadow-sm border-l-[3px] border-l-[var(--secondary-accent)]">
      <div className="flex items-start gap-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--secondary-accent)] text-white font-serif text-lg font-bold flex-shrink-0">
          {score}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--secondary-accent)] mb-1">
            {site.county} County · Under-fished match
          </div>
          <h3 className="font-serif text-lg font-bold text-[var(--text-primary)] leading-tight mb-1">
            {site.name}
          </h3>
          <p className="text-xs text-[var(--text-muted)] italic mb-3">
            A site that scored well but didn't make the top 3 — fishing it helps distribute pressure across the state.
          </p>
          {drivingFeatures[0] && (
            <div className="text-[13px] text-[var(--text-primary)] mb-3">
              <span className="font-semibold">{drivingFeatures[0].label}:</span>{' '}
              <span className="text-[var(--text-muted)]">{drivingFeatures[0].detail}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSelect(site)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-semibold hover:border-[var(--secondary-accent)] transition"
            >
              View details <ChevronRight size={12} />
            </button>
            {!inTrip && (
              <button
                onClick={() => onAddToTrip(site)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--secondary-accent)] text-white text-xs font-semibold hover:brightness-110 transition"
              >
                <Plus size={12} /> Add to trip
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

// =========================================================================
// SiteProfile — moved here from the old stub. This is the detail view
// shown when user clicks "View details" or a map pin. Tailwind-only.
// =========================================================================
export function SiteProfile({ site, inTrip, onBack, onAdd }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 sm:py-8 animate-in fade-in duration-300">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--text-muted)] hover:text-[var(--secondary-accent)] mb-4 transition-colors"
      >
        <ArrowLeft size={12} /> Back
      </button>

      <header className="mb-6">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--primary-accent)] mb-1.5">
          {site.county} County · {site.region} WA · {site.type}
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--secondary-accent)] leading-tight mb-1.5">
          {site.name}
        </h1>
        <div className="font-serif italic text-sm text-[var(--text-muted)]">
          Managed by {site.manager}
        </div>
      </header>

      {/* Alerts */}
      {(site.stocked || site.opening) && (
        <div className="space-y-2 mb-6">
          {site.stocked && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--primary-accent)]/10 border-l-4 border-[var(--primary-accent)]">
              <Droplets size={16} className="text-[var(--primary-accent)] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <strong className="block text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)] mb-0.5">
                  Recently stocked
                </strong>
                <span className="font-serif font-semibold text-sm text-[var(--text-primary)]">{site.stocked}</span>
              </div>
            </div>
          )}
          {site.opening && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--secondary-accent)]/10 border-l-4 border-[var(--secondary-accent)]">
              <Sun size={16} className="text-[var(--secondary-accent)] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <strong className="block text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)] mb-0.5">
                  Season opening
                </strong>
                <span className="font-serif font-semibold text-sm text-[var(--text-primary)]">{site.opening}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Species */}
      <section className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-5 mb-4">
        <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-3">
          <Fish size={12} /> Likely species
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {(site.species || []).map(sp => (
            <span
              key={sp}
              className="px-2.5 py-1 rounded-full bg-[var(--bg-color)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-primary)]"
            >
              {sp}
            </span>
          ))}
        </div>
        {!site.isCurated && (
          <p className="font-serif italic text-[11px] text-[var(--text-muted)] mt-3 leading-relaxed">
            Species inferred from waterbody type. Verify locally before fishing.
          </p>
        )}
      </section>

      {/* Access & infrastructure */}
      <section className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-5 mb-4">
        <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-3">
          <Anchor size={12} /> Access & infrastructure
        </h3>
        <div className="grid grid-cols-4 gap-2 mb-3">
          <Fact n={site.boatRamps} label="Boat ramps" />
          <Fact n={site.handLaunches} label="Hand launches" />
          <Fact n={site.fishingPlatforms} label="Platforms" />
          <Fact n={site.restrooms} label="Restrooms" />
        </div>
        {(site.ada_parking > 0 || site.ada_loading || site.ada_restrooms > 0) && (
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-3">
            <Accessibility size={12} className="flex-shrink-0" />
            <span>
              ADA:
              {site.ada_parking > 0 && ` ${site.ada_parking} parking stall${site.ada_parking > 1 ? 's' : ''}`}
              {site.ada_loading && ', loading platform'}
              {site.ada_restrooms > 0 && `, ${site.ada_restrooms} restroom${site.ada_restrooms > 1 ? 's' : ''}`}
            </span>
          </div>
        )}
        {site.ramp_surface && (
          <div className="text-xs text-[var(--text-muted)] mt-2">Ramp surface: {site.ramp_surface}</div>
        )}
        {site.camping && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-2">
            <Tent size={12} /> Camping allowed on site
          </div>
        )}
      </section>

      {/* Regulations */}
      <section className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-5 mb-6 border-l-[3px] border-l-[var(--primary-accent)]">
        <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-3">
          <BookOpen size={12} /> Access regulations
        </h3>
        <p className="text-sm text-[var(--text-primary)] mb-2">
          <strong>Closure status:</strong> {site.closure}
        </p>
        {site.openDates && (
          <p className="text-sm text-[var(--text-primary)] mb-2">{site.openDates}</p>
        )}
        {site.notes && (
          <p className="font-serif italic text-sm text-[var(--text-muted)] mb-2">{site.notes}</p>
        )}
        <p className="font-serif italic text-[11px] text-[var(--text-muted)] mt-3 leading-relaxed">
          Always verify current fishing rules and emergency regulations at wdfw.wa.gov before fishing.
        </p>
      </section>

      {/* CTA */}
      <div className="flex">
        {inTrip ? (
          <button
            disabled
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[var(--success)]/15 text-[var(--success)] text-sm font-semibold cursor-default"
          >
            <Check size={14} /> Added to trip
          </button>
        ) : (
          <button
            onClick={onAdd}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[var(--primary-accent)] text-[var(--text-primary)] text-sm font-semibold hover:brightness-95 transition"
          >
            <Plus size={14} /> Add to next trip
          </button>
        )}
      </div>
    </div>
  );
}

function Fact({ n, label }) {
  return (
    <div className="text-center p-2 bg-[var(--bg-color)] rounded-md border border-[var(--border-color)]">
      <div className="font-serif text-xl font-bold text-[var(--secondary-accent)] leading-none">{n}</div>
      <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-tight mt-1">{label}</div>
    </div>
  );
}
