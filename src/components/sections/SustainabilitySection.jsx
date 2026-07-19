import React, { useState } from 'react';
import { Leaf, Award, Recycle, Sun, Droplets, Sparkles } from 'lucide-react';

export default function SustainabilitySection() {
  const [transportMode, setTransportMode] = useState('transit');
  const [bottleUsed, setBottleUsed] = useState(true);
  const [mealType, setMealType] = useState('plant');

  const calculateImpact = () => {
    let carbonSaved = 0;
    if (transportMode === 'transit') carbonSaved += 2.1;
    if (transportMode === 'shuttle') carbonSaved += 1.9;
    if (bottleUsed) carbonSaved += 0.4;
    if (mealType === 'plant') carbonSaved += 1.5;
    return carbonSaved.toFixed(1);
  };

  const metrics = [
    { icon: <Recycle size={24} />, title: '68% Waste Diversion', subtitle: '65% Target Exceeded', color: 'success', desc: 'Over 18.4 tons of compost and recyclables sorted via AI automated optical bins.' },
    { icon: <Sun size={24} />, title: '100% Renewable LED', subtitle: 'Zero Grid Emissions', color: 'warning', desc: 'All field floodlights and concourse displays powered by regional solar & wind credits.' },
    { icon: <Droplets size={24} />, title: '45,000 Gal Saved', subtitle: 'Smart Water Reclamation', color: 'info', desc: 'Rainwater harvesting and low-flow smart sensor fixtures across all 600 restrooms.' },
    { icon: <Award size={24} />, title: 'LEED Platinum Certified', subtitle: 'Highest Green Standard', color: 'primary', desc: 'MetLife Stadium complies with strict ISO 20121 sustainable event management criteria.' },
  ];

  return (
    <div className="section active">
      <div className="section__header">
        <h2 className="section__title"><Leaf style={{ color: 'var(--color-success)' }} /> FIFA World Cup 2026™ Sustainability Tracker</h2>
        <p className="section__description">
          Tracking our commitment to the greenest World Cup in history. Explore real-time venue environmental metrics and calculate your personal match-day carbon savings.
        </p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {metrics.map((m, idx) => (
          <div key={idx} className="stat-card hover-lift">
            <div className={`stat-card__icon stat-card__icon--${m.color}`} style={{ marginBottom: '0.75rem' }}>
              {m.icon}
            </div>
            <div className="stat-card__value" style={{ fontSize: '1.45rem' }}>{m.title}</div>
            <div className="text-xs font-bold text-success" style={{ marginBottom: '0.5rem' }}>{m.subtitle}</div>
            <p className="text-xs text-secondary">{m.desc}</p>
          </div>
        ))}
      </div>

      <div className="content-grid" style={{ marginTop: 'var(--space-6)' }}>
        {/* Personal Carbon Calculator */}
        <div className="card">
          <div className="card__header">
            <span className="card__title">🧮 Match-Day Eco-Footprint Calculator</span>
            <span className="badge badge--success">Fan Calculator</span>
          </div>
          <div className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="text-xs text-muted font-bold" style={{ display: 'block', marginBottom: '0.4rem' }}>HOW DID YOU TRAVEL TO THE VENUE?</label>
              <select className="select" value={transportMode} onChange={(e) => setTransportMode(e.target.value)}>
                <option value="transit">🚇 Meadowlands Rail Express / Metro (+2.1 kg CO₂ saved)</option>
                <option value="shuttle">🚌 Official FIFA Fan Shuttle (+1.9 kg CO₂ saved)</option>
                <option value="carpool">🚙 Carpool (3+ Passengers) (+1.1 kg CO₂ saved)</option>
                <option value="solo">🚗 Personal Driving Solo (+0.0 kg CO₂ saved)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted font-bold" style={{ display: 'block', marginBottom: '0.4rem' }}>DID YOU BRING A REUSABLE WATER BOTTLE?</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  className={`btn btn--sm ${bottleUsed ? 'btn--primary' : 'btn--secondary'}`}
                  style={{ flex: 1 }}
                  onClick={() => setBottleUsed(true)}
                >
                  ✅ Yes, Reusable Bottle
                </button>
                <button
                  type="button"
                  className={`btn btn--sm ${!bottleUsed ? 'btn--primary' : 'btn--secondary'}`}
                  style={{ flex: 1 }}
                  onClick={() => setBottleUsed(false)}
                >
                  ❌ Single-Use Plastic
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted font-bold" style={{ display: 'block', marginBottom: '0.4rem' }}>CONCESSION MEAL CHOICE</label>
              <select className="select" value={mealType} onChange={(e) => setMealType(e.target.value)}>
                <option value="plant">🥗 Plant-Based / Vegetarian Concession (+1.5 kg CO₂ saved)</option>
                <option value="local">🍗 Locally Sourced Free-Range Chicken (+0.8 kg CO₂ saved)</option>
                <option value="beef">🍔 Standard Beef Burger / Hot Dog (+0.0 kg CO₂ saved)</option>
              </select>
            </div>

            <div className="alert alert--success" style={{ marginTop: '0.5rem', alignItems: 'center' }}>
              <span className="alert__icon" style={{ fontSize: '2.25rem' }}>🌱</span>
              <div className="alert__content">
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>YOUR ESTIMATED MATCH SAVINGS:</div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-success)' }}>{calculateImpact()} kg CO₂</div>
                <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>Equivalent to absorbing emissions from a tree for 3.5 months!</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Recycling & Sorting Telemetry */}
        <div className="card">
          <div className="card__header">
            <span className="card__title"><Sparkles size={18} style={{ color: 'var(--color-gold)' }} /> Live Eco-Tips & Sorting Rules</span>
            <span className="badge badge--info">AI Optical Bins</span>
          </div>
          <div className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="list-item">
              <div className="list-item__icon" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>🟢</div>
              <div className="list-item__content">
                <div className="list-item__title">Compostable Cups & Containers</div>
                <div className="list-item__subtitle">All beer cups and food trays sold inside MetLife Stadium are 100% plant-based compostable. Drop in Green Bins.</div>
              </div>
            </div>
            <div className="list-item">
              <div className="list-item__icon" style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}>🔵</div>
              <div className="list-item__content">
                <div className="list-item__title">Aluminum Cans & Plastic Bottles</div>
                <div className="list-item__subtitle">Empty liquid first, then drop in Blue Recyclable Bins located near every concourse gate.</div>
              </div>
            </div>
            <div className="list-item">
              <div className="list-item__icon" style={{ background: '#fef3c7', color: '#d97706' }}>⭐️</div>
              <div className="list-item__content">
                <div className="list-item__title">Free Hydration Stations</div>
                <div className="list-item__subtitle">Over 120 high-speed filtered water refilling stations are available across all 4 concourse levels. Bring your bottle!</div>
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--color-gray-50)', borderRadius: '8px', border: '1px solid var(--color-gray-200)', marginTop: '0.5rem', textAlign: 'center' }}>
              <span className="text-xs text-secondary font-semibold">🏆 Stadium Eco-Challenge: If 80% of fans recycle today, FIFA will donate $50,000 to local clean energy initiatives!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
