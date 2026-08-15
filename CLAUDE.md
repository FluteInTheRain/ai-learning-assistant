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
- LLM: OpenAI / Gemini / Claude (provider not fixed yet — confirm which before hardcoding one)
- Embedding model/API (provider not fixed yet)
- Docker
- pytest, ruff, pyright (see `pyproject.toml`)

## Architecture

Layered: **API (routes) → Services → Repositories / AI services**

- Routes only handle request/response and delegate to services.
- Business logic lives in services.
- DB access, embedding calls, and LLM calls live in repositories / AI service modules, not in routes or scattered inline.

## Current repo state

This is a throwaway FastAPI-learning scaffold (`day1-init-project-structure`), not a design to build on. `app/` currently holds a placeholder in-memory CRUD demo (`Item`) and `src/my_project/` is an unrelated stub. Neither reflects the target architecture above and neither needs to be preserved, migrated, or treated as prior art — replace or delete freely when implementing the real pipeline.

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

Explicitly not yet: TXT/Markdown upload, freeform question-answering, semantic/similarity search exposed to users, auth, agents/multi-agent, fine-tuning, Kubernetes, complex frontend. Don't build toward these unless asked.

## Roadmap (context only — do not build ahead of current scope)

v0 Session-based document generation (Summarize/Quiz) → v1 Hybrid search + reranking + freeform Q&A → v2 Evaluation → v3 Cost/latency/monitoring → v4 AI Tutor → v5 Adaptive learning

## Rules

- Keep business logic out of API routes.
- Use type hints everywhere.
- Add tests for non-trivial logic.
- Use migrations for database changes (e.g. Alembic) — no ad hoc schema edits.
- Do not introduce LangChain unless explicitly requested.
- Do not change architecture (layering, DB schema, API contracts) without discussing it first.

## Verification

Before considering a task complete:

1. Run tests (`pytest`).
2. Run lint/type checks (`ruff check .`, `pyright`).
3. Review `git diff`.
