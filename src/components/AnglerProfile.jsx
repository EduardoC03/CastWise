import React from 'react';
import { Settings, User, MapPin, Fish, Anchor } from 'lucide-react';

export default function AnglerProfile({ profile, onReset }) {
  if (!profile) return null;

  return (
    <div className="cw-screen cw-profile">
      <div className="cw-profile-head">
        <div className="cw-profile-avatar">
          <User size={40} />
        </div>
        <h2 className="cw-profile-title">Angler Profile</h2>
        <p className="cw-profile-subtitle">Washington State Fisherman</p>
      </div>

      <div className="cw-profile-section">
        <h3><Settings size={14} /> Preferences</h3>
        <div className="cw-profile-grid">
          <div className="cw-profile-item">
            <span className="cw-profile-label">Experience</span>
            <span className="cw-profile-value">{profile.experience}</span>
          </div>
          <div className="cw-profile-item">
            <span className="cw-profile-label">Frequency</span>
            <span className="cw-profile-value">{profile.frequency}</span>
          </div>
          <div className="cw-profile-item">
            <span className="cw-profile-label">Location</span>
            <span className="cw-profile-value">{profile.location}</span>
          </div>
          <div className="cw-profile-item">
            <span className="cw-profile-label">Travel</span>
            <span className="cw-profile-value">{profile.travel === 'local' ? 'Local only' : 'Willing to travel'}</span>
          </div>
        </div>
      </div>

      <div className="cw-profile-section">
        <h3><Fish size={14} /> Interests</h3>
        <div className="cw-chips">
          {profile.fishingTypes.map(type => (
            <span key={type} className="cw-chip">{type}</span>
          ))}
        </div>
      </div>

      <div className="cw-profile-section">
        <h3><Anchor size={14} /> Preferred Access</h3>
        <div className="cw-chips">
          {profile.accessType.map(access => (
            <span key={access} className="cw-chip">{access}</span>
          ))}
        </div>
      </div>

      <div className="cw-profile-actions">
        <button className="cw-btn cw-btn-ghost" onClick={onReset}>
          Reset Profile & Data
        </button>
      </div>
    </div>
  );
}
