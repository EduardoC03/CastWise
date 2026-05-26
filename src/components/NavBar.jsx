import React, { useState } from 'react';
import { Map, Trophy, BookOpen, Fish, Sun, Moon, LogOut, User, Settings, ChevronDown } from 'lucide-react';

export default function NavBar({ activeSection, onSectionChange, theme, onToggleTheme, profile, onResetProfile }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { id: 'map', icon: Map, label: 'Map' },
    { id: 'rankings', icon: Trophy, label: 'Recommendations' },
    { id: 'catalog', icon: Fish, label: 'Species' },
    { id: 'briefing', icon: BookOpen, label: 'Trip Briefing' },
  ];

  const getInitials = (name) => {
    if (!name) return 'CW';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="h-16 border-b border-[var(--border-color)] bg-[var(--surface-color)] px-6 flex items-center justify-between sticky top-0 z-40 transition-colors">
      {/* Left: Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSectionChange('map')}>
        <div className="p-1.5 bg-[var(--primary-accent)] rounded-lg text-[var(--bg-color)]">
          <Fish size={22} />
        </div>
        <span className="text-xl font-black text-[var(--text-primary)] tracking-tighter">
          Cast<span className="text-[var(--primary-accent)]">Wise</span>
        </span>
      </div>

      {/* Center: Tabs */}
      <div className="hidden md:flex items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all ${
                isActive 
                  ? 'bg-[var(--primary-accent)] text-[var(--bg-color)]' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-color)]'
              }`}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleTheme}
          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-color)] transition-all"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-[var(--border-color)] hover:border-[var(--primary-accent)] transition-all bg-[var(--bg-color)]"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--primary-accent)] flex items-center justify-center text-[var(--bg-color)] font-bold text-xs">
              {getInitials(profile?.name)}
            </div>
            <ChevronDown size={14} className="text-[var(--text-muted)]" />
          </button>

          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-0" onClick={() => setShowProfileMenu(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl shadow-xl z-10 py-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 border-b border-[var(--border-color)] mb-1">
                  <p className="text-xs font-bold text-[var(--text-primary)] truncate">{profile?.name}</p>
                  <p className="text-[10px] text-[var(--text-muted)] truncate">{profile?.region}</p>
                </div>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-color)] flex items-center gap-3"
                  onClick={() => { onSectionChange('profile'); setShowProfileMenu(false); }}
                >
                  <User size={16} className="text-[var(--text-muted)]" />
                  Edit Profile
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-3"
                  onClick={() => { onResetProfile(); setShowProfileMenu(false); }}
                >
                  <LogOut size={16} />
                  Reset Profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
