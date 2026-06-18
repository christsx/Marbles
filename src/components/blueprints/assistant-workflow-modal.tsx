"use client"

import type { Workflow } from "@/lib/assistant/types"
import { WorkflowPickerModal } from "@/components/blueprints/workflows/workflow-picker-modal"

type AssistantWorkflowModalProps = {
  open: boolean
  onClose: () => void
  onSelect: (workflow: Workflow) => Promise<void> | void
  projectName?: string
  projectCmNumber?: string | null
  initialWorkflowId?: string
}

export function AssistantWorkflowModal({
  open,
  onClose,
  onSelect,
  projectName,
  projectCmNumber,
  initialWorkflowId,
}: AssistantWorkflowModalProps) {
  const breadcrumbs = projectName
    ? [
        "Projects",
        `${projectName}${projectCmNumber ? ` (#${projectCmNumber})` : ""}`,
        "Assistant",
        "Add workflow",
      ]
    : ["Assistant", "Add workflow"]

  return (
    <WorkflowPickerModal
      open={open}
      onClose={onClose}
      onSelect={onSelect}
      workflowType="assistant"
      breadcrumbs={breadcrumbs}
      primaryLabel="Use"
      initialWorkflowId={initialWorkflowId}
    />
  )
}
