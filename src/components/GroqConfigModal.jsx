import React, { useState, useEffect } from 'react';
import { Sparkles, Key, CheckCircle, X, ShieldCheck, Cpu, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import { getGlobalTelemetry } from '../data/telemetryBus';
import { fetchLiveWeather } from '../data/liveWeather';

export default function GroqConfigModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('llama-3.3-70b-versatile');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [liveWeatherSample, setLiveWeatherSample] = useState(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('stadiaiq_groq_key') || '';
    const storedModel = localStorage.getItem('stadiaiq_groq_model') || 'llama-3.3-70b-versatile';
    setApiKey(storedKey);
    setModel(storedModel);

    // Load sample weather for context preview
    fetchLiveWeather('metlife').then(res => setLiveWeatherSample(res));
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('stadiaiq_groq_key', apiKey.trim());
    localStorage.setItem('stadiaiq_groq_model', model);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClear = () => {
    localStorage.removeItem('stadiaiq_groq_key');
    localStorage.removeItem('stadiaiq_groq_model');
    setApiKey('');
    setTestResult(null);
  };

  const handleTestInference = async () => {
    const keyToUse = apiKey.trim() || import.meta.env.VITE_GROQ_API_KEY;
    if (!keyToUse) {
      setTestResult({ success: false, error: 'Please enter a valid Groq API key first.' });
      return;
    }

    setTesting(true);
    setTestResult(null);
    const startTime = performance.now();

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keyToUse}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are StadiaIQ, the real-time AI operational assistant for the FIFA World Cup 2026.'
            },
            {
              role: 'user',
              content: 'Test connection: State your operational readiness in one short sentence.'
            }
          ],
          max_tokens: 60,
          temperature: 0.3
        })
      });

      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP ${response.status}: API Request Failed`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'Ready.';

      setTestResult({
        success: true,
        latency: latency,
        tokens: data.usage?.total_tokens || 35,
        reply: reply
      });
    } catch (err) {
      setTestResult({
        success: false,
        error: err.message || 'Connection failed. Check key and network.'
      });
    } finally {
      setTesting(false);
    }
  };

  if (!isOpen) return null;

  const telemetry = getGlobalTelemetry();
  const previewPayload = {
    model: model,
    system_prompt_injection: {
      venue: liveWeatherSample ? `${liveWeatherSample.venueName}, ${liveWeatherSample.city}` : 'MetLife Stadium, NJ',
      live_weather: liveWeatherSample ? `${liveWeatherSample.temp}°C, ${liveWeatherSample.condition}, Wind ${liveWeatherSample.windSpeed} km/h` : '24°C, Clear',
      turnstile_attendance: `${telemetry.attendance.toLocaleString()} (${telemetry.capacityPercentage}% capacity)`,
      active_bottlenecks: telemetry.activeBottlenecks,
      recommended_gate: telemetry.recommendedGate,
      open_incidents: telemetry.incidents.filter(i => i.status !== 'Resolved').map(i => `${i.id}: ${i.type} (${i.location})`),
      metro_green_line_departure: `in ${Math.round(telemetry.transitCountdowns.metroGreen / 60)}m ${telemetry.transitCountdowns.metroGreen % 60}s`
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', animation: 'fadeIn 0.2s ease-out'
    }}>
      <div className="card" style={{
        maxWidth: '720px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
        background: 'var(--bg-card)', borderRadius: '16px', boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--color-gray-200)'
      }}>
        <div className="card__header" style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Cpu size={22} style={{ color: 'var(--color-gold)' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>Groq AI Command Center & Real-Time Engine</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Ultra-Low Latency LLM Inference & Live Context Injection</div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'white', opacity: 0.85, cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        <div className="card__body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="alert alert--info" style={{ alignItems: 'flex-start' }}>
            <span className="alert__icon"><Sparkles size={20} /></span>
            <div className="alert__content">
              <div className="alert__title">Real-World Live Telemetry Injection</div>
              When configured with your Groq API key, StadiaIQ sends live venue conditions (weather, attendance, turnstile delays, active road incidents) to Groq's high-speed LPU™ inference engine (`300+ tokens/sec`), providing instant, real-world actionable wayfinding and emergency PA broadcasts.
            </div>
          </div>

          {/* API Key Input Section */}
          <div>
            <label className="text-xs text-muted font-bold" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span>GROQ API KEY (`gsk_...`)</span>
              <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary-light)' }}>
                Get Free API Key <ExternalLink size={12} />
              </a>
            </label>
            <div className="input-group">
              <span className="input-group__icon"><Key size={16} /></span>
              <input
                type="password"
                className="input"
                placeholder="gsk_YOUR_GROQ_API_KEY_HERE"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div className="text-xs text-secondary" style={{ marginTop: '0.35rem' }}>
              🔒 Your API key is stored locally in your browser (`localStorage`) and never transmitted to any external server other than directly to `api.groq.com`.
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label className="text-xs text-muted font-bold" style={{ display: 'block', marginBottom: '0.4rem' }}>SELECT GROQ INFERENCE MODEL</label>
            <select className="select" value={model} onChange={(e) => setModel(e.target.value)} style={{ fontWeight: 600 }}>
              <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Recommended — Deep Reasoning & Multi-Language PA Broadcasts)</option>
              <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (Ultra-Fast — Sub-150ms Wayfinding & Navigation)</option>
              <option value="mixtral-8x7b-32768">mixtral-8x7b-32768 (MoE Architecture — 32k Long Context)</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="btn btn--primary" onClick={handleSave} style={{ flex: 1, minWidth: '160px' }}>
              <ShieldCheck size={16} /> Save Groq Settings
            </button>
            <button className="btn btn--outline" onClick={handleTestInference} disabled={testing} style={{ minWidth: '150px' }}>
              {testing ? <RefreshCw size={16} className="animate-spin" /> : <Cpu size={16} />}
              {testing ? 'Testing Latency...' : 'Test Connection & Latency'}
            </button>
            {apiKey && (
              <button className="btn btn--secondary btn--sm" onClick={handleClear} style={{ color: 'var(--color-danger)' }}>
                Clear Key
              </button>
            )}
          </div>

          {saved && (
            <div className="alert alert--success" style={{ padding: '0.65rem 1rem' }}>
              <span className="alert__icon"><CheckCircle size={18} /></span>
              <div className="alert__content font-semibold">Settings saved to localStorage (`stadiaiq_groq_key`). Live Groq inference enabled!</div>
            </div>
          )}

          {/* Test Result Display */}
          {testResult && (
            <div className={`alert alert--${testResult.success ? 'success' : 'danger'}`}>
              <span className="alert__icon">{testResult.success ? <CheckCircle size={20} /> : <AlertCircle size={20} />}</span>
              <div className="alert__content">
                <div className="alert__title">
                  {testResult.success ? `✅ Groq Inference Success — ${testResult.latency}ms Latency!` : '❌ Connection Test Failed'}
                </div>
                {testResult.success ? (
                  <div style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>
                    <div><strong>Model Reply:</strong> "{testResult.reply}"</div>
                    <div style={{ display: 'flex', gap: '1.2rem', marginTop: '0.35rem', fontSize: '0.75rem', opacity: 0.9 }}>
                      <span>⚡ Latency: <strong>{testResult.latency} ms</strong></span>
                      <span>🔢 Tokens: <strong>{testResult.tokens} total</strong></span>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>{testResult.error}</div>
                )}
              </div>
            </div>
          )}

          {/* Live Context Payload Inspector */}
          <div style={{ background: 'var(--color-gray-50)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--color-gray-200)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="text-xs font-bold text-muted">🔴 REAL-TIME INJECTED SYSTEM PROMPT PAYLOAD (PREVIEW)</span>
              <span className="badge badge--success" style={{ fontSize: '0.65rem' }}>Live Telemetry Synced</span>
            </div>
            <pre style={{
              fontSize: '0.75rem', fontFamily: 'monospace', background: 'var(--color-gray-900)',
              color: '#38bdf8', padding: '0.85rem', borderRadius: '8px', overflowX: 'auto',
              maxHeight: '200px', lineHeight: '1.4'
            }}>
              {JSON.stringify(previewPayload, null, 2)}
            </pre>
          </div>
        </div>

        <div className="card__footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button className="btn btn--secondary" onClick={onClose}>Close Command Center</button>
        </div>
      </div>
    </div>
  );
}
