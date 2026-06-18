import type { StudioTemplate } from "@/lib/blueprints/studio-templates"

export function normalizeSectionHeading(text: string) {
  return text.trim().toLowerCase().replace(/\s+/g, " ")
}

export function slugifySectionHeading(heading: string) {
  return normalizeSectionHeading(heading).replace(/[^a-z0-9]+/g, "-")
}

const SECTION_HEADING_ALIASES: Record<string, string[]> = {
  overview: ["overview", "scope of work", "statement of work", "executive summary", "summary"],
  "in-scope": ["in scope", "scope", "included scope", "what is included"],
  "out-of-scope": ["out of scope", "exclusions", "not included", "out-of-scope"],
  deliverables: ["deliverables", "outputs", "milestones", "phases"],
  assumptions: ["assumptions", "dependencies"],
  "open-questions": ["open questions", "questions", "decisions needed"],
  "implementation-tasks": ["implementation tasks", "tasks", "work breakdown", "work plan"],
  "gaps-to-resolve": ["gaps to resolve", "gaps", "missing information"],
  problem: ["problem", "pain", "challenge"],
  goals: ["goals", "objectives"],
  users: ["users", "personas", "audience"],
  requirements: ["requirements", "functional requirements"],
  "success-metrics": ["success metrics", "metrics", "kpis"],
  "out-of-scope-internal": ["out of scope"],
  context: ["context", "background"],
  "architecture-overview": ["architecture overview", "architecture", "system overview"],
  "apis-and-data": ["apis and data", "apis", "data model"],
  integrations: ["integrations", "third party"],
  "non-functional-requirements": ["non-functional requirements", "nfr", "non functional requirements"],
  "test-expectations": ["test expectations", "testing", "qa"],
  "executive-summary": ["executive summary", "summary"],
  "recommended-approach": ["recommended approach", "approach", "solution"],
  "phased-outline": ["phased outline", "phases", "timeline"],
  "client-context": ["client context", "client background"],
  "stakeholder-context": ["stakeholder context", "client context", "client background"],
  "current-state": ["current state", "as-is", "today"],
  "pain-points": ["pain points", "pain", "problems"],
  "systems-and-data": ["systems and data", "systems", "stack"],
  "success-criteria": ["success criteria", "success"],
  "risks-and-constraints": ["risks and constraints", "risks", "constraints"],
  "deliverables-summary": ["deliverables summary", "deliverables"],
  "how-to-use-it": ["how to use it", "how to use", "usage"],
  "access-and-credentials": ["access and credentials", "access"],
  "support-window": ["support window", "support", "hypercare"],
  "open-items": ["open items", "follow ups", "follow-ups"],
  "requested-change": ["requested change", "change"],
  rationale: ["rationale", "reason"],
  "impact-on-scope": ["impact on scope", "scope impact"],
  "timeline-impact": ["timeline impact", "schedule impact"],
  "cost-impact": ["cost impact", "budget impact"],
  approval: ["approval", "sign off", "sign-off"],
  "introduction-and-goals": ["introduction and goals", "introduction", "goals"],
  constraints: ["constraints", "limitations"],
  "context-and-scope": ["context and scope"],
  "building-blocks": ["building blocks", "components"],
  "runtime-view": ["runtime view", "runtime", "data flow"],
  "deployment-view": ["deployment view", "deployment", "hosting"],
  "timeline-and-investment": ["timeline and investment", "timeline", "investment", "pricing", "budget"],
  "quality-goals": ["quality goals", "quality", "nfr priorities"],
  "cross-cutting-concepts": ["cross-cutting concepts", "cross cutting", "shared patterns"],
  "campaign-objective": ["campaign objective", "objective", "goal"],
  "target-audience": ["target audience", "audience", "personas"],
  "core-message": ["core message", "message", "messaging"],
  "channels-and-tactics": ["channels and tactics", "channels", "tactics"],
  "assets-and-deliverables": ["assets and deliverables", "assets", "creative"],
  timeline: ["timeline", "schedule", "dates"],
  "budget-and-resources": ["budget and resources", "budget", "resources"],
  "launch-overview": ["launch overview", "overview"],
  "launch-goals": ["launch goals", "goals"],
  "rollout-phases": ["rollout phases", "phases", "rollout"],
  "channel-checklist": ["channel checklist", "checklist", "channels"],
  "owners-and-raci": ["owners and raci", "owners", "raci"],
  "dependencies-and-risks": ["dependencies and risks", "dependencies", "risks"],
  "comms-and-enablement": ["comms and enablement", "comms", "enablement"],
  "campaign-summary": ["campaign summary", "summary"],
  "what-we-executed": ["what we executed", "executed", "what ran"],
  "results-vs-goals": ["results vs goals", "results", "performance"],
  "what-worked": ["what worked", "wins"],
  "what-did-not-work": ["what did not work", "what didn't work", "misses"],
  recommendations: ["recommendations", "next steps"],
  "service-overview": ["service overview", "overview"],
  "on-call-and-escalation": ["on-call and escalation", "on-call", "escalation"],
  "health-checks": ["health checks", "monitoring"],
  "common-procedures": ["common procedures", "procedures", "runbook"],
  "known-failure-modes": ["known failure modes", "failure modes", "incidents"],
  dependencies: ["dependencies", "upstream", "downstream"],
  "incident-summary": ["incident summary", "summary"],
  impact: ["impact", "severity"],
  "root-cause": ["root cause", "cause"],
  "contributing-factors": ["contributing factors", "contributors"],
  "action-items": ["action items", "follow-ups", "follow ups"],
}

export function resolveTemplateSectionId(
  heading: string,
  template: StudioTemplate
): string | null {
  const normalized = normalizeSectionHeading(heading)

  for (const section of template.sections) {
    if (normalizeSectionHeading(section.heading) === normalized) {
      return slugifySectionHeading(section.heading)
    }
  }

  for (const section of template.sections) {
    const sectionId = slugifySectionHeading(section.heading)
    const aliases = [
      normalizeSectionHeading(section.heading),
      ...(SECTION_HEADING_ALIASES[sectionId] ?? []),
    ]

    if (aliases.some((alias) => normalized === alias || normalized.includes(alias))) {
      return sectionId
    }
  }

  return null
}

export function buildTemplateSectionHeadingGuide(template: StudioTemplate) {
  return template.sections.map((section) => `## ${section.heading}`).join("\n")
}
