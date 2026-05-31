import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
 
export const INTAKE_STEPS = [
  { key: 'experience', title: 'How would you describe your experience?', type: 'single',
    options: [
      { v: 'beginner', label: 'Beginner', sub: 'New to fishing or just starting' },
      { v: 'intermediate', label: 'Intermediate', sub: 'Comfortable with the basics' },
      { v: 'advanced', label: 'Advanced', sub: 'Years of experience' }
    ]
  },
  { key: 'frequency', title: 'How often do you fish?', type: 'single',
    options: [
      { v: 'rarely', label: 'A few times a year' },
      { v: 'monthly', label: 'Once or twice a month' },
      { v: 'weekly', label: 'Weekly' },
      { v: 'daily', label: 'As often as I can' }
    ]
  },
  { key: 'fishingTypes', title: 'What kind of fishing interests you?', type: 'multi',
    options: [
      { v: 'fly', label: 'Fly fishing' },
      { v: 'spin', label: 'Spin / casting' },
      { v: 'bait', label: 'Bait fishing' },
      { v: 'trolling', label: 'Trolling' },
      { v: 'ice', label: 'Ice fishing' }
    ]
  },
  { key: 'gear', title: 'What gear do you own?', type: 'multi',
    options: [
      { v: 'spinning-rod', label: 'Spinning rod' },
      { v: 'baitcaster', label: 'Baitcaster' },
      { v: 'fly-rod', label: 'Fly rod' },
      { v: 'tackle-box', label: 'Tackle box / lures' },
      { v: 'waders', label: 'Waders' },
      { v: 'kayak', label: 'Kayak / float tube' },
      { v: 'boat', label: 'Boat' },
      { v: 'electronics', label: 'Fish finder / GPS' },
      { v: 'none', label: 'None' }
    ]
  },
  { key: 'location', title: 'Where in Washington are you based?', type: 'single',
    options: [
      { v: 'Northwest', label: 'Northwest', sub: 'Seattle, Bellingham, Olympic Peninsula' },
      { v: 'Southwest', label: 'Southwest', sub: 'Vancouver, Olympia, Longview' },
      { v: 'Central', label: 'Central', sub: 'Wenatchee, Yakima, Ellensburg' },
      { v: 'Eastern', label: 'Eastern', sub: 'Spokane, Tri-Cities, Walla Walla' }
    ]
  },
  { key: 'travel', title: 'Will you travel to fish?', type: 'single',
    options: [
      { v: 'local', label: 'Local only', sub: 'Waters close to home' },
      { v: 'travel', label: "I'll travel", sub: 'Show me anywhere in the state' }
    ]
  },
  { key: 'accessType', title: 'How do you fish?', type: 'multi',
    options: [
      { v: 'bank', label: 'From the bank' },
      { v: 'boat', label: 'From a boat' },
      { v: 'wade', label: 'Wading' }
    ]
  }
];
 
const PRIORITY_OPTIONS = [
  { v: 'distance', label: 'Distance from home', sub: 'How close the spot is' },
  { v: 'boat-access', label: 'Boat / kayak access', sub: 'Launch ramps or open water' },
  { v: 'bank-access', label: 'Bank access', sub: 'Fishable from shore' },
  { v: 'species', label: 'Target species', sub: 'Specific fish available' },
  { v: 'crowds', label: 'Low crowds', sub: 'Quieter, less-pressured water' },
  { v: 'scenery', label: 'Scenery', sub: 'Beautiful surroundings' },
  { v: 'regulations', label: 'Simple regulations', sub: 'Easy-to-follow rules' },
  { v: 'beginner-friendly', label: 'Beginner friendly', sub: 'Good for learning' },
];
 
export default function AnglerQuestionnaire({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    experience: '', frequency: '', fishingTypes: [], gear: [],
    location: '', travel: '', accessType: []
  });
  const [showPriorities, setShowPriorities] = useState(false);
  const [priorities, setPriorities] = useState([]);
 
  const current = INTAKE_STEPS[step];
  const value = answers[current.key];
  const canAdvance = current.type === 'multi' ? value.length > 0 : value !== '';
 
  const handleSelect = (v) => {
    if (current.key === 'gear' && v === 'none') {
      // Selecting "None" clears all other gear selections, and vice versa
      const alreadyNone = value.includes('none');
      setAnswers({ ...answers, gear: alreadyNone ? [] : ['none'] });
      return;
    }
    if (current.type === 'multi') {
      const filtered = value.filter(x => x !== 'none'); // deselect "None" if picking real gear
      const arr = filtered.includes(v) ? filtered.filter(x => x !== v) : [...filtered, v];
      setAnswers({ ...answers, [current.key]: arr });
    } else {
      setAnswers({ ...answers, [current.key]: v });
    }
  };
 
  const handlePrioritySelect = (v) => {
    if (priorities.includes(v)) {
      setPriorities(priorities.filter(x => x !== v));
    } else if (priorities.length < 3) {
      setPriorities([...priorities, v]);
    }
  };
 
  const next = () => {
    if (step < INTAKE_STEPS.length - 1) setStep(step + 1);
    else setShowPriorities(true);
  };
 
  const finishWithPriorities = () => {
    onComplete({ ...answers, priorities });
  };
 
  if (showPriorities) {
    return (
      <div className="cw-screen cw-intake">
        <div className="cw-intake-head">
          <div className="cw-progress">
            <div className="cw-progress-bar" style={{ width: '100%' }}/>
          </div>
          <div className="cw-step-lbl">Final Step</div>
        </div>
        <h2 className="cw-intake-title">What matters most to you?</h2>
        <p className="cw-intake-sub">Pick your top 3 priorities ({priorities.length} / 3 selected)</p>
 
        <div className="cw-options">
          {PRIORITY_OPTIONS.map(opt => {
            const sel = priorities.includes(opt.v);
            const disabled = !sel && priorities.length >= 3;
            return (
              <button
                key={opt.v}
                className={`cw-option ${sel ? 'sel' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => handlePrioritySelect(opt.v)}
                disabled={disabled}
              >
                <div className="cw-option-text">
                  <div className="cw-option-lbl">{opt.label}</div>
                  {opt.sub && <div className="cw-option-sub">{opt.sub}</div>}
                </div>
                <div className="cw-option-check">
                  {sel && <span className="cw-priority-rank">{priorities.indexOf(opt.v) + 1}</span>}
                </div>
              </button>
            );
          })}
        </div>
 
        <div className="cw-intake-actions">
          <button className="cw-btn cw-btn-ghost" onClick={() => setShowPriorities(false)}>
            <ChevronLeft size={14}/> Back
          </button>
          <button className="cw-btn cw-btn-primary cw-btn-grow" disabled={priorities.length < 3} onClick={finishWithPriorities}>
            Finish <ChevronRight size={14}/>
          </button>
        </div>
      </div>
    );
  }
 
  return (
    <div className="cw-screen cw-intake">
      <div className="cw-intake-head">
        <div className="cw-progress">
          <div className="cw-progress-bar" style={{ width: `${((step + 1) / INTAKE_STEPS.length) * 100}%` }}/>
        </div>
        <div className="cw-step-lbl">Step {step + 1} / {INTAKE_STEPS.length}</div>
      </div>
      <h2 className="cw-intake-title">{current.title}</h2>
      {current.type === 'multi' && <p className="cw-intake-sub">Select all that apply</p>}
 
      <div className="cw-options">
        {current.options.map(opt => {
          const sel = current.type === 'multi' ? value.includes(opt.v) : value === opt.v;
          return (
            <button key={opt.v} className={`cw-option ${sel ? 'sel' : ''}`} onClick={() => handleSelect(opt.v)}>
              <div className="cw-option-text">
                <div className="cw-option-lbl">{opt.label}</div>
                {opt.sub && <div className="cw-option-sub">{opt.sub}</div>}
              </div>
              <div className="cw-option-check">{sel && <Check size={14}/>}</div>
            </button>
          );
        })}
      </div>
 
      <div className="cw-intake-actions">
        {step > 0 && (
          <button className="cw-btn cw-btn-ghost" onClick={() => setStep(step - 1)}>
            <ChevronLeft size={14}/> Back
          </button>
        )}
        <button className="cw-btn cw-btn-primary cw-btn-grow" disabled={!canAdvance} onClick={next}>
          {step === INTAKE_STEPS.length - 1 ? 'Continue' : 'Continue'} <ChevronRight size={14}/>
        </button>
      </div>
    </div>
  );
}
