export type BlueprintAttachmentKind = "file" | "skill"

export type BlueprintAttachment = {
  id: string
  kind: BlueprintAttachmentKind
  file: File
  label: string
}

export type BlueprintProjectContext = {
  /** Repo context is sent to the LLM only when true. */
  repoEnabled: boolean
  activeRepo: string | null
  /** Workspace default from Integrations — pre-selects Projects, not auto-attached. */
  workspaceDefaultRepo: string | null
  attachments: BlueprintAttachment[]
}

export const emptyProjectContext = (): BlueprintProjectContext => ({
  repoEnabled: false,
  activeRepo: null,
  workspaceDefaultRepo: null,
  attachments: [],
})

export function repoContextIsActive(context: BlueprintProjectContext) {
  return context.repoEnabled && Boolean(context.activeRepo)
}
