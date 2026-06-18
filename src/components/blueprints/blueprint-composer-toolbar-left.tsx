"use client"

import * as React from "react"
import { CheckIcon, FolderOpenIcon, LibraryIcon } from "lucide-react"

import { AssistantWorkflowModal } from "@/components/blueprints/assistant-workflow-modal"
import { BlueprintAddDocButton } from "@/components/blueprints/blueprint-add-doc-button"
import type { Workflow } from "@/lib/assistant/types"
import { cn } from "@/lib/utils"

type BlueprintComposerToolbarLeftProps = {
  disabled?: boolean
  hideLabel?: boolean
  repoEnabled: boolean
  selectedCount: number
  selectedWorkflow: Workflow | null
  onAttachFiles: Parameters<typeof BlueprintAddDocButton>[0]["onAttachFiles"]
  onToggleRepo: () => void
  onProjectsClick?: () => void
  onWorkflowSelect: (workflow: Workflow | null) => void
}

export function BlueprintComposerToolbarLeft({
  disabled = false,
  hideLabel = false,
  repoEnabled,
  selectedCount,
  selectedWorkflow,
  onAttachFiles,
  onToggleRepo,
  onProjectsClick,
  onWorkflowSelect,
}: BlueprintComposerToolbarLeftProps) {
  const [workflowOpen, setWorkflowOpen] = React.useState(false)

  return (
    <>
      <div className="blueprint-composer-controls-left">
        <BlueprintAddDocButton
          disabled={disabled}
          hideLabel={hideLabel}
          repoEnabled={repoEnabled}
          selectedCount={selectedCount}
          onAttachFiles={onAttachFiles}
          onToggleRepo={onToggleRepo}
        />

        <button
          type="button"
          disabled={disabled}
          onClick={() => setWorkflowOpen(true)}
          aria-label="Open workflows"
          className={cn(
            "blueprint-composer-action",
            selectedWorkflow && "has-selection"
          )}
        >
          {selectedWorkflow ? (
            <CheckIcon className="size-3.5 shrink-0" />
          ) : (
            <LibraryIcon className="size-3.5 shrink-0" />
          )}
          <span className={hideLabel ? "sr-only" : undefined}>Workflows</span>
        </button>

        {onProjectsClick ? (
          <button
            type="button"
            disabled={disabled}
            onClick={onProjectsClick}
            aria-label="Open projects"
            className="blueprint-composer-action"
          >
            <FolderOpenIcon className="size-3.5 shrink-0" />
            <span className={hideLabel ? "sr-only" : undefined}>Projects</span>
          </button>
        ) : null}
      </div>

      <AssistantWorkflowModal
        open={workflowOpen}
        onClose={() => setWorkflowOpen(false)}
        onSelect={(workflow) => {
          onWorkflowSelect(workflow)
          setWorkflowOpen(false)
        }}
        initialWorkflowId={selectedWorkflow?.id}
      />
    </>
  )
}
