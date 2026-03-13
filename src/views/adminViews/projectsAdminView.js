export function projectsAdminView() {
  return `
    <div class="page" id="page-projects">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <h1 class="section-title" style="margin:0">Gestión de <span class="text-gradient">Proyectos</span></h1>
        <button class="btn-primary-sm" data-action="openProjectModal">+ Nuevo Proyecto</button>
      </div>
      <div class="filters">
        <input class="search-input" id="projectSearch" placeholder="Buscar proyectos...">
        <button class="filter-btn active" data-filter="project" data-value="all">Todos</button>
        <button class="filter-btn" data-filter="project" data-value="Básica">Básica</button>
        <button class="filter-btn" data-filter="project" data-value="Avanzada">Avanzada</button>
        <button class="filter-btn" data-filter="project" data-value="Complementos">Complementos</button>
        <button class="filter-btn" data-filter="project" data-value="Otra">Otra</button>
      </div>
      <div class="table-wrap">
        <div class="table-responsive">
          <table><thead><tr>
            <th>Proyecto</th><th>Nicho</th><th>Ruta</th>
            <th>Cohorte</th><th>Devs</th><th>Equipo</th><th>Rating</th><th>Demo</th><th>Acciones</th>
          </tr></thead>
          <tbody id="projectsTableBody"></tbody></table>
        </div>
      </div>
    </div>

    <div class="modal-overlay" id="projectModal">
      <div class="modal">
        <button class="modal-close" data-action="closeProjectModal">✕</button>
        <h2 id="projectModalTitle">Nuevo Proyecto</h2>
        <form id="projectForm">
          <input type="hidden" id="projectEditId" value="">
          <div class="form-group"><label>Nombre del proyecto</label><input type="text" id="project_name" required></div>
          <div class="form-group"><label>Descripción corta</label><input type="text" id="short_description" required></div>
          <div class="form-group"><label>Descripción completa</label><textarea id="complete_description"></textarea></div>
          <div class="form-group"><label>Nicho</label><input type="text" id="nicho" placeholder="Ej: E-Commerce"></div>
          <div class="form-group"><label>Tecnologías (separadas por coma)</label><input type="text" id="technologies" placeholder="React, Node.js"></div>
          <div class="form-group"><label>Link del proyecto desplegado</label><input type="text" id="project_link" placeholder="https://mi-proyecto.netlify.app"></div>
          <div class="form-group"><label>Link de GitHub</label><input type="text" id="github_link" placeholder="https://github.com/..."></div>
          <div class="form-group"><label>Imagen del proyecto (URL)</label><input type="text" id="media_url" placeholder="https://res.cloudinary.com/..."></div>
          <div class="form-group"><label>Tipo de media</label>
            <select id="media_type">
              <option value="image">Imagen</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div class="form-group"><label>Ruta</label>
            <select id="route_level">
              <option value="Básica">Básica</option>
              <option value="Avanzada">Avanzada</option>
              <option value="Complementos">Complementos</option>
              <option value="Otra">Otra</option>
            </select>
          </div>
          <div class="form-group"><label>Cohorte</label><input type="text" id="cohort" placeholder="Cohorte 6"></div>
          <div class="form-group">
            <label>Calificación</label>
            <div class="star-rating" id="starRating">
              <span data-action="setRating" data-val="1" style="cursor:pointer;pointer-events:auto">⭐</span>
              <span data-action="setRating" data-val="2" style="cursor:pointer;pointer-events:auto">⭐</span>
              <span data-action="setRating" data-val="3" style="cursor:pointer;pointer-events:auto">⭐</span>
              <span data-action="setRating" data-val="4" style="cursor:pointer;pointer-events:auto">⭐</span>
              <span data-action="setRating" data-val="5" style="cursor:pointer;pointer-events:auto">⭐</span>
            </div>
            <input type="hidden" id="pRating" value="0">
          </div>
          <div class="form-group">
            <label>Integrantes del equipo (3 a 6)</label>
            <div class="team-members-wrap" id="teamMembersWrap"></div>
            <button type="button" class="add-member-btn" data-action="addTeamMember" style="cursor:pointer;pointer-events:auto">+ Agregar integrante</button>
          </div>
          <div style="display:flex;gap:8px;margin-top:16px">
            <button type="submit" class="btn-sm">Guardar</button>
            <button type="button" class="btn-sm" data-action="closeProjectModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `;
}