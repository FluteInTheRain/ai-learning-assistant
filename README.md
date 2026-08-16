<img src="frontend/public/icons/icon-aletheia-mark.svg" alt="" width="56" height="56" />

# Aletheia

An AI-education course platform ("Aletheia · AI Academy") — landing page, auth, a course catalog across two tracks, Premium subscription, and a module → lesson course player with progress tracking.

For the full product definition, current build status, and rules, see [CLAUDE.md](CLAUDE.md). For the screen-by-screen design reference (copy, layout, behavior — including everything not built yet), see [DESIGN.md](DESIGN.md).

## Tech stack

**Backend** — not yet built. Planned: Python 3.12, FastAPI, PostgreSQL, JWT auth. See [DESIGN.md](DESIGN.md)'s "Data model & API" section.

**Frontend** (`frontend/`) — built, landing page only so far
- React 19 + TypeScript, built with Vite
- react-router-dom
- `react-i18next` for UI copy (English only for now)
- Hand-written CSS with design tokens (`frontend/src/styles/tokens.css`) — no Tailwind/UI kit
- Vitest + React Testing Library (configured, no tests yet)

The frontend only calls the backend API over HTTP/JSON once the backend exists — it never touches a database directly and doesn't duplicate backend business logic.

## Running locally

Only the frontend runs right now — there's no backend to start.

```bash
cd frontend
npm install
npm run dev
```

Runs at **http://localhost:5173**.

```bash
npm run build   # production build
npm run lint    # oxlint
npm run test    # vitest (no tests currently exist)
```

## Project status

See [CLAUDE.md](CLAUDE.md)'s "Current repo state" for exactly what's built vs. planned, and [DESIGN.md](DESIGN.md) for the screen inventory.
