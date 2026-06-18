"use client"

import * as React from "react"

import { BlueprintComposerSend } from "@/components/blueprints/blueprint-composer-send"
import { BlueprintComposerToolbarLeft } from "@/components/blueprints/blueprint-composer-toolbar-left"
import { BlueprintContextChips } from "@/components/blueprints/blueprint-context-chips"
import { BlueprintModelToggle } from "@/components/blueprints/blueprint-model-toggle"
import { BlueprintWorkflowChip } from "@/components/blueprints/blueprint-workflow-chip"
import type { BlueprintComposerProps } from "@/components/blueprints/blueprint-composer.types"
import {
  useBlueprintComposerTextarea,
  useCompactComposerControls,
} from "@/components/blueprints/use-blueprint-composer-controls"
import { cn } from "@/lib/utils"

export type { BlueprintComposerProps } from "@/components/blueprints/blueprint-composer.types"

export function BlueprintComposer({
  input,
  generating,
  projectContext,
  textareaRef,
  modelId,
  apiKeys,
  modelNotice,
  onModelChange,
  onInput,
  onKeyDown,
  onSubmit,
  onAttachFiles,
  onRemoveRepo,
  onRemoveAttachment,
  onSelectGitHubProject,
  selectedWorkflow = null,
  onWorkflowSelect,
  large = false,
}: BlueprintComposerProps) {
  const controlsRef = React.useRef<HTMLDivElement>(null)
  useBlueprintComposerTextarea(input, textareaRef)
  const compactControls = useCompactComposerControls(controlsRef)

  const hasChips =
    projectContext.repoEnabled ||
    projectContext.attachments.length > 0 ||
    Boolean(selectedWorkflow)
  const canSend =
    (input.trim().length > 0 || projectContext.attachments.length > 0) &&
    !generating

  return (
    <div className={cn("blueprint-composer w-full", large && "blueprint-composer-large")}>
      <div className="blueprint-composer-card">
        {hasChips ? (
          <div className="blueprint-composer-chips flex flex-wrap gap-2">
            {selectedWorkflow && onWorkflowSelect ? (
              <BlueprintWorkflowChip
                workflow={selectedWorkflow}
                disabled={generating}
                onRemove={() => onWorkflowSelect(null)}
              />
            ) : null}
            <BlueprintContextChips
              context={projectContext}
              disabled={generating}
              onRemoveRepo={onRemoveRepo}
              onRemoveAttachment={onRemoveAttachment}
            />
          </div>
        ) : null}

        <div className="blueprint-composer-input-wrap">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={onInput}
            onKeyDown={onKeyDown}
            placeholder="Write a message…"
            disabled={generating}
            rows={1}
            aria-label="Blueprint prompt"
            className="blueprint-composer-input"
          />
        </div>

        <div ref={controlsRef} className="blueprint-composer-controls">
          <BlueprintComposerToolbarLeft
            disabled={generating}
            hideLabel={compactControls}
            repoEnabled={projectContext.repoEnabled}
            selectedCount={projectContext.attachments.length}
            selectedWorkflow={selectedWorkflow}
            onAttachFiles={onAttachFiles}
            onSelectGitHubProject={onSelectGitHubProject}
            onWorkflowSelect={onWorkflowSelect ?? (() => {})}
          />
          <div className="blueprint-composer-controls-right">
            <BlueprintModelToggle
              value={modelId}
              onChange={onModelChange}
              apiKeys={apiKeys}
              disabled={generating}
            />
            <BlueprintComposerSend disabled={!canSend} onClick={onSubmit} />
          </div>
        </div>
      </div>
      {modelNotice ? (
        <p className="blueprint-composer-notice">{modelNotice}</p>
      ) : null}
    </div>
  )
}
