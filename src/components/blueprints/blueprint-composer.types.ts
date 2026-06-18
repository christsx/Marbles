import type * as React from "react"

import type { ApiKeyState } from "@/lib/ai/model-availability"
import type { Workflow } from "@/lib/assistant/types"
import type { BlueprintProjectContext } from "@/lib/blueprints/project-context.types"

export type BlueprintComposerProps = {
  input: string
  generating: boolean
  projectContext: BlueprintProjectContext
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  modelId: string
  apiKeys?: ApiKeyState
  modelNotice?: string | null
  onModelChange: (modelId: string) => void
  onInput: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onSubmit: () => void
  onAttachFiles: (files: BlueprintProjectContext["attachments"]) => void
  onRemoveRepo: () => void
  onRemoveAttachment: (id: string) => void
  onSelectGitHubProject: (fullName: string) => void
  selectedWorkflow?: Workflow | null
  onWorkflowSelect?: (workflow: Workflow | null) => void
  large?: boolean
}
