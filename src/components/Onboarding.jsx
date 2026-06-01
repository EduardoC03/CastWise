import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

const SLIDES = [
  { id: 'welcome',    type: 'welcome' },
  { id: 'name',       type: 'input',  heading: 'First, what should we call you?', placeholder: 'Your first name' },
  { id: 'experience', type: 'choice', heading: 'How would you describe your fishing experience?', options: ['Beginner', 'Intermediate', 'Advanced'] },
  { id: 'frequency',  type: 'choice', heading: 'How often do you fish?', options: ['A few times a year', 'Monthly', 'Weekly', 'Almost daily'] },
  { id: 'gear',       type: 'multi',  heading: 'What gear do you own?', options: ['Spinning rod', 'Fly rod', 'Bait rod', 'Waders', 'Boat', 'Electronics'] },
  { id: 'styles',     type: 'multi',  heading: 'What fishing styles do you prefer?', options: ['Spin fishing', 'Fly fishing', 'Bait fishing', 'Trolling', 'Ice fishing'] },
  { id: 'region',     type: 'choice', heading: 'Where in Washington are you based?', options: ['Northwest WA', 'Southwest WA', 'Central WA', 'Eastern WA'] },
  { id: 'travel',     type: 'choice', heading: 'How far are you willing to travel to fish?', options: ['Local only (under 30 min)', 'Up to 1 hour', 'Up to 2 hours', 'Anywhere in WA'] },
  { id: 'access',     type: 'choice', heading: 'How do you prefer to access the water?', options: ['Bank fishing', 'Wade fishing', 'Boat / kayak'] },
  { id: 'completion', type: 'completion' },
];

// Background image from src/assets
import welcomeBg from '../assets/welcome-bg.jpg';
import fishLogo from '../assets/fish_logo_transparent.png';
const WELCOME_PHOTO = welcomeBg;

// ── Mountain silhouette SVG for question slides ───────────────────────────────
function MountainBg() {
  return (
    <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      width: '100%', height: '42%', pointerEvents: 'none',
    }}>
      <path d="M0,260 L120,180 L240,220 L380,140 L520,200 L640,130 L760,190 L900,120 L1020,175 L1160,110 L1300,160 L1440,130 L1440,320 L0,320 Z" fill="#1a3020" opacity="0.5" />
      <path d="M0,290 L100,230 L200,260 L340,190 L460,240 L580,175 L700,230 L840,165 L960,215 L1100,155 L1240,205 L1350,175 L1440,195 L1440,320 L0,320 Z" fill="#1e3824" opacity="0.75" />
      <path d="M0,310 L80,270 L180,295 L300,245 L420,280 L540,235 L660,275 L780,240 L900,270 L1020,235 L1140,265 L1260,245 L1380,260 L1440,255 L1440,320 L0,320 Z" fill="#122016" opacity="1" />
    </svg>
  );
}

// ── Fish icon SVG — matches the mockup ───────────────────────────────────────
function FishIcon({ size = 48, color = '#d4a017' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c4-8 16-8 20 0-4 8-16 8-20 0z" />
      <circle cx="16" cy="12" r="1.5" fill={color} stroke="none" />
    </svg>
  );
}

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    name: '', experience: '', frequency: '', gear: [],
    styles: [], region: '', travel: '', access: '',
  });
  const inputRef = useRef(null);

  useEffect(() => {
    if (SLIDES[currentStep].type === 'input' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep === SLIDES.length - 1) {
      onComplete({ ...answers, completedAt: new Date().toISOString() });
      return;
    }
    const advance = () => setCurrentStep(p => p + 1);
    SLIDES[currentStep].type === 'choice' ? setTimeout(advance, 280) : advance();
  };

  const handleBack = () => currentStep > 0 && setCurrentStep(p => p - 1);

  const handleSelect = (val) => {
    const slide = SLIDES[currentStep];
    if (slide.type === 'multi') {
      const cur = answers[slide.id] || [];
      setAnswers({ ...answers, [slide.id]: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] });
    } else {
      setAnswers({ ...answers, [slide.id]: val });
      handleNext();
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const slide        = SLIDES[currentStep];
  const progress     = (currentStep / (SLIDES.length - 1)) * 100;
  const isGrid       = slide.options?.length > 3;
  const isWelcome    = slide.type === 'welcome';
  const isCompletion = slide.type === 'completion';
  const showBack     = currentStep > 0 && !isWelcome && !isCompletion;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Enter') return;
      if (slide.type === 'input'   && answers.name.trim())               handleNext();
      if (slide.type === 'multi'   && (answers[slide.id] || []).length)  handleNext();
      if (slide.type === 'welcome' || slide.type === 'completion')       handleNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentStep, answers]);

  // ── WELCOME & SINGLE PAGE HOMEPAGE ────────────────────────────────────────
  if (isWelcome) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
        background: '#0a1a0e', 
        scrollBehavior: 'smooth',
      }}>

        {/* ── First Viewport Fold (Hero Banner) ── */}
        <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <img
            src={WELCOME_PHOTO}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              imageRendering: 'high-quality',
              filter: 'contrast(1.06) saturate(1.08)',
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          />

          {/* Dark overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.45))',
            backdropFilter: 'blur(0.8px)',
            WebkitBackdropFilter: 'blur(0.8px)',
            pointerEvents: 'none',
          }} />

          {/* Mist overlay on water */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '30%',
            background: 'linear-gradient(to top, rgba(255,255,255,0.12), transparent)',
            pointerEvents: 'none',
          }} />

          {/* Navbar */}
          <nav style={{
            position: 'relative', zIndex: 20,
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 32px',
          }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                border: '1px solid #d4a017',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#d4a017', fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>CW</span>
              </div>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
                color: '#ffffff', letterSpacing: '-0.02em',
              }}>
                Cast<em style={{ fontStyle: 'italic', color: '#d4a017' }}>Wise</em>
              </span>
            </div>

            {/* Nav links */}
            <ul style={{ display: 'flex', gap: 40, listStyle: 'none', margin: 0, padding: 0 }}>
              {['Map', 'Picks', 'Species', 'Trip Briefing'].map((l, index) => {
                const sectionIds = ['map', 'picks', 'species', 'trip-briefing'];
                return (
                  <li key={l}>
                    <button 
                      onClick={() => scrollToSection(sectionIds[index])}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#ffffff', fontSize: 13, fontWeight: 500,
                        fontFamily: 'var(--font-sans)', letterSpacing: '0.04em',
                        transition: 'color 200ms', padding: 0,
                      }}
                      onMouseEnter={e => e.target.style.color = '#d4a017'}
                      onMouseLeave={e => e.target.style.color = '#ffffff'}
                    >
                      {l}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Spacer */}
            <div style={{ width: 128 }} />
          </nav>

          {/* Hero content */}
          <section style={{
            flex: 1,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center',
            padding: '0 16px',
            position: 'relative', zIndex: 10,
          }}>
            {/* CastWise fish logo */}
            <div style={{
              width: 120, height: 120,
              borderRadius: '50%',
              border: '1.5px solid rgba(212,160,23,0.5)',
              background: 'rgba(0,0,0,0.15)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 28,
              boxShadow: '0 0 40px rgba(212,160,23,0.2)',
            }}>
              <img
                src={fishLogo}
                alt="CastWise"
                style={{
                  width: 72, height: 72,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 8px rgba(212,160,23,0.3))',
                }}
              />
            </div>

            {/* Wordmark */}
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(64px, 10vw, 96px)',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              marginBottom: 8,
              filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.3))',
            }}>
              Cast<em style={{ fontStyle: 'italic', color: '#d4a017' }}>Wise</em>
            </h1>

            {/* Tagline */}
            <p style={{
              fontSize: 'clamp(16px, 2.5vw, 22px)',
              fontWeight: 500,
              color: '#cbd5e1',
              marginBottom: 40,
              letterSpacing: '-0.01em',
              fontFamily: 'var(--font-sans)',
            }}>
              Fish smarter, not harder.
            </p>

            {/* CTA */}
            <button
              onClick={handleNext}
              style={{
                background: '#d4a017',
                color: '#0f172a',
                fontFamily: 'var(--font-sans)',
                fontSize: 18,
                fontWeight: 600,
                padding: '16px 48px',
                borderRadius: 99,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
                transition: 'transform 160ms, background 160ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#c49010'; e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#d4a017'; e.currentTarget.style.transform = 'scale(1)'; }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1.05)'}
            >
              Get Started
            </button>
          </section>
        </div>

        {/* ── 1. MAP DEMO SECTION ── */}
        <section id="map" style={{
          padding: '90px 24px',
          background: '#0d1a10',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.03)'
        }}>
          <div style={{ textAlign: 'center', maxWidth: 650, marginBottom: 36 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#d4a017', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Feature Preview</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 700, color: '#f0ede4', marginTop: 8, marginBottom: 12 }}>Interactive Intelligence Map</h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'rgba(240,237,228,0.65)', lineHeight: 1.5 }}>Track real-time river gauges, tidal heights, marine currents, and public land access configurations with pin-pointed accuracy across WA state.</p>
          </div>

          <div style={{
            width: '100%', maxWidth: 900,
            background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(212, 160, 23, 0.15)', borderRadius: 16,
            padding: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24,
            backdropFilter: 'blur(4px)',
          }}>
            {/* Visual Grid / Stream Blueprint Map Simulation */}
            <div style={{ background: '#0a150f', height: 280, borderRadius: 12, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(212,160,23,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <path d="M-20,130 Q160,50 290,160 T620,110" fill="none" stroke="#2563eb" strokeWidth="3.5" opacity="0.5" />
                <path d="M140,280 Q240,180 290,160" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.4" />
              </svg>
              {/* Active Spot Hotspot Bubble */}
              <div style={{ position: 'absolute', top: '100px', left: '42%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#d4a017', boxShadow: '0 0 12px #d4a017' }} />
                <span style={{ fontSize: 10, color: '#f0ede4', background: '#122016', padding: '2px 6px', borderRadius: 4, marginTop: 4, border: '1px solid rgba(212,160,23,0.3)' }}>Skagit River Spot B</span>
              </div>
              <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(13,26,16,0.9)', padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(240,237,228,0.7)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#d4a017' }} /> Optimal Streamflow Gauge
                </div>
              </div>
            </div>

            {/* Explanatory Data Metrics sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
              <h4 style={{ fontFamily: 'var(--font-display)', color: '#f0ede4', fontSize: 18, margin: 0 }}>Live Flow Layer Overlays</h4>
              <p style={{ fontFamily: 'var(--font-sans)', color: 'rgba(240,237,228,0.6)', fontSize: 13, margin: 0, lineHeight: 1.45 }}>
                Toggle active parameters to map USGS stream volumes, atmospheric thermal updates, or public bank lines directly into your personalized dashboard matrix.
              </p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span style={{ color: 'rgba(240,237,228,0.5)' }}>USGS Stations Tracked:</span><span style={{ color: '#5aad66', fontWeight: 600 }}>142 Active Indicators</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span style={{ color: 'rgba(240,237,228,0.5)' }}>Marine Refresh Sync:</span><span style={{ color: '#d4a017', fontWeight: 600 }}>Every 5 Minutes</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. PICKS SECTION EXPLANATION ── */}
        <section id="picks" style={{
          padding: '90px 24px',
          background: '#0a150f',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.03)'
        }}>
          <div style={{ textAlign: 'center', maxWidth: 650, marginBottom: 36 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#d4a017', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Target Recommendations</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 700, color: '#f0ede4', marginTop: 8, marginBottom: 12 }}>CastWise Smart Picks</h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'rgba(240,237,228,0.65)', lineHeight: 1.5 }}>Algorithmic spot scoring filtered to your specific skill brackets, gear ownership capabilities, and local traveling perimeters.</p>
          </div>

          {/* 3 Model Recommendation Mock Cards */}
          <div style={{ width: '100%', maxWidth: 900, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#d4a017', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>FLY FISHING ONLY</span>
                <span style={{ background: 'rgba(212,160,23,0.12)', color: '#d4a017', fontSize: 11, padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>98% MATCH</span>
              </div>
              <div>
                <h4 style={{ margin: '0 0 2px 0', color: '#f0ede4', fontFamily: 'var(--font-display)', fontSize: 18 }}>Pass Lake</h4>
                <span style={{ fontSize: 12, color: 'rgba(240,237,228,0.4)' }}>Deception Pass, WA</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: 'rgba(240,237,228,0.6)', lineHeight: 1.4 }}>Chironomid hatch is expanding across deep water flats. Optimal setup for float-tube fly casting profiles.</p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10, fontSize: 12, color: 'rgba(240,237,228,0.5)' }}>Target: <strong style={{ color: '#f0ede4' }}>Rainbow Trout</strong> • Window: <strong style={{ color: '#5aad66' }}>Dawn Spikes</strong></div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#5aad66', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>RIVER DRIFT BOAT</span>
                <span style={{ background: 'rgba(90,173,102,0.12)', color: '#5aad66', fontSize: 11, padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>92% MATCH</span>
              </div>
              <div>
                <h4 style={{ margin: '0 0 2px 0', color: '#f0ede4', fontFamily: 'var(--font-display)', fontSize: 18 }}>Yakima River</h4>
                <span style={{ fontSize: 12, color: 'rgba(240,237,228,0.4)' }}>Ellensburg, WA</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: 'rgba(240,237,228,0.6)', lineHeight: 1.4 }}>Water flows are steady around 2,100 CFS. Caddisflies active near rocky structure pockets.</p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10, fontSize: 12, color: 'rgba(240,237,228,0.5)' }}>Target: <strong style={{ color: '#f0ede4' }}>Cutthroat Trout</strong> • Window: <strong style={{ color: '#5aad66' }}>2PM – 6PM</strong></div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#38bdf8', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>SALTWATER BEACH</span>
                <span style={{ background: 'rgba(56,189,248,0.12)', color: '#38bdf8', fontSize: 11, padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>89% MATCH</span>
              </div>
              <div>
                <h4 style={{ margin: '0 0 2px 0', color: '#f0ede4', fontFamily: 'var(--font-display)', fontSize: 18 }}>Point No Point</h4>
                <span style={{ fontSize: 12, color: 'rgba(240,237,228,0.4)' }}>Kitsap Peninsula, WA</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: 'rgba(240,237,228,0.6)', lineHeight: 1.4 }}>Excellent beach casting tides this week. Coho salmon feeding aggressively along deep rip currents.</p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10, fontSize: 12, color: 'rgba(240,237,228,0.5)' }}>Target: <strong style={{ color: '#f0ede4' }}>Coho Salmon</strong> • Window: <strong style={{ color: '#5aad66' }}>Incoming Tide</strong></div>
            </div>
          </div>
        </section>

        {/* ── 3. SPECIES GUIDE DEMO SECTION ── */}
        <section id="species" style={{
          padding: '90px 24px',
          background: '#0d1a10',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.03)'
        }}>
          <div style={{ textAlign: 'center', maxWidth: 650, marginBottom: 36 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#d4a017', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Taxonomy Database</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 700, color: '#f0ede4', marginTop: 8, marginBottom: 12 }}>Washington Species Profile Directory</h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'rgba(240,237,228,0.65)', lineHeight: 1.5 }}>Review migration maps, legal limits, terminal rig strategies, and behavioral shifts across localized gamefish classes.</p>
          </div>

          <div style={{ width: '100%', maxWidth: 900, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { name: 'Chinook Salmon', nick: 'The King', desc: 'Powerful, deep runs. Heavy action trolling setups or deep drifting weighted spinners.', peak: 'July – Sept' },
              { name: 'Steelhead Trout', nick: 'The Shadow', desc: 'Acrobatic river fighters. Demands precise float control and extreme cold weather stamina.', peak: 'Dec – Feb, June' },
              { name: 'Rainbow Trout', nick: 'The Leaper', desc: 'Highly abundant surface feeders. Absolute blast on ultralight spinning gear or small dry flies.', peak: 'Year-round' },
              { name: 'Coastal Cutthroat', nick: 'The Estuary Nomad', desc: 'Thrives inside tidal shorelines and clear backwater creeks. Highly aggressive feeders.', peak: 'April – Oct' }
            ].map((fish) => (
              <div key={fish.name} style={{ background: '#0a150f', border: '1px solid rgba(212,160,23,0.1)', borderRadius: 10, padding: 18, textAlign: 'left' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(212,160,23,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <FishIcon size={16} />
                </div>
                <h4 style={{ margin: '0 0 2px 0', color: '#f0ede4', fontSize: 15, fontFamily: 'var(--font-display)' }}>{fish.name}</h4>
                <span style={{ fontSize: 11, color: '#d4a017', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 8 }}>{fish.nick}</span>
                <p style={{ margin: '0 0 12px 0', fontSize: 12, color: 'rgba(240,237,228,0.6)', lineHeight: 1.4 }}>{fish.desc}</p>
                <div style={{ fontSize: 11, color: 'rgba(240,237,228,0.4)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8 }}>
                  Peak Activity: <span style={{ color: '#f0ede4', fontWeight: 500 }}>{fish.peak}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. TRIP BRIEFING SECTION EXPLANATION ── */}
        <section id="trip-briefing" style={{
          padding: '90px 24px',
          background: '#0a150f',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.03)'
        }}>
          <div style={{ textAlign: 'center', maxWidth: 650, marginBottom: 36 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#d4a017', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Tactical Generator</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 700, color: '#f0ede4', marginTop: 8, marginBottom: 12 }}>AI Automated Trip Briefings</h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'rgba(240,237,228,0.65)', lineHeight: 1.5 }}>Before packing your gear, generate an exhaustive breakdown of solunar feeding curves, weather patterns, and shifting regulatory frameworks.</p>
          </div>

          {/* Detailed Mockup Report Output Sheet */}
          <div style={{
            width: '100%', maxWidth: 750,
            background: '#112216', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
            padding: 24, boxShadow: '0 12px 36px rgba(0,0,0,0.3)', textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16, marginBottom: 16 }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', color: '#f0ede4', fontFamily: 'var(--font-display)', fontSize: 19 }}>Automated Briefing: Snoqualmie River (Middle Fork)</h4>
                <span style={{ fontSize: 12, color: 'rgba(240,237,228,0.45)' }}>Target Focus: Resident Trout Vectors</span>
              </div>
              <div style={{ background: 'rgba(90,173,102,0.15)', border: '1px solid #5aad66', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#5aad66', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                WDFW COMPLIANT
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, alignItems: 'start' }}>
                <span style={{ fontSize: 12, color: '#d4a017', fontWeight: 600, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Solunar Index</span>
                <span style={{ fontSize: 13, color: 'rgba(240,237,228,0.75)' }}><strong>Major Window: 06:14 AM – 08:14 AM</strong>. High moonrise positional coordination. Minor acceleration noted at 1:45 PM.</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, alignItems: 'start' }}>
                <span style={{ fontSize: 12, color: '#d4a017', fontWeight: 600, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>WDFW Mandates</span>
                <span style={{ fontSize: 13, color: 'rgba(240,237,228,0.75)' }}>Selective Gear Rules enforced. Single barbless hooks only. Internal combustion motors prohibited. Catch and release mandatory.</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, alignItems: 'start' }}>
                <span style={{ fontSize: 12, color: '#d4a017', fontWeight: 600, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Tackle Spec</span>
                <span style={{ fontSize: 13, color: 'rgba(240,237,228,0.75)' }}>Recommend 4wt to 5wt fly rod builds with standard floating lines. 9ft 5X Fluorocarbon leaders. Primary dry pattern: Size 16 Adams Parachute.</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL ONBOARDING CTA BANNER ── */}
        <section style={{
          padding: '80px 32px', textAlign: 'center', background: '#0a1a0e',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: '#f0ede4', marginBottom: 12 }}>Ready to Build Your Dashboard?</h3>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: 'rgba(240,237,228,0.6)', maxWidth: 500, marginBottom: 28, lineHeight: 1.5 }}>
            Complete the 7-step tailoring protocol to align CastWise algorithms directly with your active experience profile.
          </p>
          <button
            onClick={handleNext}
            style={{
              background: '#d4a017', color: '#0f172a', fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 600,
              padding: '14px 44px', borderRadius: 99, border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(212,160,23,0.2)', transition: 'transform 160ms, background 160ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#c49010'; e.currentTarget.style.transform = 'scale(1.03)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#d4a017'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Begin Free Assessment
          </button>
        </section>

        {/* Footer */}
        <footer style={{
          position: 'relative', zIndex: 20,
          width: '100%', padding: '24px 32px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 12,
          background: '#07120a', borderTop: '1px solid rgba(255,255,255,0.02)'
        }}>
          {/* Footer nav using scroll parameters */}
          <div style={{ display: 'flex', gap: 24 }}>
            {['Map', 'Picks', 'Species', 'Trip Briefing'].map((l, index) => {
              const sectionIds = ['map', 'picks', 'species', 'trip-briefing'];
              return (
                <button 
                  key={l} 
                  onClick={() => scrollToSection(sectionIds[index])}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#4b5563', fontSize: 10, fontWeight: 600,
                    fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
                    letterSpacing: '0.12em', padding: 0,
                    transition: 'color 160ms',
                  }}
                  onMouseEnter={e => e.target.style.color = '#d4a017'}
                  onMouseLeave={e => e.target.style.color = '#4b5563'}
                >
                  {l}
                </button>
              );
            })}
          </div>
          {/* Social + copyright */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Facebook */}
            <a href="#" style={{ color: '#374151' }} onMouseEnter={e => e.currentTarget.style.color = '#000'} onMouseLeave={e => e.currentTarget.style.color = '#374151'}>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.14h-3v4h3v12h5v-12h3.85Z"/></svg>
            </a>
            {/* X / Twitter */}
            <a href="#" style={{ color: '#374151' }} onMouseEnter={e => e.currentTarget.style.color = '#000'} onMouseLeave={e => e.currentTarget.style.color = '#374151'}>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M23.95,4.57a10,10,0,0,1-2.82.77,4.96,4.96,0,0,0,2.18-2.72,10.06,10.06,0,0,1-3.12,1.19,4.92,4.92,0,0,0-8.39,4.49A14,14,0,0,1,1.64,3.16,4.92,4.92,0,0,0,3.16,9.72a4.91,4.91,0,0,1-2.22-.61V9.17a4.92,4.92,0,0,0,3.94,4.84,4.91,4.91,0,0,1-2.22.08,4.92,4.92,0,0,0,4.6,3.42A9.87,9.87,0,0,1,0,19.54a13.94,13.94,0,0,0,7.55,2.21,13.9,13.9,0,0,0,14-13.73c0-.21,0-.42,0-.63A10,10,0,0,0,24,4.59Z"/></svg>
            </a>
            {/* Instagram */}
            <a href="#" style={{ color: '#374151' }} onMouseEnter={e => e.currentTarget.style.color = '#000'} onMouseLeave={e => e.currentTarget.style.color = '#374151'}>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s0,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07s-3.58,0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s0-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.17,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.27.2-6.78,2.71-7,7C0,8.33,0,8.74,0,12s0,3.67.07,4.95c.2,4.27,2.71,6.78,7,7,1.28.07,1.69.07,4.95.07s3.67,0,4.95-.07c4.27-.2,6.78-2.71,7-7,.07-1.28.07-1.69.07-4.95s0-3.67-.07-4.95c-.2-4.27-2.71-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84Zm0,10.16A4,4,0,1,1,16,12,4,4,0,0,1,12,16Zm7.84-11a1.44,1.44,0,1,0-1.44,1.44A1.44,1.44,0,0,0,19.84,5.04Z"/></svg>
            </a>
            {/* YouTube */}
            <a href="#" style={{ color: '#374151' }} onMouseEnter={e => e.currentTarget.style.color = '#000'} onMouseLeave={e => e.currentTarget.style.color = '#374151'}>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5,6.19a3,3,0,0,0-2.12-2.12C19.54,3.5,12,3.5,12,3.5s-7.54,0-9.38.57A3,3,0,0,0,.5,6.19,31.16,31.16,0,0,0,0,12a31.16,31.16,0,0,0,.5,5.81,3,3,0,0,0,2.12,2.12C4.46,20.5,12,20.5,12,20.5s7.54,0-9.38-.57a3,3,0,0,0,2.12-2.12A31.16,31.16,0,0,0,24,12,31.16,31.16,0,0,0,23.5,6.19ZM9.75,15.5V8.5L15.5,12Z"/></svg>
            </a>
            <span style={{ fontSize: 10, color: '#6b7280', fontFamily: 'var(--font-sans)' }}>© 2024 CastWise. Fish Smarter.</span>
          </div>
        </footer>
      </div>
    );
  }

  // ── QUESTION / INPUT SLIDES ───────────────────────────────────────────────
  if (!isCompletion) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: '#0d1a10',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <MountainBg />

        {/* Progress bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.08)' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: '#d4a017', transition: 'width 450ms cubic-bezier(0.4,0,0.2,1)' }} />
        </div>

        {/* Back button */}
        {showBack && (
          <button onClick={handleBack} style={{
            position: 'absolute', top: 24, left: 24,
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(240,237,228,0.45)', transition: 'color 150ms',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(240,237,228,0.9)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,237,228,0.45)'}
          >
            <ChevronLeft size={13} /> Back
          </button>
        )}

        <div style={{
          position: 'relative', zIndex: 2,
          width: '100%', maxWidth: 600,
          padding: '0 28px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          {/* Step label */}
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#d4a017', marginBottom: 16, textAlign: 'center',
          }}>
            Step {currentStep} of {SLIDES.length - 2}
          </div>

          {/* Question */}
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700, color: '#f0ede4',
            textAlign: 'center', lineHeight: 1.15,
            letterSpacing: '-0.02em', marginBottom: 36,
          }}>
            {slide.heading}
          </h2>

          {/* Name input */}
          {slide.type === 'input' && (
            <>
              <input
                ref={inputRef}
                type="text"
                value={answers.name}
                onChange={e => setAnswers({ ...answers, name: e.target.value })}
                placeholder={slide.placeholder}
                style={{
                  width: '100%', background: 'transparent',
                  border: 'none', borderBottom: '1.5px solid #d4a017',
                  color: '#f0ede4', fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 600,
                  textAlign: 'center', padding: '10px 0',
                  outline: 'none', marginBottom: 36,
                }}
              />
              <button
                disabled={!answers.name.trim()}
                onClick={handleNext}
                style={{
                  padding: '12px 36px',
                  border: '1px solid rgba(240,237,228,0.3)', borderRadius: 6,
                  background: 'transparent', color: '#f0ede4',
                  fontFamily: 'var(--font-sans)', fontSize: 13,
                  fontWeight: 600, letterSpacing: '0.08em',
                  textTransform: 'uppercase', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  opacity: answers.name.trim() ? 1 : 0.4,
                  transition: 'border-color 180ms, opacity 180ms',
                }}
                onMouseEnter={e => { if (answers.name.trim()) e.currentTarget.style.borderColor = '#d4a017'; }}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(240,237,228,0.3)'}
              >
                Continue <ChevronRight size={15} />
              </button>
            </>
          )}

          {/* Choice / multi */}
          {(slide.type === 'choice' || slide.type === 'multi') && (
            <>
              <div style={{
                width: '100%',
                display: isGrid ? 'grid' : 'flex',
                gridTemplateColumns: isGrid ? '1fr 1fr' : undefined,
                flexDirection: isGrid ? undefined : 'column',
                gap: 10,
              }}>
                {slide.options.map(opt => {
                  const sel = slide.type === 'multi'
                    ? (answers[slide.id] || []).includes(opt)
                    : answers[slide.id] === opt;
                  return (
                    <button key={opt} onClick={() => handleSelect(opt)} style={{
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '17px 22px', borderRadius: 10,
                      border: sel ? '1.5px solid #d4a017' : '1.5px solid rgba(255,255,255,0.12)',
                      background: sel ? '#d4a017' : 'rgba(255,255,255,0.05)',
                      color: sel ? '#0d1a10' : '#f0ede4',
                      fontFamily: 'var(--font-sans)', fontSize: 15,
                      fontWeight: sel ? 700 : 500, cursor: 'pointer',
                      textAlign: 'left', transition: 'all 180ms',
                    }}
                      onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = 'rgba(212,160,23,0.5)'; }}
                      onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                    >
                      <span>{opt}</span>
                      <span style={{
                        width: 22, height: 22, borderRadius: '50%',
                        border: sel ? 'none' : '1.5px solid rgba(255,255,255,0.25)',
                        background: sel ? '#0d1a10' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {sel && <Check size={12} style={{ color: '#d4a017' }} />}
                      </span>
                    </button>
                  );
                })}
              </div>
              {slide.type === 'multi' && (
                <div style={{ marginTop: 24 }}>
                  <button
                    disabled={!(answers[slide.id] || []).length}
                    onClick={handleNext}
                    style={{
                      padding: '12px 36px',
                      border: '1px solid rgba(240,237,228,0.3)', borderRadius: 6,
                      background: 'transparent', color: '#f0ede4',
                      fontFamily: 'var(--font-sans)', fontSize: 13,
                      fontWeight: 600, letterSpacing: '0.08em',
                      textTransform: 'uppercase', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8,
                      opacity: (answers[slide.id] || []).length ? 1 : 0.4,
                      transition: 'border-color 180ms, opacity 180ms',
                    }}
                    onMouseEnter={e => { if ((answers[slide.id] || []).length) e.currentTarget.style.borderColor = '#d4a017'; }}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(240,237,228,0.3)'}
                  >
                    Continue <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // ── COMPLETION SLIDE ──────────────────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: '#0d1a10',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <MountainBg />
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center', padding: '0 28px',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(90,173,102,0.15)', border: '1.5px solid #5aad66',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
        }}>
          <Check size={36} style={{ color: '#5aad66' }} />
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 700,
          color: '#f0ede4', letterSpacing: '-0.02em', marginBottom: 12,
        }}>
          You're all set, {answers.name}!
        </h2>
        <p style={{
          fontFamily: 'var(--font-display)', fontStyle: 'italic',
          fontSize: 16, color: 'rgba(240,237,228,0.6)', marginBottom: 36,
        }}>
          Your personalized dashboard is ready.
        </p>
        <button onClick={handleNext} style={{
          padding: '15px 48px', borderRadius: 99,
          background: '#d4a017', color: '#0d1a10',
          fontFamily: 'var(--font-sans)', fontSize: 15,
          fontWeight: 700, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 4px 24px rgba(212,160,23,0.35)',
          transition: 'transform 160ms',
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Go to my dashboard <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}
