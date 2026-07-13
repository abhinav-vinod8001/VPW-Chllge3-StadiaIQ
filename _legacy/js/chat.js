/* ============================================
   StadiumAI — Multilingual Chat
   ============================================ */

const Chat = (() => {

  let currentLanguage = 'en';
  let messages = [];
  let isTyping = false;
  let currentSection = 'home';

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
  ];

  function init() {
    renderChatUI();
    bindEvents();
    addMessage('ai', AIEngine.getGreeting(currentLanguage));
    updateSuggestions();
  }

  function renderChatUI() {
    const overlay = document.getElementById('chat-overlay');
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="card__header" style="border-bottom: var(--border); padding: var(--space-4) var(--space-5);">
        <div class="flex items-center gap-3">
          <span style="font-size: 1.3rem;">🤖</span>
          <div>
            <div class="card__title">AI Stadium Assistant</div>
            <div class="flex items-center gap-2">
              <span class="live-dot"></span>
              <span class="text-xs text-success">Online</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <select id="chat-language" class="select" style="width: auto; padding: var(--space-1) var(--space-6) var(--space-1) var(--space-2); font-size: var(--font-size-xs);">
            ${languages.map(l => `<option value="${l.code}" ${l.code === currentLanguage ? 'selected' : ''}>${l.flag} ${l.name}</option>`).join('')}
          </select>
          <button id="chat-close" class="btn btn--ghost btn--icon-sm" title="Close chat">✕</button>
        </div>
      </div>

      <div id="chat-messages" class="chat__messages"></div>

      <div id="chat-suggestions" class="chat__suggestions"></div>

      <div class="chat__input-area">
        <input type="text" id="chat-input" class="chat__input" placeholder="Ask me anything about the stadium..." autocomplete="off" />
        <button id="chat-send" class="chat__send-btn" title="Send message">➤</button>
      </div>
    `;
  }

  function bindEvents() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const closeBtn = document.getElementById('chat-close');
    const langSelect = document.getElementById('chat-language');

    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isTyping) sendMessage();
      });
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        if (!isTyping) sendMessage();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', toggleChat);
    }

    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        addMessage('ai', AIEngine.getGreeting(currentLanguage));
      });
    }
  }

  function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    addMessage('user', text);
    input.value = '';

    // Show typing indicator
    isTyping = true;
    showTypingIndicator();

    // Simulate AI response delay
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      hideTypingIndicator();
      const response = AIEngine.generateResponse(text, currentLanguage);
      addMessage('ai', response);
      isTyping = false;
      updateSuggestions();
    }, delay);
  }

  function addMessage(sender, text) {
    messages.push({ sender, text, time: new Date() });
    renderMessages();
    scrollToBottom();
  }

  function renderMessages() {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    container.innerHTML = messages.map((msg, i) => {
      const isUser = msg.sender === 'user';
      const time = msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Convert markdown-style bold to HTML
      let html = msg.text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');

      return `
        <div class="chat-bubble chat-bubble--${isUser ? 'user' : 'ai'}" style="animation-delay: ${i * 30}ms;">
          ${!isUser ? '<div class="chat-bubble__sender">🤖 AI Assistant</div>' : ''}
          <div>${html}</div>
          <div style="font-size: 0.65rem; opacity: 0.6; margin-top: 4px; text-align: ${isUser ? 'right' : 'left'};">${time}</div>
        </div>
      `;
    }).join('');
  }

  function showTypingIndicator() {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const indicator = document.createElement('div');
    indicator.id = 'typing-indicator';
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(indicator);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  function updateSuggestions() {
    const container = document.getElementById('chat-suggestions');
    if (!container) return;

    const suggestions = AIEngine.getQuickSuggestions(currentSection);
    container.innerHTML = suggestions.map(s =>
      `<button class="chat__chip" onclick="Chat.handleSuggestion('${s.replace(/'/g, "\\'")}')">${s}</button>`
    ).join('');
  }

  function handleSuggestion(text) {
    const input = document.getElementById('chat-input');
    if (input) {
      input.value = text;
      sendMessage();
    }
  }

  function scrollToBottom() {
    const container = document.getElementById('chat-messages');
    if (container) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }

  function toggleChat() {
    const overlay = document.getElementById('chat-overlay');
    const backdrop = document.getElementById('chat-backdrop');
    if (overlay) overlay.classList.toggle('open');
    if (backdrop) backdrop.classList.toggle('open');
  }

  function setSection(section) {
    currentSection = section;
    updateSuggestions();
  }

  return {
    init,
    toggleChat,
    handleSuggestion,
    setSection,
    languages,
  };

})();
