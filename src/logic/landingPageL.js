export function landingPageLogic() {

    const projects = [
      { title: "FinTrack Dashboard", desc: "App de gestión financiera con dashboards interactivos y reportes en tiempo real.", tech: ["React", "TypeScript", "Node.js", "PostgreSQL"], niche: "Fintech", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop" },
      { title: "MediConnect", desc: "Plataforma de telemedicina con agendamiento inteligente y videollamadas integradas.", tech: ["Next.js", "Python", "FastAPI", "MongoDB"], niche: "HealthTech", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop" },
      { title: "EcoMarket", desc: "Marketplace sostenible con sistema de scoring ambiental para productos.", tech: ["Vue.js", "Django", "AWS", "Redis"], niche: "E-commerce", img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop" },
      { title: "SkillForge", desc: "Plataforma de aprendizaje donde expertos crean cursos cortos con retos prácticos y certificaciones verificables.", tech: ["React", "Node.js", "PostgreSQL", "Docker"], niche: "EdTech", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"}
    ];
    const grid = document.getElementById("projectsGrid");
    projects.forEach((p, i) => {
      const c = document.createElement("div"); c.className = "project-card fade-up"; c.style.transitionDelay = `${i*0.1}s`;
      c.innerHTML = `<div class="thumb"><img src="${p.img}" alt="${p.title}" loading="lazy"/><span class="niche-tag">${p.niche}</span></div><div class="body"><h3>${p.title}</h3><p class="desc">${p.desc}</p><div class="tags">${p.tech.map(t=>`<span>⟨/⟩ ${t}</span>`).join("")}</div><div class="project-footer"></div></div>`;
      grid.appendChild(c);
    });
    new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }); }, { threshold: 0.1 }).observe(document.querySelectorAll(".fade-up").forEach(el => el) || document.body);
    document.querySelectorAll(".fade-up").forEach(el => new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }); }, { threshold: 0.1 }).observe(el));
    const hamburger = document.getElementById('hamburger');

    if (hamburger) hamburger.addEventListener('click', () => {
    document.getElementById('mobileMenu')?.classList.toggle('open');
    });

    const contactForm = document.getElementById('contactForm');
  if (contactForm) contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); alert("¡Mensaje enviado!"); e.target.reset(); });

}