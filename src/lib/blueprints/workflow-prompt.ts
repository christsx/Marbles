import type { BlueprintDeliverableKind } from "@/lib/blueprints/intent"
import {
  getStudioTemplate,
  type StudioTemplate,
} from "@/lib/blueprints/studio-templates"

export const ATTACHMENT_SCOPING_PROMPT = `Analyze the attached document(s). Include:
1. Summary of the current vs desired workflow
2. Client-facing scope of work with phases, deliverables, assumptions, and open questions
3. Numbered implementation tasks with dependencies and definition of done
Ground everything in the document. Flag gaps that need client decisions.`

function formatTemplateBlock(template: StudioTemplate) {
  const outline = template.sections
    .map((section) => `- ${section.heading}: ${section.body}`)
    .join("\n")

  const repoRule = template.allowRepo
    ? "Repo context may inform the answer when attached."
    : "Do not reference GitHub or codebase context. Ground the answer in the user message and attachments only."

  return `ACTIVE TEMPLATE (${template.title}):
${template.description}

Audience: ${template.category === "client" ? "Client-facing. Plain language, no internal jargon." : "Internal delivery team. Precise and buildable."}

${repoRule}

Required sections:
${outline}`
}

export function resolveAttachmentOnlyPrompt(templateId?: string | null) {
  const template = getStudioTemplate(templateId)
  return template?.attachmentPrompt ?? ATTACHMENT_SCOPING_PROMPT
}

export function buildWorkflowPromptBlock(templateId?: string | null) {
  const template = getStudioTemplate(templateId)
  return template ? formatTemplateBlock(template) : null
}

export function resolveStudioDeliverable(input: {
  prompt: string
  workflowId?: string | null
  hasAttachments: boolean
  detected?: BlueprintDeliverableKind
  clientDeliverable?: boolean
}): BlueprintDeliverableKind {
  const template = getStudioTemplate(input.workflowId)

  if (input.detected) {
    return input.detected
  }

  if (template?.deliverable) {
    return template.deliverable
  }

  if (input.clientDeliverable) {
    return "sow"
  }

  if (input.hasAttachments && !template) {
    return "sow"
  }

  return null
}

export function shouldOpenDeliverablePanel(
  deliverable: BlueprintDeliverableKind
) {
  return deliverable === "sow" || deliverable === "prd" || deliverable === "spec"
}
