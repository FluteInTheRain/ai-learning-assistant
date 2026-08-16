# AI Learning Assistant

A production-oriented RAG (Retrieval-Augmented Generation) system — not a "chat with your PDF" demo. v0 focuses on a correctly-layered ingestion → generation pipeline; retrieval/semantic search is deferred to v1+.

**Core loop (v0):** create a session → upload a PDF into it → the system parses, chunks, embeds, and stores it → pick a fixed action ("Summarize" / "Generate quiz questions") → the system generates the corresponding content, stores it, and returns it.

For architecture, data flow, schema, and design decisions, see [CLAUDE.md](CLAUDE.md).

## Tech stack

**Backend**
- Python 3.12, FastAPI
- PostgreSQL + [pgvector](https://github.com/pgvector/pgvector) (SQLAlchemy 2.0 async + Alembic migrations)
- OpenAI — chat completions (LLM) and `text-embedding-3-small` (embeddings)
- `pypdf` (PDF parsing), `tiktoken` (token-based chunking)
- pytest, ruff, pyright

**Frontend** (`frontend/`)
- React + TypeScript, built with Vite
- TanStack Query for data fetching/caching, including polling document status
- react-router-dom
- Plain hand-written CSS (no Tailwind/UI kit)
- Vitest + React Testing Library

The frontend only calls the backend API over HTTP/JSON — it never touches the database or OpenAI directly, and doesn't duplicate backend business logic.

## Running locally

### 1. Prerequisites

- Docker (runs Postgres + pgvector)
- Python 3.12 and [uv](https://docs.astral.sh/uv/)
- Node.js (20+ recommended) and npm
- A real OpenAI API key (required for upload — the embedding step — and for generate)

### 2. Backend

```bash
# From the repo root
docker compose up -d              # starts Postgres + pgvector (:5432)

cp .env.example .env               # then open .env and fill in a real OPENAI_API_KEY
uv run alembic upgrade head        # creates the vector extension + 4 tables

uv run uvicorn app.main:app --reload --port 8000
```

The backend runs at **http://localhost:8000** (Swagger UI at `/docs`).

> After changing `.env` (e.g. a new API key), restart the server — settings are cached at startup, so editing `.env` while the server is running has no effect until you restart.

### 3. Frontend

```bash
cd frontend
cp .env.example .env.development   # already points to http://localhost:8000 by default, usually no changes needed
npm install
npm run dev
```

The frontend runs at **http://localhost:5173**.

### 4. Verification

```bash
# Backend
uv run pytest
uv run ruff check .
uv run pyright

# Frontend
cd frontend
npm run test
npm run build
```

For project rules, database schema, API surface, and design decisions, see [CLAUDE.md](CLAUDE.md). Frontend-specific notes live in [frontend/README.md](frontend/README.md).
