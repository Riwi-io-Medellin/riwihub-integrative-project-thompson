export function appointmentClientView() {
  return `
    <div class="page" id="page-citas">
      <h1 class="section-title">Mis <span class="text-gradient">Citas</span></h1>
      <div class="citas-grid">
        <div class="cita-card">
          <h2>Nueva Cita</h2>
          <form id="newCitaForm">
            <div class="form-group"><label>Asunto</label><input type="text" id="citaAsunto" required placeholder="Tema de la reunión"></div>
            <div class="form-group"><label>Seller</label>
              <select id="citaSeller">
                <option>Laura Restrepo</option>
                <option>Roberto Martínez</option>
              </select>
            </div>
            <div class="form-group"><label>Fecha y hora</label><input type="datetime-local" id="citaFecha" required></div>
            <div class="form-group"><label>Tipo</label>
              <select id="citaTipo">
                <option>Demo de proyecto</option>
                <option>Seguimiento</option>
                <option>Presentación</option>
                <option>Consulta general</option>
              </select>
            </div>
            <div class="form-group"><label>Notas</label><textarea id="citaNotas" placeholder="Detalles adicionales..."></textarea></div>
            <button type="submit" class="btn-sm">Crear cita →</button>
          </form>
        </div>
        <div class="cita-card">
          <h2>Mis Citas</h2>
          <div id="citasList"></div>
        </div>
      </div>
    </div>

    <!-- Modal editar cita — dentro de su vista -->
    <div class="modal-overlay" id="editCitaModal">
      <div class="modal" style="max-width:500px">
        <button class="modal-close" id="closeEditCitaBtn">✕</button>
        <h2>Editar Cita</h2>
        <form id="editCitaForm">
          <input type="hidden" id="editCitaIdx" value="-1">
          <div class="form-group"><label>Asunto</label><input type="text" id="editCitaAsunto" required></div>
          <div class="form-group"><label>Fecha y hora</label><input type="datetime-local" id="editCitaFecha" required></div>
          <div class="form-group"><label>Tipo</label>
            <select id="editCitaTipo">
              <option>Demo de proyecto</option>
              <option>Seguimiento</option>
              <option>Presentación</option>
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