import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DoorOpen, 
  Thermometer, 
  Leaf, 
  Trophy, 
  MapPin, 
  Compass, 
  Train, 
  Accessibility, 
  Bot, 
  AlertTriangle, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { getLiveMatch, getVenue, getUpcomingMatches, formatDate } from '../../data/matchData';
import { useLiveTelemetry } from '../../data/telemetryBus';
import { fetchLiveWeather } from '../../data/liveWeather';

export default function HomeSection({ onNavigate, onOpenChat, selectedVenueId = 'metlife' }) {
  const liveMatch = getLiveMatch();
  const liveVenue = getVenue(selectedVenueId) || (liveMatch ? getVenue(liveMatch.venue) : getVenue('metlife'));
  const upcomingMatches = getUpcomingMatches().slice(0, 4);
  const telemetry = useLiveTelemetry();
  const [weather, setWeather] = useState({ temp: 24, condition: 'Clear Sky', icon: '☀️', windSpeed: 12 });

  useEffect(() => {
    fetchLiveWeather(liveVenue.id).then(res => setWeather(res));
  }, [liveVenue.id]);

  return (
    <div className="section active">
      <div className="section__header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="section__title">Welcome to StadiaIQ</h1>
            <p className="section__description">
              Your real-time AI operational companion for the FIFA World Cup 2026. Navigate stadiums, monitor live crowd telemetry, optimize transport routes, and get instant Groq Llama-3.3 intelligence.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700, background: 'var(--color-success-bg)', padding: '0.5rem 0.85rem', borderRadius: '9999px', border: '1px solid #bbf7d0' }}>
            <span className="live-dot" style={{ width: 8, height: 8 }}></span>
            <span>LIVE TELEMETRY STREAMING ({liveVenue.name})</span>
          </div>
        </div>
      </div>

      {/* Live Match Banner */}
      {liveMatch && (
        <div 
          className="card" 
          style={{ 
            marginBottom: 'var(--space-8)', 
            borderLeft: '5px solid var(--color-primary-light)',
            background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)'
          }}
        >
          <div className="card__body">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge--danger"><span className="badge__dot"></span> LIVE NOW — QUARTER FINAL</span>
                  <span className="text-xs text-muted">Match #{liveMatch.id}</span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                  {liveMatch.teamA} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>vs</span> {liveMatch.teamB}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={16} style={{ color: 'var(--color-primary-light)' }} />
                  <span>{liveVenue.name}, {liveVenue.city} • 8:00 PM ET • {formatDate(liveMatch.date)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn--outline btn--sm" onClick={() => onNavigate('route')}>
                  📍 Directions & Traffic
                </button>
                <button className="btn btn--primary btn--sm" onClick={() => onNavigate('navigation')}>
                  🧭 Seating Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Grid - Real-Time Telemetry & Weather Bound */}
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
          <div className="stat-card__label">Avg. Express Gate Wait Time</div>
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

      {/* Quick Actions Card */}
      <div className="card" style={{ marginTop: 'var(--space-2)' }}>
        <div className="card__header">
          <span className="card__title">StadiaIQ Quick Actions</span>
          <span className="badge badge--info"><Sparkles size={12} /> Groq Llama-3.3 Ready</span>
        </div>
        <div className="card__body">
          <div className="action-chips">
            <button className="action-chip" onClick={() => onNavigate('matches')}><Trophy size={14} /> Browse Matches</button>
            <button className="action-chip" onClick={() => onNavigate('route')}><MapPin size={14} /> Get Directions & Traffic</button>
            <button className="action-chip" onClick={() => onNavigate('navigation')}><Compass size={14} /> Find My Seat</button>
            <button className="action-chip" onClick={() => onNavigate('crowd')}><Users size={14} /> Crowd Status</button>
            <button className="action-chip" onClick={() => onNavigate('transport')}><Train size={14} /> Plan Journey Home</button>
            <button className="action-chip" onClick={() => onNavigate('accessibility')}><Accessibility size={14} /> Accessible Routes</button>
            <button className="action-chip" onClick={() => onNavigate('sustainability')}><Leaf size={14} /> Carbon Footprint</button>
            <button className="action-chip" onClick={onOpenChat}><Bot size={14} /> Ask Groq AI Assistant</button>
          </div>
        </div>
      </div>

      {/* AI Insights + Upcoming Matches */}
      <div className="content-grid" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card">
          <div className="card__header">
            <span className="card__title"><Bot size={18} style={{ color: 'var(--color-primary-light)' }} /> AI Real-Time Insights & Telemetry</span>
            <span className="badge badge--success"><span className="badge__dot"></span> Live Egress & Ops</span>
          </div>
          <div className="card__body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {telemetry.liveAlerts.map((alt, i) => (
                <div key={i} className={`alert alert--${alt.color}`}>
                  <span className="alert__icon"><AlertTriangle size={20} /></span>
                  <div className="alert__content">
                    <div className="alert__title">{alt.road} — {alt.status.toUpperCase()} CONGESTION (+{alt.delay}m delay)</div>
                    Real-time DOT sensor alert at {alt.time}. Take alternate approach routes via Route 17 or public rail express.
                  </div>
                </div>
              ))}
              <div className="alert alert--info">
                <span className="alert__icon">🚇</span>
                <div className="alert__content">
                  <div className="alert__title">Post-Match Transit Tip (Next Express: {Math.round(telemetry.transitCountdowns.metroGreen / 60)}m {telemetry.transitCountdowns.metroGreen % 60}s)</div>
                  Leave via Gate 4 (West Stand) 5 minutes early to board the Meadowlands Rail express with zero wait time.
                </div>
              </div>
              <div className="alert alert--success">
                <span className="alert__icon">🌱</span>
                <div className="alert__content">
                  <div className="alert__title">Sustainability & Turnstile Milestone</div>
                  Match #QF-4 attendance has crossed {telemetry.attendance.toLocaleString()} with 68% waste diversion!
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <span className="card__title"><Trophy size={18} style={{ color: 'var(--color-gold)' }} /> Upcoming Matches</span>
            <button className="btn btn--sm btn--outline" onClick={() => onNavigate('matches')}>View All Schedule</button>
          </div>
          <div className="card__body card__body--flush">
            {upcomingMatches.map((match) => {
              const venue = getVenue(match.venue);
              return (
                <div key={match.id} className="list-item">
                  <div className="list-item__icon" style={{ background: 'var(--color-info-bg)', color: 'var(--color-primary-light)' }}>
                    ⚽
                  </div>
                  <div className="list-item__content">
                    <div className="list-item__title">{match.teamA} vs {match.teamB}</div>
                    <div className="list-item__subtitle">{match.round} • {formatDate(match.date)} • {match.time} ET</div>
                    <div className="list-item__subtitle" style={{ opacity: 0.85 }}>🏟️ {venue ? `${venue.name}, ${venue.city}` : ''}</div>
                  </div>
                  <button className="btn btn--sm btn--outline" onClick={() => onNavigate('route')}>📍 Directions</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
