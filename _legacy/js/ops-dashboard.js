/* ============================================
   StadiumAI — Operational Intelligence Dashboard
   ============================================ */

const OpsDashboard = (() => {

  const opsData = {
    staffing: {
      stewards: { deployed: 342, total: 400, onBreak: 28, available: 30 },
      medical: { deployed: 28, total: 35, onBreak: 4, available: 3 },
      volunteers: { deployed: 156, total: 200, onBreak: 22, available: 22 },
      security: { deployed: 89, total: 100, onBreak: 5, available: 6 },
    },
    queues: {
      'Gate A': { wait: 4, trend: 'stable', staffed: 8 },
      'Gate B': { wait: 7, trend: 'increasing', staffed: 6 },
      'Gate C': { wait: 12, trend: 'increasing', staffed: 6 },
      'Gate D': { wait: 3, trend: 'decreasing', staffed: 8 },
    },
    incidents: [
      { id: 'INC-001', time: '19:23', type: 'Medical', location: 'Section B4', status: 'Resolved', priority: 'Medium' },
      { id: 'INC-002', time: '19:45', type: 'Crowd', location: 'Gate C', status: 'Active', priority: 'High' },
      { id: 'INC-003', time: '19:52', type: 'Facility', location: 'Restroom L2-North', status: 'In Progress', priority: 'Low' },
      { id: 'INC-004', time: '20:01', type: 'Security', location: 'VIP Entrance', status: 'Resolved', priority: 'Medium' },
    ],
    concessions: {
      foodStands: { open: 24, total: 28, avgWait: 6 },
      beverageStands: { open: 18, total: 20, avgWait: 4 },
      merchandise: { open: 8, total: 10, avgWait: 3 },
    },
    aiRecommendations: [
      { priority: 'high', icon: '⚠️', title: 'Deploy additional staff to Gate C', description: 'Queue time exceeding 15-minute threshold. Recommend deploying 3 stewards from Gate D (lowest queue) to Gate C.', action: 'Deploy Staff' },
      { priority: 'high', icon: '👥', title: 'Redirect crowd flow at Section C8', description: 'Section C8 approaching 95% capacity. Redirect incoming fans to Sections C3-C5 which are at 62% capacity.', action: 'Activate Redirect' },
      { priority: 'medium', icon: '🍔', title: 'Increase roaming vendors in D-sections', description: 'Sections D6-D10 show high attendance but low food sales. Deploy 4 additional roaming vendors.', action: 'Assign Vendors' },
      { priority: 'low', icon: '🚪', title: 'Pre-position exit management', description: 'Based on crowd patterns, Gate D will be optimal exit. Pre-position exit management team 10 min before full time.', action: 'Schedule' },
    ]
  };

  function init() {
    renderStaffingMetrics();
    renderQueueStatus();
    renderIncidentLog();
    renderConcessions();
    renderAIRecommendations();
  }

  function renderStaffingMetrics() {
    const container = document.getElementById('ops-staffing');
    if (!container) return;

    const categories = Object.entries(opsData.staffing);

    container.innerHTML = categories.map(([key, data]) => {
      const utilization = Math.round((data.deployed / data.total) * 100);
      const barColor = utilization > 90 ? 'danger' : utilization > 75 ? 'warning' : 'success';
      const label = key.charAt(0).toUpperCase() + key.slice(1);

      return `
        <div style="padding: var(--space-4); background: var(--color-gray-50); border-radius: var(--radius-md);">
          <div class="flex justify-between items-center" style="margin-bottom: var(--space-3);">
            <span class="text-sm font-semibold">${label}</span>
            <span class="badge badge--${barColor}">${utilization}%</span>
          </div>
          <div class="metric-bar" style="margin-bottom: var(--space-2);">
            <div class="metric-bar__track" style="height: 8px;">
              <div class="metric-bar__fill metric-bar__fill--${barColor}" style="width: ${utilization}%;"></div>
            </div>
          </div>
          <div class="flex justify-between text-xs text-muted">
            <span>Deployed: ${data.deployed}/${data.total}</span>
            <span>Break: ${data.onBreak} | Available: ${data.available}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderQueueStatus() {
    const container = document.getElementById('ops-queues');
    if (!container) return;

    container.innerHTML = Object.entries(opsData.queues).map(([gate, data]) => {
      const level = data.wait > 10 ? 'danger' : data.wait > 6 ? 'warning' : 'success';
      const trendIcon = data.trend === 'increasing' ? '↑' : data.trend === 'decreasing' ? '↓' : '→';
      const trendColor = data.trend === 'increasing' ? 'var(--color-danger)' : data.trend === 'decreasing' ? 'var(--color-success)' : 'var(--color-gray-500)';

      return `
        <div class="list-item">
          <div class="list-item__icon" style="background: var(--color-${level}-bg); font-size: var(--font-size-sm); font-weight: 700; color: var(--color-${level});">
            ${data.wait}m
          </div>
          <div class="list-item__content">
            <div class="list-item__title">${gate}</div>
            <div class="list-item__subtitle">Staff: ${data.staffed} deployed</div>
          </div>
          <div class="flex items-center gap-2">
            <span style="color: ${trendColor}; font-weight: 600; font-size: var(--font-size-sm);">${trendIcon} ${data.trend}</span>
            <span class="badge badge--${level}"><span class="badge__dot"></span> ${data.wait > 10 ? 'Alert' : data.wait > 6 ? 'Busy' : 'Normal'}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderIncidentLog() {
    const container = document.getElementById('ops-incidents');
    if (!container) return;

    container.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Time</th>
            <th>Type</th>
            <th>Location</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${opsData.incidents.map(inc => {
            const statusColor = inc.status === 'Resolved' ? 'success' : inc.status === 'Active' ? 'danger' : 'warning';
            const prioColor = inc.priority === 'High' ? 'danger' : inc.priority === 'Medium' ? 'warning' : 'info';
            return `
              <tr>
                <td class="font-semibold">${inc.id}</td>
                <td>${inc.time}</td>
                <td>${inc.type}</td>
                <td>${inc.location}</td>
                <td><span class="badge badge--${prioColor}">${inc.priority}</span></td>
                <td><span class="badge badge--${statusColor}"><span class="badge__dot"></span> ${inc.status}</span></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  function renderConcessions() {
    const container = document.getElementById('ops-concessions');
    if (!container) return;

    container.innerHTML = Object.entries(opsData.concessions).map(([key, data]) => {
      const labels = { foodStands: 'Food Stands', beverageStands: 'Beverage Stands', merchandise: 'Merchandise' };
      const icons = { foodStands: '🍔', beverageStands: '🥤', merchandise: '👕' };
      const pct = Math.round((data.open / data.total) * 100);

      return `
        <div style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3) 0; border-bottom: 1px solid var(--color-gray-100);">
          <span style="font-size: 1.3rem;">${icons[key]}</span>
          <div style="flex: 1;">
            <div class="text-sm font-semibold">${labels[key]}</div>
            <div class="text-xs text-muted">${data.open}/${data.total} open • Avg wait: ${data.avgWait} min</div>
          </div>
          <span class="badge ${pct === 100 ? 'badge--success' : 'badge--warning'}">${pct}% open</span>
        </div>
      `;
    }).join('');
  }

  function renderAIRecommendations() {
    const container = document.getElementById('ops-ai-recommendations');
    if (!container) return;

    container.innerHTML = opsData.aiRecommendations.map(rec => {
      const prioColor = rec.priority === 'high' ? 'danger' : rec.priority === 'medium' ? 'warning' : 'info';

      return `
        <div class="alert alert--${prioColor}" style="margin-bottom: var(--space-3);">
          <span class="alert__icon">${rec.icon}</span>
          <div class="alert__content">
            <div class="alert__title">${rec.title}</div>
            <div style="font-size: var(--font-size-xs); margin-top: 2px;">${rec.description}</div>
          </div>
          <button class="btn btn--sm btn--outline" style="flex-shrink: 0;">${rec.action}</button>
        </div>
      `;
    }).join('');
  }

  return {
    init,
    opsData,
  };

})();
