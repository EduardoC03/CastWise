import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Check, Fish } from 'lucide-react';

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

// ── Welcome background — place welcome-bg.jpg in your /public folder ────────
const WELCOME_PHOTO = '/welcome-bg.jpg';

// ── Mountain silhouette SVG layers for name + question slides ─────────────────
function MountainBg() {
  return (
    <svg
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        width: '100%',
        height: '42%',
        pointerEvents: 'none',
      }}
    >
      {/* Back range — lightest */}
      <path
        d="M0,260 L120,180 L240,220 L380,140 L520,200 L640,130 L760,190 L900,120 L1020,175 L1160,110 L1300,160 L1440,130 L1440,320 L0,320 Z"
        fill="#1a3020"
        opacity="0.5"
      />
      {/* Mid range */}
      <path
        d="M0,290 L100,230 L200,260 L340,190 L460,240 L580,175 L700,230 L840,165 L960,215 L1100,155 L1240,205 L1350,175 L1440,195 L1440,320 L0,320 Z"
        fill="#1e3824"
        opacity="0.75"
      />
      {/* Front range — darkest */}
      <path
        d="M0,310 L80,270 L180,295 L300,245 L420,280 L540,235 L660,275 L780,240 L900,270 L1020,235 L1140,265 L1260,245 L1380,260 L1440,255 L1440,320 L0,320 Z"
        fill="#122016"
        opacity="1"
      />
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

  const slide        = SLIDES[currentStep];
  const progress     = (currentStep / (SLIDES.length - 1)) * 100;
  const isGrid       = slide.options?.length > 3;
  const isWelcome    = slide.type === 'welcome';
  const isCompletion = slide.type === 'completion';
  const showMountain = !isWelcome && !isCompletion;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Enter') return;
      if (slide.type === 'input'      && answers.name.trim())                   handleNext();
      if (slide.type === 'multi'      && (answers[slide.id] || []).length)      handleNext();
      if (slide.type === 'welcome'    || slide.type === 'completion')           handleNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentStep, answers]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: '#0d1a10',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>

      {/* ── WELCOME SLIDE ───────────────────────────────────────────────── */}
      {isWelcome && (
        <>
          {/* Full-bleed photo */}
          <img
            src={WELCOME_PHOTO}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 60%',
            }}
          />
          {/* Subtle dark overlay so text reads */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.32) 100%)',
          }} />

          {/* Navbar — always visible, semi-transparent dark bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            padding: '0 32px',
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0,0,0,0.38)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 10,
          }}>
            {/* Logo */}
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700,
              letterSpacing: '-0.02em', color: '#f0ede4',
            }}>
              Cast<em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Wise</em>
            </span>
            {/* Nav links */}
            <div style={{ display: 'flex', gap: 28 }}>
              {['Map', 'Picks', 'Species', 'Trip Briefing'].map(l => (
                <span key={l} style={{
                  fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
                  color: 'rgba(240,237,228,0.75)',
                  cursor: 'default',
                  letterSpacing: '0.01em',
                }}>
                  {l}
                </span>
              ))}
            </div>
            {/* Right spacer keeps links centered */}
            <div style={{ width: 120 }} />
          </div>

          {/* Centered brand content */}
          <div style={{
            position: 'relative', zIndex: 2,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', textAlign: 'center',
            gap: 0,
          }}>
            {/* Fish icon circle */}
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              border: '1.5px solid var(--gold)',
              background: 'rgba(212,160,23,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 20,
            }}>
              <Fish size={30} style={{ color: 'var(--gold)' }} />
            </div>

            {/* Wordmark */}
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(52px, 8vw, 80px)',
              fontWeight: 700,
              color: '#f0ede4',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              marginBottom: 14,
              textShadow: '0 2px 20px rgba(0,0,0,0.4)',
            }}>
              Cast<em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Wise</em>
            </h1>

            {/* Tagline */}
            <p style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: 'rgba(240,237,228,0.85)',
              marginBottom: 36,
              textShadow: '0 1px 8px rgba(0,0,0,0.5)',
            }}>
              Fish smarter, not harder.
            </p>

            {/* CTA */}
            <button
              onClick={handleNext}
              style={{
                padding: '16px 52px',
                borderRadius: 99,
                background: 'var(--gold)',
                color: '#0d1a10',
                fontFamily: 'var(--font-sans)',
                fontSize: 16,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.02em',
                boxShadow: '0 4px 24px rgba(212,160,23,0.35)',
                transition: 'transform 160ms, box-shadow 160ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(212,160,23,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(212,160,23,0.35)'; }}
            >
              Get Started
            </button>
          </div>
        </>
      )}

      {/* ── QUESTION / INPUT SLIDES ─────────────────────────────────────── */}
      {!isWelcome && !isCompletion && (
        <>
          {/* Mountain silhouette background */}
          {showMountain && <MountainBg />}

          {/* Progress bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.08)' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--gold)', transition: 'width 450ms cubic-bezier(0.4,0,0.2,1)' }} />
          </div>

          {/* Back button */}
          <button onClick={handleBack} style={{
            position: 'absolute', top: 24, left: 24,
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(240,237,228,0.45)',
            transition: 'color 150ms',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(240,237,228,0.9)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,237,228,0.45)'}
          >
            <ChevronLeft size={13} /> Back
          </button>

          {/* Slide content */}
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
              color: 'var(--gold)', marginBottom: 16, textAlign: 'center',
            }}>
              Step {currentStep - 1} of 7
            </div>

            {/* Question heading */}
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              color: '#f0ede4',
              textAlign: 'center',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: 36,
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
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1.5px solid var(--gold)',
                    color: '#f0ede4',
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(24px, 3vw, 32px)',
                    fontWeight: 600,
                    textAlign: 'center',
                    padding: '10px 0',
                    outline: 'none',
                    marginBottom: 36,
                    letterSpacing: '0.01em',
                  }}
                  onFocus={e => e.target.style.borderBottomColor = 'var(--gold-soft)'}
                  onBlur={e => e.target.style.borderBottomColor = 'var(--gold)'}
                />
                <button
                  disabled={!answers.name.trim()}
                  onClick={handleNext}
                  style={{
                    padding: '12px 36px',
                    border: '1px solid rgba(240,237,228,0.3)',
                    borderRadius: 6,
                    background: 'transparent',
                    color: '#f0ede4',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                    opacity: answers.name.trim() ? 1 : 0.4,
                    transition: 'border-color 180ms, opacity 180ms',
                  }}
                  onMouseEnter={e => { if (answers.name.trim()) e.currentTarget.style.borderColor = 'var(--gold)'; }}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(240,237,228,0.3)'}
                >
                  Continue <ChevronRight size={15} />
                </button>
              </>
            )}

            {/* Choice / multi options */}
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
                      <button
                        key={opt}
                        onClick={() => handleSelect(opt)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '17px 22px',
                          borderRadius: 10,
                          border: sel ? '1.5px solid var(--gold)' : '1.5px solid rgba(255,255,255,0.12)',
                          background: sel ? 'var(--gold)' : 'rgba(255,255,255,0.05)',
                          color: sel ? '#0d1a10' : '#f0ede4',
                          fontFamily: 'var(--font-sans)',
                          fontSize: 15,
                          fontWeight: sel ? 700 : 500,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 180ms',
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
                          {sel && <Check size={12} style={{ color: 'var(--gold)' }} />}
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
                        border: '1px solid rgba(240,237,228,0.3)',
                        borderRadius: 6,
                        background: 'transparent',
                        color: '#f0ede4',
                        fontFamily: 'var(--font-sans)',
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 8,
                        opacity: (answers[slide.id] || []).length ? 1 : 0.4,
                        transition: 'border-color 180ms, opacity 180ms',
                      }}
                      onMouseEnter={e => { if ((answers[slide.id] || []).length) e.currentTarget.style.borderColor = 'var(--gold)'; }}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(240,237,228,0.3)'}
                    >
                      Continue <ChevronRight size={15} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* ── COMPLETION SLIDE ────────────────────────────────────────────── */}
      {isCompletion && (
        <>
          {showMountain && <MountainBg />}
          <div style={{
            position: 'relative', zIndex: 2,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', textAlign: 'center',
            padding: '0 28px',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(90,173,102,0.15)',
              border: '1.5px solid #5aad66',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 24,
            }}>
              <Check size={36} style={{ color: '#5aad66' }} />
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(30px, 4vw, 44px)',
              fontWeight: 700,
              color: '#f0ede4',
              letterSpacing: '-0.02em',
              marginBottom: 12,
            }}>
              You're all set, {answers.name}!
            </h2>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 16,
              color: 'rgba(240,237,228,0.6)',
              marginBottom: 36,
            }}>
              Your personalized dashboard is ready.
            </p>
            <button
              onClick={handleNext}
              style={{
                padding: '15px 48px',
                borderRadius: 99,
                background: 'var(--gold)',
                color: '#0d1a10',
                fontFamily: 'var(--font-sans)',
                fontSize: 15,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
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
        </>
      )}
    </div>
  );
}
