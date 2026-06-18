import type { StudioTemplate } from "@/lib/blueprints/studio-templates.types"

function s(
  heading: string,
  body: string,
  placeholder: string
): StudioTemplate["sections"][number] {
  return { heading, body, placeholder }
}

export const STUDIO_TEMPLATE_CATALOG: StudioTemplate[] = [
  {
    id: "client-discovery",
    title: "Discovery Brief",
    documentTitle: "Discovery Brief",
    documentIntro: "Capture what you learned before scoping. Replace the example via chat.",
    description:
      "Use when: discovery is done and you need current state, pain, and success criteria before you scope the build.",
    category: "client",
    deliverable: "sow",
    allowRepo: false,
    starterPrompt: "Fill the discovery brief from our notes or attached call summary.",
    attachmentPrompt:
      "From the attached notes, fill the discovery brief with stakeholder context, current state, pain points, systems, success criteria, and risks.",
    sections: [
      s("Stakeholder context", "Who they are and what triggered this build.", "Company, team, and why now."),
      s("Current state", "How they work today.", "Describe the existing process or system."),
      s("Pain points", "What is broken, slow, or risky.", "• \n• \n• "),
      s("Systems and data", "Tools, integrations, and data sources involved.", "• \n• "),
      s("Success criteria", "How they will judge success.", "• \n• "),
      s("Risks and constraints", "Budget, timeline, compliance, or org constraints.", "• \n• "),
    ],
  },
  {
    id: "client-proposal",
    title: "Proposal",
    documentTitle: "Proposal",
    documentIntro: "Pre-contract proposal. Replace the example via chat or an attached brief.",
    description:
      "Use when: a customer or portfolio company wants your approach and phases before a formal statement of work.",
    category: "client",
    deliverable: "sow",
    allowRepo: false,
    starterPrompt: "Fill in the proposal sections from the attached material.",
    attachmentPrompt:
      "From the attached material, fill the proposal with executive summary, problem, approach, phased outline, timeline and investment, assumptions, and open questions.",
    sections: [
      s("Executive summary", "One short paragraph on the opportunity.", "Summarize the opportunity in 2 to 3 sentences."),
      s("Problem", "What is broken or missing today.", "What pain or gap are they facing?"),
      s("Recommended approach", "How you would solve it and why.", "Describe the recommended solution and why it fits."),
      s("Phased outline", "High level phases without task level detail yet.", "• Phase 1: \n• Phase 2: \n• Phase 3: "),
      s("Timeline and investment", "Duration per phase and budget or effort range.", "Phase dates, total timeline, and investment range."),
      s("Assumptions", "Dependencies on their inputs or systems.", "• \n• "),
      s("Open questions", "What to confirm before a formal statement of work.", "• \n• "),
    ],
  },
  {
    id: "client-sow",
    title: "Statement of Work",
    documentTitle: "Statement of Work",
    documentIntro: "Contract scope document. Replace the example via chat or an attached brief.",
    description:
      "Use when: you are moving to contract and need phased scope, deliverables, tasks, and sign off.",
    category: "client",
    deliverable: "sow",
    allowRepo: false,
    starterPrompt: "Fill in the open statement of work sections from the attached brief.",
    attachmentPrompt:
      "Analyze the attached brief and fill the statement of work with overview, scope, deliverables, assumptions, open questions, numbered implementation tasks, and gaps.",
    sections: [
      s("Overview", "Summarize the goal and current vs desired state.", "Describe the project goal and what changes for them."),
      s("In scope", "Concrete deliverables included in the engagement.", "• \n• \n• "),
      s("Out of scope", "Explicit exclusions to prevent scope creep.", "• \n• "),
      s("Deliverables", "Named outputs per phase with acceptance hints.", "• Phase 1: \n• Phase 2: "),
      s("Assumptions", "What must be true for the plan to hold.", "• \n• "),
      s("Open questions", "Decisions they must make before build.", "• \n• "),
      s("Implementation tasks", "Numbered tasks with dependency and definition of done.", "1. \n2. \n3. "),
      s("Gaps to resolve", "Missing info from the source material.", "• \n• "),
    ],
  },
  {
    id: "client-handoff",
    title: "Delivery Handoff",
    documentTitle: "Delivery Handoff",
    documentIntro: "Handoff pack when the build moves to the customer or their ops team.",
    description:
      "Use when: delivery is complete and the receiving team needs run instructions, access pointers, and open items.",
    category: "client",
    deliverable: null,
    allowRepo: false,
    starterPrompt: "Fill the handoff document for this delivery.",
    attachmentPrompt:
      "From the attached delivery notes, fill the handoff with deliverables, how to use it, access references (no secrets), support window, and open items.",
    sections: [
      s("Deliverables summary", "What was delivered.", "• \n• "),
      s("How to use it", "Steps to operate the solution.", "1. \n2. \n3. "),
      s("Access and credentials", "Where access is documented. Never paste secrets here.", "Vault location, owners, and how to request access."),
      s("Support window", "Hypercare period and escalation path.", "Support dates, contacts, and SLAs."),
      s("Open items", "Known gaps or follow up work.", "• \n• "),
    ],
  },
  {
    id: "marketing-campaign-brief",
    title: "Campaign Brief",
    documentTitle: "Campaign Brief",
    documentIntro: "Plan a launch or campaign before creative and channel work starts.",
    description:
      "Use when: you are kicking off a product launch, GTM push, or demand campaign and need aligned goals and channels.",
    category: "marketing",
    deliverable: null,
    allowRepo: false,
    starterPrompt: "Fill the campaign brief from the attached notes or strategy doc.",
    attachmentPrompt:
      "From the attached material, fill the campaign brief with objective, audience, messaging, channels, assets, timeline, budget, success metrics, and open questions.",
    sections: [
      s("Campaign objective", "One clear outcome this campaign must drive.", "Primary goal and how it ties to business results."),
      s("Target audience", "Who you are reaching and what they care about.", "Segments, personas, and key pain points."),
      s("Core message", "The single idea every asset should reinforce.", "Headline theme and proof points."),
      s("Channels and tactics", "Where and how the campaign runs.", "• \n• \n• "),
      s("Assets and deliverables", "Creative, copy, and landing pages needed.", "• \n• "),
      s("Timeline", "Key dates from kickoff through retro.", "• \n• "),
      s("Budget and resources", "Spend, headcount, and vendor needs.", "Budget range and owners."),
      s("Success metrics", "How you measure performance.", "• \n• "),
      s("Open questions", "Decisions needed before launch.", "• \n• "),
    ],
  },
  {
    id: "marketing-launch-plan",
    title: "Launch Plan",
    documentTitle: "Launch Plan",
    documentIntro: "Coordinate a product, feature, or venture go live.",
    description:
      "Use when: a launch date is set and your factory team needs owners, dependencies, and a rollout checklist.",
    category: "marketing",
    deliverable: null,
    allowRepo: false,
    starterPrompt: "Fill the launch plan from our launch doc or meeting notes.",
    attachmentPrompt:
      "From the attached material, fill the launch plan with overview, audience, rollout phases, channel checklist, owners, dependencies, comms, and success metrics.",
    sections: [
      s("Launch overview", "What is launching, for whom, and why now.", "Product or campaign, target audience, and launch date."),
      s("Launch goals", "Measurable outcomes for launch week and 30 days.", "• \n• "),
      s("Rollout phases", "Pre launch, launch day, and post launch beats.", "• Pre launch: \n• Launch: \n• Post launch: "),
      s("Channel checklist", "Email, social, paid, PR, in product, events.", "• \n• \n• "),
      s("Owners and RACI", "Who owns each workstream.", "• \n• "),
      s("Dependencies and risks", "Blockers that could slip the date.", "• \n• "),
      s("Comms and enablement", "Internal and external messaging.", "Talking points, FAQ, enablement for sales or CS."),
      s("Success metrics", "KPIs to review in the launch retro.", "• \n• "),
    ],
  },
  {
    id: "marketing-campaign-recap",
    title: "Campaign Recap",
    documentTitle: "Campaign Recap",
    documentIntro: "Close the loop after a campaign or launch ends.",
    description:
      "Use when: a campaign finished and you need results, learnings, and recommendations for the next run.",
    category: "marketing",
    deliverable: null,
    allowRepo: false,
    starterPrompt: "Fill the campaign recap from analytics exports or attached report.",
    attachmentPrompt:
      "From the attached results, fill the recap with summary, what ran, results vs goals, top learnings, and recommendations.",
    sections: [
      s("Campaign summary", "What ran, when, and for whom.", "Objective, dates, and primary channels."),
      s("What we executed", "Assets and tactics that went live.", "• \n• "),
      s("Results vs goals", "Performance against target metrics.", "Metric, target, actual, and notes."),
      s("What worked", "Tactics and messages that over performed.", "• \n• "),
      s("What did not work", "Under performers and hypotheses why.", "• \n• "),
      s("Recommendations", "Changes for the next campaign or always on motion.", "• \n• "),
    ],
  },
  {
    id: "internal-prd",
    title: "PRD",
    documentTitle: "Product Requirements",
    documentIntro: "Internal requirements for your build team or agents.",
    description:
      "Use when: the factory team needs problem, users, requirements, and acceptance criteria before implementation.",
    category: "internal",
    deliverable: "prd",
    allowRepo: false,
    starterPrompt: "Fill the PRD sections from the attached requirements.",
    attachmentPrompt:
      "From the attached material, fill the PRD with problem, goals, users, requirements, success metrics, and out of scope.",
    sections: [
      s("Problem", "What user or business pain this solves.", "Describe the problem clearly."),
      s("Goals", "Measurable outcomes.", "• \n• "),
      s("Users", "Primary personas and jobs to be done.", "• \n• "),
      s("Requirements", "Functional requirements with acceptance criteria.", "• \n• \n• "),
      s("Success metrics", "How you know it worked.", "• \n• "),
      s("Out of scope", "Explicit non goals.", "• \n• "),
    ],
  },
  {
    id: "internal-tech-spec",
    title: "Technical Spec",
    documentTitle: "Technical Spec",
    documentIntro: "Buildable spec for engineering. Attach a repo from Projects when helpful.",
    description:
      "Use when: implementers need APIs, data model, integrations, and NFRs for a feature or system.",
    category: "internal",
    deliverable: "spec",
    allowRepo: true,
    starterPrompt: "Fill the technical spec from the attached requirements.",
    attachmentPrompt:
      "From the attached requirements, fill the spec with context, architecture overview, APIs, integrations, NFRs, and test expectations.",
    sections: [
      s("Context", "Background and constraints.", "Background, constraints, and dependencies."),
      s("Architecture overview", "Major components and responsibilities.", "• \n• "),
      s("APIs and data", "Interfaces, schemas, and ownership.", "• \n• "),
      s("Integrations", "External systems and failure handling.", "• \n• "),
      s("Non-functional requirements", "Performance, security, observability.", "• \n• "),
      s("Test expectations", "What must be verified before ship.", "• \n• "),
    ],
  },
  {
    id: "internal-arc42",
    title: "Architecture (arc42)",
    documentTitle: "Architecture Blueprint",
    documentIntro: "Structured architecture record. Attach a repo to ground chat in code.",
    description:
      "Use when: the team needs a durable architecture record with context, quality goals, blocks, runtime, and deployment.",
    category: "internal",
    deliverable: "spec",
    allowRepo: true,
    starterPrompt: "Fill the architecture sections. Attach a repo for codebase aware chat.",
    attachmentPrompt:
      "Using attached context, fill the architecture doc with introduction, quality goals, constraints, context, building blocks, cross cutting concepts, runtime, and deployment views.",
    sections: [
      s("Introduction and goals", "System purpose in one paragraph.", "Purpose and primary users."),
      s("Quality goals", "Top non functional priorities ranked.", "• \n• \n• "),
      s("Constraints", "Technical and organizational limits.", "• \n• "),
      s("Context and scope", "External systems and boundaries.", "• \n• "),
      s("Building blocks", "Main components and responsibilities.", "• \n• \n• "),
      s("Cross-cutting concepts", "Security, logging, errors, and shared patterns.", "• \n• "),
      s("Runtime view", "How requests and data flow.", "Describe key flows."),
      s("Deployment view", "Where it runs and how it is operated.", "Environments, hosting, and ops notes."),
    ],
  },
  {
    id: "internal-change-request",
    title: "Change Request",
    documentTitle: "Change Request",
    documentIntro: "Document scope change after the original statement of work.",
    description:
      "Use when: scope shifts mid build and you need impact, cost, and approval on record.",
    category: "internal",
    deliverable: "sow",
    allowRepo: false,
    starterPrompt: "Fill this change request from the stakeholder ask or meeting notes.",
    attachmentPrompt:
      "From the attached notes, fill the change request with requested change, rationale, scope impact, timeline, cost, and approval path.",
    sections: [
      s("Requested change", "What they want added or changed.", "Describe the change clearly."),
      s("Rationale", "Why they want it.", "Business reason or trigger."),
      s("Impact on scope", "What else moves or conflicts.", "• \n• "),
      s("Timeline impact", "How dates shift.", "Original vs revised dates."),
      s("Cost impact", "Additional effort or budget.", "Estimate and assumptions."),
      s("Approval", "Who signs off and by when.", "Approver, date, and next step."),
    ],
  },
  {
    id: "ops-runbook",
    title: "Runbook",
    documentTitle: "Runbook",
    documentIntro: "Production ops guide for on call and platform support.",
    description:
      "Use when: a system is live and your team needs procedures, escalation paths, and common fixes documented.",
    category: "ops",
    deliverable: null,
    allowRepo: true,
    starterPrompt: "Fill the runbook from our ops notes or attached system doc.",
    attachmentPrompt:
      "From the attached material, fill the runbook with service overview, on call, health checks, common procedures, escalation, and dependencies.",
    sections: [
      s("Service overview", "What this system does and who owns it.", "Purpose, owner, and criticality."),
      s("On-call and escalation", "Who to page and when.", "Rotation, severity levels, and escalation path."),
      s("Health checks", "How to verify the system is healthy.", "• \n• "),
      s("Common procedures", "Repeatable ops tasks with steps.", "1. \n2. \n3. "),
      s("Known failure modes", "Typical incidents and first responses.", "• \n• "),
      s("Dependencies", "Upstream and downstream systems.", "• \n• "),
    ],
  },
  {
    id: "ops-incident-postmortem",
    title: "Incident Postmortem",
    documentTitle: "Incident Postmortem",
    documentIntro: "Blameless record after a production incident.",
    description:
      "Use when: an incident is resolved and the team needs timeline, root cause, impact, and follow up actions.",
    category: "ops",
    deliverable: null,
    allowRepo: false,
    starterPrompt: "Fill the postmortem from incident notes or attached timeline.",
    attachmentPrompt:
      "From the attached incident notes, fill the postmortem with summary, impact, timeline, root cause, contributing factors, and action items.",
    sections: [
      s("Incident summary", "What happened in plain language.", "One paragraph overview."),
      s("Impact", "Users affected, duration, and severity.", "Scope, SEV level, and business impact."),
      s("Timeline", "Key events from detection to resolution.", "• \n• \n• "),
      s("Root cause", "Primary technical or process failure.", "What broke and why."),
      s("Contributing factors", "Conditions that made it worse or likely.", "• \n• "),
      s("Action items", "Follow ups with owners and dates.", "• \n• "),
    ],
  },
]
