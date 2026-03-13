import '../styles/auth.css';

export function registerView() {
  return `
    <div class="auth-layout">
      <div class="wrapper">
        <a data-link href="/landingPage" class="back-link">← Volver al inicio</a>
        <div class="card">
          <div class="brand">
            <div class="brand-logo">⟨/⟩</div>
            <div class="brand-name">Riwi <span>Hub</span></div>
          </div>
          <h1>Crear cuenta</h1>
          <p class="subtitle">Selecciona el rol y completa el registro</p>

          <div class="roles">
            <button class="role-btn active" data-role="cliente">
              <span class="role-icon">🏢</span><span class="role-label">Cliente</span>
            </button>
            <button class="role-btn" data-role="comercial">
              <span class="role-icon">👤</span><span class="role-label">Comercial</span>
            </button>
          </div>

          <form id="registerForm">
            <div class="form-group">
              <label for="name">Nombre de usuario</label>
              <input id="name" type="text" placeholder="Tu nombre" required />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input id="email" type="email" placeholder="tu@email.com" required />
            </div>
            <div class="form-group">
              <label for="password">Contraseña</label>
              <input id="password" type="password" placeholder="••••••••" required />
            </div>
            <button type="submit" class="btn btn-primary" id="submitBtn">Crear cuenta</button>
          </form>
        </div>
      </div>
      <div class="toast" id="toast"></div>
    </div>
  `;
}