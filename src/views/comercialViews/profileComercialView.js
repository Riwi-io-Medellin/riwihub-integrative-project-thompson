export function profileComercialView() {
  return `
    <div class="page" id="page-profile">
      <h1 class="section-title">Mi <span class="text-gradient">Perfil</span></h1>
      <div class="profile-card">
        <div class="profile-avatar" id="profileAvatar">…</div>
        <h2 id="profileName">Cargando...</h2>
        <p class="email" id="profileEmail"></p>
        <div class="profile-info" id="profileInfo"></div>
      </div>
    </div>
  `;
}