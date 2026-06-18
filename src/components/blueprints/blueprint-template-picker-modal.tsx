"use client"

import * as React from "react"

import { TemplatePickerGroup } from "@/components/blueprints/template-picker-group"
import type { Workflow } from "@/lib/assistant/types"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  listStudioTemplateWorkflows,
  studioTemplatesByCategory,
  templateToWorkflow,
} from "@/lib/blueprints/studio-templates"
import { cn } from "@/lib/utils"

type BlueprintTemplatePickerModalProps = {
  open: boolean
  onClose: () => void
  onSelect: (workflow: Workflow) => Promise<void> | void
  initialWorkflowId?: string | null
}

export function BlueprintTemplatePickerModal({
  open,
  onClose,
  onSelect,
  initialWorkflowId,
}: BlueprintTemplatePickerModalProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(
    initialWorkflowId ?? null
  )
  const [submitting, setSubmitting] = React.useState(false)

  const workflows = React.useMemo(() => listStudioTemplateWorkflows(), [])
  const clientWorkflows = React.useMemo(
    () => studioTemplatesByCategory("client").map(templateToWorkflow),
    []
  )
  const internalWorkflows = React.useMemo(
    () => studioTemplatesByCategory("internal").map(templateToWorkflow),
    []
  )

  React.useEffect(() => {
    if (!open) return
    setSelectedId(initialWorkflowId ?? null)
  }, [initialWorkflowId, open])

  async function handleConfirm() {
    const workflow = workflows.find((item) => item.id === selectedId)
    if (!workflow) return

    setSubmitting(true)
    try {
      await onSelect(workflow)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        className="blueprint-template-modal gap-0 p-0 sm:max-w-lg"
        aria-describedby={undefined}
      >
        <div className="shrink-0 px-5 py-4 pr-12">
          <DialogTitle className="text-base font-semibold">Templates</DialogTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Opens a pre-filled doc on the right. Use chat to fill sections from a brief.
          </p>
        </div>

        <div className="blueprint-template-modal-scroll min-h-0 flex-1 overflow-y-auto px-5">
          <div className="space-y-5 pb-4">
            <TemplatePickerGroup
              label="Client"
              workflows={clientWorkflows}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
            <TemplatePickerGroup
              label="Internal"
              workflows={internalWorkflows}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </div>

        <div className="blueprint-template-modal-footer shrink-0 px-5 pb-8 pt-4">
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={!selectedId || submitting}
            className={cn(
              "blueprint-template-use-button",
              (!selectedId || submitting) && "is-disabled"
            )}
          >
            {submitting ? "Applying…" : "Use template"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
