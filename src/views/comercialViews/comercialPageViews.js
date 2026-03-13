import '../../styles/base.css';
import '../../styles/dashboards.css';
import { appointmentComercialView } from "./appointmentComercialView";
import { availabilityComercialView } from "./availabilityComercialView";
import { profileComercialView } from "./profileComercialView";
import { projectsComercialView } from "./projectsComecialView";

export function comercialPageViews() {
  return `
    <div class="main">
      ${projectsComercialView()}
      ${appointmentComercialView()}
      ${availabilityComercialView()}
      ${profileComercialView()}
      <div class="toast" id="toast"></div>
    </div>
  `;
}