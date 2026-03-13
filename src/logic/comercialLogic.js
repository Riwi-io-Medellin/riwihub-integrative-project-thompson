import {
  loadProjects, renderProjects, handleProjectSearch,
  initProjectModalListeners, showToast, initAiChat, sendAiMessage
} from "./projectsShared.js";
import { initProfileLogic } from "./profileShared.js";
 
// APPOINTMENT hardcoded for demo
let citasList = [
  { cliente:"TechCorp S.A.",     asunto:"Demo E-Commerce",       fecha:"2026-03-05T10:00", tipo:"Demo",         notas:"Presentar plataforma", source:"manual" },
  { cliente:"InnovaLab",         asunto:"Seguimiento CRM",        fecha:"2026-03-05T14:30", tipo:"Seguimiento",  notas:"Revisar avances",      source:"manual" },
  { cliente:"Digital Solutions", asunto:"Presentación propuesta", fecha:"2026-03-06T09:00", tipo:"Presentación", notas:"",                     source:"manual" },
  { cliente:"CloudBase",         asunto:"Cierre de contrato",     fecha:"2026-03-07T11:00", tipo:"Cierre",       notas:"Preparar documentos",  source:"ai"     },
];
 
// NOTIFICATIONS hardcoded for demo 
let notifications = [
  { text:"Nueva cita agendada por IA: CloudBase - Cierre de contrato", unread:true,  time:"Hace 10 min" },
  { text:"TechCorp S.A. modificó la cita de Demo E-Commerce",          unread:true,  time:"Hace 30 min" },
  { text:"Cita con InnovaLab confirmada para hoy",                      unread:false, time:"Hace 2h"     },
];
 
// AVAILABILITY hardcoded for demo
let availability = {};
const days      = ["Lunes","Martes","Miércoles","Jueves","Viernes"];
const timeSlots = ["8:00-10:00","10:00-12:00","14:00-16:00","16:00-18:00"];
days.forEach(d => timeSlots.forEach(t => { availability[d + "-" + t] = Math.random() > 0.4; }));
 
// RENDER APPOINTMENTS
function renderCitas() {
  const container = document.getElementById("citasList");
  if (!container) return;
  if (!citasList.length) {
    container.innerHTML = `<p style="color:var(--muted);font-size:.85rem">No hay citas.</p>`;
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
          <p>${c.cliente} · ${dateStr} · ${timeStr} · ${c.tipo}</p>
        </div>
        <div class="meeting-actions">
          ${badge}
          <button class="btn-sm edit-cita-btn" data-idx="${i}">✏️</button>
          <button class="btn-danger-sm delete-cita-btn" data-idx="${i}">🗑️</button>
        </div>
      </div>`;
  }).join("");
 
  container.querySelectorAll(".edit-cita-btn").forEach(btn =>
    btn.addEventListener("click", () => openEditCita(parseInt(btn.dataset.idx)))
  );
  container.querySelectorAll(".delete-cita-btn").forEach(btn =>
    btn.addEventListener("click", () => deleteCita(parseInt(btn.dataset.idx)))
  );
}
 
// APPOINTMENT CRUD 
function createCita(e) {
  e.preventDefault();
  citasList.push({
    cliente: document.getElementById("citaCliente").value,
    asunto:  document.getElementById("citaAsunto").value,
    fecha:   document.getElementById("citaFecha").value,
    tipo:    document.getElementById("citaTipo").value,
    notas:   document.getElementById("citaNotas").value,
    source:  "manual"
  });
  showToast("✅ Cita creada");
  e.target.reset();
  renderCitas();
}
 
function deleteCita(idx) {
  if (confirm(`¿Eliminar cita "${citasList[idx].asunto}"?`)) {
    citasList.splice(idx, 1);
    renderCitas();
    showToast("Cita eliminada");
  }
}
 
function openEditCita(idx) {
  const c = citasList[idx];
  document.getElementById("editCitaIdx").value     = idx;
  document.getElementById("editCitaCliente").value = c.cliente;
  document.getElementById("editCitaAsunto").value  = c.asunto;
  document.getElementById("editCitaFecha").value   = c.fecha;
  document.getElementById("editCitaTipo").value    = c.tipo;
  document.getElementById("editCitaNotas").value   = c.notas || "";
  document.getElementById("editCitaModal").classList.add("active");
}
 
function closeEditCita() {
  document.getElementById("editCitaModal")?.classList.remove("active");
}
 
function saveEditCita(e) {
  e.preventDefault();
  const idx = parseInt(document.getElementById("editCitaIdx").value);
  citasList[idx].cliente = document.getElementById("editCitaCliente").value;
  citasList[idx].asunto  = document.getElementById("editCitaAsunto").value;
  citasList[idx].fecha   = document.getElementById("editCitaFecha").value;
  citasList[idx].tipo    = document.getElementById("editCitaTipo").value;
  citasList[idx].notas   = document.getElementById("editCitaNotas").value;
  showToast("✅ Cita actualizada");
  closeEditCita();
  renderCitas();
}
 
// NOTIFICATIONS 
function renderNotifications() {
  const container = document.getElementById("notificationsList");
  if (!container) return;
  container.innerHTML = notifications.map((n, i) => `
    <div class="notif-item ${n.unread ? "unread" : ""}" data-idx="${i}" style="cursor:pointer">
      ${n.unread ? `<div class="notif-dot"></div>` : `<div style="width:8px"></div>`}
      <div>
        <span>${n.text}</span><br>
        <span style="font-size:.7rem;color:var(--muted)">${n.time}</span>
      </div>
    </div>`).join("");
 
  container.querySelectorAll(".notif-item").forEach(item =>
    item.addEventListener("click", () => {
      notifications[parseInt(item.dataset.idx)].unread = false;
      renderNotifications();
    })
  );
 
  const notifCount = document.getElementById("notifCount");
  if (notifCount) notifCount.textContent = notifications.filter(n => n.unread).length;
}
 
// AVAILABILITY 
function renderAvailability() {
  const grid = document.getElementById("availGrid");
  if (!grid) return;
  grid.innerHTML = "";
  days.forEach(d => {
    timeSlots.forEach(t => {
      const key  = d + "-" + t;
      const slot = document.createElement("div");
      slot.className = "avail-slot" + (availability[key] ? " active" : "");
      slot.innerHTML = `<div class="day">${d}</div><div class="time">${t}</div>`;
      slot.addEventListener("click", () => {
        availability[key] = !availability[key];
        renderAvailability();
      });
      grid.appendChild(slot);
    });
  });
}
 
// AI CHAT 
function sendAiMsg() {
  const input = document.getElementById("aiInput");
  const text  = input.value.trim();
  if (!text) return;
  const msgs  = document.getElementById("aiMessages");
  msgs.innerHTML += `<div class="ai-msg user">${text}</div>`;
  input.value = "";
 
  msgs.innerHTML += `<div class="ai-msg bot typing">Pensando..</div>`;
  msgs.scrollTop = msgs.scrollHeight;
 
  sendAiMessage(text, (botReply) => {
    const typing = msgs.querySelector(".typing");
    if (typing) typing.remove();
    msgs.innerHTML += `<div class="ai-msg bot">${botReply}</div>`;
    msgs.scrollTop = msgs.scrollHeight;
  });
}
 
// INIT 
export function comercialLogic() {
  loadProjects(renderProjects);
  renderCitas();
  renderNotifications();
  renderAvailability();
  initAiChat();
  initProfileLogic({
    cargo: "Ejecutivo Comercial",
    extraInfo: () => `<div><label>Clientes contactados</label><strong>23</strong></div>
      <div><label>Citas esta semana</label><strong>8</strong></div>
      <div><label>Disponibilidad</label><strong>Configurada</strong></div>`
  });
 
  document.getElementById("aiSendBtn")?.addEventListener("click", sendAiMsg);
  document.getElementById("aiInput")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendAiMsg();
  });
 
  document.getElementById("newCitaForm")?.addEventListener("submit", createCita);
  document.getElementById("saveAvailabilityBtn")?.addEventListener("click", () =>
    showToast("✅ Disponibilidad guardada. La IA usará estos horarios.")
  );
 
  initProjectModalListeners();
 
  document.getElementById("editCitaForm")?.addEventListener("submit", saveEditCita);
  document.getElementById("closeEditCitaBtn")?.addEventListener("click", closeEditCita);
  document.getElementById("cancelEditCitaBtn")?.addEventListener("click", closeEditCita);
  document.getElementById("editCitaModal")?.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-overlay")) closeEditCita();
  });
}