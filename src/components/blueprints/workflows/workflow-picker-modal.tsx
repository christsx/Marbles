"use client"

import * as React from "react"

import { Modal } from "@/components/blueprints/shared/modal"
import type { Workflow, WorkflowType } from "@/lib/assistant/types"
import { playbooks } from "@/lib/playbooks"
import { cn } from "@/lib/utils"

type WorkflowPickerModalProps = {
  open: boolean
  onClose: () => void
  onSelect: (workflow: Workflow) => Promise<void> | void
  workflowType: WorkflowType
  breadcrumbs: string[]
  primaryLabel?: string
  initialWorkflowId?: string
}

export function WorkflowPickerModal({
  open,
  onClose,
  onSelect,
  workflowType,
  breadcrumbs,
  primaryLabel = "Use",
  initialWorkflowId,
}: WorkflowPickerModalProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(
    initialWorkflowId ?? null
  )
  const [submitting, setSubmitting] = React.useState(false)

  const workflows = React.useMemo<Workflow[]>(() => {
    void workflowType
    return playbooks.map((playbook) => ({
      id: playbook.slug,
      title: playbook.title,
      description: playbook.summary,
    }))
  }, [workflowType])

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
    <Modal
      open={open}
      onClose={onClose}
      breadcrumbs={breadcrumbs}
      primaryAction={{
        label: submitting ? "Applying…" : primaryLabel,
        onClick: () => void handleConfirm(),
        disabled: !selectedId || submitting,
      }}
    >
      <div className="space-y-2">
        {workflows.map((workflow) => {
          const selected = workflow.id === selectedId
          return (
            <button
              key={workflow.id}
              type="button"
              onClick={() => setSelectedId(workflow.id)}
              className={cn(
                "w-full rounded-xl border px-4 py-3 text-left transition-colors",
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/40"
              )}
            >
              <p className="text-sm font-medium">{workflow.title}</p>
              {workflow.description ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {workflow.description}
                </p>
              ) : null}
            </button>
          )
        })}
      </div>
    </Modal>
  )
}
