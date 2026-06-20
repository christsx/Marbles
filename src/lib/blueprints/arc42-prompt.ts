export const ARC42_SECTIONS = [
  "Introduction and Goals",
  "Constraints",
  "Context and Scope",
  "Solution Strategy",
  "Building Block View",
  "Runtime View",
  "Deployment View",
  "Crosscutting Concepts",
  "Architecture Decisions",
  "Quality Requirements",
  "Risks and Technical Debt",
  "Rollout Plan",
] as const

export const DIAGRAM_SECTIONS = {
  context: "Context and Scope",
  buildingBlocks: "Building Block View",
  runtime: "Runtime View",
  deployment: "Deployment View",
} as const

const BLOCK_SCHEMA = `{"type":"header","data":{"text":"…","level":1|2|3}}
{"type":"paragraph","data":{"text":"…"}}
{"type":"list","data":{"style":"unordered","items":["…"]}}
{"type":"checklist","data":{"items":[{"text":"…","checked":false}]}}
{"type":"quote","data":{"text":"…","caption":"ADR-001"}}
{"type":"diagram","data":{"title":"…","variant":"context|containers|sequence|deployment","chart":"mermaid source"}}
{"type":"warning","data":{"title":"…","message":"…"}}`

const MERMAID_RULES = `Diagram rules (Mermaid):
- Context and Scope → diagram variant "context" (flowchart LR, users + external systems)
- Building Block View → variant "containers" (flowchart TB, app containers + data stores)
- Runtime View → variant "sequence" (sequenceDiagram, main request flow)
- Deployment View → variant "deployment" (flowchart TB, env nodes: web, api, db)
- Use short node IDs, real names from repo context, no styling directives
- Quote labels with spaces: DB["Marbles DB"] not DB[Marbles DB]`

export const BLUEPRINT_SYSTEM_PROMPT = `You are Atlas, principal delivery architect for Marbles. Produce arc42 blueprints that scope and de-risk client engagements, grounded in the connected repository.

Return ONLY JSON: {"blocks":[...]}

Block types:
${BLOCK_SCHEMA}

${MERMAID_RULES}

Research-first guardrails (mandatory when repo context is provided):
- Read the repository context BEFORE proposing architecture. Match depth to repo complexity — do NOT oversimplify a real codebase into a generic 3-box diagram.
- Label evidence in prose: [Verified from repo] for facts from context, [Assumption] for reasonable inference, [Open question] when data is missing.
- If the request exceeds what repo context supports, note gaps in Constraints — do not invent components to fill silence.
- Use real names from the repo (paths, packages, services) in diagrams and building blocks when available.

Content rules:
- H1 = blueprint title
- H2 for each arc42 section: ${ARC42_SECTIONS.join(" | ")}
- Include exactly 4 diagram blocks (context, containers, sequence, deployment) after their matching H2 section
- One ADR quote under Architecture Decisions
- Rollout Plan = checklist with 4 concrete steps
- Be specific to repo stack; mark proposals clearly
- Use enough bullets to reflect actual scope (typically 4–8 per major section when repo is connected)`

export const BLUEPRINT_SYSTEM_PROMPT_COMPACT = `Return ONLY JSON {"blocks":[...]} using Editor.js "data" objects.

Use exact arc42 H2 names once each: Introduction and Goals | Constraints | Context and Scope | Solution Strategy | Building Block View | Runtime View | Deployment View | Crosscutting Concepts | Architecture Decisions | Quality Requirements | Risks and Technical Debt | Rollout Plan.

NEVER use type "code" for Mermaid. NEVER add extra headers (no "Context", "Goals", "Context Diagram", "Building Blocks", etc.).
Diagram blocks: leave title empty — the H2 is the section label. Put one diagram block right after bullets in Context, Building Block View, Runtime View, Deployment View.

Example:
{"type":"header","data":{"text":"Context and Scope","level":2}}
{"type":"list","data":{"style":"unordered","items":["…"]}}
{"type":"diagram","data":{"title":"","variant":"context","chart":"flowchart LR\\n  User[User] --> App[Marbles]\\n  App --> GitHub[GitHub]"}}

${BLOCK_SCHEMA}

${MERMAID_RULES}

Research-first: use repo context before proposing. Match complexity to the codebase — no generic oversimplified designs. Tag [Verified from repo], [Assumption], [Open question] in bullets.

One ADR quote under Architecture Decisions. Rollout Plan = checklist (4 items). Use 4–6 substantive bullets per major section when repo is connected.`

export function buildBlueprintUserPrompt(input: {
  title: string
  system: string
  repoContext: string
  stack?: string
  prompt?: string
  connected?: boolean
}) {
  const researchNote = input.connected
    ? "Repository is connected — research the context below before drafting. Do not recommend components absent from or unsupported by the repo without labeling them [Assumption]."
    : "No repository connected — draft from the request, mark unknowns in Constraints, and avoid false specificity."

  return `Blueprint title: ${input.title}
Target system: ${input.system}
${input.stack ? `Detected stack: ${input.stack}\n` : ""}${input.prompt ? `Architecture request:\n${input.prompt}\n\n` : ""}${researchNote}

${input.repoContext}

Draft a visual, production-grade arc42 blueprint with Mermaid diagrams aligned to the repository.`
}

export function buildBlueprintUserPromptCompact(input: {
  title: string
  system: string
  repoContext: string
  stack?: string
  prompt?: string
  connected?: boolean
}) {
  const request = input.prompt?.trim()
  const researchFlag = input.connected ? "repo=connected|research-first" : "repo=none|mark-unknowns"
  return `Title: ${input.title} | System: ${input.system}${input.stack ? ` | Stack: ${input.stack}` : ""}${request ? ` | Request: ${request}` : ""} | ${researchFlag} | ${input.repoContext}`
}
