import { describe, it, expect } from 'vitest';
import {
  getRouteFromPath,
  escapeHtml,
  formatTime,
  validateMessage,
  buildGeminiContents,
  parseGeminiResponse
} from '../src/utils.js';

describe('getRouteFromPath', () => {
  it('devuelve "home" para la raíz', () => {
    expect(getRouteFromPath('/')).toBe('home');
  });

  it('reconoce rutas válidas', () => {
    expect(getRouteFromPath('/chat')).toBe('chat');
    expect(getRouteFromPath('/about')).toBe('about');
    expect(getRouteFromPath('/home')).toBe('home');
  });

  it('cae en "home" para rutas desconocidas', () => {
    expect(getRouteFromPath('/no-existe')).toBe('home');
    expect(getRouteFromPath('')).toBe('home');
    expect(getRouteFromPath(null)).toBe('home');
  });

  it('ignora mayúsculas y barras finales', () => {
    expect(getRouteFromPath('/Chat/')).toBe('chat');
  });
});

describe('escapeHtml', () => {
  it('escapa etiquetas y comillas para evitar inyección', () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;'
    );
  });

  it('devuelve cadena vacía para valores no string', () => {
    expect(escapeHtml(undefined)).toBe('');
    expect(escapeHtml(42)).toBe('');
  });
});

describe('formatTime', () => {
  it('formatea la hora como HH:MM', () => {
    const date = new Date('2026-01-01T09:05:00');
    expect(formatTime(date)).toBe('09:05');
  });

  it('usa la hora actual si no se recibe una fecha válida', () => {
    expect(formatTime(new Date('fecha-invalida'))).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe('validateMessage', () => {
  it('rechaza mensajes vacíos', () => {
    expect(validateMessage('   ').valid).toBe(false);
  });

  it('rechaza mensajes demasiado largos', () => {
    expect(validateMessage('a'.repeat(1001)).valid).toBe(false);
  });

  it('acepta un mensaje válido', () => {
    expect(validateMessage('Hola, maestro').valid).toBe(true);
  });
});

describe('buildGeminiContents', () => {
  it('convierte el historial interno al formato de Gemini', () => {
    const history = [
      { sender: 'user', text: 'Hola' },
      { sender: 'character', text: 'Buenas tardes' }
    ];
    expect(buildGeminiContents(history)).toEqual([
      { role: 'user', parts: [{ text: 'Hola' }] },
      { role: 'model', parts: [{ text: 'Buenas tardes' }] }
    ]);
  });

  it('filtra mensajes vacíos y respeta el límite de turnos', () => {
    const history = [
      { sender: 'user', text: '' },
      { sender: 'user', text: 'Mensaje 1' },
      { sender: 'character', text: 'Respuesta 1' },
      { sender: 'user', text: 'Mensaje 2' }
    ];
    const result = buildGeminiContents(history, 1);
    expect(result).toHaveLength(2);
    expect(result[result.length - 1]).toEqual({
      role: 'user',
      parts: [{ text: 'Mensaje 2' }]
    });
  });
});

describe('parseGeminiResponse', () => {
  it('extrae el texto de una respuesta válida', () => {
    const data = {
      candidates: [{ content: { parts: [{ text: '  La música es mi vida.  ' }] } }]
    };
    expect(parseGeminiResponse(data)).toBe('La música es mi vida.');
  });

  it('lanza un error si la respuesta no tiene texto', () => {
    expect(() => parseGeminiResponse({})).toThrow();
  });
});