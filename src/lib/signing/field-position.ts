export type FieldPosition = {
  positionX: number
  positionY: number
  width: number
  height: number
}

export type SigningField = {
  id: string
  page: number
  field: FieldPosition
  label?: string
}

export type PixelRect = {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Convert a field's percentage-based position into pixels, using a
 * TOP-LEFT origin (matching CSS / browser overlays).
 *
 * Percentages are 0-100 relative to the page dimensions. This is the same
 * convention Documenso uses (see insert-field-in-pdf-v1.ts).
 */
export function fieldRectPx(
  field: FieldPosition,
  pageWidth: number,
  pageHeight: number,
): PixelRect {
  return {
    x: pageWidth * (field.positionX / 100),
    y: pageHeight * (field.positionY / 100),
    width: pageWidth * (field.width / 100),
    height: pageHeight * (field.height / 100),
  }
}

/**
 * Same conversion, but returns coordinates in PDF space (BOTTOM-LEFT origin),
 * which is what pdf-lib's drawImage / drawText expect. Flips Y.
 */
export function fieldRectPdf(
  field: FieldPosition,
  pageWidth: number,
  pageHeight: number,
): PixelRect {
  const rect = fieldRectPx(field, pageWidth, pageHeight)
  return {
    ...rect,
    y: pageHeight - rect.y - rect.height,
  }
}
