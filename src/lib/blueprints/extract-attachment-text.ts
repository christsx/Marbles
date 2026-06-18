import mammoth from "mammoth"
import { PDFParse } from "pdf-parse"

const TEXT_EXT =
  /\.(md|markdown|txt|json|ya?ml|ts|tsx|js|jsx|py|sql|html?|csv)$/i

function kindFor(name: string, mime: string) {
  const lower = name.toLowerCase()

  if (mime === "application/pdf" || lower.endsWith(".pdf")) return "pdf"
  if (
    mime.includes("wordprocessingml") ||
    lower.endsWith(".docx")
  ) {
    return "docx"
  }
  if (lower.endsWith(".doc")) return "doc"
  if (mime.startsWith("text/") || TEXT_EXT.test(name)) return "text"
  if (mime.startsWith("image/")) return "image"

  return "binary"
}

export async function extractAttachmentText(
  buffer: Buffer,
  name: string,
  mime: string
): Promise<{ text: string | null; note?: string }> {
  const kind = kindFor(name, mime)

  if (kind === "text") {
    return { text: buffer.toString("utf-8") }
  }

  if (kind === "pdf") {
    const parser = new PDFParse({ data: buffer })
    try {
      const result = await parser.getText()
      const text = result.text?.trim() ?? ""
      if (!text) {
        return { text: null, note: "PDF had no extractable text" }
      }
      return { text }
    } finally {
      await parser.destroy()
    }
  }

  if (kind === "docx") {
    const result = await mammoth.extractRawText({ buffer })
    const text = result.value?.trim() ?? ""
    if (!text) {
      return { text: null, note: "DOCX had no extractable text" }
    }
    return { text }
  }

  if (kind === "doc") {
    return {
      text: null,
      note: "legacy .doc not supported; save as .docx or PDF",
    }
  }

  if (kind === "image") {
    return {
      text: null,
      note: "image not inlined; ask about visible text or attach a text/PDF export",
    }
  }

  return { text: null, note: `${mime || "binary"} not supported for inline text` }
}
