
# RIWIHUB-FRONT

An organized, feature-based Single Page Application (SPA) frontend for the RIWIHUB platform. This README gives a concise but complete overview of how the project is structured, how it was built, and how to run and extend it.

## Purpose

RIWIHUB-FRONT implements the client-side UI used to manage projects, user profiles, appointments, and role-specific dashboards (admin, client, comercial). The app is intentionally small and framework-agnostic, relying on modern JavaScript toolchains for development and build.

## Design & Architecture

The project follows a Feature-based Layered Architecture adapted for a frontend SPA:

- Feature-based grouping: related code (views, logic, styles) for a specific feature lives together under `src/` to improve discoverability and reduce implicit coupling.
- Layered responsibilities: Views handle rendering, `logic/` files encapsulate feature behavior and state changes, and `helpers/` provide cross-cutting utilities (API access, auth, UI helpers).
- Small modules: Files are kept focused and single-purpose to make testing and reuse easier.

This approach aims to be scalable for additional roles or features without requiring major reorganizations.

## Module Responsibilities (frontend mapping)

- `views/`: UI components and page templates (landing, login, register, admin/client/comercial pages).
- `logic/`: Feature controllers and state transitions (loginLogic, projectsShared, profileShared).
- `helpers/`: Utilities and integrations (API wrapper, auth helpers, theming, 3rd-party calls).
- `headers/`: Role-specific header components used by pages.
- `styles/`: Centralized CSS files for global and feature-level styling.

This mirrors a backend-style separation (routes/controllers/services) but adapted for a client-side app: view → logic → helpers.

## Project Structure (detailed)

- `index.html` — Application shell and root mounting point
- `package.json` — Project metadata, scripts, and dependencies
- `public/` — Static assets served as-is (icons, favicons, public images)
- `src/`
  - `main.js` — App bootstrap and router initialization
  - `assets/` — Images and static media used by the UI
  - `headers/` — Header modules for each role (landingPage.js, navAdmin.js, navClient.js, navComercial.js)
  - `helpers/` — Reusable helpers (Aiapi.js, api.js, auth.js, header.js, logicViews.js, showPage.js, theme.js)
  - `logic/` — Core feature logic (adminLogic.js, clientLogic.js, comercialLogic.js, landingPageL.js, loginLogic.js, profileShared.js, projectsShared.js, registerLogic.js)
  - `styles/` — CSS files that style layouts and components (auth.css, base.css, dashboards.css, landing.css)
  - `views/` — Page and subpage view modules organized by feature and role

This structure is intentionally shallow and explicit to help new contributors locate relevant code quickly.

## Dependencies

This project uses a minimal toolchain. The following dependencies come from `package.json`:

- Dev dependencies:
  - `vite` ^7.3.1 — Development server and build tool

There are no runtime npm packages declared; the app uses plain JavaScript and browser APIs. If you add libraries (for example a UI framework or HTTP client), list them in `package.json` and update this section.

## Available Scripts

Scripts defined in `package.json`:

- `npm run dev` — Start the local development server (Vite)
- `npm run build` — Build optimized production assets with Vite
- `npm run preview` — Preview the production build locally

Run these commands from the project root.

## Development

Follow these steps to set up a local development environment and the recommended runtime.

- Recommended Node.js: LTS (18.x or newer recommended).
- Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

- Build and preview production assets:

```bash
npm run build
npm run preview
```

- Scripts (exact entries from `package.json`):
  - `dev`: `vite`
  - `build`: `vite build`
  - `preview`: `vite preview`

Notes:
- Vite exposes environment variables with the `VITE_` prefix (accessible via `import.meta.env.VITE_*`). Use a `.env` file for local values and never commit secrets.

## Logic & Construction (how the frontend works)

This project is organized so each new feature is implemented as a small set of focused files: a `view`, a `logic` module, and optional helper functions or styles. The typical runtime flow is:

1. `main.js` bootstraps the app and the client-side router, mounting view modules into the DOM.
2. A `view` (page or component) renders UI and wires DOM events (clicks, form submissions) to functions in its corresponding `logic/` module.
3. `logic/` modules encapsulate the feature behavior: validating input, transforming data, and orchestrating API calls.
4. `helpers/api.js` centralizes HTTP calls (base URL, fetch wrappers, error handling). Authentication concerns (token storage, refresh) live in `helpers/auth.js`.
5. Views update the DOM after receiving data from `logic/`, usually by calling small rendering helpers in `helpers/` or by directly manipulating template fragments.

How to add a new feature (recommended steps):

- Create the UI file under `src/views/<feature>/` with a clear mount point.
- Implement the behavior in `src/logic/<feature>Logic.js` (data fetch, validation, state transitions).
- If the feature needs API access, add or reuse a function in `src/helpers/api.js` and keep URL paths centralized.
- Add styles in `src/styles/` scoped to the feature (or reuse global variables in `base.css`).
- Register any new route or navigation item in `main.js` and the relevant header module in `src/headers/`.

This pattern keeps features isolated and easy to test locally.

## Environment & API Configuration

- The frontend may call backend APIs. The base URL and API configuration are typically maintained in `src/helpers/api.js` or a `.env` file if you add one.
- For a local dev setup, ensure your backend API is running and reachable; otherwise, use a mock or a proxy configured in the Vite dev server.

## Getting Started (quick)

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open `http://localhost:5173` (or the URL printed by Vite) and verify the app loads.

4. To create a production build:

```bash
npm run build
npm run preview
```

If `npm run dev` returns errors, check `package.json` scripts and the terminal output. Missing backend endpoints will typically surface as failed network requests in the browser console.

## How the App Was Built

- Hand-built SPA using modern JavaScript and Vite as the build tool.
- Features were added as focused modules: each new UI surface created alongside a `view` and a corresponding `logic` file.
- Shared concerns (API calls, authentication, theming) were moved into `helpers/` to avoid duplication.

This incremental, modular approach keeps the codebase easy to reason about and makes incremental refactors straightforward.

## Contributing

- Follow the existing feature-based layout when adding or moving files.
- Keep logic functions small and testable.
- Verify in the browser before opening pull requests and include screenshots for UI changes.

## Troubleshooting

- If the dev server fails to start, run `npm install` and confirm `node`/`npm` versions.
- Inspect the browser console for runtime errors and network tab for failed API calls.
- Check `src/helpers/api.js` for API base URL configuration.