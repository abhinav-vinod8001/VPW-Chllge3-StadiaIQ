/* ============================================
   StadiumAI — Sustainability Tracker
   ============================================ */

const Sustainability = (() => {

  const metrics = {
    personal: {
      transport: { value: 1.8, unit: 'kg CO₂', icon: '🚇', label: 'Transport' },
      food: { value: 0.4, unit: 'kg CO₂', icon: '🍔', label: 'Food & Drink' },
      energy: { value: 0.2, unit: 'kg CO₂', icon: '⚡', label: 'Stadium Energy Share' },
    },
    event: {
      totalAttendees: 62400,
      wasteGenerated: 18.7, // tonnes
      wasteRecycled: 68, // percent
      waterUsed: 245000, // liters
      energyUsed: 3200, // kWh
      renewableEnergy: 100, // percent
      carbonOffset: 85, // percent
    },
    comparisons: {
      avgFanFootprint: 3.5, // kg CO₂
      thisMatchTotal: 148000, // kg CO₂
      treesNeeded: 6700,
    }
  };

  const ecoTips = [
    { icon: '🚰', tip: 'Use free water refill stations instead of buying bottled water', impact: 'Saves 0.08 kg CO₂ per bottle' },
    { icon: '♻️', tip: 'Sort your waste into the color-coded bins around the stadium', impact: 'Helps achieve our 75% recycling goal' },
    { icon: '🚇', tip: 'Take public transit home — metro has lowest carbon impact', impact: 'Saves 0.13 kg CO₂ vs rideshare' },
    { icon: '🌿', tip: 'Choose plant-based food options at concession stands', impact: 'Saves up to 0.3 kg CO₂ per meal' },
    { icon: '📱', tip: 'Use your digital ticket — no paper printing needed', impact: 'Saves paper and ink resources' },
    { icon: '💡', tip: 'The stadium uses 100% renewable energy for this tournament', impact: 'Zero direct energy emissions' },
  ];

  function init() {
    renderPersonalFootprint();
    renderEventMetrics();
    renderEcoTips();
    renderProgressRings();
  }

  function renderPersonalFootprint() {
    const container = document.getElementById('personal-footprint');
    if (!container) return;

    const total = Object.values(metrics.personal).reduce((sum, m) => sum + m.value, 0);
    const avgDiff = ((total - metrics.comparisons.avgFanFootprint) / metrics.comparisons.avgFanFootprint * 100).toFixed(0);
    const isBetter = total < metrics.comparisons.avgFanFootprint;

    container.innerHTML = `
      <div style="text-align: center; margin-bottom: var(--space-6);">
        <div class="text-muted text-sm" style="margin-bottom: var(--space-2);">Your Estimated Footprint</div>
        <div style="font-size: 3rem; font-weight: 800; color: var(--text-primary); line-height: 1;">${total.toFixed(1)}</div>
        <div class="text-sm text-secondary" style="margin-top: var(--space-1);">kg CO₂ today</div>
        <div style="margin-top: var(--space-3);">
          <span class="badge ${isBetter ? 'badge--success' : 'badge--warning'}">
            ${isBetter ? '↓' : '↑'} ${Math.abs(avgDiff)}% ${isBetter ? 'below' : 'above'} average fan
          </span>
        </div>
      </div>
      <div class="flex flex-col gap-3">
        ${Object.values(metrics.personal).map(m => {
          const pct = (m.value / total * 100).toFixed(0);
          return `
            <div class="metric-bar">
              <div class="metric-bar__header">
                <span class="metric-bar__label">${m.icon} ${m.label}</span>
                <span class="metric-bar__value">${m.value} ${m.unit} (${pct}%)</span>
              </div>
              <div class="metric-bar__track">
                <div class="metric-bar__fill metric-bar__fill--success" style="width: ${pct}%;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderEventMetrics() {
    const container = document.getElementById('event-metrics');
    if (!container) return;

    const m = metrics.event;
    const stats = [
      { label: 'Waste Generated', value: m.wasteGenerated + ' tonnes', icon: '🗑️', color: 'warning' },
      { label: 'Waste Recycled', value: m.wasteRecycled + '%', icon: '♻️', color: 'success' },
      { label: 'Water Used', value: (m.waterUsed / 1000).toFixed(0) + 'k liters', icon: '💧', color: 'info' },
      { label: 'Energy Used', value: m.energyUsed.toLocaleString() + ' kWh', icon: '⚡', color: 'gold' },
      { label: 'Renewable Energy', value: m.renewableEnergy + '%', icon: '🌿', color: 'success' },
      { label: 'Carbon Offset', value: m.carbonOffset + '%', icon: '🌍', color: 'success' },
    ];

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--space-4);">
        ${stats.map(s => `
          <div style="text-align: center; padding: var(--space-4); background: var(--color-gray-50); border-radius: var(--radius-md);">
            <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">${s.icon}</div>
            <div class="text-lg font-bold">${s.value}</div>
            <div class="text-xs text-muted">${s.label}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderEcoTips() {
    const container = document.getElementById('eco-tips');
    if (!container) return;

    container.innerHTML = ecoTips.map(tip => `
      <div class="list-item">
        <div class="list-item__icon" style="background: var(--color-success-bg);">
          ${tip.icon}
        </div>
        <div class="list-item__content">
          <div class="list-item__title">${tip.tip}</div>
          <div class="list-item__subtitle">${tip.impact}</div>
        </div>
      </div>
    `).join('');
  }

  function renderProgressRings() {
    const container = document.getElementById('sustainability-rings');
    if (!container) return;

    const rings = [
      { label: 'Recycling Rate', value: metrics.event.wasteRecycled, target: 75, color: '#16a34a' },
      { label: 'Carbon Offset', value: metrics.event.carbonOffset, target: 100, color: '#2563eb' },
      { label: 'Renewable Energy', value: metrics.event.renewableEnergy, target: 100, color: '#d4a843' },
    ];

    container.innerHTML = rings.map(ring => {
      const radius = 45;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (ring.value / 100) * circumference;

      return `
        <div style="text-align: center;">
          <div class="progress-ring">
            <svg width="110" height="110" class="progress-ring__circle">
              <circle cx="55" cy="55" r="${radius}" fill="none" stroke="var(--color-gray-200)" stroke-width="8"/>
              <circle cx="55" cy="55" r="${radius}"
                fill="none" stroke="${ring.color}" stroke-width="8"
                stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
                stroke-linecap="round" style="transition: stroke-dashoffset 1s ease;"/>
            </svg>
            <span class="progress-ring__text">${ring.value}%</span>
          </div>
          <div class="text-sm font-medium" style="margin-top: var(--space-2);">${ring.label}</div>
          <div class="text-xs text-muted">Target: ${ring.target}%</div>
        </div>
      `;
    }).join('');
  }

  return {
    init,
    metrics,
    ecoTips,
  };

})();
