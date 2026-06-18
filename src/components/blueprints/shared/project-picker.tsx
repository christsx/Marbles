"use client"

import type { AssistantProject } from "@/lib/assistant/types"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type ProjectPickerProps = {
  projects: AssistantProject[]
  loading?: boolean
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ProjectPicker({
  projects,
  loading = false,
  selectedId,
  onSelect,
}: ProjectPickerProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No blueprints yet. Create one from the studio first.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {projects.map((project) => {
        const selected = project.id === selectedId
        return (
          <button
            key={project.id}
            type="button"
            onClick={() => onSelect(project.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors",
              selected
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border hover:bg-muted/40"
            )}
          >
            <span className="truncate font-medium">{project.name}</span>
            {project.cmNumber ? (
              <span className="ml-3 shrink-0 text-xs text-muted-foreground">
                #{project.cmNumber}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
