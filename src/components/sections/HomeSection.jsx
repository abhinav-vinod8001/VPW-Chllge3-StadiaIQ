import React, { useState, useEffect } from 'react';
import {
  Users, DoorOpen, Thermometer, Leaf, Trophy, MapPin, Compass, Train,
  Accessibility, Bot, AlertTriangle, Sparkles, Clock, Calendar
} from 'lucide-react';
import { getLiveMatches, getVenue, getUpcomingMatches, getTodaysMatches, getMatchById, getMatchStatusDisplay, formatDate } from '../../data/matchData';
import { useLiveTelemetry } from '../../data/telemetryBus';
import { fetchLiveWeather } from '../../data/liveWeather';

export default function HomeSection({ onNavigate, onOpenChat, selectedVenueId = 'metlife', selectedMatchId = null }) {
  const activeMatch = selectedMatchId ? getMatchById(selectedMatchId) : null;
  const liveMatches = getLiveMatches();
  const todaysMatches = getTodaysMatches();
  const liveVenue = getVenue(selectedVenueId) || getVenue('metlife');
  const upcomingMatches = getUpcomingMatches().slice(0, 4);
  const telemetry = useLiveTelemetry();
  const [weather, setWeather] = useState({ temp: 24, condition: 'Clear Sky', icon: '☀️', windSpeed: 12, humidity: 58 });

  useEffect(() => {
    fetchLiveWeather(liveVenue.id).then(res => setWeather(res));
  }, [liveVenue.id]);

  const activeMatchStatus = activeMatch ? getMatchStatusDisplay(activeMatch) : null;

  return (
    <div className="section active">
      <div className="section__header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="section__title">Welcome to StadiaIQ</h1>
            <p className="section__description">
              Your real-time AI operational companion for the FIFA World Cup 2026™. Everything below is auto-configured for your selected match and venue.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700, background: 'var(--color-success-bg)', padding: '0.5rem 0.85rem', borderRadius: '9999px', border: '1px solid #bbf7d0' }}>
            <span className="live-dot" style={{ width: 8, height: 8 }}></span>
            <span>LIVE TELEMETRY • {liveVenue.name}</span>
          </div>
        </div>
      </div>

      {/* ── ACTIVE MATCH BANNER (Dynamic based on user's selected match) ── */}
      {activeMatch && (
        <div className="card" style={{
          marginBottom: 'var(--space-8)',
          borderLeft: activeMatch.status === 'live' ? '5px solid #ef4444' : '5px solid var(--color-primary-light)',
          background: activeMatch.status === 'live'
            ? 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)'
        }}>
          <div className="card__body">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span className={`badge badge--${activeMatchStatus.color}`}>
                    {activeMatch.status === 'live' && <span className="badge__dot"></span>}
                    {activeMatch.status === 'live' ? '🔴 LIVE NOW' : activeMatch.status === 'upcoming' ? '🕐 UPCOMING' : '✅ COMPLETED'}
                  </span>
                  <span className="badge badge--info" style={{ fontSize: '0.68rem' }}>{activeMatch.round}</span>
                  <span className="text-xs text-muted">Match #{activeMatch.id}</span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {activeMatch.teamA} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>vs</span> {activeMatch.teamB}
                </div>
                {activeMatch.status === 'live' && activeMatch.note && (
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ef4444', marginTop: '0.25rem' }}>
                    ⏱️ {activeMatch.note}
                  </div>
                )}
                {activeMatch.status === 'completed' && activeMatch.scoreA !== null && (
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Final Score: {activeMatch.scoreA} — {activeMatch.scoreB}
                    {activeMatch.note && <span style={{ fontSize: '0.8rem', fontWeight: 400, marginLeft: '0.5rem' }}>({activeMatch.note})</span>}
                  </div>
                )}
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} style={{ color: 'var(--color-primary-light)' }} />
                    {liveVenue.name}, {liveVenue.city}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} />
                    {formatDate(activeMatch.date)} • {activeMatch.time} ET
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {weather.icon} {weather.temp}°C • {weather.condition}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button className="btn btn--outline btn--sm" onClick={() => onNavigate('route')}>📍 Directions</button>
                <button className="btn btn--primary btn--sm" onClick={() => onNavigate('navigation')}>🧭 Find My Seat</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TODAY'S MATCHES STRIP (shows all today's matches if > 1) ── */}
      {todaysMatches.length > 1 && (
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="card__header">
            <span className="card__title"><Calendar size={16} style={{ color: 'var(--color-primary-light)' }} /> All Matches Today</span>
            <span className="badge badge--primary">{todaysMatches.length} matches</span>
          </div>
          <div className="card__body" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {todaysMatches.map(match => {
              const venue = getVenue(match.venue);
              const status = getMatchStatusDisplay(match);
              const isActive = match.id === selectedMatchId;
              return (
                <div key={match.id} style={{
                  flex: '1 1 280px', padding: '0.75rem 1rem', borderRadius: '10px',
                  border: isActive ? '2px solid var(--color-primary-light)' : '1px solid var(--color-gray-200)',
                  background: isActive ? 'rgba(37,99,235,0.06)' : match.status === 'live' ? 'rgba(239,68,68,0.04)' : 'var(--color-gray-50)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <span className={`badge badge--${status.color}`} style={{ fontSize: '0.6rem' }}>
                      {match.status === 'live' && <span className="badge__dot"></span>}{status.label}
                    </span>
                    {isActive && <span className="badge badge--primary" style={{ fontSize: '0.58rem' }}>YOUR MATCH</span>}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                    {match.teamA} vs {match.teamB}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {match.round} • {venue?.name} • {match.time} ET
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card hover-lift">
          <div className="stat-card__header">
            <div className="stat-card__icon stat-card__icon--primary"><Users size={22} /></div>
            <span className="stat-card__trend stat-card__trend--up">↑ {telemetry.capacityPercentage}% Cap</span>
          </div>
          <div className="stat-card__value">{telemetry.attendance.toLocaleString()}</div>
          <div className="stat-card__label">Live Stadium Attendance</div>
        </div>
        <div className="stat-card hover-lift">
          <div className="stat-card__header">
            <div className="stat-card__icon stat-card__icon--success"><DoorOpen size={22} /></div>
            <span className="stat-card__trend" style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.68rem' }}>Gate 4: {telemetry.gateWaitTimes.gate4}m</span>
          </div>
          <div className="stat-card__value">{Math.round((telemetry.gateWaitTimes.gate1 + telemetry.gateWaitTimes.gate3 + telemetry.gateWaitTimes.gate4) / 3)} min</div>
          <div className="stat-card__label">Avg. Express Gate Wait</div>
        </div>
        <div className="stat-card hover-lift">
          <div className="stat-card__header">
            <div className="stat-card__icon stat-card__icon--warning"><Thermometer size={22} /></div>
            <span className="stat-card__trend" style={{ background: '#fef3c7', color: '#d97706', fontSize: '0.68rem' }}>Open-Meteo Live</span>
          </div>
          <div className="stat-card__value">{weather.temp}°C {weather.icon}</div>
          <div className="stat-card__label">{weather.condition} • Wind {weather.windSpeed} km/h</div>
        </div>
        <div className="stat-card hover-lift">
          <div className="stat-card__header">
            <div className="stat-card__icon stat-card__icon--gold"><Leaf size={22} /></div>
          </div>
          <div className="stat-card__value">85%</div>
          <div className="stat-card__label">Carbon Offset Goal Achieved</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop: 'var(--space-2)' }}>
        <div className="card__header">
          <span className="card__title">Quick Actions</span>
          <span className="badge badge--info"><Sparkles size={12} /> AI Ready</span>
        </div>
        <div className="card__body">
          <div className="action-chips">
            <button className="action-chip" onClick={() => onNavigate('matches')}><Trophy size={14} /> All Matches</button>
            <button className="action-chip" onClick={() => onNavigate('route')}><MapPin size={14} /> Directions & Traffic</button>
            <button className="action-chip" onClick={() => onNavigate('navigation')}><Compass size={14} /> Find My Seat</button>
            <button className="action-chip" onClick={() => onNavigate('crowd')}><Users size={14} /> Crowd Status</button>
            <button className="action-chip" onClick={() => onNavigate('transport')}><Train size={14} /> Journey Home</button>
            <button className="action-chip" onClick={() => onNavigate('accessibility')}><Accessibility size={14} /> Accessible Routes</button>
            <button className="action-chip" onClick={() => onNavigate('sustainability')}><Leaf size={14} /> Carbon Footprint</button>
            <button className="action-chip" onClick={onOpenChat}><Bot size={14} /> Ask AI Assistant</button>
          </div>
        </div>
      </div>

      {/* Insights + Upcoming */}
      <div className="content-grid" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card">
          <div className="card__header">
            <span className="card__title"><Bot size={18} style={{ color: 'var(--color-primary-light)' }} /> AI Real-Time Insights</span>
            <span className="badge badge--success"><span className="badge__dot"></span> Live</span>
          </div>
          <div className="card__body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {telemetry.liveAlerts.map((alt, i) => (
                <div key={i} className={`alert alert--${alt.color}`}>
                  <span className="alert__icon"><AlertTriangle size={20} /></span>
                  <div className="alert__content">
                    <div className="alert__title">{alt.road} — {alt.status.toUpperCase()} (+{alt.delay}m)</div>
                    Real-time DOT sensor alert at {alt.time}. Take alternate approach routes or public rail express.
                  </div>
                </div>
              ))}
              <div className="alert alert--info">
                <span className="alert__icon">🚇</span>
                <div className="alert__content">
                  <div className="alert__title">Next Express: {Math.round(telemetry.transitCountdowns.metroGreen / 60)}m {telemetry.transitCountdowns.metroGreen % 60}s</div>
                  Leave via Gate 4 (West Stand) 5 minutes early for zero-wait rail boarding.
                </div>
              </div>
              <div className="alert alert--success">
                <span className="alert__icon">🌱</span>
                <div className="alert__content">
                  <div className="alert__title">Sustainability Milestone</div>
                  Attendance crossed {telemetry.attendance.toLocaleString()} with 68% waste diversion rate!
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <span className="card__title"><Trophy size={18} style={{ color: '#f59e0b' }} /> Upcoming Matches</span>
            <button className="btn btn--sm btn--outline" onClick={() => onNavigate('matches')}>View All</button>
          </div>
          <div className="card__body card__body--flush">
            {upcomingMatches.map((match) => {
              const venue = getVenue(match.venue);
              return (
                <div key={match.id} className="list-item">
                  <div className="list-item__icon" style={{ background: 'var(--color-info-bg)', color: 'var(--color-primary-light)' }}>⚽</div>
                  <div className="list-item__content">
                    <div className="list-item__title">{match.teamA} vs {match.teamB}</div>
                    <div className="list-item__subtitle">{match.round} • {formatDate(match.date)} • {match.time} ET</div>
                    <div className="list-item__subtitle" style={{ opacity: 0.85 }}>🏟️ {venue ? `${venue.name}, ${venue.city}` : ''}</div>
                  </div>
                  <button className="btn btn--sm btn--outline" onClick={() => onNavigate('route')}>📍</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
