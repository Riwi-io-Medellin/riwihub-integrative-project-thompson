export function dashboardAdminView() {
  return `
    <div class="page active" id="page-overview">
      <h1 class="section-title">Dashboard <span class="text-gradient">Admin</span></h1>
      <div class="stats-row">
        <div class="stat-card"><div class="stat-val" id="statProjects">0</div><div class="stat-label">Proyectos</div></div>
        <div class="stat-card"><div class="stat-val" id="statUsers">0</div><div class="stat-label">Usuarios</div></div>
        <div class="stat-card"><div class="stat-val" id="statDevs">0</div><div class="stat-label">Desarrolladores</div></div>
        <div class="stat-card"><div class="stat-val" id="statRating">0</div><div class="stat-label">Rating promedio</div></div>
      </div>
      <div class="table-wrap" style="margin-bottom:16px">
        <div class="table-header"><h3>Usuarios recientes</h3></div>
        <div class="table-responsive">
          <table><thead><tr><th>Nombre</th><th>Rol</th><th>Último acceso</th></tr></thead>
          <tbody id="recentUsersTable"></tbody></table>
        </div>
      </div>
      <div class="table-wrap">
        <div class="table-header"><h3>Proyectos recientes</h3></div>
        <div class="table-responsive">
          <table><thead><tr><th>Proyecto</th><th>Ruta</th><th>Devs</th><th>Demo</th></tr></thead>
          <tbody id="recentProjectsTable"></tbody></table>
        </div>
      </div>
    </div>
  `;
}