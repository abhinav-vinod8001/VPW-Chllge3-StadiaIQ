/* ============================================
   StadiumAI — Crowd Heatmap Visualization
   ============================================ */

const CrowdHeatmap = (() => {

  let canvas, ctx;
  let width, height;
  let zoneData = [];
  let animationFrame = null;

  // Zone definitions matching stadium sections
  const zoneDefs = [
    // South stands
    { id: 'zone-a-left', x: 0.18, y: 0.70, w: 0.18, h: 0.12, label: 'South Left (A1-A4)', capacity: 8000 },
    { id: 'zone-a-right', x: 0.62, y: 0.70, w: 0.18, h: 0.12, label: 'South Right (A5-A9)', capacity: 8000 },

    // North stands
    { id: 'zone-b-left', x: 0.18, y: 0.12, w: 0.18, h: 0.12, label: 'North Left (B1-B4)', capacity: 8000 },
    { id: 'zone-b-right', x: 0.62, y: 0.12, w: 0.18, h: 0.12, label: 'North Right (B5-B9)', capacity: 8000 },

    // West stands
    { id: 'zone-c-upper', x: 0.06, y: 0.22, w: 0.12, h: 0.20, label: 'West Upper (C1-C3)', capacity: 6000 },
    { id: 'zone-c-lower', x: 0.06, y: 0.52, w: 0.12, h: 0.20, label: 'West Lower (C4-C6)', capacity: 6000 },

    // East stands
    { id: 'zone-d-upper', x: 0.80, y: 0.22, w: 0.12, h: 0.20, label: 'East Upper (D1-D3)', capacity: 6000 },
    { id: 'zone-d-lower', x: 0.80, y: 0.52, w: 0.12, h: 0.20, label: 'East Lower (D4-D6)', capacity: 6000 },

    // Concourses
    { id: 'concourse-north', x: 0.30, y: 0.05, w: 0.38, h: 0.06, label: 'North Concourse', capacity: 5000 },
    { id: 'concourse-south', x: 0.30, y: 0.85, w: 0.38, h: 0.06, label: 'South Concourse', capacity: 5000 },

    // VIP center
    { id: 'zone-vip', x: 0.38, y: 0.42, w: 0.22, h: 0.12, label: 'VIP Area', capacity: 4000 },
  ];

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    generateData();
    resize();

    window.addEventListener('resize', () => { resize(); draw(); });
    canvas.addEventListener('mousemove', handleHover);

    draw();
    startAutoUpdate();
  }

  function resize() {
    const container = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    width = container.clientWidth;
    height = Math.max(350, width * 0.5);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function generateData() {
    zoneData = zoneDefs.map(zone => ({
      ...zone,
      current: Math.floor(zone.capacity * (0.4 + Math.random() * 0.55)),
      trend: Math.random() > 0.5 ? 'increasing' : 'stable',
    }));
  }

  function getDensityColor(ratio) {
    if (ratio < 0.5) return { fill: 'rgba(22, 163, 74, 0.35)', stroke: '#16a34a', level: 'Low' };
    if (ratio < 0.7) return { fill: 'rgba(234, 140, 0, 0.30)', stroke: '#ea8c00', level: 'Moderate' };
    if (ratio < 0.85) return { fill: 'rgba(234, 88, 12, 0.35)', stroke: '#ea580c', level: 'High' };
    return { fill: 'rgba(220, 38, 38, 0.40)', stroke: '#dc2626', level: 'Critical' };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, width, height);

    // Draw stadium outline
    drawStadiumOutline();

    // Draw pitch
    drawPitch();

    // Draw heatmap zones
    zoneData.forEach(zone => drawZone(zone));

    // Title
    ctx.fillStyle = '#111827';
    ctx.font = `bold ${Math.max(11, width * 0.014)}px Inter, sans-serif`;
    ctx.textAlign = 'left';
  }

  function drawStadiumOutline() {
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    // Elliptical outline
    const cx = width * 0.49;
    const cy = height * 0.48;
    const rx = width * 0.44;
    const ry = height * 0.44;

    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawPitch() {
    const px = width * 0.25;
    const py = height * 0.26;
    const pw = width * 0.48;
    const ph = height * 0.44;

    ctx.fillStyle = '#dcfce7';
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 4);
    ctx.fill();
    ctx.stroke();

    // Center line & circle
    ctx.strokeStyle = '#86efac';
    ctx.beginPath();
    ctx.moveTo(px, py + ph / 2);
    ctx.lineTo(px + pw, py + ph / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(px + pw / 2, py + ph / 2, Math.min(pw, ph) * 0.08, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#9ca3af';
    ctx.font = `${Math.max(9, width * 0.011)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('PITCH', px + pw / 2, py + ph / 2 + 4);
  }

  function drawZone(zone) {
    const ratio = zone.current / zone.capacity;
    const colors = getDensityColor(ratio);

    const zx = zone.x * width;
    const zy = zone.y * height;
    const zw = zone.w * width;
    const zh = zone.h * height;

    // Zone fill
    ctx.fillStyle = colors.fill;
    ctx.strokeStyle = colors.stroke;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(zx, zy, zw, zh, 4);
    ctx.fill();
    ctx.stroke();

    // Zone label
    ctx.fillStyle = '#374151';
    ctx.font = `${Math.max(8, width * 0.009)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const labelText = zone.label.split('(')[0].trim();
    ctx.fillText(labelText, zx + zw / 2, zy + zh / 2 - 7);

    // Percentage
    ctx.fillStyle = colors.stroke;
    ctx.font = `bold ${Math.max(10, width * 0.012)}px Inter, sans-serif`;
    ctx.fillText(Math.round(ratio * 100) + '%', zx + zw / 2, zy + zh / 2 + 8);
  }

  function handleHover(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let tooltip = null;
    for (const zone of zoneData) {
      const zx = zone.x * width;
      const zy = zone.y * height;
      const zw = zone.w * width;
      const zh = zone.h * height;

      if (mx >= zx && mx <= zx + zw && my >= zy && my <= zy + zh) {
        const ratio = zone.current / zone.capacity;
        tooltip = `${zone.label}: ${zone.current.toLocaleString()} / ${zone.capacity.toLocaleString()} (${Math.round(ratio * 100)}%) — ${getDensityColor(ratio).level}`;
        break;
      }
    }

    canvas.title = tooltip || '';
    canvas.style.cursor = tooltip ? 'pointer' : 'default';
  }

  function startAutoUpdate() {
    setInterval(() => {
      // Simulate small crowd changes
      zoneData.forEach(zone => {
        const change = Math.floor((Math.random() - 0.45) * zone.capacity * 0.02);
        zone.current = Math.max(0, Math.min(zone.capacity, zone.current + change));
        zone.trend = change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable';
      });
      draw();
      updateStatsPanel();
    }, 5000);
  }

  function updateStatsPanel() {
    const totalCapacity = zoneData.reduce((sum, z) => sum + z.capacity, 0);
    const totalCurrent = zoneData.reduce((sum, z) => sum + z.current, 0);
    const overallPercent = Math.round((totalCurrent / totalCapacity) * 100);

    const el = document.getElementById('crowd-total');
    if (el) el.textContent = totalCurrent.toLocaleString();

    const pctEl = document.getElementById('crowd-percent');
    if (pctEl) pctEl.textContent = overallPercent + '%';

    // Find busiest and quietest zones
    let busiest = zoneData[0], quietest = zoneData[0];
    zoneData.forEach(z => {
      if (z.current / z.capacity > busiest.current / busiest.capacity) busiest = z;
      if (z.current / z.capacity < quietest.current / quietest.capacity) quietest = z;
    });

    const bEl = document.getElementById('crowd-busiest');
    if (bEl) bEl.textContent = busiest.label;

    const qEl = document.getElementById('crowd-quietest');
    if (qEl) qEl.textContent = quietest.label;
  }

  function getZoneData() {
    return zoneData;
  }

  function getAIPrediction() {
    const busiest = [...zoneData].sort((a, b) => (b.current / b.capacity) - (a.current / a.capacity))[0];
    const quietest = [...zoneData].sort((a, b) => (a.current / a.capacity) - (b.current / b.capacity))[0];

    return {
      busiest,
      quietest,
      totalCurrent: zoneData.reduce((s, z) => s + z.current, 0),
      totalCapacity: zoneData.reduce((s, z) => s + z.capacity, 0),
      prediction: `${busiest.label} is approaching capacity. Consider redirecting flow to ${quietest.label} which is only at ${Math.round(quietest.current / quietest.capacity * 100)}%.`
    };
  }

  return {
    init,
    draw,
    getZoneData,
    getAIPrediction,
    updateStatsPanel
  };

})();
