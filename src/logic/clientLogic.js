
import {
  loadProjects, renderProjects, handleProjectSearch,
  initProjectModalListeners, showToast, initAiChat, sendAiMessage
} from "./projectsShared.js";
import { initProfileLogic } from "./profileShared.js";
 
// ─── CITAS (hardcoded for demo) ───────────────────────────
let citasList = [
  { asunto:"Demo E-Commerce",  seller:"Laura Restrepo",   fecha:"2026-03-05T10:00", tipo:"Demo de proyecto", notas:"Revisar plataforma", source:"manual" },
  { asunto:"Seguimiento CRM",  seller:"Roberto Martínez", fecha:"2026-03-06T14:30", tipo:"Seguimiento",      notas:"Revisar avances",   source:"manual" },
];
 
// ─── RENDER CITAS ─────────────────────────────────────────
function renderCitas() {
  const container = document.getElementById("citasList");
  if (!container) return;
 
  const citasCount = document.getElementById("citasCount");
  if (citasCount) citasCount.textContent = citasList.length;
 
  if (!citasList.length) {
    container.innerHTML = `<p style="color:var(--muted);font-size:.85rem">No tienes citas programadas.</p>`;
    return;
  }
  container.innerHTML = citasList.map((c, i) => {
    const d       = new Date(c.fecha);
    const dateStr = d.toLocaleDateString("es-CO", { weekday:"short", day:"numeric", month:"short" });
    const timeStr = d.toLocaleTimeString("es-CO", { hour:"2-digit", minute:"2-digit" });
    const badge   = c.source === "ai"
      ? `<span class="badge badge-ai">IA</span>`
      : `<span class="badge badge-today">Manual</span>`;
    return `
      <div class="meeting-item">
        <div class="mi-info">
          <h4>${c.asunto}</h4>
          <p>${dateStr} · ${timeStr} · ${c.tipo} · Seller: ${c.seller}</p>
        </div>
        <div class="meeting-actions">
          ${badge}
          <button class="btn-sm edit-cita-btn" data-idx="${i}">✏️</button>
        </div>
      </div>`;
  }).join("");
 
  container.querySelectorAll(".edit-cita-btn").forEach(btn =>
    btn.addEventListener("click", () => openEditCita(parseInt(btn.dataset.idx)))
  );
}
 
// ─── CITAS CRUD ───────────────────────────────────────────
function createCita(e) {
  e.preventDefault();
  citasList.push({
    asunto: document.getElementById("citaAsunto").value,
    seller: document.getElementById("citaSeller").value,
    fecha:  document.getElementById("citaFecha").value,
    tipo:   document.getElementById("citaTipo").value,
    notas:  document.getElementById("citaNotas").value,
    source: "manual"
  });
  showToast("✅ Cita creada exitosamente");
  e.target.reset();
  renderCitas();
}
 
function openEditCita(idx) {
  const c = citasList[idx];
  document.getElementById("editCitaIdx").value    = idx;
  document.getElementById("editCitaAsunto").value = c.asunto;
  document.getElementById("editCitaFecha").value  = c.fecha;
  document.getElementById("editCitaTipo").value   = c.tipo;
  document.getElementById("editCitaNotas").value  = c.notas || "";
  document.getElementById("editCitaModal").classList.add("active");
}
 
function closeEditCita() {
  document.getElementById("editCitaModal")?.classList.remove("active");
}
 
function saveEditCita(e) {
  e.preventDefault();
  const idx = parseInt(document.getElementById("editCitaIdx").value);
  citasList[idx].asunto = document.getElementById("editCitaAsunto").value;
  citasList[idx].fecha  = document.getElementById("editCitaFecha").value;
  citasList[idx].tipo   = document.getElementById("editCitaTipo").value;
  citasList[idx].notas  = document.getElementById("editCitaNotas").value;
  showToast("✅ Cita modificada");
  closeEditCita();
  renderCitas();
}
 
// ─── AI CHAT ──────────────────────────────────────────────
function sendAiMsg() {
  const input = document.getElementById("aiInput");
  const text  = input.value.trim();
  if (!text) return;
  const msgs  = document.getElementById("aiMessages");
  msgs.innerHTML += `<div class="ai-msg user">${text}</div>`;
  input.value = "";
  const lower = text.toLowerCase();
 
  // Intent: agendar cita
  if (["agendar","cita","reunión","reunion","programar"].some(kw => lower.includes(kw))) {
    setTimeout(() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      const sellerName = lower.includes("roberto") ? "Roberto Martínez" : "Laura Restrepo";
      const asunto     = text.length > 30 ? text.substring(0, 30) + "..." : text;
      const newCita    = {
        asunto:  "Cita: " + asunto,
        seller:  sellerName,
        fecha:   tomorrow.toISOString().slice(0, 16),
        tipo:    "Consulta general",
        notas:   "Agendada por IA: " + text,
        source:  "ai"
      };
      citasList.push(newCita);
      renderCitas();
      const dateStr = tomorrow.toLocaleDateString("es-CO", { weekday:"long", day:"numeric", month:"long" });
      const newIdx  = citasList.length - 1;
      msgs.innerHTML += `
        <div class="ai-msg bot">📅 ¡Listo! He creado una cita para ti:
          <div class="ai-cita-card">
            <p><strong>Asunto:</strong> ${newCita.asunto}</p>
            <p><strong>Seller:</strong> ${newCita.seller}</p>
            <p><strong>Fecha:</strong> ${dateStr} a las 10:00 AM</p>
            <p><strong>Tipo:</strong> ${newCita.tipo}</p>
            <div class="cita-actions">
              <button class="btn-sm ai-go-citas">Ver mis citas</button>
              <button class="btn-sm ai-edit-cita" data-idx="${newIdx}">Modificar</button>
            </div>
          </div>
        </div>`;
      msgs.querySelector(".ai-go-citas")?.addEventListener("click", () => {
        document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
        document.getElementById("page-citas")?.classList.add("active");
      });
      msgs.querySelector(`.ai-edit-cita[data-idx="${newIdx}"]`)?.addEventListener("click", () =>
        openEditCita(newIdx)
      );
      msgs.scrollTop = msgs.scrollHeight;
    }, 800);
    return;
  }
 
  // Intent: buscar proyectos → real AI
  msgs.innerHTML += `<div class="ai-msg bot typing">Buscando...</div>`;
  msgs.scrollTop = msgs.scrollHeight;
 
  sendAiMessage(text, (botReply) => {
    const typing = msgs.querySelector(".typing");
    if (typing) typing.remove();
    msgs.innerHTML += `<div class="ai-msg bot">${botReply}</div>`;
    msgs.scrollTop = msgs.scrollHeight;
  });
}
 
// ─── INIT ─────────────────────────────────────────────────
export function clientLogic() {
  loadProjects(renderProjects);
  renderCitas();
  initAiChat();
  initProfileLogic({
    extraInfo: () => `<div><label>Seller asignado</label><strong>Laura Restrepo</strong></div>
      <div><label>Citas programadas</label><strong id="citasCount">0</strong></div>`
  });
 
  document.getElementById("aiSendBtn")?.addEventListener("click", sendAiMsg);
  document.getElementById("aiInput")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendAiMsg();
  });
 
  document.getElementById("newCitaForm")?.addEventListener("submit", createCita);
  initProjectModalListeners();
 
  document.getElementById("editCitaForm")?.addEventListener("submit", saveEditCita);
  document.getElementById("closeEditCitaBtn")?.addEventListener("click", closeEditCita);
  document.getElementById("cancelEditCitaBtn")?.addEventListener("click", closeEditCita);
  document.getElementById("editCitaModal")?.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-overlay")) closeEditCita();
  });
}