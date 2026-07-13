import React, { useEffect, useRef, useState } from 'react';
import { Compass, Search, MapPin, CheckCircle, Info } from 'lucide-react';
import { generateAIResponse } from '../../data/aiEngine';

export default function StadiumMapSection() {
  const canvasRef = useRef(null);
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  // Stadium seating layout data (Rectangular bowl exact coordinates)
  const sectionDefs = [
    // SOUTH STAND (Lower)
    { id: '101', x: 0.25, y: 0.73, w: 0.066, h: 0.08, tier: 'Lower', stand: 'South', type: 'Standard' },
    { id: '102', x: 0.32, y: 0.73, w: 0.066, h: 0.08, tier: 'Lower', stand: 'South', type: 'Standard' },
    { id: '103', x: 0.39, y: 0.73, w: 0.066, h: 0.08, tier: 'Lower', stand: 'South', type: 'Standard' },
    { id: '104', x: 0.46, y: 0.73, w: 0.066, h: 0.08, tier: 'Lower', stand: 'South', type: 'Standard' },
    { id: '105', x: 0.53, y: 0.73, w: 0.066, h: 0.08, tier: 'Lower', stand: 'South', type: 'Standard' },
    { id: '106', x: 0.60, y: 0.73, w: 0.066, h: 0.08, tier: 'Lower', stand: 'South', type: 'Standard' },
    { id: '107', x: 0.67, y: 0.73, w: 0.066, h: 0.08, tier: 'Lower', stand: 'South', type: 'Standard' },

    // NORTH STAND (Lower)
    { id: '115', x: 0.25, y: 0.13, w: 0.066, h: 0.08, tier: 'Lower', stand: 'North', type: 'Standard' },
    { id: '116', x: 0.32, y: 0.13, w: 0.066, h: 0.08, tier: 'Lower', stand: 'North', type: 'Standard' },
    { id: '117', x: 0.39, y: 0.13, w: 0.066, h: 0.08, tier: 'Lower', stand: 'North', type: 'Standard' },
    { id: '118', x: 0.46, y: 0.13, w: 0.066, h: 0.08, tier: 'Lower', stand: 'North', type: 'Standard' },
    { id: '119', x: 0.53, y: 0.13, w: 0.066, h: 0.08, tier: 'Lower', stand: 'North', type: 'Standard' },
    { id: '120', x: 0.60, y: 0.13, w: 0.066, h: 0.08, tier: 'Lower', stand: 'North', type: 'Standard' },
    { id: '121', x: 0.67, y: 0.13, w: 0.066, h: 0.08, tier: 'Lower', stand: 'North', type: 'Standard' },

    // WEST STAND (Lower)
    { id: '108', x: 0.12, y: 0.24, w: 0.10, h: 0.065, tier: 'Lower', stand: 'West', type: 'Category 2' },
    { id: '109', x: 0.12, y: 0.31, w: 0.10, h: 0.065, tier: 'Lower', stand: 'West', type: 'Category 2' },
    { id: '110', x: 0.12, y: 0.38, w: 0.10, h: 0.065, tier: 'Lower', stand: 'West', type: 'Category 1' },
    { id: '111', x: 0.12, y: 0.45, w: 0.10, h: 0.065, tier: 'Lower', stand: 'West', type: 'Category 1' },
    { id: '112', x: 0.12, y: 0.52, w: 0.10, h: 0.065, tier: 'Lower', stand: 'West', type: 'Category 2' },
    { id: '113', x: 0.12, y: 0.59, w: 0.10, h: 0.065, tier: 'Lower', stand: 'West', type: 'Category 2' },

    // EAST STAND (Lower)
    { id: '128', x: 0.76, y: 0.24, w: 0.10, h: 0.065, tier: 'Lower', stand: 'East', type: 'Category 2' },
    { id: '129', x: 0.76, y: 0.31, w: 0.10, h: 0.065, tier: 'Lower', stand: 'East', type: 'Category 2' },
    { id: '130', x: 0.76, y: 0.38, w: 0.10, h: 0.065, tier: 'Lower', stand: 'East', type: 'VIP' },
    { id: '131', x: 0.76, y: 0.45, w: 0.10, h: 0.065, tier: 'Lower', stand: 'East', type: 'VIP' },
    { id: '132', x: 0.76, y: 0.52, w: 0.10, h: 0.065, tier: 'Lower', stand: 'East', type: 'Category 2' },
    { id: '133', x: 0.76, y: 0.59, w: 0.10, h: 0.065, tier: 'Lower', stand: 'East', type: 'Category 2' },

    // CORNERS
    { id: 'C-NW', x: 0.15, y: 0.16, w: 0.08, h: 0.065, tier: 'Lower', stand: 'Corner', type: 'Standard' },
    { id: 'C-NE', x: 0.75, y: 0.16, w: 0.08, h: 0.065, tier: 'Lower', stand: 'Corner', type: 'Standard' },
    { id: 'C-SW', x: 0.15, y: 0.69, w: 0.08, h: 0.065, tier: 'Lower', stand: 'Corner', type: 'Standard' },
    { id: 'C-SE', x: 0.75, y: 0.69, w: 0.08, h: 0.065, tier: 'Lower', stand: 'Corner', type: 'Standard' },

    // UPPER TIERS
    { id: '201', x: 0.25, y: 0.83, w: 0.10, h: 0.06, tier: 'Upper', stand: 'South', type: 'Standard' },
    { id: '202', x: 0.36, y: 0.83, w: 0.10, h: 0.06, tier: 'Upper', stand: 'South', type: 'Standard' },
    { id: '203', x: 0.47, y: 0.83, w: 0.10, h: 0.06, tier: 'Upper', stand: 'South', type: 'Standard' },
    { id: '204', x: 0.58, y: 0.83, w: 0.10, h: 0.06, tier: 'Upper', stand: 'South', type: 'Standard' },
    { id: '205', x: 0.69, y: 0.83, w: 0.066, h: 0.06, tier: 'Upper', stand: 'South', type: 'Standard' },

    { id: '215', x: 0.25, y: 0.05, w: 0.10, h: 0.06, tier: 'Upper', stand: 'North', type: 'Standard' },
    { id: '216', x: 0.36, y: 0.05, w: 0.10, h: 0.06, tier: 'Upper', stand: 'North', type: 'Standard' },
    { id: '217', x: 0.47, y: 0.05, w: 0.10, h: 0.06, tier: 'Upper', stand: 'North', type: 'Standard' },
    { id: '218', x: 0.58, y: 0.05, w: 0.10, h: 0.06, tier: 'Upper', stand: 'North', type: 'Standard' },
    { id: '219', x: 0.69, y: 0.05, w: 0.066, h: 0.06, tier: 'Upper', stand: 'North', type: 'Standard' },

    { id: '208', x: 0.04, y: 0.28, w: 0.065, h: 0.09, tier: 'Upper', stand: 'West', type: 'Standard' },
    { id: '209', x: 0.04, y: 0.38, w: 0.065, h: 0.09, tier: 'Upper', stand: 'West', type: 'Standard' },
    { id: '210', x: 0.04, y: 0.48, w: 0.065, h: 0.09, tier: 'Upper', stand: 'West', type: 'Standard' },
    { id: '211', x: 0.04, y: 0.58, w: 0.065, h: 0.09, tier: 'Upper', stand: 'West', type: 'Standard' },

    { id: '228', x: 0.89, y: 0.28, w: 0.065, h: 0.09, tier: 'Upper', stand: 'East', type: 'Standard' },
    { id: '229', x: 0.89, y: 0.38, w: 0.065, h: 0.09, tier: 'Upper', stand: 'East', type: 'Standard' },
    { id: '230', x: 0.89, y: 0.45, w: 0.065, h: 0.09, tier: 'Upper', stand: 'East', type: 'Premium' },
    { id: '231', x: 0.89, y: 0.58, w: 0.065, h: 0.09, tier: 'Upper', stand: 'East', type: 'Standard' },
  ];

  const poiDefs = [
    { id: 'gate-1', label: 'Gate 1 (North)', emoji: '🚪', x: 0.49, y: 0.01, type: 'gate' },
    { id: 'gate-2', label: 'Gate 2 (East)', emoji: '🚪', x: 0.97, y: 0.47, type: 'gate' },
    { id: 'gate-3', label: 'Gate 3 (South)', emoji: '🚪', x: 0.49, y: 0.95, type: 'gate' },
    { id: 'gate-4', label: 'Gate 4 (West)', emoji: '🚪', x: 0.01, y: 0.47, type: 'gate' },
    { id: 'food-n', label: 'Food Court', emoji: '🍔', x: 0.35, y: 0.01, type: 'food' },
    { id: 'food-s', label: 'Food Court', emoji: '🍔', x: 0.65, y: 0.95, type: 'food' },
    { id: 'food-w', label: 'Food Court', emoji: '🍔', x: 0.01, y: 0.32, type: 'food' },
    { id: 'medic-w', label: 'First Aid', emoji: '🏥', x: 0.01, y: 0.62, type: 'medical' },
    { id: 'medic-e', label: 'First Aid', emoji: '🏥', x: 0.97, y: 0.62, type: 'medical' },
    { id: 'wc-nw', label: 'Restrooms', emoji: '🚻', x: 0.15, y: 0.01, type: 'restroom' },
    { id: 'wc-ne', label: 'Restrooms', emoji: '🚻', x: 0.85, y: 0.01, type: 'restroom' },
    { id: 'wc-se', label: 'Restrooms', emoji: '🚻', x: 0.85, y: 0.95, type: 'restroom' },
    { id: 'merch', label: 'Fan Shop', emoji: '🛍️', x: 0.97, y: 0.32, type: 'shop' },
  ];

  const typeColors = {
    'Standard':   { fill: '#f1f5f9', stroke: '#cbd5e1', label: '#334155' },
    'Category 1': { fill: '#dbeafe', stroke: '#60a5fa', label: '#1e40af' },
    'Category 2': { fill: '#e0e7ff', stroke: '#818cf8', label: '#3730a3' },
    'VIP':        { fill: '#fef3c7', stroke: '#f59e0b', label: '#92400e' },
    'Premium':    { fill: '#fce7f3', stroke: '#ec4899', label: '#9d174d' },
  };

  const drawMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth || 800;
    const height = Math.max(450, width * 0.58);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Concourse Ring
    ctx.fillStyle = '#f1f5f9';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(width * 0.02, height * 0.02, width * 0.96, height * 0.96, 12);
    ctx.fill();
    ctx.stroke();

    // Sections
    sectionDefs.forEach(s => {
      const px = s.x * width;
      const py = s.y * height;
      const pw = s.w * width;
      const ph = s.h * height;
      const isSelected = selectedSection && selectedSection.id === s.id;
      const colors = typeColors[s.type] || typeColors['Standard'];

      ctx.fillStyle = isSelected ? '#1e3a8a' : colors.fill;
      ctx.strokeStyle = isSelected ? '#0f172a' : colors.stroke;
      ctx.lineWidth = isSelected ? 2.5 : 1;

      ctx.beginPath();
      ctx.roundRect(px, py, pw, ph, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isSelected ? '#ffffff' : colors.label;
      const fontSize = Math.max(7, Math.min(pw, ph) * 0.32);
      ctx.font = `600 ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.id, px + pw / 2, py + ph / 2);
    });

    // Pitch
    const px = width * 0.24;
    const py = height * 0.23;
    const pw = width * 0.50;
    const ph = height * 0.50;
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 6);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 1.2;
    const inset = 6;
    ctx.strokeRect(px + inset, py + inset, pw - inset * 2, ph - inset * 2);
    ctx.beginPath();
    ctx.moveTo(px + inset, py + ph / 2);
    ctx.lineTo(px + pw - inset, py + ph / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(px + pw / 2, py + ph / 2, Math.min(pw, ph) * 0.09, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.font = `bold ${Math.max(10, width * 0.016)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('FIFA WORLD CUP 2026™', px + pw / 2, py + ph / 2);

    // POIs
    poiDefs.forEach(p => {
      const size = Math.max(13, width * 0.018);
      ctx.font = `${size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, p.x * width, p.y * height);
    });
  };

  useEffect(() => {
    drawMap();
    window.addEventListener('resize', drawMap);
    return () => window.removeEventListener('resize', drawMap);
  }, [selectedSection]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    for (const s of sectionDefs) {
      const px = s.x * width;
      const py = s.y * height;
      const pw = s.w * width;
      const ph = s.h * height;
      if (mx >= px && mx <= px + pw && my >= py && my <= py + ph) {
        setSelectedSection(s);
        setSearchResult({ type: 'section', data: s });
        return;
      }
    }
  };

  const doSearch = () => {
    const q = query.toLowerCase().replace(/\s+/g, '');
    if (!q) return;

    for (const s of sectionDefs) {
      if (s.id.toLowerCase().replace(/\s+/g, '') === q || ('section' + s.id.toLowerCase()) === q || ('sec' + s.id.toLowerCase()) === q) {
        setSelectedSection(s);
        setSearchResult({ type: 'section', data: s });
        return;
      }
    }

    const gateMatch = query.match(/gate\s*(\d+)/i);
    if (gateMatch) {
      const poi = poiDefs.find(p => p.id === `gate-${gateMatch[1]}`);
      if (poi) {
        setSelectedSection(null);
        setSearchResult({ type: 'poi', data: poi });
        return;
      }
    }

    for (const p of poiDefs) {
      if (p.label.toLowerCase().includes(query.toLowerCase()) || p.type.toLowerCase().includes(query.toLowerCase())) {
        setSelectedSection(null);
        setSearchResult({ type: 'poi', data: p });
        return;
      }
    }

    const aiRes = generateAIResponse(query);
    setSearchResult({ type: 'ai', text: aiRes });
  };

  return (
    <div className="section active">
      <div className="section__header">
        <h2 className="section__title"><Compass style={{ color: 'var(--color-primary-light)' }} /> Interactive Rectangular Stadium Seating Map</h2>
        <p className="section__description">
          Click any seating section to view exact tier details, view category classifications, or search in natural language for gates, medical stations, and amenities.
        </p>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card__body">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: 1, minWidth: '260px' }}>
              <span className="input-group__icon"><Search size={16} /></span>
              <input
                type="text"
                className="input"
                placeholder='Search: "Section 110", "Gate 3", "restrooms", "first aid", "food court"...'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter') doSearch(); }}
              />
            </div>
            <button className="btn btn--primary" onClick={doSearch}>Search Location</button>
          </div>

          {searchResult && (
            <div style={{ marginTop: '1rem' }}>
              {searchResult.type === 'section' && (
                <div className="alert alert--success">
                  <span className="alert__icon"><CheckCircle size={20} /></span>
                  <div className="alert__content">
                    <div className="alert__title">Highlighted: Section {searchResult.data.id}</div>
                    <div>{searchResult.data.tier} Tier • {searchResult.data.stand} Stand • {searchResult.data.type} Seating Category</div>
                  </div>
                </div>
              )}
              {searchResult.type === 'poi' && (
                <div className="alert alert--info">
                  <span className="alert__icon">{searchResult.data.emoji}</span>
                  <div className="alert__content">
                    <div className="alert__title">Found Point of Interest: {searchResult.data.label}</div>
                    <div>Located on the stadium perimeter ring above. Check the {searchResult.data.id.includes('n') ? 'North' : searchResult.data.id.includes('s') ? 'South' : 'Side'} concourse.</div>
                  </div>
                </div>
              )}
              {searchResult.type === 'ai' && (
                <div className="alert alert--info">
                  <span className="alert__icon"><Info size={20} /></span>
                  <div className="alert__content">
                    <div className="alert__title">StadiaIQ Wayfinding Response</div>
                    <div style={{ whiteSpace: 'pre-line', marginTop: '4px' }}>{searchResult.text.replace(/\*\*(.*?)\*\*/g, '$1')}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="action-chips" style={{ marginTop: '0.85rem' }}>
            <button className="action-chip" onClick={() => { setQuery('Gate 1'); doSearch(); }}>🚪 Gate 1</button>
            <button className="action-chip" onClick={() => { setQuery('restrooms'); doSearch(); }}>🚻 Restrooms</button>
            <button className="action-chip" onClick={() => { setQuery('food'); doSearch(); }}>🍔 Food Court</button>
            <button className="action-chip" onClick={() => { setQuery('first aid'); doSearch(); }}>🏥 First Aid</button>
            <button className="action-chip" onClick={() => { setQuery('Section 130'); doSearch(); }}>⭐️ VIP Section</button>
          </div>
        </div>
      </div>

      {/* Interactive Map Canvas */}
      <div className="card">
        <div className="card__header">
          <span className="card__title">StadiaIQ Seating & Concourse Map</span>
          <span className="badge badge--info">Click Section to Select</span>
        </div>
        <div className="card__body">
          <div className="canvas-container" style={{ cursor: 'pointer' }}>
            <canvas ref={canvasRef} onClick={handleCanvasClick} />
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '1.25rem', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
              <span style={{ width: '14px', height: '14px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '3px' }}></span> Standard
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
              <span style={{ width: '14px', height: '14px', background: '#dbeafe', border: '1px solid #60a5fa', borderRadius: '3px' }}></span> Category 1
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
              <span style={{ width: '14px', height: '14px', background: '#e0e7ff', border: '1px solid #818cf8', borderRadius: '3px' }}></span> Category 2
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
              <span style={{ width: '14px', height: '14px', background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '3px' }}></span> VIP Suite
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
              <span style={{ width: '14px', height: '14px', background: '#fce7f3', border: '1px solid #ec4899', borderRadius: '3px' }}></span> Premium Box
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
