import { authAPI } from "../helpers/api.js";


export async function initProfileLogic({ cargo = null, extraInfo = () => "" } = {}) {
  try {
    const { data: user } = await authAPI.getProfile();

    // Backend returns JWT payload: { userId, username, email, role, iat, exp }
    const createdAt = user.iat
      ? new Date(user.iat * 1000).toLocaleDateString("es-CO", { month: "long", year: "numeric" })
      : "—";

    document.getElementById("profileAvatar").textContent = user.username?.charAt(0).toUpperCase() || "?";
    document.getElementById("profileName").textContent   = user.username || "—";
    document.getElementById("profileEmail").textContent  = user.email    || "—";
    document.getElementById("profileInfo").innerHTML     = `
      ${cargo ? `<div><label>Cargo</label><strong>${cargo}</strong></div>` : ""}
      <div><label>Rol</label><strong>${user.role || "—"}</strong></div>
      <div><label>Sesión iniciada</label><strong>${createdAt}</strong></div>
      ${extraInfo(user)}
    `;
  } catch (err) {
    console.error("Profile error:", err);
    document.getElementById("profileName").textContent = "Error cargando perfil";
  }
}