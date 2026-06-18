"use client"

import { BlueprintAddDocButton } from "@/components/blueprints/blueprint-add-doc-button"
import { BlueprintProjectsButton } from "@/components/blueprints/blueprint-projects-button"
import { BlueprintTemplatesButton } from "@/components/blueprints/blueprint-templates-button"
import type { Workflow } from "@/lib/assistant/types"

type BlueprintComposerToolbarLeftProps = {
  disabled?: boolean
  hideLabel?: boolean
  repoEnabled: boolean
  activeRepo: string | null
  workspaceDefaultRepo: string | null
  selectedCount: number
  selectedWorkflow: Workflow | null
  onAttachFiles: Parameters<typeof BlueprintAddDocButton>[0]["onAttachFiles"]
  onSelectGitHubProject: (fullName: string) => void
  onWorkflowSelect: (workflow: Workflow) => void
}

export function BlueprintComposerToolbarLeft({
  disabled = false,
  hideLabel = false,
  repoEnabled,
  activeRepo,
  workspaceDefaultRepo,
  selectedCount,
  selectedWorkflow,
  onAttachFiles,
  onSelectGitHubProject,
  onWorkflowSelect,
}: BlueprintComposerToolbarLeftProps) {
  return (
    <div className="blueprint-composer-controls-left">
      <BlueprintAddDocButton
        disabled={disabled}
        hideLabel={hideLabel}
        selectedCount={selectedCount}
        onAttachFiles={onAttachFiles}
      />

      <BlueprintTemplatesButton
        disabled={disabled}
        hideLabel={hideLabel}
        selectedWorkflow={selectedWorkflow}
        onSelect={onWorkflowSelect}
      />

      <BlueprintProjectsButton
        disabled={disabled}
        hideLabel={hideLabel}
        repoEnabled={repoEnabled}
        activeRepo={activeRepo}
        workspaceDefaultRepo={workspaceDefaultRepo}
        onSelect={onSelectGitHubProject}
      />
    </div>
  )
}
