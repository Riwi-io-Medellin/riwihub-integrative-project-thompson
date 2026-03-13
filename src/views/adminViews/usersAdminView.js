export function usersAdminView() {
  return `
    <div class="page" id="page-users">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <h1 class="section-title" style="margin:0">Gestión de <span class="text-gradient">Usuarios</span></h1>
        <button class="btn-primary-sm" data-action="openUserModal">+ Nuevo Usuario</button>
      </div>
      <div class="filters">
        <input class="search-input" id="userSearch" placeholder="Buscar usuarios...">
        <button class="filter-btn active" data-filter="user" data-value="all">Todos</button>
        <button class="filter-btn" data-filter="user" data-value="admin">Admin</button>
        <button class="filter-btn" data-filter="user" data-value="comercial">Comercial</button>
        <button class="filter-btn" data-filter="user" data-value="cliente">Cliente</button>
      </div>
      <div class="table-wrap">
        <div class="table-responsive">
          <table><thead><tr>
            <th></th><th>Nombre</th><th>Email</th><th>Rol</th>
            <th>Último acceso</th><th>Acciones</th>
          </tr></thead>
          <tbody id="usersTableBody"></tbody></table>
        </div>
      </div>
    </div>

    <div class="modal-overlay" id="userModal">
      <div class="modal">
        <button class="modal-close" data-action="closeUserModal">✕</button>
        <h2 id="userModalTitle">Nuevo Usuario</h2>
        <form id="userForm">
          <input type="hidden" id="userEditId" value="">
          <div class="form-group"><label>Nombre de usuario</label><input type="text" id="uUsername" required></div>
          <div class="form-group"><label>Email</label><input type="email" id="uEmail" required></div>
          <div class="form-group"><label>Contraseña</label><input type="password" id="uPassword" placeholder="Dejar vacío para no cambiar"></div>
          <div class="form-group"><label>Rol</label>
            <select id="uRole">
              <option value="cliente">Cliente</option>
              <option value="comercial">Comercial</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div style="display:flex;gap:8px;margin-top:16px">
            <button type="submit" class="btn-sm">Guardar</button>
            <button type="button" class="btn-sm" data-action="closeUserModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `;
}