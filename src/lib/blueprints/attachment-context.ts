import {
  truncateAttachmentText,
  ATTACHMENT_TEXT_PER_FILE,
} from "@/lib/blueprints/attachment-limits"
import { formatAttachmentContextBlock } from "@/lib/blueprints/format-attachment-context"
import type { BlueprintAttachment } from "@/lib/blueprints/project-context.types"

const TEXT_TYPES = new Set([
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/json",
  "text/yaml",
  "text/x-yaml",
  "text/html",
])

function isTextLike(file: File) {
  if (TEXT_TYPES.has(file.type)) {
    return true
  }

  return /\.(md|markdown|txt|json|ya?ml|ts|tsx|js|jsx|py|sql|html?|csv)$/i.test(
    file.name
  )
}

/** Client fallback when the extract API is unavailable. Text-like files only. */
export async function buildAttachmentContextBlock(
  attachments: BlueprintAttachment[]
): Promise<string | null> {
  if (!attachments.length) {
    return null
  }

  const parts = await Promise.all(
    attachments.map(async (attachment) => {
      if (!isTextLike(attachment.file)) {
        return {
          label: attachment.label,
          text: null,
          note: `${attachment.file.type || "binary"} needs server extraction (PDF/DOCX)`,
        }
      }

      try {
        const raw = await attachment.file.text()
        return {
          label: attachment.label,
          text: truncateAttachmentText(raw.trim(), ATTACHMENT_TEXT_PER_FILE),
        }
      } catch {
        return {
          label: attachment.label,
          text: null,
          note: "could not read contents",
        }
      }
    })
  )

  return formatAttachmentContextBlock(parts)
}
