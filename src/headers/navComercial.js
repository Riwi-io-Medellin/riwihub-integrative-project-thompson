import '../styles/base.css';
import '../styles/landing.css';

export function navComercialHeader() {
  const user    = JSON.parse(localStorage.getItem("userData")) || {};
  const name    = user.name  || "Comercial";
  const email   = user.email || "—";
  const initial = name.charAt(0).toUpperCase();

  return `
    <nav class="navbar">
      <div class="container">
        <a data-link href="/landingPage" class="navbar-brand">
          <div class="navbar-logo">⟨/⟩</div>
          <div class="navbar-name">Riwi <span>Hub</span></div>
        </a>
        <div class="navbar-links">
          <a href="#" data-view="projects">Proyectos</a>
          <a href="#" data-view="citas">Citas</a>
          <a href="#" data-view="availability">Disponibilidad</a>
          <a href="#" data-view="profile">Mi Perfil</a>
        </div>
        <div class="navbar-right">
          <button class="theme-toggle" title="Cambiar tema">🌙</button>
          <div class="user-menu" id="userMenu">
            <div class="user-trigger">
              <div class="user-avatar">${initial}</div>
              <span class="user-name">${name}</span>
              <span style="font-size:.6rem;color:var(--navbar-muted);margin-left:4px">▼</span>
            </div>
            <div class="user-dropdown">
              <div class="dd-header">
                <div class="dd-name">${name}</div>
                <div class="dd-email">${email}</div>
              </div>
              <a data-link href="/register">📝 Registrar usuario</a>
              <button class="logout-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
        <button class="hamburger">☰</button>
      </div>
      <div class="mobile-menu" id="mobileMenu">
        <a href="#" data-view="projects">Proyectos</a>
        <a href="#" data-view="citas">Citas</a>
        <a href="#" data-view="availability">Disponibilidad</a>
        <a href="#" data-view="profile">Mi Perfil</a>
        <a data-link href="/register">📝 Registrar usuario</a>
        <div style="display:flex;align-items:center;gap:8px;padding-top:8px;border-top:1px solid hsla(235,25%,25%,0.3);">
          <div class="user-avatar">${initial}</div>
          <span style="color:var(--navbar-fg);font-size:.85rem">${name}</span>
        </div>
        <button class="logout-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Cerrar sesión
        </button>
        <button class="theme-toggle" title="Cambiar tema">🌙</button>
      </div>
    </nav>
  `;
}