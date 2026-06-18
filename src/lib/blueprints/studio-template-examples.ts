/** Sample content when a template opens. Replace via chat with real engagement details. */
export const TEMPLATE_SECTION_EXAMPLES: Record<string, Record<string, string>> = {
  "client-sow": {
    Overview:
      "Acme Logistics wants a shipper portal so customers can track freight and download invoices without calling support. Today they use email and spreadsheets. The goal is a self serve web app integrated with their TMS.",
    "In scope":
      "- Responsive shipper portal (web)\n- Single sign on with Acme Microsoft Entra ID\n- Shipment list, detail view, and status timeline\n- Invoice PDF download for the last 24 months\n- Admin dashboard for Acme staff to invite users and manage access",
    "Out of scope":
      "- Mobile native apps (iOS/Android)\n- TMS workflow changes or carrier dispatch logic\n- Historical data migration before 2022\n- White label theming for sub brands",
    Deliverables:
      "- Phase 1: Auth, user list, shipment read only views\n- Phase 2: Invoice downloads and email notifications\n- Phase 3: Admin invite flow, audit log, and UAT sign off pack",
    Assumptions:
      "- Acme provides sandbox TMS API credentials within one week of kickoff\n- Up to 50 pilot accounts for UAT\n- Design sign off within five business days of wireframe delivery\n- Acme IT handles DNS and SSL for portal.acme-logistics.com",
    "Open questions":
      "- Which invoice fields must appear on PDF vs in app only?\n- Do shippers need multi user accounts per company?\n- Is weekend go live acceptable or weekdays only?",
    "Implementation tasks":
      "1. Discovery workshop and API access validation\n2. Portal shell, auth, and role model\n3. Shipment and invoice read APIs wired to TMS\n4. Admin invite and audit trail\n5. UAT, training doc, and production cutover",
    "Gaps to resolve":
      "- Rate limits and SLA for the TMS API are not documented\n- Branding assets (logo, colors) not yet shared",
  },
  "client-proposal": {
    "Executive summary":
      "Acme Logistics needs a modern shipper portal to reduce support load and speed up invoice access. We recommend a phased web build integrated with their TMS, starting with read only visibility and expanding to self serve admin tools.",
    Problem:
      "Shippers call and email for shipment updates and invoices. Support spends roughly 12 hours per week on status lookups. There is no single place to sign in and see their own data.",
    "Recommended approach":
      "Build a secure web portal on Next.js, connect to Acme TMS via existing REST APIs, and use Entra ID for login. Phase delivery so Acme gets value after phase 1 while invoices and admin features land in later phases.",
    "Phased outline":
      "- Phase 1: Login, shipment list and detail (6 weeks)\n- Phase 2: Invoices and notifications (4 weeks)\n- Phase 3: Admin tools, audit, launch support (3 weeks)",
    "Timeline and investment":
      "Total timeline: 13 weeks from kickoff to production\nPhase 1: weeks 1 to 6. Phase 2: weeks 7 to 10. Phase 3: weeks 11 to 13\nInvestment: $84,000 fixed fee (design, build, UAT support, hypercare)\nPayment: 40% kickoff, 30% phase 1 UAT, 30% go live",
    Assumptions:
      "- TMS API documentation is accurate and stable\n- Acme assigns a product owner for weekly check ins\n- Customer facing copy provided by Acme marketing",
    "Open questions":
      "- Preferred launch date and blackout periods?\n- Any compliance requirements (SOC 2, data residency)?",
  },
  "client-discovery": {
    "Stakeholder context":
      "Acme Logistics, mid market freight broker (~120 staff). VP Operations sponsored the project after Q4 satisfaction scores flagged slow shipment updates as the top complaint.",
    "Current state":
      "Shippers email dispatch or account managers for status. Internal team copies data from TMS into replies. Invoices are emailed manually as PDF attachments from accounting.",
    "Pain points":
      "- Slow response times on status requests (often same day, not real time)\n- No self service. Everything routes through support\n- Invoice resends create duplicate threads and confusion\n- Sales worries enterprise prospects expect a modern portal",
    "Systems and data":
      "- Mercury TMS (REST API, read heavy for this project)\n- Microsoft Entra ID for staff. Shippers currently have no SSO\n- QuickBooks for invoicing. PDFs stored on shared drive",
    "Success criteria":
      "- 80% of pilot users log in at least once in the first month\n- Support tickets tagged shipment status down 40% within 90 days of launch\n- Invoice download available without staff intervention",
    "Risks and constraints":
      "- TMS vendor API changes scheduled for Q3 (need compatibility plan)\n- Budget cap for phase 1. Phase 2 contingent on board approval\n- Must not store PII outside US regions",
  },
  "client-handoff": {
    "Deliverables summary":
      "- Production shipper portal at portal.acme-logistics.com\n- Admin guide and 5 minute onboarding video\n- Runbook for support tier 1\n- Two weeks hypercare with shared Slack channel",
    "How to use it":
      "1. Users receive invite email and sign in with Microsoft or magic link\n2. Shipments tab shows active and delivered loads. Click a row for timeline detail\n3. Invoices tab lists PDFs. Downloads are logged in the audit trail\n4. Admins use Admin, Clients to invite users and deactivate access",
    "Access and credentials":
      "- Production URLs and API keys stored in Acme 1Password vault (Portal Production folder)\n- Azure app registration owned by it-admin@acme-logistics.com\n- Do not paste secrets in this doc. Reference vault entries only",
    "Support window":
      "Hypercare: Mon to Fri 9am to 6pm ET, Jan 6 to Jan 17\nEscalation: platform@acme-logistics.com, then Acme IT for Entra/TMS issues\nAfter hypercare: standard SLA per MSA (P2 within 4 business hours)",
    "Open items":
      "Branded email templates for invite reminders (Acme marketing to supply copy)\nOptional phase 2: bulk CSV export for enterprise shipper",
  },
  "marketing-campaign-brief": {
    "Campaign objective":
      "Drive 60% of active Acme shipper accounts to log into the new portal within 30 days of launch, reducing status ticket volume before Q2.",
    "Target audience":
      "- Primary: operations managers at mid market shippers (50 to 500 loads/month)\n- Secondary: AP/finance staff who chase invoice copies\n- Exclude: prospects not yet on Acme TMS",
    "Core message":
      "Your shipments and invoices, one login away. No more email tag for status updates.",
    "Channels and tactics":
      "- Email: 3 part nurture to account contacts (announce, how to, reminder)\n- In app banner in legacy extranet during transition\n- Account manager call script for top 20 accounts\n- LinkedIn posts from Acme ops leadership (2x launch week)",
    "Assets and deliverables":
      "- Launch email templates (HTML + plain text)\n- 90 second product walkthrough video\n- FAQ page and help center articles\n- Sales one pager for AM team",
    Timeline:
      "- T minus 14: assets approved\n- T minus 7: email 1 scheduled\n- Launch day: portal live + email 2\n- T plus 7: reminder email + metrics review\n- T plus 30: campaign recap",
    "Budget and resources":
      "$12,000 media and production. Acme marketing owner plus studio copy support. Video vendor for walkthrough",
    "Success metrics":
      "- Portal logins: 60% of active accounts in 30 days\n- Email open rate above 35%, click rate above 8%\n- Support tickets tagged shipment status down 25% vs prior month",
    "Open questions":
      "- Can we use customer logos in launch emails?\n- Magic link vs Entra only for first login cohort?",
  },
  "marketing-launch-plan": {
    "Launch overview":
      "Go live for Acme shipper portal on Feb 3. Target: existing accounts in US mid market segment. Coordinated product, support, marketing, and account management.",
    "Launch goals":
      "- Zero SEV1 incidents in launch week\n- 500+ unique logins in first 7 days\n- All tier 1 support trained before launch day",
    "Rollout phases":
      "- Pre launch (Jan 13 to Feb 2): beta with 25 pilot accounts, fix P1 bugs, train support\n- Launch (Feb 3): production cutover, emails, AM outreach to top accounts\n- Post launch (Feb 4 to 28): monitor metrics, weekly office hours, recap at day 30",
    "Channel checklist":
      "- Email: 3 part sequence loaded in HubSpot\n- Status page updated\n- Help center articles published\n- AM call list for top 20 accounts\n- Internal Slack #portal-launch war room",
    "Owners and RACI":
      "- Product owner: Jamie Chen (Acme)\n- Build team lead: platform engineering\n- Marketing: Acme marketing + studio copy\n- Support enablement: Acme support manager",
    "Dependencies and risks":
      "- TMS rate limit increase must be confirmed by Jan 28\n- Entra SSO prod app approval pending IT\n- Risk: invoice PDF latency under load (load test Jan 25)",
    "Comms and enablement":
      "Internal FAQ for support and sales. Customer facing FAQ on help center. Talking points: self serve status, invoice download, same day onboarding",
    "Success metrics":
      "- Login adoption, ticket deflection, p95 page load, error rate on TMS proxy",
  },
  "marketing-campaign-recap": {
    "Campaign summary":
      "Shipper portal adoption campaign, Feb 3 to Mar 4. Goal: drive logins and reduce status tickets. Primary channels: email, AM outreach, help center.",
    "What we executed":
      "- 3 email HubSpot sequence to 1,240 contacts\n- AM calls to top 20 accounts (18 completed)\n- Help center refresh with 6 articles\n- LinkedIn posts (2) from VP Operations",
    "Results vs goals":
      "Logins: 58% of active accounts (goal 60%)\nEmail open: 41% (goal 35%)\nStatus tickets: down 31% (goal 25%)\np95 load: 1.6s (goal under 2s)",
    "What worked":
      "- Email 2 (how to video) had highest click rate\n- AM calls converted enterprise holdouts\n- Magic link reduced first login friction vs SSO only",
    "What did not work":
      "- LinkedIn organic reach below target\n- Reminder email at T plus 7 overlapped with holiday. Lower opens",
    Recommendations:
      "- Always on onboarding email for new accounts\n- Quarterly feature tips email\n- Retire legacy extranet banner by Apr 1",
  },
  "internal-prd": {
    Problem:
      "Support and account teams manually answer shipment and invoice requests because shippers lack a self serve portal tied to TMS data.",
    Goals:
      "- Cut status related support tickets by 40% within 90 days of launch\n- Ship phase 1 (auth + shipment views) within 6 weeks of kickoff\n- Maintain p95 page load under 2s for shipment list (500 rows max per tenant)",
    Users:
      "- Shipper user: tracks loads and downloads invoices\n- Shipper admin: can invite colleagues at the same company\n- Acme staff admin: internal ops who manage access and audit activity",
    Requirements:
      "- Users sign in via Entra ID or email magic link\n- Shipment list filterable by status and date range\n- Invoice PDF download with audit log entry\n- Role based access: users never see other companies data",
    "Success metrics":
      "- Weekly active users (target: 60% of invited pilot cohort)\n- Median time to first login after invite (under 48 hours)\n- Error rate on TMS API proxy (under 0.5% of requests)",
    "Out of scope":
      "- Booking new shipments in the portal\n- Carrier facing features\n- Offline mode or native mobile apps",
  },
  "internal-tech-spec": {
    Context:
      "Next.js app on Vercel. BFF routes proxy to Mercury TMS REST API. Auth via NextAuth with Entra ID and email provider. All tenant data scoped by companyId from TMS.",
    "Architecture overview":
      "- Browser to Next.js (RSC + API routes) to TMS API\n- Session store: encrypted JWT. No shipment data in cookies\n- Background jobs: none for phase 1 (sync on read with 60s cache)",
    "APIs and data":
      "- GET /api/shipments?companyId: paginated list, maps TMS /loads\n- GET /api/shipments/[id]: detail + timeline events\n- GET /api/invoices/[id]/pdf: streams PDF from TMS or S3 cache",
    Integrations:
      "- Mercury TMS REST (OAuth client credentials, read scope)\n- SendGrid for transactional email (invites, invoice ready)\n- Sentry for error tracking. Datadog RUM optional phase 2",
    "Non-functional requirements":
      "- All traffic TLS 1.2+. Secrets in Vercel env only\n- Rate limit TMS proxy 100 req/min per session\n- WCAG 2.1 AA for customer facing pages",
    "Test expectations":
      "- Contract tests against TMS sandbox for list/detail shapes\n- E2E: invite, login, view shipment, download invoice\n- Load test: 50 concurrent users on shipment list",
  },
  "internal-arc42": {
    "Introduction and goals":
      "Shipper portal for Acme Logistics. Self serve shipment status and invoice download via TMS integration.",
    "Quality goals":
      "1. Security: strict multi tenant isolation, no cross company data leaks\n2. Performance: p95 list view under 2s for 500 rows\n3. Operability: serverless hosting, minimal on call toil",
    Constraints:
      "- Must use existing TMS APIs only (no direct DB access)\n- US only data processing\n- Team of 2 engineers + 1 designer for 13 week timeline",
    "Context and scope":
      "- External: shippers (browser), Mercury TMS, Entra ID, SendGrid\n- Internal: Acme support staff via admin UI\n- Boundary: portal does not write back to TMS in phase 1",
    "Building blocks":
      "- Web UI (Next.js App Router)\n- Auth module (NextAuth + Entra)\n- TMS gateway (API routes, caching, error mapping)\n- Admin module (invites, audit log)",
    "Cross-cutting concepts":
      "- AuthZ: companyId on every TMS call from session\n- Logging: structured JSON, requestId, no PII in logs\n- Errors: user safe messages. TMS failures mapped to retryable vs fatal",
    "Runtime view":
      "User opens /shipments. Session validated. BFF calls TMS with company scope. JSON mapped to UI models and rendered. Invoice download: BFF fetches PDF stream, sets Content-Disposition.",
    "Deployment view":
      "Vercel production + preview environments\nSecrets per environment in Vercel. TMS sandbox for preview\nDNS: portal.acme-logistics.com CNAME to Vercel",
  },
  "internal-change-request": {
    "Requested change":
      "Add bulk CSV export of shipment history (up to 12 months) for shipper admin users, originally out of scope for phase 1.",
    Rationale:
      "Enterprise pilot (Northwind Freight) requires monthly reconciliation export for ERP import. Deal at risk without it.",
    "Impact on scope":
      "- Adds export job + email delivery when file ready\n- Extends TMS gateway with export endpoint and async polling\n- UAT extended by one week. Invoice phase 2 start shifts accordingly",
    "Timeline impact":
      "Original phase 1 end: Feb 14, revised: Feb 21\nPhase 2 kickoff moves from Feb 17 to Feb 24",
    "Cost impact":
      "Additional 24 engineering hours (~$4,800 at agreed rate)\nAssumes TMS supports export or paginated bulk read without new vendor fee",
    Approval:
      "Acme VP Operations (Jamie Chen). Sign off requested by Jan 10\nUpon approval, update statement of work appendix A and re baseline milestone dates",
  },
  "ops-runbook": {
    "Service overview":
      "Acme shipper portal (portal.acme-logistics.com). Next.js on Vercel, proxies read only TMS data. Tier: business critical during business hours. Owner: platform team.",
    "On-call and escalation":
      "Primary: PagerDuty rotation (platform-oncall)\nSEV1: page immediately + #incidents Slack\nSEV2: business hours response within 30 min\nEscalate to Acme IT for Entra/TMS vendor issues",
    "Health checks":
      "- GET /api/health returns 200\n- Synthetic login + shipment list every 5 min (Datadog)\n- TMS token expiry alert 7 days before rotation",
    "Common procedures":
      "1. Rotate TMS OAuth token (vault to Vercel env to redeploy)\n2. Invalidate session for compromised user (admin UI, deactivate)\n3. Purge CDN cache after static asset deploy",
    "Known failure modes":
      "- TMS 429 rate limit: enable backoff, notify Acme vendor\n- Entra misconfiguration: check redirect URIs and cert expiry\n- PDF timeout: check TMS latency, increase BFF timeout temporarily",
    Dependencies:
      "- Mercury TMS REST API\n- Microsoft Entra ID\n- Vercel hosting\n- SendGrid transactional email",
  },
  "ops-incident-postmortem": {
    "Incident summary":
      "On Feb 8, shipment list returned 503 errors for ~42 minutes during peak morning traffic due to expired TMS OAuth token in production.",
    Impact:
      "SEV2. ~380 users unable to load shipments. No data loss. Support received 23 tickets. Resolved before invoice peak window",
    Timeline:
      "- 08:12: Datadog alert, TMS proxy 5xx spike\n- 08:18: On call acknowledges, checks Vercel logs\n- 08:25: Root cause identified, expired client secret\n- 08:40: New token deployed, error rate normalizes\n- 08:54: All clear posted to #incidents",
    "Root cause":
      "TMS OAuth client secret rotated by vendor on Feb 7. Calendar reminder missed. Production env still held expired credential.",
    "Contributing factors":
      "- No automated expiry check on token (only manual calendar)\n- Staging used separate token. Issue not caught in preview deploy",
    "Action items":
      "- Add token expiry metric + 14 day alert (owner: eng, due Feb 15)\n- Document rotation in runbook (owner: ops, due Feb 12)\n- Quarterly drill: simulate TMS auth failure (owner: platform, due Mar 1)",
  },
}

export function getSectionExample(templateId: string, heading: string) {
  return TEMPLATE_SECTION_EXAMPLES[templateId]?.[heading]
}
