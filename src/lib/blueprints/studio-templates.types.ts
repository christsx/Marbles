import type { BlueprintDeliverableKind } from "@/lib/blueprints/intent"

export type StudioTemplateCategory = "client" | "internal"

export type StudioTemplateSection = {
  heading: string
  body: string
  placeholder: string
}

export type StudioTemplate = {
  id: string
  title: string
  documentTitle: string
  documentIntro: string
  description: string
  category: StudioTemplateCategory
  deliverable: BlueprintDeliverableKind
  allowRepo: boolean
  starterPrompt: string
  attachmentPrompt: string
  sections: StudioTemplateSection[]
}
