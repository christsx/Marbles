"use client"

import * as React from "react"

import type { Workflow } from "@/lib/assistant/types"
import type { BlueprintComposerProps } from "@/components/blueprints/blueprint-composer.types"
import {
  useBlueprintModelKeys,
  useBlueprintSelectedModel,
} from "@/components/blueprints/use-blueprint-selected-model"
import { useBlueprintProjectContext } from "@/components/blueprints/use-blueprint-project-context"
import { useWorkspaceDefaultRepo } from "@/components/blueprints/use-workspace-active-repo"
import { isModelAvailable } from "@/lib/ai/model-availability"
import { resolveAttachmentOnlyPrompt } from "@/lib/blueprints/workflow-prompt"
import { getStudioTemplate } from "@/lib/blueprints/studio-templates"
import type { BlueprintProjectContext } from "@/lib/blueprints/project-context.types"

type UseBlueprintAgentComposerOptions = {
  generating: boolean
  activeTemplateId?: string | null
  onApplyTemplate?: (templateId: string) => void
  onSend: (
    message: string,
    context: BlueprintProjectContext,
    modelId: string,
    options?: { workflowId?: string | null }
  ) => void
}

export function useBlueprintAgentComposer({
  generating,
  activeTemplateId = null,
  onApplyTemplate,
  onSend,
}: UseBlueprintAgentComposerOptions) {
  const [input, setInput] = React.useState("")
  const [modelNotice, setModelNotice] = React.useState<string | null>(null)
  const [selectedWorkflow, setSelectedWorkflow] = React.useState<Workflow | null>(null)
  const [modelId, setModelId] = useBlueprintSelectedModel()
  const apiKeys = useBlueprintModelKeys()
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const {
    projectContext,
    setWorkspaceDefaultRepo,
    selectGitHubProject,
    attachFiles,
    removeRepo,
    removeAttachment,
    clearAttachments,
  } = useBlueprintProjectContext()

  useWorkspaceDefaultRepo(setWorkspaceDefaultRepo)

  const submit = React.useCallback(
    (value?: string) => {
      const templateId = selectedWorkflow?.id ?? activeTemplateId
      const text =
        (value ?? input).trim() ||
        (projectContext.attachments.length > 0
          ? resolveAttachmentOnlyPrompt(templateId)
          : "")
      if (
        (!text && projectContext.attachments.length === 0) ||
        generating
      ) {
        return
      }

      if (apiKeys && !isModelAvailable(modelId, apiKeys)) {
        setModelNotice("Add GROQ_API_KEY to .env.local to use Groq models.")
        return
      }

      setModelNotice(null)
      onSend(text, projectContext, modelId, {
        workflowId: templateId ?? null,
      })
      setInput("")
      setSelectedWorkflow(null)
      clearAttachments()
      if (textareaRef.current) textareaRef.current.style.height = ""
    },
    [
      activeTemplateId,
      apiKeys,
      clearAttachments,
      generating,
      input,
      modelId,
      onSend,
      projectContext,
      selectedWorkflow?.id,
    ]
  )

  const handleWorkflowSelect = React.useCallback(
    (workflow: Workflow | null) => {
      setSelectedWorkflow(workflow)

      if (!workflow) {
        return
      }

      const template = getStudioTemplate(workflow.id)

      if (!template) {
        return
      }

      if (!template.allowRepo) {
        removeRepo()
      }

      onApplyTemplate?.(workflow.id)
    },
    [onApplyTemplate, removeRepo]
  )

  const composerProps: BlueprintComposerProps = {
    input,
    generating,
    projectContext,
    textareaRef,
    modelId,
    apiKeys,
    modelNotice,
    onModelChange: setModelId,
    onInput: (event) => setInput(event.target.value),
    onKeyDown: (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        submit()
      }
    },
    onSubmit: () => submit(),
    onAttachFiles: attachFiles,
    onRemoveRepo: removeRepo,
    onRemoveAttachment: removeAttachment,
    onSelectGitHubProject: selectGitHubProject,
    selectedWorkflow,
    onWorkflowSelect: handleWorkflowSelect,
  }

  return { composerProps, projectContext, modelId }
}
