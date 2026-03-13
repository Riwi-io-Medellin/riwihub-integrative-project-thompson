function showToast(msg, type) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.className = `toast toast-${type} show`;
  setTimeout(() => t.classList.remove("show"), 3000);
}

function selectRole(clickedBtn) {
  document.querySelectorAll(".role-btn").forEach(b => b.classList.remove("active"));
  clickedBtn.classList.add("active");
}

export function registerLogic() {
  document.querySelectorAll(".role-btn").forEach(btn => {
    btn.addEventListener("click", () => selectRole(btn));
  });

  const activeBtn = document.querySelector(".role-btn.active");
  if (activeBtn) selectRole(activeBtn);

  const form = document.getElementById("registerForm");
  if (!form || form.dataset.init) return;
  form.dataset.init = "true";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.textContent = "Creando cuenta...";
    submitBtn.disabled    = true;

    const role = document.querySelector(".role-btn.active")?.dataset.role || "cliente";

    const payload = {
      username:  document.getElementById("name").value.trim(),
      email:     document.getElementById("email").value.trim(),
      password:  document.getElementById("password").value,
      role_name: role,
    };

    try {
      await usersAPI.create(payload);
      showToast("¡Registro exitoso!", "success");
      form.reset();
      const firstBtn = document.querySelector(".role-btn");
      if (firstBtn) selectRole(firstBtn);
      // Redirect to login after short delay
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      showToast(error.message || "Error al crear la cuenta", "error");
    } finally {
      submitBtn.textContent = "Crear cuenta";
      submitBtn.disabled    = false;
    }
  });
}