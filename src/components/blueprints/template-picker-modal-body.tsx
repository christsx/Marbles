"use client"

import { TemplatePickerGroup } from "@/components/blueprints/template-picker-group"
import type { StudioTemplateCategory } from "@/lib/blueprints/studio-templates"
import {
  studioTemplatesByCategory,
  templateToWorkflow,
} from "@/lib/blueprints/studio-templates"

const PICKER_GROUPS: { label: string; category: StudioTemplateCategory }[] = [
  { label: "External", category: "client" },
  { label: "GTM", category: "marketing" },
  { label: "Build", category: "internal" },
  { label: "Ops", category: "ops" },
]

type TemplatePickerModalBodyProps = {
  selectedId: string | null
  onSelect: (id: string) => void
}

export function TemplatePickerModalBody({
  selectedId,
  onSelect,
}: TemplatePickerModalBodyProps) {
  return (
    <div className="space-y-5 pb-4">
      {PICKER_GROUPS.map(({ label, category }) => (
        <TemplatePickerGroup
          key={category}
          label={label}
          workflows={studioTemplatesByCategory(category).map(templateToWorkflow)}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
