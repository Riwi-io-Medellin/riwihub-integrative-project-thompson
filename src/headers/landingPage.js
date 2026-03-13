

export function landinPageHeader() {

    return `
    <nav class="navbar">
        <div class="container">
            <a data-link href="/landingPage" class="navbar-brand"><div class="navbar-logo">⟨/⟩</div><div class="navbar-name">Riwi <span>Hub</span></div></a>
            <div class="navbar-links">
                <a href="#projects">Proyectos</a>
                <a href="#about">Nosotros</a>
                <a href="#contact">Contacto</a>
            </div>
            <div class="navbar-actions">
            <a data-link href="/login" class="btn btn-outline init-btn">Iniciar Sesión</a>
            <button class="theme-toggle" title="Cambiar tema">🌙</button>
            </div>
            <button class="hamburger" aria-label="Menú">☰</button>
        </div>
        <div class="mobile-menu" id="mobileMenu">
            <a href="#projects">Proyectos</a>
            <a href="#about">Nosotros</a>
            <a href="#contact">Contacto</a>
            <a data-link href="/login" class="btn btn-outline init-btn btn-mobile" style="text-align:center">Iniciar Sesión</a>
            <button class="theme-toggle" title="Cambiar tema">🌙</button>
        </div>
    </nav>
    `
}