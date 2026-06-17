# Torse

An AI-native software factory — an SDLC platform where a fleet of AI agents takes work from **requirement → blueprint → work order → tests → ship**, with full visibility into throughput, quality, and cost.

> Engineering north star: tell every agent exactly what to build next, and give the team complete visibility into delivery, quality, reliability, and cost.

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, TypeScript) |
| UI | shadcn/ui (preset `b0`, monochrome), Tailwind CSS v4, Radix UI, Lucide icons |
| Editor | Editor.js (blueprint documents) |
| Charts | Recharts |
| Auth | Clerk (organizations + role-based access) |
| Database | Postgres (Supabase) via Drizzle ORM |
| Notifications | Novu (in-app inbox) |

## Getting Started

### 1. Install

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

| Variable | Where to get it |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys |
| `DATABASE_URL` | Supabase → Project Settings → Database |
| `NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER` | Novu Dashboard → Settings |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `SIGN_UP_URL` | Match the Clerk Account Portal paths |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` / `SIGN_UP_...` | Post-auth landing route (`/dashboard`) |

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Unauthenticated users are redirected to `/sign-in`; after auth they land on `/dashboard`.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate Drizzle migrations from schema |
| `npm run db:migrate` | Apply migrations |
| `npm run db:push` | Push schema directly to the database |
| `npm run db:studio` | Open Drizzle Studio |

## Routes

All app pages live under `/dashboard` and share the `DashboardShell` (sidebar, breadcrumbs, org switcher, Novu inbox).

**Factory**
- `/dashboard` — Overview (hero KPIs, shipping activity graph, repo status, AI factory brief)
- `/dashboard/requirements` — Scored intake from every source → buildable specs
- `/dashboard/blueprints` — Architecture/design plans with Editor.js docs → create (`/new`), view/edit (`/[id]`)
- `/dashboard/work-orders` — The agent execution queue (Now / In Review / Blocked / Queued / Shipped)

**Build & Ship**
- `/dashboard/agents` — Agent fleet → individual agent profiles (`/dashboard/agents/[id]`), provision new agents (`/dashboard/agents/new`)
- `/dashboard/artifacts` — PRs, modules, schemas, tests, migrations, docs → category detail (`/dashboard/artifacts/[slug]`)
- `/dashboard/tests` — Suite health, coverage gate, failing + flaky tests
- `/dashboard/deployments` — Releases, rollbacks, and the release train

**Quality**
- `/dashboard/code-review` — AI review findings across PRs (severity filtered)
- `/dashboard/feedback` — User/QA signal that feeds back into requirements
- `/dashboard/incidents` — Production incidents, MTTR, and postmortems
- `/dashboard/metrics` — Delivery metrics (DORA) and throughput by repo

**Operate**
- `/dashboard/briefings` — AI-generated daily factory summary + archive
- `/dashboard/cost` — Compute spend, token usage, and cost per work order by model
- `/dashboard/roadmap` — Objectives and key results
- `/dashboard/playbooks` — Searchable engineering playbooks → detail (`/dashboard/playbooks/[slug]`)

## Project Structure

```
src/
  app/
    dashboard/            # All product pages (see Routes)
    sign-in/ sign-up/     # Clerk auth screens
    layout.tsx            # Root layout (ClerkProvider, fonts, TooltipProvider)
  components/
    blueprints/           # Editor.js blueprint editor + document renderer
    dashboard-shell.tsx   # Sidebar + header + breadcrumbs wrapper
    page-container.tsx    # Shared max-w content container
    page-header.tsx       # Shared page title/subtitle
    score-pill.tsx        # Shared priority-score pill
    progress-bar.tsx      # Shared progress bar
    overview/             # Overview page sections
    ui/                   # shadcn/ui primitives
  lib/                    # Mock data + helpers (agents, work-orders, requirements, blueprints, artifacts, playbooks)
  db/                     # Drizzle schema + client
```

## Multi-Tenancy

Tenancy is handled through **Clerk organizations**; the active org drives the sidebar branding and scopes data. The Drizzle schema carries an `organization_id` on tenant-scoped tables.

## Status

UI build. Pages are populated with representative mock data in `src/lib/*`, ready to be wired to live source control, CI, and agent runtimes. The design system is generated from the shadcn `b0` preset (monochrome).
