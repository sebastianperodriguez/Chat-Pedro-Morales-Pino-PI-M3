// utils.js
// Funciones puras de transformación de datos: routing, formateo,
// validación y construcción/parseo de payloads para la API de Gemini.

const VALID_ROUTES = ['home', 'chat', 'about'];

export function getRouteFromPath(pathname) {
  if (!pathname || typeof pathname !== 'string') return 'home';
  const clean = pathname.replace(/\/+$/, '').replace(/^\//, '').toLowerCase();
  if (clean === '') return 'home';
  return VALID_ROUTES.includes(clean) ? clean : 'home';
}

export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatTime(date = new Date()) {
  const d = date instanceof Date && !isNaN(date) ? date : new Date();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function validateMessage(text) {
  if (typeof text !== 'string') return { valid: false, reason: 'invalid_type' };
  const trimmed = text.trim();
  if (trimmed.length === 0) return { valid: false, reason: 'empty' };
  if (trimmed.length > 1000) return { valid: false, reason: 'too_long' };
  return { valid: true };
}

export function buildGeminiContents(history = [], maxTurns = 10) {
  if (!Array.isArray(history)) return [];
  const recent = history.slice(-maxTurns * 2);
  return recent
    .filter((m) => m && typeof m.text === 'string' && m.text.trim().length > 0)
    .map((m) => ({
      role: m.sender === 'character' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));
}

export function parseGeminiResponse(data) {
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('No se pudo interpretar la respuesta de Gemini');
  }
  return text.trim();
}