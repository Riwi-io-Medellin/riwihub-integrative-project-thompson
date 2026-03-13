import { projectsAPI, usersAPI, mediaProjectsAPI } from "../helpers/api.js";
import { initProfileLogic } from "./profileShared.js";

// STATE 
let projectsList = [];
let usersList    = [];
let mediaByProject = {}; // { project_id: { media_project_id, media_url, media_type } }

let currentProjectFilter = "all";
let currentUserFilter    = "all";
let currentRating        = 0;

//  MAPS 
const roleColorMap   = { admin: "badge-admin", comercial: "badge-staff", cliente: "badge-client" };
const statusColorMap = { "Básica": "badge-basica", "Avanzada": "badge-avanzada", "Complementos": "badge-avanzada", "Otra": "badge-basica" };
const icons          = ["🛒","🚀","🏠","📊","📚","💰","💬","📅","🎮","🎨","🔧","📱"];

// HELPERS 
function renderStars(rating) {
  let s = "";
  for (let i = 1; i <= 5; i++) s += i <= Math.round(rating) ? "⭐" : "☆";
  return s + " " + Number(rating).toFixed(1);
}

function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

//  SUBVISTAS 
import { showPage } from "../helpers/showPage.js";

//  RENDER TABLAS 
export function renderProjectsTable() {
  const search   = document.getElementById("projectSearch")?.value.toLowerCase() || "";
  const filtered = projectsList.filter(p => {
    const techs = (p.technologies || []).join(" ").toLowerCase();
    const matchSearch = p.project_name.toLowerCase().includes(search)
      || (p.nicho || "").toLowerCase().includes(search)
      || techs.includes(search);
    const matchStatus = currentProjectFilter === "all" || p.route_level === currentProjectFilter;
    return matchSearch && matchStatus;
  });

  document.getElementById("projectsTableBody").innerHTML = filtered.map(p => {
    const teamStr = (p.coders || []).map(c => c.coder_name || c.name).join(", ") || "—";
    const icon    = icons[p.project_id % icons.length];
    return `<tr>
      <td><strong>${icon} ${p.project_name}</strong><br>
        <span style="font-size:.7rem;color:var(--muted)">${p.short_description || ""}</span>
      </td>
      <td>${p.nicho || "—"}</td>
      <td><span class="badge ${statusColorMap[p.route_level] || "badge-basica"}">${p.route_level}</span></td>
      <td style="font-size:.8rem;color:var(--primary)">${p.cohort || "—"}</td>
      <td>${(p.coders || []).length}</td>
      <td style="font-size:.7rem;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${teamStr}">${teamStr}</td>
      <td>${renderStars(p.rating || 0)}</td>
      <td><a href="${p.project_link || "#"}" target="_blank">${p.project_link || "—"}</a></td>
      <td><div style="display:flex;gap:4px">
        <button class="btn-sm" data-action="editProject" data-id="${p.project_id}">✏️</button>
        <button class="btn-danger-sm" data-action="deleteProject" data-id="${p.project_id}">🗑️</button>
      </div></td>
    </tr>`;
  }).join("");
}

export function renderUsersTable() {
  const search   = document.getElementById("userSearch")?.value.toLowerCase() || "";
  const filtered = usersList.filter(u => {
    const matchSearch = u.username.toLowerCase().includes(search)
      || u.email.toLowerCase().includes(search);
    const matchRole = currentUserFilter === "all" || u.role_name === currentUserFilter;
    return matchSearch && matchRole;
  });

  document.getElementById("usersTableBody").innerHTML = filtered.map(u => {
    const lastLogin = u.last_login
      ? new Date(u.last_login).toLocaleDateString("es-CO")
      : "—";
    return `<tr>
      <td><div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--accent));display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:var(--primary-fg)">${u.username.charAt(0).toUpperCase()}</div></td>
      <td><strong>${u.username}</strong></td>
      <td style="color:var(--muted)">${u.email}</td>
      <td><span class="badge ${roleColorMap[u.role_name] || ""}">${u.role_name}</span></td>
      <td style="color:var(--muted)">${lastLogin}</td>
      <td><div style="display:flex;gap:4px">
        <button class="btn-sm" data-action="editUser" data-id="${u.user_id}">✏️</button>
        <button class="btn-danger-sm" data-action="deleteUser" data-id="${u.user_id}">🗑️</button>
      </div></td>
    </tr>`;
  }).join("");
}

export function renderRecentTables() {
  document.getElementById("recentUsersTable").innerHTML = usersList.slice(0, 5).map(u => {
    const lastLogin = u.last_login
      ? new Date(u.last_login).toLocaleDateString("es-CO")
      : "—";
    return `<tr>
      <td>${u.username}</td>
      <td><span class="badge ${roleColorMap[u.role_name] || ""}">${u.role_name}</span></td>
      <td style="color:var(--muted)">${lastLogin}</td>
    </tr>`;
  }).join("");

  document.getElementById("recentProjectsTable").innerHTML = projectsList.slice(0, 5).map(p =>
    `<tr>
      <td>${icons[p.project_id % icons.length]} ${p.project_name}</td>
      <td><span class="badge ${statusColorMap[p.route_level] || "badge-basica"}">${p.route_level}</span></td>
      <td>${(p.coders || []).length}</td>
      <td><a href="${p.project_link || "#"}" target="_blank">${p.project_link || "—"}</a></td>
    </tr>`
  ).join("");

  document.getElementById("statProjects").textContent = projectsList.length;
  document.getElementById("statUsers").textContent    = usersList.length;
  document.getElementById("statDevs").textContent     = projectsList.reduce((a, p) => a + (p.coders || []).length, 0);
  const avg = projectsList.length
    ? (projectsList.reduce((a, p) => a + (p.rating || 0), 0) / projectsList.length).toFixed(1)
    : "0.0";
  document.getElementById("statRating").textContent = avg;
}

// LOAD DATA 
async function loadData() {
  try {
    const [rawProjects, rawUsers, rawMedia] = await Promise.all([
      projectsAPI.getAll(),
      usersAPI.getAll(),
      mediaProjectsAPI.getAll(),
    ]);
    projectsList = rawProjects || [];
    usersList    = rawUsers    || [];

    // Build map: project_id → first media entry found
    mediaByProject = {};
    for (const m of (rawMedia || [])) {
      if (!mediaByProject[m.project_id]) {
        mediaByProject[m.project_id] = m;
      }
    }

    renderProjectsTable();
    renderUsersTable();
    renderRecentTables();
  } catch (error) {
    showToast(`❌ Error cargando datos: ${error.message}`);
  }
}

//  TEAM MEMBERS 
function updateRemoveButtons() {
  const rows = document.querySelectorAll(".team-member-row");
  rows.forEach(r => r.querySelector("button").style.display = rows.length > 3 ? "block" : "none");
}

function addTeamMember() {
  const wrap  = document.getElementById("teamMembersWrap");
  const count = wrap.querySelectorAll(".team-member-row").length;
  if (count >= 6) { showToast("⚠️ Máximo 6 integrantes"); return; }
  const row   = document.createElement("div");
  row.className = "team-member-row";
  row.innerHTML = `<input type="text" placeholder="Nombre integrante ${count + 1}" class="team-member-input"><button type="button" data-action="removeTeamMember">✕</button>`;
  wrap.appendChild(row);
  updateRemoveButtons();
}

function removeTeamMember(btn) {
  const wrap  = document.getElementById("teamMembersWrap");
  const count = wrap.querySelectorAll(".team-member-row").length;
  if (count <= 3) { showToast("⚠️ Mínimo 3 integrantes"); return; }
  btn.parentElement.remove();
  updateRemoveButtons();
}

function getTeamMembers() {
  return Array.from(document.querySelectorAll(".team-member-input"))
    .map(i => i.value.trim()).filter(Boolean);
}

function setTeamMembers(members) {
  const wrap = document.getElementById("teamMembersWrap");
  wrap.innerHTML = "";
  const list = members.length >= 3 ? members : ["", "", ""];
  list.forEach((m, i) => {
    const row = document.createElement("div");
    row.className = "team-member-row";
    row.innerHTML = `<input type="text" placeholder="Nombre integrante ${i + 1}" class="team-member-input" value="${m}">
      <button type="button" data-action="removeTeamMember" style="${list.length > 3 ? "" : "display:none"}">✕</button>`;
    wrap.appendChild(row);
  });
}

//RATING 
function setRating(val) {
  currentRating = val;
  document.getElementById("pRating").value = val;
  document.querySelectorAll("#starRating span").forEach(s =>
    s.classList.toggle("active", parseInt(s.dataset.val) <= val)
  );
}

//MODAL PROYECTO ─
function openProjectModal(id) {
  document.getElementById("projectEditId").value = id || "";

  if (id) {
    const p = projectsList.find(p => p.project_id === id);
    if (!p) return;
    document.getElementById("projectModalTitle").textContent      = "Editar Proyecto";
    document.getElementById("project_name").value                 = p.project_name       || "";
    document.getElementById("short_description").value            = p.short_description  || "";
    document.getElementById("complete_description").value         = p.complete_description || "";
    document.getElementById("nicho").value                        = p.nicho              || "";
    document.getElementById("technologies").value                 = (p.technologies || []).join(", ");
    document.getElementById("project_link").value                 = p.project_link       || "";
    document.getElementById("github_link").value                  = p.github_link        || "";
    document.getElementById("route_level").value                  = p.route_level        || "Básica";
    document.getElementById("cohort").value                       = p.cohort             || "";
    // Load existing media if any
    const existingMedia = mediaByProject[p.project_id];
    document.getElementById("media_url").value  = existingMedia?.media_url  || "";
    document.getElementById("media_type").value = existingMedia?.media_type || "image";
    setRating(Math.round(p.rating || 0));
    setTeamMembers((p.coders || []).map(c => c.coder_name || c.name));
  } else {
    document.getElementById("projectModalTitle").textContent = "Nuevo Proyecto";
    document.querySelectorAll("#projectModal input:not([type=hidden]),#projectModal textarea,#projectModal select")
      .forEach(el => el.value = "");
    document.getElementById("route_level").value = "Básica";
    document.getElementById("media_type").value  = "image";
    setRating(0);
    setTeamMembers(["", "", ""]);
  }
  document.getElementById("projectModal").classList.add("active");
}

function closeProjectModal() {
  document.getElementById("projectModal").classList.remove("active");
}

async function saveProject(e) {
  e.preventDefault();
  const id   = document.getElementById("projectEditId").value;
  const team = getTeamMembers();
  if (team.length < 3) { showToast("⚠️ Mínimo 3 integrantes"); return; }
  if (team.length > 6) { showToast("⚠️ Máximo 6 integrantes"); return; }

  const payload = {
    project_name:         document.getElementById("project_name").value,
    short_description:    document.getElementById("short_description").value,
    complete_description: document.getElementById("complete_description").value,
    nicho:                document.getElementById("nicho").value,
    route_level:          document.getElementById("route_level").value,
    project_link:         document.getElementById("project_link").value,
    github_link:          document.getElementById("github_link").value,
    cohort:               document.getElementById("cohort").value,
    rating:               parseFloat(document.getElementById("pRating").value) || 0,
    coders:               team.map(name => ({ coder_name: name })),
    technologies:         document.getElementById("technologies").value
                            .split(",").map(s => s.trim()).filter(Boolean)
                            .map(name => ({ technology_name: name })),
  };

  try {
    let savedId = id;
    if (id) {
      await projectsAPI.update(id, payload);
      showToast("✅ Proyecto actualizado");
    } else {
      const result = await projectsAPI.create(payload);
      savedId = result?.project_id;
      showToast("✅ Proyecto creado");
    }

    // Handle media separately via /api/media-projects
    const mediaUrl  = document.getElementById("media_url").value.trim();
    const mediaType = document.getElementById("media_type").value;
    if (mediaUrl && savedId) {
      const existingMedia = mediaByProject[savedId];
      if (existingMedia) {
        // Update existing media record
        await mediaProjectsAPI.update(existingMedia.media_project_id, {
          media_url:  mediaUrl,
          media_type: mediaType,
          project_id: parseInt(savedId),
        });
      } else {
        // Create new media record
        await mediaProjectsAPI.create({
          media_url:  mediaUrl,
          media_type: mediaType,
          project_id: parseInt(savedId),
        });
      }
    }

    closeProjectModal();
    await loadData();
  } catch (error) {
    showToast(`❌ ${error.message}`);
  }
}

// MODAL USUARIO 
function openUserModal(id) {
  document.getElementById("userEditId").value = id || "";

  if (id) {
    const u = usersList.find(u => u.user_id === id);
    if (!u) return;
    document.getElementById("userModalTitle").textContent = "Editar Usuario";
    document.getElementById("uUsername").value = u.username;
    document.getElementById("uEmail").value    = u.email;
    document.getElementById("uRole").value     = u.role_name;
    document.getElementById("uPassword").value = "";
  } else {
    document.getElementById("userModalTitle").textContent = "Nuevo Usuario";
    document.querySelectorAll("#userModal input,#userModal select").forEach(el => {
      if (el.type !== "hidden") el.value = el.tagName === "SELECT" ? "cliente" : "";
    });
  }
  document.getElementById("userModal").classList.add("active");
}

function closeUserModal() {
  document.getElementById("userModal").classList.remove("active");
}

async function saveUser(e) {
  e.preventDefault();
  const id       = document.getElementById("userEditId").value;
  const password = document.getElementById("uPassword").value;

  const payload = {
    username:  document.getElementById("uUsername").value,
    email:     document.getElementById("uEmail").value,
    role_name: document.getElementById("uRole").value,
    ...(password ? { password } : {}),
  };

  try {
    if (id) {
      await usersAPI.update(id, payload);
      showToast("✅ Usuario actualizado");
    } else {
      await usersAPI.create(payload);
      showToast("✅ Usuario creado");
    }
    closeUserModal();
    await loadData();
  } catch (error) {
    showToast(`❌ ${error.message}`);
  }
}

// INIT 
export function adminLogic() {
  loadData();
  initProfileLogic({ cargo: "Administrador" });

  const app = document.getElementById("app");

  app.addEventListener("click", (e) => {
    const action = e.target.dataset.action || e.target.closest("[data-action]")?.dataset.action;
    const id     = e.target.dataset.id     || e.target.closest("[data-id]")?.dataset.id;
    const numId  = id ? parseInt(id) : undefined;

    switch (action) {
      case "openProjectModal":  openProjectModal(); break;
      case "closeProjectModal": closeProjectModal(); break;
      case "editProject":       openProjectModal(numId); break;
      case "deleteProject":
        if (!confirm("¿Eliminar este proyecto?")) return;
        projectsAPI.delete(numId)
          .then(() => { showToast("Proyecto eliminado"); return loadData(); })
          .catch(err => showToast(`❌ ${err.message}`));
        break;
      case "openUserModal":  openUserModal(); break;
      case "closeUserModal": closeUserModal(); break;
      case "editUser":       openUserModal(numId); break;
      case "deleteUser":
        if (!confirm("¿Eliminar este usuario?")) return;
        usersAPI.delete(numId)
          .then(() => { showToast("Usuario eliminado"); return loadData(); })
          .catch(err => showToast(`❌ ${err.message}`));
        break;
      case "addTeamMember":    addTeamMember(); break;
      case "removeTeamMember": removeTeamMember(e.target); break;
      case "setRating":        setRating(parseInt(e.target.dataset.val)); break;
    }

    if (e.target.classList.contains("modal-overlay")) {
      closeProjectModal();
      closeUserModal();
    }

    if (e.target.matches("[data-filter='project']")) {
      currentProjectFilter = e.target.dataset.value;
      document.querySelectorAll("[data-filter='project']").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      renderProjectsTable();
    }
    if (e.target.matches("[data-filter='user']")) {
      currentUserFilter = e.target.dataset.value;
      document.querySelectorAll("[data-filter='user']").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      renderUsersTable();
    }
  });

  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-view]")) {
      e.preventDefault();
      showPage(e.target.dataset.view);
    }
  });

  document.getElementById("projectSearch")?.addEventListener("input", renderProjectsTable);
  document.getElementById("userSearch")?.addEventListener("input", renderUsersTable);
  document.getElementById("projectForm")?.addEventListener("submit", saveProject);
  document.getElementById("userForm")?.addEventListener("submit", saveUser);
}