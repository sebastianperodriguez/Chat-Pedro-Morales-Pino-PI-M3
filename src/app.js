import { getRouteFromPath } from './utils.js';
import { initChat } from './chat.js';

const appEl = document.getElementById('app');
const navLinks = document.querySelectorAll('[data-link]');

const CHARACTER_NAME = 'Pedro Morales Pino';

function homeView() {
  return `
    <section class="view view--home">
      <div class="home__hero">
        <p class="eyebrow">Músico, compositor y pintor colombiano</p>
        <h1>Chateá con ${CHARACTER_NAME}</h1>
        <p class="home__lead">
          Padre de la música colombiana, fundador de la Lira Colombiana,
          maestro de bandola y tiple. Un visionario que llevó el bambuco
          y el pasillo de la tradición oral al pentagrama. Pregúntale lo
          que quieras sobre su vida, sus giras, sus composiciones.
        </p>
        <a class="btn btn--primary" href="/chat" data-link>Empezar a chatear</a>
      </div>
      <div class="home__card">
        <h2>¿Quién fue?</h2>
        <ul class="home__facts">
          <li>Nació en Cartago, Valle del Cauca (1863). Familia humilde.</li>
          <li>Vendía dulces por la calle; su madre le regaló su primer tiple.</li>
          <li>Estudió en la Academia Nacional de Música de Bogotá (1882).</li>
          <li>Fundó la Lira Colombiana (1897): primera agrupación colombiana en girar por el mundo.</li>
          <li>Modernizó la bandola, llevando géneros andinos a partituras académicas.</li>
          <li>Compuso más de 100 obras: pasillos, bambucos, valses, danzas.</li>
           <li>Además de músico era pintor y sus retratos eran muy reconocidos</li>
        </ul>
        <a class="link" href="/about" data-link>Más sobre este proyecto →</a>
      </div>
    </section>
  `;
}

function chatView() {
  return `
    <section class="view view--chat">
      <header class="chat__header">
        <div class="chat__avatar" aria-hidden="true">PM</div>
        <div>
          <h1>${CHARACTER_NAME}</h1>
          <p class="chat__status">compositor · en línea</p>
        </div>
      </header>

      <div class="chat__messages" data-messages role="log" aria-live="polite"></div>

      <p class="chat__typing" data-typing hidden>El maestro está escribiendo…</p>
      <p class="chat__error" data-error role="alert" hidden></p>

      <form class="chat__form" data-form>
        <input
          type="text"
          name="message"
          data-input
          placeholder="Escribe tu mensaje..."
          autocomplete="off"
          maxlength="1000"
          required
        />
        <button type="submit" class="btn btn--send" aria-label="Enviar mensaje">
          Enviar
        </button>
      </form>
    </section>
  `;
}

function aboutView() {
  return `
    <section class="view view--about">
      <h1>Acerca del proyecto</h1>
      <p>
        Esta aplicación es el proyecto integrador del Módulo 3 de la carrera
        de programación en Henry: una Single Page Application que conecta,
        de forma segura, con Google Gemini AI a través de una función
        serverless de Vercel, sin exponer nunca la API key en el cliente.
      </p>

      <h2>El personaje</h2>
      <p>
        Elegimos a <strong>${CHARACTER_NAME}</strong>, uno de los músicos
        más importantes de Colombia, porque su historia es fascinante y su
        impacto en la música andina es incomparable. Llevar el bambuco y el
        pasillo de la tradición oral a partituras académicas, modernizar la
        bandola, y ser el primer músico colombiano en triunfar en el extranjero
        — su legado sigue vivo hoy.
      </p>

      <h2>Tecnología</h2>
      <ul class="about__stack">
        <li>Vite + JavaScript vanilla (sin frameworks) para el frontend.</li>
        <li>Routing propio con la History API (sin recargas de página).</li>
        <li>Vercel Serverless Functions como puente seguro hacia Gemini AI.</li>
        <li>Vitest para las pruebas unitarias.</li>
      </ul>

      <a class="link" href="/chat" data-link>Ir al chat →</a>
    </section>
  `;
}

const routes = {
  home: homeView,
  about: aboutView,
  chat: chatView
};

function setActiveNav(route) {
  navLinks.forEach((link) => {
    const linkRoute = getRouteFromPath(link.getAttribute('href'));
    link.classList.toggle('is-active', linkRoute === route);
    if (linkRoute === route) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function render() {
  const route = getRouteFromPath(window.location.pathname);
  const view = routes[route] || routes.home;

  appEl.innerHTML = view();
  setActiveNav(route);

  if (route === 'chat') {
    initChat(appEl);
  }

  appEl.focus({ preventScroll: true });
}

export function navigateTo(path) {
  window.history.pushState(null, '', path);
  render();
}

function handleLinkClicks(e) {
  const link = e.target.closest('[data-link]');
  if (!link) return;
  e.preventDefault();
  const href = link.getAttribute('href');
  if (href !== window.location.pathname) {
    navigateTo(href);
  }
}

document.addEventListener('click', handleLinkClicks);
window.addEventListener('popstate', render);

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/') {
    window.history.replaceState(null, '', '/home');
  }
  render();
});