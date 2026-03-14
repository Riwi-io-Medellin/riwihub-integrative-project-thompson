import { projectsAPI, mediaProjectsAPI } from "../helpers/api.js";
import { aiChatInit, aiChat, aiProjectSummary, getAiRole, getCompanyName } from "../helpers/aiApi.js";
 
// SHARED STATE
export let projectsList     = [];
export let filteredProjects = [];
export let mediaByProject   = {};
export let currentModalProject = null;
 
export const icons = ["🛒","🚀","🏠","📊","📚","💰","💬","📅","🎮","🎨","🔧","📱"];
 
// UNSPLASH FALLBACK BY NICHO 
const unsplashByNicho = {
  "e-commerce":   "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
  "commerce":     "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
  "logística":    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80",
  "logistica":    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80",
  "inmobiliario": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80",
  "analytics":    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
  "educación":    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80",
  "educacion":    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80",
  "fintech":      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=80",
  "comunicación": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80",
  "comunicacion": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80",
  "servicios":    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80",
  "salud":        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80",
};
 
// AI RESPONSES 
export const aiResponses = {
  "react":      { msg:"Proyectos con React:",   filter: p => (p.technologies || []).some(t => t.toLowerCase().includes("react"))    },
  "flutter":    { msg:"Proyectos con Flutter:", filter: p => (p.technologies || []).some(t => t.toLowerCase().includes("flutter"))  },
  "e-commerce": { msg:"Proyectos e-commerce:",  filter: p => (p.nicho || "").toLowerCase().includes("commerce") || (p.project_name || "").toLowerCase().includes("commerce") },
  "móvil":      { msg:"Proyectos móviles:",     filter: p => (p.technologies || []).some(t => ["flutter","react native"].includes(t.toLowerCase())) },
  "mobile":     { msg:"Proyectos móviles:",     filter: p => (p.technologies || []).some(t => ["flutter","react native"].includes(t.toLowerCase())) },
  "python":     { msg:"Proyectos con Python:",  filter: p => (p.technologies || []).some(t => t.toLowerCase().includes("python"))   },
  "node":       { msg:"Proyectos con Node.js:", filter: p => (p.technologies || []).some(t => t.toLowerCase().includes("node"))     },
  "fintech":    { msg:"Proyectos Fintech:",      filter: p => (p.nicho || "").toLowerCase().includes("fintech")                     },
  "educación":  { msg:"Proyectos educativos:",  filter: p => (p.nicho || "").toLowerCase().includes("educ")                        },
  "educacion":  { msg:"Proyectos educativos:",  filter: p => (p.nicho || "").toLowerCase().includes("educ")                        },
  "todos":      { msg:"Todos los proyectos:",   filter: () => true                                                                  },
};
 
//  IMAGE RESOLUTION 
export function getProjectImage(p) {
  if (mediaByProject[p.project_id]) return { type: "img", src: mediaByProject[p.project_id] };
  const nicho = (p.nicho || "").toLowerCase();
  for (const [key, url] of Object.entries(unsplashByNicho)) {
    if (nicho.includes(key)) return { type: "img", src: url };
  }
  return { type: "emoji", src: icons[p.project_id % icons.length] };
}
 
// LOAD PROJECTS + MEDIA 
export async function loadProjects(onLoaded) {
  try {
    const [data, mediaData] = await Promise.all([
      projectsAPI.getAll(),
      mediaProjectsAPI.getAll(),
    ]);
 
    projectsList = data || [];
 
    mediaByProject = {};
    for (const m of (mediaData || [])) {
      if (m.media_type === "image" && !mediaByProject[m.project_id]) {
        mediaByProject[m.project_id] = m.media_url;
      }
    }
 
    filteredProjects = [...projectsList];
    onLoaded(filteredProjects);
  } catch (error) {
    showToast(`❌ Error cargando proyectos: ${error.message}`);
  }
}
 
// PROJECTS RENDER
export function renderProjects(list) {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;
 
  if (!list.length) {
    grid.innerHTML = `<p style="color:var(--muted);grid-column:1/-1;text-align:center">No se encontraron proyectos.</p>`;
    return;
  }
 
  grid.innerHTML = list.map((p, i) => {
    const image = getProjectImage(p);
    const thumb = image.type === "img"
      ? `<img src="${image.src}" alt="${p.project_name}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit" onerror="this.parentElement.textContent='${icons[p.project_id % icons.length]}'">`
      : image.src;
    const tech = (p.technologies || []).slice(0, 3).map(t => `<span>${t}</span>`).join("");
    return `
      <div class="project-card" data-id="${p.project_id}" style="animation:fadeUp .4s ${i * .06}s both">
        <div class="project-thumb">${thumb}</div>
        <div class="project-body">
          <h3>${p.project_name}</h3>
          <p>${p.short_description || ""}</p>
          <div class="project-tags">${tech}</div>
          <div class="project-actions">
            <button class="btn-sm open-modal-btn" data-id="${p.project_id}">👁 Ver más</button>
            <button class="btn-primary-sm demo-btn" data-id="${p.project_id}">🔗 Demo</button>
          </div>
        </div>
      </div>`;
  }).join("");
 
  grid.querySelectorAll(".project-card").forEach(card =>
    card.addEventListener("click", () => openModal(card.dataset.id))
  );
  grid.querySelectorAll(".open-modal-btn").forEach(btn =>
    btn.addEventListener("click", (e) => { e.stopPropagation(); openModal(btn.dataset.id); })
  );
  grid.querySelectorAll(".demo-btn").forEach(btn =>
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const p = projectsList.find(p => p.project_id == btn.dataset.id);
      if (p?.project_link) window.open(p.project_link, "_blank");
      else showToast("Demo no disponible");
    })
  );
}
 
// PROJECT MODAL
export function openModal(id) {
  const p = projectsList.find(p => p.project_id == id);
  if (!p) return;
  currentModalProject = p;
 
  const image = getProjectImage(p);
  if (image.type === "img") {
    document.getElementById("modalThumb").innerHTML = `<img src="${image.src}" alt="${p.project_name}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit" onerror="this.parentElement.textContent='${icons[p.project_id % icons.length]}'">`;
  } else {
    document.getElementById("modalThumb").textContent = image.src;
  }
 
  const team  = (p.coders || []).map(c => c.coder_name || c.name);
  const techs = (p.technologies || []);
 
  document.getElementById("modalTitle").textContent = p.project_name;
  document.getElementById("modalDesc").textContent  = p.short_description   || "";
  document.getElementById("modalFull").textContent  = p.complete_description || "";
  document.getElementById("modalTags").innerHTML    = techs.map(t => `<span>${t}</span>`).join("");
  document.getElementById("modalMeta").innerHTML    = `
    <div>Rating: <strong>${p.rating || 0}</strong></div>
    <div>Devs: <strong>${team.length}</strong></div>
    <div>Nicho: <strong>${p.nicho || "—"}</strong></div>
    <div>Ruta: <strong>${p.route_level || "—"}</strong></div>
    <div>Cohorte: <strong>${p.cohort || "—"}</strong></div>`;
  document.getElementById("modalTeam").innerHTML = team.length
    ? `<h4>👥 Integrantes del equipo</h4>${team.map(m => `<span class="team-member">${m}</span>`).join("")}`
    : "";
  document.getElementById("aiSummaryBox").style.display = "none";
  document.getElementById("projectModal").classList.add("active");
}
 
export function closeModal() {
  document.getElementById("projectModal")?.classList.remove("active");
}
 
 
 
//  AI CHAT
export function handleProjectSearch(text, onResults) {
  const lower = text.toLowerCase();
  let response = null;
  for (const [key, val] of Object.entries(aiResponses)) {
    if (lower.includes(key)) { response = val; break; }
  }
  if (response) {
    filteredProjects = projectsList.filter(response.filter);
    renderProjects(filteredProjects);
    onResults(`${response.msg} ${filteredProjects.length} resultado(s).`);
  } else {
    onResults(`No encontré filtros para "${text}". Prueba: React, Flutter, e-commerce, móvil, fintech, educación o "todos".`);
  }
}
 
// INIT MODAL LISTENERS 
export function initProjectModalListeners() {
  document.getElementById("closeProjectModal")?.addEventListener("click", closeModal);
  document.getElementById("closeModalBtn")?.addEventListener("click", closeModal);
  document.getElementById("generateAiSummaryBtn")?.addEventListener("click", generateAiSummary);
  document.getElementById("viewDemoBtn")?.addEventListener("click", () => {
    if (currentModalProject?.project_link) window.open(currentModalProject.project_link, "_blank");
    else showToast("Demo no disponible");
  });
  document.getElementById("projectModal")?.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-overlay")) closeModal();
  });
}
 
//  TOAST 
export function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}
 
//  AI CHAT STATE
function getChatKey() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const userId   = userData.id || userData.email || "guest";
  return `aiChatSession_${userId}`;
}
 
function loadChatSession() {
  try {
    const saved = sessionStorage.getItem(getChatKey());
    if (saved) return JSON.parse(saved);
  } catch {}
  return { history: [], companyProfile: null, initialized: false };
}
 
function saveChatSession() {
  try {
    sessionStorage.setItem(getChatKey(), JSON.stringify({
      history: chatHistory,
      companyProfile,
      initialized: chatInitialized,
    }));
  } catch {}
}
 
const _session    = loadChatSession();
let chatHistory    = _session.history;
let companyProfile = _session.companyProfile;
let chatInitialized = _session.initialized;
 
// INIT AI CHAT 
export async function initAiChat() {
  const msgs = document.getElementById("aiMessages");
  if (!msgs) return;
 
  // Already initialized this session — restore DOM from history
  if (chatInitialized && chatHistory.length > 0) {
    msgs.innerHTML = chatHistory.map(m => {
      const cls     = m.role === "user" ? "user" : "bot";
      const content = m.role === "assistant"
        ? m.content
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .replace(/\n/g, "<br>")
        : m.content;
      return `<div class="ai-msg ${cls}">${content}</div>`;
    }).join("");
    msgs.scrollTop = msgs.scrollHeight;
    return;
  }
 
  // First load — call init endpoint
  const role        = getAiRole();
  const companyName = getCompanyName();
 
  try {
    const { welcome_message, company_profile } = await aiChatInit({
      role,
      company_name: companyName,
      language: "es",
    });
    companyProfile  = company_profile || null;
    chatHistory     = [];
    chatInitialized = true;
 
    const formatted = welcome_message
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
    msgs.innerHTML = `<div class="ai-msg bot">${formatted}</div>`;
 
    chatHistory.push({ role: "assistant", content: welcome_message });
    saveChatSession();
  } catch {
    msgs.innerHTML = `<div class="ai-msg bot">¡Hola! Puedo ayudarte a buscar proyectos. ¿Por dónde empezamos?</div>`;
  }
}
 
// SEND AI MESSAGE 
export async function sendAiMessage(text, onBotReply) {
  const role        = getAiRole();
  const companyName = getCompanyName();
 
  // Push user message to history
  chatHistory.push({ role: "user", content: text });
  saveChatSession();
 
  try {
    const data = await aiChat({
      message:         text,
      history:         chatHistory.slice(-10),
      role,
      company_name:    companyName,
      company_profile: companyProfile,
      language:        "auto",
    });
 
    // Push assistant reply to history
    chatHistory.push({ role: "assistant", content: data.text });
    saveChatSession();
 
    // Update project grid if IA returned filtered projects
    if (data.projects && data.projects.length > 0) {
      const mapped = data.projects.map(p => {
        // tecnology can be a string "React, Node.js" or array
        const rawTech = p.tecnologias || p.technologies || [];
        const technologies = Array.isArray(rawTech)
          ? rawTech.map(t => typeof t === "string" ? t : t.technology_name || t.name || "").filter(Boolean)
          : String(rawTech).split(",").map(t => t.trim()).filter(Boolean);
 
        // coders-team
        const rawCoders = p.participantes || p.coders || [];
        const coders = Array.isArray(rawCoders)
          ? rawCoders.map(c => typeof c === "string" ? { name: c } : c)
          : String(rawCoders).split(",").map(name => ({ name: name.trim() })).filter(c => c.name);
 
        return {
          project_id:           p.id || p.project_id,
          project_name:         p.titulo || p.project_name,
          short_description:    p.descripcion_corta || p.short_description,
          complete_description: p.descripcion_completa || p.complete_description,
          nicho:                p.nicho,
          technologies,
          coders,
          rating:               p.calificacion || p.rating || 0,
          route_level:          p.ruta_estudio || p.ruta || p.route_level,
          cohort:               p.corte || p.cohort,
          project_link:         p.link_despliegue || p.project_link,
        };
      });
      renderProjects(mapped);
    }
 
    // Render markdown-like formatting
    const formatted = data.text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
 
    onBotReply(formatted);
  } catch {
    onBotReply("Hubo un error al conectar con el asistente IA. Intenta de nuevo.");
  }
}
 
// GENERATE AI SUMMARY
export async function generateAiSummary() {
  if (!currentModalProject) return;
  const p        = currentModalProject;
  const summaryEl = document.getElementById("aiSummaryText");
  const summaryBox = document.getElementById("aiSummaryBox");
 
  summaryEl.textContent = "Generando resumen...";
  summaryBox.style.display = "block";
 
  try {
    const lang = localStorage.getItem("aiLanguage") || "es";
    const { summary } = await aiProjectSummary({ project: p, language: lang });
    summaryEl.textContent = summary;
    showToast("Resumen generado");
  } catch {
    // Fallback to local summary
    const techs = (p.technologies || []).join(", ");
    const team  = (p.coders || []).length;
    summaryEl.textContent =
      `"${p.project_name}" pertenece al nicho de ${p.nicho || "N/A"} en ruta ` +
      `${p.route_level || "N/A"} (${p.cohort || "sin cohorte"}). ` +
      `Equipo de ${team} dev(s) con stack: ${techs}. Rating: ${p.rating || 0}/5.`;
    showToast("Resumen generado localmente");
  }
}