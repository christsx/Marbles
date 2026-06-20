# Marbles

**From conversation to contract.**
*AI-native CPQ for service-based businesses.*

Marbles turns a client conversation into a scoped, priced SOW in minutes, then converts the approved SOW into a contract and tracks delivery to close.

For services businesses that sell **custom work, not SKUs**: agencies, consultancies, dev shops, marketing firms, and professional services teams.

## Why Marbles

Services firms sell work with no catalog. Every deal is scoped from scratch, by hand, by senior people. That is a 4–8 hour proposal tax on every deal, and nothing on the market removes it.

- **Product CPQ tools can't help.** Salesforce CPQ and DealHub configure products from a price list. There's nothing to configure when the deliverable is "an automation for our ops team."
- **Proposal tools only format.** PandaDoc, Qwilr, and Proposify template what you already wrote. They don't write the scope. You still start from a blank doc.
- **Marbles writes the scope.** It reads the call, the brief, or the repo and drafts the SOW.

## How it works

```
client brief  →  Configure        →  Quote       →  Contract   →  Deliver
(opportunity)     (AI blueprint)     (SOW + price)  (signed)      (work orders)
```

1. **Configure.** Drop in call notes or a brief, or attach a repo. The blueprint engine drafts a structured SOW, PRD, or spec: scope, deliverables, assumptions, open questions.
2. **Quote.** The SOW is the quote, with a price line.
3. **Contract.** An approved SOW becomes a signed contract record.
4. **Deliver.** The contract spawns trackable work orders. Change requests stay scoped.

## Features (beyond the loop)

- **Template library:** SOW, proposal, discovery brief, PRD, technical spec, arc42 architecture, change request.
- **Repo grounding:** attach a GitHub repo so scope reflects real code, not guesses.
- **Sales coaching:** call-review scores across discovery, tonality, qualification, objection, closing.
- **Multi-tenant:** one Clerk org per firm, role-based access, data scoped per org.
- **Export:** download any response as Markdown.

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, TypeScript) |
| UI | shadcn/ui (preset `b0`, monochrome), Tailwind CSS v4, Radix UI, Lucide |
| Editor | Editor.js (SOW and blueprint documents) |
| Charts | Recharts |
| Auth | Clerk (organizations + RBAC) |
| Database | Postgres (Supabase) via Drizzle ORM |
| AI | Groq (Qwen3-32B) for blueprint, quote, and chat |
| Integrations | Pipedream Connect (GitHub), Novu (in-app notifications) |

## Status & Roadmap

**Built:** AI blueprint engine (Configure + Quote), CPQ data model, template library, blueprint chat, call-coaching schema.

**Next:** wire the live database, complete quote-to-contract, run the loop on a real engagement, then add AI pricing (the "Price" in CPQ) from rate cards and historical margins.

> The blueprint engine generates real SOWs, PRDs, and specs from attachments and chat today. The database is not wired yet, so most dashboard pages render representative mock data.

## Getting Started

### 1. Install

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

| Variable | Where to get it |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys |
| `DATABASE_URL` | Supabase → Project Settings → Database |
| `NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER` | Novu Dashboard → Settings |
| `GROQ_API_KEY` | Groq Console → API Keys |
| Clerk path and redirect vars | Match the Clerk Account Portal fields (see `.env.example`) |

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Unauthenticated users redirect to `/sign-in`; after auth they land on `/dashboard`.

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

The Drizzle schema (`src/db/schema.ts`) models the services-CPQ lifecycle, scoped per organization (`organization_id` on every table):

| Table | Role in the CPQ loop |
| --- | --- |
| `organizations` / `users` | synced from Clerk; roles: founder, manager, closer, setter, revops |
| `opportunities` (+ notes, activities) | the deal, CPQ input |
| `blueprints` | Configure + Quote output: AI SOWs, PRDs, specs (`status`: draft → approved) |
| `work_orders` | delivery tasks spawned from an approved contract |
| `call_reviews` | sales-call coaching scores |
| `follow_up_tasks` | follow-up cadence engine |
| `compliance_violations` | delivery gates |

## Project Structure

```
src/
  app/
    dashboard/            # Product pages (pipeline, blueprints, delivery, coaching, metrics)
    sign-in/ sign-up/     # Clerk auth screens
    api/                  # Route handlers (blueprints, pipedream)
    layout.tsx            # Root layout (ClerkProvider, fonts)
  components/
    blueprints/           # Editor.js SOW editor, renderer, studio chat
    ui/                   # shadcn/ui primitives
    overview/             # Overview page sections
    dashboard-shell.tsx   # Sidebar, header, breadcrumbs wrapper
  lib/
    blueprints/           # Configure/Quote engine (prompts, intent, LLM, templates) + tests
    pipedream/            # Pipedream Connect (GitHub)
    ai/                   # AI helpers
  db/                     # Drizzle schema + client
```
