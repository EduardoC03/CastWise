import React from 'react';
import { Map, Trophy, BookOpen, Fish, Anchor, User } from 'lucide-react';

export default function NavBar({ activeSection, onSectionChange }) {
  const navItems = [
    { id: 'map', icon: Map, label: 'Map' },
    { id: 'rankings', icon: Trophy, label: 'Rankings' },
    { id: 'briefing', icon: BookOpen, label: 'Briefing' },
    { id: 'catalog', icon: Fish, label: 'Catalog' },
    { id: 'catchlog', icon: Anchor, label: 'Log' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="cw-navbar">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            className={`cw-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
            title={item.label}
          >
            <Icon size={18} />
            <span className="cw-nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
