import type { BlueprintDeliverableKind } from "@/lib/blueprints/intent"
import type { BlueprintResearchContext } from "@/lib/blueprints/research-context"
import { detectQueryFocus } from "@/lib/blueprints/query-focus"
import { buildWorkflowPromptBlock } from "@/lib/blueprints/workflow-prompt"
import { getStudioTemplate } from "./studio-templates"
import { buildTemplateSectionHeadingGuide } from "@/lib/blueprints/template-section-match"

const ATLAS_PERSONA = `You are Torse, a senior engineer who explains things clearly, like a helpful colleague, not a template or a slide deck.`

const VOICE = `Voice (always):
Write the way a smart human would in chat: natural, direct, warm when appropriate.
Use contractions. Match the user's length. If they send one word, reply in one short sentence.
Do not use em dashes or en dashes. Use commas and periods instead.
Do not open with Hi, Hey, or their name. Even if they greet first, never ask "what's on your mind" or invite them to chat.
Do not use [Verified], [Narrative], [Unknown], or similar tags. Say it in normal words ("in the repo…", "the README says…", "I can't tell from the code…").
Skip rigid section templates unless the user asked for a structured doc.
Use bullets or a diagram only when they actually help, not by default.
Do not end with "Let me know if…", "Suggested next steps", or a trailing question unless they asked what to do next.
If they say no / nah / not now without a real question, acknowledge once in a line and stop. Don't keep prompting them.
Off-topic or non-engineering requests: one neutral sentence that you focus on software/engineering, then stop. No lectures.`

const GENERAL_CHAT_RULES = `General chat (no repo attached):
Answer their question straight. Software, AI, system design, architecture: use real-world judgment.
Do not invent facts about their project. Do not push them to connect GitHub unless they asked about their own code or app.`

const REPO_GROUNDING_RULES = `Repo attached:
Ground answers in the context below. Facts from VERIFIED / package.json / infra files are solid; README is intent, not proof.
If something isn't in context, say you can't see it. Don't guess.
If they ask what the app is or how it works, explain from the repo. Don't bounce questions back to them.
A mermaid diagram is fine when a picture helps; keep labels to what you can justify from context.`

const SHARED_STYLE = `Do not offer to update the arc42 blueprint unless they ask.`

export function buildBlueprintSystemPrompt(research: BlueprintResearchContext) {
  if (research.connected) {
    return `${ATLAS_PERSONA}\n\n${VOICE}\n\n${REPO_GROUNDING_RULES}\n\n${SHARED_STYLE}`
  }

  return `${ATLAS_PERSONA}\n\n${VOICE}\n\n${GENERAL_CHAT_RULES}\n\n${SHARED_STYLE}`
}

/** @deprecated Use buildBlueprintSystemPrompt(research) */
export const BLUEPRINT_RESEARCH_SYSTEM_PROMPT = `${ATLAS_PERSONA}\n\n${VOICE}\n\n${REPO_GROUNDING_RULES}\n\n${SHARED_STYLE}`

const DELIVERABLE_INSTRUCTIONS: Record<
  Exclude<BlueprintDeliverableKind, null>,
  string
> = {
  sow: `They want a scope-of-work style answer. Format as markdown: put each section on its own line with ## (Overview, In scope, Out of scope, Deliverables, Assumptions, Open questions, Implementation tasks, Gaps to resolve). Use - bullets under list sections. Number implementation tasks as 1. 2. 3. with Dependency and Definition of done as indented bullets under each task. Keep prose human, not boilerplate. Synthesize and reorganize, do not mirror the attachment line for line.`,
  prd: `They want a PRD. Format as markdown with ## sections (Problem, Goals, Users, Requirements, Success metrics, Out of scope). Use - bullets under requirements with acceptance criteria. Client-safe language if this is client-facing.`,
  spec: `They want a technical spec. Format as markdown with ## sections (Context, Architecture overview, APIs and data, Integrations, Non-functional requirements, Test expectations). Cite verified stack only when repo is attached.`,
}

export function buildBlueprintResearchUserPrompt(input: {
  question: string
  system: string
  title?: string
  hasDocument: boolean
  research: BlueprintResearchContext
  deliverable?: BlueprintDeliverableKind
  userFirstName?: string
  isFirstTurn?: boolean
  workflowId?: string | null
}) {
  const focus = detectQueryFocus(input.question)
  const repoAttached = input.research.connected
  const template = getStudioTemplate(input.workflowId)
  const workflowBlock = buildWorkflowPromptBlock(input.workflowId)
  const trimmed = input.question.trim()
  const isMinimal =
    trimmed.length <= 12 ||
    /^(no|nope|nah|ok|okay|k|thanks|ty|cool|sure|yep|yeah|hi|hey|hello)\.?$/i.test(
      trimmed
    )

  const parts = [
    `Selected system: ${input.system}`,
    input.title ? `Blueprint title: ${input.title}` : null,
    input.hasDocument
      ? template
        ? "Template document is open on the right panel (chat fills sections there)."
        : "Arc42 blueprint panel is open (chat only unless they ask to update it)."
      : "No arc42 blueprint document yet.",
    repoAttached
      ? `GitHub repo attached: ${input.research.activeRepo ?? "yes"}.`
      : "No GitHub repo attached. General chat.",
    workflowBlock,
    template?.category === "client" || template?.category === "marketing"
      ? "External or GTM template active. Do not reference GitHub, codebase, or internal architecture unless the user explicitly asks. Ground the answer in attachments and the user message."
      : null,
    template && input.hasDocument && input.research.attachmentBlock
      ? `CRITICAL: A template document with example content is open on the right. The user attached source material. Replace the example sections with facts synthesized from the attachment. Reply with one brief sentence in chat, then a ## block for every template section you can fill. Use these exact headings:\n${buildTemplateSectionHeadingGuide(template)}\nFill all sections the attachment supports. Structured content must appear only under ## headings, not in the chat sentence.`
      : template && input.hasDocument
        ? "Template doc is open on the right. Reply with 1-2 short sentences in chat (acknowledge, ask what's missing), then ## Section blocks using exact template section titles for each section you can fill from the message or attachments. All structured content goes under ## headings only, not in the chat prose. Ignore any instruction to skip rigid section templates."
        : null,
    "",
    input.research.systemScopeBlock,
    "",
    input.research.verifiedBlock,
    "",
    input.research.narrativeBlock,
    input.research.infraBlock,
    input.research.correctionsBlock,
    input.research.attachmentBlock
      ? "The user attached file(s) below. Read them carefully and ground your answer in their contents. Do not paste the attachment back verbatim. Synthesize, reorganize, and add structure the source lacks. Reference the file name when citing specifics."
      : null,
    input.research.attachmentBlock,
    template && input.hasDocument ? null : input.deliverable ? DELIVERABLE_INSTRUCTIONS[input.deliverable] : null,
    isMinimal
      ? "Minimal message. Reply in one short sentence only. No greeting back, no follow-up question, no what's on your mind."
      : null,
    !repoAttached && focus.wantsCodebaseOverview
      ? `They seem to be asking about their own codebase but no repo is attached. Help where you can in general terms, and if useful mention they can attach a project from Projects (defaults to their workspace repo) for a walkthrough of their actual code. Don't pretend you read the repo.`
      : null,
    repoAttached && focus.systemAmbiguous
      ? "They're unsure which part of the system owns this. Ask one short clarifying question only if you truly need it before a long answer."
      : null,
    focus.clientDeliverable && !input.deliverable
      ? "Treat this as client-facing scope even if they wrote casually."
      : null,
    repoAttached && focus.wantsCodebaseOverview
      ? `Explain what this app is and how it's built, conversationally. Cover what it does, what's actually in the repo vs README hype, and how the pieces connect. Use a mermaid diagram only if it helps. Don't ask them to describe the app to you.`
      : null,
    repoAttached && focus.wantsDiagram
      ? "Include a mermaid diagram if it clarifies the answer. Use names from verified context only."
      : null,
    !repoAttached && focus.wantsExplicitDiagram
      ? "A mermaid diagram is fine if it helps. Use generic labels, not their repo."
      : null,
    "",
    `User request:\n${input.question}`,
  ].filter((line) => line !== null)

  return parts.join("\n")
}
