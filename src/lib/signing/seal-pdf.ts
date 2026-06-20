import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

import { fieldRectPdf, type FieldPosition } from "./field-position"

export type SealSignature = {
  /** 1-indexed page number */
  page: number
  field: FieldPosition
  /** Drawn or uploaded signature, as a base64 PNG (with or without data: prefix). */
  imageBase64?: string | null
  /** Typed signature text (used when no image). */
  typedText?: string | null
}

function base64ToUint8(base64: string): Uint8Array {
  const raw = base64.includes(",") ? (base64.split(",")[1] ?? "") : base64
  const bin =
    typeof atob !== "undefined"
      ? atob(raw)
      : Buffer.from(raw, "base64").toString("binary")
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

/**
 * Stamps signature values onto a PDF at their percentage-based field
 * positions, then returns the new PDF bytes. This is the core of the
 * "seal" step (without the cryptographic PKCS#7 signature, which is a
 * later layer). Mirrors Documenso's insert-field-in-pdf-v1.ts.
 *
 * Drawn/uploaded signatures (PNG) are scaled to fit the field box with
 * preserved aspect ratio; typed signatures are drawn in a bold font and
 * shrunk to fit the box width.
 */
export async function sealSignaturesOnPdf(
  pdfBytes: Uint8Array,
  signatures: SealSignature[],
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes)
  const font = await doc.embedFont(StandardFonts.HelveticaBold)
  const pages = doc.getPages()

  for (const sig of signatures) {
    const page = pages[sig.page - 1]
    if (!page) continue

    const { width: pageWidth, height: pageHeight } = page.getSize()
    const rect = fieldRectPdf(sig.field, pageWidth, pageHeight)

    if (sig.imageBase64) {
      const image = await doc.embedPng(base64ToUint8(sig.imageBase64))
      const scale = Math.min(
        rect.width / image.width,
        rect.height / image.height,
      )
      const drawWidth = image.width * scale
      const drawHeight = image.height * scale
      page.drawImage(image, {
        x: rect.x,
        y: rect.y + (rect.height - drawHeight) / 2,
        width: drawWidth,
        height: drawHeight,
      })
    } else if (sig.typedText) {
      let size = Math.min(rect.height * 0.7, 24)
      while (
        size > 6 &&
        font.widthOfTextAtSize(sig.typedText, size) > rect.width
      ) {
        size -= 1
      }
      page.drawText(sig.typedText, {
        x: rect.x,
        y: rect.y + rect.height * 0.25,
        size,
        font,
        color: rgb(0, 0, 0),
      })
    }
  }

  return doc.save()
}
