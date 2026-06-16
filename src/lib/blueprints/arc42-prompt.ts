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
- Quote labels with spaces: DB["Forge DB"] not DB[Forge DB]`

export const BLUEPRINT_SYSTEM_PROMPT = `You are Atlas, principal architect for Forge. Produce arc42 blueprints grounded in the connected repository.

Return ONLY JSON: {"blocks":[...]}

Block types:
${BLOCK_SCHEMA}

${MERMAID_RULES}

Content rules:
- H1 = blueprint title
- H2 for each arc42 section: ${ARC42_SECTIONS.join(" | ")}
- Include exactly 4 diagram blocks (context, containers, sequence, deployment) after their matching H2 section
- One ADR quote under Architecture Decisions
- Rollout Plan = checklist with 4 concrete steps
- Be specific to repo stack; mark proposals clearly
- Keep prose tight`

export const BLUEPRINT_SYSTEM_PROMPT_COMPACT = `Return ONLY JSON {"blocks":[...]} using Editor.js "data" objects.

Use exact arc42 H2 names once each: Introduction and Goals | Constraints | Context and Scope | Solution Strategy | Building Block View | Runtime View | Deployment View | Crosscutting Concepts | Architecture Decisions | Quality Requirements | Risks and Technical Debt | Rollout Plan.

NEVER use type "code" for Mermaid. NEVER add extra headers (no "Context", "Goals", "Context Diagram", "Building Blocks", etc.).
Diagram blocks: leave title empty — the H2 is the section label. Put one diagram block right after bullets in Context, Building Block View, Runtime View, Deployment View.

Example:
{"type":"header","data":{"text":"Context and Scope","level":2}}
{"type":"list","data":{"style":"unordered","items":["…"]}}
{"type":"diagram","data":{"title":"","variant":"context","chart":"flowchart LR\\n  User[User] --> App[Forge]\\n  App --> GitHub[GitHub]"}}

${BLOCK_SCHEMA}

${MERMAID_RULES}

One ADR quote under Architecture Decisions. Rollout Plan = checklist (4 items). ≤3 bullets per section.`

export function buildBlueprintUserPrompt(input: {
  title: string
  system: string
  repoContext: string
  stack?: string
}) {
  return `Blueprint title: ${input.title}
Target system: ${input.system}
${input.stack ? `Detected stack: ${input.stack}\n` : ""}${input.repoContext}

Draft a visual, production-grade arc42 blueprint with Mermaid diagrams aligned to the repository.`
}

export function buildBlueprintUserPromptCompact(input: {
  title: string
  system: string
  repoContext: string
  stack?: string
}) {
  return `Title: ${input.title} | System: ${input.system}${input.stack ? ` | Stack: ${input.stack}` : ""} | ${input.repoContext}`
}
