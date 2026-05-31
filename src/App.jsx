import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import './App.css';

// Components
import Onboarding from './components/Onboarding';
import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';
import MapTab from './components/tabs/MapTab';
import AnglerProfile from './components/AnglerProfile';
import SpeciesCatalog from './components/SpeciesCatalog';
import SiteRanking, { SiteProfile } from './components/SiteRanking';
import TripBriefing from './components/TripBriefing';
import CatchLog from './components/CatchLog';

// Utilities & Data
import { loadProfile, saveProfile, loadTrip, saveTrip, clearAllStorage } from './utils/storage';
import { SITES } from './data/sites';
import { getRecommendations } from './utils/ranking';

const PROFILE_KEY = 'castwise_profile';
const THEME_KEY = 'castwise_theme';

export default function CastWise() {
  const [appState, setAppState] = useState('loading');
  const [profile, setProfile] = useState(null);
  const [trip, setTrip] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark');
  const [activeSection, setActiveSection] = useState('rankings');
  const [selectedSite, setSelectedSite] = useState(null);
  const [isSiteView, setIsSiteView] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem(PROFILE_KEY);
    if (savedProfile) {
      const p = JSON.parse(savedProfile);
      setProfile(p);
      setAppState('dashboard');
    } else {
      setAppState('onboarding');
    }
    (async () => {
      const t = await loadTrip();
      if (t) setTrip(t);
    })();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleOnboardingComplete = (p) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    setProfile(p);
    setAppState('dashboard');
    setActiveSection('rankings');
  };

  const handleResetProfile = () => {
    localStorage.removeItem(PROFILE_KEY);
    clearAllStorage();
    setProfile(null);
    setTrip(null);
    setAppState('onboarding');
  };

  const handleSelectSite = (s) => {
    setSelectedSite(s);
    setIsSiteView(true);
  };

  const handleAddToTrip = async (s) => {
    const t = { site: s, createdAt: Date.now() };
    await saveTrip(t);
    setTrip(t);
    setIsSiteView(false);
    setActiveSection('briefing');
  };

  const handleRemoveTrip = async () => {
    await saveTrip(null);
    setTrip(null);
    if (activeSection === 'briefing') {
      setActiveSection('rankings');
    }
  };

  if (appState === 'loading') return null;

  if (appState === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const recommendations = profile ? getRecommendations(profile, SITES) : null;
  const topPick = recommendations?.top[0]?.site || null;

  // ── FIX: Strictly limit Highlighted IDs to only the 3 recommendations
  const highlightedIds = new Set();
  if (recommendations?.top) {
    recommendations.top.forEach(r => highlightedIds.add(r.site.id));
  }
  if (recommendations?.explore?.site) {
    highlightedIds.add(recommendations.explore.site.id);
  }

  const renderMainContent = () => {
    if (isSiteView && selectedSite) {
      return (
        <SiteProfile
          site={selectedSite}
          inTrip={trip && trip.site.id === selectedSite.id}
          onBack={() => setIsSiteView(false)}
          onAdd={() => handleAddToTrip(selectedSite)}
        />
      );
    }

    switch (activeSection) {
      case 'map':
        return (
          <MapTab
            onSelect={handleSelectSite}
            highlightedIds={highlightedIds}
            recommendations={recommendations}
          />
        );
      case 'rankings':
        return (
          <SiteRanking
            profile={profile}
            trip={trip}
            onSelect={handleSelectSite}
            onAddToTrip={handleAddToTrip}
          />
        );
      case 'briefing':
        return trip ? (
          <TripBriefing
            profile={profile}
            trip={trip}
            onBack={() => setActiveSection('rankings')}
            onRemove={handleRemoveTrip}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-12 animate-in fade-in zoom-in duration-300">
            <div className="p-6 bg-[var(--surface-color)] rounded-full border-2 border-[var(--primary-accent)] mb-6 text-[var(--primary-accent)]">
              <BookOpen size={48} />
            </div>
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">No Trip Planned</h2>
            <p className="text-[var(--text-muted)] max-w-md mb-8">
              Pick a site from your recommendations to generate a personalized trip briefing with gear and tactics.
            </p>
            <button
              className="px-8 py-3 bg-[var(--primary-accent)] text-[var(--bg-color)] font-bold rounded-xl hover:scale-105 transition-transform"
              onClick={() => setActiveSection('rankings')}
            >
              See recommendations
            </button>
          </div>
        );
      case 'catalog':
        return <SpeciesCatalog />;
      case 'profile':
        return <AnglerProfile profile={profile} onReset={handleResetProfile} />;
      default:
        return (
          <SiteRanking
            profile={profile}
            trip={trip}
            onSelect={handleSelectSite}
            onAddToTrip={handleAddToTrip}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--bg-color)] text-[var(--text-primary)] transition-colors overflow-hidden">
      <NavBar
        activeSection={isSiteView ? 'rankings' : activeSection}
        onSectionChange={(section) => { setActiveSection(section); setIsSiteView(false); }}
        theme={theme}
        onToggleTheme={toggleTheme}
        profile={profile}
        onResetProfile={handleResetProfile}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          profile={profile}
          topSite={topPick}
          onNavigate={(section) => { setActiveSection(section); setIsSiteView(false); }}
        />

        <main className="flex-1 relative overflow-y-auto bg-[var(--bg-color)] animate-in fade-in duration-500">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}
