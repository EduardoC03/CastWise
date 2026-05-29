import React, { useState } from 'react';
import { Fish, Plus, Trash2, MapPin, Calendar } from 'lucide-react';



export default function CatchLog() {
  const [catches, setCatches] = useState([]);
  const [form,    setForm]    = useState({ species: '', weight: '', length: '', location: '', date: '' });
  const [adding,  setAdding]  = useState(false);

  const handleAdd = () => {
    if (!form.species.trim()) return;
    setCatches(prev => [{
      id:       Date.now(),
      species:  form.species.trim(),
      weight:   form.weight.trim()   || '—',
      length:   form.length.trim()   || '—',
      location: form.location.trim() || '—',
      date:     form.date            || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    }, ...prev]);
    setForm({ species: '', weight: '', length: '', location: '', date: '' });
    setAdding(false);
  };

  const handleDelete = (id) => setCatches(prev => prev.filter(c => c.id !== id));

  return (
    <div className="cw-screen">
      <div className="cw-page-eyebrow">
        <Fish size={11} /> Catch Log
      </div>
      <h1 className="cw-page-title">Your Catch Log</h1>
      <p className="cw-page-sub">Track every fish you land across Washington waters.</p>

      {/* Add button */}
      {!adding && (
        <button
          className="cw-btn cw-btn-primary"
          style={{ marginBottom: 24 }}
          onClick={() => setAdding(true)}
        >
          <Plus size={14} /> Log a Catch
        </button>
      )}

      {/* Add form */}
      {adding && (
        <div className="cw-block cw-block-accent-gold" style={{ marginBottom: 24 }}>
          <div className="cw-block-title">New Catch</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            {[
              { key: 'species',  placeholder: 'Species *',              required: true  },
              { key: 'weight',   placeholder: 'Weight (e.g. 2.4 lbs)',   required: false },
              { key: 'length',   placeholder: 'Length (e.g. 14 in)',      required: false },
              { key: 'location', placeholder: 'Location',                required: false },
              { key: 'date',     placeholder: 'Date (optional)', required: false, type: 'date' },
            ].map(({ key, placeholder, type = 'text' }) => (
              <input
                key={key}
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                style={{
                  background:    'var(--bg-raised)',
                  border:        '1px solid var(--border)',
                  borderRadius:  7,
                  padding:       '9px 12px',
                  fontSize:      13,
                  fontFamily:    'var(--font-sans)',
                  color:         'var(--text)',
                  outline:       'none',
                  width:         '100%',
                }}
                onFocus={e  => e.target.style.borderColor = 'var(--gold)'}
                onBlur={e   => e.target.style.borderColor = 'var(--border)'}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="cw-btn cw-btn-primary" onClick={handleAdd} disabled={!form.species.trim()}>
              Save catch
            </button>
            <button className="cw-btn cw-btn-ghost" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Catch list */}
      {catches.length === 0 ? (
        <div className="cw-empty">
          <Fish size={44} className="cw-empty-icon" />
          <h2>No catches yet</h2>
          <p>Log your first catch to start tracking your fishing history across Washington.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {catches.map(c => (
            <div
              key={c.id}
              className="cw-block"
              style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 0 }}
            >
              <div style={{
                width: 44, height: 44,
                borderRadius: 10,
                background: 'var(--gold-dim)',
                border: '1px solid rgba(212,160,23,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold-soft)',
                flexShrink: 0,
              }}>
                <Fish size={20} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--text)',
                  marginBottom: 4,
                }}>
                  {c.species}
                  {c.weight !== '—' && (
                    <span style={{
                      marginLeft: 8,
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--gold-soft)',
                      fontWeight: 400,
                    }}>
                      {c.weight}
                    </span>
                  )}
                  {c.length !== '—' && (
                    <span style={{
                      marginLeft: 6,
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--gold-soft)',
                      fontWeight: 400,
                    }}>
                      · {c.length}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {c.location !== '—' && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                      <MapPin size={10} /> {c.location}
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                    <Calendar size={10} /> {c.date}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(c.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-3)',
                  cursor: 'pointer',
                  padding: 6,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 150ms',
                  flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
