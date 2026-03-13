export function appointmentComercialView() {
  return `
    <div class="page" id="page-citas">
      <h1 class="section-title">Gestión de <span class="text-gradient">Citas</span></h1>
      <div class="cita-card" style="margin-bottom:20px">
        <h2>Notificaciones</h2>
        <div id="notificationsList"></div>
      </div>
      <div class="citas-grid">
        <div class="cita-card">
          <h2>Nueva Cita</h2>
          <form id="newCitaForm">
            <div class="form-group"><label>Cliente</label><input type="text" id="citaCliente" required></div>
            <div class="form-group"><label>Asunto</label><input type="text" id="citaAsunto" required></div>
            <div class="form-group"><label>Fecha y hora</label><input type="datetime-local" id="citaFecha" required></div>
            <div class="form-group"><label>Tipo</label>
              <select id="citaTipo">
                <option>Demo</option>
                <option>Seguimiento</option>
                <option>Presentación</option>
                <option>Cierre</option>
                <option>Consulta general</option>
              </select>
            </div>
            <div class="form-group"><label>Notas</label><textarea id="citaNotas"></textarea></div>
            <button type="submit" class="btn-sm">Crear cita →</button>
          </form>
        </div>
        <div class="cita-card">
          <h2>Todas las Citas</h2>
          <div id="citasList"></div>
        </div>
      </div>
    </div>

    <!-- Modal editar cita va aquí, dentro de su vista -->
    <div class="modal-overlay" id="editCitaModal">
      <div class="modal" style="max-width:500px">
        <button class="modal-close" id="closeEditCitaBtn">✕</button>
        <h2>Editar Cita</h2>
        <form id="editCitaForm">
          <input type="hidden" id="editCitaIdx" value="-1">
          <div class="form-group"><label>Cliente</label><input type="text" id="editCitaCliente" required></div>
          <div class="form-group"><label>Asunto</label><input type="text" id="editCitaAsunto" required></div>
          <div class="form-group"><label>Fecha y hora</label><input type="datetime-local" id="editCitaFecha" required></div>
          <div class="form-group"><label>Tipo</label>
            <select id="editCitaTipo">
              <option>Demo</option>
              <option>Seguimiento</option>
              <option>Presentación</option>
              <option>Cierre</option>
              <option>Consulta general</option>
            </select>
          </div>
          <div class="form-group"><label>Notas</label><textarea id="editCitaNotas"></textarea></div>
          <div style="display:flex;gap:8px;margin-top:16px">
            <button type="submit" class="btn-sm">Guardar cambios</button>
            <button type="button" class="btn-sm" id="cancelEditCitaBtn">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `;
}