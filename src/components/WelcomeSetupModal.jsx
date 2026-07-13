import React, { useState, useEffect } from 'react';
import { Trophy, Globe, MapPin, Ticket, ShieldCheck, CheckCircle, Sparkles, UserCheck, X } from 'lucide-react';
import { venues } from '../data/matchData';

export default function WelcomeSetupModal({ isOpen, onClose, onSavePreferences }) {
  const [language, setLanguage] = useState('en');
  const [venueId, setVenueId] = useState('metlife');
  const [isStaff, setIsStaff] = useState(false);
  const [section, setSection] = useState('114');
  const [row, setRow] = useState('12');
  const [seat, setSeat] = useState('15');

  useEffect(() => {
    if (isOpen) {
      const storedLang = localStorage.getItem('stadiaiq_lang') || 'en';
      const storedVenue = localStorage.getItem('stadiaiq_venue') || 'metlife';
      const storedStaff = localStorage.getItem('stadiaiq_is_staff') === 'true';
      const storedSec = localStorage.getItem('stadiaiq_sec') || '114';
      const storedRow = localStorage.getItem('stadiaiq_row') || '12';
      const storedSeat = localStorage.getItem('stadiaiq_seat') || '15';

      setLanguage(storedLang);
      setVenueId(storedVenue);
      setIsStaff(storedStaff);
      setSection(storedSec);
      setRow(storedRow);
      setSeat(storedSeat);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const prefs = {
      language,
      venueId,
      isStaff,
      section: isStaff ? 'Staff Ops' : (section.trim() || '101'),
      row: isStaff ? 'N/A' : (row.trim() || '1'),
      seat: isStaff ? 'N/A' : (seat.trim() || '1'),
      completed: true
    };

    localStorage.setItem('stadiaiq_lang', prefs.language);
    localStorage.setItem('stadiaiq_venue', prefs.venueId);
    localStorage.setItem('stadiaiq_is_staff', prefs.isStaff ? 'true' : 'false');
    localStorage.setItem('stadiaiq_sec', prefs.section);
    localStorage.setItem('stadiaiq_row', prefs.row);
    localStorage.setItem('stadiaiq_seat', prefs.seat);
    localStorage.setItem('stadiaiq_setup_completed', 'true');

    if (onSavePreferences) {
      onSavePreferences(prefs);
    }
    onClose();
  };

  const languages = [
    { code: 'en', flag: '🇺🇸', name: 'English', desc: 'Default Match-Day Experience' },
    { code: 'es', flag: '🇲🇽', name: 'Español (Spanish)', desc: 'Experiencia Oficial FIFA en Español' },
    { code: 'fr', flag: '🇫🇷', name: 'Français (French)', desc: 'Assistance IA & Guide en Français' },
    { code: 'pt', flag: '🇧🇷', name: 'Português (Portuguese)', desc: 'Navegação e Suporte em Português' },
  ];

  const allVenues = Object.values(venues);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.82)', backdropFilter: 'blur(8px)',
      zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', animation: 'fadeIn 0.25s ease-out'
    }}>
      <div className="card" style={{
        maxWidth: '680px', width: '100%', maxHeight: '92vh', overflowY: 'auto',
        background: 'var(--bg-card)', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        border: '1px solid var(--color-gray-200)', overflow: 'hidden'
      }}>
        {/* Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #0f172a 100%)',
          padding: '1.75rem', color: 'white', position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
              }}>
                🏆
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1px', color: 'var(--color-gold)', textTransform: 'uppercase' }}>
                  FIFA World Cup 2026™ • StadiaIQ Portal
                </div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 900, margin: '2px 0 0 0', lineHeight: 1.2 }}>
                  Welcome Fan Check-In & Setup
                </h2>
              </div>
            </div>
            {localStorage.getItem('stadiaiq_setup_completed') === 'true' && (
              <button onClick={onClose} style={{ color: 'white', opacity: 0.8, cursor: 'pointer', background: 'rgba(255,255,255,0.15)', padding: '6px', borderRadius: '8px' }}>
                <X size={20} />
              </button>
            )}
          </div>
          <p style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.65rem', lineHeight: 1.4 }}>
            Customize your language and seating location so our **Groq Llama-3.3 AI Engine** can provide hyper-personalized step-free routes, closest concourse gates, and instant multilingual wayfinding.
          </p>
        </div>

        <form onSubmit={handleSave} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* STEP 1: Language Preference */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
              <Globe size={16} style={{ color: 'var(--color-primary-light)' }} /> 1. Choose Your Preferred Language
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.65rem' }}>
              {languages.map(lang => (
                <div
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                    borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s ease',
                    border: language === lang.code ? '2px solid var(--color-primary-light)' : '1px solid var(--color-gray-200)',
                    background: language === lang.code ? 'rgba(37, 99, 235, 0.06)' : 'var(--color-gray-50)'
                  }}
                >
                  <span style={{ fontSize: '1.6rem' }}>{lang.flag}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: language === lang.code ? 'var(--color-primary-dark)' : 'var(--text-primary)' }}>
                      {lang.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{lang.desc}</div>
                  </div>
                  {language === lang.code && <CheckCircle size={18} style={{ color: 'var(--color-primary-light)' }} />}
                </div>
              ))}
            </div>
          </div>

          {/* STEP 2: Host Stadium Selection */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              <MapPin size={16} style={{ color: 'var(--color-primary-light)' }} /> 2. Select Your Host Stadium Today
            </label>
            <select
              className="select"
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
              style={{ fontWeight: 700, fontSize: '0.95rem', padding: '0.75rem 1rem' }}
            >
              {allVenues.map(v => (
                <option key={v.id} value={v.id}>
                  {v.country} — {v.name} ({v.city}) • Cap: {v.capacity}
                </option>
              ))}
            </select>
          </div>

          {/* STEP 3: Seating Details / Staff Toggle */}
          <div style={{ background: 'var(--color-gray-50)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--color-gray-200)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                <Ticket size={16} style={{ color: 'var(--color-primary-light)' }} /> 3. Seat Location or Fan Pass
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsStaff(false)}
                  className={`btn btn--sm ${!isStaff ? 'btn--primary' : 'btn--secondary'}`}
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}
                >
                  🎫 Ticketed Fan Seat
                </button>
                <button
                  type="button"
                  onClick={() => setIsStaff(true)}
                  className={`btn btn--sm ${isStaff ? 'btn--primary' : 'btn--secondary'}`}
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}
                >
                  🛡️ Venue Staff / Volunteer
                </button>
              </div>
            </div>

            {!isStaff ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label className="text-xs font-bold text-secondary" style={{ display: 'block', marginBottom: '4px' }}>SECTION / BAY</label>
                  <input
                    type="text"
                    className="input"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="e.g. 114"
                    style={{ fontWeight: 700, textAlign: 'center' }}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary" style={{ display: 'block', marginBottom: '4px' }}>ROW</label>
                  <input
                    type="text"
                    className="input"
                    value={row}
                    onChange={(e) => setRow(e.target.value)}
                    placeholder="e.g. 12"
                    style={{ fontWeight: 700, textAlign: 'center' }}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary" style={{ display: 'block', marginBottom: '4px' }}>SEAT NUMBER</label>
                  <input
                    type="text"
                    className="input"
                    value={seat}
                    onChange={(e) => setSeat(e.target.value)}
                    placeholder="e.g. 15"
                    style={{ fontWeight: 700, textAlign: 'center' }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ padding: '0.85rem', background: 'rgba(37,99,235,0.06)', borderRadius: '10px', border: '1px dashed var(--color-primary-light)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <UserCheck size={24} style={{ color: 'var(--color-primary-light)' }} />
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  <strong>Staff Operational Mode Activated:</strong> You will have direct priority access to the Operations Triage log and instant PA Emergency Broadcast controls.
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              <Sparkles size={13} style={{ color: 'var(--color-gold)' }} />
              <span>StadiaIQ uses your exact seat coordinates to calculate custom walking paths and closest amenity bays.</span>
            </div>
          </div>

          {/* Action Footer */}
          <button
            type="submit"
            className="btn btn--primary"
            style={{
              height: '52px', fontSize: '1.05rem', fontWeight: 800, borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
              boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)', cursor: 'pointer'
            }}
          >
            <ShieldCheck size={20} /> Enter StadiaIQ — Start My Match-Day Experience 🚀
          </button>
        </form>
      </div>
    </div>
  );
}
