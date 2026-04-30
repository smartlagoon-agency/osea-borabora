(function () {
  'use strict';

  const WEBHOOK_URL = 'https://n8n.smartlagoon.agency/webhook/osea-chat';

  const sessionId = sessionStorage.getItem('osea-chat-id') || crypto.randomUUID();
  sessionStorage.setItem('osea-chat-id', sessionId);

  const toggle   = document.getElementById('chat-toggle');
  const panel    = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const messages = document.getElementById('chat-messages');
  const input    = document.getElementById('chat-input');
  const sendBtn  = document.getElementById('chat-send');

  if (!toggle) return;

  let isOpen = false;
  let isBusy = false;

  const WELCOME = {
    fr: "Ia ora na ! Je suis l'assistant O-sea. Quelle excursion vous intéresse ?",
    en: "Ia ora na! I'm the O-sea assistant. Which excursion interests you?"
  };
  const ERROR_MSG = {
    fr: "Désolé, une erreur s'est produite. Contactez-nous via WhatsApp.",
    en: "Sorry, something went wrong. Please contact us via WhatsApp."
  };

  function getLang() {
    return document.documentElement.lang === 'en' ? 'en' : 'fr';
  }

  function addMsg(text, role) {
    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg--' + role;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'chat-typing';
    el.id = 'chat-typing';
    for (let i = 0; i < 3; i++) el.appendChild(document.createElement('span'));
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById('chat-typing');
    if (el) el.remove();
  }

  function openPanel() {
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    isOpen = true;
    if (messages.children.length === 0) addMsg(WELCOME[getLang()], 'bot');
    input.focus();
  }

  function closePanel() {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    isOpen = false;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isBusy) return;
    isBusy = true;
    input.value = '';
    addMsg(text, 'user');
    showTyping();
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId, lang: getLang() })
      });
      removeTyping();
      if (!res.ok) throw new Error('network');
      const data = await res.json();
      addMsg(data.message || data.reply || data.text || '…', 'bot');
    } catch {
      removeTyping();
      addMsg(ERROR_MSG[getLang()], 'bot');
    } finally {
      isBusy = false;
      input.focus();
    }
  }

  toggle.addEventListener('click', () => isOpen ? closePanel() : openPanel());
  closeBtn.addEventListener('click', closePanel);
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen) closePanel(); });

  new MutationObserver(() => {
    const lang = getLang();
    input.placeholder = lang === 'en' ? input.dataset.placeholderEn : input.dataset.placeholderFr;
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
