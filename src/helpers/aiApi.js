const AI_URL = "http://localhost:8001/api";
 
// Map backend roles to AI roles
const roleMap = {
  cliente:   "client",
  comercial: "staff",
  admin:     "staff",
};
 
export function getAiRole() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  return roleMap[userData.role] || "client";
}
 
export function getCompanyName() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  // For clients, username is the company name
  if (userData.role === "cliente") return userData.name || null;
  return null;
}
 
// POST /api/chat/init — welcome message
export async function aiChatInit({ role, company_name = null, language = "es" } = {}) {
  const res = await fetch(`${AI_URL}/chat/init`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, company_name, language }),
  });
  if (!res.ok) throw new Error("Error iniciando chat IA");
  return res.json(); // { welcome_message, company_profile }
}
 
// POST /api/chat — main chat
export async function aiChat({
  message,
  history = [],
  role,
  company_name = null,
  company_profile = null,
  language = "auto",
} = {}) {
  const res = await fetch(`${AI_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history, role, company_name, company_profile, language }),
  });
  if (!res.ok) throw new Error("Error en chat IA");
  return res.json(); // { text, language, projects, filters_applied }
}
 
// POST /api/projects/summary — AI summary for a specific project
export async function aiProjectSummary({ project, language = "es" } = {}) {
  const res = await fetch(`${AI_URL}/projects/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project, language }),
  });
  if (!res.ok) throw new Error("Error generando resumen IA");
  return res.json(); // { summary }
}