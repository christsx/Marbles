import { describe, expect, it } from "vitest"
import { PDFDocument } from "pdf-lib"

import { fieldRectPdf, fieldRectPx } from "../field-position"
import { sealSignaturesOnPdf } from "../seal-pdf"

const PAGE_W = 612
const PAGE_H = 792

async function makeBlankPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  doc.addPage([PAGE_W, PAGE_H])
  return doc.save()
}

describe("field-position", () => {
  it("converts percentages to top-left-origin pixels", () => {
    const r = fieldRectPx(
      { positionX: 10, positionY: 20, width: 30, height: 5 },
      PAGE_W,
      PAGE_H,
    )
    expect(r.x).toBeCloseTo(61.2)
    expect(r.y).toBeCloseTo(158.4)
    expect(r.width).toBeCloseTo(183.6)
    expect(r.height).toBeCloseTo(39.6)
  })

  it("flips y to pdf bottom-left origin", () => {
    const r = fieldRectPdf(
      { positionX: 10, positionY: 20, width: 30, height: 5 },
      PAGE_W,
      PAGE_H,
    )
    expect(r.y).toBeCloseTo(PAGE_H - 158.4 - 39.6)
  })
})

describe("seal-pdf", () => {
  it("stamps a typed signature and produces a valid, larger PDF", async () => {
    const original = await makeBlankPdf()
    const sealed = await sealSignaturesOnPdf(original, [
      {
        page: 1,
        field: { positionX: 10, positionY: 20, width: 30, height: 5 },
        typedText: "Chris Test",
      },
    ])
    expect(sealed.length).toBeGreaterThan(original.length)
    const reloaded = await PDFDocument.load(sealed)
    expect(reloaded.getPageCount()).toBe(1)
  })

  it("stamps an image (drawn) signature", async () => {
    const original = await makeBlankPdf()
    const png =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    const sealed = await sealSignaturesOnPdf(original, [
      {
        page: 1,
        field: { positionX: 50, positionY: 50, width: 20, height: 6 },
        imageBase64: png,
      },
    ])
    const reloaded = await PDFDocument.load(sealed)
    expect(reloaded.getPageCount()).toBe(1)
  })

  it("ignores signatures on out-of-range pages without crashing", async () => {
    const original = await makeBlankPdf()
    const sealed = await sealSignaturesOnPdf(original, [
      {
        page: 99,
        field: { positionX: 10, positionY: 10, width: 20, height: 5 },
        typedText: "No page",
      },
    ])
    const reloaded = await PDFDocument.load(sealed)
    expect(reloaded.getPageCount()).toBe(1)
  })
})
