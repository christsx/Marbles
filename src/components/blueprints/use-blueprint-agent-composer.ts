"use client"

import * as React from "react"

import type { Workflow } from "@/lib/assistant/types"
import type { BlueprintComposerProps } from "@/components/blueprints/blueprint-composer.types"
import {
  useBlueprintModelKeys,
  useBlueprintSelectedModel,
} from "@/components/blueprints/use-blueprint-selected-model"
import { useBlueprintProjectContext } from "@/components/blueprints/use-blueprint-project-context"
import { isModelAvailable } from "@/lib/ai/model-availability"
import type { BlueprintProjectContext } from "@/lib/blueprints/project-context.types"

type UseBlueprintAgentComposerOptions = {
  generating: boolean
  onSend: (
    message: string,
    context: BlueprintProjectContext,
    modelId: string
  ) => void
}

export function useBlueprintAgentComposer({
  generating,
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
    toggleRepo,
    attachFiles,
    removeRepo,
    removeAttachment,
    clearAttachments,
  } = useBlueprintProjectContext()

  const submit = React.useCallback(
    (value?: string) => {
      const text = (value ?? input).trim()
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
      onSend(text, projectContext, modelId)
      setInput("")
      setSelectedWorkflow(null)
      clearAttachments()
      if (textareaRef.current) textareaRef.current.style.height = ""
    },
    [
      apiKeys,
      clearAttachments,
      generating,
      input,
      modelId,
      onSend,
      projectContext,
    ]
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
    onToggleRepo: () => void toggleRepo(),
    onRemoveRepo: removeRepo,
    onRemoveAttachment: removeAttachment,
    selectedWorkflow,
    onWorkflowSelect: setSelectedWorkflow,
  }

  return { composerProps, projectContext, modelId }
}
