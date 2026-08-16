# Aletheia — Frontend

React + TypeScript SPA (Vite) for the Aletheia course platform. See the repo root [CLAUDE.md](../CLAUDE.md) for the product definition and [DESIGN.md](../DESIGN.md) for the screen-by-screen design reference.

Currently implements the landing page only (`/`) — no backend exists yet to consume, so this runs standalone.

## Setup

```bash
npm install
npm run dev      # starts the dev server on http://localhost:5173
```

## Content architecture

Follow this pattern for every new page (established by the landing page — see `src/pages/LandingPage.tsx`, `src/components/landing/`, `src/content/`):

- `src/i18n/locales/en/<page>.json` — raw copy
- `src/content/use<Page>Content.ts` — the only place that reads i18n for that page; returns typed content. Components take content as props, never call `useTranslation()` directly.
- `src/content/routes.ts` / `src/content/navigation.ts` — shared route and nav-item constants; extend these rather than hardcoding strings
- One presentational component per section under `src/components/<page>/`, each with a co-located CSS file

## Scripts

- `npm run dev` — start the Vite dev server.
- `npm run test` — run the Vitest test suite (no tests currently exist).
- `npm run build` — type-check (`tsc -b`) and build for production.
- `npm run lint` — run oxlint.
