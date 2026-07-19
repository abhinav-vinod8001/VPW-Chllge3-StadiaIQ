import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Car, Train, Bus, Clock, AlertTriangle, ShieldCheck, CheckCircle, ExternalLink, Thermometer, Wind } from 'lucide-react';
import { venues, getVenue } from '../../data/matchData';
import { useLiveTelemetry } from '../../data/telemetryBus';
import { fetchLiveWeather } from '../../data/liveWeather';

export default function RouteSection({ selectedVenueId, onSelectVenue }) {
  const [userLocation, setUserLocation] = useState('Manhattan (Penn Station, NY)');
  const venue = getVenue(selectedVenueId) || getVenue('metlife');
  const telemetry = useLiveTelemetry();
  const [weather, setWeather] = useState({ temp: 24, condition: 'Clear Sky', icon: '☀️', windSpeed: 12 });

  useEffect(() => {
    fetchLiveWeather(venue.id).then(res => setWeather(res));
  }, [venue.id]);

  const allVenuesList = Object.values(venues);

  const getEmbedUrl = (lat, lng) => {
    const delta = 0.03;
    const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  };

  const transportOptions = [
    {
      id: 'driving',
      name: 'Car / Driving',
      icon: <Car size={20} />,
      time: `~${45 + (telemetry.liveAlerts[0]?.delay || 15)} min`,
      delay: `+${telemetry.liveAlerts[0]?.delay || 25}m delay on ${telemetry.liveAlerts[0]?.road || 'Route 3'}`,
      status: 'High Congestion',
      color: 'danger',
      carbon: '14.2 kg CO₂',
      cost: '$45 Parking + Tolls',
      notes: 'Not recommended due to heavy post-match egress. Lot K parking requires pre-booked QR permit.'
    },
    {
      id: 'rail',
      name: 'Express Rail / Metro',
      icon: <Train size={20} />,
      time: '~22 min',
      delay: `Next departure in ${Math.round(telemetry.transitCountdowns.metroGreen / 60)}m ${telemetry.transitCountdowns.metroGreen % 60}s`,
      status: 'Optimal & Express',
      color: 'success',
      carbon: '2.1 kg CO₂',
      cost: '$5.50 One-Way',
      notes: 'Trains running every 4 minutes directly from concourse Gate 4. Zero road traffic delay.'
    },
    {
      id: 'shuttle',
      name: 'FIFA Fan Shuttle',
      icon: <Bus size={20} />,
      time: '~35 min',
      delay: `Next shuttle in ${Math.round(telemetry.transitCountdowns.fanShuttle / 60)}m`,
      status: 'Moderate Flow',
      color: 'info',
      carbon: '3.4 kg CO₂',
      cost: 'Free with Match Ticket',
      notes: 'Dedicated bus lanes from Secaucus Junction and Fan Festival Hubs.'
    },
    {
      id: 'rideshare',
      name: 'Rideshare / Taxi',
      icon: <Navigation size={20} />,
      time: '~50 min',
      delay: '2.4x Surge Pricing Active',
      status: 'Heavy Queue',
      color: 'warning',
      carbon: '13.8 kg CO₂',
      cost: '~$68 - $95 (Surge)',
      notes: 'Pickup point restricted to Lot E (15-min walk from main gates).'
    }
  ];

  return (
    <div className="section active">
      <div className="section__header">
        <h2 className="section__title"><Navigation style={{ color: 'var(--color-primary-light)' }} /> Route Navigation & Live Traffic Telemetry</h2>
        <p className="section__description">
          Real-time multimodal navigation and road congestion monitoring for all 16 FIFA World Cup 2026™ host stadiums across the United States, Mexico, and Canada.
        </p>
      </div>

      {/* Venue Selector & Live Weather Bar */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card__header">
          <span className="card__title">📍 Select Host Stadium & Departure Origin</span>
          <span className="badge badge--primary">All 16 Host Venues Live</span>
        </div>
        <div className="card__body" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <label className="text-xs text-muted font-bold" style={{ display: 'block', marginBottom: '0.4rem' }}>HOST STADIUM / VENUE</label>
            <select
              className="select"
              value={selectedVenueId}
              onChange={(e) => onSelectVenue(e.target.value)}
              style={{ fontWeight: 600 }}
            >
              {allVenuesList.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.country} — {v.name} ({v.city}) • Cap: {v.capacity}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '240px' }}>
            <label className="text-xs text-muted font-bold" style={{ display: 'block', marginBottom: '0.4rem' }}>YOUR DEPARTURE ORIGIN</label>
            <input
              type="text"
              className="input"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
              placeholder="Enter origin (e.g., Downtown hotel, airport...)"
            />
          </div>

          {/* Real-Time Weather Widget Box */}
          <div style={{
            background: 'var(--color-gray-50)', padding: '0.6rem 1rem', borderRadius: '10px',
            border: '1px solid var(--color-gray-200)', minWidth: '210px', display: 'flex', alignItems: 'center', gap: '0.75rem'
          }}>
            <span style={{ fontSize: '1.85rem' }}>{weather.icon}</span>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>OPEN-METEO LIVE ({venue.city.split(',')[0].toUpperCase()})</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{weather.temp}°C • {weather.condition}</div>
              <div style={{ fontSize: '0.68rem', opacity: 0.85 }}>Wind: {weather.windSpeed} km/h • Humidity: {weather.humidity || 58}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Map + Live Road Alert Banner */}
      <div className="content-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card">
          <div className="card__header">
            <span className="card__title">🗺️ Live OpenStreetMap Telemetry View</span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--sm btn--outline"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Open Google Maps <ExternalLink size={14} />
            </a>
          </div>
          <div className="card__body card__body--flush">
            <div style={{ height: '360px', width: '100%', position: 'relative', background: '#e2e8f0' }}>
              <iframe
                title={`StadiaIQ Live Map: ${venue.name}`}
                src={getEmbedUrl(venue.lat, venue.lng)}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
              <div style={{
                position: 'absolute', bottom: 12, left: 12, background: 'rgba(255,255,255,0.95)',
                padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-gray-200)'
              }}>
                📍 GPS Coordinates: {venue.lat.toFixed(4)}° N, {venue.lng.toFixed(4)}° W
              </div>
            </div>
          </div>
        </div>

        {/* Live Traffic Alerts Panel */}
        <div className="card">
          <div className="card__header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="card__title">🚨 Real-Time Road & Corridor Alerts</span>
              <span className="live-dot" style={{ width: 6, height: 6 }}></span>
            </div>
            <span className="badge badge--danger">Active Sensors</span>
          </div>
          <div className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {telemetry.liveAlerts.map((alt, idx) => (
              <div key={idx} className={`alert alert--${alt.color}`} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.9rem' }}>
                  <AlertTriangle size={18} />
                  <span>{alt.road}</span>
                </div>
                <div style={{ fontSize: '0.8rem', marginTop: '0.3rem' }}>
                  <strong>{alt.status.toUpperCase()} CONGESTION (+{alt.delay} min delay)</strong> — DOT cameras report heavy pre/post-match traffic volume near gate approach.
                </div>
                <div style={{ fontSize: '0.7rem', marginTop: '0.4rem', opacity: 0.85 }}>
                  Reported at {alt.time} • AI Recommendation: Re-route via secondary transit corridors or board rail express.
                </div>
              </div>
            ))}

            <div className="alert alert--success" style={{ alignItems: 'center' }}>
              <span className="alert__icon"><ShieldCheck size={20} /></span>
              <div className="alert__content">
                <div className="alert__title">StadiaIQ Route Verification</div>
                Express Rail corridors are operating at 100% on-time frequency (`every 4 mins`) with zero road congestion impact.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multimodal Transit Comparison Table */}
      <div className="card">
        <div className="card__header">
          <span className="card__title">⚡ Multimodal Journey Comparison (`{userLocation}` → `{venue.name}`)</span>
          <span className="badge badge--success">AI Recommended: Express Rail</span>
        </div>
        <div className="card__body card__body--flush">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Mode of Transport</th>
                  <th>Estimated Travel Time</th>
                  <th>Live Congestion / Delay</th>
                  <th>Carbon Footprint</th>
                  <th>Estimated Cost</th>
                  <th>StadiaIQ Telemetry Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {transportOptions.map((opt) => (
                  <tr key={opt.id} style={{ background: opt.id === 'rail' ? 'rgba(34,197,94,0.04)' : 'transparent' }}>
                    <td style={{ fontWeight: 700 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--color-primary-light)' }}>{opt.icon}</span>
                        <span>{opt.name}</span>
                        {opt.id === 'rail' && <span className="badge badge--success" style={{ fontSize: '0.65rem' }}>Best Option</span>}
                      </div>
                    </td>
                    <td style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>{opt.time}</td>
                    <td>
                      <span className={`badge badge--${opt.color}`}>
                        {opt.id === 'rail' && <span className="badge__dot"></span>}
                        {opt.delay}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: opt.id === 'rail' ? 'var(--color-success)' : 'var(--text-secondary)' }}>
                      {opt.carbon}
                    </td>
                    <td style={{ fontWeight: 700 }}>{opt.cost}</td>
                    <td className="text-xs text-secondary">{opt.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
