# Project

AI Learning Assistant — a production-oriented RAG (Retrieval-Augmented Generation) system. The goal is not "a PDF chatbot demo" but a correctly-layered ingestion → generation pipeline (retrieval/semantic search is a planned v1+ capability, not required for v0 — see MVP scope).

Core loop (v0): create a session → upload a PDF into it → system parses, chunks, and stores it → user triggers a fixed action (e.g. "Summarize", "Generate quiz questions") → system generates and stores the corresponding content.

## Pipeline

**Ingestion**

```
Document (PDF) → Parse → Chunk → Embed → Store (PostgreSQL + pgvector)
```

**Content generation (v0)**

```
Stored document → Action (Summarize | Generate quiz | ...) → Build prompt from document content → LLM → Generated content (stored + returned)
```

> Freeform question-answering via similarity search (the original "Question → Embed → Vector search → Top-K chunks → LLM" flow) is deferred past v0. Chunking/embedding is still stored at ingestion time — groundwork for that later feature and for handling long documents — but v0 actions don't expose semantic search to the user.

## Stack

- Python 3.12
- FastAPI
- PostgreSQL + pgvector
- LLM: OpenAI (chat completion API)
- Embedding: OpenAI `text-embedding-3-small`
- Docker
- pytest, ruff, pyright (see `pyproject.toml`)

## Frontend

- React + TypeScript, built with Vite.
- TanStack Query (`@tanstack/react-query`) for data fetching/caching, including polling document status while ingestion is in progress.
- react-router-dom for routing.
- Redux Toolkit (`@reduxjs/toolkit` + `react-redux`) manages a small, single-purpose slice of client/UI state only — currently just the theme (light/dark/system) preference and its persistence. TanStack Query remains the sole owner of all server state (sessions, documents, generated content); Redux never fetches from the API, never duplicates server state, and holds no business logic.
- CSS written by hand using CSS custom-property design tokens (`frontend/src/styles/tokens.css`) for light/dark theming — no Tailwind or UI kit. Visual identity is "Quiet Scholarship": an editorial, academic-gravitas palette (Tsinghua-purple primary + a single restrained brass accent) paired with a three-role type system (Source Serif 4 for headings, IBM Plex Sans for UI/body, IBM Plex Mono for metadata/labels), self-hosted via `@fontsource`.
- Vitest + React Testing Library for tests.
- Lives in `frontend/`, talks to the backend only over HTTP/JSON. It is a pure API consumer: no direct DB/OpenAI access, and no reimplementation of service-layer business logic (status transitions, validation, quiz parsing rules, etc.) — it only calls the API and renders the response.

## Architecture

Layered: **API (routes) → Services → Repositories / AI services**

- Routes only handle request/response and delegate to services.
- Business logic lives in services.
- DB access, embedding calls, and LLM calls live in repositories / AI service modules, not in routes or scattered inline.
- The frontend (`frontend/`) is a separate pure API consumer — it only calls the HTTP API and renders responses, it never talks to the DB, OpenAI, or reimplements backend logic.

## Current repo state

Backend v0 is built and reviewed: sessions, PDF upload/parse/chunk/embed, and the summary/quiz generation actions all work end-to-end against the layered architecture above, with migrations and tests in place. A minimal React + Vite SPA now lives in `frontend/`, consuming that API — see the Frontend section above and the API surface below for exactly what it covers.

## Main components

| Component | Responsibility |
| --- | --- |
| FastAPI | REST API |
| Session | Groups a user's uploaded documents into a workspace |
| Parser | Extract text from PDF (TXT/Markdown deferred, see MVP scope) |
| Chunker | Split document into chunks |
| Embedding | Text → vector |
| pgvector | Store vectors (retrieval/search is v1+, not used by v0 actions) |
| Content Generator | Build the prompt for a given action type from stored document content, call LLM |
| LLM | Generate the action's output (summary, quiz, ...) |
| PostgreSQL | Store metadata/data |
| Frontend SPA | Consumes the API; renders sessions, document upload/status, and generated content |

## API surface

```
POST /sessions
GET  /sessions
GET  /sessions/{id}

POST /sessions/{id}/documents        # upload a PDF into the session
GET  /sessions/{id}/documents
GET  /documents/{id}

POST /documents/{id}/generate        # body: { action: "summary" | "quiz" }
GET  /documents/{id}/generated       # list generated content for a document
```

## Database schema

```
sessions
- id, name, created_at

documents
- id, session_id, filename, file_type, status, created_at

document_chunks
- id, document_id, content, page_number, chunk_index, embedding

generated_contents
- id, document_id, action_type, content, created_at
```

`action_type` is an open set (start with `summary`, `quiz`; add more as new buttons are needed) — this table replaces the old `questions` table and is meant to hold the output of any fixed action, not just Q&A.

## Two main flows

**Ingestion:** Upload PDF into a session → Parse → Chunk → Embed → Store → status = READY

**Content generation:** Pick a READY document → choose an action (Summarize / Generate quiz / ...) → build prompt from document content → LLM → store + return generated content

## MVP scope (v0)

Must have:
- Create/list sessions
- Upload a PDF into a session, parse, chunk, embed, store → status = READY
- Trigger "Summarize" on a document → generate, store, and return a summary
- Trigger "Generate quiz questions" on a document → generate, store, and return quiz questions
- List previously generated content for a document

Explicitly not yet: TXT/Markdown upload, freeform question-answering, semantic/similarity search exposed to users, auth, agents/multi-agent, fine-tuning, Kubernetes. Don't build toward these unless asked.

A minimal React SPA (`frontend/`) exists and covers exactly the API surface above (sessions, upload, generate, list generated content) — it is not to be expanded beyond that surface without discussing it first.

## Roadmap (context only — do not build ahead of current scope)

v0 Session-based document generation (Summarize/Quiz) → v1 Hybrid search + reranking + freeform Q&A → v2 Evaluation → v3 Cost/latency/monitoring → v4 AI Tutor → v5 Adaptive learning

## Rules

- Keep business logic out of API routes.
- Use type hints everywhere.
- Add tests for non-trivial logic.
- Use migrations for database changes (e.g. Alembic) — no ad hoc schema edits.
- Do not introduce LangChain unless explicitly requested.
- Do not change architecture (layering, DB schema, API contracts) without discussing it first.
- The frontend is a pure API consumer — it renders data from the backend HTTP API and never duplicates backend business/validation logic or accesses the DB/OpenAI directly.
- Redux Toolkit is scoped to client/UI state (currently: theme) — do not add server-state slices or speculative new slices (toasts, modals, etc.) without discussing it first.

## Verification

Before considering a task complete:

1. Run tests (`pytest`).
2. Run lint/type checks (`ruff check .`, `pyright`).
3. Review `git diff`.
4. `cd frontend && npm run test && npm run build`.
