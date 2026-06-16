# Rev_OS

An AI-native revenue operations platform that sits **on top of** your CRM — it doesn't replace it. Rev_OS pulls CRM data, scores opportunities, generates execution queues, monitors compliance, tracks coaching, and surfaces what every revenue team member should do next.

> Engineering north star: tell every rep exactly what to do next, and give managers complete visibility into performance, coaching, compliance, and revenue risk.

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, TypeScript) |
| UI | shadcn/ui, Tailwind CSS v4, Radix UI, Lucide icons |
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

**Executive**
- `/dashboard` — Overview (KPIs, AI Executive Brief, team snapshot, opportunity health, critical alerts, revenue trend)
- `/dashboard/revenue-intelligence` — Revenue, cash, and conversion + revenue by offer
- `/dashboard/forecasting` — Projected revenue, attainment, forecast chart
- `/dashboard/daily-briefings` — AI-generated daily summary + archive
- `/dashboard/ai-audits` — Automated pipeline/CRM integrity checks (severity filtered)

**Pipeline & Sales**
- `/dashboard/hot-lists` — Prioritized execution queue (Today / Overdue / Active / Closed / Lost)
- `/dashboard/leads-crm` — Lead response speed, CRM compliance, lead sources
- `/dashboard/billing` — Cash collected vs outstanding, payments
- `/dashboard/sales-team` — Team roster → individual rep profiles (`/dashboard/reps/[id]`)

**Performance**
- `/dashboard/performance` — Closer cockpit: pace to goal, priority queue, follow-ups
- `/dashboard/historical-views` — Trends over 30d / 90d / 12m
- `/dashboard/goal-tracking` — Blood/stretch goals and pacing per rep
- `/dashboard/offers` — Offer unit economics (margin, CAC, LTV, ROAS, revenue mix)

**Marketing & Team**
- `/dashboard/okrs` — Objectives and key results
- `/dashboard/asset-factory` — Sales assets by category → category detail (`/dashboard/asset-factory/[slug]`)
- `/dashboard/sop-library` — Searchable SOPs → SOP detail (`/dashboard/sop-library/[slug]`)

## Project Structure

```
src/
  app/
    dashboard/            # All product pages (see Routes)
    sign-in/ sign-up/     # Clerk auth screens
    layout.tsx            # Root layout (ClerkProvider, fonts, TooltipProvider)
  components/
    dashboard-shell.tsx   # Sidebar + header + breadcrumbs wrapper
    page-container.tsx     # Shared max-w content container
    page-header.tsx        # Shared page title/subtitle
    score-pill.tsx         # Shared priority-score pill
    progress-bar.tsx       # Shared progress bar
    overview/              # Overview page sections
    charts/                # Recharts client components
    ui/                    # shadcn/ui primitives
  lib/                    # Mock data + helpers (reps, opportunities, assets, sops)
  db/                     # Drizzle schema + client
```

## Multi-Tenancy

Tenancy is handled through **Clerk organizations**; the active org drives the sidebar branding and scopes data. The Drizzle schema carries an `organization_id` on tenant-scoped tables.

## Status

MVP UI build. Pages are populated with representative mock data in `src/lib/*`, ready to be wired to live CRM data (GoHighLevel / Close) and the database. CRM/tool connections will be handled via an onboarding flow (Pipedream Connect).

