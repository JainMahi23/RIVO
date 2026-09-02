# RIVO

**RIVO** is a hyper-local, AI-powered business advisory and financial planning platform for rural and semi-urban first-time entrepreneurs.

> This repository currently contains the **architecture and skeleton only**. No feature logic (auth, calculations, AI, external data) is implemented yet — that happens module by module in later steps.

## Problem being solved

A first-time entrepreneur may have some savings and a business idea but no way to answer:

- Which business makes sense at their location?
- Is there enough market/customer opportunity nearby, and how much competition exists?
- How much will it cost, how much loan is needed, and what would repayment look like?
- Which government financing scheme fits?
- Is the plan actually financially feasible — and how could it be improved?

RIVO's journey: **Business Idea → Location → Market Intelligence → Financial Planning → Feasibility Analysis → Loan & Government Schemes → AI Guidance.**

## High-level architecture

```
React Frontend  →  API Service Layer  →  Node + Express  →  Controllers  →  Services  →  MongoDB / External APIs / AI
```

- **Frontend** never calls `fetch`/`axios` directly from components — everything goes through `src/services/`.
- **Backend** follows `Route → Controller → Service → Model/External API/AI → Controller → Response`. Business logic never lives in routes or in React components.
- **Financial calculations (EMI, loan amount, repayment schedule, scheme routing) are deterministic backend logic — not AI/ML.** AI is used for explanation, interpretation, and conversation, not for computing numbers.

## Repository structure

```
RIVO/
├── frontend/     React + Vite + Tailwind
├── backend/      Node + Express + Mongoose
├── .github/workflows/ci.yml
├── README.md
└── package.json  (root scripts to run both together)
```

### Frontend structure (`frontend/src`)

| Folder | Purpose |
|---|---|
| `components/` | Reusable UI, grouped by module (`layout`, `dashboard`, `assessment`, `market`, `finance`, `feasibility`, `loan`, `ai`, `common`) |
| `pages/` | One folder per route/page |
| `routes/` | `AppRoutes.jsx` (route map) + `ProtectedRoute.jsx` (auth guard placeholder) |
| `services/` | Centralized API layer — one file per backend domain |
| `context/` | `AuthContext`, `AssessmentContext` (so AI Assistant can read current assessment context anywhere) |
| `hooks/`, `utils/` | Shared logic and formatting helpers |
| `data/mockData.js` | Small placeholder objects only — never real data |
| `i18n/` | Placeholder for multi-language support (see additions below) |

### Backend structure (`backend/src`)

| Folder | Purpose |
|---|---|
| `config/` | `env.js` (reads `process.env` once), `db.js` (Mongo connection, skipped gracefully if `MONGO_URI` is empty) |
| `models/` | Mongoose schemas: `User`, `Assessment`, `Location`, `BusinessCategory`, `MarketAnalysis`, `Scheme`, `Report` |
| `controllers/` | Thin — parse request, call a service, shape response |
| `routes/` | One router per domain, mounted under `/api/<domain>` |
| `services/<domain>/` | Where real logic will live, isolated per domain (`market`, `finance`, `feasibility`, `loan`, `scheme`, `ai`) |
| `middleware/` | `authMiddleware`, `errorMiddleware`, `validationMiddleware`, plus `rateLimitMiddleware` (added — see below) |

### Database

Placeholder Mongoose models for `users`, `assessments`, `locations`, `businessCategories`, `marketAnalyses`, `schemes`, `reports`. No Atlas cluster, no credentials, no seed data — `MONGO_URI` is left blank in `.env.example` and the server boots fine without it.

### Future data & API integration

- **Static/reference data** (schemes, business categories, location reference data) → MongoDB.
- **External/live data** (GIS, population, nearby businesses, market data) → future API/service calls, kept out of the frontend entirely.
- **User/application data** (users, assessments, reports) → MongoDB.

### Future AI/ML integration

AI responsibilities (opportunity analysis, SWOT generation, risk explanation, natural-language guidance) live behind `backend/src/services/ai/`, called only from `aiController.js`. The frontend `AIAssistant` module talks to `/api/ai`, which will read the current assessment/market/financial context from the database before calling the model — never the other way around.

## Recommended development order

1. Landing page + public nav (Home, How It Works, Feasibility Calculator, About)
2. Authentication
3. Dashboard shell
4. Assessment (Personal → Business → Review stepper)
5. Market & Finance (Location, Market, Financial Calculator)
6. Feasibility engine (scores, SWOT, recommendations)
7. Loan & Schemes
8. AI Assistant (context-aware)
9. External data/API integration (GIS, population, competitor data)
10. Reports (inside the Feasibility workflow)
11. Testing & deployment

## Running locally

```bash
npm run install:all     # installs frontend + backend deps
cp backend/.env.example backend/.env   # fill in values later
npm run dev              # runs frontend (5173) + backend (5000) together
```

Or independently: `npm run dev:frontend` / `npm run dev:backend`.

---

## What I added beyond the original spec (and why)

Small, low-cost additions — nothing that changes scope or adds features:

- **`middleware/rateLimitMiddleware.js`** + `helmet` + `morgan` in `app.js` — basic abuse protection and request logging from day one, since the public Feasibility Calculator needs no login and is an open target.
- **`src/i18n/`** (frontend) — folder + locale JSON stubs only. Your own prompt slips into Hindi ("*Mere paas itna capital hai...*") — real users likely will too, and retrofitting i18n after 50 components exist is painful. No library wired in yet, just the seam.
- **`ErrorBoundary`** around the routed content in `AppLayout` — so a crash in one module (e.g. AI Assistant) doesn't take down the whole authenticated app.
- **`useFetch` hook + `apiClient.js` interceptors** — one place to later add auth-token injection and error toasts, instead of every service file duplicating it.
- **`.github/workflows/ci.yml`** + a placeholder backend test — so the very first real feature you build already runs in CI instead of that being a separate "step 12" scramble.
- **Root `package.json` with `dev` script (`concurrently`)** — one command to run both servers, since a student team will do this constantly.

Not added (deliberately, to respect your scope): no auth logic, no real validation library wired in (just the hook point), no state manager beyond Context, no TypeScript conversion, no Docker. Worth considering *later*, not now: **offline/PWA support** — your users are rural with potentially poor connectivity, and a service worker + "save assessment locally, sync later" pattern could be a real differentiator when you get to the Assessment module.
