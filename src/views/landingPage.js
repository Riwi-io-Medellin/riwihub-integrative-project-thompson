import '../styles/landing.css';

export function landingPageView() {
  return `<section class="hero">
    <div class="hero-bg"></div>
    <div class="hero-content fade-up">
      <div class="hero-badge">Potenciado con IA</div>
      <h1>Descubre el talento<br><span class="text-gradient">tech del futuro</span></h1>
      <p>Explora proyectos innovadores creados por desarrolladores emergentes. Encuentra el talento perfecto para tu empresa con la ayuda de inteligencia artificial.</p>
      <div class="hero-buttons">
        <a href="https://api.whatsapp.com/send?phone=573006462844&text=%C2%A1Hola!%20Necesito%20desarrolladores%20de%20software%20para%20mi%20empresa.%20%C2%BFMe%20puedes%20dar%20m%C3%A1s%20informaci%C3%B3n%3F" target="_blank" class="btn btn-primary btn-lg">Comenzar ahora →</a>
        <a href="#projects" class="btn btn-outline btn-lg">Ver proyectos</a>
      </div>
    </div>
  </section>

  <section class="projects" id="projects">
    <div class="container">
      <div class="section-header fade-up"><h2>Proyectos <span class="text-gradient">destacados</span></h2><p>Descubre lo que nuestros desarrolladores están construyendo</p></div>
      <div class="projects-grid" id="projectsGrid"></div>
      <div class="projects-cta fade-up"><a data-link href="/login" class="btn btn-outline btn-lg">Ver todos los proyectos</a></div>
    </div>
  </section>

  <section class="about" id="about">
    <div class="glow"></div>
    <div class="container">
      <div class="section-header fade-up"><h2>¿Por qué <span class="text-gradient">RiwiHub</span>?</h2><p>La plataforma que conecta talento tech con empresas innovadoras</p></div>
      <div class="features-grid" id="featuresGrid">
        <div class="feature-card fade-up visible" style="transition-delay: 0s;"><div class="feature-icon">🧠</div><h3>IA Inteligente</h3><p>Filtros y recomendaciones potenciados por inteligencia artificial para encontrar el proyecto perfecto.</p></div>
        <div class="feature-card fade-up visible" style="transition-delay: 0.1s;"><div class="feature-icon">🚀</div><h3>Talento Emergente</h3><p>Conecta con desarrolladores altamente capacitados y listos para transformar tu empresa.</p></div>
        <div class="feature-card fade-up visible" style="transition-delay: 0.2s;"><div class="feature-icon">💻</div><h3>Proyectos Reales</h3><p>Cada proyecto ha sido desarrollado, probado y documentado por equipos de desarrollo profesionales.</p></div>
        <div class="feature-card fade-up visible" style="transition-delay: 0.3s;"><div class="feature-icon">🗂️</div><h3>Proceso Guiado</h3><p>Nuestros asesores te acompañan en cada paso para que encuentres exactamente lo que necesitas.</p></div>
      </div>
    </div>
  </section>

  <section class="contact" id="contact">
    <div class="container">
      <div class="section-header fade-up"><h2>¿Interesado? <span class="text-gradient">Hablemos</span></h2><p>Déjanos tus datos y Riwi se pondrá en contacto contigo</p></div>
      <form class="contact-form fade-up" id="contactForm">
        <div class="form-row"><input type="text" placeholder="Tu nombre" required /><input type="email" placeholder="Email" required /></div>
        <div class="full"><input type="text" placeholder="Empresa (opcional)" /></div>
        <div class="full"><textarea placeholder="¿En qué podemos ayudarte?" required rows="4"></textarea></div>
        <button type="submit" class="btn btn-primary btn-lg" style="width:100%">Enviar mensaje ✉</button>
      </form>
    </div>
  </section> `
}