"use client"

import { PencilIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BlueprintDocToolbar({
  onSave,
  saving,
  saveDisabled,
  editing,
  onToggleEdit,
}: {
  onSave?: () => void
  saving?: boolean
  saveDisabled?: boolean
  editing: boolean
  onToggleEdit: () => void
}) {
  if (!onSave) {
    return null
  }

  return (
    <div className="blueprint-doc-toolbar">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={saveDisabled || saving}
        onClick={onSave}
        className="h-7 px-2.5 text-xs shadow-none backdrop-blur-sm"
      >
        {saving ? "Saving…" : "Save"}
      </Button>
      <button
        type="button"
        aria-label={editing ? "Exit edit mode" : "Edit document"}
        title={editing ? "Done editing" : "Edit"}
        onClick={onToggleEdit}
        className={cn(
          "blueprint-doc-edit-btn",
          editing && "blueprint-doc-edit-btn-active"
        )}
      >
        <PencilIcon className="size-3.5" />
      </button>
    </div>
  )
}

export function BlueprintDocEmptyState() {
  return (
    <div className="flex h-full min-h-[280px] items-center justify-center px-6">
      <p className="max-w-sm text-center text-sm text-muted-foreground">
        Generated blueprints appear here.
      </p>
    </div>
  )
}

export function BlueprintDocLoadingState() {
  return (
    <div className="flex h-full min-h-[280px] items-center justify-center px-6">
      <p className="text-sm text-muted-foreground">Drafting document…</p>
    </div>
  )
}
