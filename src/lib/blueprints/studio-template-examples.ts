import type { OutputData } from "@editorjs/editorjs"

/** Sample content shown when a template opens. Replace via chat with real client details. */
export const TEMPLATE_SECTION_EXAMPLES: Record<string, Record<string, string>> = {
  "client-sow": {
    Overview:
      "Acme Logistics wants a client-facing order portal so shippers can book freight, track shipments, and download invoices without calling support. Today they use email and spreadsheets; the goal is a self-serve web app integrated with their existing TMS.",
    "In scope":
      "- Responsive client portal (web)\n- Single sign-on with Acme's Microsoft Entra ID\n- Shipment list, detail view, and status timeline\n- Invoice PDF download for the last 24 months\n- Admin dashboard for Acme staff to invite clients and manage access",
    "Out of scope":
      "- Mobile native apps (iOS/Android)\n- TMS workflow changes or carrier dispatch logic\n- Historical data migration before 2022\n- White-label theming for sub-brands",
    Deliverables:
      "- Phase 1: Auth, client list, shipment read-only views\n- Phase 2: Invoice downloads and email notifications\n- Phase 3: Admin invite flow, audit log, and UAT sign-off pack",
    Assumptions:
      "- Acme provides sandbox TMS API credentials within one week of kickoff\n- Up to 50 pilot client accounts for UAT\n- Design sign-off within five business days of wireframe delivery\n- Acme IT handles DNS and SSL for portal.acme-logistics.com",
    "Open questions":
      "- Which invoice fields must appear on PDF vs. in-app only?\n- Do clients need multi-user accounts per company?\n- Is weekend go-live acceptable or weekdays only?",
    "Implementation tasks":
      "1. Discovery workshop and API access validation\n2. Portal shell, auth, and role model\n3. Shipment and invoice read APIs wired to TMS\n4. Admin invite and audit trail\n5. UAT, training doc, and production cutover",
    "Gaps to resolve":
      "- Rate limits and SLA for the TMS API are not documented\n- Branding assets (logo, colors) not yet shared",
  },
  "client-proposal": {
    "Executive summary":
      "Acme Logistics needs a modern client portal to reduce support load and speed up invoice access. We recommend a phased web build integrated with their TMS, starting with read-only visibility and expanding to self-serve admin tools.",
    Problem:
      "Clients call and email for shipment updates and invoices. Support spends roughly 12 hours per week on status lookups. There is no single place for clients to sign in and see their own data.",
    "Recommended approach":
      "Build a secure web portal on Next.js, connect to Acme's TMS via existing REST APIs, and use Entra ID for login. Phase delivery so Acme gets value after phase 1 while we add invoices and admin features in later phases.",
    "Phased outline":
      "- Phase 1: Login, shipment list and detail (6 weeks)\n- Phase 2: Invoices and notifications (4 weeks)\n- Phase 3: Admin tools, audit, launch support (3 weeks)",
    Assumptions:
      "- TMS API documentation is accurate and stable\n- Acme assigns a product owner for weekly check-ins\n- Content for client-facing copy provided by Acme marketing",
    "Open questions":
      "- Preferred launch date and blackout periods?\n- Any compliance requirements (SOC 2, data residency)?",
  },
  "client-discovery": {
    "Client context":
      "Acme Logistics, mid-market freight broker (~120 staff). VP Operations sponsored the project after Q4 client satisfaction scores flagged 'hard to get shipment updates' as the top complaint.",
    "Current state":
      "Clients email dispatch or account managers for status. Internal team copies data from TMS into replies. Invoices are emailed manually as PDF attachments from accounting.",
    "Pain points":
      "- Slow response times on status requests (often same-day, not real-time)\n- No client self-service; everything routes through support\n- Invoice resends create duplicate threads and confusion\n- Sales worries enterprise prospects expect a modern portal",
    "Systems and data":
      "- Mercury TMS (REST API, read-heavy for this project)\n- Microsoft Entra ID for staff; clients currently have no SSO\n- QuickBooks for invoicing; PDFs stored on shared drive",
    "Success criteria":
      "- 80% of pilot clients log in at least once in the first month\n- Support tickets tagged 'shipment status' down 40% within 90 days of launch\n- Invoice download available without staff intervention",
    "Risks and constraints":
      "- TMS vendor API changes scheduled for Q3 (need compatibility plan)\n- Budget cap for phase 1; phase 2 contingent on board approval\n- Must not store PII outside US regions",
  },
  "client-handoff": {
    "Deliverables summary":
      "- Production client portal at portal.acme-logistics.com\n- Admin guide and 5-minute client onboarding video\n- Runbook for support tier 1\n- Two weeks hypercare with shared Slack channel",
    "How to use it":
      "1. Clients receive invite email and sign in with Microsoft or magic link\n2. Shipments tab shows active and delivered loads; click a row for timeline detail\n3. Invoices tab lists PDFs; downloads are logged in the audit trail\n4. Admins use Admin → Clients to invite users and deactivate access",
    "Access and credentials":
      "- Production URLs and API keys in Acme 1Password vault (Portal Production folder)\n- Azure app registration owned by it-admin@acme-logistics.com\n- TMS read token rotates every 90 days; calendar reminder set",
    "Support window":
      "Hypercare: Mon–Fri 9am–6pm ET, Jan 6–Jan 17\nEscalation: engineering@youragency.com, then Acme IT for Entra/TMS issues\nAfter hypercare: standard SLA per MSA (P2 within 4 business hours)",
    "Open items":
      "Branded email templates for invite reminders (Acme marketing to supply copy)\nOptional phase 2: bulk CSV export for enterprise client",
  },
  "internal-prd": {
    Problem:
      "Support and account teams manually answer shipment and invoice requests because clients lack a self-serve portal tied to TMS data.",
    Goals:
      "- Cut status-related support tickets by 40% within 90 days of launch\n- Ship phase 1 (auth + shipment views) within 6 weeks of kickoff\n- Maintain p95 page load under 2s for shipment list (500 rows max per client)",
    Users:
      "- Client user: shipper employee who tracks loads and downloads invoices\n- Client admin: can invite colleagues at the same company\n- Acme staff admin: internal ops who manage client access and audit activity",
    Requirements:
      "- Users sign in via Entra ID or email magic link\n- Shipment list filterable by status and date range\n- Invoice PDF download with audit log entry\n- Role-based access: client users never see other companies' data",
    "Success metrics":
      "- Weekly active client users (target: 60% of invited pilot cohort)\n- Median time-to-first-login after invite (< 48 hours)\n- Error rate on TMS API proxy (< 0.5% of requests)",
    "Out of scope":
      "- Booking new shipments in the portal\n- Carrier-facing features\n- Offline mode or native mobile apps",
  },
  "internal-tech-spec": {
    Context:
      "Next.js app on Vercel; BFF routes proxy to Mercury TMS REST API. Auth via NextAuth with Entra ID and email provider. All client data scoped by companyId from TMS.",
    "Architecture overview":
      "- Browser → Next.js (RSC + API routes) → TMS API\n- Session store: encrypted JWT; no shipment data in cookies\n- Background jobs: none for phase 1 (sync on read with 60s cache)",
    "APIs and data":
      "- GET /api/shipments?companyId — paginated list, maps TMS /loads\n- GET /api/shipments/[id] — detail + timeline events\n- GET /api/invoices/[id]/pdf — streams PDF from TMS or S3 cache",
    Integrations:
      "- Mercury TMS REST (OAuth client credentials, read scope)\n- SendGrid for transactional email (invites, invoice ready)\n- Sentry for error tracking; Datadog RUM optional phase 2",
    "Non-functional requirements":
      "- All traffic TLS 1.2+; secrets in Vercel env only\n- Rate limit TMS proxy 100 req/min per session\n- WCAG 2.1 AA for client-facing pages",
    "Test expectations":
      "- Contract tests against TMS sandbox for list/detail shapes\n- E2E: invite → login → view shipment → download invoice\n- Load test: 50 concurrent users on shipment list",
  },
  "internal-arc42": {
    "Introduction and goals":
      "Client portal for Acme Logistics shippers. Quality goals: secure multi-tenant isolation, sub-2s list views, and minimal operational burden (serverless hosting).",
    Constraints:
      "- Must use existing TMS APIs only (no direct DB access)\n- US-only data processing\n- Team of 2 engineers + 1 designer for 13-week timeline",
    "Context and scope":
      "- External: clients (browser), Mercury TMS, Entra ID, SendGrid\n- Internal: Acme support staff via admin UI\n- Boundary: portal does not write back to TMS in phase 1",
    "Building blocks":
      "- Web UI (Next.js App Router)\n- Auth module (NextAuth + Entra)\n- TMS gateway (API routes, caching, error mapping)\n- Admin module (invites, audit log)",
    "Runtime view":
      "Client opens /shipments → session validated → BFF calls TMS with company scope → JSON mapped to UI models → rendered table. Invoice download: BFF fetches PDF stream, sets Content-Disposition.",
    "Deployment view":
      "Vercel production + preview environments\nSecrets per environment in Vercel; TMS sandbox for preview\nDNS: portal.acme-logistics.com CNAME to Vercel",
  },
  "internal-change-request": {
    "Requested change":
      "Add bulk CSV export of shipment history (up to 12 months) for client admin users, originally out of scope for phase 1.",
    Rationale:
      "Enterprise pilot client (Northwind Freight) requires monthly reconciliation export for their ERP import; deal at risk without it.",
    "Impact on scope":
      "- Adds export job + email delivery when file ready\n- Extends TMS gateway with export endpoint and async polling\n- UAT extended by one week; invoice phase 2 start shifts accordingly",
    "Timeline impact":
      "Original phase 1 end: Feb 14 → revised: Feb 21\nPhase 2 kickoff moves from Feb 17 to Feb 24",
    "Cost impact":
      "Additional 24 engineering hours (~$4,800 at agreed rate)\nAssumes TMS supports export or paginated bulk read without new vendor fee",
    Approval:
      "Acme VP Operations (Jamie Chen) — sign-off requested by Jan 10\nUpon approval, update SOW appendix A and re-baseline milestone dates",
  },
}

export function getSectionExample(templateId: string, heading: string) {
  return TEMPLATE_SECTION_EXAMPLES[templateId]?.[heading]
}
