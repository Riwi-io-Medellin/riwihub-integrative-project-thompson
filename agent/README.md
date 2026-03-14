# RIWIHUB-AI

This repository contains the RIWIHUB-AI agent (Python) code present in this workspace. The README below documents only files and behavior that exist in this project—not external templates or suggested features.

## What this project contains
- `main.py` — FastAPI application entrypoint and CORS setup.
- `config.py` — Loads environment variables (via python-dotenv) into a Settings object.
- `database.py` — Async helpers using `aiomysql` and a `get_projects_filtered` query used by the API.
- `routers/chat.py` — API router exposing the agent endpoints under the `/api` prefix.
- `services/aiService.py` — AI-related functions: chat, summary, language detection, filter extraction.
- `services/companyService.py` — Company research and project suggestion using OpenAI.
- `requirements.txt` — Python dependencies used by the project.
- `postman.txt` — (present in repo) auxiliary Postman export or notes.

## Quick overview
RIWIHUB-AI in this repo is an agent that serves project discovery and AI-powered summaries for Riwi projects. The FastAPI router provides endpoints for initializing conversations, performing chat queries, filtering projects, and generating project summaries. The AI services call OpenAI via the `openai` async client.

## Key endpoints (as implemented)
- `POST /api/chat/init` — Initialize chat and return a welcome message. If `role` is `client` and `company_name` is provided, the endpoint will research the company and include suggestions.
- `POST /api/chat` — Main chat endpoint. Accepts `message`, `history`, `role`, optional company info and `language`.
- `POST /api/projects/filter` — Filter projects directly using DB query parameters (no AI).
- `POST /api/projects/summary` — Generate an AI summary for a given project object.

Request-Body models are defined in `routers/chat.py` using Pydantic (`InitRequest`, `ChatRequest`, `FilterRequest`, `SummaryRequest`).

## Environment variables used by this code
The project reads environment variables in `config.py`. To run the app, set the following (exact names expected by the current code):

- `OPENAI_APLE_KEY` — OpenAI API key
- `DB_HOST` — MySQL host.
- `DB_USER` — MySQL user.
- `DB_PASSWORD` — MySQL password.
- `DB_NAME` — MySQL database name.
- `DB_PORT` — MySQL port (defaults to 3306 if not set).
- `APP_PORT` — Application port used by `uvicorn` (defaults to 8001 in code).
- `ALLOWED_ORIGINS` — Comma-separated list of allowed CORS origins (defaults to `*`).

Important: the environment variable name for OpenAI in `config.py` is spelled `OPENAI_APLE_KEY` (likely a typo). If you prefer `OPENAI_API_KEY`, update `config.py` accordingly.

## Dependencies
Install dependencies from `requirements.txt`:

```bash
python -m venv .venv
# Windows
.venv\\Scripts\\activate
# Unix/macOS
source .venv/bin/activate
pip install -r requirements.txt
```

The project currently pins packages including `fastapi`, `uvicorn`, `openai`, `httpx`, `aiomysql`, `python-dotenv`, and `pydantic`.

## Running locally
1. Create a `.env` file in the project root with the variables listed above.
2. Start the app:

```bash
python main.py
```

This will launch the FastAPI app via `uvicorn` with the host and port configured in `config.py`.

## Database and queries
`database.py` provides `get_projects_filtered(...)`, an async function that connects to MySQL via `aiomysql` and runs a query that returns up to 30 projects ordered by rating. The function accepts filters: `search_term`, `nicho`, `tecnologia`, `ruta`, `cohorte`, and `calificacion_min` — these names are used by the router and service code.

## AI services
- `services/aiService.py` implements:
    - conversation orchestration (`chat_with_context`), language detection, and structured extraction of filter intents from user messages (`extract_filters`), using OpenAI chat completions.
    - `generate_summary` to create human-friendly project summaries.
    - system prompts and welcome messages used to control assistant behavior.

- `services/companyService.py` implements `research_company_and_suggest` which queries OpenAI to create a short company profile and suggest up to 4 relevant projects from the provided project list.

Both service modules use the async `openai.AsyncOpenAI` client and the key loaded in `config.py`.

## Notes and caveats (code-observed)
- The code expects an environment variable named `OPENAI_APLE_KEY` (likely a typo). If you set `OPENAI_API_KEY` instead, update `config.py` or add the misspelled variable to your `.env`.
- The router is mounted with prefix `/api` and tag `Agent` in `routers/chat.py`.
- The project focuses on the agent functionality; no authentication, user management, or other endpoints exist in the current codebase.

## Contributing
- Work on feature branches and open a PR describing changes.
- Keep secrets out of the repository (use `.env` or secret manager).

## Where to look next in the code
- Application bootstrap: `main.py` (FastAPI + CORS + router include)
- Routing and request shapes: `routers/chat.py`
- AI logic: `services/aiService.py` and `services/companyService.py`
- DB access: `database.py`
- Configuration: `config.py`