import { STUDIO_TEMPLATE_CATALOG } from "@/lib/blueprints/studio-template-catalog"
import type {
  StudioTemplate,
  StudioTemplateCategory,
} from "@/lib/blueprints/studio-templates.types"

export type {
  StudioTemplate,
  StudioTemplateCategory,
  StudioTemplateSection,
} from "@/lib/blueprints/studio-templates.types"

export const STUDIO_TEMPLATES: StudioTemplate[] = STUDIO_TEMPLATE_CATALOG

export function getStudioTemplate(id?: string | null) {
  if (!id) {
    return undefined
  }

  return STUDIO_TEMPLATES.find((template) => template.id === id)
}

export function studioTemplatesByCategory(category: StudioTemplateCategory) {
  return STUDIO_TEMPLATES.filter((template) => template.category === category)
}

export function templateAllowsRepo(templateId?: string | null) {
  const template = getStudioTemplate(templateId)
  return template?.allowRepo ?? true
}

export function templateToWorkflow(template: StudioTemplate) {
  return {
    id: template.id,
    title: template.title,
    description: template.description,
  }
}

export function listStudioTemplateWorkflows() {
  return STUDIO_TEMPLATES.map(templateToWorkflow)
}
