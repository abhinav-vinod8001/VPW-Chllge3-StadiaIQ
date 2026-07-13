/* ============================================
   StadiumAI — Route Navigation & Traffic
   ============================================ */

const RouteNavigation = (() => {

  let currentVenueId = 'metlife';

  function init(venueId) {
    currentVenueId = venueId || 'metlife';
    renderRoutePanel();
    renderTrafficPanel();
    renderVenueInfo();
  }

  function renderRoutePanel() {
    const container = document.getElementById('route-options');
    if (!container) return;

    const venue = MatchData.getVenue(currentVenueId);
    if (!venue) return;

    const routes = [
      {
        mode: 'driving', icon: '🚗', label: 'Drive',
        duration: `${25 + Math.floor(Math.random() * 20)} min`,
        distance: `${8 + Math.floor(Math.random() * 15)} miles`,
        note: 'Expect delays near stadium',
        cost: '$' + (5 + Math.floor(Math.random() * 10)) + ' (parking)',
        carbon: '2.4 kg CO₂',
        mapsUrl: MatchData.getGoogleMapsUrl(currentVenueId),
      },
      {
        mode: 'transit', icon: '🚇', label: 'Public Transit',
        duration: `${35 + Math.floor(Math.random() * 25)} min`,
        distance: venue.transit[0],
        note: 'Recommended — avoids traffic',
        cost: '$2.75',
        carbon: '0.3 kg CO₂',
        mapsUrl: MatchData.getGoogleMapsTransitUrl(currentVenueId),
      },
      {
        mode: 'rideshare', icon: '🚕', label: 'Rideshare / Taxi',
        duration: `${20 + Math.floor(Math.random() * 15)} min`,
        distance: 'Door to drop-off zone',
        note: 'Surge pricing likely on match day (2-3x)',
        cost: '$25-$55',
        carbon: '2.1 kg CO₂',
        mapsUrl: MatchData.getGoogleMapsUrl(currentVenueId),
      },
      {
        mode: 'shuttle', icon: '🚌', label: 'Event Shuttle',
        duration: `${40 + Math.floor(Math.random() * 15)} min`,
        distance: 'From designated pick-up points',
        note: 'Free FIFA shuttle from downtown',
        cost: 'Free',
        carbon: '0.5 kg CO₂',
        mapsUrl: '#',
      },
    ];

    container.innerHTML = routes.map((route, i) => `
      <div class="card hover-lift ${i === 1 ? '' : ''}">
        <div class="card__body" style="padding: var(--space-4) var(--space-5);">
          <div class="flex items-center justify-between" style="margin-bottom: var(--space-3);">
            <div class="flex items-center gap-3">
              <span style="font-size: 1.5rem;">${route.icon}</span>
              <div>
                <div class="text-sm font-bold">${route.label}</div>
                <div class="text-xs text-secondary">${route.distance}</div>
              </div>
            </div>
            <div style="text-align: right;">
              <div class="text-lg font-bold" style="color: var(--color-primary);">${route.duration}</div>
              ${i === 1 ? '<span class="badge badge--success" style="margin-top: 2px;"><span class="badge__dot"></span> Best</span>' : ''}
            </div>
          </div>
          <div class="text-xs text-secondary" style="margin-bottom: var(--space-3); padding: var(--space-2) var(--space-3); background: var(--color-gray-50); border-radius: var(--radius-sm);">
            💡 ${route.note}
          </div>
          <div class="flex justify-between items-center">
            <div class="flex gap-4">
              <span class="text-xs text-muted">Cost: <strong class="text-primary">${route.cost}</strong></span>
              <span class="text-xs text-muted">CO₂: <strong class="text-primary">${route.carbon}</strong></span>
            </div>
            ${route.mapsUrl !== '#' ? `<a href="${route.mapsUrl}" target="_blank" rel="noopener" class="btn btn--sm btn--primary">Open Maps ↗</a>` : '<span class="text-xs text-muted">See info desk</span>'}
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderTrafficPanel() {
    const container = document.getElementById('traffic-conditions');
    if (!container) return;

    const traffic = MatchData.getTraffic(currentVenueId);
    const venue = MatchData.getVenue(currentVenueId);

    container.innerHTML = `
      <div class="card__header" style="padding: var(--space-4) var(--space-5);">
        <div class="flex items-center gap-2">
          <span class="card__title">🚦 Live Traffic Near ${venue ? venue.name : 'Stadium'}</span>
          <span class="live-dot"></span>
        </div>
        <span class="badge badge--warning"><span class="badge__dot"></span> Match Day</span>
      </div>
      <div class="card__body card__body--flush">
        ${traffic.map(t => `
          <div class="list-item">
            <div class="list-item__icon" style="background: var(--color-${t.color}-bg); width: 36px; height: 36px;">
              ${t.status === 'heavy' ? '🔴' : t.status === 'moderate' ? '🟡' : '🟢'}
            </div>
            <div class="list-item__content">
              <div class="list-item__title">${t.road}</div>
              <div class="list-item__subtitle">+${t.delay} min delay</div>
            </div>
            <span class="badge badge--${t.color}">
              <span class="badge__dot"></span> ${t.status.charAt(0).toUpperCase() + t.status.slice(1)}
            </span>
          </div>
        `).join('')}
      </div>
      <div class="card__footer">
        <div class="flex justify-between items-center">
          <span class="text-xs text-muted">Traffic data simulated for demo • Updates every 2 min</span>
          <a href="${MatchData.getGoogleMapsUrl(currentVenueId)}" target="_blank" rel="noopener" class="btn btn--sm btn--outline">View Full Traffic Map ↗</a>
        </div>
      </div>
    `;
  }

  function renderVenueInfo() {
    const container = document.getElementById('venue-detail-info');
    if (!container) return;

    const venue = MatchData.getVenue(currentVenueId);
    if (!venue) return;

    container.innerHTML = `
      <div class="flex items-center gap-4" style="margin-bottom: var(--space-4); flex-wrap: wrap;">
        <div style="font-size: 2.5rem;">🏟️</div>
        <div style="flex: 1; min-width: 200px;">
          <h3 style="font-size: var(--font-size-xl); margin-bottom: 2px;">${venue.name}</h3>
          <div class="text-sm text-secondary">📍 ${venue.address}</div>
          <div class="text-sm text-secondary" style="margin-top: 2px;">👥 Capacity: ${venue.capacity.toLocaleString()}</div>
        </div>
        <a href="${MatchData.getGoogleMapsUrl(currentVenueId)}" target="_blank" rel="noopener" class="btn btn--primary">
          📍 Get Directions
        </a>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4);">
        <div style="padding: var(--space-3); background: var(--color-gray-50); border-radius: var(--radius-md);">
          <div class="text-xs text-muted font-medium" style="margin-bottom: var(--space-1);">🚇 Public Transit</div>
          ${venue.transit.map(t => `<div class="text-sm">${t}</div>`).join('')}
        </div>
        <div style="padding: var(--space-3); background: var(--color-gray-50); border-radius: var(--radius-md);">
          <div class="text-xs text-muted font-medium" style="margin-bottom: var(--space-1);">🅿️ Parking</div>
          <div class="text-sm">${venue.parking}</div>
        </div>
        <div style="padding: var(--space-3); background: var(--color-gray-50); border-radius: var(--radius-md);">
          <div class="text-xs text-muted font-medium" style="margin-bottom: var(--space-1);">📍 Coordinates</div>
          <div class="text-sm">${venue.lat.toFixed(4)}, ${venue.lng.toFixed(4)}</div>
        </div>
      </div>
    `;

    // Render embedded map
    renderEmbeddedMap(venue);
  }

  function renderEmbeddedMap(venue) {
    const container = document.getElementById('venue-map-embed');
    if (!container) return;

    // OpenStreetMap embed (free, no API key)
    const bbox = `${venue.lng - 0.015},${venue.lat - 0.008},${venue.lng + 0.015},${venue.lat + 0.008}`;
    container.innerHTML = `
      <iframe
        width="100%"
        height="350"
        frameborder="0"
        scrolling="no"
        marginheight="0"
        marginwidth="0"
        src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${venue.lat},${venue.lng}"
        style="border-radius: var(--radius-md); border: var(--border);"
        title="Map showing ${venue.name} location"
        loading="lazy">
      </iframe>
      <div class="flex justify-between items-center" style="margin-top: var(--space-2);">
        <span class="text-xs text-muted">Map: © OpenStreetMap contributors</span>
        <a href="https://www.openstreetmap.org/?mlat=${venue.lat}&mlon=${venue.lng}#map=15/${venue.lat}/${venue.lng}" target="_blank" rel="noopener" class="text-xs" style="color: var(--color-primary);">View larger map ↗</a>
      </div>
    `;
  }

  function setVenue(venueId) {
    currentVenueId = venueId;
    renderRoutePanel();
    renderTrafficPanel();
    renderVenueInfo();
  }

  return {
    init,
    setVenue,
    renderRoutePanel,
    renderTrafficPanel,
  };

})();
