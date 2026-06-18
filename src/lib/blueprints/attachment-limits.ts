export const ATTACHMENT_TEXT_PER_FILE = 8_000
export const ATTACHMENT_TEXT_TOTAL = 24_000

/** @deprecated Use resolveAttachmentOnlyPrompt from workflow-prompt.ts */
export const ATTACHMENT_ONLY_USER_PROMPT =
  "Review the attached file(s). Summarize the main points and highlight anything I should act on."

export function truncateAttachmentText(text: string, max: number) {
  if (text.length <= max) {
    return text
  }

  return `${text.slice(0, max - 1)}…`
}
