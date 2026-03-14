import { navigate } from "../main";

const AUTH_URL = "https://riwihub-backend-production.up.railway.app/auth";
const API_URL  = "https://riwihub-backend-production.up.railway.app/api";

// TOKEN MANAGEMENT
export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function setAccessToken(token) {
  localStorage.setItem("accessToken", token);
}

// AI CHAT - HISTORY AND LOGOUT
export function clearSession() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const userId   = userData.id || userData.email || "guest";
  sessionStorage.removeItem(`aiChatSession_${userId}`);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userData");
}

// REFRESH TOKEN
async function refreshAccessToken() {
  try {
    const res = await fetch(`${AUTH_URL}/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Refresh failed");

    const data = await res.json();
    setAccessToken(data.accessToken);
    return data.accessToken;
  } catch {
    clearSession();
    navigate("/login");
    return null;
  }
}

// BASE FETCH
async function apiFetch(baseUrl, endpoint, options = {}) {
  const token = getAccessToken();

  const config = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  if (options.body && typeof options.body !== "string") {
    config.body = JSON.stringify(options.body);
  }

  let res = await fetch(`${baseUrl}${endpoint}`, config);

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) return null;
    config.headers.Authorization = `Bearer ${newToken}`;
    res = await fetch(`${baseUrl}${endpoint}`, config);
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Error desconocido" }));
    throw new Error(error.message || `Error ${res.status}`);
  }

  if (res.status === 204) return null;

  return res.json();
}

// Shortcuts
const authFetch = (endpoint, options) => apiFetch(AUTH_URL, endpoint, options);
const apiFetchApi = (endpoint, options) => apiFetch(API_URL, endpoint, options);

// AUTH
export const authAPI = {
  login:      (email, password) => authFetch("/login",   { method: "POST", body: { email, password } }),
  refresh:    ()                => authFetch("/refresh",  { method: "POST" }),
  logout:     ()                => authFetch("/logout",   { method: "POST" }),
  getProfile: ()                => authFetch("/profile"),
};

// USERS
export const usersAPI = {
  getAll:  ()         => apiFetchApi("/users"),
  getById: (id)       => apiFetchApi(`/users/${id}`),
  create:  (data)     => apiFetchApi("/users",     { method: "POST",  body: data }),
  update:  (id, data) => apiFetchApi(`/users/${id}`, { method: "PATCH", body: data }),
  delete:  (id)       => apiFetchApi(`/users/${id}`, { method: "DELETE" }),
};

// PROJECTS
export const projectsAPI = {
  getAll:  ()         => apiFetchApi("/projects/all"),
  getById: (id)       => apiFetchApi(`/projects/${id}`),
  create:  (data)     => apiFetchApi("/projects",     { method: "POST",  body: data }),
  update:  (id, data) => apiFetchApi(`/projects/${id}`, { method: "PATCH", body: data }),
  delete:  (id)       => apiFetchApi(`/projects/${id}`, { method: "DELETE" }),
};

// CODERS
export const codersAPI = {
  getAll:  ()         => apiFetchApi("/coders"),
  getById: (id)       => apiFetchApi(`/coders/${id}`),
  create:  (data)     => apiFetchApi("/coders",     { method: "POST",  body: data }),
  update:  (id, data) => apiFetchApi(`/coders/${id}`, { method: "PATCH", body: data }),
  delete:  (id)       => apiFetchApi(`/coders/${id}`, { method: "DELETE" }),
};

// TECHNOLOGIES 
export const technologiesAPI = {
  getAll:  ()         => apiFetchApi("/technologies"),
  getById: (id)       => apiFetchApi(`/technologies/${id}`),
  create:  (data)     => apiFetchApi("/technologies",     { method: "POST",  body: data }),
  update:  (id, data) => apiFetchApi(`/technologies/${id}`, { method: "PATCH", body: data }),
  delete:  (id)       => apiFetchApi(`/technologies/${id}`, { method: "DELETE" }),
};

// MEDIA PROJECT
export const mediaProjectsAPI = {
  getAll:  ()         => apiFetchApi("/media-projects"),
  getById: (id)       => apiFetchApi(`/media-projects/${id}`),
  create:  (data)     => apiFetchApi("/media-projects",     { method: "POST",  body: data }),
  update:  (id, data) => apiFetchApi(`/media-projects/${id}`, { method: "PATCH", body: data }),
  delete:  (id)       => apiFetchApi(`/media-projects/${id}`, { method: "DELETE" }),
};