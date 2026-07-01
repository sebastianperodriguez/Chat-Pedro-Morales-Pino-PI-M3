import { escapeHtml, formatTime, validateMessage } from './utils.js';

const state = {
  history: [],
  isTyping: false
};

const WELCOME_MESSAGE =
  'Buenas tardes, noble visitante. Soy Pedro Morales Pino, músico y compositor de Colombia. ' +
  'Con gusto te hablaré de mis composiciones, mis giras, o lo que quieras preguntar.';

function ensureWelcomeMessage() {
  if (state.history.length === 0) {
    state.history.push({
      sender: 'character',
      text: WELCOME_MESSAGE,
      time: formatTime()
    });
  }
}

function bubbleHtml(msg) {
  const who = msg.sender === 'user' ? 'user' : 'character';
  return `
    <div class="msg msg--${who}">
      <div class="msg__bubble">
        <p class="msg__text">${escapeHtml(msg.text)}</p>
        <span class="msg__time">${msg.time}</span>
      </div>
    </div>
  `;
}

function renderMessages(container) {
  container.innerHTML = state.history.map(bubbleHtml).join('');
  scrollToBottom(container);
}

function scrollToBottom(container) {
  requestAnimationFrame(() => {
    container.scrollTop = container.scrollHeight;
  });
}

function setTyping(container, typingEl, isTyping) {
  state.isTyping = isTyping;
  typingEl.hidden = !isTyping;
  if (isTyping) scrollToBottom(container);
}

function showError(errorEl, message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function hideError(errorEl) {
  errorEl.hidden = true;
  errorEl.textContent = '';
}

async function sendToApi(message) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history: state.history.map(({ sender, text }) => ({ sender, text }))
    })
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.error || 'Error desconocido';
    throw new Error(detail);
  }
  if (!data?.reply) {
    throw new Error('Respuesta vacía del personaje');
  }
  return data.reply;
}

export function initChat(root) {
  ensureWelcomeMessage();

  const messagesEl = root.querySelector('[data-messages]');
  const formEl = root.querySelector('[data-form]');
  const inputEl = root.querySelector('[data-input]');
  const typingEl = root.querySelector('[data-typing]');
  const errorEl = root.querySelector('[data-error]');

  renderMessages(messagesEl);
  setTyping(messagesEl, typingEl, state.isTyping);

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError(errorEl);

    const text = inputEl.value;
    const { valid } = validateMessage(text);
    if (!valid) return;

    const userMsg = { sender: 'user', text: text.trim(), time: formatTime() };
    state.history.push(userMsg);
    renderMessages(messagesEl);
    inputEl.value = '';
    inputEl.focus();

    setTyping(messagesEl, typingEl, true);

    try {
      const reply = await sendToApi(userMsg.text);
      state.history.push({ sender: 'character', text: reply, time: formatTime() });
      renderMessages(messagesEl);
    } catch (err) {
      console.error('Error al hablar con el personaje:', err);
      showError(
        errorEl,
        'El maestro no ha podido responder (fallo de conexión con Gemini). Probad de nuevo.'
      );
    } finally {
      setTyping(messagesEl, typingEl, false);
    }
  });
}