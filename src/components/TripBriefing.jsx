import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowLeft, Loader2, MessageCircle, Send, X, AlertTriangle } from 'lucide-react';
import { askClaude, buildSystemPrompt } from '../utils/ai';

export default function TripBriefing({ profile, trip, onBack, onRemove }) {
  const [briefing, setBriefing] = useState('');
  const [briefingLoading, setBriefingLoading] = useState(true);
  const [briefingError, setBriefingError] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef(null);

  const system = buildSystemPrompt(profile, trip.site);

  useEffect(() => {
    (async () => {
      try {
        setBriefingLoading(true);
        const prompt = `I'm planning a fishing trip to ${trip.site.name} in ${trip.site.county} County. Give me a tailored trip briefing now — gear recommendations specific to what I own and what I'd need, the most important alerts (closure, stocking, opening), and 2-3 practical tactics for what's likely there. Don't ask me questions — just give me the briefing.`;
        const r = await askClaude([{ role: 'user', content: prompt }], system);
        setBriefing(r);
      } catch (e) {
        setBriefingError(true);
      } finally {
        setBriefingLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, []);

  const send = async () => {
    if (!input.trim() || chatLoading) return;
    const userMsg = input.trim();
    setInput('');
    const newMsgs = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMsgs);
    setChatLoading(true);
    try {
      const conversation = [
        { role: 'user', content: `I'm planning a fishing trip to ${trip.site.name}. Give me a briefing.` },
        { role: 'assistant', content: briefing },
        ...newMsgs
      ];
      const reply = await askClaude(conversation, system);
      setMessages([...newMsgs, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages([...newMsgs, { role: 'assistant', content: '_Could not reach the API. Try again._' }]);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, chatLoading]);

  return (
    <div className="cw-screen cw-trip">
      <button className="cw-back" onClick={onBack}><ArrowLeft size={13}/> Back</button>

      <div className="cw-trip-head">
        <div className="cw-trip-eyebrow"><Sparkles size={11}/> Your trip briefing</div>
        <h1 className="cw-trip-name">{trip.site.name}</h1>
        <div className="cw-trip-meta">{trip.site.county} Co · {trip.site.species.slice(0,3).join(' · ')}</div>
      </div>

      <div className="cw-briefing">
        {briefingLoading && (
          <div className="cw-briefing-loading">
            <Loader2 size={14} className="cw-spin"/>
            <span>Tying on your briefing…</span>
          </div>
        )}
        {briefingError && (
          <div className="cw-briefing-error">Couldn't generate briefing. Check connection.</div>
        )}
        {briefing && !briefingLoading && (
          <div className="cw-briefing-body">
            <FormattedText text={briefing}/>
          </div>
        )}
      </div>

      <div className="cw-chat">
        <div className="cw-chat-head"><MessageCircle size={11}/> <span>Ask CastWise</span></div>
        <div className="cw-chat-msgs" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="cw-chat-empty">
              Ask about bait, tactics, regulations, where to launch — anything.
              <div className="cw-chat-suggest">
                {['Best time of day?', 'What to bring?', 'How are tactics different here?'].map(s => (
                  <button key={s} onClick={() => setInput(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`cw-msg cw-msg-${m.role}`}>
              <div className="cw-msg-lbl">{m.role === 'user' ? 'You' : 'CastWise'}</div>
              <div className="cw-msg-body">
                {m.role === 'assistant' ? <FormattedText text={m.content}/> : m.content}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="cw-msg cw-msg-assistant">
              <div className="cw-msg-lbl">CastWise</div>
              <div className="cw-msg-body"><Loader2 size={12} className="cw-spin"/></div>
            </div>
          )}
        </div>
        <div className="cw-chat-input-row">
          <input
            className="cw-chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(); }}
            placeholder="Ask anything…"
            disabled={chatLoading || briefingLoading}
          />
          <button className="cw-chat-send" onClick={send} disabled={chatLoading || briefingLoading || !input.trim()}>
            <Send size={13}/>
          </button>
        </div>
      </div>

      <button className="cw-btn-text" onClick={onRemove}><X size={11}/> Remove trip</button>
    </div>
  );
}

function FormattedText({ text }) {
  const lines = text.split('\n');
  const blocks = [];
  let list = [];
  const flush = () => { if (list.length) { blocks.push({ t: 'ul', items: list }); list = []; } };

  lines.forEach(line => {
    const tr = line.trim();
    if (/^(⚠️?\s*)?(\*\*)?(ALERT|IMPORTANT|WARNING|HEADS UP)/i.test(tr)) {
      flush();
      blocks.push({ t: 'alert', content: tr.replace(/^\*\*|\*\*$/g, '').replace(/^⚠️?\s*/, '').replace(/^(ALERT|IMPORTANT|WARNING|HEADS UP)[:\s]*/i, '') });
    } else if (tr.startsWith('## ') || tr.startsWith('# ')) {
      flush(); blocks.push({ t: 'h', content: tr.replace(/^#+\s/, '') });
    } else if (tr.startsWith('### ')) {
      flush(); blocks.push({ t: 'h3', content: tr.slice(4) });
    } else if (tr.startsWith('- ') || tr.startsWith('* ')) {
      list.push(tr.slice(2));
    } else if (/^\d+\.\s/.test(tr)) {
      list.push(tr.replace(/^\d+\.\s/, ''));
    } else if (tr === '') {
      flush();
    } else {
      flush(); blocks.push({ t: 'p', content: tr });
    }
  });
  flush();

  const inline = (s) => s.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2,-2)}</strong> : <React.Fragment key={i}>{p}</React.Fragment>
  );

  return (
    <div className="cw-fmt">
      {blocks.map((b, i) => {
        if (b.t === 'h') return <h4 key={i} className="cw-fmt-h">{inline(b.content)}</h4>;
        if (b.t === 'h3') return <h5 key={i} className="cw-fmt-h3">{inline(b.content)}</h5>;
        if (b.t === 'p') return <p key={i} className="cw-fmt-p">{inline(b.content)}</p>;
        if (b.t === 'ul') return <ul key={i} className="cw-fmt-ul">{b.items.map((it, j) => <li key={j}>{inline(it)}</li>)}</ul>;
        if (b.t === 'alert') return (
          <div key={i} className="cw-fmt-alert">
            <AlertTriangle size={12}/>
            <span>{inline(b.content)}</span>
          </div>
        );
        return null;
      })}
    </div>
  );
}
