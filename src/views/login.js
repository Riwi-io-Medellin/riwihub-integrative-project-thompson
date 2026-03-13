import '../styles/auth.css';

export function loginView() {
    return `
  <div class="auth-layout">
        <div class="wrapper">
          <a data-link href="/landingPage" class="back-link">← Volver al inicio</a>
          <div class="card">
            <div class="brand">
              <div class="brand-logo">⟨/⟩</div>
              <div class="brand-name">Riwi <span>Hub</span></div>
            </div>
            <h1>Bienvenido de vuelta</h1>
            <p class="subtitle">Ingresa a tu cuenta para continuar</p>
            <form id="loginForm">
              <div class="form-group">
                <label for="email">Email</label>
                <input id="email" type="email" placeholder="tu@email.com" required />
              </div>
              <div class="form-group">
                <label for="password">Contraseña</label>
                <input id="password" type="password" placeholder="••••••••" required />
              </div>
              <button type="submit" class="btn btn-primary btn-full" id="submitBtn">
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="toast" id="toast"></div> `
}