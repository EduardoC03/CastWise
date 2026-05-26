import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Check, Fish, Sparkles } from 'lucide-react';

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
  const [isExiting, setIsExiting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (SLIDES[currentStep].type === 'input' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentStep]);

  const handleNext = (overrideValue) => {
    if (currentStep === SLIDES.length - 1) {
      onComplete({ ...answers, completedAt: new Date().toISOString() });
      return;
    }

    const nextStep = () => {
      setCurrentStep(prev => prev + 1);
      setIsExiting(false);
    };

    if (SLIDES[currentStep].type === 'choice') {
      setTimeout(nextStep, 300);
    } else {
      nextStep();
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
  const progress = ((currentStep) / (SLIDES.length - 1)) * 100;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (currentSlide.type === 'input' && answers.name.trim()) handleNext();
        if (currentSlide.type === 'multi' && answers[currentSlide.id].length) handleNext();
        if (currentSlide.type === 'welcome') handleNext();
        if (currentSlide.type === 'completion') handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, answers]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-color)] overflow-hidden">
      {/* Wave Background Animation Placeholder */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary-accent)] to-transparent animate-pulse" />
      </div>

      {currentStep > 0 && currentStep < SLIDES.length - 1 && (
        <div className="absolute top-0 left-0 w-full h-1 bg-[var(--surface-color)]">
          <div 
            className="h-full bg-[var(--primary-accent)] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {currentStep > 0 && currentStep < SLIDES.length - 1 && (
        <button 
          onClick={handleBack}
          className="absolute top-8 left-8 flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium uppercase tracking-widest">Back</span>
        </button>
      )}

      <div className="w-full max-w-2xl px-6 py-12 flex flex-col items-center">
        {currentSlide.type === 'welcome' && (
          <div className="text-center animate-in fade-in zoom-in duration-700">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-[var(--surface-color)] rounded-full border-2 border-[var(--primary-accent)] shadow-[0_0_30px_rgba(212,160,23,0.2)]">
                <Fish size={64} className="text-[var(--primary-accent)]" />
              </div>
            </div>
            <h1 className="text-6xl font-black text-[var(--text-primary)] mb-2 tracking-tighter">
              Cast<span className="text-[var(--primary-accent)]">Wise</span>
            </h1>
            <p className="text-xl text-[var(--text-muted)] italic mb-12">"Fish smarter, not harder."</p>
            <button 
              onClick={handleNext}
              className="px-12 py-4 bg-[var(--primary-accent)] text-[var(--bg-color)] text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              Get Started
            </button>
          </div>
        )}

        {currentSlide.type === 'input' && (
          <div className="w-full animate-in slide-in-from-right duration-400">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-10 text-center tracking-tight">
              {currentSlide.heading}
            </h2>
            <input
              ref={inputRef}
              type="text"
              value={answers.name}
              onChange={(e) => setAnswers({ ...answers, name: e.target.value })}
              placeholder={currentSlide.placeholder}
              className="w-full bg-transparent border-b-2 border-[var(--border-color)] text-4xl text-center py-4 text-[var(--primary-accent)] focus:border-[var(--primary-accent)] outline-none transition-colors"
            />
            <div className="flex justify-center mt-12">
              <button 
                disabled={!answers.name.trim()}
                onClick={handleNext}
                className="px-10 py-3 bg-[var(--surface-color)] text-[var(--text-primary)] font-bold rounded-lg border border-[var(--border-color)] hover:border-[var(--primary-accent)] disabled:opacity-50 transition-all flex items-center gap-2"
              >
                Continue <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {(currentSlide.type === 'choice' || currentSlide.type === 'multi') && (
          <div className="w-full animate-in slide-in-from-right duration-400">
            <div className="text-center mb-4">
              <span className="text-xs font-bold text-[var(--primary-accent)] uppercase tracking-[0.2em]">
                Step {currentStep - 1} of 7
              </span>
            </div>
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-12 text-center tracking-tight leading-tight">
              {currentSlide.heading}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentSlide.options.map(opt => {
                const isSelected = currentSlide.type === 'multi' 
                  ? answers[currentSlide.id].includes(opt)
                  : answers[currentSlide.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    className={`p-6 text-lg font-bold rounded-xl border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] flex justify-between items-center ${
                      isSelected 
                        ? 'bg-[var(--primary-accent)] border-[var(--primary-accent)] text-[var(--bg-color)] shadow-lg' 
                        : 'bg-[var(--surface-color)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--primary-accent)]'
                    }`}
                  >
                    {opt}
                    {isSelected && <Check size={20} />}
                  </button>
                );
              })}
            </div>
            {currentSlide.type === 'multi' && (
              <div className="flex justify-center mt-12">
                <button 
                  disabled={!answers[currentSlide.id].length}
                  onClick={handleNext}
                  className="px-10 py-3 bg-[var(--surface-color)] text-[var(--text-primary)] font-bold rounded-lg border border-[var(--border-color)] hover:border-[var(--primary-accent)] disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  Continue <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}

        {currentSlide.type === 'completion' && (
          <div className="text-center animate-in zoom-in duration-700">
            <div className="flex justify-center mb-8">
              <div className="p-8 bg-green-500/20 rounded-full border-4 border-green-500 animate-bounce">
                <Check size={64} className="text-green-500" />
              </div>
            </div>
            <h2 className="text-5xl font-black text-[var(--text-primary)] mb-4 tracking-tighter">
              You're all set, {answers.name}!
            </h2>
            <p className="text-xl text-[var(--text-muted)] mb-12">Your personalized dashboard is ready.</p>
            <button 
              onClick={handleNext}
              className="px-12 py-4 bg-[var(--primary-accent)] text-[var(--bg-color)] text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-lg flex items-center gap-3 mx-auto"
            >
              Go to my dashboard <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
