import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

const SLIDES = [
  { id: 'welcome',    type: 'welcome' },
  { id: 'name',       type: 'input',  heading: 'First, what should we call you?', placeholder: 'Your first name' },
  { id: 'experience', type: 'choice', heading: 'How would you describe your fishing experience?', options: ['Beginner', 'Intermediate', 'Advanced'] },
  { id: 'frequency',  type: 'choice', heading: 'How often do you fish?', options: ['A few times a year', 'Monthly', 'Weekly', 'Almost daily'] },
  { id: 'gear',       type: 'multi',  heading: 'What gear do you own?', options: ['Spinning rod', 'Fly rod', 'Bait rod', 'Waders', 'Boat', 'Electronics', 'None'] },
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
  const [showPriorities, setShowPriorities] = useState(false);
  const [priorities, setPriorities] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (SLIDES[currentStep].type === 'input' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [currentStep]);

  const QUESTION_SLIDES = SLIDES.filter(s => s.type !== 'welcome' && s.type !== 'completion');
  const PRIORITY_OPTIONS = [
    { v: 'experience', label: 'Experience level',    sub: 'Matching spots to your skill' },
    { v: 'frequency',  label: 'How often you fish',  sub: 'Based on your fishing schedule' },
    { v: 'gear',       label: 'Gear you own',        sub: 'Access based on your equipment' },
    { v: 'styles',     label: 'Fishing styles',      sub: 'Your preferred techniques' },
    { v: 'region',     label: 'Your region',         sub: 'Spots near where you live' },
    { v: 'travel',     label: 'Travel distance',     sub: 'How far you\'ll go' },
    { v: 'access',     label: 'Water access type',   sub: 'Bank, wade, or boat' },
  ];

  const handleNext = () => {
    const lastQuestionIndex = SLIDES.findIndex(s => s.id === 'access');
    if (currentStep === lastQuestionIndex) {
      setTimeout(() => setShowPriorities(true), 280);
      return;
    }
    if (currentStep === SLIDES.length - 1) {
      onComplete({ ...answers, priorities, completedAt: new Date().toISOString() });
      return;
    }
    const advance = () => setCurrentStep(p => p + 1);
    SLIDES[currentStep].type === 'choice' ? setTimeout(advance, 280) : advance();
  };

  const handlePrioritySelect = (v) => {
    if (priorities.includes(v)) {
      setPriorities(priorities.filter(x => x !== v));
    } else if (priorities.length < 3) {
      setPriorities([...priorities, v]);
    }
  };

  const finishPriorities = () => {
    setShowPriorities(false);
    setCurrentStep(SLIDES.findIndex(s => s.id === 'completion'));
  };

  const handleBack = () => currentStep > 0 && setCurrentStep(p => p - 1);

  const handleSelect = (val) => {
    const slide = SLIDES[currentStep];
    if (slide.type === 'multi') {
      if (slide.id === 'gear') {
        if (val === 'None') {
          const cur = answers.gear || [];
          setAnswers({ ...answers, gear: cur.includes('None') ? [] : ['None'] });
        } else {
          const cur = (answers.gear || []).filter(x => x !== 'None');
          setAnswers({ ...answers, gear: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] });
        }
      } else {
        const cur = answers[slide.id] || [];
        setAnswers({ ...answers, [slide.id]: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] });
      }
    } else {
      setAnswers({ ...answers, [slide.id]: val });
      handleNext();
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

  // ── PRIORITIES SLIDE ─────────────────────────────────────────────────────
  if (showPriorities) {
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
          width: '100%', maxWidth: 560,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', padding: '0 28px',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700,
            color: '#f0ede4', letterSpacing: '-0.02em',
            textAlign: 'center', marginBottom: 10,
          }}>
            What matters most to you?
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: 14,
            color: 'rgba(240,237,228,0.55)', marginBottom: 28, textAlign: 'center',
          }}>
            Pick your top 3 priorities ({priorities.length} / 3 selected)
          </p>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PRIORITY_OPTIONS.map(opt => {
              const sel      = priorities.includes(opt.v);
              const disabled = !sel && priorities.length >= 3;
              return (
                <button
                  key={opt.v}
                  disabled={disabled}
                  onClick={() => handlePrioritySelect(opt.v)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '15px 20px', borderRadius: 10,
                    border: sel ? '1.5px solid #d4a017' : '1.5px solid rgba(255,255,255,0.12)',
                    background: sel ? '#d4a017' : 'rgba(255,255,255,0.05)',
                    color: sel ? '#0d1a10' : disabled ? 'rgba(240,237,228,0.3)' : '#f0ede4',
                    fontFamily: 'var(--font-sans)', fontSize: 14,
                    fontWeight: sel ? 700 : 500, cursor: disabled ? 'not-allowed' : 'pointer',
                    textAlign: 'left', transition: 'all 180ms',
                  }}
                >
                  <div>
                    <div>{opt.label}</div>
                    <div style={{ fontSize: 11, opacity: 0.65, marginTop: 2 }}>{opt.sub}</div>
                  </div>
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%',
                    border: sel ? 'none' : '1.5px solid rgba(255,255,255,0.25)',
                    background: sel ? '#0d1a10' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                    color: '#d4a017',
                  }}>
                    {sel ? priorities.indexOf(opt.v) + 1 : ''}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            <button
              onClick={() => setShowPriorities(false)}
              style={{
                padding: '12px 28px', borderRadius: 6,
                border: '1px solid rgba(240,237,228,0.3)', background: 'transparent',
                color: '#f0ede4', fontFamily: 'var(--font-sans)', fontSize: 13,
                fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <ChevronLeft size={15} /> Back
            </button>
            <button
              disabled={priorities.length < 3}
              onClick={finishPriorities}
              style={{
                padding: '12px 36px', borderRadius: 6,
                border: '1px solid rgba(240,237,228,0.3)', background: 'transparent',
                color: '#f0ede4', fontFamily: 'var(--font-sans)', fontSize: 13,
                fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: priorities.length < 3 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                opacity: priorities.length < 3 ? 0.4 : 1,
                transition: 'border-color 180ms, opacity 180ms',
              }}
              onMouseEnter={e => { if (priorities.length >= 3) e.currentTarget.style.borderColor = '#d4a017'; }}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(240,237,228,0.3)'}
            >
              Finish <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── WELCOME SLIDE ─────────────────────────────────────────────────────────
  if (isWelcome) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0.55) 100%), url(${WELCOME_PHOTO})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>

        {/* Dark vignette at bottom for footer text legibility */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '25%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)',
          pointerEvents: 'none',
        }} />

        {/* ── Navbar ── */}
        <nav style={{
          position: 'relative', zIndex: 20,
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 32px',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          background: 'rgba(0,0,0,0.18)',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <img src={fishLogo} alt="CastWise" style={{ width: 32, height: 32, objectFit: 'contain' }} />
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
            {['Map', 'Picks', 'Species', 'Trip Briefing'].map(l => (
              <li key={l}>
                <a href="#" style={{
                  color: '#ffffff', fontSize: 13, fontWeight: 500,
                  fontFamily: 'var(--font-sans)', letterSpacing: '0.04em',
                  textDecoration: 'none', transition: 'color 200ms',
                }}
                  onMouseEnter={e => e.target.style.color = '#d4a017'}
                  onMouseLeave={e => e.target.style.color = '#ffffff'}
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>

          {/* Spacer */}
          <div style={{ width: 128 }} />
        </nav>

        {/* ── Hero content ── */}
        <section style={{
          flex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          padding: '0 16px',
          position: 'relative', zIndex: 10,
        }}>
          {/* Fish logo */}
          <img
            src={fishLogo}
            alt="CastWise fish"
            style={{
              width: 220, height: 220,
              objectFit: 'contain',
              marginBottom: 28,
              opacity: 0.95,
              filter: 'drop-shadow(0 6px 28px rgba(212,160,23,0.55)) drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
            }}
          />

          {/* Wordmark */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(64px, 10vw, 96px)',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            marginBottom: 8,
            textShadow: '0 2px 16px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.5)',
          }}>
            Cast<em style={{ fontStyle: 'italic', color: '#d4a017' }}>Wise</em>
          </h1>

          {/* Tagline */}
          <p style={{
            fontSize: 'clamp(16px, 2.5vw, 22px)',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.9)',
            marginBottom: 40,
            letterSpacing: '-0.01em',
            fontFamily: 'var(--font-sans)',
            textShadow: '0 1px 8px rgba(0,0,0,0.7)',
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

        {/* ── Footer ── */}
        <footer style={{
          position: 'relative', zIndex: 20,
          width: '100%', padding: '24px 32px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 12,
        }}>
          {/* Footer nav */}
          <div style={{ display: 'flex', gap: 24 }}>
            {['Map', 'Picks', 'Species', 'Trip Briefing'].map(l => (
              <a key={l} href="#" style={{
                color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 600,
                fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
                letterSpacing: '0.12em', textDecoration: 'none',
                transition: 'color 160ms',
              }}
                onMouseEnter={e => e.target.style.color = '#d4a017'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
              >
                {l}
              </a>
            ))}
          </div>
          {/* Social + copyright */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Facebook */}
            <a href="#" style={{ color: 'rgba(255,255,255,0.5)' }} onMouseEnter={e => e.currentTarget.style.color = '#d4a017'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.14h-3v4h3v12h5v-12h3.85Z"/></svg>
            </a>
            {/* X / Twitter */}
            <a href="#" style={{ color: 'rgba(255,255,255,0.5)' }} onMouseEnter={e => e.currentTarget.style.color = '#d4a017'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M23.95,4.57a10,10,0,0,1-2.82.77,4.96,4.96,0,0,0,2.18-2.72,10.06,10.06,0,0,1-3.12,1.19,4.92,4.92,0,0,0-8.39,4.49A14,14,0,0,1,1.64,3.16,4.92,4.92,0,0,0,3.16,9.72a4.91,4.91,0,0,1-2.22-.61V9.17a4.92,4.92,0,0,0,3.94,4.84,4.91,4.91,0,0,1-2.22.08,4.92,4.92,0,0,0,4.6,3.42A9.87,9.87,0,0,1,0,19.54a13.94,13.94,0,0,0,7.55,2.21,13.9,13.9,0,0,0,14-13.73c0-.21,0-.42,0-.63A10,10,0,0,0,24,4.59Z"/></svg>
            </a>
            {/* Instagram */}
            <a href="#" style={{ color: 'rgba(255,255,255,0.5)' }} onMouseEnter={e => e.currentTarget.style.color = '#d4a017'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s0,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07s-3.58,0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s0-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.17,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.27.2-6.78,2.71-7,7C0,8.33,0,8.74,0,12s0,3.67.07,4.95c.2,4.27,2.71,6.78,7,7,1.28.07,1.69.07,4.95.07s3.67,0,4.95-.07c4.27-.2,6.78-2.71,7-7,.07-1.28.07-1.69.07-4.95s0-3.67-.07-4.95c-.2-4.27-2.71-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84Zm0,10.16A4,4,0,1,1,16,12,4,4,0,0,1,12,16Zm7.84-11a1.44,1.44,0,1,0-1.44,1.44A1.44,1.44,0,0,0,19.84,5.04Z"/></svg>
            </a>
            {/* YouTube */}
            <a href="#" style={{ color: 'rgba(255,255,255,0.5)' }} onMouseEnter={e => e.currentTarget.style.color = '#d4a017'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5,6.19a3,3,0,0,0-2.12-2.12C19.54,3.5,12,3.5,12,3.5s-7.54,0-9.38.57A3,3,0,0,0,.5,6.19,31.16,31.16,0,0,0,0,12a31.16,31.16,0,0,0,.5,5.81,3,3,0,0,0,2.12,2.12C4.46,20.5,12,20.5,12,20.5s7.54,0,9.38-.57a3,3,0,0,0,2.12-2.12A31.16,31.16,0,0,0,24,12,31.16,31.16,0,0,0,23.5,6.19ZM9.75,15.5V8.5L15.5,12Z"/></svg>
            </a>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-sans)' }}>© 2024 CastWise. Fish Smarter.</span>
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
            Step {currentStep - 1} of 7
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
