import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Check, Fish } from 'lucide-react';

const SLIDES = [
  { id: 'welcome', type: 'welcome' },
  { id: 'name', type: 'input', heading: 'First, what should we call you?', placeholder: 'Your first name' },
  {
    id: 'experience',
    type: 'choice',
    heading: 'How would you describe your fishing experience?',
    options: ['Beginner', 'Intermediate', 'Advanced']
  },
  {
    id: 'frequency',
    type: 'choice',
    heading: 'How often do you fish?',
    options: ['A few times a year', 'Monthly', 'Weekly', 'Almost daily']
  },
  {
    id: 'gear',
    type: 'multi',
    heading: 'What gear do you own?',
    options: ['Spinning rod', 'Fly rod', 'Bait rod', 'Waders', 'Boat', 'Electronics']
  },
  {
    id: 'styles',
    type: 'multi',
    heading: 'What fishing styles do you prefer?',
    options: ['Spin fishing', 'Fly fishing', 'Bait fishing', 'Trolling', 'Ice fishing']
  },
  {
    id: 'region',
    type: 'choice',
    heading: 'Where in Washington are you based?',
    options: ['Northwest WA', 'Southwest WA', 'Central WA', 'Eastern WA']
  },
  {
    id: 'travel',
    type: 'choice',
    heading: 'How far are you willing to travel to fish?',
    options: ['Local only (under 30 min)', 'Up to 1 hour', 'Up to 2 hours', 'Anywhere in WA']
  },
  {
    id: 'access',
    type: 'choice',
    heading: 'How do you prefer to access the water?',
    options: ['Bank fishing', 'Wade fishing', 'Boat / kayak']
  },
  { id: 'completion', type: 'completion' }
];

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    name: '', experience: '', frequency: '', gear: [], styles: [],
    region: '', travel: '', access: ''
  });
  const inputRef = useRef(null);

  useEffect(() => {
    if (SLIDES[currentStep].type === 'input' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep === SLIDES.length - 1) {
      onComplete({ ...answers, completedAt: new Date().toISOString() });
      return;
    }
    const advance = () => setCurrentStep(prev => prev + 1);
    if (SLIDES[currentStep].type === 'choice') {
      setTimeout(advance, 280);
    } else {
      advance();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleSelect = (val) => {
    const slide = SLIDES[currentStep];
    if (slide.type === 'multi') {
      const current = answers[slide.id] || [];
      const updated = current.includes(val)
        ? current.filter(item => item !== val)
        : [...current, val];
      setAnswers({ ...answers, [slide.id]: updated });
    } else if (slide.type === 'choice') {
      setAnswers({ ...answers, [slide.id]: val });
      handleNext();
    }
  };

  const currentSlide = SLIDES[currentStep];
  const progress = (currentStep / (SLIDES.length - 1)) * 100;
  const isMultiGrid = currentSlide.options && currentSlide.options.length > 3;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (currentSlide.type === 'input' && answers.name.trim()) handleNext();
        if (currentSlide.type === 'multi' && (answers[currentSlide.id] || []).length) handleNext();
        if (currentSlide.type === 'welcome') handleNext();
        if (currentSlide.type === 'completion') handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, answers]);

  return (
    <div className="cw-ob-shell">
      {/* Progress bar */}
      {currentStep > 0 && currentStep < SLIDES.length - 1 && (
        <div className="cw-ob-progress">
          <div className="cw-ob-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Back button */}
      {currentStep > 0 && currentStep < SLIDES.length - 1 && (
        <button className="cw-ob-back" onClick={handleBack}>
          <ChevronLeft size={14} /> Back
        </button>
      )}

      <div className="cw-ob-content">

        {/* ── Welcome ── */}
        {currentSlide.type === 'welcome' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 28,
            }}>
              <div style={{
                width: 88, height: 88,
                borderRadius: '50%',
                background: 'var(--gold-dim)',
                border: '2px solid var(--gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 32px rgba(212,160,23,0.2)',
              }}>
                <Fish size={40} style={{ color: 'var(--gold)' }} />
              </div>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 56,
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              marginBottom: 10,
            }}>
              Cast<em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Wise</em>
            </h1>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 16,
              color: 'var(--text-3)',
              marginBottom: 40,
            }}>
              "Fish smarter, not harder."
            </p>
            <button
              onClick={handleNext}
              className="cw-btn cw-btn-primary"
              style={{ padding: '14px 40px', fontSize: 15, borderRadius: 99 }}
            >
              Get Started
            </button>
          </div>
        )}

        {/* ── Name input ── */}
        {currentSlide.type === 'input' && (
          <div style={{ width: '100%' }}>
            <h2 className="cw-ob-question">{currentSlide.heading}</h2>
            <input
              ref={inputRef}
              type="text"
              value={answers.name}
              onChange={e => setAnswers({ ...answers, name: e.target.value })}
              placeholder={currentSlide.placeholder}
              className="cw-ob-name-input"
            />
            <div className="cw-ob-continue">
              <button
                disabled={!answers.name.trim()}
                onClick={handleNext}
                className="cw-btn cw-btn-ghost"
                style={{ gap: 8 }}
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── Choice / Multi ── */}
        {(currentSlide.type === 'choice' || currentSlide.type === 'multi') && (
          <div style={{ width: '100%' }}>
            <div className="cw-ob-step-lbl">Step {currentStep - 1} of 7</div>
            <h2 className="cw-ob-question">{currentSlide.heading}</h2>
            <div className={`cw-ob-options ${isMultiGrid ? 'grid-2' : ''}`}>
              {currentSlide.options.map(opt => {
                const isSelected = currentSlide.type === 'multi'
                  ? (answers[currentSlide.id] || []).includes(opt)
                  : answers[currentSlide.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    className={`cw-ob-option ${isSelected ? 'selected' : ''}`}
                  >
                    <span>{opt}</span>
                    <span className="cw-ob-option-check">
                      {isSelected && <Check size={11} />}
                    </span>
                  </button>
                );
              })}
            </div>
            {currentSlide.type === 'multi' && (
              <div className="cw-ob-continue">
                <button
                  disabled={!(answers[currentSlide.id] || []).length}
                  onClick={handleNext}
                  className="cw-btn cw-btn-ghost"
                  style={{ gap: 8 }}
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Completion ── */}
        {currentSlide.type === 'completion' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 28,
            }}>
              <div style={{
                width: 88, height: 88,
                borderRadius: '50%',
                background: 'rgba(90,173,102,0.12)',
                border: '2px solid #5aad66',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Check size={40} style={{ color: '#5aad66' }} />
              </div>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 36,
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: '-0.02em',
              marginBottom: 10,
            }}>
              You're all set, {answers.name}!
            </h2>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 15,
              color: 'var(--text-3)',
              marginBottom: 36,
            }}>
              Your personalized dashboard is ready.
            </p>
            <button
              onClick={handleNext}
              className="cw-btn cw-btn-primary"
              style={{ padding: '14px 40px', fontSize: 15, borderRadius: 99, margin: '0 auto', display: 'inline-flex', gap: 10 }}
            >
              Go to my dashboard <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
