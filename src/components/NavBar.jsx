import React, { useState, useRef, useEffect } from 'react';
import { Map, Trophy, BookOpen, Fish, Sun, Moon, LogOut, User, ChevronDown } from 'lucide-react';
import fishLogo from '../assets/fish_logo.png';

export default function NavBar({ activeSection, onSectionChange, theme, onToggleTheme, profile, onResetProfile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const navItems = [
    { id: 'map',      icon: Map,      label: 'Map'          },
    { id: 'rankings', icon: Trophy,   label: 'Picks'        },
    { id: 'catalog',  icon: Fish,     label: 'Species'      },
    { id: 'briefing', icon: BookOpen, label: 'Trip Briefing'},
  ];

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'CW';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="cw-nav" style={{ position: 'relative', zIndex: 1100 }}>
      {/* Logo */}
      <div className="cw-nav-logo" onClick={() => onSectionChange('map')}>
        <div className="cw-nav-logo-icon">
          <img src={fishLogo} alt="CastWise logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
        </div>
        <span className="cw-nav-logo-text">
          Cast<em>Wise</em>
        </span>
      </div>

      {/* Center tabs */}
      <div className="cw-nav-tabs">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            className={`cw-nav-tab ${activeSection === id ? 'active' : ''}`}
            onClick={() => onSectionChange(id)}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Right actions */}
      <div className="cw-nav-right">
        <button
          className="cw-nav-icon-btn"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div style={{ position: 'relative', zIndex: 1100 }} ref={menuRef}>
          <button
            className="cw-avatar-btn"
            onClick={() => setMenuOpen(o => !o)}
          >
            <div className="cw-avatar">{initials}</div>
            <span className="cw-avatar-name">{profile?.name}</span>
            <ChevronDown size={12} style={{ color: 'var(--text-3)', marginRight: 2 }} />
          </button>

          {menuOpen && (
            <div className="cw-dropdown">
              <div className="cw-dropdown-header">
                <p>{profile?.name}</p>
                <p>{profile?.region}</p>
              </div>
              <button
                className="cw-dropdown-item"
                onClick={() => { onSectionChange('profile'); setMenuOpen(false); }}
              >
                <User size={14} /> Edit Profile
              </button>
              <button
                className="cw-dropdown-item danger"
                onClick={() => { onResetProfile(); setMenuOpen(false); }}
              >
                <LogOut size={14} /> Reset Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
