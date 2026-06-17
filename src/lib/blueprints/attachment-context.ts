import type { BlueprintAttachment } from "@/lib/blueprints/project-context.types"

const TEXT_TYPES = new Set([
  "text/plain",
  "text/markdown",
  "application/json",
  "text/yaml",
  "text/x-yaml",
])

function isTextLike(file: File) {
  if (TEXT_TYPES.has(file.type)) {
    return true
  }

  return /\.(md|markdown|txt|json|ya?ml|ts|tsx|js|jsx|py|sql)$/i.test(file.name)
}

function truncate(text: string, max: number) {
  if (text.length <= max) {
    return text
  }

  return `${text.slice(0, max - 1)}…`
}

export async function buildAttachmentContextBlock(
  attachments: BlueprintAttachment[]
): Promise<string | null> {
  if (!attachments.length) {
    return null
  }

  const parts: string[] = []

  for (const attachment of attachments) {
    if (isTextLike(attachment.file)) {
      try {
        const raw = await attachment.file.text()
        parts.push(
          `File: ${attachment.label}\n${truncate(raw.trim(), 2400)}`
        )
        continue
      } catch {
        parts.push(`File: ${attachment.label} (could not read contents)`)
        continue
      }
    }

    parts.push(
      `File: ${attachment.label} (${attachment.file.type || "binary"} — contents not inlined)`
    )
  }

  return `USER ATTACHMENTS:\n${parts.join("\n\n")}`
}
