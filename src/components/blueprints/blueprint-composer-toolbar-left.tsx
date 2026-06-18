"use client"

import * as React from "react"
import { CheckIcon, FolderOpenIcon, LibraryIcon } from "lucide-react"

import { AssistantWorkflowModal } from "@/components/blueprints/assistant-workflow-modal"
import { BlueprintAddDocButton } from "@/components/blueprints/blueprint-add-doc-button"
import { SelectGitHubProjectModal } from "@/components/blueprints/select-github-project-modal"
import type { Workflow } from "@/lib/assistant/types"
import { cn } from "@/lib/utils"

type BlueprintComposerToolbarLeftProps = {
  disabled?: boolean
  hideLabel?: boolean
  repoEnabled: boolean
  selectedCount: number
  selectedWorkflow: Workflow | null
  onAttachFiles: Parameters<typeof BlueprintAddDocButton>[0]["onAttachFiles"]
  onSelectGitHubProject: (fullName: string) => void
  onWorkflowSelect: (workflow: Workflow | null) => void
}

export function BlueprintComposerToolbarLeft({
  disabled = false,
  hideLabel = false,
  repoEnabled,
  selectedCount,
  selectedWorkflow,
  onAttachFiles,
  onSelectGitHubProject,
  onWorkflowSelect,
}: BlueprintComposerToolbarLeftProps) {
  const [workflowOpen, setWorkflowOpen] = React.useState(false)
  const [projectOpen, setProjectOpen] = React.useState(false)

  return (
    <>
      <div className="blueprint-composer-controls-left">
        <BlueprintAddDocButton
          disabled={disabled}
          hideLabel={hideLabel}
          selectedCount={selectedCount}
          onAttachFiles={onAttachFiles}
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

        <button
          type="button"
          disabled={disabled}
          onClick={() => setProjectOpen(true)}
          aria-label="Add GitHub project"
          className={cn("blueprint-composer-action", repoEnabled && "has-selection")}
        >
          {repoEnabled ? (
            <CheckIcon className="size-3.5 shrink-0" />
          ) : (
            <FolderOpenIcon className="size-3.5 shrink-0" />
          )}
          <span className={hideLabel ? "sr-only" : undefined}>Projects</span>
        </button>
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

      <SelectGitHubProjectModal
        open={projectOpen}
        onClose={() => setProjectOpen(false)}
        onSelect={onSelectGitHubProject}
      />
    </>
  )
}
