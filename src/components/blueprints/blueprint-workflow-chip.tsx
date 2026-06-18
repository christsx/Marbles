"use client"

import { LibraryIcon, XIcon } from "lucide-react"

import type { Workflow } from "@/lib/assistant/types"
import { cn } from "@/lib/utils"

type BlueprintWorkflowChipProps = {
  workflow: Workflow
  disabled?: boolean
  onRemove: () => void
  className?: string
}

export function BlueprintWorkflowChip({
  workflow,
  disabled = false,
  onRemove,
  className,
}: BlueprintWorkflowChipProps) {
  return (
    <span className={cn("blueprint-context-chip inline-flex max-w-full items-center gap-1.5", className)}>
      <LibraryIcon className="size-3.5 shrink-0" />
      <span className="truncate">{workflow.title}</span>
      <button
        type="button"
        disabled={disabled}
        aria-label={`Remove ${workflow.title}`}
        onClick={onRemove}
        className="blueprint-context-chip-remove"
      >
        <XIcon className="size-3.5" />
      </button>
    </span>
  )
}
