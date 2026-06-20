# Marbles

**From conversation to contract.**
*AI-native CPQ for service-based businesses.*

Marbles turns a messy client conversation into a scoped, priced statement of work in minutes — then converts the approved SOW into a contract and tracks delivery through to close. Built for services businesses that sell custom work, not SKUs: agencies, consultancies, dev shops, marketing firms, and professional services teams.

> The hard part of services CPQ is "Configure" — figuring out what work the client actually needs. Product CPQ tools can't do it (no catalog to pick from). Marbles does it with AI, from the call, the brief, or the connected repo.

## How it works (the CPQ loop)

```
client brief  →  Configure          →  Quote       →  Contract   →  Deliver
(opportunity)     (AI blueprint)        (SOW + price)  (signed)      (work orders)
```

1. **Configure** — drop in sales-call notes or a brief, or attach a repo. The blueprint engine drafts a structured SOW / PRD / spec: scope, deliverables, assumptions, open questions.
2. **Quote** — the SOW *is* the quote, with a price line.
3. **Contract** — an approved SOW converts to a signed contract record.
4. **Deliver** — the contract spawns trackable work orders for the build team. Change requests stay scoped (no creep).

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, TypeScript) |
| UI | shadcn/ui (preset `b0`, monochrome), Tailwind CSS v4, Radix UI, Lucide icons |
| Editor | Editor.js (blueprint / SOW documents) |
| Charts | Recharts |
| Auth | Clerk (organizations + role-based access) |
| Database | Postgres (Supabase) via Drizzle ORM |
| AI | Groq (Qwen3-32B) for blueprint + quote generation and chat |
| Integrations | Pipedream Connect (GitHub), Novu (in-app notifications) |

## Status

The blueprint engine (Configure + Quote) and the CPQ data model are built. The database is not yet wired (`DATABASE_URL` is empty), so most pages render representative mock data. The next milestone is the live loop: **opportunity → blueprint (quote) → contract → work orders**.

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

The Drizzle schema (`src/db/schema.ts`) models the services-CPQ lifecycle, scoped per Clerk organization (`organization_id` on every table):

- **organizations / users** — synced from Clerk; roles: `founder`, `manager`, `closer`, `setter`, `revops`
- **opportunities** + `opportunity_notes` + `opportunity_activities` — the deal (CPQ input)
- **blueprints** — the Configure + Quote output: AI-generated SOWs / PRDs / specs, with `status` (draft → approved) and `deliverableKind` (sow / prd / spec)
- **work_orders** — delivery tasks spawned from an approved contract, linked back to the opportunity and blueprint
- **call_reviews** — sales-call coaching scores (discovery, tonality, qualification, objection, closing)
- **follow_up_tasks** — the follow-up cadence engine
- **compliance_violations** — delivery gates

> Pending: the **contract** record that an approved blueprint converts into, completing the Configure → Quote → Contract → Deliver spine.

## Dashboard

All app pages live under `/dashboard` and share the `DashboardShell` (sidebar, breadcrumbs, org switcher, Novu inbox).

- `/dashboard/blueprints` — **Blueprint Studio** (the Configure/Quote engine): create (`/new`), view/edit (`/[id]`)
- Other dashboard pages cover the pipeline, delivery, coaching, and metrics around the CPQ loop.

## Project Structure

```
src/
  app/
    dashboard/            # Product pages (pipeline, blueprints, delivery, coaching, metrics)
    sign-in/ sign-up/     # Clerk auth screens
    api/                  # Route handlers (blueprints, pipedream)
    layout.tsx            # Root layout (ClerkProvider, fonts, TooltipProvider)
  components/
    blueprints/           # Editor.js blueprint/SOW editor + document renderer + studio chat
    ui/                   # shadcn/ui primitives
    overview/             # Overview page sections
    dashboard-shell.tsx   # Sidebar + header + breadcrumbs wrapper
  lib/
    blueprints/           # Configure/Quote engine (prompts, intent, LLM, templates) + tests
    pipedream/            # Pipedream Connect (GitHub) server + client
    ai/                   # AI helpers
  db/                     # Drizzle schema + client
```

## Multi-Tenancy

Tenancy is handled through **Clerk organizations**; the active org drives the sidebar branding and scopes data. The Drizzle schema carries an `organization_id` on every tenant-scoped table.
