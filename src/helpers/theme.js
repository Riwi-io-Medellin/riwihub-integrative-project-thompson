export function initTheme() {
  // Al cargar, lee lo guardado en localStorage (o 'light' por defecto)
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateToggleIcon(saved);
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);   // ← persiste entre recargas
  updateToggleIcon(next);
}

// Actualiza el ícono del botón (☀️ / 🌙) en cualquier navbar activo
function updateToggleIcon(theme) {
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}