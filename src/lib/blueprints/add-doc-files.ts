import type { BlueprintAttachment } from "@/lib/blueprints/project-context.types"

export const BLUEPRINT_DOC_ACCEPT =
  ".pdf,.doc,.docx,.txt,.md,.markdown,.json,.yaml,.yml,.csv,image/*"

export function filesToBlueprintAttachments(
  files: FileList | null
): BlueprintAttachment[] {
  if (!files?.length) return []

  return Array.from(files).map((file) => ({
    id: `file-${file.name}-${file.lastModified}`,
    kind: /\.(md|markdown|txt)$/i.test(file.name) ? "skill" : "file",
    file,
    label: file.name,
  }))
}
