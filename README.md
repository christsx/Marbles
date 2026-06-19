# Agency OS

The operating system for running an AI agency — pipeline, scoping, and delivery in one place.

> North star: turn every won conversation into a buildable blueprint, then ship and coach against it — with full visibility into pipeline, delivery, and margin.

## What it is

Agency OS unifies the three things every AI/software agency stitches together by hand today:

1. **Pipeline** — opportunities, follow-up cadences, and priority scoring (sales)
2. **Blueprints** — AI-generated SOWs, PRDs, specs, and arc42 architecture docs, grounded in a connected GitHub repo (scoping)
3. **Coaching & QA** — call reviews and compliance checks against delivery (quality)

The hero feature is the **Blueprint Studio**: hand it a sales conversation, intake notes, or an attached brief and it drafts a structured Editor.js document (SOW / PRD / spec / arc42) grounded in your connected repository — powered by Groq with Qwen3-32B.

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, TypeScript) |
| UI | shadcn/ui (preset `b0`, monochrome), Tailwind CSS v4, Radix UI, Lucide icons |
| Editor | Editor.js (blueprint documents) |
| Charts | Recharts |
| Auth | Clerk (organizations + role-based access) |
| Database | Postgres (Supabase) via Drizzle ORM |
| AI | Groq (Qwen3-32B) for blueprint generation + chat |
| Integrations | Pipedream Connect (GitHub), Novu (in-app notifications) |

## Status

The blueprint engine and the sales/opps data model are built. The dashboard pages are mid-migration from an earlier SDLC concept to the agency domain, and the database is not yet wired (`DATABASE_URL` is empty), so most pages currently render representative mock data. The first end-to-end workflow being connected is **opportunity → blueprint → delivery**.

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
| `GROQ_API_KEY` | Groq Console → API Keys |
| Clerk path + redirect vars | Match the Clerk Account Portal fields (see `.env.example`) |

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
| `npm run test` | Run vitest once |
| `npm run test:watch` | Vitest watch mode |
| `npm run db:generate` | Generate Drizzle migrations from schema |
| `npm run db:migrate` | Apply migrations |
| `npm run db:push` | Push schema directly to the database |
| `npm run db:studio` | Open Drizzle Studio |

## Data Model

The Drizzle schema (`src/db/schema.ts`) models agency operations, scoped per Clerk organization (`organization_id` on every table):

- **organizations / users** — synced from Clerk; roles: `founder`, `manager`, `closer`, `setter`, `revops`
- **opportunities** + `opportunity_notes` + `opportunity_activities` — the sales pipeline with priority scoring
- **follow_up_tasks** — the follow-up cadence engine
- **call_reviews** — call coaching scores (discovery, tonality, qualification, objection, closing)
- **compliance_violations** — CRM hygiene / delivery gates

> Note: a `work_orders` table to link blueprints → trackable delivery tasks is the next planned addition.

## Dashboard

All app pages live under `/dashboard` and share the `DashboardShell` (sidebar, breadcrumbs, org switcher, Novu inbox).

- `/dashboard/blueprints` — **Blueprint Studio** (the live AI feature): create (`/new`), view/edit (`/[id]`)
- Other dashboard pages are being repurposed from the earlier SDLC layout to agency workflows (pipeline, delivery, coaching, metrics)

## Project Structure

```
src/
  app/
    dashboard/            # Product pages (see Dashboard)
    sign-in/ sign-up/     # Clerk auth screens
    api/                  # Route handlers (blueprints, pipedream)
    layout.tsx            # Root layout (ClerkProvider, fonts, TooltipProvider)
  components/
    blueprints/           # Editor.js blueprint editor + document renderer + studio chat
    ui/                   # shadcn/ui primitives
    overview/             # Overview page sections
    dashboard-shell.tsx   # Sidebar + header + breadcrumbs wrapper
  lib/
    blueprints/           # Blueprint engine (prompts, intent, LLM, templates) + tests
    pipedream/            # Pipedream Connect (GitHub) server + client
    ai/                   # AI helpers
  db/                     # Drizzle schema + client
```

## Multi-Tenancy

Tenancy is handled through **Clerk organizations**; the active org drives the sidebar branding and scopes data. The Drizzle schema carries an `organization_id` on every tenant-scoped table.
