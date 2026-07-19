import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Sparkles, Cpu, Zap } from 'lucide-react';
import { generateAIResponseAsync } from '../data/aiEngine';
import { getGlobalTelemetry } from '../data/telemetryBus';

const renderFormattedText = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

export default function ChatOverlay({ isOpen, onClose, activeSection, selectedVenueId = 'metlife' }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "👋 I am **StadiaIQ**, your real-time AI operational companion for the FIFA World Cup 2026.\n\nAsk me anything about seating navigation, real-time traffic, crowd bottlenecks, or live train departures!",
      isGroq: false
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestionChips = [
    { label: "🗺️ Where is Section 110?", query: "Where is Section 110?" },
    { label: "🚇 Shortest wait gate right now?", query: "Which gate has the shortest wait time right now given live turnstile telemetry?" },
    { label: "🚗 Fastest route home?", query: "What is the fastest route home right now considering live traffic and transit delays?" },
    { label: "📢 Re-route crowd tip", query: "What is your top operational recommendation for relieving the Gate 2 bottleneck?" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend = input) => {
    const query = typeof textToSend === 'string' ? textToSend.trim() : input.trim();
    if (!query) return;

    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    if (typeof textToSend !== 'string') setInput('');
    setIsTyping(true);

    try {
      const responseObj = await generateAIResponseAsync(query, selectedVenueId, newMessages);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: responseObj.text,
          isGroq: responseObj.isGroq,
          latency: responseObj.latency,
          model: responseObj.model
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `⚠️ **System Error:** Could not generate response (` + err.message + `). Please verify your network or API settings.`,
          isGroq: false
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button className="chat-button" onClick={onClose} aria-label="Open AI Assistant">
        <Bot size={28} />
      </button>
    );
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} style={{ color: 'var(--color-gold)' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>StadiaIQ Assistant</span>
              <span className="live-dot" style={{ width: 6, height: 6 }}></span>
            </div>
            <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Multilingual • Groq Llama-3.3 Telemetry</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={onClose}
            style={{ color: 'white', opacity: 0.8, cursor: 'pointer', display: 'flex' }}
            aria-label="Close Chat"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble chat-bubble--${msg.sender}`}
            style={{
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
              position: 'relative'
            }}
          >
            <div>{renderFormattedText(msg.text)}</div>
            {msg.sender === 'ai' && msg.latency !== undefined && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.5rem',
                paddingTop: '0.4rem', borderTop: '1px solid rgba(0,0,0,0.06)',
                fontSize: '0.68rem', color: 'var(--text-muted)'
              }}>
                <Zap size={11} style={{ color: msg.isGroq ? '#2563eb' : '#f59e0b' }} />
                <span>{msg.isGroq ? `Groq Llama-3.3 • ${msg.latency}ms` : `Local Telemetry Engine • ${msg.latency}ms`}</span>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="chat-bubble chat-bubble--ai" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Cpu size={14} className="animate-spin" style={{ color: 'var(--color-primary-light)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>StadiaIQ querying real-time telemetry context...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '0.5rem 0.75rem', background: 'var(--color-gray-50)', borderTop: '1px solid var(--color-gray-200)', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {suggestionChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip.query)}
            className="action-chip"
            style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <form
        className="chat-input-area"
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
      >
        <input
          type="text"
          className="input"
          placeholder="Ask StadiaIQ in any language..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: '0.5rem 0.75rem' }}
        />
        <button type="submit" className="btn btn--primary" style={{ padding: '0.5rem 0.9rem' }} aria-label="Send Message">
          <Send size={16} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
