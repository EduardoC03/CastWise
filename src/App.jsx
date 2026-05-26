import React, { useState, useEffect } from 'react';
import { ChevronRight, Droplets, Waves, Calendar } from 'lucide-react';
import './App.css';

// Components
import NavBar from './components/NavBar';
import MapView from './components/MapView';
import AnglerQuestionnaire from './components/AnglerQuestionnaire';
import AnglerProfile from './components/AnglerProfile';
import SpeciesCatalog from './components/SpeciesCatalog';
import SiteRanking, { SiteProfile } from './components/SiteRanking';
import TripBriefing from './components/TripBriefing';
import CatchLog from './components/CatchLog';

// Utilities & Data
import { loadProfile, saveProfile, loadTrip, saveTrip, clearAllStorage } from './utils/storage';
import { enrichSite } from './data/sites';

export default function CastWise() {
  const [screen, setScreen] = useState('loading');
  const [profile, setProfile] = useState(null);
  const [trip, setTrip] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [activeSection, setActiveSection] = useState('map');

  useEffect(() => {
    (async () => {
      const p = await loadProfile();
      const t = await loadTrip();
      if (p) setProfile(p);
      if (t) setTrip(t);
      setScreen(p ? 'main' : 'welcome');
    })();
  }, []);

  const handleProfileComplete = async (p) => {
    await saveProfile(p);
    setProfile(p);
    setScreen('main');
    setActiveSection('map');
  };

  const handleSelectSite = (s) => {
    setSelectedSite(s);
    setScreen('site');
  };

  const handleAddToTrip = async (s) => {
    const t = { site: s, createdAt: Date.now() };
    await saveTrip(t);
    setTrip(t);
    setActiveSection('briefing');
    setScreen('main');
  };

  const handleReset = async () => {
    await clearAllStorage();
    setProfile(null);
    setTrip(null);
    setScreen('welcome');
  };

  const handleRemoveTrip = async () => {
    await saveTrip(null);
    setTrip(null);
    if (activeSection === 'briefing') {
      setActiveSection('map');
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'map':
        return (
          <MapView
            profile={profile}
            trip={trip}
            onSelect={handleSelectSite}
            onViewTrip={() => setActiveSection('briefing')}
            onReset={() => setScreen('profile')}
          />
        );
      case 'rankings':
        return <SiteRanking />;
      case 'briefing':
        return trip ? (
          <TripBriefing
            profile={profile}
            trip={trip}
            onBack={() => setActiveSection('map')}
            onRemove={handleRemoveTrip}
          />
        ) : (
          <div className="cw-screen">
            <h2>No Trip Planned</h2>
            <p>Select a site from the map to plan your trip.</p>
            <button className="cw-btn cw-btn-primary mt-4" onClick={() => setActiveSection('map')}>
              Go to Map
            </button>
          </div>
        );
      case 'catalog':
        return <SpeciesCatalog />;
      case 'catchlog':
        return <CatchLog />;
      case 'profile':
        return <AnglerProfile profile={profile} onReset={handleReset} />;
      default:
        return <div className="cw-screen">Section not found.</div>;
    }
  };

  return (
    <div className="cw-stage">
      <DecorBackground />
      <BrandHeader />
      <SideStats trip={trip} />
      <div className="cw-phone">
        <div className="cw-phone-notch" />
        <div className="cw-phone-screen">
          {screen === 'loading' && <LoadingScreen />}
          {screen === 'welcome' && <Welcome onStart={() => setScreen('intake')} />}
          {screen === 'intake' && <AnglerQuestionnaire onComplete={handleProfileComplete} />}
          {screen === 'main' && profile && (
            <>
              {renderActiveSection()}
              <NavBar activeSection={activeSection} onSectionChange={setActiveSection} />
            </>
          )}
          {screen === 'site' && selectedSite && (
            <SiteProfile
              site={selectedSite}
              inTrip={trip && trip.site.id === selectedSite.id}
              onBack={() => setScreen('main')}
              onAdd={() => handleAddToTrip(selectedSite)}
            />
          )}
        </div>
        <div className="cw-phone-bar" />
      </div>
      <FooterRibbon />
    </div>
  );
}

// Sub-components that stay in App.jsx as part of the frame
function DecorBackground() {
  return (
    <>
      <svg className="cw-decor-trees" viewBox="0 0 1400 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <path id="conifer" d="M0,-90 L-30,-30 L-12,-30 L-36,10 L-12,10 L-42,50 L42,50 L12,10 L36,10 L12,-30 L30,-30 Z"/>
        </defs>
        {[...Array(14)].map((_, i) => {
          const x = 60 + i * 100 + (i % 2 === 0 ? 20 : -10);
          const y = 280 + (i % 3) * 8;
          const scale = 0.7 + (i % 4) * 0.18;
          return <use key={i} href="#conifer"
                   transform={`translate(${x},${y}) scale(${scale})`}
                   fill="currentColor" opacity={0.35 + (i % 3) * 0.08}/>;
        })}
      </svg>
      <svg className="cw-decor-rings" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {[280, 360, 460, 580, 720].map((r, i) => (
          <circle key={i} cx="600" cy="400" r={r} fill="none" stroke="currentColor"
                  strokeWidth="1" strokeDasharray="2 6" opacity={0.4 - i * 0.05}/>
        ))}
      </svg>
    </>
  );
}

function BrandHeader() {
  return (
    <div className="cw-brand-header">
      <div className="cw-brand-pill">
        <span className="cw-brand-pill-mark">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M3,12 Q7,4 13,4 Q20,4 22,12 Q20,20 13,20 Q7,20 3,12 Z M22,12 L19,9 L19,15 Z" fill="var(--green-deep)"/><circle cx="9" cy="11" r="0.9" fill="var(--gold)"/></svg>
        </span>
        <span className="cw-brand-pill-text">cast<em>wise</em></span>
      </div>
      <div className="cw-brand-tag">WDFW field companion · est. 2026</div>
    </div>
  );
}

function FooterRibbon() {
  return (
    <div className="cw-footer-ribbon">
      <span>Washington Department of Fish & Wildlife</span>
      <span className="dot"/>
      <span>Public access waters only</span>
      <span className="dot"/>
      <span>406 sites statewide</span>
    </div>
  );
}

function SideStats({ trip }) {
  if (!trip) return null;
  const s = trip.site;
  return (
    <div className="cw-side-card">
      <div className="cw-side-title">Trip planned</div>
      <div className="cw-side-divider"/>
      <div className="cw-side-name">{s.name}</div>
      <div className="cw-side-meta">{s.county} Co. · {s.region}</div>
      <div className="cw-side-grid">
        <div><div className="cw-side-num">{s.boatRamps}</div><div className="cw-side-lbl">Boat ramps</div></div>
        <div><div className="cw-side-num">{s.handLaunches}</div><div className="cw-side-lbl">Hand launches</div></div>
        <div><div className="cw-side-num">{s.fishingPlatforms}</div><div className="cw-side-lbl">Platforms</div></div>
        <div><div className="cw-side-num">{s.restrooms}</div><div className="cw-side-lbl">Restrooms</div></div>
      </div>
      {s.stocked && (
        <div className="cw-side-pill">
          <Droplets size={11}/> Stocked {s.stocked}
        </div>
      )}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="cw-loading">
      <Waves size={28} className="cw-spin-slow"/>
      <span>Casting line…</span>
    </div>
  );
}

function Welcome({ onStart }) {
  return (
    <div className="cw-screen cw-welcome">
      <div className="cw-welcome-emblem">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="var(--green-deep)" stroke="var(--gold)" strokeWidth="1.5"/>
          <circle cx="50" cy="50" r="38" fill="none" stroke="var(--cream)" strokeWidth="0.5" opacity="0.5"/>
          <path d="M18,55 Q28,46 38,55 T58,55 T82,55" fill="none" stroke="var(--gold)" strokeWidth="2"/>
          <path d="M18,62 Q28,53 38,62 T58,62 T82,62" fill="none" stroke="var(--cream)" strokeWidth="1.2" opacity="0.6"/>
          <text x="50" y="26" textAnchor="middle" fontSize="6" letterSpacing="3" fill="var(--gold)" fontFamily="serif">EST · WDFW</text>
          <text x="50" y="84" textAnchor="middle" fontSize="5.5" letterSpacing="2" fill="var(--cream)" opacity="0.7" fontFamily="serif">WASHINGTON</text>
        </svg>
      </div>
      <h1 className="cw-welcome-title">Cast<em>Wise</em></h1>
      <div className="cw-welcome-rule"><span/></div>
      <p className="cw-welcome-tag">A field companion for Washington anglers.</p>
      <p className="cw-welcome-body">
        Tell us how you fish and we'll point you to public access waters across the state, with tailored gear advice, regulation alerts, and live stocking updates.
      </p>
      <button className="cw-btn cw-btn-primary" onClick={onStart}>
        Begin intake <ChevronRight size={16}/>
      </button>
      <div className="cw-welcome-foot">
        <span>406</span> public access sites
        <span className="cw-welcome-foot-dot"/>
        <span>2026</span> regulations
      </div>
    </div>
  );
}
