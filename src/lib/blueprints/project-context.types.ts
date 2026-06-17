export type BlueprintAttachmentKind = "file" | "skill"

export type BlueprintAttachment = {
  id: string
  kind: BlueprintAttachmentKind
  file: File
  label: string
}

export type BlueprintProjectContext = {
  repoEnabled: boolean
  activeRepo: string | null
  attachments: BlueprintAttachment[]
}

export const emptyProjectContext = (): BlueprintProjectContext => ({
  repoEnabled: false,
  activeRepo: null,
  attachments: [],
})
