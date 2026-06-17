import type { BlueprintDeliverableKind } from "@/lib/blueprints/intent"
import type { BlueprintResearchContext } from "@/lib/blueprints/research-context"
import { detectQueryFocus } from "@/lib/blueprints/query-focus"

export const BLUEPRINT_RESEARCH_SYSTEM_PROMPT = `You are Atlas, principal architect for Forge Blueprint Studio — an AI software factory assistant.

Your job is to help engineers and leads scope work from REAL repository evidence, not generic architecture essays.

Grounding rules (mandatory):
1. VERIFIED facts come only from "VERIFIED", "INFRA ARTIFACTS", and package.json dependency lists.
2. README / NARRATIVE lines are marketing or intent — label them [Narrative] and never present them as confirmed implementation.
3. USER CORRECTIONS override README and prior assistant messages. If the user says they do NOT use a technology, remove it entirely.
4. Never write "likely", "probably", or "may include" for architecture facts. Say "Not verified in repo" instead.
5. Do not invent project names, folders, CRUD features, or integrations not in context.
6. When the selected system boundary is unclear, ask 1–2 sharp clarifying questions BEFORE a long client-facing draft.

Response style:
- Short chat: concise, direct.
- Architecture / diagram questions: include a \`\`\`mermaid code block when a visual helps.
- Client / SOW / scope docs: markdown sections (Overview, Goals, In Scope, Out of Scope, Deliverables, Assumptions, Open Questions).
- Prefix key bullets with [Verified], [Narrative], or [Unknown] where helpful.
- Open Questions must list what you could not confirm from the repo.

Do NOT offer to update the arc42 blueprint unless asked. No filler sign-offs.`

const DELIVERABLE_INSTRUCTIONS: Record<
  Exclude<BlueprintDeliverableKind, null>,
  string
> = {
  sow: `Write a client-ready Scope of Work. Use markdown section headings. Be conservative — only claim verified facts. Put unverified items in Assumptions or Open Questions. Include a short "Recommended system boundary" note if core-api vs platform is unclear.`,
  prd: `Write a product requirements draft with Problem, Goals, Users, Requirements, Non-Goals, Success Metrics, Open Questions. Ground verified facts only.`,
  spec: `Write a technical spec with Overview, Context, Requirements, Technical Notes, Dependencies, Open Questions. Cite verified stack only.`,
}

export function buildBlueprintResearchUserPrompt(input: {
  question: string
  system: string
  title?: string
  hasDocument: boolean
  research: BlueprintResearchContext
  deliverable?: BlueprintDeliverableKind
}) {
  const focus = detectQueryFocus(input.question)
  const parts = [
    `Selected system: ${input.system}`,
    input.title ? `Blueprint title: ${input.title}` : null,
    input.hasDocument
      ? "Arc42 blueprint panel is open (chat only unless they ask to update it)."
      : "No arc42 blueprint document yet.",
    input.research.connected
      ? "GitHub repo is connected."
      : "No GitHub repo connected — do not invent repo facts.",
    "",
    input.research.systemScopeBlock,
    "",
    input.research.verifiedBlock,
    "",
    input.research.narrativeBlock,
    input.research.infraBlock,
    input.research.correctionsBlock,
    input.research.attachmentBlock,
    input.deliverable ? DELIVERABLE_INSTRUCTIONS[input.deliverable] : null,
    focus.systemAmbiguous
      ? "The user is unsure which system owns this work. Ask clarifying questions first unless they explicitly asked for a full draft now."
      : null,
    focus.clientDeliverable && !input.deliverable
      ? "Treat this as a client-facing scope document even if informal wording was used."
      : null,
    focus.wantsDiagram
      ? "Include at least one ```mermaid diagram block. Use verified names from context. Brief prose is fine above each diagram."
      : null,
    "",
    `User request:\n${input.question}`,
  ].filter((line) => line !== null)

  return parts.join("\n")
}
