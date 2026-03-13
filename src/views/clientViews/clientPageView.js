import '../../styles/base.css';
import '../../styles/dashboards.css';
import { appointmentClientView } from "./appointmentClientView";
import { profileClientView } from "./profileClientView";
import { projectsClientView } from "./projectsClientViews";

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