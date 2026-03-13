
import { dashboardAdminView } from './dashboardAdminView';
import { projectsAdminView } from './projectsAdminView';
import { usersAdminView } from './usersAdminView';
import { profileAdminView } from './profileAdminView';


export function adminPageViews() {
    return `
    <div class="main">
      ${dashboardAdminView()}
      ${projectsAdminView()}
      ${usersAdminView()}
      ${profileAdminView()}
      <div class="toast" id="toast"></div>
    </div>
  `;
}