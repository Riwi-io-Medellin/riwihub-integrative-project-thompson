import { landinPageHeader } from "../headers/landingPage";
import { navAdminHeader } from "../headers/navAdmin";
import { navComercialHeader } from "../headers/navComercial";

export function updateHeader() {
  const header = document.getElementById("app-header");
  const dataInfo = JSON.parse(localStorage.getItem("userData"));
  const isLoggedIn = isAuthenticated();
  const role = dataInfo?.role;

  if (!isLoggedIn) {
    header.innerHTML = landinPageHeader();
    return;
  }

  const navbarByRole = {
    
    cliente: navClientHeader(),

    comercial: navComercialHeader(),

    admin: navAdminHeader()
  };

  header.innerHTML = navbarByRole[role] || "";
}