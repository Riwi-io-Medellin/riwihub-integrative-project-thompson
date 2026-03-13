import { navigate, routes } from "../main.js";
import { authAPI, clearSession } from "./api.js";

// ─── AUTH STATE ───────────────────────────────────────────
export function isAuthenticated() {
  const token    = localStorage.getItem("accessToken");
  const userData = localStorage.getItem("userData");
  return !!(token && userData);
}

export function getUserData() {
  try {
    return JSON.parse(localStorage.getItem("userData"));
  } catch {
    return null;
  }
}

export async function logout() {
  try {
    await authAPI.logout();
  } catch {

  } finally {
    clearSession();
    navigate("/landingPage"); // navigate() is global from main.js
  }
}

// ─── ROUTE GUARD ──────────────────────────────────────────
export function checkRouteAccess(pathname) {
  const isLoggedIn = isAuthenticated();
  const userData   = getUserData();
  const role       = userData?.role; // "admin" | "cliente" | "comercial" (lowercase from backend)

  const publicRoutes = Object.keys(routes).filter(r => !routes[r].private);

  // Where each role lands after login
  const roleHome = {
    cliente:   "/clientPage",
    comercial: "/comercialPage",
    admin:     "/adminPage",
  };

  // Which private routes each role can access
  const rolePermissions = {
    cliente:   ["/clientPage"],
    comercial: ["/comercialPage", "/register"],
    admin:     ["/adminPage", "/register"],
  };

  // Not logged in
  if (!isLoggedIn) {
    return publicRoutes.includes(pathname) ? pathname : "/landingPage";
  }

  // Logged in but trying to access a public route → go home
  if (publicRoutes.includes(pathname)) {
    return roleHome[role] || "/landingPage";
  }

  // "/" → redirect to role home
  if (pathname === "/") {
    return roleHome[role] || "/landingPage";
  }

  // Route not allowed for this role → go home
  const allowedRoutes = rolePermissions[role] || [];
  if (!allowedRoutes.includes(pathname)) {
    return roleHome[role] || "/landingPage";
  }

  return pathname;
}