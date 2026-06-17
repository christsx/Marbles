"use client"

import { GitBranchIcon, XIcon } from "lucide-react"

import type { BlueprintProjectContext } from "@/lib/blueprints/project-context.types"
import { cn } from "@/lib/utils"

type BlueprintContextChipsProps = {
  context: BlueprintProjectContext
  disabled?: boolean
  onRemoveRepo: () => void
  onRemoveAttachment: (id: string) => void
  className?: string
}

export function BlueprintContextChips({
  context,
  disabled = false,
  onRemoveRepo,
  onRemoveAttachment,
  className,
}: BlueprintContextChipsProps) {
  const hasItems = context.repoEnabled || context.attachments.length > 0

  if (!hasItems) {
    return null
  }

  return (
    <div className={cn("blueprint-context-chips flex flex-wrap gap-2", className)}>
      {context.repoEnabled ? (
        <ContextChip
          label={context.activeRepo ?? "GitHub repo"}
          icon={<GitBranchIcon className="size-3.5" />}
          disabled={disabled}
          onRemove={onRemoveRepo}
        />
      ) : null}
      {context.attachments.map((attachment) => (
        <ContextChip
          key={attachment.id}
          label={attachment.label}
          disabled={disabled}
          onRemove={() => onRemoveAttachment(attachment.id)}
        />
      ))}
    </div>
  )
}

function ContextChip({
  label,
  icon,
  disabled,
  onRemove,
}: {
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  onRemove: () => void
}) {
  return (
    <span className="blueprint-context-chip inline-flex max-w-full items-center gap-1.5">
      {icon}
      <span className="truncate">{label}</span>
      <button
        type="button"
        disabled={disabled}
        aria-label={`Remove ${label}`}
        onClick={onRemove}
        className="blueprint-context-chip-remove"
      >
        <XIcon className="size-3.5" />
      </button>
    </span>
  )
}
