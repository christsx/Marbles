import { getStudioTemplate } from "@/lib/blueprints/studio-templates"
import { buildTemplateEditorDocument } from "@/lib/blueprints/template-to-editor-doc"

export function getStudioTemplateOpenState(templateId: string) {
  const template = getStudioTemplate(templateId)
  if (!template) {
    return null
  }

  return {
    template,
    title: template.documentTitle,
    content: buildTemplateEditorDocument(template),
    assistantHint: `${template.title} is open with example content. Describe the engagement or attach a brief and I will replace it with your details.`,
  }
}
