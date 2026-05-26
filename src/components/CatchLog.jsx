import React from 'react';
import { Anchor, Plus } from 'lucide-react';

export default function CatchLog() {
  return (
    <div className="cw-screen cw-catchlog">
      <div className="cw-catchlog-head">
        <h2 className="cw-catchlog-title">Catch Log</h2>
        <p className="cw-catchlog-subtitle">Track your fishing success</p>
      </div>

      <div className="cw-placeholder-content">
        <Anchor size={48} className="cw-icon-fade" />
        <p>Your personal catch log is coming soon.</p>
        <button className="cw-btn cw-btn-primary mt-4">
          <Plus size={14} /> Log a Catch
        </button>
      </div>
    </div>
  );
}
