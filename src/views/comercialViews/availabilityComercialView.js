export function availabilityComercialView() {
  return `
    <div class="page" id="page-availability">
      <h1 class="section-title">Mi <span class="text-gradient">Disponibilidad</span></h1>
      <div class="cita-card" style="max-width:1200px">
        <h2>Configurar Disponibilidad</h2>
        <p style="font-size:.85rem;color:var(--muted);margin-bottom:16px">
          Selecciona los horarios en los que estás disponible para que la IA pueda agendar citas automáticamente.
        </p>
        <div class="avail-grid" id="availGrid"></div>
        <button class="btn-sm" id="saveAvailabilityBtn" style="margin-top:20px">
          Guardar disponibilidad
        </button>
      </div>
    </div>
  `;
}