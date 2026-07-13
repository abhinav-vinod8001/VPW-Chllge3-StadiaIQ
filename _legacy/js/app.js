/* ============================================
   StadiumAI — Main App Controller
   ============================================ */

const App = (() => {

  let currentSection = 'home';

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'matches', label: 'Matches & Venues', icon: '⚽' },
    { id: 'route', label: 'Route & Traffic', icon: '🗺️' },
    { id: 'navigation', label: 'Stadium Map', icon: '🧭' },
    { id: 'crowd', label: 'Crowd Heatmap', icon: '👥' },
    { id: 'transport', label: 'Transport Hub', icon: '🚇' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿' },
    { id: 'sustainability', label: 'Sustainability', icon: '🌱' },
    { id: 'operations', label: 'Operations', icon: '📊' },
  ];

  function init() {
    bindNavigation();
    bindSidebarToggle();
    bindChatToggle();
    bindMapSearch();
    bindMatchSearch();

    // Initialize chat
    Chat.init();

    // Render home live match + upcoming
    renderHomeLiveMatch();
    renderHomeUpcomingMatches();

    // Populate venue selector
    populateVenueSelector();

    // Navigate to initial section
    const hash = window.location.hash.slice(1) || 'home';
    navigateTo(hash);

    // Update header with current live match venue
    updateHeaderVenue();

    // Welcome toast
    setTimeout(() => {
      showToast('👋', 'Welcome to StadiumAI', 'Your AI-powered FIFA World Cup 2026 companion is ready.');
    }, 1000);
  }

  // ---- Navigation ----

  function bindNavigation() {
    document.querySelectorAll('.sidebar__nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const section = item.dataset.section;
        if (section) navigateTo(section);
        if (window.innerWidth <= 768) {
          document.querySelector('.sidebar').classList.remove('open');
        }
      });
    });
    window.addEventListener('hashchange', () => {
      navigateTo(window.location.hash.slice(1) || 'home');
    });
  }

  function navigateTo(sectionId) {
    if (!document.getElementById('section-' + sectionId)) return;

    currentSection = sectionId;
    window.location.hash = sectionId;

    document.querySelectorAll('.sidebar__nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.section === sectionId);
    });

    document.querySelectorAll('.section').forEach(section => {
      section.classList.toggle('active', section.id === 'section-' + sectionId);
    });

    const nav = navItems.find(n => n.id === sectionId);
    const breadcrumb = document.querySelector('.main__breadcrumb');
    if (breadcrumb && nav) {
      breadcrumb.innerHTML = `StadiumAI / <span>${nav.label}</span>`;
    }

    initSection(sectionId);
    Chat.setSection(sectionId);
  }

  function initSection(sectionId) {
    switch (sectionId) {
      case 'matches':
        renderMatchList();
        break;

      case 'route':
        RouteNavigation.init(getSelectedVenueId());
        break;

      case 'navigation':
        const mapCanvas = document.getElementById('stadium-map-canvas');
        if (mapCanvas && !mapCanvas.dataset.initialized) {
          StadiumMap.init(mapCanvas);
          mapCanvas.dataset.initialized = 'true';
        }
        break;

      case 'crowd':
        const heatmapCanvas = document.getElementById('crowd-heatmap-canvas');
        if (heatmapCanvas && !heatmapCanvas.dataset.initialized) {
          CrowdHeatmap.init(heatmapCanvas);
          heatmapCanvas.dataset.initialized = 'true';
        }
        break;

      case 'transport':
        Transport.init();
        break;

      case 'sustainability':
        Sustainability.init();
        break;

      case 'operations':
        OpsDashboard.init();
        break;

      case 'accessibility':
        initAccessibility();
        break;
    }
  }

  // ---- Matches ----

  function renderMatchList(filterText, filterRound, filterStatus) {
    const container = document.getElementById('matches-list');
    if (!container) return;

    let matches = MatchData.matches;

    // Apply filters
    if (filterText) {
      matches = MatchData.searchMatches(filterText);
    }
    if (filterRound) {
      matches = matches.filter(m => m.round === filterRound);
    }
    if (filterStatus) {
      matches = matches.filter(m => m.status === filterStatus);
    }

    // Sort: live first, then upcoming, then completed
    const order = { live: 0, upcoming: 1, completed: 2 };
    matches.sort((a, b) => (order[a.status] ?? 3) - (order[b.status] ?? 3) || new Date(a.date) - new Date(b.date));

    if (matches.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">🔍</div>
          <div class="empty-state__title">No matches found</div>
          <div class="empty-state__text">Try adjusting your search or filters.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = matches.map(match => {
      const venue = MatchData.getVenue(match.venue);
      const status = MatchData.getMatchStatus(match);
      const isLive = match.status === 'live';
      const isCompleted = match.status === 'completed';

      return `
        <div class="card hover-lift" style="${isLive ? 'border-left: 4px solid var(--color-danger);' : ''}">
          <div class="card__body" style="padding: var(--space-4) var(--space-5);">
            <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: var(--space-3);">
              <div style="flex: 1; min-width: 250px;">
                <div class="flex items-center gap-2" style="margin-bottom: var(--space-2);">
                  <span class="badge badge--${isLive ? 'danger' : isCompleted ? 'success' : 'info'}">
                    ${isLive ? '<span class="badge__dot"></span> ' : ''}${match.round}
                  </span>
                  <span class="text-xs text-muted">${MatchData.formatDate(match.date)}</span>
                </div>
                <div style="font-size: var(--font-size-xl); font-weight: 800;">
                  ${match.teamA}
                  <span class="text-muted" style="font-weight: 400; font-size: var(--font-size-base);"> 
                    ${isCompleted ? match.scoreA + ' - ' + match.scoreB : isLive ? 'vs' : match.time + ' ET'}
                  </span>
                  ${match.teamB}
                </div>
                ${match.note ? `<div class="text-xs text-muted" style="margin-top: 2px;">📝 ${match.note}</div>` : ''}
              </div>
              <div style="text-align: right; min-width: 180px;">
                <div class="text-sm font-semibold">${venue ? venue.name : 'TBD'}</div>
                <div class="text-xs text-muted">${venue ? venue.city : ''}</div>
                ${venue ? `
                  <div class="flex gap-2" style="margin-top: var(--space-2); justify-content: flex-end;">
                    <button class="btn btn--sm btn--outline" onclick="App.goToVenueRoute('${match.venue}')">📍 Directions</button>
                    ${isLive ? '<button class="btn btn--sm btn--primary" onclick="App.navigateTo(\'navigation\')">🧭 Stadium Map</button>' : ''}
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function bindMatchSearch() {
    const searchInput = document.getElementById('match-search');
    const roundFilter = document.getElementById('match-filter-round');
    const statusFilter = document.getElementById('match-filter-status');

    const doFilter = () => {
      renderMatchList(
        searchInput?.value.trim() || '',
        roundFilter?.value || '',
        statusFilter?.value || ''
      );
    };

    searchInput?.addEventListener('input', doFilter);
    roundFilter?.addEventListener('change', doFilter);
    statusFilter?.addEventListener('change', doFilter);
  }

  function goToVenueRoute(venueId) {
    const select = document.getElementById('route-venue-select');
    if (select) select.value = venueId;
    navigateTo('route');
    RouteNavigation.setVenue(venueId);
  }

  // ---- Home Page ----

  function renderHomeLiveMatch() {
    const container = document.getElementById('home-live-match');
    if (!container) return;

    const live = MatchData.getLiveMatch();
    if (!live) {
      container.style.display = 'none';
      return;
    }

    const venue = MatchData.getVenue(live.venue);

    container.innerHTML = `
      <div class="card__body">
        <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: var(--space-4);">
          <div>
            <div class="flex items-center gap-2" style="margin-bottom: var(--space-2);">
              <span class="badge badge--danger"><span class="badge__dot"></span> LIVE NOW</span>
              <span class="text-xs text-muted">${live.round}</span>
            </div>
            <div style="font-size: var(--font-size-2xl); font-weight: 800; margin-top: var(--space-2);">
              ${live.teamA} <span class="text-muted" style="font-weight: 400; font-size: var(--font-size-lg);"> vs </span> ${live.teamB}
            </div>
            <div class="text-sm text-secondary" style="margin-top: var(--space-1);">
              🏟️ ${venue ? venue.name + ', ' + venue.city : 'TBD'} • ⏰ ${live.time} ET • 📅 ${MatchData.formatDate(live.date)}
            </div>
          </div>
          <div class="flex gap-2">
            <button class="btn btn--outline btn--sm" onclick="App.goToVenueRoute('${live.venue}')">📍 Directions</button>
            <button class="btn btn--primary btn--sm" onclick="App.navigateTo('navigation')">🧭 Stadium Map</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderHomeUpcomingMatches() {
    const container = document.getElementById('home-upcoming-matches');
    if (!container) return;

    const upcoming = MatchData.getUpcomingMatches().slice(0, 4);

    container.innerHTML = upcoming.map(match => {
      const venue = MatchData.getVenue(match.venue);
      return `
        <div class="list-item">
          <div class="list-item__icon" style="background: var(--color-info-bg);">⚽</div>
          <div class="list-item__content">
            <div class="list-item__title">${match.teamA} vs ${match.teamB}</div>
            <div class="list-item__subtitle">${match.round} • ${MatchData.formatDate(match.date)} • ${match.time} ET</div>
            <div class="list-item__subtitle">${venue ? '🏟️ ' + venue.name + ', ' + venue.city : ''}</div>
          </div>
          <button class="btn btn--sm btn--outline" onclick="App.goToVenueRoute('${match.venue}')">📍</button>
        </div>
      `;
    }).join('');
  }

  function updateHeaderVenue() {
    const el = document.getElementById('header-live-venue');
    const live = MatchData.getLiveMatch();
    if (el && live) {
      const venue = MatchData.getVenue(live.venue);
      el.textContent = `Live — ${venue ? venue.name : 'Stadium'}`;
    }
  }

  // ---- Route & Venue ----

  function populateVenueSelector() {
    const select = document.getElementById('route-venue-select');
    if (!select) return;

    const allVenues = MatchData.getAllVenues();

    // Group by country
    const usaVenues = allVenues.filter(v => !v.city.includes('Mexico') && !v.city.includes('Canada'));
    const mexVenues = allVenues.filter(v => v.city.includes('Mexico'));
    const canVenues = allVenues.filter(v => v.city.includes('Canada'));

    let html = '<optgroup label="🇺🇸 United States">';
    usaVenues.forEach(v => {
      const isLive = MatchData.getLiveMatch()?.venue === v.id;
      html += `<option value="${v.id}" ${isLive ? 'selected' : ''}>${v.name} — ${v.city}${isLive ? ' (LIVE)' : ''}</option>`;
    });
    html += '</optgroup>';

    if (mexVenues.length) {
      html += '<optgroup label="🇲🇽 Mexico">';
      mexVenues.forEach(v => { html += `<option value="${v.id}">${v.name} — ${v.city}</option>`; });
      html += '</optgroup>';
    }
    if (canVenues.length) {
      html += '<optgroup label="🇨🇦 Canada">';
      canVenues.forEach(v => { html += `<option value="${v.id}">${v.name} — ${v.city}</option>`; });
      html += '</optgroup>';
    }

    select.innerHTML = html;

    select.addEventListener('change', () => {
      RouteNavigation.setVenue(select.value);
    });
  }

  function getSelectedVenueId() {
    const select = document.getElementById('route-venue-select');
    return select?.value || (MatchData.getLiveMatch()?.venue) || 'metlife';
  }

  // ---- Sidebar, Chat, Map Search ----

  function bindSidebarToggle() {
    const toggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (toggle && sidebar) {
      toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        const toggle = document.getElementById('sidebar-toggle');
        if (sidebar && toggle && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
          sidebar.classList.remove('open');
        }
      }
    });
  }

  function bindChatToggle() {
    document.getElementById('chat-toggle-btn')?.addEventListener('click', Chat.toggleChat);
    document.getElementById('chat-backdrop')?.addEventListener('click', Chat.toggleChat);
  }

  function bindMapSearch() {
    const searchInput = document.getElementById('map-search');
    const searchBtn = document.getElementById('map-search-btn');

    if (searchInput && searchBtn) {
      const doSearch = () => {
        const query = searchInput.value.trim();
        if (!query) return;
        const result = StadiumMap.searchLocation(query);
        const resultEl = document.getElementById('map-search-result');

        if (result && resultEl) {
          if (result.type === 'section') {
            resultEl.innerHTML = `
              <div class="alert alert--success" style="margin-top: var(--space-3);">
                <span class="alert__icon">📍</span>
                <div class="alert__content">
                  <div class="alert__title">Found: Section ${result.data.id}</div>
                  <div class="text-xs">${result.data.tier} Tier, ${result.data.stand} Stand — ${result.data.type} seating</div>
                </div>
              </div>
            `;
          } else {
            resultEl.innerHTML = `
              <div class="alert alert--info" style="margin-top: var(--space-3);">
                <span class="alert__icon">${result.data.emoji}</span>
                <div class="alert__content">
                  <div class="alert__title">Found: ${result.data.label}</div>
                  <div class="text-xs">Located on the stadium map above</div>
                </div>
              </div>
            `;
          }
        } else if (resultEl) {
          const aiResponse = AIEngine.generateResponse(query);
          resultEl.innerHTML = `
            <div class="alert alert--info" style="margin-top: var(--space-3);">
              <span class="alert__icon">🤖</span>
              <div class="alert__content">
                <div class="alert__title">AI Response</div>
                <div class="text-xs" style="margin-top: 4px; white-space: pre-line;">${aiResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
              </div>
            </div>
          `;
        }
      };

      searchBtn.addEventListener('click', doSearch);
      searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') doSearch(); });
    }
  }

  // ---- Accessibility ----

  function initAccessibility() {
    const container = document.getElementById('accessibility-content');
    if (!container || container.dataset.initialized) return;
    container.dataset.initialized = 'true';

    const features = [
      {
        icon: '♿', title: 'Wheelchair Access',
        items: [
          'Step-free entry at Gates 1, 2, and 4',
          'Elevators at all 4 corners of the stadium',
          'Designated wheelchair seating in Sections 108, 130, 131',
          'Accessible restrooms at every level',
          'Companion seating next to all wheelchair spaces'
        ]
      },
      {
        icon: '👁️', title: 'Visual Accessibility',
        items: [
          'Audio description on headset channel 2',
          'Large-print programs at info desks',
          'Tactile guide paths from all gates',
          'High-contrast signage throughout',
          'Guide dogs welcome in all areas'
        ]
      },
      {
        icon: '👂', title: 'Hearing Accessibility',
        items: [
          'Hearing loop systems in all seating areas',
          'Sign language interpreters at info desks',
          'Visual alerts and captions on screens',
          'Text-based AI assistance via this app',
          'Quiet zones near Gate 1'
        ]
      },
      {
        icon: '🧠', title: 'Sensory & Cognitive',
        items: [
          'Sensory room near Gate 1, Level 1',
          'Quiet viewing area with reduced noise',
          'Visual schedules and social stories',
          'Trained accessibility stewards at every gate',
          'Low-stimulation rest areas on Level 1'
        ]
      },
    ];

    container.innerHTML = `
      <div class="content-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        ${features.map(f => `
          <div class="card">
            <div class="card__header">
              <div class="flex items-center gap-2">
                <span style="font-size: 1.2rem;">${f.icon}</span>
                <span class="card__title">${f.title}</span>
              </div>
            </div>
            <div class="card__body">
              <ul style="display: flex; flex-direction: column; gap: var(--space-2);">
                ${f.items.map(item => `
                  <li class="flex items-center gap-2 text-sm" style="color: var(--text-secondary);">
                    <span style="color: var(--color-success); flex-shrink: 0;">✓</span> ${item}
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="card" style="margin-top: var(--space-6);">
        <div class="card__header">
          <div class="card__title">🗺️ Accessible Route Planner</div>
          <span class="badge badge--info">AI-Powered</span>
        </div>
        <div class="card__body">
          <div class="flex gap-4" style="flex-wrap: wrap;">
            <div style="flex: 1; min-width: 200px;">
              <label class="text-xs text-muted font-medium" style="display: block; margin-bottom: var(--space-1);">From</label>
              <select id="access-from" class="select" style="width: 100%;">
                <option>Gate 1 (North)</option><option>Gate 2 (East)</option><option>Gate 3 (South)</option><option>Gate 4 (West)</option><option>Main Concourse</option>
              </select>
            </div>
            <div style="flex: 1; min-width: 200px;">
              <label class="text-xs text-muted font-medium" style="display: block; margin-bottom: var(--space-1);">To</label>
              <select id="access-to" class="select" style="width: 100%;">
                <option>Section 108 (Wheelchair)</option><option>Section 130 (VIP Wheelchair)</option><option>Section 131 (VIP Wheelchair)</option><option>Sensory Room</option><option>Accessible Restroom</option><option>First Aid</option>
              </select>
            </div>
            <div style="flex: 0; display: flex; align-items: flex-end;">
              <button class="btn btn--primary" id="access-route-btn">Plan Route</button>
            </div>
          </div>
          <div id="access-route-result" style="margin-top: var(--space-4);"></div>
        </div>
      </div>
    `;

    document.getElementById('access-route-btn')?.addEventListener('click', () => {
      const from = document.getElementById('access-from').value;
      const to = document.getElementById('access-to').value;
      const resultEl = document.getElementById('access-route-result');
      if (resultEl) {
        resultEl.innerHTML = `
          <div class="alert alert--success">
            <span class="alert__icon">✅</span>
            <div class="alert__content">
              <div class="alert__title">Accessible Route Found</div>
              <div style="font-size: var(--font-size-sm); margin-top: var(--space-2);">
                <strong>${from}</strong> → <strong>${to}</strong><br><br>
                1. Enter through ${from} — step-free access available<br>
                2. Follow the tactile path along the main concourse (~120m)<br>
                3. Take the elevator at the nearest corner to Level ${to.includes('VIP') ? '3' : '1'}<br>
                4. Follow accessible signage to your destination<br><br>
                📏 <strong>Distance:</strong> ~${Math.floor(150 + Math.random() * 200)}m &nbsp;|&nbsp;
                ⏱️ <strong>Est. time:</strong> ${Math.floor(3 + Math.random() * 5)} minutes &nbsp;|&nbsp;
                ♿ <strong>Fully step-free route</strong>
              </div>
            </div>
          </div>
        `;
      }
    });
  }

  // ---- Toasts ----

  function showToast(icon, title, message, duration = 5000) {
    const area = document.getElementById('toast-area');
    if (!area) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast__icon">${icon}</span>
      <div class="toast__content">
        <div class="toast__title">${title}</div>
        <div class="toast__message">${message}</div>
      </div>
      <button class="toast__close" onclick="this.closest('.toast').remove()">✕</button>
    `;
    area.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  return {
    init,
    navigateTo,
    showToast,
    goToVenueRoute,
  };

})();

// Boot
document.addEventListener('DOMContentLoaded', App.init);
