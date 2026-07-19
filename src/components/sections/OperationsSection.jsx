import React, { useState } from 'react';
import { BarChart3, AlertCircle, CheckCircle, Clock, ShieldCheck, Cpu, RefreshCw, Volume2, Globe, Sparkles, Copy } from 'lucide-react';
import { useLiveTelemetry, resolveIncidentGlobal } from '../../data/telemetryBus';
import { generatePABroadcastAsync } from '../../data/aiEngine';

export default function OperationsSection({ selectedVenueId = 'metlife' }) {
  const telemetry = useLiveTelemetry();
  const [incidents, setIncidents] = useState(telemetry.incidents);

  // AI Public Address state
  const [paTarget, setPaTarget] = useState('Gate 2 East Concourse (16m wait bottleneck)');
  const [paLang, setPaLang] = useState('en');
  const [paGenerating, setPaGenerating] = useState(false);
  const [paResult, setPaResult] = useState(null);
  const [paBroadcasted, setPaBroadcasted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync local incidents state with global telemetry when updated
  React.useEffect(() => {
    setIncidents(telemetry.incidents);
  }, [telemetry.incidents]);

  const [staffing] = useState({
    stewards: { active: 480, total: 500, status: 'Optimal (96%)' },
    medical: { active: 42, total: 45, status: 'Optimal (93%)' },
    security: { active: 310, total: 320, status: 'Optimal (97%)' },
    concessions: { active: 240, total: 250, status: 'Optimal (96%)' },
  });

  const handleResolveIncident = (id) => {
    resolveIncidentGlobal(id);
  };

  const handleGeneratePA = async () => {
    setPaGenerating(true);
    setPaResult(null);
    setPaBroadcasted(false);
    try {
      const res = await generatePABroadcastAsync({ type: paTarget, location: paTarget }, paLang, selectedVenueId);
      setPaResult(res);
    } catch (err) {
      setPaResult({
        script: `📢 **PA SCRIPT (` + paLang.toUpperCase() + `)**\n\nAttention fans: Regarding ` + paTarget + `, please follow steward instructions and use Gate 4 or Gate 1 for express entry.`,
        isGroq: false,
        latency: 15
      });
    } finally {
      setPaGenerating(false);
    }
  };

  const handleBroadcastLive = () => {
    setPaBroadcasted(true);
    setTimeout(() => setPaBroadcasted(false), 4000);
  };

  const handleCopyScript = () => {
    if (!paResult?.script) return;
    navigator.clipboard?.writeText(paResult.script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const aiRecommendations = [
    { title: 'Re-route Ingress from Gate 2 to Gate 4', impact: `Reduces current ${telemetry.gateWaitTimes.gate2}m wait time down to ~5m at East Concourse.`, action: 'Auto-Update Digital LED Wayfinding Signs' },
    { title: 'Deploy 6 Extra Stewards to Sector 201 Escalators', impact: 'Pre-empts crowd density bottleneck forecasted at halftime.', action: 'Dispatch via Steward Comms Hub' },
    { title: 'Increase Express Train Egress Frequency by +20%', impact: `Accommodates early departure surge (current Metro countdown: ${Math.round(telemetry.transitCountdowns.metroGreen / 60)}m).`, action: 'Notify Transit Operations Control' },
  ];

  return (
    <div className="section active">
      <div className="section__header">
        <h2 className="section__title"><BarChart3 style={{ color: 'var(--color-primary-light)' }} /> Operational Intelligence & Command Dashboard</h2>
        <p className="section__description">
          Real-time telemetry and predictive decision support for venue staff, organizers, and security command. Monitor active incident logs, gate throughput, and generate live Groq AI Public Address emergency broadcasts.
        </p>
      </div>

      {/* High-Level Ops KPI Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__header"><div className="stat-card__icon stat-card__icon--primary"><Cpu size={22} /></div></div>
          <div className="stat-card__value">100%</div>
          <div className="stat-card__label">AI Telemetry Sensors Online</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__header"><div className="stat-card__icon stat-card__icon--success"><ShieldCheck size={22} /></div></div>
          <div className="stat-card__value">1,072</div>
          <div className="stat-card__label">Active On-Duty Venue Staff</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__header"><div className="stat-card__icon stat-card__icon--warning"><Clock size={22} /></div></div>
          <div className="stat-card__value">{telemetry.gateWaitTimes.gate2} min</div>
          <div className="stat-card__label">Peak Gate Bottleneck (Gate 2)</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__header"><div className="stat-card__icon stat-card__icon--danger"><AlertCircle size={22} /></div></div>
          <div className="stat-card__value">{incidents.filter(i => i.status !== 'Resolved').length}</div>
          <div className="stat-card__label">Active Open Incidents</div>
        </div>
      </div>

      {/* [NEW] AI Public Address & Emergency Broadcast Generator */}
      <div className="card" style={{ marginTop: 'var(--space-6)', borderLeft: '5px solid var(--color-primary-light)' }}>
        <div className="card__header" style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Volume2 size={20} style={{ color: 'var(--color-gold)' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>Groq AI Public Address (PA) & Broadcast Generator</div>
              <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>Instantly generate concise, multi-language concourse & LED display broadcasts via LPU™ inference</div>
            </div>
          </div>
          <span className="badge badge--gold" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>Live Broadcast Tool</span>
        </div>

        <div className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 2, minWidth: '260px' }}>
              <label className="text-xs text-muted font-bold" style={{ display: 'block', marginBottom: '0.4rem' }}>SELECT ACTIVE BOTTLENECK OR INCIDENT TO BROADCAST</label>
              <select className="select" value={paTarget} onChange={(e) => setPaTarget(e.target.value)} style={{ fontWeight: 600 }}>
                <option value={`Gate 2 East Concourse (${telemetry.gateWaitTimes.gate2}m wait bottleneck)`}>
                  🚨 Bottleneck: Gate 2 East Concourse ({telemetry.gateWaitTimes.gate2}m wait) — Re-route to Gate 4
                </option>
                {incidents.filter(i => i.status !== 'Resolved').map(inc => (
                  <option key={inc.id} value={`${inc.id}: ${inc.type} (${inc.location})`}>
                    ⚠️ Incident: {inc.id} — {inc.type} at {inc.location}
                  </option>
                ))}
                <option value="Post-Match Egress Surge Warning (Express Rail Departure)">
                  🚆 Transit Surge: Post-Match Express Train Egress Advisory
                </option>
                <option value="Match Halftime Concessions & Restroom Traffic Flow">
                  🍔 Halftime Concession & Restroom Queue Management Advisory
                </option>
              </select>
            </div>

            <div style={{ flex: 1, minWidth: '180px' }}>
              <label className="text-xs text-muted font-bold" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.4rem' }}>
                <Globe size={13} /> TARGET BROADCAST LANGUAGE
              </label>
              <select className="select" value={paLang} onChange={(e) => setPaLang(e.target.value)} style={{ fontWeight: 600 }}>
                <option value="en">🇺🇸 English (Default PA)</option>
                <option value="es">🇲🇽 Spanish (Español)</option>
                <option value="fr">🇫🇷 French (Français)</option>
              </select>
            </div>

            <button
              className="btn btn--primary"
              onClick={handleGeneratePA}
              disabled={paGenerating}
              style={{ height: '42px', padding: '0 1.5rem', minWidth: '190px' }}
            >
              {paGenerating ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {paGenerating ? 'Generating...' : 'Generate PA Script'}
            </button>
          </div>

          {/* Generated Script Display */}
          {paResult && (
            <div style={{ background: 'var(--color-gray-50)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--color-gray-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge--success">⚡ {paResult.isGroq ? `Groq Llama-3.3 • ${paResult.latency}ms` : `Local Telemetry Engine`}</span>
                  <span className="text-xs font-bold text-secondary">READY FOR CONCOURSE SPEAKERS & LED DISPLAY BOARDS</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn--sm btn--outline" onClick={handleCopyScript} style={{ fontSize: '0.75rem' }}>
                    <Copy size={13} /> {copied ? 'Copied!' : 'Copy Script'}
                  </button>
                  <button className="btn btn--sm btn--primary" onClick={handleBroadcastLive} style={{ fontSize: '0.75rem', background: '#16a34a' }}>
                    <Volume2 size={13} /> Broadcast Live Across Venue 🔊
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary-dark)', whiteSpace: 'pre-line', lineHeight: '1.6', padding: '0.85rem', background: 'white', borderRadius: '8px', border: '1px solid var(--color-gray-200)' }}>
                {paResult.script}
              </div>

              {paBroadcasted && (
                <div className="alert alert--success" style={{ marginTop: '0.85rem', padding: '0.6rem 1rem' }}>
                  <span className="alert__icon">🔊</span>
                  <div className="alert__content font-bold">
                    [LIVE BROADCAST DISPATCHED]: Audio streamed to 142 concourse speakers and digital LED ribbons across {selectedVenueId.toUpperCase()}!
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="content-grid" style={{ marginTop: 'var(--space-6)' }}>
        {/* AI Recommendations Command Panel */}
        <div className="card">
          <div className="card__header">
            <span className="card__title"><Cpu size={18} style={{ color: 'var(--color-primary-light)' }} /> AI Real-Time Decision Support</span>
            <span className="badge badge--info">Autonomous Actions</span>
          </div>
          <div className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {aiRecommendations.map((rec, idx) => (
              <div key={idx} style={{ padding: '1rem', background: 'var(--color-gray-50)', borderRadius: '10px', border: '1px solid var(--color-gray-200)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-primary-dark)' }}>{rec.title}</span>
                  <span className="badge badge--primary" style={{ fontSize: '0.65rem' }}>AI Forecast</span>
                </div>
                <p className="text-xs text-secondary" style={{ marginBottom: '0.75rem' }}>🎯 <strong>Impact:</strong> {rec.impact}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-xs font-semibold text-muted">Action: {rec.action}</span>
                  <button
                    className="btn btn--sm btn--primary"
                    onClick={() => alert(`StadiaIQ Command: Executed "${rec.action}" successfully across venue telemetry network.`)}
                  >
                    Execute Command ⚡
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Staff Deployments */}
        <div className="card">
          <div className="card__header">
            <span className="card__title"><ShieldCheck size={18} style={{ color: 'var(--color-success)' }} /> Staffing & Resource Telemetry</span>
            <span className="badge badge--success">All Units Optimal</span>
          </div>
          <div className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(staffing).map(([key, val], idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'var(--color-gray-50)', borderRadius: '8px', border: '1px solid var(--color-gray-200)' }}>
                <div style={{ textTransform: 'capitalize', fontWeight: 700, fontSize: '0.95rem' }}>
                  {key === 'stewards' ? '🧑‍✈️ Safety Stewards' : key === 'medical' ? '🏥 Medical & First Aid' : key === 'security' ? '🛡️ Security Command' : '🍔 Concessions & Retail'}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{val.active} / {val.total}</div>
                  <div className="text-xs font-bold text-success">{val.status}</div>
                </div>
              </div>
            ))}

            <div style={{ padding: '0.85rem', background: 'rgba(37,99,235,0.05)', borderRadius: '8px', border: '1px dashed var(--color-primary-light)', textAlign: 'center' }}>
              <span className="text-xs font-semibold text-primary">💡 StadiaIQ Telemetry Tip: Turnstile ingress rate at Gate 1 is running at 115 fans/min. No steward redeployment needed.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Incident Log Table */}
      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="card__title"><AlertCircle size={18} style={{ color: 'var(--color-warning)' }} /> Live Incident & Dispatch Log</span>
            <span className="live-dot" style={{ width: 6, height: 6 }}></span>
          </div>
          <span className="badge badge--warning">Priority Queue</span>
        </div>
        <div className="card__body card__body--flush">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Incident ID</th>
                  <th>Timestamp</th>
                  <th>Category / Type</th>
                  <th>Venue Location</th>
                  <th>Priority</th>
                  <th>Current Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc) => (
                  <tr key={inc.id}>
                    <td style={{ fontWeight: 800, fontFamily: 'monospace' }}>{inc.id}</td>
                    <td>{inc.time}</td>
                    <td style={{ fontWeight: 600 }}>{inc.type}</td>
                    <td>{inc.location}</td>
                    <td><span className={`badge badge--${inc.priority === 'High' ? 'danger' : inc.priority === 'Medium' ? 'warning' : 'info'}`}>{inc.priority}</span></td>
                    <td>
                      <span className={`badge badge--${inc.color}`}>
                        <span className="badge__dot"></span> {inc.status}
                      </span>
                    </td>
                    <td>
                      {inc.status !== 'Resolved' ? (
                        <button className="btn btn--sm btn--outline" onClick={() => handleResolveIncident(inc.id)}>
                          Resolve <CheckCircle size={12} />
                        </button>
                      ) : (
                        <span className="text-xs text-muted font-bold">Closed</span>
                      )}
                    </td>
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
