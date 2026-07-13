/* ============================================
   StadiumAI — Stadium Map (Proper Rectangular Bowl)
   Accurate layout matching US NFL/Soccer stadiums
   ============================================ */

const StadiumMap = (() => {

  let canvas, ctx;
  let width, height;
  let highlightedSection = null;
  let hoveredSection = null;
  let sections = [];
  let pois = [];

  // Proper rectangular stadium layout
  // US stadiums used for WC 2026 are rectangular bowls
  // Layout: 4 main stands + 4 corner sections + upper tiers

  const sectionDefs = [
    // ============ LOWER TIER ============
    // SOUTH STAND (Lower) — behind goal
    { id: '101', x: 0.25, y: 0.73, w: 0.066, h: 0.08, tier: 'Lower', stand: 'South', type: 'Standard' },
    { id: '102', x: 0.32, y: 0.73, w: 0.066, h: 0.08, tier: 'Lower', stand: 'South', type: 'Standard' },
    { id: '103', x: 0.39, y: 0.73, w: 0.066, h: 0.08, tier: 'Lower', stand: 'South', type: 'Standard' },
    { id: '104', x: 0.46, y: 0.73, w: 0.066, h: 0.08, tier: 'Lower', stand: 'South', type: 'Standard' },
    { id: '105', x: 0.53, y: 0.73, w: 0.066, h: 0.08, tier: 'Lower', stand: 'South', type: 'Standard' },
    { id: '106', x: 0.60, y: 0.73, w: 0.066, h: 0.08, tier: 'Lower', stand: 'South', type: 'Standard' },
    { id: '107', x: 0.67, y: 0.73, w: 0.066, h: 0.08, tier: 'Lower', stand: 'South', type: 'Standard' },

    // NORTH STAND (Lower) — behind goal
    { id: '115', x: 0.25, y: 0.13, w: 0.066, h: 0.08, tier: 'Lower', stand: 'North', type: 'Standard' },
    { id: '116', x: 0.32, y: 0.13, w: 0.066, h: 0.08, tier: 'Lower', stand: 'North', type: 'Standard' },
    { id: '117', x: 0.39, y: 0.13, w: 0.066, h: 0.08, tier: 'Lower', stand: 'North', type: 'Standard' },
    { id: '118', x: 0.46, y: 0.13, w: 0.066, h: 0.08, tier: 'Lower', stand: 'North', type: 'Standard' },
    { id: '119', x: 0.53, y: 0.13, w: 0.066, h: 0.08, tier: 'Lower', stand: 'North', type: 'Standard' },
    { id: '120', x: 0.60, y: 0.13, w: 0.066, h: 0.08, tier: 'Lower', stand: 'North', type: 'Standard' },
    { id: '121', x: 0.67, y: 0.13, w: 0.066, h: 0.08, tier: 'Lower', stand: 'North', type: 'Standard' },

    // WEST STAND (Lower) — sideline
    { id: '108', x: 0.12, y: 0.24, w: 0.10, h: 0.065, tier: 'Lower', stand: 'West', type: 'Category 2' },
    { id: '109', x: 0.12, y: 0.31, w: 0.10, h: 0.065, tier: 'Lower', stand: 'West', type: 'Category 2' },
    { id: '110', x: 0.12, y: 0.38, w: 0.10, h: 0.065, tier: 'Lower', stand: 'West', type: 'Category 1' },
    { id: '111', x: 0.12, y: 0.45, w: 0.10, h: 0.065, tier: 'Lower', stand: 'West', type: 'Category 1' },
    { id: '112', x: 0.12, y: 0.52, w: 0.10, h: 0.065, tier: 'Lower', stand: 'West', type: 'Category 2' },
    { id: '113', x: 0.12, y: 0.59, w: 0.10, h: 0.065, tier: 'Lower', stand: 'West', type: 'Category 2' },

    // EAST STAND (Lower) — sideline
    { id: '128', x: 0.76, y: 0.24, w: 0.10, h: 0.065, tier: 'Lower', stand: 'East', type: 'Category 2' },
    { id: '129', x: 0.76, y: 0.31, w: 0.10, h: 0.065, tier: 'Lower', stand: 'East', type: 'Category 2' },
    { id: '130', x: 0.76, y: 0.38, w: 0.10, h: 0.065, tier: 'Lower', stand: 'East', type: 'VIP' },
    { id: '131', x: 0.76, y: 0.45, w: 0.10, h: 0.065, tier: 'Lower', stand: 'East', type: 'VIP' },
    { id: '132', x: 0.76, y: 0.52, w: 0.10, h: 0.065, tier: 'Lower', stand: 'East', type: 'Category 2' },
    { id: '133', x: 0.76, y: 0.59, w: 0.10, h: 0.065, tier: 'Lower', stand: 'East', type: 'Category 2' },

    // CORNERS (Lower)
    { id: 'C-NW', x: 0.15, y: 0.16, w: 0.08, h: 0.065, tier: 'Lower', stand: 'Corner', type: 'Standard' },
    { id: 'C-NE', x: 0.75, y: 0.16, w: 0.08, h: 0.065, tier: 'Lower', stand: 'Corner', type: 'Standard' },
    { id: 'C-SW', x: 0.15, y: 0.69, w: 0.08, h: 0.065, tier: 'Lower', stand: 'Corner', type: 'Standard' },
    { id: 'C-SE', x: 0.75, y: 0.69, w: 0.08, h: 0.065, tier: 'Lower', stand: 'Corner', type: 'Standard' },

    // ============ UPPER TIER ============
    // SOUTH Upper
    { id: '201', x: 0.25, y: 0.83, w: 0.10, h: 0.06, tier: 'Upper', stand: 'South', type: 'Standard' },
    { id: '202', x: 0.36, y: 0.83, w: 0.10, h: 0.06, tier: 'Upper', stand: 'South', type: 'Standard' },
    { id: '203', x: 0.47, y: 0.83, w: 0.10, h: 0.06, tier: 'Upper', stand: 'South', type: 'Standard' },
    { id: '204', x: 0.58, y: 0.83, w: 0.10, h: 0.06, tier: 'Upper', stand: 'South', type: 'Standard' },
    { id: '205', x: 0.69, y: 0.83, w: 0.066, h: 0.06, tier: 'Upper', stand: 'South', type: 'Standard' },

    // NORTH Upper
    { id: '215', x: 0.25, y: 0.05, w: 0.10, h: 0.06, tier: 'Upper', stand: 'North', type: 'Standard' },
    { id: '216', x: 0.36, y: 0.05, w: 0.10, h: 0.06, tier: 'Upper', stand: 'North', type: 'Standard' },
    { id: '217', x: 0.47, y: 0.05, w: 0.10, h: 0.06, tier: 'Upper', stand: 'North', type: 'Standard' },
    { id: '218', x: 0.58, y: 0.05, w: 0.10, h: 0.06, tier: 'Upper', stand: 'North', type: 'Standard' },
    { id: '219', x: 0.69, y: 0.05, w: 0.066, h: 0.06, tier: 'Upper', stand: 'North', type: 'Standard' },

    // WEST Upper
    { id: '208', x: 0.04, y: 0.28, w: 0.065, h: 0.09, tier: 'Upper', stand: 'West', type: 'Standard' },
    { id: '209', x: 0.04, y: 0.38, w: 0.065, h: 0.09, tier: 'Upper', stand: 'West', type: 'Standard' },
    { id: '210', x: 0.04, y: 0.48, w: 0.065, h: 0.09, tier: 'Upper', stand: 'West', type: 'Standard' },
    { id: '211', x: 0.04, y: 0.58, w: 0.065, h: 0.09, tier: 'Upper', stand: 'West', type: 'Standard' },

    // EAST Upper
    { id: '228', x: 0.89, y: 0.28, w: 0.065, h: 0.09, tier: 'Upper', stand: 'East', type: 'Standard' },
    { id: '229', x: 0.89, y: 0.38, w: 0.065, h: 0.09, tier: 'Upper', stand: 'East', type: 'Standard' },
    { id: '230', x: 0.89, y: 0.45, w: 0.065, h: 0.09, tier: 'Upper', stand: 'East', type: 'Premium' },
    { id: '231', x: 0.89, y: 0.58, w: 0.065, h: 0.09, tier: 'Upper', stand: 'East', type: 'Standard' },
  ];

  // Points of interest
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
    'Standard':   { fill: '#e5e7eb', stroke: '#9ca3af', label: '#374151' },
    'Category 1': { fill: '#dbeafe', stroke: '#60a5fa', label: '#1e40af' },
    'Category 2': { fill: '#e0e7ff', stroke: '#818cf8', label: '#3730a3' },
    'VIP':        { fill: '#fef3c7', stroke: '#f59e0b', label: '#92400e' },
    'Premium':    { fill: '#fce7f3', stroke: '#ec4899', label: '#9d174d' },
  };

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    resize();

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    window.addEventListener('resize', () => { resize(); draw(); });

    draw();
  }

  function resize() {
    const container = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    width = container.clientWidth;
    height = Math.max(420, width * 0.58);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Pre-calculate pixel positions
    sections = sectionDefs.map(s => ({
      ...s,
      px: s.x * width,
      py: s.y * height,
      pw: s.w * width,
      ph: s.h * height,
    }));

    pois = poiDefs.map(p => ({
      ...p,
      px: p.x * width,
      py: p.y * height,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, width, height);

    // Draw concourse (gray ring between upper and lower)
    drawConcourse();

    // Draw sections
    sections.forEach(s => drawSection(s));

    // Draw pitch
    drawPitch();

    // Draw POIs
    pois.forEach(p => drawPOI(p));

    // Stand labels
    drawStandLabels();
  }

  function drawConcourse() {
    // Outer boundary
    ctx.fillStyle = '#f3f4f6';
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1.5;

    // Outer rectangle (entire stadium footprint)
    const ox = width * 0.02;
    const oy = height * 0.02;
    const ow = width * 0.96;
    const oh = height * 0.96;
    ctx.beginPath();
    ctx.roundRect(ox, oy, ow, oh, 8);
    ctx.fill();
    ctx.stroke();
  }

  function drawPitch() {
    const px = width * 0.24;
    const py = height * 0.23;
    const pw = width * 0.50;
    const ph = height * 0.50;
    const r = 4;

    // Pitch background
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, r);
    ctx.fill();

    // Pitch markings
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 1.2;

    // Outline
    const inset = 6;
    ctx.strokeRect(px + inset, py + inset, pw - inset * 2, ph - inset * 2);

    // Center line (horizontal)
    ctx.beginPath();
    ctx.moveTo(px + inset, py + ph / 2);
    ctx.lineTo(px + pw - inset, py + ph / 2);
    ctx.stroke();

    // Center circle
    const cr = Math.min(pw, ph) * 0.09;
    ctx.beginPath();
    ctx.arc(px + pw / 2, py + ph / 2, cr, 0, Math.PI * 2);
    ctx.stroke();

    // Center dot
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath();
    ctx.arc(px + pw / 2, py + ph / 2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Penalty areas (top and bottom)
    const penW = pw * 0.36;
    const penH = ph * 0.13;
    ctx.strokeRect(px + (pw - penW) / 2, py + inset, penW, penH);
    ctx.strokeRect(px + (pw - penW) / 2, py + ph - inset - penH, penW, penH);

    // Goal areas
    const goalW = pw * 0.18;
    const goalH = ph * 0.055;
    ctx.strokeRect(px + (pw - goalW) / 2, py + inset, goalW, goalH);
    ctx.strokeRect(px + (pw - goalW) / 2, py + ph - inset - goalH, goalW, goalH);

    // Branding
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.font = `bold ${Math.max(10, width * 0.016)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('FIFA WORLD CUP 2026™', px + pw / 2, py + ph / 2);
  }

  function drawSection(s) {
    const isHighlighted = highlightedSection === s.id;
    const isHovered = hoveredSection === s.id;

    const colors = typeColors[s.type] || typeColors['Standard'];

    let fillColor = colors.fill;
    let strokeColor = colors.stroke;
    let labelColor = colors.label;

    if (isHighlighted) {
      fillColor = '#56042c';
      strokeColor = '#3d0220';
      labelColor = '#ffffff';
    } else if (isHovered) {
      // Darken slightly on hover
      fillColor = s.type === 'Standard' ? '#d1d5db' : colors.fill;
      strokeColor = '#56042c';
    }

    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = isHighlighted ? 2.5 : isHovered ? 2 : 1;

    ctx.beginPath();
    ctx.roundRect(s.px, s.py, s.pw, s.ph, 3);
    ctx.fill();
    ctx.stroke();

    // Section label
    ctx.fillStyle = labelColor;
    const fontSize = Math.max(7, Math.min(s.pw, s.ph) * 0.32);
    ctx.font = `600 ${fontSize}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.id, s.px + s.pw / 2, s.py + s.ph / 2);
  }

  function drawPOI(p) {
    const size = Math.max(12, width * 0.018);
    ctx.font = `${size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.emoji, p.px, p.py);
  }

  function drawStandLabels() {
    ctx.fillStyle = '#6b7280';
    const fontSize = Math.max(9, width * 0.011);
    ctx.font = `600 ${fontSize}px Inter, sans-serif`;
    ctx.textAlign = 'center';

    // North / South
    ctx.fillText('NORTH STAND', width * 0.49, height * 0.123);
    ctx.fillText('SOUTH STAND', width * 0.49, height * 0.92);

    // West / East (rotated)
    ctx.save();
    ctx.translate(width * 0.115, height * 0.48);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('WEST STAND', 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(width * 0.88, height * 0.48);
    ctx.rotate(Math.PI / 2);
    ctx.fillText('EAST STAND', 0, 0);
    ctx.restore();
  }

  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let found = null;
    for (const s of sections) {
      if (mx >= s.px && mx <= s.px + s.pw && my >= s.py && my <= s.py + s.ph) {
        found = s.id;
        break;
      }
    }

    if (found !== hoveredSection) {
      hoveredSection = found;
      canvas.style.cursor = found ? 'pointer' : 'default';

      // Update tooltip
      if (found) {
        const s = sections.find(sec => sec.id === found);
        canvas.title = `Section ${s.id} — ${s.tier} Tier, ${s.stand} Stand (${s.type})`;
      } else {
        canvas.title = '';
      }

      draw();
    }
  }

  function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (const s of sections) {
      if (mx >= s.px && mx <= s.px + s.pw && my >= s.py && my <= s.py + s.ph) {
        highlightSection(s.id);
        document.dispatchEvent(new CustomEvent('section-click', { detail: s }));
        return;
      }
    }
  }

  function highlightSection(sectionId) {
    highlightedSection = sectionId;
    draw();
  }

  function clearHighlight() {
    highlightedSection = null;
    draw();
  }

  function searchLocation(query) {
    const q = query.toLowerCase().replace(/\s+/g, '');

    // Search sections by ID
    for (const s of sectionDefs) {
      if (s.id.toLowerCase().replace(/\s+/g, '') === q ||
          ('section' + s.id.toLowerCase()) === q ||
          ('sec' + s.id.toLowerCase()) === q) {
        highlightSection(s.id);
        return { type: 'section', data: s };
      }
    }

    // Search gates
    const gateMatch = query.match(/gate\s*(\d+)/i);
    if (gateMatch) {
      const poi = poiDefs.find(p => p.id === `gate-${gateMatch[1]}`);
      if (poi) return { type: 'poi', data: poi };
    }

    // Search POIs by keyword
    for (const p of poiDefs) {
      if (p.label.toLowerCase().includes(query.toLowerCase()) ||
          p.type.toLowerCase().includes(query.toLowerCase())) {
        return { type: 'poi', data: p };
      }
    }

    return null;
  }

  return {
    init,
    draw,
    highlightSection,
    clearHighlight,
    searchLocation,
  };

})();
