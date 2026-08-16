# AI Learning Assistant — Frontend

React + TypeScript SPA (Vite) that consumes the backend API: create sessions,
upload PDFs, and trigger the "Summarize" / "Generate quiz questions" actions.

Pure API consumer — no direct DB/OpenAI access, no duplicated backend logic.

## Setup

```bash
npm install
npm run dev      # starts the dev server on http://localhost:5173
```

Requires the backend running at the URL configured in `.env.development`
(`VITE_API_BASE_URL`, defaults to `http://localhost:8000`) with CORS enabling
`http://localhost:5173` (see `CORS_ORIGINS` in the backend `.env`).

## Scripts

- `npm run dev` — start the Vite dev server.
- `npm run test` — run the Vitest test suite.
- `npm run build` — type-check (`tsc -b`) and build for production.
- `npm run lint` — run oxlint.
