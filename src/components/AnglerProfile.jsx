import React from 'react';
import { Settings, User, Fish, Anchor } from 'lucide-react';

export default function AnglerProfile({ profile, onReset }) {
  if (!profile) return null;

  // Field-name compat layer: Onboarding writes `gear`, `styles`, `access` (single string), `region`.
  const styles = profile.styles || profile.fishingTypes || [];
  const gear   = profile.gear   || profile.equipment   || [];
  const access = profile.access ? [profile.access]
                : Array.isArray(profile.accessType) ? profile.accessType
                : profile.accessType ? [profile.accessType]
                : [];
  const location = profile.region || profile.location || '—';

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 sm:py-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--secondary-accent)] text-[var(--primary-accent)] border-[3px] border-[var(--primary-accent)] mb-3 mx-auto">
          <User size={40} />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[var(--secondary-accent)] mb-1">
          {profile.name || 'Angler Profile'}
        </h2>
        <p className="font-serif italic text-sm text-[var(--text-muted)]">
          Washington State Fisherman
        </p>
      </header>

      {/* Preferences */}
      <section className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-5 mb-4">
        <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--secondary-accent)] mb-4 pb-2 border-b border-[var(--border-color)]">
          <Settings size={14} /> Preferences
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProfileItem label="Experience" value={profile.experience} />
          <ProfileItem label="Frequency" value={profile.frequency} />
          <ProfileItem label="Region" value={location} />
          <ProfileItem label="Travel" value={profile.travel} />
        </div>
      </section>

      {/* Interests */}
      <section className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-5 mb-4">
        <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--secondary-accent)] mb-4 pb-2 border-b border-[var(--border-color)]">
          <Fish size={14} /> Fishing styles
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {styles.length === 0 ? (
            <span className="text-xs italic text-[var(--text-muted)]">None selected</span>
          ) : styles.map(s => (
            <span
              key={s}
              className="px-2.5 py-1 rounded-full bg-[var(--bg-color)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-primary)]"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Access */}
      <section className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-5 mb-4">
        <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--secondary-accent)] mb-4 pb-2 border-b border-[var(--border-color)]">
          <Anchor size={14} /> Preferred access
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {access.length === 0 ? (
            <span className="text-xs italic text-[var(--text-muted)]">None selected</span>
          ) : access.map(a => (
            <span
              key={a}
              className="px-2.5 py-1 rounded-full bg-[var(--bg-color)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-primary)]"
            >
              {a}
            </span>
          ))}
        </div>
      </section>

      {/* Gear */}
      {gear.length > 0 && (
        <section className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-5 mb-6">
          <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--secondary-accent)] mb-4 pb-2 border-b border-[var(--border-color)]">
            <Fish size={14} /> Owned gear
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {gear.map(g => (
              <span
                key={g}
                className="px-2.5 py-1 rounded-full bg-[var(--bg-color)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-primary)]"
              >
                {g}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="text-center">
        <button
          onClick={onReset}
          className="px-5 py-2.5 rounded-md border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-semibold hover:bg-[var(--surface-color)] hover:border-[var(--danger)] hover:text-[var(--danger)] transition"
        >
          Reset profile & data
        </button>
      </div>
    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-0.5">
        {label}
      </span>
      <span className="text-sm font-semibold text-[var(--text-primary)]">{value || '—'}</span>
    </div>
  );
}
