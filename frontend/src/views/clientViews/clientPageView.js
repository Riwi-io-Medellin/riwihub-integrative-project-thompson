import '../../styles/base.css';
import '../../styles/dashboard.css';
import { appointmentClientView } from "./appointmentClientViews.js";
import { profileClientView } from "./profileClientView.js";
import { projectsClientView } from './projectsClientsViews.js';


export function clientPageViews() {
  return `
    <div class="main">
      ${projectsClientView()}
      ${appointmentClientView()}
      ${profileClientView()}
      <div class="toast" id="toast"></div>
    </div>
  `;
}