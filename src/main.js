import { checkRouteAccess, logout } from "./helpers/auth";
import { updateHeader } from "./helpers/header";
import { initViewLogic } from "./helpers/logicViews";
import { initTheme, toggleTheme } from "./helpers/theme";
import { adminPageViews } from "./views/adminViews/adminPageViews";
import { clientPageViews } from "./views/clientViews/clientPageView";
import { comercialPageViews } from "./views/comercialViews/comercialPageViews";
import { landingPageView } from "./views/landingPage";
import { loginView } from "./views/login";
import { registerView } from "./views/register";

export const routes = {
  "/landingPage":   { component: landingPageView,   private: false },
  "/login":         { component: loginView,          private: false },
  "/register":      { component: registerView,       private: true  },
  "/adminPage":     { component: adminPageViews,     private: true  },
  "/comercialPage": { component: comercialPageViews, private: true  },
  "/clientPage":    { component: clientPageViews,    private: true  },
};

const app = document.getElementById("app");

export function navigate(pathname, addToHistory = true) {
  const allowedRoute = checkRouteAccess(pathname);

  if (addToHistory) window.history.pushState({}, "", allowedRoute);

  updateHeader();

  const routeConfig = routes[allowedRoute];
  if (!routeConfig) { app.innerHTML = `<h1>404</h1>`; return; }

  app.innerHTML = routeConfig.component();
  initViewLogic(allowedRoute);
}

// ─── LISTENERS GLOBALES ───────────────────────────────────
document.body.addEventListener("click", (e) => {

  // Guards navigation
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigate(e.target.getAttribute("href"));
    return;
  }
  //subviews chance views into the role login
  if (e.target.matches("[data-view]")) {
    e.preventDefault();
    showPage(e.target.dataset.view);
    document.getElementById("mobileMenu")?.classList.remove("open");
    document.querySelector(".user-menu")?.classList.remove("open");
    return;
  }

  // Theme
  if (e.target.closest(".theme-toggle")) {
    toggleTheme(); return;
  }

  // Logout
  if (e.target.matches(".logout-btn")) {
    logout(); return;
  }

  // Hamburger
  if (e.target.matches(".hamburger")) {
    document.getElementById("mobileMenu")?.classList.toggle("open");
    return;
  }

  // User menu
  if (e.target.closest(".user-trigger")) {
    e.target.closest(".user-menu")?.classList.toggle("open");
    return;
  }

if (!e.target.closest(".user-menu")) {
    document.querySelector(".user-menu")?.classList.remove("open");
  }

});

initTheme();
window.addEventListener("popstate", () => navigate(window.location.pathname, false));
const initialPath = window.location.pathname === "/" ? "/landingPage" : window.location.pathname;
navigate(initialPath);