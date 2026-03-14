# RiwiHub

RiwiHub is a web platform developed as an Integrative Project for Riwi's Basic Route coders. It centralizes the most relevant projects created by coders in a single place, making them easy to discover, present, and manage through differentiated roles and an artificial intelligence agent.

🌐 **Live Demo:** [https://riwihub.netlify.app](https://riwihub.netlify.app)

---

## Overview

RiwiHub integrates three main modules into a single platform:

- A **REST backend** built with Node.js, Express, and MySQL that manages projects, users, coders, and technologies with JWT authentication and role-based access control.
- A **SPA frontend** built with Vanilla JavaScript and Vite that provides differentiated dashboards based on the authenticated user's role.
- An **AI agent** built with Python and FastAPI that allows users to discover projects through natural language, smart filters, and automatically generated summaries powered by GPT.

---

## Roles and Features

### Admin
- Create, edit, and delete projects on the platform.
- Manage users: create accounts, update roles, and delete records.
- Full access to all system entities.

### Comercial
- Browse the full catalog of available projects.
- Interact with the AI agent to present projects to potential clients.
- Appointment scheduling module with clients *(visual interface implemented — backend integration in development)*.

### Cliente
- Explore the most outstanding projects developed by Riwi coders.
- Use the AI agent to:
  - Ask questions about projects in natural language.
  - Filter projects by technology, niche, or rating.
  - Receive personalized suggestions based on their company profile.

---

## Repository Architecture

```
riwihub/
├── back/       # REST API — Node.js, Express, MySQL, JWT
├── front/      # SPA Frontend — Vanilla JavaScript, Vite
└── agent/      # AI Agent — Python, FastAPI, OpenAI
```

Each subfolder is an independent module with its own environment, dependencies, and documentation:

| Module | Stack |
|--------|-------|
| `back/` | Node.js · Express · MySQL · Zod · JWT |
| `front/` | JavaScript · Vite · CSS |
| `agent/` | Python · FastAPI · OpenAI · aiomysql |

---

## Technologies Used

### Frontend (`front/`)
- **JavaScript ES6+** — SPA built without frameworks, navigation using the History API.
- **Vite** — Bundler and development server.
- **Modular CSS** with global variables and responsive design.

### Backend (`back/`)
- **Node.js + Express** — HTTP server and REST routing.
- **MySQL2** — Relational database.
- **JWT** — Authentication with access token and refresh token via HTTP-only cookie.
- **Zod** — Input schema validation.
- **bcrypt** — Secure password hashing.
- Feature-based Layered Architecture: `routes → controllers → services → repository`.

### AI Agent (`agent/`)
- **Python + FastAPI** — Asynchronous API for the conversational agent.
- **OpenAI API** — GPT for chat, summaries, language detection, and filter extraction.
- **aiomysql** — Asynchronous access to the MySQL database.
- **python-dotenv** — Environment variable management.

---

## Quick Start

Follow the recommended order: back → agent → front, since the frontend depends on both APIs.

### 1. Backend

```bash
cd back
npm install
# Set up your .env file (see back/README.md)
npm run api
# Server available at http://localhost:3000
```

### 2. AI Agent

```bash
cd agent
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
# Set up your .env file (see agent/README.md)
python main.py
# Server available at http://localhost:8001
```

### 3. Frontend

```bash
cd front
npm install
# Configure the back and agent URLs in src/helpers/api.js and src/helpers/aiApi.js
npm run dev
# App available at http://localhost:5173
```

### With Docker (recommended)

To spin up all three modules and the database with a single command:

```bash
# Copy .env.example to .env and fill in the values
docker-compose up --build
# Front: http://localhost | Back: http://localhost:3000 | Agent: http://localhost:8001
```

---

## Environment Variables

Each module requires its own `.env` file. Check each folder's README for the full list of required variables.

| Module | Main Variables |
|--------|----------------|
| `back/` | `PORT`, `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `JWT_SECRET`, `JWT_EXPIRES_IN` |
| `agent/` | `OPENAI_API_KEY`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `APP_PORT`, `ALLOWED_ORIGINS` |
| `front/` | Back and agent URLs configured directly in `src/helpers/api.js` and `src/helpers/aiApi.js` |

---

## Team

This project was developed by a team of 6 people following a Scrum methodology:

| Name | Role |
|------|------|
| Esneider Alvarez | Product Owner |
| Brayan Quintero | Scrum Master |
| Julian Elejalde | Frontend Developer |
| Santiago Chavarro | Backend Developer |
| Santiago Muñoz | Backend Developer |
| Juan Pablo Urrego | QA / Quality Assurance |

---

## Methodology

The project was developed following a real Scrum workflow:

- Defined roles: Product Owner, Scrum Master, development team, and QA.
- Iterative development sprints with deliverables per sprint.
- Task management on Jira
- Version control with GitHub Main -> Develop -> US-#

---

*Interactive project developed for Riwi — Basic Route · 2026*
