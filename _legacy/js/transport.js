/* ============================================
   StadiumAI — Transport Hub
   ============================================ */

const Transport = (() => {

  const transportModes = [
    {
      id: 'metro',
      name: 'Metro / Subway',
      icon: '🚇',
      stations: [
        { name: 'Stadium North', distance: '5 min walk', nextTrain: 3, frequency: '3 min', line: 'Green Line' },
        { name: 'Stadium East', distance: '8 min walk', nextTrain: 5, frequency: '5 min', line: 'Blue Line' },
      ],
      carbonPerTrip: 0.02,
      avgCost: 2.75,
      rating: 4.5,
      recommended: true,
      postMatchWait: '8-12 min',
    },
    {
      id: 'shuttle',
      name: 'Shuttle Bus',
      icon: '🚌',
      stations: [
        { name: 'Gate A Shuttle Stop', distance: '3 min walk', nextTrain: 8, frequency: '10 min', line: 'Route S1' },
        { name: 'Gate D Shuttle Stop', distance: '2 min walk', nextTrain: 12, frequency: '10 min', line: 'Route S2' },
      ],
      carbonPerTrip: 0.08,
      avgCost: 0,
      rating: 4.0,
      recommended: false,
      postMatchWait: '10-20 min',
    },
    {
      id: 'rideshare',
      name: 'Rideshare',
      icon: '🚗',
      stations: [
        { name: 'Lot C Pick-up Zone', distance: '6 min walk', nextTrain: null, frequency: 'On demand', line: 'Uber/Lyft' },
      ],
      carbonPerTrip: 0.15,
      avgCost: 18.50,
      rating: 3.5,
      recommended: false,
      postMatchWait: '15-30 min',
      surgeMultiplier: 2.3,
    },
    {
      id: 'bicycle',
      name: 'Bike Share',
      icon: '🚲',
      stations: [
        { name: 'Gate A Bike Station', distance: '4 min walk', nextTrain: null, frequency: '12 available', line: 'CityBike' },
        { name: 'Gate D Bike Station', distance: '3 min walk', nextTrain: null, frequency: '8 available', line: 'CityBike' },
      ],
      carbonPerTrip: 0,
      avgCost: 3.50,
      rating: 4.2,
      recommended: false,
      postMatchWait: 'No wait',
    },
    {
      id: 'walk',
      name: 'Walking',
      icon: '🚶',
      stations: [
        { name: 'All Gates', distance: '0 min', nextTrain: null, frequency: 'Always', line: 'Any direction' },
      ],
      carbonPerTrip: 0,
      avgCost: 0,
      rating: 4.8,
      recommended: false,
      postMatchWait: 'No wait',
    }
  ];

  function init() {
    renderTransportCards();
    renderDepartureBoard();
    renderCarbonComparison();
  }

  function renderTransportCards() {
    const container = document.getElementById('transport-cards');
    if (!container) return;

    container.innerHTML = transportModes.map(mode => `
      <div class="card hover-lift" id="transport-${mode.id}">
        <div class="card__header">
          <div class="flex items-center gap-3">
            <span style="font-size: 1.5rem;">${mode.icon}</span>
            <div>
              <div class="card__title">${mode.name}</div>
              <div class="text-xs text-secondary">${mode.recommended ? '✅ Recommended' : ''}</div>
            </div>
          </div>
          ${mode.recommended ? '<span class="badge badge--success"><span class="badge__dot"></span> Best Option</span>' : ''}
        </div>
        <div class="card__body">
          <div class="flex flex-col gap-3">
            ${mode.stations.map(s => `
              <div class="list-item" style="padding: var(--space-2) 0; border-bottom: 1px solid var(--color-gray-100);">
                <div class="list-item__content">
                  <div class="list-item__title">${s.name}</div>
                  <div class="list-item__subtitle">${s.distance} • ${s.line}</div>
                </div>
                <div class="text-sm font-semibold" style="color: var(--color-primary);">
                  ${s.nextTrain ? `${s.nextTrain} min` : s.frequency}
                </div>
              </div>
            `).join('')}
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); margin-top: var(--space-4); padding-top: var(--space-4); border-top: var(--border);">
            <div>
              <div class="text-xs text-muted">Cost</div>
              <div class="text-sm font-semibold">${mode.avgCost === 0 ? 'Free' : '$' + mode.avgCost.toFixed(2)}${mode.surgeMultiplier ? ` <span class="text-danger text-xs">(${mode.surgeMultiplier}x surge)</span>` : ''}</div>
            </div>
            <div>
              <div class="text-xs text-muted">CO₂</div>
              <div class="text-sm font-semibold">${mode.carbonPerTrip === 0 ? '0 kg' : mode.carbonPerTrip + ' kg'}</div>
            </div>
            <div>
              <div class="text-xs text-muted">Post-Match Wait</div>
              <div class="text-sm font-semibold">${mode.postMatchWait}</div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderDepartureBoard() {
    const container = document.getElementById('departure-board');
    if (!container) return;

    const departures = [
      { time: '20:03', destination: 'City Center', line: 'Green Line', platform: '1', status: 'On Time' },
      { time: '20:06', destination: 'Airport Terminal', line: 'Blue Line', platform: '2', status: 'On Time' },
      { time: '20:08', destination: 'Downtown Hub', line: 'Green Line', platform: '1', status: 'On Time' },
      { time: '20:10', destination: 'Central Station', line: 'Route S1', platform: 'Bus', status: 'Delayed (3 min)' },
      { time: '20:12', destination: 'Hotel District', line: 'Route S2', platform: 'Bus', status: 'On Time' },
      { time: '20:15', destination: 'City Center', line: 'Green Line', platform: '1', status: 'On Time' },
    ];

    container.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Destination</th>
            <th>Line</th>
            <th>Platform</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${departures.map(d => `
            <tr>
              <td class="font-semibold">${d.time}</td>
              <td>${d.destination}</td>
              <td><span class="badge badge--info">${d.line}</span></td>
              <td>${d.platform}</td>
              <td>
                <span class="badge ${d.status === 'On Time' ? 'badge--success' : 'badge--warning'}">
                  <span class="badge__dot"></span> ${d.status}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function renderCarbonComparison() {
    const container = document.getElementById('carbon-comparison');
    if (!container) return;

    const maxCarbon = Math.max(...transportModes.map(m => m.carbonPerTrip));

    container.innerHTML = transportModes.map(mode => {
      const pct = maxCarbon > 0 ? (mode.carbonPerTrip / maxCarbon) * 100 : 0;
      const barColor = mode.carbonPerTrip === 0 ? 'var(--color-success)' :
                        mode.carbonPerTrip < 0.05 ? 'var(--color-success)' :
                        mode.carbonPerTrip < 0.1 ? 'var(--color-warning)' : 'var(--color-danger)';
      return `
        <div class="metric-bar" style="margin-bottom: var(--space-3);">
          <div class="metric-bar__header">
            <span class="metric-bar__label">${mode.icon} ${mode.name}</span>
            <span class="metric-bar__value">${mode.carbonPerTrip} kg CO₂</span>
          </div>
          <div class="metric-bar__track">
            <div class="metric-bar__fill" style="width: ${Math.max(pct, 2)}%; background: ${barColor};"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function getRecommendation() {
    return transportModes.find(m => m.recommended) || transportModes[0];
  }

  return {
    init,
    getRecommendation,
    transportModes,
  };

})();
