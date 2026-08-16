# Project

**Aletheia** — an AI-education course platform ("Aletheia · AI Academy"): a marketing landing page, auth, a course catalog across two tracks (Applied / Technical), Premium subscription + enrollment, and a module → lesson course player with progress tracking.

This is **not** the RAG document-assistant the repo originally started as (see git history before commit `633b3f8` if that context is ever needed) — that product was fully removed in a deliberate pivot. Courses are manually-authored content; there is no PDF upload, parsing, chunking, embedding, or LLM generation anywhere in this product.

Full design reference (copy, layout, and behavior for every screen — built and not-yet-built) lives in **[DESIGN.md](DESIGN.md)**. Read it before building any new screen; it's the substitute for the source Claude Design project, which most tooling (including any coding agent other than Claude Code with the owner's `claude.ai` login) cannot open directly.

## Scope decisions (do not relitigate without discussing first)

- **No AI generation.** Courses/lessons are static, manually-authored (or seeded) content.
- **Payment, video, and labs are mocked.** Enrolling in Premium just writes a subscription record — no real payment gateway. Lessons carry an optional `video_url` (real `<video>`/iframe if present, otherwise a placeholder). Labs are a description + optional external link (e.g. Colab/GitHub) — no in-browser code execution.
- **English only, wired through i18n.** The source design has a VI/EN toggle; this build ships English-only content but routes UI strings through `react-i18next` so a second locale is additive later. See `frontend/src/i18n/` and `frontend/src/content/`.

## Current repo state

- **Frontend**: the landing page (`/`) is built — see the Frontend section below. Nothing else is built yet.
- **Backend**: reset to a clean template. `app/`, `tests/`, `alembic/`, `alembic.ini`, `docker-compose.yml` do not exist — only `pyproject.toml`/`uv.lock` remain as scaffolding. The backend needs to be rebuilt from scratch; the planned schema and API surface are in [DESIGN.md](DESIGN.md)'s "Data model & API" section. Do not assume any backend endpoint exists until it's actually been (re)built.

## Stack

**Backend (planned — not yet rebuilt)**
- Python 3.12, FastAPI
- PostgreSQL (no pgvector — nothing in this product needs vector search)
- Auth: JWT (`PyJWT`) + `passlib[bcrypt]` — not yet a dependency, add when auth is built
- pytest, ruff, pyright (see `pyproject.toml`)

**Frontend** (`frontend/`) — built and current
- React 19 + TypeScript, built with Vite
- react-router-dom for routing
- `react-i18next` / `i18next` for all UI copy — see "Content architecture" below
- CSS written by hand using CSS custom-property design tokens (`frontend/src/styles/tokens.css`) for light/dark theming — no Tailwind or UI kit. Dark is the *default* theme (matches the design's own convention), light is opt-in via `[data-theme="light"]`. Typeface is self-hosted Inter only (`@fontsource/inter`), no serif.
- Component classes (`.btn`, `.input`, `.tag`, `.card`, `.section*`, …) live in `frontend/src/index.css`, ported from the design's shared component system and recolored to the tokens above — extend this system for new UI rather than inventing a parallel one.
- No state-management library yet (Redux/TanStack Query were used pre-pivot and removed with everything else) — add one when a real need appears (e.g. auth token persistence, server-state caching for the rebuilt API), not preemptively.
- Vitest + React Testing Library are configured but currently have no tests (removed with the pre-pivot code) — add tests as new logic/components land.
- Talks to the backend only over HTTP/JSON once the backend exists. Pure API consumer: no direct DB access, no reimplementation of service-layer business logic.

### Content architecture (frontend)

Established by the landing page — follow this pattern for every new page:
- `frontend/src/i18n/locales/en/<page>.json` — raw copy (i18next resource)
- `frontend/src/content/types.ts` — shared content shapes
- `frontend/src/content/use<Page>Content.ts` — the **only** place that calls `useTranslation()`/`t()` for that page; returns fully-typed content. Presentational components take content as props, never call `t()` directly. This is the seam that lets a data source change later (e.g. courses from a real API instead of static JSON) without touching any component.
- `frontend/src/content/routes.ts` — route path constants; add new routes here, don't hardcode path strings
- `frontend/src/content/navigation.ts` — shared nav-item definitions (id/label-key/href), referenced by id where needed instead of duplicating href+label pairs across header/footer/sidebar
- One presentational component per section under `frontend/src/components/<page>/`, each with its own co-located CSS file (delete the component, its styles go with it — no orphaned CSS)

## Architecture (backend, once rebuilt)

Layered: **API (routes) → Services → Repositories**

- Routes only handle request/response and delegate to services.
- Business logic lives in services.
- DB access lives in repositories, not in routes or scattered inline.
- One route/service/repository set per domain area (auth, course, enrollment, subscription, lesson, user) — see [DESIGN.md](DESIGN.md) for the full breakdown.
- The frontend is a separate pure API consumer — it only calls the HTTP API and renders responses, it never talks to the DB or reimplements backend logic.

## Rules

- Keep business logic out of API routes.
- Use type hints everywhere (backend) / avoid `any` (frontend).
- Add tests for non-trivial logic.
- Use migrations for database changes (e.g. Alembic) — no ad hoc schema edits.
- Do not introduce LangChain, or any LLM/embedding dependency — this product doesn't generate content.
- Do not change architecture (layering, DB schema, API contracts) without discussing it first.
- Don't build ahead of the screen inventory in [DESIGN.md](DESIGN.md) — if a screen or field isn't documented there, check with the user before inventing it.
- Frontend content follows the pattern in "Content architecture" above — don't call `t()` from inside presentational components, and don't duplicate copy/config that already has a home in `content/`.

## Verification

Before considering a task complete:

1. Backend (once it exists): `pytest`, `ruff check .`, `pyright`.
2. `cd frontend && npm run lint && npm run build` (and `npm run test` once tests exist again).
3. For UI changes, run the dev server and check it in a browser against [DESIGN.md](DESIGN.md) — don't rely on lint/build passing as a proxy for "looks right."
4. Review `git diff`.
