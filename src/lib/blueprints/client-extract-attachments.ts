import { buildAttachmentContextBlock } from "@/lib/blueprints/attachment-context"
import type { BlueprintAttachment } from "@/lib/blueprints/project-context.types"

export async function extractAttachmentsForChat(
  attachments: BlueprintAttachment[]
): Promise<string | null> {
  if (!attachments.length) {
    return null
  }

  const formData = new FormData()

  for (const attachment of attachments) {
    formData.append("files", attachment.file, attachment.label)
  }

  try {
    const response = await fetch("/api/blueprints/attachments/extract", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null
      throw new Error(payload?.message ?? "Could not read attached files.")
    }

    const payload = (await response.json()) as { context?: string | null }
    return payload.context ?? null
  } catch (error) {
    console.warn("Attachment extract API failed, using text fallback:", error)
    return buildAttachmentContextBlock(attachments)
  }
}
