import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';

function setupDom() {
  document.body.innerHTML = `
    <div class="page">
      <header class="topbar">
        <a class="brand" href="/home" data-link>Morales Pino Chat</a>
        <nav class="nav">
          <a href="/home" data-link>Inicio</a>
          <a href="/chat" data-link>Chat</a>
          <a href="/about" data-link>Acerca de</a>
        </nav>
      </header>
      <main id="app" tabindex="-1"></main>
    </div>
  `;
}

let navigateTo;

describe('router de la SPA (app.js)', () => {
  beforeAll(async () => {
    vi.stubGlobal('fetch', vi.fn());
    setupDom();
    window.history.replaceState(null, '', '/home');
    const mod = await import('../src/app.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    navigateTo = mod.navigateTo;
  });

  beforeEach(() => {
    navigateTo('/home');
  });

  it('renderiza la vista Home por defecto', () => {
    const app = document.getElementById('app');
    expect(app.querySelector('.view--home')).not.toBeNull();
    expect(app.textContent).toContain('Pedro Morales Pino');
  });

  it('navigateTo actualiza el contenido y la URL sin recargar', () => {
    navigateTo('/about');

    expect(window.location.pathname).toBe('/about');
    const app = document.getElementById('app');
    expect(app.querySelector('.view--about')).not.toBeNull();
  });

  it('un click en un enlace [data-link] navega sin recarga completa', () => {
    const chatLink = document.querySelector('nav a[href="/chat"]');
    chatLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    expect(window.location.pathname).toBe('/chat');
    const app = document.getElementById('app');
    expect(app.querySelector('.view--chat')).not.toBeNull();
    expect(app.querySelector('[data-form]')).not.toBeNull();
  });

  it('responde al botón atrás/adelante del navegador (popstate)', () => {
    navigateTo('/chat');
    navigateTo('/about');

    window.history.pushState(null, '', '/chat');
    window.dispatchEvent(new PopStateEvent('popstate'));

    const app = document.getElementById('app');
    expect(app.querySelector('.view--chat')).not.toBeNull();
  });
});