"use client"

import { CheckIcon } from "lucide-react"

import type { Workflow } from "@/lib/assistant/types"
import { cn } from "@/lib/utils"

type TemplatePickerGroupProps = {
  label: string
  workflows: Workflow[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function TemplatePickerGroup({
  label,
  workflows,
  selectedId,
  onSelect,
}: TemplatePickerGroupProps) {
  if (!workflows.length) {
    return null
  }

  return (
    <div className="space-y-2">
      <p className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      {workflows.map((workflow) => {
        const selected = workflow.id === selectedId
        return (
          <button
            key={workflow.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(workflow.id)}
            className={cn(
              "template-picker-option",
              selected && "template-picker-option-selected"
            )}
          >
            <span className="template-picker-option-inner">
              <span className="min-w-0">
                <p className="text-sm font-medium">{workflow.title}</p>
                {workflow.description ? (
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {workflow.description}
                  </p>
                ) : null}
              </span>
              {selected ? (
                <CheckIcon
                  className="template-picker-option-check size-4 shrink-0"
                  aria-hidden
                />
              ) : null}
            </span>
          </button>
        )
      })}
    </div>
  )
}
