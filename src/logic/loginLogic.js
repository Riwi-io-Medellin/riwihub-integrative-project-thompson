import { authAPI, setAccessToken } from "../helpers/api.js";
import { navigate } from "../main.js";

export function loginLogic() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const btn = document.getElementById("submitBtn");

    btn.disabled = true;
    btn.textContent = "Iniciando...";

    try {
      const data = await authAPI.login(email, password);

      // Save access token and user info from the response
      // Store access token for future authenticated requests
      setAccessToken(data.data.accessToken);

      // Store user info for route guards and UI rendering
      // role comes lowercase from backend: "admin" | "cliente" | "comercial"
      localStorage.setItem("userData", JSON.stringify({
        id:    data.data.user.id,
        name:  data.data.user.username,  // backend returns "username" not "name"
        email: data.data.user.email,
        role:  data.data.user.role,
      }));

      showToast("¡Login exitoso!", "success");
      setTimeout(() => navigate("/"), 1000);

    } catch (error) {
      const msg = error.message === "INVALID_CREDENTIALS"
        ? "Correo o contraseña incorrectos"
        : error.message || "Error al iniciar sesión";
      showToast(msg, "error");
      btn.disabled = false;
      btn.textContent = "Iniciar Sesión";
    }
  });
}

function showToast(msg, type) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.className = `toast toast-${type} show`;
  setTimeout(() => t.classList.remove("show"), 1500);
}