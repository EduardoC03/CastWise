import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, Check, MapPin, Search, 
  Trophy, Sparkles, Fish, Eye, BookOpen, MessageCircle, 
  Send, Compass, Sliders, Thermometer, Wind, Droplets 
} from 'lucide-react';

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
  
  // ── NEW FEATURE DEMO SLIDES ───────────────────────────────────────────────
  { id: 'demo_map',      type: 'demo_map',      heading: '1. Live Map & Stocking Reports' },
  { id: 'demo_picks',    type: 'demo_picks',    heading: '2. Smart Personalized Picks' },
  { id: 'demo_species',  type: 'demo_species',  heading: '3. Species Analytics Directory' },
  { id: 'demo_briefing', type: 'demo_briefing', heading: '4. AI-Generated Trip Briefings' },
  
  { id: 'completion', type: 'completion' },
];

// Mock Data for the onboarding tour interactive preview boxes
const MOCK_MAP_SITES = [
  { name: 'Deer Lake', county: 'Island', match: 96, stocked: 'Stocked 2d ago', lat: 35, lng: 40 },
  { name: 'Pass Lake', county: 'Skagit', match: 88, stocked: 'Opening Soon', lat: 60, lng: 65 },
  { name: 'Lone Lake', county: 'Island', match: 74, stocked: 'Year-Round', lat: 20, lng: 75 }
];

const MOCK_SPECIES = [
  { name: 'Rainbow Trout', latin: 'Oncorhynchus mykiss', weight: '2–8 lbs', bait: 'Flies / Lures', habitat: 'Lakes & Rivers', tip: 'Look for recent stocking lines along northern shores.' },
  { name: 'Cutthroat Trout', latin: 'Oncorhynchus clarkii', weight: '1–5 lbs', bait: 'Small Flies', habitat: 'Cold Streams', tip: 'Target fast riffles and eddy lines near structures.' }
];

// Background image from src/assets
import welcomeBg from '../assets/welcome-bg.jpg';
import fishLogo from '../assets/fish_logo_transparent.png';
const WELCOME_PHOTO = welcomeBg;

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

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    name: '', experience: '', frequency: '', gear: [],
    styles: [], region: '', travel: '', access: '',
  });
  
  // Interactive mini-states for the preview sections
  const [selectedMapSite, setSelectedMapSite] = useState(MOCK_MAP_SITES[0]);
  const [selectedSpecie, setSelectedSpecie] = useState(MOCK_SPECIES[0]);
  const [demoChatText, setDemoChatText] = useState('');
  const [demoMessages, setDemoMessages] = useState([
    { role: 'assistant', text: 'Hey there! Ready to fish Deer Lake? Ask me about tactics, flies, or optimal launch times based on your profile.' }
  ]);

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

  const handleSendDemoMessage = () => {
    if (!demoChatText.trim()) return;
    const nextMsgs = [...demoMessages, { role: 'user', text: demoChatText }];
    setDemoMessages(nextMsgs);
    setDemoChatText('');
    setTimeout(() => {
      setDemoMessages([...nextMsgs, { 
        role: 'assistant', 
        text: `Based on your style preference (${answers.styles[0] || 'Spin fishing'}), try matching slow retrieval speeds near deep pockets!` 
      }]);
    }, 800);
  };

  const slide        = SLIDES[currentStep];
  const progress     = (currentStep / (SLIDES.length - 1)) * 100;
  const isGrid       = slide.options?.length > 3;
  const isWelcome    = slide.type === 'welcome';
  const isCompletion = slide.type === 'completion';
  const isDemoSlide  = slide.type.startsWith('demo_');
  const showBack     = currentStep > 0 && !isWelcome && !isCompletion;

  // Track relative step indices for text formatting
  const totalQuestions = 8; 
  const isQuestionStep = currentStep > 0 && currentStep <= totalQuestions;
  const demoIndex      = isDemoSlide ? (currentStep - totalQuestions) : 0;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Enter') return;
      if (slide.type === 'input' && answers.name.trim()) handleNext();
      if (slide.type === 'multi' && (answers[slide.id] || []).length) handleNext();
      if (isWelcome || isCompletion || isDemoSlide) handleNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentStep, answers]);

  // ── WELCOME SLIDE ─────────────────────────────────────────────────────────
  if (isWelcome) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0a1a0e' }}>
        <img src={WELCOME_PHOTO} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', imageRendering: 'high-quality', filter: 'contrast(1.06) saturate(1.08)', willChange: 'transform', transform: 'translateZ(0)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0.22), rgba(0,0,0,0.28))', backdropFilter: 'blur(0.8px)', WebkitBackdropFilter: 'blur(0.8px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to top, rgba(255,255,255,0.15), transparent)', pointerEvents: 'none' }} />
        
        <nav style={{ position: 'relative', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #d4a017', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#d4a017', fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>CW</span>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Cast<em style={{ fontStyle: 'italic', color: '#d4a017' }}>Wise</em>
            </span>
          </div>
          <ul style={{ display: 'flex', gap: 40, listStyle: 'none', margin: 0, padding: 0 }}>
            {['Map', 'Picks', 'Species', 'Trip Briefing'].map(l => (
              <li key={l}><a href="#" style={{ color: '#ffffff', fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-sans)', letterSpacing: '0.04em', textDecoration: 'none' }}>{l}</a></li>
            ))}
          </ul>
          <div style={{ width: 128 }} />
        </nav>

        <section style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 16px', position: 'relative', zIndex: 10 }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', border: '1.5px solid rgba(212,160,23,0.5)', background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, boxShadow: '0 0 40px rgba(212,160,23,0.2)' }}>
            <img src={fishLogo} alt="CastWise" style={{ width: 72, height: 72, objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(212,160,23,0.3))' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(64px, 10vw, 96px)', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>
            Cast<em style={{ fontStyle: 'italic', color: '#d4a017' }}>Wise</em>
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', fontWeight: 500, color: '#f0ede4', marginBottom: 40, letterSpacing: '-0.01em', fontFamily: 'var(--font-sans)' }}>
            Fish smarter, not harder.
          </p>
          <button onClick={handleNext} style={{ background: '#d4a017', color: '#0f172a', fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 600, padding: '16px 48px', borderRadius: 99, border: 'none', cursor: 'pointer', boxShadow: '0 10px 40px rgba(0,0,0,0.25)', transition: 'transform 160ms, background 160ms' }} onMouseEnter={e => { e.currentTarget.style.background = '#c49010'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={e => { e.currentTarget.style.background = '#d4a017'; e.currentTarget.style.transform = 'scale(1)'; }}>
            Get Started
          </button>
        </section>

        <footer style={{ position: 'relative', zIndex: 20, width: '100%', padding: '24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Map', 'Picks', 'Species', 'Trip Briefing'].map(l => (
              <a key={l} href="#" style={{ color: '#6b7280', fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
          <span style={{ fontSize: 10, color: '#4b5563', fontFamily: 'var(--font-sans)' }}>© 2026 CastWise. All rights reserved.</span>
        </footer>
      </div>
    );
  }

  // ── PANEL & QUESTION FLOWS ────────────────────────────────────────────────
  if (!isCompletion) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#0d1a10', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <MountainBg />

        {/* Progress bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.08)' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: '#d4a017', transition: 'width 450ms cubic-bezier(0.4,0,0.2,1)' }} />
        </div>

        {/* Back button */}
        {showBack && (
          <button onClick={handleBack} style={{ position: 'absolute', top: 24, left: 24, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,237,228,0.45)', transition: 'color 150ms', zIndex: 30 }} onMouseEnter={e => e.currentTarget.style.color = 'rgba(240,237,228,0.9)'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,237,228,0.45)'}>
            <ChevronLeft size={13} /> Back
          </button>
        )}

        {/* Skip Feature Tour Button */}
        {isDemoSlide && (
          <button onClick={() => setCurrentStep(SLIDES.length - 1)} style={{ position: 'absolute', top: 24, right: 24, background: 'transparent', border: '1px solid rgba(212,160,23,0.3)', borderRadius: 4, padding: '4px 12px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10, color: '#d4a017', transition: 'all 150ms', zIndex: 30 }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,160,23,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            Skip Tour
          </button>
        )}

        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: isDemoSlide ? 900 : 600, padding: '0 28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Step label description line */}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#d4a017', marginBottom: 12, textAlign: 'center' }}>
            {isQuestionStep ? `Profile Setup: Step ${currentStep} of ${totalQuestions}` : `Application Walkthrough: Feature ${demoIndex} of 4`}
          </div>

          {/* Core Header */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: isDemoSlide ? '28px' : 'clamp(26px, 4vw, 38px)', fontWeight: 700, color: '#f0ede4', textAlign: 'center', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: isDemoSlide ? 24 : 36 }}>
            {slide.heading}
          </h2>

          {/* ──────────────────────────────────────────────────────────────
              QUESTION SLIDE TYPES (Original functionality preserved)
             ────────────────────────────────────────────────────────────── */}
          {slide.type === 'input' && (
            <>
              <input ref={inputRef} type="text" value={answers.name} onChange={e => setAnswers({ ...answers, name: e.target.value })} placeholder={slide.placeholder} style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1.5px solid #d4a017', color: '#f0ede4', fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 600, textAlign: 'center', padding: '10px 0', outline: 'none', marginBottom: 36 }} />
              <button disabled={!answers.name.trim()} onClick={handleNext} style={{ padding: '12px 36px', border: '1px solid rgba(240,237,228,0.3)', borderRadius: 6, background: 'transparent', color: '#f0ede4', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, opacity: answers.name.trim() ? 1 : 0.4 }} onMouseEnter={e => { if (answers.name.trim()) e.currentTarget.style.borderColor = '#d4a017'; }} onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(240,237,228,0.3)'}>
                Continue <ChevronRight size={15} />
              </button>
            </>
          )}

          {(slide.type === 'choice' || slide.type === 'multi') && (
            <>
              <div style={{ width: '100%', display: isGrid ? 'grid' : 'flex', gridTemplateColumns: isGrid ? '1fr 1fr' : undefined, flexDirection: isGrid ? undefined : 'column', gap: 10 }}>
                {slide.options.map(opt => {
                  const sel = slide.type === 'multi' ? (answers[slide.id] || []).includes(opt) : answers[slide.id] === opt;
                  return (
                    <button key={opt} onClick={() => handleSelect(opt)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', borderRadius: 10, border: sel ? '1.5px solid #d4a017' : '1.5px solid rgba(255,255,255,0.12)', background: sel ? '#d4a017' : 'rgba(255,255,255,0.05)', color: sel ? '#0d1a10' : '#f0ede4', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: sel ? 700 : 500, cursor: 'pointer', textAlign: 'left', transition: 'all 180ms' }} onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = 'rgba(212,160,23,0.5)'; }} onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
                      <span>{opt}</span>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', border: sel ? 'none' : '1.5px solid rgba(255,255,255,0.25)', background: sel ? '#0d1a10' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {sel && <Check size={12} style={{ color: '#d4a017' }} />}
                      </span>
                    </button>
                  );
                })}
              </div>
              {slide.type === 'multi' && (
                <div style={{ marginTop: 24 }}>
                  <button disabled={!(answers[slide.id] || []).length} onClick={handleNext} style={{ padding: '12px 36px', border: '1px solid rgba(240,237,228,0.3)', borderRadius: 6, background: 'transparent', color: '#f0ede4', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, opacity: (answers[slide.id] || []).length ? 1 : 0.4 }} onMouseEnter={e => { if ((answers[slide.id] || []).length) e.currentTarget.style.borderColor = '#d4a017'; }} onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(240,237,228,0.3)'}>
                    Continue <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </>
          )}

          {/* ──────────────────────────────────────────────────────────────
              NEW DEMO VIEWPORTS (The 4 interactive walkthrough sections)
             ────────────────────────────────────────────────────────────── */}
          
          {/* STEP 1: MAP TAB DEMO */}
          {slide.type === 'demo_map' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ color: 'rgba(240,237,228,0.7)', fontSize: 14, textAlign: 'center', maxWidth: 650, margin: '0 auto 10px auto' }}>
                Track body openings, closures, and weekly WDFW trout stocking updates live. Click a site on our dashboard mock below to view instant pinpoint coordinates.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', background: '#122517', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', height: 320, overflow: 'hidden', boxShadow: '0 12px 36px rgba(0,0,0,0.4)' }}>
                {/* Simulated list sidebar */}
                <div style={{ borderRight: '1px solid rgba(255,255,255,0.08)', padding: 12, display: 'flex', flexDirection: 'column', gap: 8, background: '#0e1f13' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#09150d', padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Search size={12} color="rgba(255,255,255,0.4)" />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Search WA bodies...</span>
                  </div>
                  <div style={{ fontSize: 10, color: '#d4a017', fontWeight: 600, letterSpacing: '0.05em', marginTop: 4 }}>RECOMMENDED SPOTS</div>
                  {MOCK_MAP_SITES.map(s => (
                    <div key={s.name} onClick={() => setSelectedMapSite(s)} style={{ padding: '10px 12px', borderRadius: 6, background: selectedMapSite.name === s.name ? 'rgba(212,160,23,0.12)' : 'transparent', border: selectedMapSite.name === s.name ? '1px solid #d4a017' : '1px solid transparent', cursor: 'pointer', transition: 'all 150ms' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                        <span style={{ fontSize: 9, padding: '2px 5px', background: s.stocked.includes('Stocked') ? '#2e5c36' : 'rgba(255,255,255,0.1)', color: s.stocked.includes('Stocked') ? '#a6e3b0' : '#ccc', borderRadius: 3 }}>{s.match}%</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(240,237,228,0.5)', marginTop: 2 }}>{s.county} County · {s.stocked}</div>
                    </div>
                  ))}
                </div>
                {/* Simulated Interactive Map Space */}
                <div style={{ relative: 'relative', background: '#0a170e', display: 'flex', alignItems: 'center', justifyAll: 'center', backgroundImage: 'radial-gradient(rgba(212,160,23,0.04) 1.5px, transparent 1.5px)', backgroundSize: '16px 16px', position: 'relative' }}>
                  {MOCK_MAP_SITES.map(s => (
                    <div key={s.name} style={{ position: 'absolute', top: `${s.lat}%`, left: `${s.lng}%`, transform: 'translate(-50%, -50%)', cursor: 'pointer' }} onClick={() => setSelectedMapSite(s)}>
                      <MapPin size={selectedMapSite.name === s.name ? 26 : 18} color={selectedMapSite.name === s.name ? '#d4a017' : 'rgba(255,255,255,0.4)'} style={{ filter: selectedMapSite.name === s.name ? 'drop-shadow(0 0 8px #d4a017)' : 'none', transition: 'all 150ms' }} />
                    </div>
                  ))}
                  {/* Selected Site Popover card details */}
                  <div style={{ position: 'absolute', bottom: 16, right: 16, left: 16, background: 'rgba(9,21,13,0.95)', border: '1px solid rgba(212,160,23,0.4)', borderRadius: 8, padding: 12, backdropFilter: 'blur(4px)' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Compass size={14} color="#d4a017" />
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Selected: {selectedMapSite.name} GPS Hub</div>
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(240,237,228,0.7)', marginTop: 4 }}>
                      Coordinates established. Adding this to your profile auto-calibrates active distance calculations matching your maximum {answers.travel || '1 hour'} travel preference.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PICKS EXPLANATION */}
          {slide.type === 'demo_picks' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ color: 'rgba(240,237,228,0.7)', fontSize: 14, textAlign: 'center', maxWidth: 650, margin: '0 auto 10px auto' }}>
                CastWise analyzes your unique profile variables—experience, preferred access method, and active tackle items—to rank nearby waters with a custom score.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: '100%' }}>
                {/* Left Side: Users defined parameters */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 8 }}>
                    <Sliders size={14} color="#d4a017" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', letterSpacing: '0.05em' }}>YOUR COMPUTATION PROFILE</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(240,237,228,0.8)' }}>
                    <div style={{ marginBottom: 6 }}>• Skill Level: <strong style={{ color: '#d4a017' }}>{answers.experience || 'Beginner'}</strong></div>
                    <div style={{ marginBottom: 6 }}>• Base Location: <strong style={{ color: '#d4a017' }}>{answers.region || 'Northwest WA'}</strong></div>
                    <div style={{ marginBottom: 6 }}>• Launch Method: <strong style={{ color: '#d4a017' }}>{answers.access || 'Bank fishing'}</strong></div>
                    <div>• Active Gears: <span style={{ color: 'rgba(240,237,228,0.6)' }}>{(answers.gear || []).join(', ') || 'Spinning rod'}</span></div>
                  </div>
                  <div style={{ background: 'rgba(212,160,23,0.06)', borderRadius: 6, padding: 10, fontSize: 11, color: 'rgba(212,160,23,0.8)', border: '1px dashed rgba(212,160,23,0.3)', marginTop: 'auto' }}>
                    💡 Any adjustments made later inside your master Settings tab instantly recalibrates your dashboard feed index.
                  </div>
                </div>

                {/* Right Side: The Score Output UI Card matching the mockup look */}
                <div style={{ background: '#192921', borderLeft: '3px solid #d4a017', borderRadius: '4px 10px 10px 4px', padding: 20, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', justifyAll: 'center' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.05em' }}>TOP PICK FOR YOU</div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '4px 0 2px 0', fontFamily: 'var(--font-display)' }}>Deer Lake</h3>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', marginBottom: 12 }}>ISLAND COUNTY</div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#d4a017', color: '#0d1a10', padding: '6px 10px', borderRadius: 4, width: 'fit-content', fontSize: 11, fontWeight: 700, marginBottom: 16 }}>
                    <Trophy size={12} />
                    <span>96 SCORE BASED ON YOUR PROFILE</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'rgba(240,237,228,0.8)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check size={12} color="#5aad66" /> Perfect fit for {answers.access || 'Bank access'} line layouts</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check size={12} color="#5aad66" /> High concentration of native Rainbow Trout</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check size={12} color="#5aad66" /> Within your active travel radius limit</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SPECIES CATALOG PREVIEW */}
          {slide.type === 'demo_species' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ color: 'rgba(240,237,228,0.7)', fontSize: 14, textAlign: 'center', maxWidth: 650, margin: '0 auto 10px auto' }}>
                Access deep biological indices, bag limits, and custom lure criteria. Toggle between the example species items below to test the directory catalog dashboard.
              </p>
              
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 4 }}>
                {MOCK_SPECIES.map(sp => (
                  <button key={sp.name} onClick={() => setSelectedSpecie(sp)} style={{ padding: '8px 20px', borderRadius: 20, border: selectedSpecie.name === sp.name ? '1.5px solid #d4a017' : '1.5px solid rgba(255,255,255,0.1)', background: selectedSpecie.name === sp.name ? '#d4a017' : 'rgba(255,255,255,0.04)', color: selectedSpecie.name === sp.name ? '#0d1a10' : '#f0ede4', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 150ms' }}>
                    {sp.name}
                  </button>
                ))}
              </div>

              <div style={{ background: '#111A15', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 22, boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12, marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>{selectedSpecie.name}</h3>
                    <div style={{ fontSize: 12, color: 'rgba(212,160,23,0.8)', fontFamily: 'var(--font-mono)', fontStyle: 'italic', marginTop: 2 }}>{selectedSpecie.latin}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 6, fontSize: 12, color: '#fff', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Fish size={12} color="#d4a017" style={{ inline: 'middle', marginRight: 5 }} /> {selectedSpecie.habitat}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 6, border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Weight</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginTop: 2 }}>{selectedSpecie.weight}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 6, border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bait Preference</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginTop: 2 }}>{selectedSpecie.bait}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 6, border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Optimal Seasons</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginTop: 2 }}>Year-round</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, background: 'rgba(212,160,23,0.05)', borderLeft: '3px solid #d4a017', padding: 12, borderRadius: '0 6px 6px 0' }}>
                  <BookOpen size={15} color="#d4a017" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div style={{ fontSize: 12, color: 'rgba(240,237,228,0.9)', lineHeight: 1.4 }}>
                    <strong>Onboarding Intel Tip:</strong> {selectedSpecie.tip}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: TRIP BRIEFING PREVIEW */}
          {slide.type === 'demo_briefing' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ color: 'rgba(240,237,228,0.7)', fontSize: 14, textAlign: 'center', maxWidth: 650, margin: '0 auto 4px auto' }}>
                When you activate a target site, CastWise crafts an automated, AI-powered strategy briefing complete with real-time weather analytics and a responsive chat advisor.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16, width: '100%', background: '#111a15', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', padding: 16, boxShadow: '0 12px 36px rgba(0,0,0,0.4)' }}>
                
                {/* Left Mini Sidebar - Real-time Conditions preview */}
                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: 12, border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.05em' }}>TODAY'S CONDITIONS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#fff', fontWeight: 600 }}><Thermometer size={12} color="#d4a017" /> 62°F</div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>AIR TEMP</div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#fff', fontWeight: 600 }}><Wind size={12} color="#d4a017" /> 4 mph</div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>WIND</div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#fff', fontWeight: 600 }}><Droplets size={12} color="#d4a017" /> Dry</div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>PRECIP</div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#fff', fontWeight: 600 }}><Sparkles size={12} color="#d4a017" /> Clear</div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>SKY</div>
                    </div>
                  </div>
                </div>

                {/* Right Area - AI strategy output + Chat simulation box */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ background: 'rgba(212,160,23,0.04)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, padding: 12, fontSize: 12, color: 'rgba(240,237,228,0.95)', lineHeight: 1.4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#d4a017', fontWeight: 700, marginBottom: 4 }}>
                      <Sparkles size={12} /> Personalized Tactical Strategy Guide
                    </div>
                    Since you're utilizing a <span style={{ color: '#d4a017' }}>{answers.gear?.[0] || 'Spinning rod'}</span> at Deer Lake, target points near shallow gravel shorelines using light leader lines. Stocked trout will strike aggressively on fluorescent lures during early morning light.
                  </div>

                  {/* Micro Live chat preview window inside onboarding */}
                  <div style={{ display: 'flex', flexDirection: 'column', background: '#09150d', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', height: 110, overflowY: 'auto', padding: 10, gap: 8 }}>
                    {demoMessages.map((m, idx) => (
                      <div key={idx} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? '#d4a017' : 'rgba(255,255,255,0.05)', color: m.role === 'user' ? '#0d1a10' : 'rgba(240,237,228,0.9)', padding: '6px 10px', borderRadius: 6, fontSize: 11, maxWidth: '85%', fontWeight: m.role === 'user' ? 600 : 500 }}>
                        {m.text}
                      </div>
                    ))}
                  </div>

                  {/* Input container row */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="text" value={demoChatText} onChange={e => setDemoChatText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendDemoMessage()} placeholder="Ask the advisor about bait, rules, launch zones..." style={{ flex: 1, background: '#09150d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '8px 12px', fontSize: 12, color: '#fff', outline: 'none' }} />
                    <button onClick={handleSendDemoMessage} style={{ background: '#d4a017', border: 'none', borderRadius: 6, padding: '0 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyAll: 'center' }}>
                      <Send size={12} color="#0d1a10" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Universal Continue Button for the new 4 Feature Tour items */}
          {isDemoSlide && (
            <div style={{ marginTop: 28 }}>
              <button onClick={handleNext} style={{ padding: '14px 44px', background: '#d4a017', color: '#0d1a10', border: 'none', borderRadius: 99, fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(212,160,23,0.25)', transition: 'transform 150ms' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                {demoIndex === 4 ? 'Finish Setup' : 'Next Tool Feature'} <ChevronRight size={16} />
              </button>
            </div>
          )}

        </div>
      </div>
    );
  }

  // ── COMPLETION SLIDE (Original functionality preserved) ───────────────────
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#0d1a10', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyAll: 'center', overflow: 'hidden', justifyContent: 'center' }}>
      <MountainBg />
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 28px' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(90,173,102,0.15)', border: '1.5px solid #5aad66', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Check size={36} style={{ color: '#5aad66' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 700, color: '#f0ede4', letterSpacing: '-0.02em', marginBottom: 12 }}>
          You're all set, {answers.name}!
        </h2>
        <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16, color: 'rgba(240,237,228,0.6)', marginBottom: 36 }}>
          Your personalized dashboard is ready.
        </p>
        <button onClick={handleNext} style={{ padding: '15px 48px', borderRadius: 99, background: '#d4a017', color: '#0d1a10', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 24px rgba(212,160,23,0.35)', transition: 'transform 160ms' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          Go to my dashboard <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}
