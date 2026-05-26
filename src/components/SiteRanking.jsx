import React from 'react';
import { ArrowLeft, Droplets, Sun, Fish, Anchor, Accessibility, Tent, BookOpen, Plus, Check } from 'lucide-react';

export default function SiteRanking() {
  return (
    <div className="cw-screen">
      <h2>Site Ranking</h2>
      <p>Top-3 fishing site recommendations coming soon.</p>
    </div>
  );
}

export function SiteProfile({ site, inTrip, onBack, onAdd }) {
  return (
    <div className="cw-screen cw-site">
      <button className="cw-back" onClick={onBack}><ArrowLeft size={13}/> Back</button>

      <div className="cw-site-head">
        <div className="cw-site-county">{site.county} Co · {site.region} WA · {site.type}</div>
        <h1 className="cw-site-name">{site.name}</h1>
        <div className="cw-site-mgr">Managed by {site.manager}</div>
      </div>

      {(site.stocked || site.opening) && (
        <div className="cw-alerts">
          {site.stocked && (
            <div className="cw-alert cw-alert-stock">
              <Droplets size={13}/>
              <div>
                <strong>Recently stocked</strong>
                <span>{site.stocked}</span>
              </div>
            </div>
          )}
          {site.opening && (
            <div className="cw-alert cw-alert-open">
              <Sun size={13}/>
              <div>
                <strong>Season opening</strong>
                <span>{site.opening}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <section className="cw-site-section">
        <h3><Fish size={11}/> Likely species</h3>
        <div className="cw-chips">
          {site.species.map(sp => <span key={sp} className="cw-chip">{sp}</span>)}
        </div>
        {!site.isCurated && (
          <div className="cw-disclaim">Species are inferred from waterbody type. Verify locally before fishing.</div>
        )}
      </section>

      <section className="cw-site-section">
        <h3><Anchor size={11}/> Access & infrastructure</h3>
        <div className="cw-facts">
          <div className="cw-fact">
            <div className="cw-fact-n">{site.boatRamps}</div>
            <div className="cw-fact-l">Boat ramps</div>
          </div>
          <div className="cw-fact">
            <div className="cw-fact-n">{site.handLaunches}</div>
            <div className="cw-fact-l">Hand launches</div>
          </div>
          <div className="cw-fact">
            <div className="cw-fact-n">{site.fishingPlatforms}</div>
            <div className="cw-fact-l">Platforms</div>
          </div>
          <div className="cw-fact">
            <div className="cw-fact-n">{site.restrooms}</div>
            <div className="cw-fact-l">Restrooms</div>
          </div>
        </div>
        {(site.ada_parking > 0 || site.ada_loading || site.ada_restrooms > 0) && (
          <div className="cw-ada">
            <Accessibility size={11}/>
            <span>
              ADA features:
              {site.ada_parking > 0 && ` ${site.ada_parking} parking stall${site.ada_parking > 1 ? 's' : ''}`}
              {site.ada_loading && ', loading platform'}
              {site.ada_restrooms > 0 && `, ${site.ada_restrooms} restroom${site.ada_restrooms > 1 ? 's' : ''}`}
            </span>
          </div>
        )}
        {site.ramp_surface && (
          <div className="cw-detail">Ramp surface: {site.ramp_surface}</div>
        )}
        {site.camping && (
          <div className="cw-detail"><Tent size={11}/> Camping allowed on site</div>
        )}
      </section>

      <section className="cw-site-section cw-site-section-rules">
        <h3><BookOpen size={11}/> Access regulations</h3>
        <div className="cw-detail-block">
          <strong>Closure status:</strong> {site.closure}
        </div>
        {site.openDates && <div className="cw-detail-block">{site.openDates}</div>}
        {site.notes && <div className="cw-detail-block cw-notes">{site.notes}</div>}
        <div className="cw-disclaim">
          Always verify current fishing rules and emergency regulations at wdfw.wa.gov before fishing.
        </div>
      </section>

      <div className="cw-site-cta">
        {inTrip ? (
          <button className="cw-btn cw-btn-primary" disabled><Check size={14}/> Added to trip</button>
        ) : (
          <button className="cw-btn cw-btn-primary cw-btn-grow" onClick={onAdd}>
            <Plus size={14}/> Add to next trip
          </button>
        )}
      </div>
    </div>
  );
}
