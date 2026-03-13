export function projectsClientView() {
  return `
    <div class="page active" id="page-projects">
      <h1 class="section-title">Catálogo de <span class="text-gradient">Proyectos</span></h1>
      <div class="projects-layout">
        <div class="ai-chat">
          <div class="ai-chat-header">🤖 <span>Asistente IA</span> — Busca y agenda</div>
          <div class="ai-messages" id="aiMessages">
              <div class="ai-msg bot">Cargando asistente...</div>
          </div>
          <div class="ai-input-wrap">
            <input type="text" id="aiInput" placeholder="Buscar proyectos o agendar cita...">
            <button id="aiSendBtn">Enviar</button>
          </div>
        </div>
        <div class="projects-grid" id="projectsGrid"></div>
      </div>
    </div>

    <!-- Modal proyecto — dentro de su vista -->
    <div class="modal-overlay" id="projectModal">
      <div class="modal">
        <button class="modal-close" id="closeProjectModal">✕</button>
        <div class="modal-thumb" id="modalThumb"></div>
        <h2 id="modalTitle"></h2>
        <p class="modal-desc" id="modalDesc"></p>
        <div class="modal-meta" id="modalMeta"></div>
        <div class="project-tags" id="modalTags"></div>
        <p class="modal-desc" id="modalFull"></p>
        <div class="team-list" id="modalTeam"></div>
        <div class="ai-summary-box" id="aiSummaryBox" style="display:none">
          <h4>🤖 Resumen IA</h4>
          <p id="aiSummaryText"></p>
        </div>
        <div class="modal-btns">
          <button class="btn-primary-sm" id="generateAiSummaryBtn">🤖 Resumen IA</button>
          <button class="btn-primary-sm" id="viewDemoBtn">🔗 Ver Demo</button>
          <button class="btn-sm" id="closeModalBtn">Cerrar</button>
        </div>
      </div>
    </div>
  `;
}