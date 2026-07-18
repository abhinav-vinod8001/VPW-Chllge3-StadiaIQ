import React, { useState, useEffect } from 'react';
import { Globe, MapPin, Ticket, ShieldCheck, CheckCircle, Sparkles, UserCheck, X, Calendar, Clock, Trophy } from 'lucide-react';
import { venues, getTodaysMatches, getUpcomingMatches, getLiveMatches, getVenue, getMatchStatusDisplay, formatDate } from '../data/matchData';

export default function WelcomeSetupModal({ isOpen, onClose, onSavePreferences }) {
  const [language, setLanguage] = useState('en');
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [isStaff, setIsStaff] = useState(false);
  const [section, setSection] = useState('');
  const [row, setRow] = useState('');
  const [seat, setSeat] = useState('');

  // Compute today's matches + live matches + next upcoming
  const todaysMatches = getTodaysMatches();
  const liveMatches = getLiveMatches();
  const upcomingMatches = getUpcomingMatches().slice(0, 3);

  // Build the "available matches" list: today's matches first, then upcoming
  const availableMatches = [
    ...todaysMatches.filter(m => m.status === 'live'),
    ...todaysMatches.filter(m => m.status === 'upcoming'),
    ...todaysMatches.filter(m => m.status === 'completed'),
    ...upcomingMatches.filter(m => !todaysMatches.find(t => t.id === m.id)),
  ];

  useEffect(() => {
    if (isOpen) {
      const storedLang = localStorage.getItem('stadiaiq_lang') || 'en';
      const storedStaff = localStorage.getItem('stadiaiq_is_staff') === 'true';
      const storedSec = localStorage.getItem('stadiaiq_sec') || '';
      const storedRow = localStorage.getItem('stadiaiq_row') || '';
      const storedSeat = localStorage.getItem('stadiaiq_seat') || '';
      const storedMatch = localStorage.getItem('stadiaiq_match_id') || null;

      setLanguage(storedLang);
      setIsStaff(storedStaff);
      setSection(storedSec);
      setRow(storedRow);
      setSeat(storedSeat);

      // Auto-select: stored match > first live match > first today's match > first upcoming
      if (storedMatch && availableMatches.find(m => m.id === storedMatch)) {
        setSelectedMatchId(storedMatch);
      } else if (liveMatches.length > 0) {
        setSelectedMatchId(liveMatches[0].id);
      } else if (todaysMatches.length > 0) {
        setSelectedMatchId(todaysMatches[0].id);
      } else if (upcomingMatches.length > 0) {
        setSelectedMatchId(upcomingMatches[0].id);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedMatch = availableMatches.find(m => m.id === selectedMatchId);
  const selectedVenue = selectedMatch ? getVenue(selectedMatch.venue) : null;

  const handleSave = (e) => {
    e.preventDefault();
    const match = selectedMatch;
    const venue = selectedVenue;

    const prefs = {
      language,
      matchId: match?.id || null,
      venueId: venue?.id || 'metlife',
      isStaff,
      section: isStaff ? 'Staff Ops' : (section.trim() || '101'),
      row: isStaff ? 'N/A' : (row.trim() || '1'),
      seat: isStaff ? 'N/A' : (seat.trim() || '1'),
      completed: true
    };

    localStorage.setItem('stadiaiq_lang', prefs.language);
    localStorage.setItem('stadiaiq_match_id', prefs.matchId || '');
    localStorage.setItem('stadiaiq_venue', prefs.venueId);
    localStorage.setItem('stadiaiq_is_staff', prefs.isStaff ? 'true' : 'false');
    localStorage.setItem('stadiaiq_sec', prefs.section);
    localStorage.setItem('stadiaiq_row', prefs.row);
    localStorage.setItem('stadiaiq_seat', prefs.seat);
    localStorage.setItem('stadiaiq_setup_completed', 'true');

    if (onSavePreferences) onSavePreferences(prefs);
    onClose();
  };

  const languages = [
    { code: 'en', flag: '🇺🇸', name: 'English', desc: 'Default Match-Day Experience' },
    { code: 'es', flag: '🇲🇽', name: 'Español', desc: 'Experiencia Oficial FIFA en Español' },
    { code: 'fr', flag: '🇫🇷', name: 'Français', desc: 'Assistance IA & Guide en Français' },
    { code: 'pt', flag: '🇧🇷', name: 'Português', desc: 'Navegação e Suporte em Português' },
  ];

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)',
      zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', animation: 'fadeIn 0.25s ease-out'
    }}>
      <div className="card" style={{
        maxWidth: '720px', width: '100%', maxHeight: '94vh', overflowY: 'auto',
        background: 'var(--bg-card)', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        border: '1px solid var(--color-gray-200)', overflow: 'hidden'
      }}>
        {/* Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #0f172a 100%)',
          padding: '1.5rem 1.75rem', color: 'white', position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
              }}>🏆</div>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px', color: '#f59e0b', textTransform: 'uppercase' }}>
                  FIFA World Cup 2026™ • StadiaIQ
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '2px 0 0 0', lineHeight: 1.2 }}>
                  Match-Day Check-In
                </h2>
              </div>
            </div>
            {localStorage.getItem('stadiaiq_setup_completed') === 'true' && (
              <button onClick={onClose} style={{ color: 'white', opacity: 0.8, cursor: 'pointer', background: 'rgba(255,255,255,0.15)', padding: '6px', borderRadius: '8px', border: 'none' }}>
                <X size={20} />
              </button>
            )}
          </div>
          <p style={{ fontSize: '0.82rem', opacity: 0.9, marginTop: '0.5rem', lineHeight: 1.4, maxWidth: '540px' }}>
            Select your match and we'll auto-configure the venue, weather telemetry, routes, and crowd monitoring for you.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.5rem', fontSize: '0.75rem', opacity: 0.85 }}>
            <Calendar size={13} />
            <span>{todayStr}</span>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>

          {/* ── STEP 1: SELECT YOUR MATCH ── */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              <Trophy size={15} style={{ color: '#f59e0b' }} /> 1. Which Match Are You Attending?
            </label>

            {todaysMatches.length > 0 && (
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary-light)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="live-dot" style={{ width: 6, height: 6 }}></span>
                {todaysMatches.filter(m => m.status === 'live').length > 0 ? 'LIVE MATCHES TODAY' : 'MATCHES TODAY'} — {todayStr.split(',')[0]}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {availableMatches.map(match => {
                const venue = getVenue(match.venue);
                const statusDisplay = getMatchStatusDisplay(match);
                const isSelected = selectedMatchId === match.id;
                const isToday = todaysMatches.find(t => t.id === match.id);
                const isLive = match.status === 'live';

                return (
                  <div
                    key={match.id}
                    onClick={() => setSelectedMatchId(match.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.75rem 1rem', borderRadius: '12px', cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: isSelected
                        ? '2px solid var(--color-primary-light)'
                        : isLive
                          ? '2px solid #ef4444'
                          : '1px solid var(--color-gray-200)',
                      background: isSelected
                        ? 'rgba(37, 99, 235, 0.06)'
                        : isLive
                          ? 'rgba(239, 68, 68, 0.04)'
                          : 'var(--color-gray-50)',
                      position: 'relative', overflow: 'hidden'
                    }}
                  >
                    {isLive && (
                      <div style={{
                        position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
                        background: 'linear-gradient(180deg, #ef4444, #f59e0b)', borderRadius: '4px 0 0 4px'
                      }} />
                    )}
                    <div style={{ flex: 1, paddingLeft: isLive ? '0.5rem' : 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                          {match.teamA} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.85rem' }}>vs</span> {match.teamB}
                        </span>
                        <span className={`badge badge--${statusDisplay.color}`} style={{ fontSize: '0.65rem' }}>
                          {isLive && <span className="badge__dot"></span>}
                          {statusDisplay.label}
                        </span>
                        {isToday && !isLive && match.status !== 'completed' && (
                          <span className="badge badge--info" style={{ fontSize: '0.6rem' }}>TODAY</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Trophy size={11} /> {match.round}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <MapPin size={11} /> {venue?.name}, {venue?.city?.split(',')[0]}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={11} /> {formatDate(match.date)} • {match.time} ET
                        </span>
                      </div>
                    </div>
                    {isSelected && <CheckCircle size={20} style={{ color: 'var(--color-primary-light)', flexShrink: 0 }} />}
                  </div>
                );
              })}
            </div>

            {/* Auto-Configuration Notice */}
            {selectedVenue && (
              <div style={{
                marginTop: '0.65rem', padding: '0.6rem 0.85rem', borderRadius: '10px',
                background: 'rgba(37, 99, 235, 0.06)', border: '1px dashed var(--color-primary-light)',
                display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', color: 'var(--text-primary)'
              }}>
                <Sparkles size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />
                <span>
                  <strong>Auto-configured:</strong> Weather, routes, crowd monitoring, and AI wayfinding will be set to <strong>{selectedVenue.name}</strong> ({selectedVenue.city}).
                </span>
              </div>
            )}
          </div>

          {/* ── STEP 2: LANGUAGE ── */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.55rem' }}>
              <Globe size={15} style={{ color: 'var(--color-primary-light)' }} /> 2. Preferred Language
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: '0.5rem' }}>
              {languages.map(lang => (
                <div
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.85rem',
                    borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s ease',
                    border: language === lang.code ? '2px solid var(--color-primary-light)' : '1px solid var(--color-gray-200)',
                    background: language === lang.code ? 'rgba(37, 99, 235, 0.06)' : 'var(--color-gray-50)'
                  }}
                >
                  <span style={{ fontSize: '1.3rem' }}>{lang.flag}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: language === lang.code ? 'var(--color-primary-dark)' : 'var(--text-primary)' }}>
                      {lang.name}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', lineHeight: 1.2 }}>{lang.desc}</div>
                  </div>
                  {language === lang.code && <CheckCircle size={16} style={{ color: 'var(--color-primary-light)' }} />}
                </div>
              ))}
            </div>
          </div>

          {/* ── STEP 3: SEATING / STAFF ── */}
          <div style={{ background: 'var(--color-gray-50)', padding: '1.1rem', borderRadius: '12px', border: '1px solid var(--color-gray-200)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                <Ticket size={15} style={{ color: 'var(--color-primary-light)' }} /> 3. Seat Location
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button type="button" onClick={() => setIsStaff(false)}
                  className={`btn btn--sm ${!isStaff ? 'btn--primary' : 'btn--secondary'}`}
                  style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}>
                  🎫 Fan
                </button>
                <button type="button" onClick={() => setIsStaff(true)}
                  className={`btn btn--sm ${isStaff ? 'btn--primary' : 'btn--secondary'}`}
                  style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}>
                  🛡️ Staff
                </button>
              </div>
            </div>

            {!isStaff ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                <div>
                  <label className="text-xs font-bold text-secondary" style={{ display: 'block', marginBottom: '3px' }}>SECTION</label>
                  <input type="text" className="input" value={section} onChange={(e) => setSection(e.target.value)}
                    placeholder="e.g. 114" style={{ fontWeight: 700, textAlign: 'center' }} />
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary" style={{ display: 'block', marginBottom: '3px' }}>ROW</label>
                  <input type="text" className="input" value={row} onChange={(e) => setRow(e.target.value)}
                    placeholder="e.g. 12" style={{ fontWeight: 700, textAlign: 'center' }} />
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary" style={{ display: 'block', marginBottom: '3px' }}>SEAT</label>
                  <input type="text" className="input" value={seat} onChange={(e) => setSeat(e.target.value)}
                    placeholder="e.g. 15" style={{ fontWeight: 700, textAlign: 'center' }} />
                </div>
              </div>
            ) : (
              <div style={{ padding: '0.75rem', background: 'rgba(37,99,235,0.06)', borderRadius: '10px', border: '1px dashed var(--color-primary-light)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <UserCheck size={22} style={{ color: 'var(--color-primary-light)' }} />
                <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  <strong>Staff Mode:</strong> Full access to Operations Triage, PA Broadcasts, and Crowd Control dashboards.
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <button type="submit" className="btn btn--primary" style={{
            height: '50px', fontSize: '1rem', fontWeight: 800, borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)', cursor: 'pointer'
          }}>
            <ShieldCheck size={18} />
            {selectedMatch
              ? `Enter ${selectedMatch.teamA.split(' ').pop()} vs ${selectedMatch.teamB.split(' ').pop()} — Go Live 🚀`
              : 'Enter StadiaIQ 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
}
