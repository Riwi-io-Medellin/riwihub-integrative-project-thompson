import { checkRouteAccess, logout } from "./helpers/auth";
import { updateHeader } from "./helpers/header";
import { initViewLogic } from "./helpers/logicViews";
import { initTheme, toggleTheme } from "./helpers/theme";

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
  // Theme
  if (e.target.closest(".theme-toggle")) {
    toggleTheme(); return;
  }

  // Logout
  if (e.target.matches(".logout-btn")) {
    logout(); return;
  }

});

initTheme();
window.addEventListener("popstate", () => navigate(window.location.pathname, false));
const initialPath = window.location.pathname === "/" ? "/landingPage" : window.location.pathname;
navigate(initialPath);