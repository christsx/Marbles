import {
  ATTACHMENT_TEXT_PER_FILE,
  ATTACHMENT_TEXT_TOTAL,
  truncateAttachmentText,
} from "@/lib/blueprints/attachment-limits"

export type ExtractedAttachmentPart = {
  label: string
  text: string | null
  note?: string
}

export function formatAttachmentContextBlock(
  parts: ExtractedAttachmentPart[]
): string | null {
  if (!parts.length) {
    return null
  }

  let budget = ATTACHMENT_TEXT_TOTAL
  const lines: string[] = []

  for (const part of parts) {
    if (part.text?.trim()) {
      const slice = truncateAttachmentText(
        part.text.trim(),
        Math.min(ATTACHMENT_TEXT_PER_FILE, budget)
      )
      budget -= slice.length
      lines.push(`File: ${part.label}\n${slice}`)
      continue
    }

    lines.push(
      `File: ${part.label} (${part.note ?? "contents could not be extracted"})`
    )
  }

  return `USER ATTACHMENTS (ground answers in these when relevant):\n${lines.join("\n\n")}`
}
