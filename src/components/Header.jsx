import React, { useState, useEffect } from 'react';
import { Menu, Bot, Sun, Ticket, UserCheck } from 'lucide-react';
import { getLiveMatch, getVenue } from '../data/matchData';
import { fetchLiveWeather } from '../data/liveWeather';
import { useLiveTelemetry } from '../data/telemetryBus';

export default function Header({ activeSection, onToggleSidebar, onToggleChat, onOpenSetupModal, selectedVenueId = 'metlife' }) {
  const liveMatch = getLiveMatch();
  const liveVenue = getVenue(selectedVenueId) || (liveMatch ? getVenue(liveMatch.venue) : getVenue('metlife'));
  const telemetry = useLiveTelemetry();
  const [weather, setWeather] = useState({ temp: 24, condition: 'Clear Sky', icon: '☀️' });
  const [userPrefs, setUserPrefs] = useState({
    language: 'en',
    isStaff: false,
    section: '114',
    row: '12',
    seat: '15'
  });

  useEffect(() => {
    fetchLiveWeather(liveVenue.id).then(res => setWeather(res));
    const checkState = () => {
      const lang = localStorage.getItem('stadiaiq_lang') || 'en';
      const staff = localStorage.getItem('stadiaiq_is_staff') === 'true';
      const sec = localStorage.getItem('stadiaiq_sec') || '114';
      const row = localStorage.getItem('stadiaiq_row') || '12';
      const seat = localStorage.getItem('stadiaiq_seat') || '15';

      setUserPrefs({ language: lang, isStaff: staff, section: sec, row: row, seat: seat });
    };
    checkState();
    window.addEventListener('storage', checkState);
    const interval = setInterval(checkState, 3000);
    return () => {
      window.removeEventListener('storage', checkState);
      clearInterval(interval);
    };
  }, [liveVenue.id]);

  const flags = { en: '🇺🇸', es: '🇲🇽', fr: '🇫🇷', pt: '🇧🇷' };

  const sectionLabels = {
    home: 'Home',
    matches: 'Matches & Venues',
    route: 'Route & Traffic',
    navigation: 'Stadium Map',
    crowd: 'Crowd Heatmap',
    transport: 'Transport Hub',
    accessibility: 'Accessibility Concierge',
    sustainability: 'Sustainability Tracker',
    operations: 'Operational Intelligence',
  };

  return (
    <header className="main__header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            borderRadius: '6px',
            background: 'var(--color-gray-100)',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
          className="mobile-toggle"
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>
        <div className="main__breadcrumb">
          StadiaIQ / <span>{sectionLabels[activeSection] || 'Home'}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {/* Real-Time Live Weather Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.65rem',
          background: 'var(--color-gray-100)', borderRadius: '9999px', fontSize: '0.75rem',
          fontWeight: 600, color: 'var(--text-secondary)', border: '1px solid var(--color-gray-200)'
        }}>
          <span>{weather.icon}</span>
          <span>{weather.temp}°C • {weather.condition}</span>
          <span style={{ opacity: 0.6 }}>({liveVenue.city.split(',')[0]})</span>
        </div>

        {/* Live Attendance Ticker */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.65rem',
          background: 'var(--color-success-bg)', borderRadius: '9999px', fontSize: '0.75rem',
          fontWeight: 700, color: 'var(--color-success)', border: '1px solid #bbf7d0'
        }}>
          <span className="live-dot" style={{ width: 6, height: 6 }}></span>
          <span>{telemetry.attendance.toLocaleString()} Fans</span>
        </div>

        {/* Fan Pass / Seating & Language Badge */}
        <button
          onClick={onOpenSetupModal}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.35rem 0.75rem',
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.08), rgba(37, 99, 235, 0.12))',
            color: 'var(--color-primary-dark)', border: '1px solid var(--color-primary-light)',
            borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
            transition: 'all 0.2s ease', boxShadow: '0 2px 4px rgba(37,99,235,0.08)'
          }}
          title="Click to change seat location or language preference"
        >
          {userPrefs.isStaff ? <UserCheck size={14} style={{ color: 'var(--color-primary)' }} /> : <Ticket size={14} style={{ color: 'var(--color-gold)' }} />}
          <span>
            {flags[userPrefs.language] || '🇺🇸'} {userPrefs.isStaff ? 'Staff Ops' : `Sec ${userPrefs.section}, Row ${userPrefs.row}`}
          </span>
        </button>

        {/* AI Assistant Chat Button */}
        <button
          onClick={onToggleChat}
          className="btn btn--primary btn--sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Bot size={16} /> AI Assistant
        </button>
      </div>
    </header>
  );
}
